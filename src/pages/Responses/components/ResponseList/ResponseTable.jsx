// pages/Responses/components/ResponseList/ResponseTable.jsx
import { useState } from 'react'
import useResponseStore from '../../../../store/responseStore'
import { STATUS_CONFIG } from '../../constants/statuses'
import { formatDistanceToNow } from 'date-fns'
import {
    ChevronUpIcon,
    ChevronDownIcon,
    EllipsisVerticalIcon,
    FlagIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline'
import { FlagIcon as FlagIconSolid } from '@heroicons/react/24/solid'

const ResponseTable = ({ responses, formData, pagination }) => {
    const { openDetailDrawer, selectedResponses, toggleResponseSelection } = useResponseStore()
    const { filters, setFilters } = useResponseStore()
    const [actionMenuOpen, setActionMenuOpen] = useState(null)

    const handleSort = (field) => {
        const newOrder =
            filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc'
        setFilters({ sortBy: field, sortOrder: newOrder })
    }

    const SortIcon = ({ field }) => {
        if (filters.sortBy !== field) return null
        return filters.sortOrder === 'asc' ? (
            <ChevronUpIcon className="w-4 h-4" />
        ) : (
            <ChevronDownIcon className="w-4 h-4" />
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    {/* Checkbox */}
                    <th className="px-4 py-3 w-12">
                        <input
                            type="checkbox"
                            checked={
                                responses.length > 0 &&
                                responses.every((r) => selectedResponses.includes(r.responseId))
                            }
                            onChange={(e) => {
                                if (e.target.checked) {
                                    useResponseStore
                                        .getState()
                                        .selectAllResponses(responses.map((r) => r.responseId))
                                } else {
                                    useResponseStore.getState().clearSelection()
                                }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                    </th>

                    {/* ID */}
                    <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('responseId')}
                    >
                        <div className="flex items-center gap-2">
                            ID
                        </div>
                    </th>

                    {/* Status */}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                    </th>

                    {/* Citizen */}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Citizen
                    </th>

                    {/* Location */}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Location
                    </th>

                    {/* QR Code */}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        QR Code
                    </th>

                    {/* Date */}
                    <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createdAt')}
                    >
                        <div className="flex items-center gap-2">
                            Submitted
                            <SortIcon field="submittedAt" />
                        </div>
                    </th>

                    {/* Actions */}
                    <th className="px-4 py-3 w-20"></th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {responses.map((response) => (
                    <ResponseRow
                        key={response.responseId}
                        response={response}
                        isSelected={selectedResponses.includes(response.responseId)}
                        onToggleSelect={() => toggleResponseSelection(response.responseId)}
                        onView={() => openDetailDrawer(response.responseId)}
                        actionMenuOpen={actionMenuOpen === response.responseId}
                        setActionMenuOpen={setActionMenuOpen}
                    />
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination pagination={pagination} />
                </div>
            )}
        </div>
    )
}

const ResponseRow = ({
                         response,
                         isSelected,
                         onToggleSelect,
                         onView,
                         actionMenuOpen,
                         setActionMenuOpen
                     }) => {
    const statusConfig = STATUS_CONFIG[response.status] || STATUS_CONFIG.PENDING

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Checkbox */}
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggleSelect}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
            </td>

            {/* ID */}
            <td className="px-4 py-3">
                <button
                    onClick={onView}
                    className="font-mono text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    #{response.responseId?.slice(-8)}
                </button>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {response.isFlagged && (
                        <FlagIconSolid className="w-4 h-4 text-red-500" title="Flagged" />
                    )}
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                        {statusConfig.label}
                    </span>
                </div>
            </td>

            {/* Citizen */}
            <td className="px-4 py-3 text-sm text-gray-900">
                {response.citizenEmail || response.citizenPhone || (
                    <span className="text-gray-400 italic">Anonymous</span>
                )}
            </td>

            {/* Location */}
            <td className="px-4 py-3 text-sm text-gray-600">
                {response.location?.city || response.location?.state || '-'}
            </td>

            {/* QR Code */}
            <td className="px-4 py-3">
                {response.qrCodeId ? (
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {response.qrCodeId.slice(-6)}
                    </span>
                ) : (
                    <span className="text-gray-400 text-sm">-</span>
                )}
            </td>

            {/* Date */}
            <td className="px-4 py-3 text-sm text-gray-600">
                {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
            </td>

            {/* Actions */}
            <td className="px-4 py-3 relative">
                <button
                    onClick={() =>
                        setActionMenuOpen(actionMenuOpen ? null : response.responseId)
                    }
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                </button>

                {actionMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActionMenuOpen(null)}
                        />
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <button
                                onClick={() => {
                                    onView()
                                    setActionMenuOpen(null)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <EyeIcon className="w-4 h-4" />
                                View Details
                            </button>
                            <button
                                onClick={() => {
                                    onUpdate()
                                    setActionMenuOpen(null)
                                }}
                                disabled={response.status === 'RESOLVED'}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <PencilIcon className="w-4 h-4" />
                                Update Status
                            </button>
                            <button
                                onClick={() => {
                                    onFlag()
                                    setActionMenuOpen(null)
                                }}
                                disabled={response.status === 'RESOLVED'}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <FlagIcon className="w-4 h-4" />
                                Flag Response
                            </button>
                            <hr className="my-1" />
                            <button
                                onClick={() => {
                                    onDelete()
                                    setActionMenuOpen(null)
                                }}
                                disabled={response.status === 'RESOLVED'}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <TrashIcon className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </td>
        </tr>
    )
}

const Pagination = ({ pagination }) => {
    const { filters, setFilters } = useResponseStore()
    const { currentPage, totalPages, pageSize, totalItems } = pagination

    const pages = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i)
            pages.push('...')
            pages.push(totalPages)
        } else if (currentPage >= totalPages - 3) {
            pages.push(1)
            pages.push('...')
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            pages.push('...')
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
            pages.push('...')
            pages.push(totalPages)
        }
    }

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalItems)}
                </span>{' '}
                of <span className="font-medium">{totalItems}</span> results
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setFilters({ page: currentPage - 1 })}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {pages.map((page, idx) =>
                    page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => setFilters({ page })}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                currentPage === page
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => setFilters({ page: currentPage + 1 })}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default ResponseTable
