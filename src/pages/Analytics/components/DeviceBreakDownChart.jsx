import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts'
import React from "react";

const PLATFORM_COLORS = {
    Mobile: '#3b82f6',
    Desktop: '#10b981',
    Windows: '#2563eb',
    iOS: '#111827',
    Android: '#22c55e',
    Tablet: '#f59e0b',
    MacOS: '#6b7280',
    Linux: '#9333ea',
    Other: '#9ca3af',
}

const renderLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`

const DeviceBreakdownChart = ({ data = [] }) => {
    const chartData = data
        ? Object.entries(data).map(([platform, obj]) => ({
            name: obj.platform.charAt(0).toUpperCase() + obj.platform.slice(1),
            value:obj.count,
        }))
        : []

    const total = chartData.reduce(
        (sum, item) => sum + item.count,
        0
    )

    if (!chartData.length) {
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
                No device data available
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Device Breakdown
            </h3>

            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name]} />
                        ))}
                    </Pie>

                    <Tooltip/>

                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-gray-700 text-sm">
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DeviceBreakdownChart
