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
          <CartesianGrid stroke="#dce7df" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="departmentName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#256b4a" radius={[7, 7, 2, 2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
