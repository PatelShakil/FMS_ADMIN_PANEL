// pages/Analytics/components/LocationBreakdown.jsx
const LocationBreakdown = ({ data }) => {
    const locations = data || []

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
            <div className="space-y-3">
                {locations.map((loc, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📍</span>
                            <div>
                                <p className="font-medium text-gray-900">{loc.city || loc.location}</p>
                                <p className="text-sm text-gray-600">{loc.state}</p>
                            </div>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">{loc.count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LocationBreakdown
