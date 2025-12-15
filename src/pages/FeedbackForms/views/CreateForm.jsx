import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Alert,
} from '@mui/material'
import {
    ArrowBack as BackIcon,
    Save as SaveIcon,
    Visibility as PreviewIcon,
} from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { feedbackService } from '../../../api/services/feedbackService'
import { serviceService } from '../../../api/services/serviceService'
import { FormBuilder } from '../components/FormBuilder/FormBuilder'
import { FormRenderer } from '../components/FormRenderer/FormRenderer'
import { STARTER_FIELDS, DEFAULT_FORM_SETTINGS } from '../constants/formConstants'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {useAuthStore} from "../../../store/authStore.js";

const steps = ['Basic Info', 'Build Form', 'Preview']

export const CreateForm = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const [activeStep, setActiveStep] = useState(0)
    const [formData, setFormData] = useState({
        formName: '',
        formDescription: '',
        serviceId: '',
        fields: [...STARTER_FIELDS],
        settings: { ...DEFAULT_FORM_SETTINGS },
    })
    const [showPreview, setShowPreview] = useState(false)

    // Fetch services
    const { data: servicesData } = useQuery({
        queryKey: ['services', { orgId: user?.orgId }],
        queryFn: () => serviceService.getServicesByOrg( user?.orgId ),
    })

    const services = servicesData || []

    // Create form mutation
    const createMutation = useMutation({
        mutationFn: (data) => feedbackService.createForm(data),
        onSuccess: () => {
            toast.success('Form created successfully!')
            navigate('/feedback/forms')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to create form')
        },
    })

    const handleNext = () => {
        // Validation
        if (activeStep === 0) {
            if (!formData.formName.trim()) {
                toast.error('Form name is required')
                return
            }
            if (!formData.serviceId) {
                toast.error('Please select a service')
                return
            }
        }

        if (activeStep === 1) {
            if (formData.fields.length === 0) {
                toast.error('At least one field is required')
                return
            }
        }

        setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const handleSaveDraft = () => {
        createMutation.mutate({
            ...formData,
            serviceId: parseInt(formData.serviceId),
            orgId: user?.orgId,
        })
    }

    const handleFieldsChange = (newFields) => {
        setFormData({
            ...formData,
            fields: newFields,
        })
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    flexShrink: 0,
                }}
            >
                <IconButton onClick={() => navigate('/feedback/forms')}>
                    <BackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={700}>
                        Create New Form
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Build a custom feedback form from scratch
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={activeStep === 0}
                >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDraft}
                    disabled={createMutation.isLoading || !formData.formName || !formData.serviceId}
                >
                    {createMutation.isLoading ? 'Saving...' : 'Save as Draft'}
                </Button>
            </Box>

            {/* Stepper */}
            <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {/* Step 0: Basic Info */}
                {activeStep === 0 && (
                    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Form Name"
                                fullWidth
                                required
                                value={formData.formName}
                                onChange={(e) =>
                                    setFormData({ ...formData, formName: e.target.value })
                                }
                                placeholder="e.g., Road Complaint Form"
                            />

                            <TextField
                                label="Form Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.formDescription}
                                onChange={(e) =>
                                    setFormData({ ...formData, formDescription: e.target.value })
                                }
                                placeholder="Describe what this form is for..."
                            />

                            <TextField
                                select
                                label="Service"
                                fullWidth
                                required
                                value={formData.serviceId}
                                onChange={(e) =>
                                    setFormData({ ...formData, serviceId: e.target.value })
                                }
                                SelectProps={{
                                    native: true,
                                }}
                                helperText="Select which service this form belongs to"
                            >
                                <option value="">Select a service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.serviceName}
                                    </option>
                                ))}
                            </TextField>
                            <TextField
                                label="Redirect URL"
                                fullWidth
                                value={formData.settings?.redirectUrl || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, settings: { ...formData.settings, redirectUrl: e.target.value }})
                                }
                                placeholder="Redirect url where user goes after form submission"
                            />

                        </Box>
                    </Paper>
                )}

                {/* Step 1: Build Form */}
                {activeStep === 1 && (
                    <Box sx={{ height: '100%' }}>
                        {showPreview ? (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 3,
                                    height: '100%',
                                }}
                            >
                                <Paper sx={{ p: 2, overflow: 'auto' }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        Form Builder
                                    </Typography>
                                    <FormBuilder
                                        initialFields={formData.fields}
                                        onFieldsChange={handleFieldsChange}
                                        mode="form"
                                    />
                                </Paper>
                                <Paper sx={{ p: 3, overflow: 'auto' }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        Live Preview
                                    </Typography>
                                    <FormRenderer
                                        fields={formData.fields}
                                        settings={formData.settings}
                                        formTitle={formData.formName}
                                        formDescription={formData.formDescription}
                                        mode="preview"
                                    />
                                </Paper>
                            </Box>
                        ) : (
                            <FormBuilder
                                initialFields={formData.fields}
                                onFieldsChange={handleFieldsChange}
                                mode="form"
                            />
                        )}
                    </Box>
                )}

                {/* Step 2: Preview */}
                {activeStep === 2 && (
                    <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Review your form before saving. You can still edit it after saving as a draft.
                        </Alert>
                        <FormRenderer
                            fields={formData.fields}
                            settings={formData.settings}
                            formTitle={formData.formName}
                            formDescription={formData.formDescription}
                            mode="preview"
                        />
                    </Paper>
                )}
            </Box>

            {/* Footer Actions */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    flexShrink: 0,
                }}
            >
                <Button
                    onClick={() => navigate('/feedback/forms')}
                >
                    Cancel
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {activeStep > 0 && (
                        <Button onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                        <Button variant="contained" onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleSaveDraft}
                            disabled={createMutation.isLoading}
                        >
                            {createMutation.isLoading ? 'Creating...' : 'Create Form'}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    )
}
