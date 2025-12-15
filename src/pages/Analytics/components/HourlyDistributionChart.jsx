// pages/Analytics/components/HourlyDistributionChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const HourlyDistributionChart = ({ data }) => {
    const chartData = data || Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, count: Math.floor(Math.random() * 20) }))

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                    <XAxis dataKey="hour" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default HourlyDistributionChart
