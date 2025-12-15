// pages/Responses/components/Actions/FlagResponseModal.jsx
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { responseService } from '../../../../api/services/responseService'
import { XMarkIcon, FlagIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const FLAG_REASONS = [
    { value: 'SPAM', label: '🚫 Spam or irrelevant content' },
    { value: 'OFFENSIVE', label: '⚠️ Offensive or inappropriate' },
    { value: 'DUPLICATE', label: '📋 Duplicate response' },
    { value: 'INCOMPLETE', label: '❓ Incomplete information' },
    { value: 'URGENT', label: '🔴 Requires urgent attention' },
    { value: 'OTHER', label: '📝 Other reason' }
]

const FlagResponseModal = ({ isOpen, onClose, response }) => {
    const queryClient = useQueryClient()
    const [selectedReason, setSelectedReason] = useState('')
    const [customReason, setCustomReason] = useState('')

    const isFlagged = response?.isFlagged

    const flagMutation = useMutation({
        mutationFn: (data) => responseService.flagResponse(response.responseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['responses'])
            queryClient.invalidateQueries(['response', response.responseId])
            toast.success(isFlagged ? 'Flag removed successfully' : 'Response flagged successfully')
            onClose()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to flag response')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if (isFlagged) {
            // Unflag
            flagMutation.mutate({ isFlagged: false, flagReason: null })
        } else {
            // Flag
            const reason = selectedReason === 'OTHER' ? customReason : selectedReason
            flagMutation.mutate({ isFlagged: true, flagReason: reason })
        }
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
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <FlagIcon className="w-5 h-5 text-red-600" />
                                        </div>
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            {isFlagged ? 'Remove Flag' : 'Flag Response'}
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1 hover:bg-gray-100 rounded-lg"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    {isFlagged ? (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                            <p className="text-sm text-amber-800">
                                                This response is currently flagged. Click "Remove Flag" to unflag it.
                                            </p>
                                            {response.flagReason && (
                                                <p className="text-sm text-amber-700 mt-2">
                                                    <span className="font-semibold">Reason:</span> {response.flagReason}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-600">
                                                Select a reason for flagging this response:
                                            </p>

                                            {/* Reasons */}
                                            <div className="space-y-2">
                                                {FLAG_REASONS.map((reason) => (
                                                    <label
                                                        key={reason.value}
                                                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                                            selectedReason === reason.value
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="reason"
                                                            value={reason.value}
                                                            checked={selectedReason === reason.value}
                                                            onChange={(e) => setSelectedReason(e.target.value)}
                                                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {reason.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>

                                            {/* Custom Reason */}
                                            {selectedReason === 'OTHER' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Please specify
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <textarea
                                                        value={customReason}
                                                        onChange={(e) => setCustomReason(e.target.value)}
                                                        rows={3}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                        placeholder="Enter your reason..."
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Actions */}
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
                                                flagMutation.isPending ||
                                                (!isFlagged && !selectedReason) ||
                                                (selectedReason === 'OTHER' && !customReason.trim())
                                            }
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                isFlagged
                                                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                                                    : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                        >
                                            {flagMutation.isPending
                                                ? 'Processing...'
                                                : isFlagged
                                                    ? 'Remove Flag'
                                                    : 'Flag Response'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default FlagResponseModal
