import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    Avatar,
    Tooltip,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow as ActivateIcon,
    Pause as DeactivateIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    QrCode2 as QrIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DISTRIBUTOR_STATUS } from '../../constants/distributorConstants'
import { EditDistributorDialog } from '../DistributorDialogs/EditDistributorDialog'
import toast from 'react-hot-toast'
import {authService} from "../../../../api/services/authService.js";

export const DistributorCard = ({ distributor, viewMode, onViewDetails, onRefresh }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const queryClient = useQueryClient()

    const status = DISTRIBUTOR_STATUS[distributor.accountStatus] || DISTRIBUTOR_STATUS.PENDING

    // Activate mutation
    const activateMutation = useMutation({
        mutationFn: () => authService.approveDistributor(distributor.id),
        onSuccess: () => {
            toast.success('Distributor activated successfully')
            queryClient.invalidateQueries(['distributors'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to activate distributor')
        },
    })

    // Activate mutation
    const reactivateMutation = useMutation({
        mutationFn: () => authService.reactivateDistributor(distributor.id),
        onSuccess: () => {
            toast.success('Distributor activated successfully')
            queryClient.invalidateQueries(['distributors'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to activate distributor')
        },
    })

    // Deactivate mutation
    const deactivateMutation = useMutation({
        mutationFn: () => authService.suspendDistributor(distributor.id),
        onSuccess: () => {
            toast.success('Distributor deactivated successfully')
            queryClient.invalidateQueries(['distributors'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to deactivate distributor')
        },
    })

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => authService.rejectDistributor(distributor.userId),
        onSuccess: () => {
            toast.success('Distributor deleted successfully')
            queryClient.invalidateQueries(['distributors'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to delete distributor')
        },
    })

    const handleMenuOpen = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleAction = (action) => {
        handleMenuClose()
        switch (action) {
            case 'view':
                onViewDetails(distributor)
                break
            case 'edit':
                setEditDialogOpen(true)
                break
            case 'activate':
                activateMutation.mutate()
                break
            case 'reactivate':
                reactivateMutation.mutate()
                break
            case 'deactivate':
                deactivateMutation.mutate()
                break
            case 'delete':
                if (window.confirm(`Are you sure you want to delete ${distributor.name}?`)) {
                    deleteMutation.mutate()
                }
                break
        }
    }

    return (
        <>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                    },
                }}
                onClick={() => onViewDetails(distributor)}
            >
                {/* Status Bar */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        bgcolor: `${status.color}.main`,
                    }}
                />

                <CardContent sx={{ flex: 1, pt: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
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
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" fontWeight={700} noWrap>
                                    {distributor.name}
                                </Typography>
                                <Chip
                                    label={`${status.icon} ${status.label}`}
                                    size="small"
                                    color={status.color}
                                    sx={{ fontWeight: 600, mt: 0.5 }}
                                />
                            </Box>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={handleMenuOpen}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Contact Info */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {distributor.email}
                            </Typography>
                        </Box>
                        {distributor.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PhoneIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
                                    {distributor.phone}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Organization */}
                    {distributor.orgName && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Organization
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {distributor.orgName}
                            </Typography>
                        </Box>
                    )}

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Assigned QR codes">
                            <Chip
                                icon={<QrIcon />}
                                label={distributor.assignedQRCount || 0}
                                size="small"
                                variant="outlined"
                            />
                        </Tooltip>
                    </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                        {(distributor.accountStatus === 'INACTIVE' || distributor.accountStatus === "PENDING" || distributor.accountStatus === "SUSPENDED" ) && (
                            <Tooltip title="Activate">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        distributor.accountStatus === "SUSPENDED" ? handleAction('reactivate') : handleAction('activate')
                                    }}
                                >
                                    <ActivateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {distributor.accountStatus === 'ACTIVE' && (
                            <Tooltip title="Deactivate">
                                <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAction('deactivate')
                                    }}
                                >
                                    <DeactivateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Edit">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleAction('edit')
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Box sx={{ flex: 1 }} />
                        <Tooltip title="View details">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleAction('view')
                                }}
                            >
                                <ViewIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardActions>
            </Card>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleAction('view')}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => handleAction('edit')}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>

                {(distributor.accountStatus === 'INACTIVE'  || distributor.accountStatus === "PENDING" || distributor.accountStatus === "SUSPENDED" ) && (
                    <MenuItem onClick={() => handleAction('activate')}>
                        <ListItemIcon>
                            <ActivateIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText>Activate</ListItemText>
                    </MenuItem>
                )}

                {distributor.accountStatus === 'ACTIVE' && (
                    <MenuItem onClick={() => handleAction('deactivate')}>
                        <ListItemIcon>
                            <DeactivateIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText>Deactivate</ListItemText>
                    </MenuItem>
                )}

                <MenuItem onClick={() => handleAction('delete')}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Edit Dialog */}
            {editDialogOpen && (
                <EditDistributorDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    distributor={distributor}
                    onSuccess={() => {
                        setEditDialogOpen(false)
                        onRefresh()
                    }}
                />
            )}
        </>
    )
}
