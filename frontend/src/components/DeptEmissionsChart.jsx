import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function DeptEmissionsChart({ data, dataKey = 'totalCO2' }) {
  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid stroke="#dfe8ee" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="departmentName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#0f766e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
