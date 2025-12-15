import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import {
    TrendingUp as TrendingUpIcon,
    Pending as PendingIcon,
    CheckCircle as CheckCircleIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
} from '@mui/icons-material'
// Add these imports at the top
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const StatCard = ({ title, value, icon, color, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" height={40} />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 4,
                    height: '100%',
                    bgcolor: color,
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {value || 0}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            bgcolor: `${color}20`,
                            color: color,
                            p: 1.5,
                            borderRadius: 2,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

// Update the component
export const StatsCards = ({ data, qrStats, orgStats, loading, role }) => {
    const stats = [
        {
            title: 'Total Responses',
            value: data?.total || 0,
            icon: <DescriptionIcon />,
            color: '#1976d2',
        },
        {
            title: 'Pending Reviews',
            value: data?.pending || 0,
            icon: <PendingIcon />,
            color: '#ed6c02',
        },
        {
            title: 'Resolved Today',
            value: data?.resolved || 0,
            icon: <CheckCircleIcon />,
            color: '#2e7d32',
        },
        {
            title: 'Registered Forms',
            value: data?.registered || 0,
            icon: <TrendingUpIcon />,
            color: '#9c27b0',
        },
    ];

    // Add QR stats for ORGADMIN
    if (role === 'ORG_ADMIN' && qrStats) {
        stats.push(
            {
                title: 'Total QR Codes',
                value: qrStats.totalQRCodes || 0,
                icon: <QrCodeIcon />,
                color: '#0288d1',
            },
            {
                title: 'Active QR Codes',
                value: qrStats.activeQRCodes || 0,
                icon: <QrCode2Icon />,
                color: '#00897b',
            }
        );
    }

    // Add organization stats for Platform Admin
    if (role === 'PLATFORM_ADMIN' && orgStats) {
        stats.push({
            title: 'Total Organizations',
            value: orgStats?.pagination?.totalItems || 0,
            icon: <BusinessIcon />,
            color: '#0288d1',
        });
    }

    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={role === 'ORG_ADMIN' ? 2 : role === 'PLATFORM_ADMIN' ? 2.4 : 3} key={index}>
                    <StatCard {...stat} loading={loading} />
                </Grid>
            ))}
        </Grid>
    );
};