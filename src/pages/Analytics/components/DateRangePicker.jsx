// pages/Analytics/components/DateRangePicker.jsx
import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

const DateRangePicker = ({ startDate, endDate, onChange }) => {
    const [open, setOpen] = useState(false)

    const presets = [
        { label: 'Last 7 days', days: 7 },
        { label: 'Last 30 days', days: 30 },
        { label: 'Last 90 days', days: 90 },
    ]

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                    {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd')}
                </span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50 p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Quick Select</p>
                        <div className="space-y-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.days}
                                    onClick={() => {
                                        onChange({
                                            startDate: new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000),
                                            endDate: new Date()
                                        })
                                        setOpen(false)
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 rounded"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default DateRangePicker
