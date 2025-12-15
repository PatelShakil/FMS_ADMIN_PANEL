import React from 'react'
import {
    Box,
    Paper,
    Typography,
    Chip,
} from '@mui/material'
import { FIELD_TYPES } from '../../constants/formConstants'

export const FieldItem = ({ field, isDragging = false }) => {
    if (!field) return null

    const fieldConfig = FIELD_TYPES[field.fieldType?.toUpperCase()] || {}

    return (
        <Paper
            sx={{
                p: 2,
                minWidth: 300,
                border: 2,
                borderColor: 'primary.main',
                bgcolor: 'background.paper',
                boxShadow: isDragging ? 8 : 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ fontSize: 32, lineHeight: 1 }}>
                    {fieldConfig.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={700}>
                            {field.fieldLabel}
                        </Typography>
                        {field.required && (
                            <Chip
                                label="Required"
                                size="small"
                                color="error"
                                sx={{ height: 20 }}
                            />
                        )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        {fieldConfig.label}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}
