import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    TextField,
    Alert,
    CircularProgress,
    Chip,
    Grid,
} from '@mui/material'
import {
    ArrowBack as BackIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    LocationOn as LocationIcon,
    NearMe as NearMeIcon,
    CancelPresentation as CancelPresentationIcon,
    Map as MapIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { qrService } from '../../../api/services/qrService'
import { useAuthStore } from '../../../store/authStore'
import { QRCodePreview } from '../components/QRPreview/QRCodePreview'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import {authService} from "../../../api/services/authService.js";

export const DeploymentApproval = () => {
    const { qrCodeId } = useParams()
    const navigate = useNavigate()
    const { user,role } = useAuthStore()
    const queryClient = useQueryClient()

    const [rejectReason, setRejectReason] = useState('')
    const [showRejectDialog, setShowRejectDialog] = useState(false)

    // Fetch QR code
    const { data: qrData, isLoading } = useQuery({
        queryKey: ['qr-code', qrCodeId],
        queryFn: () => qrService.getQRById(qrCodeId),
        enabled: !!qrCodeId,
    })



    const qrCode = qrData?.data

    // Fetch QR code
    const { data: distributor, isDistributorLoading } = useQuery({
        queryKey: ['distributor', qrCodeId],
        queryFn: () => authService.getUserById(qrCode?.assignedTo),
        enabled: !!qrCodeId && !!qrData,
    })
    // TODO: Backend validation needed
    const canApprove = qrCode?.createdBy === user?.id || role === 'ORG_OWNER'

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: () => qrService.approveDeployment(qrCodeId),
        onSuccess: () => {
            toast.success('Deployment approved successfully!')
            queryClient.invalidateQueries(['qr-codes'])
            navigate('/qr/management')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to approve deployment')
        },
    })

    // Reject mutation
    const rejectMutation = useMutation({
        mutationFn: (data) => qrService.rejectDeployment(qrCodeId, data),
        onSuccess: () => {
            toast.success('Deployment rejected')
            queryClient.invalidateQueries(['qr-codes'])
            navigate('/qr/management')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to reject deployment')
        },
    })

    const handleApprove = () => {
        if (!canApprove) {
            toast.error('You can only approve deployments for QR codes you created')
            return
        }
        approveMutation.mutate()
    }

    const handleReject = () => {
        if (!canApprove) {
            toast.error('You can only reject deployments for QR codes you created')
            return
        }
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }
        rejectMutation.mutate({ reason: rejectReason })
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (!qrCode) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">QR Code not found</Alert>
            </Box>
        )
    }

    if (!canApprove) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    You can only approve deployments for QR codes you created.
                </Alert>
                <Button variant="contained" onClick={() => navigate('/qr/management')} sx={{ mt: 2 }}>
                    Back to QR Management
                </Button>
            </Box>
        )
    }

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
                <IconButton onClick={() => navigate('/qr/management')}>
                    <BackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={700}>
                        Deployment Approval
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Review and approve QR code deployment
                    </Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <Grid container spacing={3}>
                    {/* Left - QR Preview */}
                    <Grid item xs={12} md={4}>
                        <QRCodePreview qrCode={qrCode} size={200} />
                        {/* Location Details */}
                        <Paper sx={{ p: 3, mt: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Location Details
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Location Name
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {qrCode.deploymentLocationName || 'N/A'}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Coordinates
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {qrCode.latitude && qrCode.longitude
                                                ? `${qrCode.latitude}, ${qrCode.longitude}`
                                                : 'N/A'}
                                        </Typography>

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
                                                    sx={{ fontSize: '0.75rem' }}
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

                                {/* Interactive Map Preview */}
                                {qrCode.latitude && qrCode.longitude && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                            Map Preview
                                        </Typography>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                width: '100%',
                                                height: 250,
                                                overflow: 'hidden',
                                                borderRadius: 2,
                                                position: 'relative'
                                            }}
                                        >
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                referrerPolicy="no-referrer-when-downgrade"
                                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&q=${qrCode.latitude},${qrCode.longitude}&zoom=15`}
                                            />
                                        </Paper>
                                    </Box>
                                )}

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Deployed At
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {qrCode.deployedAt
                                            ? format(new Date(qrCode.deployedAt), 'PPpp')
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right - Deployment Details */}
                    <Grid item xs={12} md={8} className={"w-2/4"} >
                        {
                            qrCode?.isDeployed ?(
                                <Box sx={{textAlign: 'center'}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate('/qr/management')}
                                        startIcon={<CancelPresentationIcon />}
                                    >
                                        Back to QR Management
                                    </Button>
                                    <Typography variant="h6" color="success.main" gutterBottom>
                                        QR Code Already Deployed
                                    </Typography>
                                </Box>
                            ) :(
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    Please review the deployment details carefully before approving.
                                </Alert>
                            )
                        }



                        {/* Distributor Info */}
                        <Paper sx={{ p: 3, mb: 3 }} className={"w-full"}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Distributor Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {distributor?.data?.fullName || 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color={"text.secondary"}>
                                        {distributor?.data?.email || 'N/A'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Payment Amount
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        ₹{qrCode.paymentAmount || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* QR Info */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                QR Code Details
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Name
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {qrCode.qrCodeName}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                                        Status
                                    </Typography>
                                    <Chip label={qrCode.status} color="warning" size="small" />
                                </Box>
                            </Box>
                        </Paper>
                        {/* Deployment Photo */}
                        {qrCode.deploymentPhotoUrl && (
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Deployment Photo
                                </Typography>
                                <Box
                                    component="img"
                                    src={qrCode.deploymentPhotoUrl}
                                    alt="Deployment"
                                    sx={{
                                        width: '100%',
                                        maxHeight: 400,
                                        objectFit: 'contain',
                                        borderRadius: 2,
                                        border: 1,
                                        borderColor: 'divider',
                                    }}
                                />
                            </Paper>
                        )}




                        {/* Rejection Form */}
                        {showRejectDialog && (
                            <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.50' }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom color="error">
                                    Reject Deployment
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Rejection Reason"
                                    required
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Explain why you're rejecting this deployment..."
                                    helperText="The distributor will see this reason"
                                />
                            </Paper>
                        )}

                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {showRejectDialog ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setShowRejectDialog(false)
                                            setRejectReason('')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<RejectIcon />}
                                        onClick={handleReject}
                                        disabled={rejectMutation.isLoading}
                                    >
                                        {rejectMutation.isLoading ? 'Rejecting...' : 'Confirm Rejection'}
                                    </Button>
                                    </>
                                    ): qrCode?.isDeployed === true ? <></> : (
                                    <>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<RejectIcon />}
                                        onClick={() => setShowRejectDialog(true)}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<ApproveIcon />}
                                        onClick={handleApprove}
                                        disabled={approveMutation.isLoading}
                                    >
                                        {approveMutation.isLoading ? 'Approving...' : 'Approve Deployment'}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
