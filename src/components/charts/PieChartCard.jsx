import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '@/components/ui/card'

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444']

export function PieChartCard({ data, title }) {
  return (
    <Card className="h-80 flex flex-col">
      <h3 className="font-semibold mb-4 text-text">{title}</h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#2A2F3A', borderRadius: '12px' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}