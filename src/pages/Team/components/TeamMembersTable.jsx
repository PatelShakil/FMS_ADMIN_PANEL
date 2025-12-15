import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Tooltip,
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Skeleton,
} from '@mui/material'
import {
    Visibility as ViewIcon,
    MoreVert as MoreVertIcon,
    Block as SuspendIcon,
    CheckCircle as ReactivateIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../../../api/services/authService'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const STATUS_COLORS = {
    ACTIVE: 'success',
    INACTIVE: 'warning',
    SUSPENDED: 'error',
}

export const TeamMembersTable = ({ data, loading, onRefresh }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedMember, setSelectedMember] = useState(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
    const [suspendReason, setSuspendReason] = useState('')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    // Suspend mutation
    const suspendMutation = useMutation({
        mutationFn: ({ userId, reason }) =>
            authService.suspendTeamMember(userId, reason),
        onSuccess: () => {
            toast.success('Team member suspended successfully')
            queryClient.invalidateQueries(['team-members'])
            onRefresh()
            setSuspendDialogOpen(false)
            setSuspendReason('')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to suspend member')
        },
    })

    // Reactivate mutation
    const reactivateMutation = useMutation({
        mutationFn: (userId) => authService.reactivateTeamMember(userId),
        onSuccess: () => {
            toast.success('Team member reactivated successfully')
            queryClient.invalidateQueries(['team-members'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reactivate member')
        },
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (userId) => authService.removeTeamMember(userId),
        onSuccess: () => {
            toast.success('Team member removed successfully')
            queryClient.invalidateQueries(['team-members'])
            onRefresh()
            setDeleteDialogOpen(false)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to remove member')
        },
    })

    const handleMenuOpen = (event, member) => {
        setAnchorEl(event.currentTarget)
        setSelectedMember(member)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedMember(null)
    }

    const handleSuspend = (member) => {
        setSelectedMember(member)
        setSuspendDialogOpen(true)
        handleMenuClose()
    }

    const handleSuspendConfirm = () => {
        if (!suspendReason.trim()) {
            toast.error('Please provide a suspension reason')
            return
        }
        suspendMutation.mutate({
            userId: selectedMember.userId,
            reason: suspendReason,
        })
    }

    const handleReactivate = (member) => {
        if (window.confirm(`Reactivate ${member.fullName}?`)) {
            reactivateMutation.mutate(member.userId)
        }
        handleMenuClose()
    }

    const handleDelete = (member) => {
        setSelectedMember(member)
        setDeleteDialogOpen(true)
        handleMenuClose()
    }

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(selectedMember.userId)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    if (loading) {
        return (
            <Box>
                {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
                ))}
            </Box>
        )
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No team members found
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<EmailIcon />}
                    onClick={() => navigate('/team/invite')}
                    sx={{ mt: 2 }}
                >
                    Invite First Admin
                </Button>
            </Box>
        )
    }

    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Member</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell>Last Active</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((member) => (
                            <TableRow key={member.userId} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {member.fullName.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {member.fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {member.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {
                                        member.userRoles.map((r) => (
                                            <Chip
                                                label={r.role.roleName?.replace('_', ' ')}
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                            />
                                        ))
                                    }

                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {member.phone || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={member.accountStatus}
                                        size="small"
                                        color={STATUS_COLORS[member.accountStatus]}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary">
                                        {member.lastLoginAt
                                            ? formatDistanceToNow(new Date(member.lastLoginAt), { addSuffix: true })
                                            : 'Never'
                                        }
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate(`/team/${member.id}`)}
                                        >
                                            <ViewIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, member)}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => navigate(`/team/${selectedMember?.userId}`)}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>

                {selectedMember?.status === 'ACTIVE' && (
                    <MenuItem onClick={() => handleSuspend(selectedMember)}>
                        <ListItemIcon>
                            <SuspendIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Suspend</ListItemText>
                    </MenuItem>
                )}

                {selectedMember?.status === 'SUSPENDED' && (
                    <MenuItem onClick={() => handleReactivate(selectedMember)}>
                        <ListItemIcon>
                            <ReactivateIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText>Reactivate</ListItemText>
                    </MenuItem>
                )}

                <MenuItem onClick={() => handleDelete(selectedMember)}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Remove</ListItemText>
                </MenuItem>
            </Menu>

            {/* Suspend Dialog */}
            <Dialog open={suspendDialogOpen} onClose={() => setSuspendDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Suspend Team Member</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please provide a reason for suspending <strong>{selectedMember?.fullName}</strong>
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
                        Are you sure you want to remove <strong>{selectedMember?.fullName}</strong> from your team?
                        This action cannot be undone.
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
        </>
    )
}
