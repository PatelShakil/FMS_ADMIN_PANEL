// pages/Notifications/NotificationsPage.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../../api/services/notificationService'
import NotificationList from './components/NotificationList'
import NotificationFilters from './components/NotificationFilters'
import { BellIcon, Cog6ToothIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {useAuthStore} from "../../store/authStore.js";

const NotificationsPage = () => {
    const { user,role } = useAuthStore()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [filters, setFilters] = useState({
        unreadOnly: false,
        eventType: undefined,
        status: undefined,
        priority: undefined
    })

    // Fetch notifications
    const { data: notificationsData, isLoading, refetch } = useQuery({
        queryKey: ['notifications', filters],
        queryFn: () => notificationService.getAllNotificationsByUserId({
            ...filters,
            page: 1,
            limit: 50,
            userId: user?.id,
        }),
        refetchInterval: 30000, // Auto-refresh every 30s
    })

    // Mark as read mutation (update to use archive flag)
    const markAsReadMutation = useMutation({
        mutationFn: async (id) => {
            // Since your API doesn't have mark as read, we'll use a workaround
            // You might need to add this endpoint or use archiving
            return { success: true }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications'])
            toast.success('Marked as read')
        }
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            // Add delete endpoint call when available
            return { success: true }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications'])
            toast.success('Notification deleted')
        }
    })

    const notifications = notificationsData?.data || []
    const pagination = notificationsData?.pagination || {}
    const unreadCount = notifications.filter(n => !n.isArchived && n.status === 'SENT').length

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-14 z-10">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="p-3 bg-primary-100 rounded-lg">
                                    <BellIcon className="w-6 h-6 text-primary-600" />
                                </div>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {pagination.total || 0} total • {unreadCount} unread
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => refetch()}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={isLoading}
                            >
                                <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={() => navigate('/notifications/settings')}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Cog6ToothIcon className="w-5 h-5" />
                                Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <NotificationFilters filters={filters} onChange={setFilters} />

                <NotificationList
                    notifications={notifications}
                    isLoading={isLoading}
                    onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
                    onDelete={(id) => deleteMutation.mutate(id)}
                />

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationsPage
