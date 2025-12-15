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
    Avatar,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import {
    ArrowBack as ArrowBackIcon,
    Block as SuspendIcon,
    CheckCircle as ReactivateIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../../api/services/authService'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

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

export const TeamMemberDetails = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
    const [suspendReason, setSuspendReason] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    // Fetch member details
    const { data: memberData, isLoading } = useQuery({
        queryKey: ['team-member', userId],
        queryFn: () => authService.getTeamMemberById(userId),
    })

    const member = memberData?.data

    // Suspend mutation
    const suspendMutation = useMutation({
        mutationFn: (reason) => authService.suspendTeamMember(userId, reason),
        onSuccess: () => {
            toast.success('Team member suspended successfully')
            queryClient.invalidateQueries(['team-member', userId])
            queryClient.invalidateQueries(['team-members'])
            setSuspendDialogOpen(false)
            setSuspendReason('')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to suspend member')
        },
    })

    // Reactivate mutation
    const reactivateMutation = useMutation({
        mutationFn: () => authService.reactivateTeamMember(userId),
        onSuccess: () => {
            toast.success('Team member reactivated successfully')
            queryClient.invalidateQueries(['team-member', userId])
            queryClient.invalidateQueries(['team-members'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reactivate member')
        },
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => authService.removeTeamMember(userId),
        onSuccess: () => {
            toast.success('Team member removed successfully')
            navigate('/team')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to remove member')
        },
    })

    const handleSuspend = () => {
        setSuspendDialogOpen(true)
    }

    const handleSuspendConfirm = () => {
        if (!suspendReason.trim()) {
            toast.error('Please provide a suspension reason')
            return
        }
        suspendMutation.mutate(suspendReason)
    }

    const handleReactivate = () => {
        if (window.confirm(`Reactivate ${member?.fullName}?`)) {
            reactivateMutation.mutate()
        }
    }

    const handleDelete = () => {
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        deleteMutation.mutate()
    }

    if (isLoading) {
        return (
            <Box>
                <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={400} />
            </Box>
        )
    }

    const STATUS_COLORS = {
        ACTIVE: 'success',
        INACTIVE: 'warning',
        SUSPENDED: 'error',
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/team')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Avatar
                    sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        mr: 2,
                        fontSize: '1.5rem'
                    }}
                >
                    {member?.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight={700}>
                        {member?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {member?.email}
                    </Typography>
                </Box>
                <Chip
                    label={member?.accountStatus}
                    color={STATUS_COLORS[member?.accountStatus]}
                    sx={{ mr: 2 }}
                />
                {member?.accountStatus === 'ACTIVE' && (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<SuspendIcon />}
                        onClick={handleSuspend}
                    >
                        Suspend
                    </Button>
                )}
                {member?.accountStatus === 'SUSPENDED' && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<ReactivateIcon />}
                        onClick={handleReactivate}
                    >
                        Reactivate
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Member Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Member Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow
                                icon={<PersonIcon />}
                                label="Full Name"
                                value={member?.fullName}
                            />
                            <InfoRow
                                icon={<EmailIcon />}
                                label="Email"
                                value={member?.email}
                            />
                            <InfoRow
                                icon={<PhoneIcon />}
                                label="Phone"
                                value={member?.phone}
                            />
                            {
                                member?.userRoles.map((r) => (
                                    <InfoRow
                                        icon={<PersonIcon />}
                                        label="Role"
                                        value={r?.role?.roleName.replace('_', ' ')}
                                    />
                                ))
                            }
                        </CardContent>
                    </Card>
                </Grid>

                {/* Activity Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Activity
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow
                                icon={<CalendarIcon />}
                                label="Joined"
                                value={new Date(member?.createdAt).toLocaleDateString()}
                            />
                            <InfoRow
                                icon={<AccessTimeIcon />}
                                label="Last Login"
                                value={
                                    member?.lastLoginAt
                                        ? formatDistanceToNow(new Date(member.lastLoginAt), { addSuffix: true })
                                        : 'Never'
                                }
                            />
                            <InfoRow
                                icon={<AccessTimeIcon />}
                                label="Last Updated"
                                value={new Date(member?.updatedAt).toLocaleDateString()}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Suspension Info (if suspended) */}
                {member?.status === 'SUSPENDED' && member?.suspensionReason && (
                    <Grid item xs={12}>
                        <Alert severity="error">
                            <Typography variant="body2" fontWeight={600} gutterBottom>
                                Suspension Reason:
                            </Typography>
                            <Typography variant="body2">
                                {member.suspensionReason}
                            </Typography>
                        </Alert>
                    </Grid>
                )}

                {/* Danger Zone */}
                <Grid item xs={12}>
                    <Card sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} color="error.main" gutterBottom>
                                Danger Zone
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="body1" fontWeight={500} gutterBottom>
                                        Remove Team Member
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Permanently remove this member from your organization. This action cannot be undone.
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDelete}
                                >
                                    Remove
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Suspend Dialog */}
            <Dialog open={suspendDialogOpen} onClose={() => setSuspendDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Suspend Team Member</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please provide a reason for suspending <strong>{member?.fullName}</strong>
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Suspension Reason *"
                        value={suspendReason}
                        onChange={(e) => setSuspendReason(e.target.value)}
                        placeholder="Enter reason for suspension..."
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuspendDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSuspendConfirm}
                        color="error"
                        variant="contained"
                        disabled={suspendMutation.isLoading}
                    >
                        {suspendMutation.isLoading ? 'Suspending...' : 'Suspend'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Remove Team Member</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to remove <strong>{member?.fullName}</strong> from your team?
                        This action cannot be undone and they will lose access immediately.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isLoading}
                    >
                        {deleteMutation.isLoading ? 'Removing...' : 'Remove'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
