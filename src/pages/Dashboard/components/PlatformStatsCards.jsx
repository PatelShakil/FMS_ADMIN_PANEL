import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import {
    Business as BusinessIcon,
    HourglassEmpty as PendingIcon,
    CheckCircle as ActiveIcon,
    Description as FormsIcon,
    Feedback as ResponsesIcon,
} from '@mui/icons-material'

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
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
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
                        <Typography variant="h3" fontWeight={700} color={color}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            bgcolor: `${color}15`,
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

export const PlatformStatsCards = ({ stats, loading }) => {
    const cards = [
        {
            title: 'Total Organizations',
            value: stats.totalOrganizations,
            icon: <BusinessIcon fontSize="large" />,
            color: '#1976d2',
        },
        {
            title: 'Pending Approvals',
            value: stats.pendingOrganizations,
            icon: <PendingIcon fontSize="large" />,
            color: '#ed6c02',
        },
        {
            title: 'Active Organizations',
            value: stats.activeOrganizations,
            icon: <ActiveIcon fontSize="large" />,
            color: '#2e7d32',
        }
    ]

    return (
        <Grid container spacing={3}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <StatCard {...card} loading={loading} />
                </Grid>
            ))}
        </Grid>
    )
}
