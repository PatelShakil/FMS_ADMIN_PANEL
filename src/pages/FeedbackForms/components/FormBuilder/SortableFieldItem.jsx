import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material'
import {
    DragIndicator as DragIcon,
    MoreVert as MoreVertIcon,
    FileCopy as DuplicateIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FIELD_TYPES } from '../../constants/formConstants'

export const SortableFieldItem = ({
                                      field,
                                      index,
                                      isSelected,
                                      onSelect,
                                      onDelete,
                                      onDuplicate,
                                  }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.fieldId })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const fieldConfig = FIELD_TYPES[field.fieldType?.toUpperCase()] || {}

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
            case 'duplicate':
                onDuplicate(field.fieldId)
                break
            case 'delete':
                onDelete(field.fieldId)
                break
        }
    }

    return (
        <>
            <Paper
                ref={setNodeRef}
                style={style}
                sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: 2,
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    bgcolor: isSelected ? 'primary.light' : 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        boxShadow: 2,
                    },
                }}
                onClick={() => onSelect(field.fieldId)}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    {/* Drag Handle */}
                    <Box
                        {...attributes}
                        {...listeners}
                        sx={{
                            cursor: 'grab',
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            '&:active': { cursor: 'grabbing' },
                        }}
                    >
                        <DragIcon />
                    </Box>

                    {/* Field Icon */}
                    <Box
                        sx={{
                            fontSize: 32,
                            lineHeight: 1,
                            mt: 0.5,
                        }}
                    >
                        {fieldConfig.icon}
                    </Box>

                    {/* Field Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={700} noWrap>
                                {index + 1}. {field.fieldLabel}
                            </Typography>
                            {field.required && (
                                <Chip
                                    label="Required"
                                    size="small"
                                    color="error"
                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                            )}
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Type: {fieldConfig.label || field.fieldType}
                        </Typography>

                        {field.placeholder && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Placeholder: "{field.placeholder}"
                            </Typography>
                        )}

                        {field.helpText && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                                Help: {field.helpText}
                            </Typography>
                        )}

                        {/* Options preview for choice fields */}
                        {field.options && field.options.length > 0 && (
                            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {field.options.slice(0, 3).map((option, idx) => (
                                    <Chip
                                        key={idx}
                                        label={option.label}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 18, fontSize: '0.65rem' }}
                                    />
                                ))}
                                {field.options.length > 3 && (
                                    <Chip
                                        label={`+${field.options.length - 3} more`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 18, fontSize: '0.65rem' }}
                                    />
                                )}
                            </Box>
                        )}

                        {/* Validation info */}
                        {field.validation && Object.keys(field.validation).length > 0 && (
                            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {field.validation.minLength && (
                                    <Chip
                                        label={`Min: ${field.validation.minLength}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 18, fontSize: '0.65rem' }}
                                    />
                                )}
                                {field.validation.maxLength && (
                                    <Chip
                                        label={`Max: ${field.validation.maxLength}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 18, fontSize: '0.65rem' }}
                                    />
                                )}
                                {field.validation.min !== undefined && (
                                    <Chip
                                        label={`Min: ${field.validation.min}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 18, fontSize: '0.65rem' }}
                                    />
                                )}
                                {field.validation.max !== undefined && (
                                    <Chip
                                        label={`Max: ${field.validation.max}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 18, fontSize: '0.65rem' }}
                                    />
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Tooltip title="Edit field">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSelect(field.fieldId)
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            size="small"
                            onClick={handleMenuOpen}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleAction('duplicate')}>
                    <ListItemIcon>
                        <DuplicateIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAction('delete')}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
