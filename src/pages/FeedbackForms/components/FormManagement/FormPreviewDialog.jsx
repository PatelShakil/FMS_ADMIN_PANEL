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
    IconButton,
} from '@mui/material'
import {
    Close as CloseIcon,
} from '@mui/icons-material'
import { FORM_STATUS } from '../../constants/formConstants'
import { FormRenderer } from '../FormRenderer/FormRenderer'

export const FormPreviewDialog = ({ open, onClose, form }) => {
    if (!form) return null

    const status = FORM_STATUS[form.status] || FORM_STATUS.DRAFT

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
                            {form.formName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                                label={`${status.icon} ${status.label}`}
                                size="small"
                                color={status.color}
                            />
                            <Chip
                                label={`Version ${form.version || 1}`}
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
                <FormRenderer
                    fields={form.fields || []}
                    settings={form.settings}
                    formTitle={form.formName}
                    formDescription={form.formDescription}
                    mode="preview"
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
