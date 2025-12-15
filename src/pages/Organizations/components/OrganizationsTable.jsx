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
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orgService } from '../../../api/services/orgService'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
}

export const OrganizationsTable = ({ data, loading, onRefresh }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedOrg, setSelectedOrg] = useState(null)
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: (orgId) => orgService.approveOrg(orgId),
        onSuccess: () => {
            toast.success('Organization approved successfully')
            queryClient.invalidateQueries(['organizations'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to approve organization')
        },
    })

    // Reject mutation
    const rejectMutation = useMutation({
        mutationFn: ({ orgId, reason }) =>
            orgService.rejectOrg(orgId, { rejectionReason: reason }),
        onSuccess: () => {
            toast.success('Organization rejected')
            queryClient.invalidateQueries(['organizations'])
            onRefresh()
            setRejectDialogOpen(false)
            setRejectReason('')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject organization')
        },
    })

    const handleMenuOpen = (event, org) => {
        setAnchorEl(event.currentTarget)
        setSelectedOrg(org)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedOrg(null)
    }

    const handleApprove = (org) => {
        if (window.confirm(`Approve ${org.orgName}?`)) {
            approveMutation.mutate(org.orgId)
        }
        handleMenuClose()
    }

    const handleReject = (org) => {
        setSelectedOrg(org)
        setRejectDialogOpen(true)
        handleMenuClose()
    }

    const handleRejectConfirm = () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }
        rejectMutation.mutate({
            orgId: selectedOrg.orgId,
            reason: rejectReason,
        })
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
                <Typography variant="h6" color="text.secondary">
                    No organizations found
                </Typography>
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
                            <TableCell>Organization</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Registered</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((org) => (
                            <TableRow key={org.orgId} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {org.orgName.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {org.orgName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {org.orgEmail}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={org.orgType}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {org.ownerName || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {org.city}, {org.state}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {org.pincode}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {org.phone}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={org.status}
                                        size="small"
                                        color={STATUS_COLORS[org.status]}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(org.createdAt).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate(`/organizations/${org.id}`)}
                                        >
                                            <ViewIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, org)}
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
                <MenuItem onClick={() => navigate(`/organizations/${selectedOrg?.id}`)}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>

                {selectedOrg?.status === 'PENDING' && (
                    <>
                        <MenuItem onClick={() => handleApprove(selectedOrg)}>
                            <ListItemIcon>
                                <ApproveIcon fontSize="small" color="success" />
                            </ListItemIcon>
                            <ListItemText>Approve</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleReject(selectedOrg)}>
                            <ListItemIcon>
                                <RejectIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Reject</ListItemText>
                        </MenuItem>
                    </>
                )}

                {selectedOrg?.status === 'APPROVED' && (
                    <MenuItem onClick={() => navigate(`/organizations/${selectedOrg?.id}/edit`)}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            {/* Reject Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Organization</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please provide a reason for rejecting <strong>{selectedOrg?.orgName}</strong>
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Rejection Reason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
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
        </>
    )
}
