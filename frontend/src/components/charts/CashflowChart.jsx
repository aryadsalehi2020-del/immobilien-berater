import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

function CashflowChart({ szenarien }) {
  if (!szenarien || szenarien.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate/5 rounded-xl">
        <p className="text-slate/60">Keine Szenario-Daten verfügbar</p>
      </div>
    );
  }

  // Prepare data for the chart - combine all scenarios
  const maxJahre = Math.max(
    ...szenarien.map(s => s.tilgungsplan?.jahre?.length || 0)
  );

  const chartData = [];
  for (let i = 0; i < maxJahre; i++) {
    const dataPoint = { jahr: i + 1 };

    szenarien.forEach((szenario, index) => {
      const jahrDaten = szenario.tilgungsplan?.jahre?.[i];
      if (jahrDaten) {
        const key = szenario.name.toLowerCase();
        dataPoint[key] = jahrDaten.monatlicher_cashflow;
      }
    });

    chartData.push(dataPoint);
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate/20">
          <p className="font-bold text-primary mb-2">Jahr {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}/Monat
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <span className="text-2xl">📈</span>
        Cashflow-Entwicklung über 30 Jahre
      </h4>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="jahr"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#94a3b8' }}
            label={{ value: 'Jahr', position: 'insideBottomRight', offset: -5, fill: '#64748b' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#94a3b8' }}
            tickFormatter={(value) => `${value}€`}
            label={{ value: 'Cashflow/Monat', angle: -90, position: 'insideLeft', fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-primary capitalize">{value}</span>}
          />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Break-Even', fill: '#ef4444', fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="konservativ"
            name="Konservativ"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="realistisch"
            name="Realistisch"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="optimistisch"
            name="Optimistisch"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate/60 mt-4 text-center">
        Die Linien zeigen den monatlichen Cashflow unter verschiedenen Annahmen. Werte über der roten Linie sind positiv.
      </p>
    </div>
  );
}

export default CashflowChart;
