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
    Badge,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow as ActivateIcon,
    Pause as DeactivateIcon,
    QrCode2 as QrIcon,
    PersonAdd as AssignIcon,
    Message as MessageIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Analytics as AnalyticsIcon,
} from '@mui/icons-material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { qrService } from '../../../../api/services/qrService'
import { useAuthStore } from '../../../../store/authStore'
import { QR_STATUS } from '../../constants/qrConstants'
import { AssignQRDialog } from '../QRDialogs/AssignQRDialog'
import toast from 'react-hot-toast'
import {EditQRDialog} from "../QRDialogs/EditQRDialog.jsx";

export const QRCard = ({ qrCode, viewMode, onViewDetails, onRefresh }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [assignDialogOpen, setAssignDialogOpen] = useState(false)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { user } = useAuthStore()
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const status = QR_STATUS[qrCode.status] || QR_STATUS.GENERATED

    // TODO: Backend validation needed - Check if user can manage this QR
    const canManage = qrCode.createdBy === user?.id || user?.role === 'ORG_OWNER'

    // Fetch unread message count
    const { data: unreadData } = useQuery({
        queryKey: ['unread-messages', qrCode.qrCodeId],
        queryFn: () => qrService.getUnreadCount(qrCode.qrCodeId),
        refetchInterval: 30000, // Poll every 30 seconds
        enabled: canManage && qrCode.assignedTo != null,
    })

    const unreadCount = unreadData?.data?.unreadCount || 0

    // Activate mutation
    const activateMutation = useMutation({
        mutationFn: () => qrService.activateQR(qrCode.qrCodeId),
        onSuccess: () => {
            toast.success('QR Code activated successfully')
            queryClient.invalidateQueries(['qr-codes'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to activate QR code')
        },
    })

    // Deactivate mutation
    const deactivateMutation = useMutation({
        mutationFn: () => qrService.deactivateQR(qrCode.qrCodeId),
        onSuccess: () => {
            toast.success('QR Code deactivated successfully')
            queryClient.invalidateQueries(['qr-codes'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to deactivate QR code')
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

        if (!canManage && action !== 'view') {
            toast.error('You can only manage QR codes you created')
            return
        }

        switch (action) {
            case 'view':
                onViewDetails(qrCode)
                break
            case 'assign':
                setAssignDialogOpen(true)
                break
            case 'edit':
                setEditDialogOpen(true)  // Add this
                break
            case 'activate':
                activateMutation.mutate()
                break
            case 'deactivate':
                deactivateMutation.mutate()
                break
            case 'approve':
                navigate(`/qr/deployment/${qrCode.qrCodeId}`)
                break
            case 'analytics':
                navigate(`/qr/analytics/${qrCode.qrCodeId}`)
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
                onClick={() => onViewDetails(qrCode)}
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
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" fontWeight={700} noWrap gutterBottom>
                                {qrCode.qrCodeName}
                            </Typography>
                            <Chip
                                label={`${status.icon} ${status.label}`}
                                size="small"
                                color={status.color}
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>
                        <IconButton
                            size="small"
                            onClick={handleMenuOpen}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* QR Code Slug */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            p: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                        }}
                    >
                        <QrIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                            /{qrCode.qrCodeSlug}
                        </Typography>
                    </Box>

                    {/* Distributor Info */}
                    {qrCode.assignedTo && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                {qrCode.distributorName?.charAt(0) || 'D'}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">
                                {qrCode.distributorName || 'Distributor'}
                            </Typography>
                            {unreadCount > 0 && (
                                <Badge badgeContent={unreadCount} color="error">
                                    <MessageIcon fontSize="small" color="action" />
                                </Badge>
                            )}
                        </Box>
                    )}

                    {/* Stats */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Tooltip title="Total scans">
                            <Chip
                                label={`${qrCode.totalScans || 0} scans`}
                                size="small"
                                variant="outlined"
                            />
                        </Tooltip>
                        <Tooltip title="Total responses">
                            <Chip
                                label={`${qrCode.totalResponses || 0} responses`}
                                size="small"
                                variant="outlined"
                                color="success"
                            />
                        </Tooltip>
                        {qrCode.isDeployed && (
                            <Chip
                                label="📍 Deployed"
                                size="small"
                                variant="outlined"
                                color="info"
                            />
                        )}
                    </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                        {canManage && (
                            <Tooltip title="Edit QR">
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
                        )}
                        {canManage && qrCode.status === 'GENERATED' && (qrCode.assignmentStatus === "UNASSIGNED" || qrCode.assignmentStatus === "REJECTED" ) && (
                            <Tooltip title="Assign to distributor">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAction('assign')
                                    }}
                                >
                                    <AssignIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canManage && qrCode.status === 'DEPLOYED' && (
                            <Tooltip title="Approve deployment">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAction('approve')
                                    }}
                                >
                                    <ApproveIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canManage && qrCode.status === 'INACTIVE' && (
                            <Tooltip title="Activate QR">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAction('activate')
                                    }}
                                >
                                    <ActivateIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {canManage && qrCode.status === 'ACTIVE' && (
                            <Tooltip title="Deactivate QR">
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
                        <Tooltip title="Analytics">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleAction('analytics')
                                }}
                            >
                                <AnalyticsIcon fontSize="small" />
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
                {canManage && (
                    <MenuItem onClick={() => handleAction('edit')}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                )}
                <MenuItem onClick={() => handleAction('view')}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>


                {canManage && qrCode.status === 'GENERATED' && qrCode.assignmentStatus !== "ACCEPTED" && (
                    <MenuItem onClick={() => handleAction('assign')}>
                        <ListItemIcon>
                            <AssignIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText>Assign to Distributor</ListItemText>
                    </MenuItem>
                )}

                {canManage && qrCode.status === 'DEPLOYED' && (
                    <MenuItem onClick={() => handleAction('approve')}>
                        <ListItemIcon>
                            <ApproveIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText>Approve Deployment</ListItemText>
                    </MenuItem>
                )}

                {canManage && qrCode.status === 'INACTIVE' && (
                    <MenuItem onClick={() => handleAction('activate')}>
                        <ListItemIcon>
                            <ActivateIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText>Activate</ListItemText>
                    </MenuItem>
                )}

                {canManage && qrCode.status === 'ACTIVE' && (
                    <MenuItem onClick={() => handleAction('deactivate')}>
                        <ListItemIcon>
                            <DeactivateIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText>Deactivate</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            {/* Assign Dialog */}
            {assignDialogOpen && (
                <AssignQRDialog
                    open={assignDialogOpen}
                    onClose={() => setAssignDialogOpen(false)}
                    qrCode={qrCode}
                    onSuccess={() => {
                        setAssignDialogOpen(false)
                        onRefresh()
                    }}
                />
            )}
            {/* Edit Dialog */}
            {editDialogOpen && (
                <EditQRDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    qrCode={qrCode}
                    onSuccess={() => {
                        setEditDialogOpen(false)
                        onRefresh()
                    }}
                />
            )}

        </>
    )
}
