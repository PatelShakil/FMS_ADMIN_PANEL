import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    IconButton,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { VIEW_MODES } from '../../constants/formConstants'
import { TemplateCard } from './TemplateCard'
import { TemplatePreviewDialog } from './TemplatePreviewDialog'
import { EditTemplateDialog } from './EditTemplateDialog'

export const TemplateGallery = ({ templates, loading, viewMode, onRefresh }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    const handlePreview = (template) => {
        setSelectedTemplate(template)
        setPreviewOpen(true)
    }

    const handleEdit = (template) => {
        setSelectedTemplate(template)
        setEditOpen(true)
    }

    const handleEditSuccess = () => {
        onRefresh()
        setEditOpen(false)
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

    if (!templates || templates.length === 0) {
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
                    No templates found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create your first template to get started
                </Typography>
            </Box>
        )
    }

    return (
        <>
            <Grid container spacing={3}>
                {templates.map((template) => (
                    <Grid
                        item
                        xs={12}
                        sm={viewMode === VIEW_MODES.GRID ? 6 : 12}
                        md={viewMode === VIEW_MODES.GRID ? 4 : 12}
                        lg={viewMode === VIEW_MODES.GRID ? 3 : 12}
                        key={template.templateId}
                    >
                        <TemplateCard
                            template={template}
                            viewMode={viewMode}
                            onPreview={handlePreview}
                            onEdit={handleEdit}
                            onRefresh={onRefresh}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Preview Dialog */}
            <TemplatePreviewDialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                template={selectedTemplate}
            />

            {/* Edit Dialog */}
            <EditTemplateDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                template={selectedTemplate}
                onSuccess={handleEditSuccess}
            />
        </>
    )
}
