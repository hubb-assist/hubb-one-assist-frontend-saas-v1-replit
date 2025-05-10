import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', value: 25 },
  { name: 'Fev', value: 40 },
  { name: 'Mar', value: 30 },
  { name: 'Abr', value: 60 },
  { name: 'Mai', value: 70 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 80 }
];

export default function ChartDemo() {
  return (
    <div className="py-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Amostra de Gráfico com Recharts</h3>
      <div className="bg-white p-4 rounded-md border border-gray-200 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0066cc" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0066cc" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0066cc" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
