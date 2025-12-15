// pages/Notifications/components/NotificationItem.jsx
import { formatDistanceToNow, format } from 'date-fns'
import { CheckIcon, TrashIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
    // Map event types to icons and colors
    const eventConfig = {
        'distributor.registered': { icon: '👤', color: 'blue', label: 'New Registration' },
        'distributor.approved': { icon: '✅', color: 'green', label: 'Approved' },
        'distributor.rejected': { icon: '❌', color: 'red', label: 'Rejected' },
        'distributor.suspended': { icon: '⚠️', color: 'yellow', label: 'Suspended' },
        'distributor.reactivated': { icon: '🔄', color: 'green', label: 'Reactivated' },
        'user.created': { icon: '🎉', color: 'purple', label: 'User Invited' },
        'user.accepted': { icon: '✅', color: 'green', label: 'User Accepted' },
        'org.approved': { icon: '🏢', color: 'green', label: 'Org Approved' },
        'org.rejected': { icon: '🚫', color: 'red', label: 'Org Rejected' },
        'response.submitted': { icon: '📝', color: 'blue', label: 'New Response' },
        'response.flagged': { icon: '🚩', color: 'red', label: 'Response Flagged' },
        'manual': { icon: '📧', color: 'gray', label: 'Manual Email' },
        'default': { icon: '🔔', color: 'blue', label: 'Notification' }
    }

    const config = eventConfig[notification.eventType] || eventConfig.default

    // Status badge color
    const statusColors = {
        SENT: 'bg-green-100 text-green-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
        FAILED: 'bg-red-100 text-red-800',
        QUEUED: 'bg-blue-100 text-blue-800',
    }

    // Priority colors
    const priorityColors = {
        HIGH: 'border-l-red-500',
        MEDIUM: 'border-l-yellow-500',
        LOW: 'border-l-blue-500',
    }

    // Extract meaningful info from eventPayload
    const getNotificationMessage = () => {
        const { eventPayload, eventType } = notification

        switch (eventType) {
            case 'distributor.registered':
                return `${eventPayload?.fullName || eventPayload?.email} registered as distributor`

            case 'distributor.suspended':
                return `Account suspended: ${eventPayload?.reason || 'No reason provided'}`

            case 'distributor.reactivated':
                return `Account reactivated successfully`

            case 'user.created':
                return `New user invitation sent to ${eventPayload?.fullName || eventPayload?.email}`

            case 'user.accepted':
                return `${eventPayload?.fullName || eventPayload?.email} accepted the invitation`

            case 'org.approved':
                return `Organization "${eventPayload.templateData?.orgName}" approved`

            case 'response.submitted':
                return `New response submitted on form #${eventPayload.formId}`

            default:
                return notification.subject || 'Notification received'
        }
    }

    const isRead = notification.status === 'SENT' && notification.isArchived

    return (
        <div
            className={`
                relative p-4 rounded-lg border-l-4 transition-all
                ${priorityColors[notification.priority] || 'border-l-gray-300'}
                ${isRead
                ? 'bg-white border-r border-t border-b border-gray-200'
                : 'bg-blue-50 border-r border-t border-b border-blue-200 shadow-sm'
            }
            `}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl
                    ${isRead ? 'bg-gray-100' : 'bg-white shadow-sm'}
                `}>
                    {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`
                                    text-xs font-semibold px-2 py-0.5 rounded-full
                                    ${config.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${config.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                                    ${config.color === 'red' ? 'bg-red-100 text-red-700' : ''}
                                    ${config.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${config.color === 'purple' ? 'bg-purple-100 text-purple-700' : ''}
                                    ${config.color === 'gray' ? 'bg-gray-100 text-gray-700' : ''}
                                `}>
                                    {config.label}
                                </span>

                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[notification.status]}`}>
                                    {notification.status}
                                </span>

                                {notification.priority === 'HIGH' && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                                        HIGH PRIORITY
                                    </span>
                                )}
                            </div>

                            <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                {notification.subject}
                            </h4>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {!isRead && (
                                <button
                                    onClick={() => onMarkAsRead(notification._id)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                    title="Mark as read"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => onDelete?.(notification._id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {getNotificationMessage()}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <EnvelopeIcon className="w-3.5 h-3.5" />
                            <span className="font-medium">{notification.recipientEmail}</span>
                        </div>

                        {notification.recipientName && (
                            <span>• {notification.recipientName}</span>
                        )}

                        <span>• {notification.recipientType}</span>

                        <span className="ml-auto">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    {/* Sent timestamp (if sent) */}
                    {notification.sentAt && (
                        <div className="mt-2 text-xs text-gray-500">
                            ✓ Sent {format(new Date(notification.sentAt), 'MMM dd, yyyy HH:mm')}
                            {notification.providerMessageId && (
                                <span className="ml-2 text-gray-400">
                                    (ID: {notification.providerMessageId.slice(0, 20)}...)
                                </span>
                            )}
                        </div>
                    )}

                    {/* Failed reason (if failed) */}
                    {notification.failedReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            ❌ Failed: {notification.failedReason}
                        </div>
                    )}

                    {/* Event details (expandable - optional) */}
                    {notification.eventPayload && (
                        <details className="mt-3">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                View details
                            </summary>
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 overflow-auto max-h-40">
                                <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(notification.eventPayload, null, 2)}
                                </pre>
                            </div>
                        </details>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NotificationItem
