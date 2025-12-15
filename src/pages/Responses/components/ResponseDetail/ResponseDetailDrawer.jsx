// pages/Responses/components/ResponseDetail/ResponseDetailDrawer.jsx
import { Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, Transition } from '@headlessui/react'
import useResponseStore from '../../../../store/responseStore'
import { responseService } from '../../../../api/services/responseService'
import { feedbackService } from '../../../../api/services/feedbackService'
import { XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ResponseHeader from './ResponseHeader'
import ResponseFields from './ResponseFields'
import ResponseStatusTimeline from './ResponseStatusTimeline'

const ResponseDetailDrawer = () => {
    const navigate = useNavigate()
    const { detailDrawerOpen, selectedResponseId, closeDetailDrawer } = useResponseStore()

    // Fetch response details
    const { data: responseData, isLoading } = useQuery({
        queryKey: ['response', selectedResponseId],
        queryFn: () => responseService.getResponseById(selectedResponseId),
        enabled: !!selectedResponseId
    })

    // Fetch form structure
    const response = responseData?.data
    const { data: formData } = useQuery({
        queryKey: ['form', response?.formId],
        queryFn: () => feedbackService.getFormById(response?.formId),
        enabled: !!response?.formId
    })

    const handleOpenFullPage = () => {
        closeDetailDrawer()
        navigate(`/responses/${selectedResponseId}`)
    }

    return (
        <Transition show={detailDrawerOpen} as={Fragment}>
            <Dialog onClose={closeDetailDrawer} className="relative z-50">
                {/* Backdrop */}
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

                {/* Drawer */}
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto pt-16 w-screen max-w-2xl">
                                    <div className="flex h-full flex-col bg-white shadow-xl">
                                        {/* Header */}
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                    Response Details
                                                </Dialog.Title>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={handleOpenFullPage}
                                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                        title="Open full page"
                                                    >
                                                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={closeDetailDrawer}
                                                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 overflow-y-auto">
                                            {isLoading ? (
                                                <div className="p-8 text-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                                                    <p className="text-gray-600 mt-4">
                                                        Loading response...
                                                    </p>
                                                </div>
                                            ) : response ? (
                                                <div className="p-6 space-y-6">
                                                    <ResponseHeader response={response} />
                                                    <ResponseFields
                                                        response={response}
                                                        formData={formData?.data}
                                                    />
                                                    <ResponseStatusTimeline response={response} />
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center text-gray-600">
                                                    Response not found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ResponseDetailDrawer
