import React, {useEffect} from 'react'
import { Grid, Box, Typography, Card, CardContent } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { orgService } from '../../api/services/orgService'
import { responseService } from '../../api/services/responseService'
import { feedbackService } from '../../api/services/feedbackService'

// Components
import { PlatformStatsCards } from './components/PlatformStatsCards'
// import { OrganizationsList } from './components/OrganizationsList'
import { PendingApprovals } from './components/PendingApprovals'
import { PlatformActivityChart } from './components/PlatformActivityChart'
import { RecentOrganizations } from './components/RecentOrganizations'

export const PlatformAdminDashboard = ({ user }) => {
    // Fetch all organizations
    const { data: orgsData, isLoading: orgsLoading } = useQuery({
        queryKey: ['all-organizations'],
        queryFn: () => orgService.getAllOrgs({ page: 1, limit: 100 }),
    })

    // Fetch pending organizations (waiting for approval)
    const { data: pendingOrgs } = useQuery({
        queryKey: ['pending-organizations'],
        queryFn: () => orgService.getAllOrgs({ status: 'PENDING' }),
    })

    // Fetch platform-wide statistics
    // const { data: platformStats, isLoading: statsLoading } = useQuery({
    //     queryKey: ['platform-stats'],
    //     queryFn: async () => {
    //         // Get stats from multiple sources
    //         const [forms, responses] = await Promise.all([
    //             feedbackService.getAllForms({ page: 1, limit: 1 }),
    //             responseService.getAllResponses({ page: 1, limit: 1 }),
    //         ])
    //
    //         return {
    //             totalForms: forms.data?.pagination?.totalItems || 0,
    //             totalResponses: responses.data?.pagination?.totalItems || 0,
    //         }
    //     },
    // })
    // useEffect(() => {
    //     console.log(orgsData?.data)
    // }, [orgsData]);
    //

    const stats = {
        totalOrganizations: orgsData?.data.length || 0,
        pendingOrganizations: pendingOrgs?.data?.length || 0,
        activeOrganizations: orgsData?.data?.filter(org => org.status === 'APPROVED')?.length || 0,
        // totalForms: platformStats?.totalForms || 0,
        // totalResponses: platformStats?.totalResponses || 0,
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Platform Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Welcome back, {user?.fullName}! Manage organizations and monitor platform activity.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <PlatformStatsCards stats={stats} loading={orgsLoading} />

            {/* Main Content */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Pending Approvals - Priority */}
                {stats.pendingOrganizations > 0 && (
                    <Grid item xs={12}>
                        <PendingApprovals data={pendingOrgs?.data?.data} />
                    </Grid>
                )}

                {/* Recent Organizations */}
                <Grid item xs={12} lg={8}>
                    <RecentOrganizations data={orgsData?.data} />
                </Grid>

                {/* Platform Activity Chart */}
                <Grid item xs={12} lg={4}>
                    <PlatformActivityChart stats={stats} />
                </Grid>
            </Grid>
        </Box>
    )
}
