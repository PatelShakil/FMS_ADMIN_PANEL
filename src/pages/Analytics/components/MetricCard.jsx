// pages/Analytics/components/MetricCard.jsx
const MetricCard = ({ title, value, change, icon: Icon, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    <p className="text-xs text-green-600 mt-1">{change} from last period</p>
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}

export default MetricCard
