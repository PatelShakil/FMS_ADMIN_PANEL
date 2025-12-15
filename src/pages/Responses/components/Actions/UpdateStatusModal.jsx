// pages/Responses/components/Actions/UpdateStatusModal.jsx - CORRECTED
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { responseService } from '../../../../api/services/responseService'
import { XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const UpdateStatusModal = ({ isOpen, onClose, response }) => {
    const queryClient = useQueryClient()
    const [selectedAction, setSelectedAction] = useState(null) // 'REVIEWED' or 'RESOLVED'
    const [notes, setNotes] = useState('')

    const updateMutation = useMutation({
        mutationFn: async ({ action, notes }) => {
            if (action === 'REVIEWED') {
                return await responseService.reviewResponse(response.responseId, notes)
            } else if (action === 'RESOLVED') {
                return await responseService.resolveResponse(response.responseId, notes)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['responses'])
            queryClient.invalidateQueries(['response', response.responseId])
            queryClient.invalidateQueries(['formAnalytics'])
            toast.success('Status updated successfully')
            onClose()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!selectedAction) {
            toast.error('Please select an action')
            return
        }

        if (selectedAction === 'RESOLVED' && !notes.trim()) {
            toast.error('Resolution notes are required')
            return
        }

        updateMutation.mutate({ action: selectedAction, notes: notes.trim() || null })
    }

    // Only show actions based on current status
    const availableActions = []
    if (response?.status === 'PENDING') {
        availableActions.push({ key: 'REVIEWED', label: '👁️ Mark as Reviewed', color: 'blue' })
        availableActions.push({ key: 'RESOLVED', label: '✅ Mark as Resolved', color: 'green' })
    } else if (response?.status === 'REVIEWED') {
        availableActions.push({ key: 'RESOLVED', label: '✅ Mark as Resolved', color: 'green' })
    }

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
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
                            <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                                        Update Response Status
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-1 hover:bg-gray-100 rounded-lg"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    {/* Current Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Status
                                        </label>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                                            {response?.status || 'PENDING'}
                                        </div>
                                    </div>

                                    {/* Select Action */}
                                    {availableActions.length === 0 ? (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <p className="text-sm text-amber-800">
                                                This response has already been resolved. No further actions available.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Action
                                                </label>
                                                <div className="space-y-2">
                                                    {availableActions.map((action) => (
                                                        <button
                                                            key={action.key}
                                                            type="button"
                                                            onClick={() => setSelectedAction(action.key)}
                                                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                                                selectedAction === action.key
                                                                    ? `border-${action.color}-500 bg-${action.color}-50`
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <div className={`font-semibold ${
                                                                selectedAction === action.key
                                                                    ? `text-${action.color}-700`
                                                                    : 'text-gray-700'
                                                            }`}>
                                                                {action.label}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {selectedAction === 'RESOLVED' ? 'Resolution Notes' : 'Notes (Optional)'}
                                                    {selectedAction === 'RESOLVED' && (
                                                        <span className="text-red-500 ml-1">*</span>
                                                    )}
                                                </label>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    rows={4}
                                                    required={selectedAction === 'RESOLVED'}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                                    placeholder={
                                                        selectedAction === 'RESOLVED'
                                                            ? 'Explain how the issue was resolved...'
                                                            : 'Add any notes...'
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Actions */}
                                    {availableActions.length > 0 && (
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={
                                                    updateMutation.isPending ||
                                                    !selectedAction ||
                                                    (selectedAction === 'RESOLVED' && !notes.trim())
                                                }
                                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {updateMutation.isPending ? 'Updating...' : 'Update Status'}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default UpdateStatusModal
