// pages/Notifications/components/NotificationFilters.jsx
import { FunnelIcon } from '@heroicons/react/24/outline'

const NotificationFilters = ({ filters, onChange }) => {
    const eventTypes = [
        { value: 'all', label: 'All Notifications' },
        { value: 'distributor.registered', label: '👤 Registrations' },
        { value: 'distributor.suspended', label: '⚠️ Suspensions' },
        { value: 'distributor.reactivated', label: '🔄 Reactivations' },
        { value: 'user.created', label: '🎉 User Invites' },
        { value: 'user.accepted', label: '✅ Accepted Invites' },
        { value: 'response.submitted', label: '📝 Responses' },
    ]

    const statuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'SENT', label: 'Sent' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'FAILED', label: 'Failed' },
    ]

    const priorities = [
        { value: 'all', label: 'All Priorities' },
        { value: 'HIGH', label: 'High Priority' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'LOW', label: 'Low' },
    ]

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <FunnelIcon className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Unread Toggle */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.unreadOnly || false}
                            onChange={(e) => onChange({ ...filters, unreadOnly: e.target.checked })}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Unread Only</span>
                    </label>
                </div>

                {/* Event Type */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Type</label>
                    <select
                        value={filters.eventType || 'all'}
                        onChange={(e) => onChange({ ...filters, eventType: e.target.value === 'all' ? undefined : e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {eventTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filters.status || 'all'}
                        onChange={(e) => onChange({ ...filters, status: e.target.value === 'all' ? undefined : e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                    <select
                        value={filters.priority || 'all'}
                        onChange={(e) => onChange({ ...filters, priority: e.target.value === 'all' ? undefined : e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {priorities.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                                {priority.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Active filters summary */}
            {(filters.eventType || filters.status || filters.priority || filters.unreadOnly) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-600">Active filters:</span>
                        {filters.unreadOnly && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                Unread
                            </span>
                        )}
                        {filters.eventType && (
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                {eventTypes.find(t => t.value === filters.eventType)?.label}
                            </span>
                        )}
                        {filters.status && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                {filters.status}
                            </span>
                        )}
                        {filters.priority && (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                {filters.priority}
                            </span>
                        )}
                        <button
                            onClick={() => onChange({ unreadOnly: false })}
                            className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationFilters
