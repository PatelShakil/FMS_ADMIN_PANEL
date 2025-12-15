// src/pages/Dashboard/OrgAdminDashboard.jsx

import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Add as AddIcon,
    QrCode as QrCodeIcon,
    Assignment as FormIcon
} from '@mui/icons-material';

// Import existing reusable components
import {StatsCards} from './components/StatsCards';
import {ResponseTrendChart} from './components/ResponseTrendChart';
import {TopFormsTable} from './components/TopFormsTable';
import {RecentResponses} from './components/RecentResponses';
import {DeviceBreakdown} from './components/DeviceBreakdown';

// Import services
import {responseService} from '../../api/services/responseService';
import {feedbackService} from '../../api/services/feedbackService';
import {qrService} from '../../api/services/qrService';
import {useAuthStore} from "../../store/authStore.js";

export const OrgAdminDashboard = ({ user }) => {
    const navigate = useNavigate();
    const {role} = useAuthStore();

    // Fetch real-time stats
    const { data: realtimeStats, isLoading: statsLoading } = useQuery({
        queryKey: ['realtime-stats', user?.orgId],
        queryFn: () => responseService.getRealtimeStats({ orgId: user?.orgId }),
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    // Fetch dashboard analytics
    const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
        queryKey: ['dashboard-analytics', user?.orgId],
        queryFn: () => responseService.getDashboardAnalytics({ orgId: user?.orgId }),
    });

    // Fetch top forms
    const { data: topForms } = useQuery({
        queryKey: ['top-forms', user?.orgId],
        queryFn: () => feedbackService.getAllForms({
            orgId: user?.orgId,
            page: 1,
            limit: 5
        }),
    });

    // Fetch recent responses
    const { data: recentResponses } = useQuery({
        queryKey: ['recent-responses', user?.orgId],
        queryFn: () => responseService.getAllResponses({
            orgId: user?.orgId,
            page: 1,
            limit: 5,
            sortBy: 'submittedAt',
            sortOrder: 'desc',
        }),
    });

    // Fetch QR stats
    const { data: qrStats } = useQuery({
        queryKey: ['qr-stats', user?.orgId],
        queryFn: () => qrService.getOrgQRAnalytics( user?.orgId ),
        enabled: !!user?.orgId && role === 'ORG_OWNER'
    });

    const stats = {
        totalForms: topForms?.data?.pagination?.totalItems || 0,
        totalResponses: realtimeStats?.data?.totalResponses || 0,
        pendingResponses: realtimeStats?.data?.pendingResponses || 0,
        resolvedToday: realtimeStats?.data?.resolvedToday || 0,
        totalQRCodes: qrStats?.data?.totalQRCodes || 0,
        activeQRCodes: qrStats?.data?.activeQRCodes || 0,
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back, {user?.fullName}! Manage services, forms, and QR codes.
                    </Typography>
                </Box>

                {/* Quick Action Buttons */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FormIcon />}
                        onClick={() => navigate('/feedback/forms/create')}
                    >
                        Create Form
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<QrCodeIcon />}
                        onClick={() => navigate('/qr/management')}
                    >
                        Generate QR
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards - Reusing existing component */}
            <StatsCards
                data={realtimeStats?.data}
                qrStats={qrStats?.data}
                loading={statsLoading}
                role="ORGADMIN"
            />

            {/* Main Content Grid */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Response Trend Chart */}
                {/*<Grid item xs={12} lg={8}>*/}
                {/*    <ResponseTrendChart*/}
                {/*        data={dashboardData?.data?.hourlyDistribution}*/}
                {/*        loading={dashboardLoading}*/}
                {/*    />*/}
                {/*</Grid>*/}

                {/* Device Breakdown */}
                <Grid item xs={12} lg={4} className={
                    "w-1/4"
                }>
                    <DeviceBreakdown
                        data={dashboardData?.data?.deviceBreakdown}
                        loading={dashboardLoading}
                    />
                </Grid>

                {/* Top Forms Table */}
                <Grid item xs={12} lg={6} className={"w-2/3"}>
                    <TopFormsTable data={topForms?.data} />
                </Grid>

                {/* Recent Responses */}
                <Grid item xs={12} lg={6} className={"w-full"}>
                    <RecentResponses data={recentResponses?.data} />
                </Grid>
            </Grid>
        </Box>
    );
};
