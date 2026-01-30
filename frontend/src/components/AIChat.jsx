import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config';

// Knowledge categories for quick access
const QUICK_QUESTIONS = [
  { category: '🔴 Marktpreise', questions: [
    'Was kostet eine Wohnung in München pro qm?',
    'Wie sind die Immobilienpreise in Hamburg?',
    'Was sind aktuelle Mietpreise in Berlin?',
    'Wie hat sich der Markt in Frankfurt entwickelt?'
  ]},
  { category: 'Finanzierung', questions: [
    'Was ist der Unterschied zwischen Zinsbindung und Laufzeit?',
    'Wie viel Eigenkapital brauche ich wirklich?',
    'Was bedeutet Annuität?',
    'Wann lohnt sich ein Forward-Darlehen?'
  ]},
  { category: 'Förderungen', questions: [
    'Welche KfW-Programme gibt es 2025?',
    'Was ist KfW 300 Wohneigentum für Familien?',
    'Wie funktioniert Jung kauft Alt?',
    'Welche Landesförderungen gibt es?'
  ]},
  { category: 'Steuern', questions: [
    'Wie funktioniert die AfA bei Vermietung?',
    'Was kann ich als Werbungskosten absetzen?',
    'Wann ist ein Immobilienverkauf steuerfrei?',
    'Was ist der Unterschied zwischen linearer und degressiver AfA?'
  ]},
  { category: 'Recht', questions: [
    'Wie funktioniert eine Mieterhöhung?',
    'Was ist die Mietpreisbremse?',
    'Welche Kündigungsfristen gelten?',
    'Was muss ich bei WEG beachten?'
  ]},
  { category: 'Bewertung', questions: [
    'Was ist ein guter Kaufpreisfaktor?',
    'Wie berechne ich die Bruttorendite?',
    'Was sind Red Flags beim Immobilienkauf?',
    'Wie bewerte ich eine Eigentumswohnung?'
  ]}
];

