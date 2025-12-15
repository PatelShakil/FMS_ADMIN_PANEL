// pages/Analytics/components/TopFormsChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TopFormsChart = ({ data }) => {
    const chartData = data || []

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Forms</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="formName" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TopFormsChart
