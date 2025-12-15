// pages/Responses/components/Actions/ExportModalV2.jsx - UPDATED

import { Fragment, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { responseService } from '../../../../api/services/responseService'
import {exportMultipleResponsesPDF, exportMultipleResponsesPDFV2, exportResponsePDF} from '../../utils/pdfExporter'
import { EXPORT_FORMAT_CONFIG, downloadFile } from '../../constants/exportFormats'
import { XMarkIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const ExportModalV2 = ({ isOpen, onClose, filters, response = null, formData = null,selectedResponses = []  }) => {
    const [selectedFormat, setSelectedFormat] = useState('csv')
    const [isExporting, setIsExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)
    const [pdfQuality, setPdfQuality] = useState('high') // high, medium, low

    const formatConfig = EXPORT_FORMAT_CONFIG[selectedFormat]

    const handleExport = async () => {
        if (!filters.formId && !response) {
            toast.error('Please select a form or response to export')
            return
        }

        setIsExporting(true)
        setExportProgress(0)

        try {
            setExportProgress(20)

            // Single response PDF export
            if (response && selectedFormat === 'pdf') {
                await exportResponsePDF(response, formData, 'BoloIndia')
                setExportProgress(100)
                toast.success('PDF exported successfully!')
                setTimeout(() => onClose(), 500)
                return
            }
            // ✅ NEW: BULK PDF EXPORT (CLIENT-SIDE)
            if (!response && selectedFormat === 'pdf' && selectedResponses?.length > 0) {
                setExportProgress(30)
                await exportMultipleResponsesPDFV2(selectedResponses, formData, 'BoloIndia')
                setExportProgress(100)
                toast.success(`Exported ${selectedResponses.length} responses as PDF!`)
                setTimeout(() => onClose(), 500)
                return
            }

            // Bulk exports
            const exportParams = {
                formId: filters.formId,
                ...(filters.status && { status: filters.status }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
            }

            setExportProgress(40)

            let blob
            let filename = `responses_${filters.formId}_${format(new Date(), 'yyyy-MM-dd_HHmmss')}`

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
                    const jsonData = await responseService.getAllResponses(exportParams)
                    blob = new Blob([JSON.stringify(jsonData.data, null, 2)], {
                        type: 'application/json'
                    })
                    break

                default:
                    throw new Error('Invalid export format')
            }

            setExportProgress(80)
            downloadFile(blob, filename, formatConfig.extension)
            setExportProgress(100)

            toast.success(`Exported as ${formatConfig.label}!`)
            setTimeout(() => onClose(), 500)

        } catch (error) {
            console.error('Export error:', error)
            toast.error(error.response?.data?.message || `Export failed`)
            setExportProgress(0)
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-transparent">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary-100 rounded-lg">
                                            <ArrowDownTrayIcon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                Export {response ? 'Response' : 'Responses'}
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-600 mt-0.5">
                                                {response
                                                    ? 'Download this response in multiple formats'
                                                    : 'Download your response data in various formats'}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} disabled={isExporting} className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                    {/* Format Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            Select Export Format
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.values(EXPORT_FORMAT_CONFIG).map((config) => {
                                                const isSelected = selectedFormat === config.key
                                                return (
                                                    <button
                                                        key={config.key}
                                                        onClick={() => setSelectedFormat(config.key)}
                                                        disabled={isExporting}
                                                        className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                                                            isSelected
                                                                ? 'border-primary-500 bg-primary-50 shadow-sm'
                                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2">
                                                                <CheckCircleIcon className="w-5 h-5 text-primary-600" />
                                                            </div>
                                                        )}
                                                        <div className="text-3xl mb-2">{config.icon}</div>
                                                        <div className={`text-sm font-bold ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>
                                                            {config.label}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            {config.description}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* PDF Quality Option */}
                                    {selectedFormat === 'pdf' && (
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <label className="block text-sm font-medium text-blue-900 mb-3">
                                                📊 PDF Quality
                                            </label>
                                            <div className="flex gap-3">
                                                {[
                                                    { value: 'high', label: '🎨 High Quality (Larger file)', info: 'Best for printing' },
                                                    { value: 'medium', label: '📄 Medium (Balanced)', info: 'Recommended' },
                                                    { value: 'low', label: '⚡ Low (Faster)', info: 'Quick download' }
                                                ].map(q => (
                                                    <button
                                                        key={q.value}
                                                        onClick={() => setPdfQuality(q.value)}
                                                        className={`flex-1 p-2 rounded text-xs transition-colors ${
                                                            pdfQuality === q.value
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-white text-blue-900 border border-blue-200 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        <div className="font-semibold">{q.label}</div>
                                                        <div className="text-xs opacity-75">{q.info}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <h4 className="text-sm font-semibold text-amber-900 mb-2">
                                            ℹ️ Export Information
                                        </h4>
                                        <ul className="space-y-1 text-sm text-amber-800">
                                            <li>• Includes all selected responses with complete details</li>
                                            <li>• BoloIndia branding and logo included</li>
                                            <li>• Professional formatting and styling</li>
                                            <li>• Immediate download (no server processing)</li>
                                        </ul>
                                    </div>

                                    {/* Progress */}
                                    {isExporting && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700 font-medium">Exporting...</span>
                                                <span className="text-primary-600 font-semibold">{exportProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${exportProgress}%` }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isExporting}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting}
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {isExporting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Exporting...
                                            </>
                                        ) : (
                                            <>
                                                <ArrowDownTrayIcon className="w-5 h-5" />
                                                Export as {formatConfig.label}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ExportModalV2
