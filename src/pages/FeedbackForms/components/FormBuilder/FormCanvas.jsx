import React from 'react'
import {
    Box,
    Typography,
    Button,
    Paper,
} from '@mui/material'
import {
    Add as AddIcon,
    GridOn as GridIcon,
} from '@mui/icons-material'
import { useDroppable } from '@dnd-kit/core'
import { SortableFieldItem } from './SortableFieldItem'

export const FormCanvas = ({
                               fields,
                               selectedFieldId,
                               onSelectField,
                               onDeleteField,
                               onDuplicateField,
                           }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'form-canvas',
    })

    if (fields.length === 0) {
        return (
            <Box
                ref={setNodeRef}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    p: 4,
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: isOver ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    bgcolor: isOver ? 'primary.light' : 'transparent',
                    transition: 'all 0.2s',
                }}
            >
                <GridIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                    Drag fields here to start building
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    Or click on a field type from the left panel
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            ref={setNodeRef}
            sx={{
                minHeight: '100%',
                p: 3,
                bgcolor: isOver ? 'primary.light' : 'transparent',
                transition: 'background-color 0.2s',
            }}
        >
            {/* Form Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Form Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {fields.length} field{fields.length !== 1 ? 's' : ''} added
                </Typography>
            </Box>

            {/* Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {fields.map((field, index) => (
                    <SortableFieldItem
                        key={field.fieldId}
                        field={field}
                        index={index}
                        isSelected={field.fieldId === selectedFieldId}
                        onSelect={onSelectField}
                        onDelete={onDeleteField}
                        onDuplicate={onDuplicateField}
                    />
                ))}
            </Box>
        </Box>
    )
}
