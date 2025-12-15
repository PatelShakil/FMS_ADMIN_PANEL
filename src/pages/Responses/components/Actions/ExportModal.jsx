// pages/Responses/components/Actions/ExportModal.jsx - COMPLETE VERSION
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { responseService } from '../../../../api/services/responseService'
import { EXPORT_FORMAT_CONFIG, downloadFile } from '../../constants/exportFormats'
import { XMarkIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const ExportModal = ({ isOpen, onClose, filters }) => {
    const [selectedFormat, setSelectedFormat] = useState('csv')
    const [isExporting, setIsExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)

    const formatConfig = EXPORT_FORMAT_CONFIG[selectedFormat]

    const handleExport = async () => {
        if (!filters.formId) {
            toast.error('Please select a form to export')
            return
        }

        setIsExporting(true)
        setExportProgress(0)

        try {
            // Build export params
            const exportParams = {
                formId: filters.formId,
                ...(filters.status && { status: filters.status }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
                ...(filters.serviceId && { serviceId: filters.serviceId }),
                ...(filters.isFlagged !== undefined && { isFlagged: filters.isFlagged }),
            }

            setExportProgress(30)

            let blob
            let filename = `responses_${filters.formId}_${format(new Date(), 'yyyy-MM-dd_HHmmss')}`

            // Call appropriate export API
            switch (selectedFormat) {
                case 'csv':
                    blob = await responseService.exportCSV(exportParams)
                    break

                case 'excel':
                    blob = await responseService.exportExcel(exportParams)
                    break

                case 'pdf':
                    blob = await responseService.exportPDF(exportParams)
                    break

                case 'json':
                    // For JSON, fetch data and create blob
                    const jsonData = await responseService.getAllResponses(exportParams)
                    console.log('JSON data:', jsonData)
                    blob = new Blob([JSON.stringify(jsonData.data, null, 2)], {
                        type: 'application/json'
                    })
                    break

                default:
                    throw new Error('Invalid export format')
            }

            setExportProgress(80)

            // Download file
            downloadFile(blob, filename, formatConfig.extension)

            setExportProgress(100)

            toast.success(`Successfully exported as ${formatConfig.label}`)

            // Close modal after short delay
            setTimeout(() => {
                onClose()
                setExportProgress(0)
            }, 1000)

        } catch (error) {
            console.error('Export error:', error)
            toast.error(error.response?.data?.message || `Failed to export as ${formatConfig.label}`)
            setExportProgress(0)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative  z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl mt-14 bg-white rounded-xl shadow-xl">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-50 rounded-lg">
                                            <ArrowDownTrayIcon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                Export Responses
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-600 mt-0.5">
                                                Download your response data in various formats
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        disabled={isExporting}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Format Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            Select Export Format
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.values(EXPORT_FORMAT_CONFIG).map((config) => {
                                                const isSelected = selectedFormat === config.key
                                                const isDisabled = false
                                                    // && filters.totalRecords > config.maxRecords

                                                return (
                                                    <button
                                                        key={config.key}
                                                        onClick={() => !isDisabled && setSelectedFormat(config.key)}
                                                        disabled={isExporting || isDisabled}
                                                        className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                                                            isSelected
                                                                ? 'border-primary-500 bg-primary-50 shadow-sm'
                                                                : isDisabled
                                                                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                        }`}
                                                    >
                                                        {/* Selected Indicator */}
                                                        {isSelected && (
                                                            <div className="absolute top-3 right-3">
                                                                <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                                                            </div>
                                                        )}

                                                        {/* Icon */}
                                                        <div className="text-4xl mb-3">{config.icon}</div>

                                                        {/* Label */}
                                                        <div className="mb-2">
                                                            <div
                                                                className={`text-base font-bold ${
                                                                    isSelected ? 'text-primary-700' : 'text-gray-900'
                                                                }`}
                                                            >
                                                                {config.label}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {config.description}
                                                            </div>
                                                        </div>

                                                        {/* Features */}
                                                        <ul className="space-y-1">
                                                            {config.features.map((feature, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="text-xs text-gray-600 flex items-center gap-1.5"
                                                                >
                                                                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {/* Disabled Warning */}
                                                        {isDisabled && (
                                                            <div className="mt-3 text-xs text-red-600 font-medium">
                                                                ⚠️ Too many records for this format
                                                            </div>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Active Filters Info */}
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                            📌 Active Filters
                                        </h4>
                                        <div className="space-y-1 text-sm text-blue-800">
                                            {filters.formId && (
                                                <div>• Form ID: <span className="font-mono">{filters.formId}</span></div>
                                            )}
                                            {filters.status && (
                                                <div>• Status: <span className="font-semibold">{filters.status}</span></div>
                                            )}
                                            {filters.startDate && (
                                                <div>• From: {format(new Date(filters.startDate), 'MMM dd, yyyy')}</div>
                                            )}
                                            {filters.endDate && (
                                                <div>• To: {format(new Date(filters.endDate), 'MMM dd, yyyy')}</div>
                                            )}
                                            {filters.isFlagged !== undefined && (
                                                <div>• {filters.isFlagged ? 'Flagged only' : 'Not flagged'}</div>
                                            )}
                                            {!filters.formId && !filters.status && !filters.startDate && (
                                                <div className="text-blue-600">All responses will be exported</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selected Format Details */}
                                    {formatConfig && (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">{formatConfig.icon}</span>
                                                <div>
                                                    <div className="font-semibold text-gray-900">
                                                        Exporting as {formatConfig.label}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        File extension: <span className="font-mono">{formatConfig.extension}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {formatConfig.maxRecords && (
                                                <div className="text-xs text-amber-700 mt-2">
                                                    ⚠️ Note: {formatConfig.label} export is limited to {formatConfig.maxRecords} records
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Progress Bar */}
                                    {isExporting && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700 font-medium">Exporting...</span>
                                                <span className="text-primary-600 font-semibold">{exportProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${exportProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            disabled={isExporting}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleExport}
                                            disabled={isExporting || !filters.formId}
                                            className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isExporting ? (
                                                <>
                                                    <svg
                                                        className="animate-spin h-5 w-5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Exporting...
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                                    Export {formatConfig.label}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ExportModal
