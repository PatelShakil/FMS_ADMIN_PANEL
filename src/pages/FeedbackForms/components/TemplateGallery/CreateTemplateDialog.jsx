import React, { useState } from 'react'
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
    Stepper,
    Step,
    StepLabel,
    Alert,
} from '@mui/material'
import {
    Close as CloseIcon,
    Add as AddIcon,
} from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { feedbackService } from '../../../../api/services/feedbackService'
import { TEMPLATE_CATEGORIES, DEFAULT_FORM_SETTINGS, STARTER_FIELDS } from '../../constants/formConstants'
import { TemplateImageUpload } from './TemplateImageUpload'
import { FormBuilder } from '../FormBuilder/FormBuilder'
import toast from 'react-hot-toast'

const steps = ['Basic Info', 'Design Form', 'Review']

export const CreateTemplateDialog = ({ open, onClose, onSuccess }) => {
    const [activeStep, setActiveStep] = useState(0)
    const [templateData, setTemplateData] = useState({
        templateName: '',
        category: 'Infrastructure',
        description: '',
        previewImage: '',
        tags: [],
        fields: [...STARTER_FIELDS], // Start with name and email
        settings: { ...DEFAULT_FORM_SETTINGS },
    })
    const [tagInput, setTagInput] = useState('')

    const createMutation = useMutation({
        mutationFn: (data) => feedbackService.createTemplate(data),
        onSuccess: () => {
            toast.success('Template created successfully!')
            onSuccess()
            handleReset()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to create template')
        },
    })

    const handleNext = () => {
        // Validation for each step
        if (activeStep === 0) {
            if (!templateData.templateName.trim()) {
                toast.error('Template name is required')
                return
            }
            if (!templateData.category) {
                toast.error('Category is required')
                return
            }
        }

        if (activeStep === 1) {
            if (templateData.fields.length === 0) {
                toast.error('At least one field is required')
                return
            }
        }

        setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const handleSubmit = () => {
        createMutation.mutate(templateData)
    }

    const handleReset = () => {
        setActiveStep(0)
        setTemplateData({
            templateName: '',
            category: 'Infrastructure',
            description: '',
            previewImage: '',
            tags: [],
            fields: [...STARTER_FIELDS],
            settings: { ...DEFAULT_FORM_SETTINGS },
        })
        setTagInput('')
        onClose()
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
                        Create New Template
                    </Typography>
                    <IconButton onClick={handleReset} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* Stepper */}
            <Box sx={{ px: 3, pt: 1 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <DialogContent dividers>
                {/* Step 0: Basic Info */}
                {activeStep === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Template Name"
                            fullWidth
                            required
                            value={templateData.templateName}
                            onChange={(e) =>
                                setTemplateData({ ...templateData, templateName: e.target.value })
                            }
                            placeholder="e.g., Road Complaint Form"
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
                            placeholder="Describe what this template is for..."
                        />

                        {/* Preview Image Upload */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Preview Image (Optional)
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
                                Tags (Optional)
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
                    </Box>
                )}

                {/* Step 1: Design Form */}
                {activeStep === 1 && (
                    <Box sx={{ height: '100%' }}>
                        <FormBuilder
                            initialFields={templateData.fields}
                            onFieldsChange={handleFieldsChange}
                            mode="template"
                        />
                    </Box>
                )}

                {/* Step 2: Review */}
                {activeStep === 2 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Alert severity="info">
                            Review your template before creating. You can edit it later if needed.
                        </Alert>

                        {/* Template Info */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Template Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Name:
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {templateData.templateName}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Category:
                                    </Typography>
                                    <Typography variant="body1">
                                        {TEMPLATE_CATEGORIES[templateData.category.toUpperCase().replace(' ', '_')]?.icon}{' '}
                                        {templateData.category}
                                    </Typography>
                                </Box>
                                {templateData.description && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Description:
                                        </Typography>
                                        <Typography variant="body2">
                                            {templateData.description}
                                        </Typography>
                                    </Box>
                                )}
                                {templateData.tags.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Tags:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                                            {templateData.tags.map((tag) => (
                                                <Chip key={tag} label={tag} size="small" />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Form Fields Summary */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Form Fields ({templateData.fields.length})
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {templateData.fields.map((field, index) => (
                                    <Box
                                        key={field.fieldId}
                                        sx={{
                                            p: 2,
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {index + 1}. {field.fieldLabel}
                                                {field.required && (
                                                    <Chip
                                                        label="Required"
                                                        size="small"
                                                        color="error"
                                                        sx={{ ml: 1, height: 20 }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Type: {field.fieldType}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleReset}>Cancel</Button>
                <Box sx={{ flex: 1 }} />
                {activeStep > 0 && (
                    <Button onClick={handleBack}>Back</Button>
                )}
                {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={createMutation.isLoading}
                    >
                        {createMutation.isLoading ? 'Creating...' : 'Create Template'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}
