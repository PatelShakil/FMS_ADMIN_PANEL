// pages/Responses/components/ResponseFilters/ResponseFilters.jsx
import { useState } from 'react'
import useResponseStore from '../../../../store/responseStore'
import { STATUS_CONFIG } from '../../constants/statuses'
import { XMarkIcon } from '@heroicons/react/24/outline'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ResponseFilters = ({ formData }) => {
    const { filters, setFilters, resetFilters } = useResponseStore()

    const handleStatusToggle = (status) => {
        const current = filters.status || null
        const updated = current == status
            ? null
            : status
        setFilters({ status: updated })
    }

    const hasActiveFilters =
        filters.status ||
        filters.startDate ||
        filters.endDate ||
        filters.isFlagged !== null ||
        filters.search

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                            const isSelected = filters.status === key
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleStatusToggle(key)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isSelected
                                            ? `${config.bgColor} ${config.textColor} border-2 ${config.borderColor}`
                                            : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="mr-1">{config.icon}</span>
                                    {config.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <DatePicker
                            selected={filters.startDate ? new Date(filters.startDate) : null}
                            onChange={(date) => setFilters({ startDate: date?.toISOString() })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholderText="Select start date"
                            dateFormat="MMM dd, yyyy"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date
                        </label>
                        <DatePicker
                            selected={filters.endDate ? new Date(filters.endDate) : null}
                            onChange={(date) => setFilters({ endDate: date?.toISOString() })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholderText="Select end date"
                            dateFormat="MMM dd, yyyy"
                            minDate={filters.startDate ? new Date(filters.startDate) : null}
                        />
                    </div>
                </div>

                {/* Flagged Toggle */}
                <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.isFlagged === true}
                            onChange={(e) =>
                                setFilters({ isFlagged: e.target.checked ? true : null })
                            }
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Show flagged only
                        </span>
                    </label>
                </div>

                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                    </label>
                    <input
                        type="text"
                        value={filters.search || ''}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        placeholder="Search in responses..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>
        </div>
    )
}

export default ResponseFilters
