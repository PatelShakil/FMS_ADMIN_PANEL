// pages/Notifications/components/NotificationList.jsx
import NotificationItem from './NotificationItem'
import { BellSlashIcon } from '@heroicons/react/24/outline'

const NotificationList = ({ notifications, isLoading, onMarkAsRead, onDelete }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Loading notifications...</p>
                </div>
            </div>
        )
    }

    if (!notifications || notifications.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <BellSlashIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900 mb-2">No notifications</p>
                <p className="text-sm text-gray-600">You're all caught up! 🎉</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={onMarkAsRead}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}

export default NotificationList
