import React, {useState} from 'react'
import {
    Box,
    Paper,
    Typography,
    Chip,
    Divider,
    Button,
    Grid,
} from '@mui/material'
import {
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Edit, Map as MapIcon, NearMe as NearMeIcon
} from '@mui/icons-material'
import { QRCodePreview } from '../QRPreview/QRCodePreview'
import {DEPLOYMENT_STATUS, QR_STATUS} from '../../constants/qrConstants'
import { format } from 'date-fns'
import {useAuthStore} from "../../../../store/authStore.js";
import {EditQRDialog} from "../QRDialogs/EditQRDialog.jsx";
import {Link} from "react-router-dom";

export const QRDetailsPanel = ({distributor, qrCode, onRefresh }) => {
    const status = QR_STATUS[qrCode.status] || QR_STATUS.GENERATED
    const assignmentStatus = DEPLOYMENT_STATUS[qrCode.assignmentStatus] || DEPLOYMENT_STATUS.PENDING
    const {user,role} = useAuthStore();
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const canEdit = qrCode.createdBy === user?.id || role === 'ORG_OWNER'



    return (
        <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
            <Grid container spacing={3} className={"w-full flex justify-center"}>
                {/* Left Column - QR Preview */}
                <Grid item xs={12} md={5} >
                    <QRCodePreview qrCode={qrCode} size={256} />


                    {/* Timestamps */}
                    <Paper sx={{ p: 3,mt:2 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                            <ScheduleIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Timeline
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">
                                    Created:
                                </Typography>
                                <Typography variant="caption" fontWeight={600}>
                                    {format(new Date(qrCode.createdAt), 'PPp')}
                                </Typography>
                            </Box>
                            {qrCode.lastScannedAt && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Last Scanned:
                                    </Typography>
                                    <Typography variant="caption" fontWeight={600}>
                                        {format(new Date(qrCode.lastScannedAt), 'PPp')}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column - Details */}
                <Grid item xs={12} md={7}>
                    {/* Status */}
                    <Paper sx={{ p: 3, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Status
                            </Typography>
                            {canEdit && (
                                <Button
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => setEditDialogOpen(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>
                        <Chip
                            label={`${status.icon} ${status.label}`}
                            color={status.color}
                            sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1,mb:2 }}>
                            {status.description}
                        </Typography>

                        <Typography variant="subtitle2"  fontWeight={700} sx={{mt:2 }}>
                            Payment Amount :
                            <Typography variant="subtitle2" color={"text.secondary"}>
                                ₹ {qrCode.paymentAmount || 0}
                            </Typography>
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle2" fontWeight={700}                             sx={{mt:2 }}>
                            Assignment Status
                        </Typography>
                        <Chip
                            label={`${assignmentStatus.icon} ${qrCode.assignmentStatus}`}
                            color={assignmentStatus.color}
                            sx={{ fontWeight: 600,mt:2 }}
                        />
                    </Paper>

                    {/* Deployment Info */}
                    {qrCode.deploymentStatus && (
                        <Paper sx={{ p: 3, mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                <LocationIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Deployment Details
                            </Typography>
                            <Link className={"bg-blue-500 cursor-pointer text-white shadow text-sm py-1 rounded-md px-2  "} to={`/qr/deployment/${qrCode.qrCodeId}`}>View Details</Link>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Location
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {qrCode.deploymentLocationName || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Coordinates
                                    </Typography>
                                    <Box>
                                        {qrCode.latitude && qrCode.longitude && (
                                            <>
                                                <Chip
                                                    size="small"
                                                    icon={<MapIcon />}
                                                    label="View on Google Maps"
                                                    component="a"
                                                    href={`https://www.google.com/maps?q=${qrCode.latitude},${qrCode.longitude}`}
                                                    target="_blank"
                                                    clickable
                                                    sx={{ fontSize: '0.75rem',mr:3 }}
                                                />
                                                <Chip
                                                    size="small"
                                                    icon={<NearMeIcon />}
                                                    label="Get Directions"
                                                    component="a"
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${qrCode.latitude},${qrCode.longitude}`}
                                                    target="_blank"
                                                    clickable
                                                    sx={{ fontSize: '0.75rem' }}
                                                />
                                            </>
                                        )}
                                    </Box>


                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Deployed At
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {qrCode.deployedAt
                                            ? format(new Date(qrCode.deployedAt), 'PPp')
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                                {qrCode.deploymentPhotoUrl && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                            Deployment Photo
                                        </Typography>
                                        <Box
                                            component="img"
                                            src={qrCode.deploymentPhotoUrl}
                                            alt="Deployment"
                                            sx={{
                                                width: '100%',
                                                maxHeight: 300,
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                                mt: 1,
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    )}

                </Grid>


                <Grid item xs={12} md={7}>
                    {/* QR Stats */}

                        <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        Statistics
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                Total Scans:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {qrCode.totalScans || 0}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                Total Responses:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {qrCode.totalResponses || 0}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                Response Rate:
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {qrCode.totalScans > 0
                                    ? ((qrCode.totalResponses / qrCode.totalScans) * 100).toFixed(1)
                                    : 0}%
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
                    {/* Basic Info */}
                    <Paper sx={{ p: 3, mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                            Basic Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    QR Code Name
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {qrCode.qrCodeName}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    QR Code Slug
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    /{qrCode.qrCodeSlug}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Form
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {qrCode.formName || 'N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Assignment Info */}
                    {qrCode.assignedTo && distributor && (
                        <Paper sx={{ p: 3, mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                <PersonIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Assignment Details
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Assigned To
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {distributor.data.fullName || 'Unknown Distributor'}
                                    </Typography>
                                    <Typography variant="caption"  color="text.secondary">
                                        {distributor.data.email || 'Unknown Distributor'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Assigned At
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {qrCode.assignedAt
                                            ? format(new Date(qrCode.assignedAt), 'PPp')
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                                {qrCode.assignmentNotes && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Notes
                                        </Typography>
                                        <Typography variant="body2">
                                            {qrCode.assignmentNotes}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    )}

                </Grid>
            </Grid>
            {/* Edit Dialog */}
            <EditQRDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                qrCode={qrCode}
                onSuccess={() => {
                    setEditDialogOpen(false)
                    onRefresh()
                }}
            />

        </Box>
    )
}
