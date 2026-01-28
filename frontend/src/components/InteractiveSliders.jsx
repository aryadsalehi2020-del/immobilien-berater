import React, { useState, useEffect, useCallback } from 'react';

function InteractiveSliders({ initialValues, kaufpreis, monatlicheMiete, nebenkosten, onValuesChange }) {
  const [values, setValues] = useState({
    eigenkapital: initialValues?.eigenkapital || 0,
    zinssatz: initialValues?.zinssatz || 3.75,
    tilgung: initialValues?.tilgung || 1.25
  });

  const [calculatedCashflow, setCalculatedCashflow] = useState(null);

  // Debounced calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateCashflow();
      if (onValuesChange) {
        onValuesChange(values);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [values]);

  const calculateCashflow = useCallback(() => {
    if (!kaufpreis || !monatlicheMiete) return;

    const finanzierungssumme = kaufpreis - values.eigenkapital;
    const jaehrlicheRate = finanzierungssumme * ((values.zinssatz + values.tilgung) / 100);
    const monatlicheRate = jaehrlicheRate / 12;
    const monatlichNK = nebenkosten || 0;

    const monatlichCashflow = monatlicheMiete - monatlicheRate - monatlichNK;
    const jaehrlichCashflow = monatlichCashflow * 12;

    setCalculatedCashflow({
      monatlich: monatlichCashflow,
      jaehrlich: jaehrlichCashflow,
      monatlicheRate,
      finanzierungssumme,
      selbsttragend: monatlichCashflow >= 0
    });
  }, [kaufpreis, monatlicheMiete, nebenkosten, values]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const eigenkapitalProzent = kaufpreis > 0 ? (values.eigenkapital / kaufpreis) * 100 : 0;

  return (
    <div className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate/20">
      <h4 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
        <span className="text-2xl">🎚️</span>
        Interaktive Simulation
      </h4>

      <div className="space-y-8">
        {/* Eigenkapital Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate/80">Eigenkapital</label>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">{formatCurrency(values.eigenkapital)}</span>
              <span className="text-sm text-slate/60 ml-2">({eigenkapitalProzent.toFixed(1)}%)</span>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={kaufpreis}
            step={5000}
            value={values.eigenkapital}
            onChange={(e) => setValues({ ...values, eigenkapital: Number(e.target.value) })}
            className="w-full h-3 bg-slate/20 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-br
              [&::-webkit-slider-thumb]:from-accent
              [&::-webkit-slider-thumb]:to-amber-500
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
          <div className="flex justify-between text-xs text-slate/50 mt-1">
            <span>0€</span>
            <span>{formatCurrency(kaufpreis)}</span>
          </div>
        </div>

        {/* Zinssatz Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate/80">Zinssatz</label>
            <span className="text-lg font-bold text-primary">{values.zinssatz.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={8}
            step={0.05}
            value={values.zinssatz}
            onChange={(e) => setValues({ ...values, zinssatz: Number(e.target.value) })}
            className="w-full h-3 bg-slate/20 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-br
              [&::-webkit-slider-thumb]:from-blue-500
              [&::-webkit-slider-thumb]:to-indigo-500
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
          <div className="flex justify-between text-xs text-slate/50 mt-1">
            <span>0.5%</span>
            <span>8%</span>
          </div>
        </div>

        {/* Tilgung Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate/80">Tilgung</label>
            <span className="text-lg font-bold text-primary">{values.tilgung.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={0.05}
            value={values.tilgung}
            onChange={(e) => setValues({ ...values, tilgung: Number(e.target.value) })}
            className="w-full h-3 bg-slate/20 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-br
              [&::-webkit-slider-thumb]:from-green-500
              [&::-webkit-slider-thumb]:to-emerald-500
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
          <div className="flex justify-between text-xs text-slate/50 mt-1">
            <span>1%</span>
            <span>5%</span>
          </div>
        </div>
      </div>

      {/* Real-time Result */}
      {calculatedCashflow && (
        <div className="mt-8 pt-6 border-t border-slate/20">
          <p className="text-sm text-slate/60 mb-4 text-center">Ergebnis bei diesen Einstellungen:</p>

          <div className={`p-5 rounded-2xl ${
            calculatedCashflow.selbsttragend
              ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300'
              : 'bg-gradient-to-br from-red-100 to-rose-100 border-2 border-red-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate/70 font-medium">Monatlicher Cashflow</span>
              <span className={`text-2xl font-black ${
                calculatedCashflow.selbsttragend ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculatedCashflow.monatlich >= 0 ? '+' : ''}
                {formatCurrency(calculatedCashflow.monatlich)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate/60">Finanzierungssumme:</span>
                <span className="font-medium">{formatCurrency(calculatedCashflow.finanzierungssumme)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate/60">Monatl. Rate:</span>
                <span className="font-medium">{formatCurrency(calculatedCashflow.monatlicheRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate/60">Jährl. Cashflow:</span>
                <span className={`font-medium ${calculatedCashflow.jaehrlich >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculatedCashflow.jaehrlich >= 0 ? '+' : ''}
                  {formatCurrency(calculatedCashflow.jaehrlich)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate/60">Gesamtrate:</span>
                <span className="font-medium">{(values.zinssatz + values.tilgung).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate/5 rounded-xl text-center">
              <p className="text-xs text-slate/60">Kredit abbezahlt in</p>
              <p className="text-lg font-bold text-primary">
                ~{Math.ceil(100 / values.tilgung)} Jahren
              </p>
            </div>
            <div className="p-3 bg-slate/5 rounded-xl text-center">
              <p className="text-xs text-slate/60">Gesamte Zinskosten (geschätzt)</p>
              <p className="text-lg font-bold text-red-600">
                ~{formatCurrency(calculatedCashflow.finanzierungssumme * values.zinssatz / 100 * (100 / values.tilgung) / 2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={() => setValues({
          eigenkapital: initialValues?.eigenkapital || 0,
          zinssatz: initialValues?.zinssatz || 3.75,
          tilgung: initialValues?.tilgung || 1.25
        })}
        className="mt-6 w-full py-2 text-sm text-slate/60 hover:text-primary border border-slate/20 rounded-xl
          hover:border-accent/50 transition-all"
      >
        ↺ Auf Ursprungswerte zurücksetzen
      </button>
    </div>
  );
}

export default InteractiveSliders;
