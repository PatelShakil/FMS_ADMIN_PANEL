// pages/Notifications/NotificationSettings.jsx
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../../../api/services/notificationService'
import toast from 'react-hot-toast'
import { useAuthStore } from "../../../store/authStore.js"
import { ArrowLeftIcon, BellIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const NotificationSettings = () => {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // Fetch preferences
    const { data: prefsData, isLoading } = useQuery({
        queryKey: ['notification-preferences', user?.id],
        queryFn: () => notificationService.getUserPreferences(user?.id),
        enabled: !!user?.id
    })

    // Initialize preferences state
    const [prefs, setPrefs] = useState({
        emailEnabled: true,
        emailOnResponseSubmitted: true,
        emailOnResponseReviewed: true,
        emailOnResponseResolved: true,
        emailOnResponseFlagged: true,
        emailOnDistributorApproved: true,
        emailOnDistributorRejected: true,
        emailOnOrgApproved: true,
        emailOnOrgSuspended: true,
        emailOnQrAssigned: true,
        emailOnQrDeployed: true,
        emailOnQrRejected: true,
        emailOnNewFeedback: true,
    })

    // Update state when data loads
    useEffect(() => {
        if (prefsData?.data) {
            setPrefs({
                emailEnabled: prefsData.data.emailEnabled ?? true,
                emailOnResponseSubmitted: prefsData.data.emailOnResponseSubmitted ?? true,
                emailOnResponseReviewed: prefsData.data.emailOnResponseReviewed ?? true,
                emailOnResponseResolved: prefsData.data.emailOnResponseResolved ?? true,
                emailOnResponseFlagged: prefsData.data.emailOnResponseFlagged ?? true,
                emailOnDistributorApproved: prefsData.data.emailOnDistributorApproved ?? true,
                emailOnDistributorRejected: prefsData.data.emailOnDistributorRejected ?? true,
                emailOnOrgApproved: prefsData.data.emailOnOrgApproved ?? true,
                emailOnOrgSuspended: prefsData.data.emailOnOrgSuspended ?? true,
                emailOnQrAssigned: prefsData.data.emailOnQrAssigned ?? true,
                emailOnQrDeployed: prefsData.data.emailOnQrDeployed ?? true,
                emailOnQrRejected: prefsData.data.emailOnQrRejected ?? true,
                emailOnNewFeedback: prefsData.data.emailOnNewFeedback ?? true,
            })
        }
    }, [prefsData])

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: () => notificationService.updateUserPreferences(user?.id, prefs),
        onSuccess: () => {
            queryClient.invalidateQueries(['notification-preferences', user?.id])
            toast.success('Notification settings updated successfully!')
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to update settings')
        }
    })

    const handleToggle = (key) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleToggleAll = (category, value) => {
        const categoryKeys = notificationCategories.find(c => c.id === category)?.items.map(i => i.key) || []
        const updates = {}
        categoryKeys.forEach(key => {
            updates[key] = value
        })
        setPrefs(prev => ({ ...prev, ...updates }))
    }

    // Notification categories
    const notificationCategories = [
        {
            id: 'general',
            title: '📧 General Settings',
            description: 'Master email notification control',
            items: [
                {
                    key: 'emailEnabled',
                    label: 'Email Notifications',
                    description: 'Enable/disable all email notifications',
                    icon: '📬',
                    master: true
                }
            ]
        },
        {
            id: 'responses',
            title: '📝 Response Notifications',
            description: 'Get notified about response activities',
            items: [
                {
                    key: 'emailOnResponseSubmitted',
                    label: 'New Response Submitted',
                    description: 'When a citizen submits a new response',
                    icon: '📥'
                },
                {
                    key: 'emailOnResponseReviewed',
                    label: 'Response Reviewed',
                    description: 'When a response is reviewed by an admin',
                    icon: '👀'
                },
                {
                    key: 'emailOnResponseResolved',
                    label: 'Response Resolved',
                    description: 'When a response is marked as resolved',
                    icon: '✅'
                },
                {
                    key: 'emailOnResponseFlagged',
                    label: 'Response Flagged',
                    description: 'When a response is flagged for attention',
                    icon: '🚩'
                }
            ]
        },
        {
            id: 'distributors',
            title: '👥 Distributor Notifications',
            description: 'Distributor management updates',
            items: [
                {
                    key: 'emailOnDistributorApproved',
                    label: 'Distributor Approved',
                    description: 'When a distributor is approved',
                    icon: '✅'
                },
                {
                    key: 'emailOnDistributorRejected',
                    label: 'Distributor Rejected',
                    description: 'When a distributor application is rejected',
                    icon: '❌'
                }
            ]
        },
        {
            id: 'organization',
            title: '🏢 Organization Notifications',
            description: 'Organization-related updates',
            items: [
                {
                    key: 'emailOnOrgApproved',
                    label: 'Organization Approved',
                    description: 'When your organization is approved',
                    icon: '🎉'
                },
                {
                    key: 'emailOnOrgSuspended',
                    label: 'Organization Suspended',
                    description: 'When an organization is suspended',
                    icon: '⚠️'
                },
                {
                    key: 'emailOnNewFeedback',
                    label: 'New Feedback Form',
                    description: 'When a new feedback form is created',
                    icon: '📋'
                }
            ]
        },
        {
            id: 'qr',
            title: '📱 QR Code Notifications',
            description: 'QR code activity updates',
            items: [
                {
                    key: 'emailOnQrAssigned',
                    label: 'QR Code Assigned',
                    description: 'When a QR code is assigned to you',
                    icon: '🔗'
                },
                {
                    key: 'emailOnQrDeployed',
                    label: 'QR Code Deployed',
                    description: 'When a QR code is deployed',
                    icon: '🚀'
                },
                {
                    key: 'emailOnQrRejected',
                    label: 'QR Code Rejected',
                    description: 'When a QR deployment is rejected',
                    icon: '⛔'
                }
            ]
        }
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading preferences...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky -top-6 z-10">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate('/notifications')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-100 rounded-lg">
                                <BellIcon className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
                                <p className="text-sm text-gray-600">Manage your notification preferences</p>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={() => updateMutation.mutate()}
                        disabled={updateMutation.isPending}
                        className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {notificationCategories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Category Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                </div>
                                {!category.items[0]?.master && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleAll(category.id, true)}
                                            className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                                        >
                                            Enable All
                                        </button>
                                        <button
                                            onClick={() => handleToggleAll(category.id, false)}
                                            className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                        >
                                            Disable All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Items */}
                        <div className="divide-y divide-gray-200">
                            {category.items.map((item) => (
                                <label
                                    key={item.key}
                                    className={`
                                        flex items-center justify-between p-5 cursor-pointer transition-colors
                                        ${prefs[item.key] ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}
                                        ${item.master ? 'border-l-4 border-l-primary-500' : ''}
                                    `}
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">{item.label}</span>
                                                {item.master && (
                                                    <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-semibold">
                                                        MASTER
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={prefs[item.key]}
                                        onChange={() => handleToggle(item.key)}
                                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <EnvelopeIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-2">📬 How Email Notifications Work</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Emails are sent to: <strong>{user?.email}</strong></li>
                                <li>• Notifications are sent in real-time when events occur</li>
                                <li>• You can disable specific notification types above</li>
                                <li>• Master toggle controls all email notifications</li>
                                <li>• Changes take effect immediately after saving</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                {prefsData?.data && (
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-xs text-gray-600">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="font-semibold">Last Updated:</span>{' '}
                                {new Date(prefsData.data.updatedAt).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-semibold">User ID:</span> {prefsData.data.userId}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationSettings
