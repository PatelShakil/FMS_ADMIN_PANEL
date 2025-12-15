// pages/Responses/components/ResponseDetail/ResponseHeader.jsx
import { STATUS_CONFIG } from '../../constants/statuses'
import { formatDistanceToNow, format } from 'date-fns'
import { FlagIcon as FlagIconSolid } from '@heroicons/react/24/solid'
import {
    CalendarIcon,
    UserIcon,
    DevicePhoneMobileIcon,
    MapPinIcon,
    QrCodeIcon
} from '@heroicons/react/24/outline'

const ResponseHeader = ({ response }) => {
    const statusConfig = STATUS_CONFIG[response.status] || STATUS_CONFIG.PENDING

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            {/* ID & Status */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                            #{response.responseId?.slice(-8)}
                        </h3>
                        {response.isFlagged && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
                                <FlagIconSolid className="w-4 h-4 text-red-600" />
                                <span className="text-xs font-semibold text-red-700">
                                    Flagged
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">
                        Full ID: {response.responseId}
                    </p>
                </div>

                <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border-2 ${statusConfig.borderColor}`}
                >
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                    {statusConfig.icon} {statusConfig.label}
                </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Submitted */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 font-medium">Submitted</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {format(new Date(response.createdAt), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {/* Citizen */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 font-medium">Citizen</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {response.citizenEmail || response.citizenPhone || (
                                <span className="text-gray-400 italic">Anonymous</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Location */}
                {response.location && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg">
                            <MapPinIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Location</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {response.location.city && response.location.state
                                    ? `${response.location.city}, ${response.location.state}`
                                    : response.location.city || response.location.state || '-'}
                            </p>
                            {response.location.coordinates && (
                                <p className="text-xs text-gray-500">
                                    {response.location.coordinates.lat.toFixed(4)},{' '}
                                    {response.location.coordinates.lng.toFixed(4)}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* QR Code */}
                {response.qrCodeId && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg">
                            <QrCodeIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">QR Code</p>
                            <p className="text-sm font-mono font-semibold text-gray-900">
                                {response.qrCodeId}
                            </p>
                        </div>
                    </div>
                )}

                {/* Device Info */}
                {response.metadata?.deviceInfo && (
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg">
                            <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-medium">Device</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {response.metadata.deviceInfo.browser || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {response.metadata.deviceInfo.os || 'Unknown OS'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResponseHeader
