// pages/Responses/ResponseDetailPage.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet'
import { responseService } from '../../api/services/responseService'
import { feedbackService } from '../../api/services/feedbackService'
import { qrService } from '../../api/services/qrService'
import {
    ArrowLeftIcon,
    PencilIcon,
    FlagIcon,
    TrashIcon,
    PrinterIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import ResponseHeader from './components/ResponseDetail/ResponseHeader'
import ResponseFields from './components/ResponseDetail/ResponseFields'
import ResponseStatusTimeline from './components/ResponseDetail/ResponseStatusTimeline'
import UpdateStatusModal from './components/Actions/UpdateStatusModal'
import FlagResponseModal from './components/Actions/FlagResponseModal'
import { hasPermission } from './constants/permissions'
import {useAuthStore} from "../../store/authStore.js";

const ResponseDetailPage = () => {
    const { responseId } = useParams()
    const navigate = useNavigate()
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showFlagModal, setShowFlagModal] = useState(false)

    // Get user role from your auth store
    const {role:userRole} = useAuthStore() // Replace with actual auth

    // Fetch response
    const { data: responseData, isLoading } = useQuery({
        queryKey: ['response', responseId],
        queryFn: () => responseService.getResponseById(responseId)
    })

    const response = responseData?.data

    // Fetch form
    const { data: formData } = useQuery({
        queryKey: ['form', response?.formId],
        queryFn: () => feedbackService.getFormById(response?.formId),
        enabled: !!response?.formId
    })

    // Fetch QR details
    const { data: qrData } = useQuery({
        queryKey: ['qr', response?.qrCodeId],
        queryFn: () => qrService.getQRById(response?.qrCodeId),
        enabled: !!response?.qrCodeId
    })

    const handlePrint = () => {
        window.print()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                    <p className="text-gray-600 mt-4">Loading response...</p>
                </div>
            </div>
        )
    }

    if (!response) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Response not found</p>
                    <button
                        onClick={() => navigate('/responses')}
                        className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        ← Back to Responses
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Response #{response.responseId?.slice(-8)} - BoloIndia</title>
            </Helmet>

            {/* Header Actions */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/responses')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            Back to Responses
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Update Status */}
                            {hasPermission(userRole, 'update_status') && (
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    Update Status
                                </button>
                            )}

                            {/* Flag */}
                            {hasPermission(userRole, 'flag_response') && (
                                <button
                                    onClick={() => setShowFlagModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FlagIcon className="w-4 h-4" />
                                    {response.isFlagged ? 'Unflag' : 'Flag'}
                                </button>
                            )}

                            {/* Print */}
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <PrinterIcon className="w-4 h-4" />
                                Print
                            </button>

                            {/* Export */}
                            {hasPermission(userRole, 'export_data') && (
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    Export
                                </button>
                            )}

                            {/* Delete */}
                            {hasPermission(userRole, 'delete_response') && (
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <ResponseHeader response={response} />
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <ResponseFields response={response} formData={formData?.data} />
                        </div>
                    </div>

                    {/* Right Column - Timeline & Meta */}
                    <div className="space-y-6">
                        {/* Status Timeline */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <ResponseStatusTimeline response={response} />
                        </div>

                        {/* QR Code Details */}
                        {qrData && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    QR Code Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-gray-600">QR ID:</span>
                                        <p className="font-mono font-medium text-gray-900">
                                            {qrData.data?.qrCodeId}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Location:</span>
                                        <p className="font-medium text-gray-900">
                                            {qrData.data?.deploymentLocation || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Distributor:</span>
                                        <p className="font-medium text-gray-900">
                                            {qrData.data?.distributorName || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showStatusModal && (
                <UpdateStatusModal
                    isOpen={showStatusModal}
                    onClose={() => setShowStatusModal(false)}
                    response={response}
                />
            )}
            {showFlagModal && (
                <FlagResponseModal
                    isOpen={showFlagModal}
                    onClose={() => setShowFlagModal(false)}
                    response={response}
                />
            )}
        </div>
    )
}

export default ResponseDetailPage
