// pages/Responses/components/ResponseDetail/ResponseStatusTimeline.jsx
import { format } from 'date-fns'
import { STATUS_CONFIG } from '../../constants/statuses'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const ResponseStatusTimeline = ({ response }) => {
    // Build timeline from response history
    const timeline = [
        {
            status: 'PENDING',
            timestamp: response.createdAt,
            user: 'System',
            action: 'Response submitted'
        }
    ]

    if (response.reviewedAt) {
        timeline.push({
            status: 'REVIEWED',
            timestamp: response.reviewedAt,
            user: response.reviewedBy || 'Admin',
            action: 'Response reviewed'
        })
    }

    if (response.resolvedAt) {
        timeline.push({
            status: 'RESOLVED',
            timestamp: response.resolvedAt,
            user: response.resolvedBy || 'Admin',
            action: 'Response resolved',
            notes: response.resolutionNotes
        })
    }

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Status History</h4>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                {/* Timeline Items */}
                <div className="space-y-6">
                    {timeline.map((item, index) => {
                        const statusConfig = STATUS_CONFIG[item.status]
                        const isLast = index === timeline.length - 1

                        return (
                            <div key={index} className="relative flex gap-4">
                                {/* Icon */}
                                <div
                                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border-2`}
                                >
                                    <CheckCircleIcon
                                        className={`w-5 h-5 ${statusConfig.textColor}`}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {item.action}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-0.5">
                                                by {item.user}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {format(new Date(item.timestamp), 'MMM dd, yyyy h:mm a')}
                                        </span>
                                    </div>

                                    {item.notes && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">{item.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ResponseStatusTimeline
