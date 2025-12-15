// pages/Responses/ResponsesPage.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { responseService } from '../../api/services/responseService'
import { feedbackService } from '../../api/services/feedbackService'
import useResponseStore from '../../store/responseStore'
import { Helmet } from 'react-helmet'

// Components
import FormQuickSelector from './components/FormSelector/FormQuickSelector'
import ResponseStatsCards from './components/Stats/ResponseStatsCards'
import ResponseFilters from './components/ResponseFilters/ResponseFilters'
import ResponseTable from './components/ResponseList/ResponseTable'
import ResponseCompactView from './components/ResponseList/ResponseCompactView'
import ResponseGridView from './components/ResponseList/ResponseGridView'
import ViewModeSwitcher from './components/ResponseList/ViewModeSwitcher'
import ResponseDetailDrawer from './components/ResponseDetail/ResponseDetailDrawer'

// Icons
import {FunnelIcon, ArrowPathIcon, ArrowDownTrayIcon} from '@heroicons/react/24/outline'
import ServiceSelector from "./components/ServiceSelector/ServiceSelector.jsx";
import ExportModal from "./components/Actions/ExportModal.jsx";
import ExportModalV2 from "./components/Actions/ExportModalV2.jsx";

const ResponsesPage = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [showExportModal, setShowExportModal] = useState(false)

    // Store
    const { selectedFormId,selectedResponses, filters, viewMode, detailDrawerOpen } = useResponseStore()

    // Fetch form metadata
    const { data: formData, isLoading: formLoading } = useQuery({
        queryKey: ['form', selectedFormId],
        queryFn: () => feedbackService.getFormById(selectedFormId),
        enabled: !!selectedFormId
    })

    // Fetch responses
    const {
        data: responsesData,
        isLoading: responsesLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ['responses', selectedFormId, filters],
        queryFn: () =>
            responseService.getAllResponses({
                formId: selectedFormId,
                ...filters
            }),
        enabled: !!selectedFormId,
        refetchInterval: 30000 // Poll every 30 seconds
    })


    if (!selectedFormId) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <Helmet>
                    <title>Responses - BoloIndia</title>
                </Helmet>

                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Response Management</h1>
                        <p className="text-gray-600 mt-2">
                            Select a form to view and manage responses
                        </p>
                    </div>

                    <FormQuickSelector />
                </div>
            </div>
        )
    }

    const responses = responsesData?.data || []
    const pagination = responsesData?.pagination || {}

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>
                    {formData?.data?.formName || 'Responses'} - BoloIndia
                </title>
            </Helmet>

            <div className="p-6 max-w-[1920px] mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {formData?.data?.formName || 'Loading...'}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {formData?.data?.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Refresh */}
                            <button
                                onClick={() => refetch()}
                                disabled={isRefetching}
                                className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${
                                    isRefetching ? 'animate-spin' : ''
                                }`}
                                title="Refresh"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                            </button>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                    showFilters
                                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FunnelIcon className="w-5 h-5" />
                                Filters
                            </button>
                            <ServiceSelector /> {/* ADD THIS */}

                            {/* View Mode Switcher */}
                            <ViewModeSwitcher />

                            {/* Change Form */}
                            <FormQuickSelector compact />
                        </div>
                        <div className="flex items-center gap-3">
                            {/* EXPORT BUTTON - ADD THIS */}
                            {/* Selection Count */}
                            {selectedResponses.length > 0 && (
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                            {selectedResponses.length} selected
                        </span>
                            )}
                            <button
                                onClick={() => setShowExportModal(true)}
                                disabled={!selectedFormId}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={!selectedFormId ? 'Select a form to export' : 'Export responses'}
                            >
                                <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-700">Export</span>
                            </button>

                            {/* ... other buttons ... */}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <ResponseStatsCards formId={selectedFormId} />
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mb-6">
                        <ResponseFilters formData={formData?.data} />
                    </div>
                )}

                {/* Response List */}
                <div className="bg-white rounded-xl shadow-sm">
                    {responsesLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                            <p className="text-gray-600 mt-4">Loading responses...</p>
                        </div>
                    ) : responses.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-600">No responses found</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'table' && (
                                <ResponseTable
                                    responses={responses}
                                    formData={formData?.data}
                                    pagination={pagination}
                                />
                            )}
                            {viewMode === 'compact' && (
                                <ResponseCompactView
                                    responses={responses}
                                    pagination={pagination}
                                />
                            )}
                            {viewMode === 'grid' && (
                                <ResponseGridView
                                    responses={responses}
                                    pagination={pagination}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Detail Drawer */}
            {detailDrawerOpen && <ResponseDetailDrawer />}
            {/* EXPORT MODAL - ADD THIS */}
            {/*{showExportModal && (*/}
            {/*    <ExportModal*/}
            {/*        isOpen={showExportModal}*/}
            {/*        onClose={() => setShowExportModal(false)}*/}
            {/*        filters={{...filters,formId: selectedFormId}}*/}
            {/*    />*/}
            {/*)}*/}
            {showExportModal && (
                <ExportModalV2
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    selectedResponses={selectedResponses}
                    formData={formData?.data}
                    filters={{...filters,formId: selectedFormId}}
                />
            )}
        </div>
    )
}

export default ResponsesPage
