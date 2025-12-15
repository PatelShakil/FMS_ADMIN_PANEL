// pages/Responses/components/Stats/ResponseStatsCards.jsx
import { useQuery } from '@tanstack/react-query'
import { responseService } from '../../../../api/services/responseService'
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon
} from '@heroicons/react/24/outline'

const ResponseStatsCards = ({ formId }) => {
    const { data: analyticsData, isLoading } = useQuery({
        queryKey: ['formAnalytics', formId],
        queryFn: () => responseService.getFormAnalytics(formId, { days: 7 }),
        enabled: !!formId
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                    </div>
                ))}
            </div>
        )
    }

    const stats = analyticsData?.data || {}

    const cards = [
        {
            label: 'Total Responses',
            value: stats.totals.totalResponses || 0,
            icon: ClockIcon,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            label: 'Pending',
            value: stats.pendingCount || 0,
            icon: ClockIcon,
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            label: 'Registered',
            value: stats.registeredResponses || 0,
            icon: CheckCircleIcon,
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            label: 'Flagged',
            value: stats.totals.flaggedResponses || 0,
            icon: FlagIcon,
            color: 'red',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {card.value.toLocaleString()}
                            </p>
                        </div>
                        <div className={`p-3 rounded-lg ${card.bgColor}`}>
                            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ResponseStatsCards
