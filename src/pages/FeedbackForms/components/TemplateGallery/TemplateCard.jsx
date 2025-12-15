import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
    Switch,
    FormControlLabel,
    Tooltip,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FileCopy as CloneIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feedbackService } from '../../../../api/services/feedbackService'
import { TEMPLATE_CATEGORIES } from '../../constants/formConstants'
import toast from 'react-hot-toast'

export const TemplateCard = ({ template, viewMode, onPreview, onEdit, onRefresh }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const queryClient = useQueryClient()

    const category = TEMPLATE_CATEGORIES[template.category?.toUpperCase().replace(' ', '_')] || TEMPLATE_CATEGORIES.OTHER

    // Toggle active status
    const toggleActiveMutation = useMutation({
        mutationFn: () => feedbackService.updateTemplate(template.templateId, {
            ...template,
            isActive: !template.isActive,
        }),
        onSuccess: () => {
            toast.success(`Template ${template.isActive ? 'disabled' : 'enabled'} successfully`)
            queryClient.invalidateQueries(['templates'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update template')
        },
    })

    // Delete template
    const deleteMutation = useMutation({
        mutationFn: () => feedbackService.deleteTemplate(template.templateId),
        onSuccess: () => {
            toast.success('Template deleted successfully')
            queryClient.invalidateQueries(['templates'])
            onRefresh()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to delete template')
        },
    })

    const handleMenuOpen = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleDelete = () => {
        handleMenuClose()
        if (window.confirm(`Are you sure you want to delete "${template.templateName}"?`)) {
            deleteMutation.mutate()
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
                    opacity: template.isActive ? 1 : 0.6,
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8,
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        bgcolor: category.color,
                        borderRadius: '4px 4px 0 0',
                    },
                }}
                onClick={() => onPreview(template)}
            >
                {/* Template Image */}
                {template.previewImage ? (
                    <CardMedia
                        component="img"
                        height="160"
                        image={template.previewImage}
                        alt={template.templateName}
                        sx={{ objectFit: 'cover' }}
                    />
                ) : (
                    <Box
                        sx={{
                            height: 160,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${category.color}15`,
                            fontSize: 64,
                        }}
                    >
                        {category.icon}
                    </Box>
                )}

                <CardContent sx={{ flex: 1, pt: 2 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" fontWeight={700} noWrap>
                                {template.templateName}
                            </Typography>
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

                    {/* Category */}
                    <Chip
                        label={category.label}
                        size="small"
                        sx={{
                            bgcolor: `${category.color}20`,
                            color: category.color,
                            fontWeight: 600,
                            mb: 1,
                        }}
                    />

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
                            mb: 1,
                        }}
                    >
                        {template.description || 'No description provided'}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Tooltip title="Total fields">
                            <Chip
                                label={`${template.fields?.length || 0} fields`}
                                size="small"
                                variant="outlined"
                            />
                        </Tooltip>
                        <Tooltip title="Times used">
                            <Chip
                                icon={<TrendingIcon />}
                                label={template.usageCount || 0}
                                size="small"
                                variant="outlined"
                                color="success"
                            />
                        </Tooltip>
                    </Box>

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                            {template.tags.slice(0, 3).map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            ))}
                            {template.tags.length > 3 && (
                                <Chip
                                    label={`+${template.tags.length - 3}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                        </Box>
                    )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={template.isActive}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    toggleActiveMutation.mutate()
                                }}
                                size="small"
                            />
                        }
                        label={
                            <Typography variant="caption">
                                {template.isActive ? 'Active' : 'Inactive'}
                            </Typography>
                        }
                        onClick={(e) => e.stopPropagation()}
                    />
                </CardActions>
            </Card>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { handleMenuClose(); onPreview(template); }}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Preview</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); onEdit(template); }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
