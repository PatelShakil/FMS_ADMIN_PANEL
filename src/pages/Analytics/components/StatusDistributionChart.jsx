// pages/Analytics/components/StatusDistributionChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const StatusDistributionChart = ({ data, isLoading }) => {
    const chartData = [
        { name: 'Pending', value: data?.pending || 0, color: '#f59e0b' },
        { name: 'Reviewed', value: data?.reviewed || 0, color: '#3b82f6' },
        { name: 'Resolved', value: data?.resolved || 0, color: '#10b981' },
        // { name: 'Registered', value: data?.registered || 0, color: '#1b7557' },
        { name: 'Rejected', value: data?.rejected || 0, color: '#ef4444' },
        { name: 'Spam', value: data?.spam || 0, color: '#700303' },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default StatusDistributionChart
