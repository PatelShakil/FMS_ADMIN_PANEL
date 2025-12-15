import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material'
import { VIEW_MODES } from '../../constants/formConstants'
import { FormCard } from './FormCard'
import { FormPreviewDialog } from './FormPreviewDialog'

export const FormList = ({ forms, loading, viewMode, onRefresh }) => {
    const [selectedForm, setSelectedForm] = useState(null)
    const [previewOpen, setPreviewOpen] = useState(false)

    const handlePreview = (form) => {
        setSelectedForm(form)
        setPreviewOpen(true)
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (!forms || forms.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap: 2,
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No forms found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create your first form or use a template to get started
                </Typography>
            </Box>
        )
    }

    return (
        <>
            <Grid container spacing={3}>
                {forms.map((form) => (
                    <Grid
                        item
                        xs={12}
                        sm={viewMode === VIEW_MODES.GRID ? 6 : 12}
                        md={viewMode === VIEW_MODES.GRID ? 4 : 12}
                        lg={viewMode === VIEW_MODES.GRID ? 3 : 12}
                        key={form.formId}
                    >
                        <FormCard
                            form={form}
                            viewMode={viewMode}
                            onPreview={handlePreview}
                            onRefresh={onRefresh}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Preview Dialog */}
            <FormPreviewDialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                form={selectedForm}
            />
        </>
    )
}
