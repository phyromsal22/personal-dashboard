import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'

export function BarChartCard({ data, title }) {
  return (
    <Card className="h-80 flex flex-col">
      <h3 className="font-semibold mb-4 text-text">{title}</h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
            <Tooltip 
              cursor={{ fill: '#2A2F3A' }}
              contentStyle={{ backgroundColor: '#1A1D24', borderColor: '#2A2F3A', borderRadius: '12px' }}
            />
            <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}