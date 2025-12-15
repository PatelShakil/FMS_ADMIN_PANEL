import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Chip,
    IconButton,
} from '@mui/material'
import {
    Close as CloseIcon,
    Add as AddIcon,
} from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { feedbackService } from '../../../../api/services/feedbackService'
import { TEMPLATE_CATEGORIES } from '../../constants/formConstants'
import { TemplateImageUpload } from './TemplateImageUpload'
import { FormBuilder } from '../FormBuilder/FormBuilder'
import toast from 'react-hot-toast'

export const EditTemplateDialog = ({ open, onClose, template, onSuccess }) => {
    const [templateData, setTemplateData] = useState({
        templateName: '',
        category: 'Infrastructure',
        description: '',
        previewImage: '',
        tags: [],
        fields: [],
        settings: {},
    })
    const [tagInput, setTagInput] = useState('')
    const [showFormBuilder, setShowFormBuilder] = useState(false)

    useEffect(() => {
        if (template) {
            setTemplateData({
                templateName: template.templateName || '',
                category: template.category || 'Infrastructure',
                description: template.description || '',
                previewImage: template.previewImage || '',
                tags: template.tags || [],
                fields: template.fields || [],
                settings: template.settings || {},
            })
        }
    }, [template])

    const updateMutation = useMutation({
        mutationFn: (data) => feedbackService.updateTemplate(template.templateId, data),
        onSuccess: () => {
            toast.success('Template updated successfully!')
            onSuccess()
            onClose()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update template')
        },
    })

    const handleSubmit = () => {
        if (!templateData.templateName.trim()) {
            toast.error('Template name is required')
            return
        }
        if (templateData.fields.length === 0) {
            toast.error('At least one field is required')
            return
        }

        updateMutation.mutate(templateData)
    }

    const handleAddTag = () => {
        if (tagInput.trim() && !templateData.tags.includes(tagInput.trim())) {
            setTemplateData({
                ...templateData,
                tags: [...templateData.tags, tagInput.trim()],
            })
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTemplateData({
            ...templateData,
            tags: templateData.tags.filter((tag) => tag !== tagToRemove),
        })
    }

    const handleFieldsChange = (newFields) => {
        setTemplateData({
            ...templateData,
            fields: newFields,
        })
    }

    if (!template) return null

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { height: '90vh' },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>
                        Edit Template
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {!showFormBuilder ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Template Name"
                            fullWidth
                            required
                            value={templateData.templateName}
                            onChange={(e) =>
                                setTemplateData({ ...templateData, templateName: e.target.value })
                            }
                        />

                        <TextField
                            select
                            label="Category"
                            fullWidth
                            required
                            value={templateData.category}
                            onChange={(e) =>
                                setTemplateData({ ...templateData, category: e.target.value })
                            }
                        >
                            {Object.values(TEMPLATE_CATEGORIES).map((category) => (
                                <MenuItem key={category.value} value={category.value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>{category.icon}</span>
                                        <span>{category.label}</span>
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={templateData.description}
                            onChange={(e) =>
                                setTemplateData({ ...templateData, description: e.target.value })
                            }
                        />

                        {/* Preview Image Upload */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Preview Image
                            </Typography>
                            <TemplateImageUpload
                                currentImage={templateData.previewImage}
                                onImageChange={(url) =>
                                    setTemplateData({ ...templateData, previewImage: url })
                                }
                            />
                        </Box>

                        {/* Tags */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Tags
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Add a tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddTag()
                                        }
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddTag}
                                    startIcon={<AddIcon />}
                                >
                                    Add
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {templateData.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        onDelete={() => handleRemoveTag(tag)}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Edit Fields Button */}
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setShowFormBuilder(true)}
                        >
                            Edit Form Fields ({templateData.fields.length})
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ height: '100%' }}>
                        <FormBuilder
                            initialFields={templateData.fields}
                            onFieldsChange={handleFieldsChange}
                            mode="template"
                        />
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                {showFormBuilder && (
                    <Button onClick={() => setShowFormBuilder(false)}>
                        Back to Info
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={updateMutation.isLoading}
                >
                    {updateMutation.isLoading ? 'Updating...' : 'Update Template'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
