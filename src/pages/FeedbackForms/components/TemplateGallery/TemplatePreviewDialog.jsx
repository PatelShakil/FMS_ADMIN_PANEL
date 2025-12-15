import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Chip,
    Divider,
    IconButton,
} from '@mui/material'
import {
    Close as CloseIcon,
    FileCopy as CloneIcon,
} from '@mui/icons-material'
import { TEMPLATE_CATEGORIES } from '../../constants/formConstants'
import { FormRenderer } from '../FormRenderer/FormRenderer'

export const TemplatePreviewDialog = ({ open, onClose, template }) => {
    if (!template) return null

    const category = TEMPLATE_CATEGORIES[template.category?.toUpperCase().replace(' ', '_')] || TEMPLATE_CATEGORIES.OTHER

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { height: '90vh' },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            {template.templateName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                                label={category.label}
                                size="small"
                                sx={{
                                    bgcolor: `${category.color}20`,
                                    color: category.color,
                                }}
                            />
                            <Chip
                                label={`${template.usageCount || 0} uses`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    {/* Template Info */}
                    {template.description && (
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {template.description}
                        </Typography>
                    )}

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                            {template.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                            ))}
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Form Preview ({template.fields?.length || 0} fields)
                    </Typography>
                </Box>

                {/* Form Preview */}
                <FormRenderer
                    fields={template.fields || []}
                    settings={template.settings}
                    mode="preview"
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
