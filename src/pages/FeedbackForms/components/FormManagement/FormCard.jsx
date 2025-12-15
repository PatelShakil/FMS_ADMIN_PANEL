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
    LinearProgress,
    Tooltip,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as FinalizeIcon,
    PlayArrow as ActivateIcon,
    Pause as DeactivateIcon,
    QrCode as QrIcon,
    Assessment as AnalyticsIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { feedbackService } from '../../../../api/services/feedbackService'
import { FORM_STATUS } from '../../constants/formConstants'
import toast from 'react-hot-toast'

export const FormCard = ({ form, viewMode, onPreview, onRefresh }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const status = FORM_STATUS[form.status] || FORM_STATUS.DRAFT

    // Finalize form
    const finalizeMutation = useMutation({
        mutationFn: () => feedbackService.finalizeForm(form.formId),
        onSuccess: () => {
            toast.success('Form finalized successfully')
            queryClient.invalidateQueries(['forms'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to finalize form')
        },
    })

    // Activate form
    const activateMutation = useMutation({
        mutationFn: () => feedbackService.activateForm(form.formId),
        onSuccess: () => {
            toast.success('Form activated successfully')
            queryClient.invalidateQueries(['forms'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to activate form')
        },
    })

    // Deactivate form
    const deactivateMutation = useMutation({
        mutationFn: () => feedbackService.deactivateForm(form.formId),
        onSuccess: () => {
            toast.success('Form deactivated successfully')
            queryClient.invalidateQueries(['forms'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to deactivate form')
        },
    })

    // Delete form
    const deleteMutation = useMutation({
        mutationFn: () => feedbackService.deleteForm(form.formId),
        onSuccess: () => {
            toast.success('Form deleted successfully')
            queryClient.invalidateQueries(['forms'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to delete form')
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
            case 'preview':
                onPreview(form)
                break
            case 'edit':
                navigate(`/feedback/forms/edit/${form.formId}`)
                break
            case 'finalize':
                if (window.confirm('Are you sure you want to finalize this form? You will not be able to edit it afterwards.')) {
                    finalizeMutation.mutate()
                }
                break
            case 'activate':
                activateMutation.mutate()
                break
            case 'deactivate':
                deactivateMutation.mutate()
                break
            case 'delete':
                if (window.confirm(`Are you sure you want to delete "${form.formName}"?`)) {
                    deleteMutation.mutate()
                }
                break
            case 'qr':
                navigate(`/qr/management/${form.formId}`)
                break
            // case 'analytics':
            //     navigate(`/qr/analytics/${form.formId}`)
            //     break
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
                onClick={() => onPreview(form)}
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
                                {form.formName}
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
                            onClick={(e) => {
                                e.stopPropagation()
                                handleMenuOpen(e)
                            }}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: 40,
                            mb: 2,
                        }}
                    >
                        {form.formDescription || 'No description provided'}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Tooltip title="Total fields">
                            <Chip
                                label={`${form.fields?.length || 0} fields`}
                                size="small"
                                variant="outlined"
                            />
                        </Tooltip>
                        <Tooltip title="Responses received">
                            <Chip
                                label={`${form.metadata?.totalResponsesReceived || 0} responses`}
                                size="small"
                                variant="outlined"
                                color="success"
                            />
                        </Tooltip>
                        <Tooltip title="QR codes generated">
                            <Chip
                                label={`${form.metadata?.totalQRCodesGenerated || 0} QR codes`}
                                size="small"
                                variant="outlined"
                                color="info"
                            />
                        </Tooltip>
                    </Box>

                    {/* Version */}
                    <Typography variant="caption" color="text.secondary">
                        Version {form.version || 1} • Created {new Date(form.createdAt).toLocaleDateString()}
                    </Typography>

                    {/* Progress bar for draft forms */}
                    {form.status === 'DRAFT' && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Form completion
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {form.fields?.length > 0 ? '80%' : '20%'}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={form.fields?.length > 0 ? 80 : 20}
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                    )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                        {status.canEdit && (
                            <Tooltip title="Edit form">
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
                        {status.canFinalize && (
                            <Tooltip title="Finalize form">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAction('finalize')
                                    }}
                                >
                                    <FinalizeIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {status.canActivate && (
                            <Tooltip title="Activate form">
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
                        {status.canDeactivate && (
                            <Tooltip title="Deactivate form">
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
                        {/*<Tooltip title="View responses">*/}
                        {/*    <IconButton*/}
                        {/*        size="small"*/}
                        {/*        onClick={(e) => {*/}
                        {/*            e.stopPropagation()*/}
                        {/*            handleAction('analytics')*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <AnalyticsIcon fontSize="small" />*/}
                        {/*    </IconButton>*/}
                        {/*</Tooltip>*/}
                        <Tooltip title="Manage QR codes">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleAction('qr')
                                }}
                            >
                                <QrIcon fontSize="small" />
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
                <MenuItem onClick={() => handleAction('preview')}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Preview</ListItemText>
                </MenuItem>

                {status.canEdit && (
                    <MenuItem onClick={() => handleAction('edit')}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                )}

                {status.canFinalize && (
                    <MenuItem onClick={() => handleAction('finalize')}>
                        <ListItemIcon>
                            <FinalizeIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText>Finalize</ListItemText>
                    </MenuItem>
                )}

                {status.canActivate && (
                    <MenuItem onClick={() => handleAction('activate')}>
                        <ListItemIcon>
                            <ActivateIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText>Activate</ListItemText>
                    </MenuItem>
                )}

                {status.canDeactivate && (
                    <MenuItem onClick={() => handleAction('deactivate')}>
                        <ListItemIcon>
                            <DeactivateIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText>Deactivate</ListItemText>
                    </MenuItem>
                )}

                <MenuItem onClick={() => handleAction('qr')}>
                    <ListItemIcon>
                        <QrIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Manage QR Codes</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => handleAction('analytics')}>
                    <ListItemIcon>
                        <AnalyticsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Analytics</ListItemText>
                </MenuItem>

                {status.canEdit && (
                    <MenuItem onClick={() => handleAction('delete')}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    )
}
