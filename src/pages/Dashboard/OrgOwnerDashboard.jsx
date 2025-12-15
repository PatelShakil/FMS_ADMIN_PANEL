import React from 'react'
import { Grid, Box, Typography, Card, CardContent, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orgService } from '../../api/services/orgService'
import { responseService } from '../../api/services/responseService'
import { feedbackService } from '../../api/services/feedbackService'
import { authService } from '../../api/services/authService'
import {
    PersonAdd as InviteIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'

// Components
import { OrgOwnerStatsCards } from './components/OrgOwnerStatsCards'
import { TeamMembersList } from './components/TeamMembersList'
import { OrgActivityChart } from './components/OrgActivityChart'
import { OrgQuickActions } from './components/OrgQuickActions'

export const OrgOwnerDashboard = ({ user }) => {
    const navigate = useNavigate()

    // Fetch organization details
    const { data: orgData, isLoading: orgLoading } = useQuery({
        queryKey: ['my-organization'],
        queryFn: () => orgService.getMyOrg(),
    })

    // Fetch organization statistics
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['org-owner-stats', user?.orgId],
        queryFn: async () => {
            const [forms, responses, realtimeStats] = await Promise.all([
                feedbackService.getAllForms({ orgId: user.orgId, page: 1, limit: 1 }),
                responseService.getAllResponses({ orgId: user.orgId, page: 1, limit: 1 }),
                responseService.getRealtimeStats({ orgId: user.orgId }),
            ])

            return {
                totalForms: forms?.pagination?.totalItems || 0,
                totalResponses: responses?.pagination?.totalItems || 0,
                realtimeStats: realtimeStats.data,
            }
        },
    })

    // Fetch team members (org admins)
    const { data: teamData } = useQuery({
        queryKey: ['team-members', user?.orgId],
        queryFn: () => authService.getTeamMembers(user?.orgId), // You'll need to create this endpoint
        enabled: !!user?.orgId,
    })

    const stats = {
        totalAdmins: teamData?.data?.length || 0,
        activeAdmins: teamData?.data?.filter(member => member.accountStatus === 'ACTIVE')?.length || 0,
        totalForms: statsData?.totalForms || 0,
        totalResponses: statsData?.realtimeStats?.total || 0,
        pendingResponses: statsData?.realtimeStats?.pending || 0,
        resolvedToday: statsData?.realtimeStats?.resolved || 0,
        registered: statsData?.realtimeStats?.registered || 0,
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Organization Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back, {user?.fullName}! Manage your organization and team.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<InviteIcon />}
                    onClick={() => navigate('/team/invite')}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                    Invite Admin
                </Button>
            </Box>

            {/* Stats Cards */}
            <OrgOwnerStatsCards stats={stats} loading={statsLoading} />

            {/* Organization Info Card */}
            <Grid item xs={12} sx={{ mt: 2 }} className={"w-full"}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Organization Information
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate('/my-organization')}
                            >
                                View Details
                            </Button>
                        </Box>
                        <Grid container spacing={2} className={"w-full justify-around"} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Organization Name
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {orgData?.data?.orgName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Organization Type
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {orgData?.data?.orgType}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Location
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {orgData?.data?.city}, {orgData?.data?.state}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Contact
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {orgData?.data?.phone}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
            {/* Main Content */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <OrgQuickActions orgData={orgData?.data} totalAdmins={teamData?.data?.length || 0} />
                </Grid>

                {/* Activity Chart */}
                <Grid item xs={12} md={8} className={"w-4/6"}>
                    <OrgActivityChart stats={stats} />
                </Grid>

                {/* Team Members List */}
                <Grid item xs={12} className={"w-full"}>
                    <TeamMembersList data={teamData?.data} />
                </Grid>

            </Grid>
        </Box>
    )
}
