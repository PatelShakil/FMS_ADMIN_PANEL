import React, { useState } from 'react'
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Chip,
} from '@mui/material'
import {
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
} from '@mui/icons-material'
import { useDraggable } from '@dnd-kit/core'
import { FIELD_TYPES, FIELD_CATEGORIES } from '../../constants/formConstants'

const DraggableFieldType = ({ fieldType, onAdd, compact }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${fieldType.value}`,
        data: {
            type: 'palette-field',
            fieldType: fieldType.value,
        },
    })

    return (
        <ListItem
            disablePadding
            ref={setNodeRef}
            sx={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab',
                '&:active': {
                    cursor: 'grabbing',
                },
            }}
            {...attributes}
            {...listeners}
        >
            <ListItemButton
                onClick={() => onAdd(fieldType.value)}
                sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                        bgcolor: 'primary.light',
                        '& .MuiListItemText-primary': {
                            color: 'primary.contrastText',
                        },
                        '& .MuiListItemIcon-root': {
                            color: 'primary.contrastText',
                        },
                    },
                }}
            >
                <ListItemIcon sx={{ minWidth: 40 }}>
                    <Typography fontSize={24}>{fieldType.icon}</Typography>
                </ListItemIcon>
                <ListItemText
                    primary={fieldType.label}
                    secondary={!compact && fieldType.description}
                    primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 600,
                    }}
                    secondaryTypographyProps={{
                        variant: 'caption',
                    }}
                />
                {!compact && (
                    <AddIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                )}
            </ListItemButton>
        </ListItem>
    )
}

export const FieldPalette = ({ onAddField, compact = false }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedCategory, setExpandedCategory] = useState('basic')

    // Group fields by category
    const fieldsByCategory = Object.entries(FIELD_CATEGORIES).reduce((acc, [key, category]) => {
        acc[key] = Object.values(FIELD_TYPES).filter(
            field => field.category === key
        )
        return acc
    }, {})

    // Filter fields by search
    const filteredFieldsByCategory = Object.entries(fieldsByCategory).reduce((acc, [key, fields]) => {
        const filtered = fields.filter(field =>
            field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            field.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (filtered.length > 0) {
            acc[key] = filtered
        }
        return acc
    }, {})

    return (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Field Types
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                {compact ? 'Tap to add' : 'Drag to canvas or click to add'}
            </Typography>

            {/* Search */}
            <TextField
                size="small"
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            {/* Field Categories */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {Object.entries(filteredFieldsByCategory)
                    .sort(([, a], [, b]) => FIELD_CATEGORIES[a[0]?.category]?.order - FIELD_CATEGORIES[b[0]?.category]?.order)
                    .map(([categoryKey, fields]) => {
                        const category = FIELD_CATEGORIES[categoryKey]
                        return (
                            <Accordion
                                key={categoryKey}
                                expanded={expandedCategory === categoryKey}
                                onChange={(e, isExpanded) => setExpandedCategory(isExpanded ? categoryKey : null)}
                                disableGutters
                                elevation={0}
                                sx={{
                                    '&:before': { display: 'none' },
                                    mb: 1,
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        bgcolor: 'background.default',
                                        borderRadius: 1,
                                        minHeight: 48,
                                        '&.Mui-expanded': {
                                            minHeight: 48,
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography fontSize={20}>{category.icon}</Typography>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {category.label}
                                        </Typography>
                                        <Chip
                                            label={fields.length}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                bgcolor: `${category.color}20`,
                                                color: category.color,
                                            }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 1 }}>
                                    <List disablePadding>
                                        {fields.map((field) => (
                                            <DraggableFieldType
                                                key={field.value}
                                                fieldType={field}
                                                onAdd={onAddField}
                                                compact={compact}
                                            />
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
            </Box>

            {/* Stats */}
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                    {Object.values(filteredFieldsByCategory).flat().length} field types available
                </Typography>
            </Box>
        </Box>
    )
}
