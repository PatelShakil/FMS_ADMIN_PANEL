import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Grid,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material'
import {
    ArrowBack as BackIcon,
    TrendingUp as TrendingIcon,
    QrCode2 as QrIcon,
    TouchApp as ScanIcon,
    RateReview as ResponseIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { qrService } from '../../../api/services/qrService'
import { useAuthStore } from '../../../store/authStore'
import { ANALYTICS_TIME_RANGES, DEVICE_TYPES } from '../constants/qrConstants'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export const QRAnalytics = () => {
    const { qrCodeId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [timeRange, setTimeRange] = useState(7)

    // Fetch analytics
    const { data: analyticsData, isLoading } = useQuery({
        queryKey: ['qr-analytics', qrCodeId, timeRange],
        queryFn: () => qrCodeId
            ? qrService.getQRAnalytics(qrCodeId, timeRange)
            : qrService.getOrgQRAnalytics(user?.orgId),
        enabled: !!(qrCodeId || user?.orgId),
    })

    const analytics = analyticsData?.data

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    // Prepare chart data
    const timelineData = analytics?.scanTimeline?.map(item => ({
        date: format(new Date(item.date), 'MMM d'),
        scans: item.scans,
        responses: item.responses,
    })) || []

    const deviceData = [
        { name: 'Mobile', value: analytics?.scansByDevice?.mobile || 0, color: DEVICE_TYPES.MOBILE.color },
        { name: 'Tablet', value: analytics?.scansByDevice?.tablet || 0, color: DEVICE_TYPES.TABLET.color },
        { name: 'Desktop', value: analytics?.scansByDevice?.desktop || 0, color: DEVICE_TYPES.DESKTOP.color },
    ]

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <IconButton onClick={() => navigate(-1)}>
                    <BackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={700}>
                        QR Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {qrCodeId ? 'Single QR Code Analytics' : 'Organization Overview'}
                    </Typography>
                </Box>
                {qrCodeId && (
                    <TextField
                        select
                        size="small"
                        value={timeRange}
                        onChange={(e) => setTimeRange(Number(e.target.value))}
                        SelectProps={{ native: true }}
                    >
                        {Object.entries(ANALYTICS_TIME_RANGES).map(([key, { value, label }]) => (
                            <option key={key} value={value}>{label}</option>
                        ))}
                    </TextField>
                )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Total {qrCodeId ? 'Scans' : 'QR Codes'}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {qrCodeId ? analytics?.totalScans || 0 : analytics?.totalQRs || 0}
                                        </Typography>
                                    </Box>
                                    <QrIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {qrCodeId ? 'Responses' : 'Total Scans'}
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {qrCodeId ? analytics?.totalResponses || 0 : analytics?.totalScans || 0}
                                        </Typography>
                                    </Box>
                                    <ResponseIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Response Rate
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {analytics?.responseRate || 0}%
                                        </Typography>
                                    </Box>
                                    <TrendingIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {qrCodeId ? 'Last Scanned' : 'Active QRs'}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {qrCodeId
                                                ? (analytics?.lastScannedAt ? format(new Date(analytics.lastScannedAt), 'MMM d') : 'Never')
                                                : analytics?.activeQRs || 0
                                            }
                                        </Typography>
                                    </Box>
                                    <ScanIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts */}
                {qrCodeId && (
                    <Grid container spacing={3} className={"w-full"}>
                        {/* Scan Timeline */}
                        <Grid item xs={12} md={8} sx={{ mb: 3 }} className={"w-full"}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Scan Timeline
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={timelineData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="scans" stroke="#2196f3" strokeWidth={2} name="Scans" />
                                        <Line type="monotone" dataKey="responses" stroke="#4caf50" strokeWidth={2} name="Responses" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Device Breakdown */}
                        <Grid item xs={12} md={4} className={"w-full"}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Device Breakdown
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={deviceData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {deviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {/* Top Performing QRs (Org View) */}
                {!qrCodeId && analytics?.topPerformingQRs && (
                    <Paper sx={{ p: 3, mt: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Top Performing QR Codes
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.topPerformingQRs}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="qrCodeName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="scans" fill="#2196f3" name="Scans" />
                                <Bar dataKey="responses" fill="#4caf50" name="Responses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                )}
            </Box>
        </Box>
    )
}
