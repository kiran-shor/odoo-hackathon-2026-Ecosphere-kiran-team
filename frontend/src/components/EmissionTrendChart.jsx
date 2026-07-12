import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function EmissionTrendChart({ data }) {
  if (!data.length) return <p className="empty-state">No emission trend is available yet.</p>;

  return (
    <div className="chart-frame" aria-label="Carbon emissions over time">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="#dce7df" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="period" />
          <YAxis width={52} />
          <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} kg CO2e`, 'Emissions']} />
          <Line
            type="monotone"
            dataKey="totalCO2"
            name="Total CO2 emitted"
            stroke="#256b4a"
            strokeWidth={3}
            dot={{ r: 4, fill: '#f5f8f3', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
