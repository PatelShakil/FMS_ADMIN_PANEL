// pages/Responses/components/ResponseList/ResponseGridView.jsx
import useResponseStore from '../../../../store/responseStore'
import { STATUS_CONFIG } from '../../constants/statuses'
import { formatDistanceToNow } from 'date-fns'
import { FlagIcon as FlagIconSolid } from '@heroicons/react/24/solid'
import { ClockIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline'

const ResponseGridView = ({ responses, pagination }) => {
    const { openDetailDrawer } = useResponseStore()

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {responses.map((response) => {
                    const statusConfig = STATUS_CONFIG[response.status] || STATUS_CONFIG.PENDING

                    return (
                        <button
                            key={response.responseId}
                            onClick={() => openDetailDrawer(response.responseId)}
                            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all text-left"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <span className="font-mono text-xs text-gray-500">
                                    #{response.responseId?.slice(-8)}
                                </span>
                                {response.isFlagged && (
                                    <FlagIconSolid className="w-4 h-4 text-red-500" />
                                )}
                            </div>

                            {/* Status */}
                            <div className="mb-4">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}
                                    />
                                    {statusConfig.label}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <UserIcon className="w-4 h-4" />
                                    <span className="truncate">
                                        {response.citizenEmail ||
                                            response.citizenPhone ||
                                            'Anonymous'}
                                    </span>
                                </div>

                                {response.location && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPinIcon className="w-4 h-4" />
                                        <span className="truncate">
                                            {response.location.city || response.location.state}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-gray-600">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>
                                        {formatDistanceToNow(new Date(response.createdAt), {
                                            addSuffix: true
                                        })}
                                    </span>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ResponseGridView
