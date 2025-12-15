import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Skeleton,
} from '@mui/material'
import {
    ArrowBack as ArrowBackIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Edit as EditIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Language as WebsiteIcon,
    Person as PersonIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orgService } from '../../api/services/orgService'
import toast from 'react-hot-toast'
import {authService} from "../../api/services/authService.js";

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        <Box sx={{ color: 'primary.main', mt: 0.5 }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
                {value || 'N/A'}
            </Typography>
        </Box>
    </Box>
)

export const OrganizationDetails = () => {
    const { orgId } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [approveDialogOpen, setApproveDialogOpen] = useState(false)
    const [approveComments, setApproveComments] = useState('')

    // Fetch organization details
    const { data: org, isLoading } = useQuery({
        queryKey: ['organization', orgId],
        queryFn: () => orgService.getOrgById(orgId),
    })

    // Fetch organization details
    const { data: owner, isOwnerLoading } = useQuery({
        queryKey: ['owner', org],
        queryFn: () => authService.getUserById(org?.data?.createdBy),
        enabled:!!org && !isLoading
    })

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: () => orgService.approveOrg(orgId, { comments: approveComments }),
        onSuccess: () => {
            toast.success('Organization approved successfully')
            queryClient.invalidateQueries(['organization', orgId])
            queryClient.invalidateQueries(['organizations'])
            setApproveDialogOpen(false)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to approve organization')
        },
    })

    // Reject mutation
    const rejectMutation = useMutation({
        mutationFn: () => orgService.rejectOrg(orgId, { rejectionReason: rejectReason }),
        onSuccess: () => {
            toast.success('Organization rejected')
            queryClient.invalidateQueries(['organization', orgId])
            queryClient.invalidateQueries(['organizations'])
            setRejectDialogOpen(false)
            setRejectReason('')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject organization')
        },
    })

    const handleApprove = () => {
        setApproveDialogOpen(true)
    }

    const handleApproveConfirm = () => {
        approveMutation.mutate()
    }

    const handleReject = () => {
        setRejectDialogOpen(true)
    }

    const handleRejectConfirm = () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }
        rejectMutation.mutate()
    }

    if (isLoading) {
        return (
            <Box>
                <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={400} />
            </Box>
        )
    }

    const organization = org?.data

    const STATUS_COLORS = {
        PENDING: 'warning',
        APPROVED: 'success',
        REJECTED: 'error',
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/organizations')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight={700}>
                        {organization?.orgName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Organization Details
                    </Typography>
                </Box>
                <Chip
                    label={organization?.status}
                    color={STATUS_COLORS[organization?.status]}
                    sx={{ mr: 2 }}
                />
                {organization?.status === 'PENDING' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={handleReject}
                        >
                            Reject
                        </Button>
                    </Box>
                )}
                {organization?.status === 'APPROVED' && (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/organizations/${orgId}/edit`)}
                    >
                        Edit
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Organization Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Organization Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Organization Name"
                                value={organization?.orgName}
                            />
                            <InfoRow
                                icon={<EmailIcon />}
                                label="Email"
                                value={organization?.orgEmail}
                            />
                            <InfoRow
                                icon={<PhoneIcon />}
                                label="Phone"
                                value={organization?.phone}
                            />
                            <InfoRow
                                icon={<WebsiteIcon />}
                                label="Website"
                                value={organization?.website}
                            />
                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Organization Type"
                                value={organization?.orgType}
                            />
                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Sector"
                                value={organization?.sector}
                            />
                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Registration Number"
                                value={organization?.registrationNo}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Location & Owner Information */}
                <Grid item xs={12} md={6}>
                    {/* Location */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Location
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow
                                icon={<LocationIcon />}
                                label="Address"
                                value={organization?.address}
                            />
                            <InfoRow
                                icon={<LocationIcon />}
                                label="City"
                                value={organization?.city}
                            />
                            <InfoRow
                                icon={<LocationIcon />}
                                label="State"
                                value={organization?.state}
                            />
                            <InfoRow
                                icon={<LocationIcon />}
                                label="Pincode"
                                value={organization?.pincode}
                            />
                        </CardContent>
                    </Card>

                    {/* Owner Information */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Owner Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow
                                icon={<PersonIcon />}
                                label="Owner Name"
                                value={owner?.data?.fullName}
                            />
                            <InfoRow
                                icon={<EmailIcon />}
                                label="Owner Email"
                                value={owner?.data?.email}
                            />
                            <InfoRow
                                icon={<PhoneIcon />}
                                label="Owner Phone"
                                value={owner?.data?.phone}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Additional Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Created At
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(organization?.createdAt).toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(organization?.updatedAt).toLocaleString()}
                                    </Typography>
                                </Grid>
                            </Grid>

                            {organization?.rejectionReason && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                        Rejection Reason:
                                    </Typography>
                                    <Typography variant="body2">
                                        {organization.rejectionReason}
                                    </Typography>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Approve Dialog */}
            <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Approve Organization</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        You are about to approve <strong>{organization?.orgName}</strong>.
                        This will allow them to access the platform.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Comments (Optional)"
                        value={approveComments}
                        onChange={(e) => setApproveComments(e.target.value)}
                        placeholder="Add any comments or notes..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApproveDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApproveConfirm}
                        color="success"
                        variant="contained"
                        disabled={approveMutation.isLoading}
                    >
                        {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Organization</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please provide a reason for rejecting <strong>{organization?.orgName}</strong>
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Rejection Reason *"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRejectConfirm}
                        color="error"
                        variant="contained"
                        disabled={rejectMutation.isLoading}
                    >
                        {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
