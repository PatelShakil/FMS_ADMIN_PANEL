import React from 'react'
import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import {
    People as PeopleIcon,
    Description as FormsIcon,
    Feedback as FeedbackIcon,
    HourglassEmpty as PendingIcon,
    CheckCircle as ResolvedIcon,
    PersonAdd as ActiveIcon,
} from '@mui/icons-material'

const StatCard = ({ title, value, icon, color, loading, subtitle }) => {
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
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
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
                m:0.5
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 , m:1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h3" fontWeight={700} color={color}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {subtitle}
                            </Typography>
                        )}
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

export const OrgOwnerStatsCards = ({ stats, loading }) => {
    const cards = [
        {
            title: 'Total Admins',
            value: stats.totalAdmins,
            // subtitle: `${stats.activeAdmins} active`,
            icon: <PeopleIcon fontSize="large" />,
            color: '#1976d2',
        },
        {
            title: 'Total FeedbackForms',
            value: stats.totalForms,
            icon: <FormsIcon fontSize="large" />,
            color: '#9c27b0',
        },
        {
            title: 'Total Responses',
            value: stats.totalResponses,
            icon: <FeedbackIcon fontSize="large" />,
            color: '#0288d1',
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingResponses,
            icon: <PendingIcon fontSize="large" />,
            color: '#ed6c02',
        },
        {
            title: 'Resolved Today',
            value: stats.resolvedToday,
            icon: <ResolvedIcon fontSize="large" />,
            color: '#2e7d32',
        },
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
