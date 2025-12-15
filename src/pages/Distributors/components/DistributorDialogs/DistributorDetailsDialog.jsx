import React from 'react'
import {
    Dialog,
    DialogContent,
    Box,
    IconButton,
    Typography,
    Paper,
    Grid,
    Chip,
    Avatar,
    Divider,
} from '@mui/material'
import {
    Close as CloseIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    QrCode2 as QrIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { DISTRIBUTOR_STATUS } from '../../constants/distributorConstants'
import { format } from 'date-fns'
import {authService} from "../../../../api/services/authService.js";

export const DistributorDetailsDialog = ({ open, onClose, distributor, onRefresh }) => {
    if (!distributor) return null

    const status = DISTRIBUTOR_STATUS[distributor.status] || DISTRIBUTOR_STATUS.PENDING

    // Fetch distributor stats (if available)
    const { data: statsData } = useQuery({
        queryKey: ['distributor-stats', distributor.userId],
        queryFn: () => authService.getDistributorStats(),
        enabled: open && !!distributor.userId,
    })

    const stats = statsData?.data || {}

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { height: '80vh' },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.main',
                            fontSize: 24,
                        }}
                    >
                        {distributor.name?.charAt(0) || 'D'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {distributor.name}
                        </Typography>
                        <Chip
                            label={`${status.icon} ${status.label}`}
                            size="small"
                            color={status.color}
                        />
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content */}
            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Contact Information */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Contact Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <EmailIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {distributor.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                {distributor.phone && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <PhoneIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {distributor.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {distributor.address && (
                                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                                        <LocationIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Address
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {distributor.address}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Organization Information */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Organization
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <BusinessIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Organization Name
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {distributor.orgName || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CalendarIcon color="action" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Joined On
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {distributor.createdAt
                                                ? format(new Date(distributor.createdAt), 'PPP')
                                                : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Statistics */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Statistics
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                        <QrIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                        <Typography variant="h4" fontWeight={700}>
                                            {distributor.assignedQRCount || 0}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Assigned QRs
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                        <QrIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                        <Typography variant="h4" fontWeight={700}>
                                            {stats.deployedQRs || 0}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Deployed QRs
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                        <QrIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                        <Typography variant="h4" fontWeight={700}>
                                            {stats.pendingQRs || 0}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Pending
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                        <QrIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                                        <Typography variant="h4" fontWeight={700}>
                                            {stats.totalScans || 0}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Total Scans
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Account Details */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Account Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        User ID
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {distributor.userId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        DISTRIBUTOR
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {status.label}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Last Login
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {distributor.lastLoginAt
                                            ? format(new Date(distributor.lastLoginAt), 'PPp')
                                            : 'Never'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
