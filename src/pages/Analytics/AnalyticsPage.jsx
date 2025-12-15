// pages/Analytics/AnalyticsPage.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { responseService } from '../../api/services/responseService'
import { feedbackService } from '../../api/services/feedbackService'
import { orgService } from '../../api/services/orgService'
import { subDays, format } from 'date-fns'
import ResponseTrendChart from './components/ResponseTrendChart'
import StatusDistributionChart from './components/StatusDistributionChart'
import DeviceBreakdownChart from './components/DeviceBreakdownChart'
import TopFormsChart from './components/TopFormsChart'
import HourlyDistributionChart from './components/HourlyDistributionChart'
import LocationBreakdown from './components/LocationBreakdown'
import MetricCard from './components/MetricCard'
import DateRangePicker from './components/DateRangePicker'
import {
    ArrowTrendingUpIcon,
    ChartBarIcon,
    ChartPieIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import {useAuthStore} from "../../store/authStore.js";

const AnalyticsPage = () => {
    const { user,role } = useAuthStore()
    const [dateRange, setDateRange] = useState({
        startDate: subDays(new Date(), 30),
        endDate: new Date()
    })

    // Get org
    const { data: orgData } = useQuery({
        queryKey: ['myOrg'],
        queryFn: () => role == "ORG_OWNER" ? orgService.getMyOrg() : orgService.getOrgById(user?.orgId),
        enabled: role !== 'PLATFORM_ADMIN'
    })

    const orgId = role === 'PLATFORM_ADMIN' ? null : orgData?.data?.id

    // Fetch analytics data
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['analytics-dashboard', orgId, dateRange],
        queryFn: () => responseService.getDashboardAnalytics({
            orgId,
            startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
            endDate: format(dateRange.endDate, 'yyyy-MM-dd')
        })
    })

    const { data: deviceData } = useQuery({
        queryKey: ['device-breakdown', orgId],
        queryFn: () => responseService.getDeviceBreakdown({ orgId })
    })

    const { data: locationData } = useQuery({
        queryKey: ['location-breakdown', orgId],
        queryFn: () => responseService.getLocationBreakdown({ orgId, limit: 10 })
    })

    const { data: topFormsData } = useQuery({
        queryKey: ['top-forms', orgId],
        queryFn: () => responseService.getTopForms({ orgId, limit: 10 })
    })

    const stats = dashboardData?.data?.overview || {}

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                            <p className="text-gray-600 mt-1">
                                Insights and trends for your feedback responses
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <DateRangePicker
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                                onChange={setDateRange}
                            />
                            <button

                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Export Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Total Responses"
                        value={stats.total || 0}
                        change="+12%"
                        icon={ArrowTrendingUpIcon}
                        color="blue"
                    />
                    <MetricCard
                        title="Pending"
                        value={stats.pending || 0}
                        change="-5%"
                        icon={ChartBarIcon}
                        color="yellow"
                    />
                    <MetricCard
                        title="Resolved"
                        value={stats.resolved || 0}
                        change="+8%"
                        icon={ChartPieIcon}
                        color="green"
                    />
                    <MetricCard
                        title="Resolution Rate"
                        value={`${Math.round((stats.resolved / stats.total) * 100) || 0}%`}
                        change="+3%"
                        icon={ArrowTrendingUpIcon}
                        color="purple"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ResponseTrendChart data={stats.trendData} isLoading={isLoading} />
                    <StatusDistributionChart data={stats} isLoading={isLoading} />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DeviceBreakdownChart data={deviceData?.data} />
                    <TopFormsChart data={topFormsData?.data} />
                    <HourlyDistributionChart data={dashboardData?.data?.hourlyDistribution} />
                </div>

                {/* Location Breakdown */}
                <LocationBreakdown data={locationData?.data} />
            </div>
        </div>
    )
}

export default AnalyticsPage
