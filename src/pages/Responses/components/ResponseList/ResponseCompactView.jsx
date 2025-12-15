// pages/Responses/components/ResponseList/ResponseCompactView.jsx
import useResponseStore from '../../../../store/responseStore'
import { STATUS_CONFIG } from '../../constants/statuses'
import { formatDistanceToNow } from 'date-fns'
import { FlagIcon as FlagIconSolid } from '@heroicons/react/24/solid'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

const ResponseCompactView = ({ responses, pagination }) => {
    const { openDetailDrawer } = useResponseStore()

    return (
        <div className="divide-y divide-gray-200">
            {responses.map((response) => {
                const statusConfig = STATUS_CONFIG[response.status] || STATUS_CONFIG.PENDING

                return (
                    <button
                        key={response.responseId}
                        onClick={() => openDetailDrawer(response.responseId)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            {/* ID */}
                            <span className="font-mono text-sm text-gray-500 w-20">
                                #{response.responseId?.slice(-8)}
                            </span>

                            {/* Status Badge */}
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}
                                />
                                {statusConfig.label}
                            </span>

                            {/* Flag */}
                            {response.isFlagged && (
                                <FlagIconSolid className="w-4 h-4 text-red-500" />
                            )}

                            {/* Info */}
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">
                                    {response.citizenEmail || response.citizenPhone || 'Anonymous'}
                                </p>
                            </div>

                            {/* Time */}
                            <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(response.createdAt), {
                                    addSuffix: true
                                })}
                            </span>
                        </div>

                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </button>
                )
            })}

            {/* Pagination (reuse from table) */}
        </div>
    )
}

export default ResponseCompactView
