// pages/Analytics/components/ResponseTrendChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const ResponseTrendChart = ({ data, isLoading }) => {
    // Mock data if not available
    const chartData = data || [
        { date: 'Mon', responses: 5, resolved: 3 },
        { date: 'Tue', responses: 8, resolved: 6 },
        { date: 'Wed', responses: 12, resolved: 9 },
        { date: 'Thu', responses: 7, resolved: 5 },
        { date: 'Fri', responses: 10, resolved: 8 },
        { date: 'Sat', responses: 6, resolved: 4 },
        { date: 'Sun', responses: 4, resolved: 3 },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Trends</h3>
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="responses" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

export default ResponseTrendChart