function AIChat({ analysisContext, isProjectSpecific = false }) {
  const { token } = useAuth();

  // Erstelle projektspezifische Begrüßung
  const getInitialMessage = () => {
    if (isProjectSpecific && analysisContext) {
      const stadt = analysisContext.stadt || 'unbekannt';
      const kaufpreis = analysisContext.kaufpreis ? `${(analysisContext.kaufpreis / 1000).toFixed(0)}k€` : 'unbekannt';
      const score = analysisContext.gesamtscore ? `${Math.round(analysisContext.gesamtscore)}/100` : '';

      return {
        role: 'assistant',
        content: `Ich bin Ihr Berater für **diese Immobilie** in ${stadt} (${kaufpreis})! 🏠\n\n` +
          (score ? `Aktueller Score: **${score}**\n\n` : '') +
          `Fragen Sie mich spezifisch zu diesem Objekt:\n` +
          `- "Ist der Preis angemessen?"\n` +
          `- "Wie kann ich den Cashflow verbessern?"\n` +
          `- "Welche Förderungen passen hier?"\n` +
          `- "Was sind die Risiken bei dieser Immobilie?"`
      };
    }
    return {
      role: 'assistant',
      content: 'Hallo! Ich bin Ihr **Immobilien-Experte** - Ihr Vorteil gegenüber 95% der Makler! 🏠\n\nIch helfe Ihnen bei **allem rund um Immobilien:**\n- Finanzierung & Eigenkapital-Strategien\n- KfW-Förderungen & Zuschüsse maximieren\n- Steuern, AfA & Abschreibungen\n- Rendite-Analyse & Cashflow-Berechnung\n- Mietrecht, WEG & Due Diligence\n- **Live-Marktpreise** für jede Stadt\n\nStellen Sie mir jede Frage - oder wählen Sie ein Thema unten!'
    };
  };

  const [messages, setMessages] = useState([getInitialMessage()]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [stadtInput, setStadtInput] = useState(analysisContext?.stadt || '');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question = input) => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Extrahiere Stadt aus der Frage wenn möglich
    const stadtMatch = question.match(/(?:in|für|nach)\s+([A-ZÄÖÜa-zäöüß-]+(?:\s+[A-ZÄÖÜa-zäöüß-]+)?)/i);
    const detectedStadt = stadtMatch ? stadtMatch[1] : stadtInput;

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: question,
          context: analysisContext || null,
          stadt: detectedStadt || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Zeige Info wenn Live-Daten verwendet wurden
        let responseText = data.response;
        if (data.marktdaten_verwendet) {
          responseText = `🔴 *Live-Daten für ${data.recherche_standort}*\n\n${responseText}`;
        }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: responseText,
          liveData: data.marktdaten_verwendet,
          standort: data.recherche_standort
        }]);
      } else {
        // Fallback to local knowledge base
        const localResponse = generateLocalResponse(question);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: localResponse
        }]);
      }
    } catch (error) {
      // Use local knowledge base if API fails
      const localResponse = generateLocalResponse(question);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: localResponse
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local knowledge base responses
  const generateLocalResponse = (question) => {
    const q = question.toLowerCase();

    if (q.includes('eigenkapital') || q.includes('ek')) {
      return `**Eigenkapital-Anforderungen:**

Die meisten Banken erwarten mindestens die **Kaufnebenkosten** (ca. 10-12%) als Eigenkapital.

**Szenarien:**
- **20%+ EK:** Beste Konditionen, 95% Bewilligungschance
- **10-20% EK:** Gute Konditionen, 80% Chance
- **Nur Nebenkosten (100% Finanzierung):** Möglich, aber höhere Zinsen (+0,2-0,5%)
- **110% Finanzierung (0€ EK):** Nur bei sehr guter Bonität, wenige Banken

**EK-Ersatz-Möglichkeiten:**
- Depot beleihen (Lombardkredit) - bis 70% beleihbar
- Lebensversicherung beleihen - bis 100% des Rückkaufswerts
- Wohn-Riester nutzen - 100% entnehmbar für Eigenheim
- Bausparvertrag - direktes Eigenkapital

**Tipp:** Mit 10% mehr EK sinkt der Zins oft um 0,1-0,2%!`;
    }

    if (q.includes('kfw') || q.includes('förderung')) {
      return `**KfW-Förderungen 2025:**

**KfW 300 - Wohneigentum für Familien:**
- Zinssatz: nur **1,12%** (Stand 10/2025)
- Kredit: 170.000€ - 270.000€ je nach Kinderzahl
- Einkommensgrenze: 90.000€ + 10.000€/Kind
- Ersparnis: 30.000-50.000€ gegenüber Bankkredit!

**KfW 308 - Jung kauft Alt:**
- Gleicher Zinsvorteil (1,12%)
- Für Bestandsimmobilien Energieklasse F/G/H
- Sanierungspflicht auf EH 85 EE in 54 Monaten
- Bis 150.000€ Kredit

**KfW 124 - Wohneigentumsprogramm:**
- Für JEDEN (keine Einkommensgrenzen!)
- Bis 100.000€ zu ca. 3,4-3,9%
- Über jede Hausbank beantragbar

**KfW 261/262 - Energetische Sanierung:**
- Bis 150.000€ Kredit
- Bis 67.500€ Tilgungszuschuss!
- Für Sanierung zum Effizienzhaus

**WICHTIG:** Antrag immer VOR Kaufvertrag stellen!`;
    }

    if (q.includes('afa') || q.includes('abschreibung')) {
      return `**AfA (Absetzung für Abnutzung):**

**AfA-Sätze nach Baujahr:**
- Ab 2023 gebaut: **3%** (33 Jahre)
- 1925-2022: **2%** (50 Jahre)
- Vor 1925: **2,5%** (40 Jahre)

**Degressive AfA (ab 2023):**
- 5% vom Restwert (statt linear)
- Lohnt sich bei hohen Gebäudewerten
- Kann zur linearen AfA wechseln

**Sonder-AfA §7b:**
- +5% zusätzlich in ersten 4 Jahren
- Nur für Neubau-Mietwohnungen
- Baukosten max. 5.200€/m²

**Denkmal-AfA:**
- 9% in 8 Jahren + 7% in 4 Jahren
- = 100% Abschreibung in 12 Jahren!
- Auch für Eigennutzer möglich (§10f)

**Kaufpreisaufteilung optimieren:**
Nur der GEBÄUDEANTEIL ist abschreibbar! BMF-Tool oft ungünstig.
➜ Eigenes Gutachten kann 30.000€+ mehr AfA bringen!`;
    }

    if (q.includes('kaufpreisfaktor') || q.includes('rendite') || q.includes('faktor')) {
      return `**Kaufpreisfaktor & Rendite:**

**Kaufpreisfaktor = Kaufpreis / Jahresmiete**

**Bewertung nach Region:**
| Faktor | Bewertung |
|--------|-----------|
| < 20 | 🟢 Sehr gut |
| 20-25 | 🟢 Gut |
| 25-30 | 🟡 Akzeptabel (A-Lagen) |
| > 30 | 🔴 Überteuert |

**Bruttorendite = (Jahresmiete / Kaufpreis) × 100**

Beispiel: 12.000€ Miete / 300.000€ = 4% Brutto

**Zielwerte nach Strategie:**
- Cash-Cow: > 5% Brutto
- Solide Anlage: 4-5%
- Wertsteigerung: 3-4% (A-Lagen)

**Nettomietrendite:**
Bruttorendite abzüglich nicht umlagefähiger Kosten (ca. 1-1,5%)

**Break-Even-Zins:**
Liegt der Kreditzins über der Nettomietrendite → negativer Cashflow!`;
    }

    if (q.includes('mieterhöhung') || q.includes('miete erhöhen')) {
      return `**Mieterhöhung nach §558 BGB:**

**Kappungsgrenze:**
- Max. 20% in 3 Jahren
- In 627 Gemeinden nur 15%!

**Voraussetzungen:**
- Miete unter ortsüblicher Vergleichsmiete
- Sperrfrist: 12 Monate zwischen Erhöhungen
- Begründung erforderlich

**Begründungsmöglichkeiten:**
1. Qualifizierter Mietspiegel
2. 3 Vergleichswohnungen
3. Sachverständigengutachten

**Modernisierungsumlage §559:**
- 8% der Modernisierungskosten/Jahr dauerhaft umlegen
- Kappung: Max. 2-3€/m² in 6 Jahren
- Nur echte Modernisierung, nicht Instandhaltung

**Beispiel:**
Modernisierung 30.000€ × 8% = 2.400€/Jahr = 200€/Monat mehr!`;
    }

    if (q.includes('red flag') || q.includes('warnung') || q.includes('aufpassen')) {
      return `**Red Flags beim Immobilienkauf:**

**🔴 FINGER WEG:**
- Zwangsversteigerungsvermerk im Grundbuch
- Nießbrauch oder Wohnrecht eingetragen
- Erhaltungsrücklage < 10€/m²
- Erbpacht mit < 30 Jahren Restlaufzeit
- Bleirohre (Austauschpflicht bis 01/2026!)

**🟠 VORSICHT:**
- Energieklasse F/G/H ohne KfW-Plan
- Hausgeld > 4€/m²
- Mehr als 40% nicht umlagefähig
- Gebäude > 30 Jahre ohne Sanierung
- Mehrheitseigentümer in WEG

**🟡 PRÜFEN:**
- Kein Mietspiegel verfügbar
- Miete unter Markt (Mieterhöhungspotenzial?)
- Beschlussanfechtungen in ETV-Protokollen
- Hohe Fluktuation bei Mietern
- Verwalter nicht zertifiziert (seit 06/2024 Pflicht)

**Due Diligence Pflichtunterlagen:**
- Teilungserklärung + Gemeinschaftsordnung
- ETV-Protokolle der letzten 3 Jahre
- Aktuelle Hausgeldabrechnung
- Grundbuchauszug (nicht älter als 3 Monate)`;
    }

    // Default response
    return `Ich kann Ihnen bei Fragen zu folgenden Themen helfen:

**💰 Finanzierung**
- Eigenkapital-Strategien
- Bankenvergleich & Verhandlung
- Zinsbindung & Tilgung

**🏦 Förderungen**
- KfW-Programme (300, 308, 124, 261)
- Landesförderungen
- Heizungsförderung

**📊 Steuern**
- AfA-Berechnung
- Werbungskosten
- Kaufpreisaufteilung

**⚖️ Recht**
- Mietrecht
- WEG-Recht
- Kündigungsschutz

Stellen Sie mir eine konkrete Frage oder wählen Sie eine der Schnellfragen!`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
            🤖
          </span>
          Immobilien-Berater AI
        </h3>
        <p className="text-text-muted text-sm mt-1">Fragen Sie mich alles zu Immobilien!</p>
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-b border-white/10 overflow-x-auto">
        <div className="flex gap-2">
          {QUICK_QUESTIONS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.category
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
        {activeCategory && (
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_QUESTIONS.find(c => c.category === activeCategory)?.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  handleSend(q);
                  setActiveCategory(null);
                }}
                className="text-xs px-3 py-1.5 bg-surface border border-white/20 rounded-lg text-text-secondary hover:text-white hover:border-neon-blue/50 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'glass-card border border-white/10'
              }`}
            >
              <div className={`text-sm whitespace-pre-line ${message.role === 'assistant' ? 'text-text-secondary' : ''}`}>
                {message.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line.startsWith('**') && line.endsWith('**') ? (
                      <strong className="text-white">{line.replace(/\*\*/g, '')}</strong>
                    ) : line.startsWith('- ') ? (
                      <span className="block ml-2">• {line.substring(2)}</span>
                    ) : line.startsWith('|') ? (
                      <span className="block font-mono text-xs">{line}</span>
                    ) : (
                      line
                    )}
                    {i < message.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card border border-white/10 p-4 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Stellen Sie eine Frage..."
            className="flex-1 px-4 py-3.5 md:py-3 min-h-[44px] bg-surface border border-white/10 rounded-xl focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue outline-none transition-all text-white placeholder-text-muted text-base"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-4 md:px-6 py-3.5 md:py-3 min-h-[44px] btn-neon rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:opacity-80"
          >
            <span className="relative z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
