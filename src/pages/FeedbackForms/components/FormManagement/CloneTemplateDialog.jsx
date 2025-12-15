import React, { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Alert,
    CircularProgress,
} from '@mui/material'
import {
    Close as CloseIcon,
} from '@mui/icons-material'
import { useQuery, useMutation } from '@tanstack/react-query'
import { feedbackService } from '../../../../api/services/feedbackService'
import { serviceService } from '../../../../api/services/serviceService'
import { TEMPLATE_CATEGORIES } from '../../constants/formConstants'
import toast from 'react-hot-toast'
import {useAuthStore} from "../../../../store/authStore.js";

export const CloneTemplateDialog = ({ open, onClose, onSuccess }) => {
    const { user } = useAuthStore()
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [formName, setFormName] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [selectedServiceId, setSelectedServiceId] = useState('')

    // Fetch templates
    const { data: templatesData, isLoading: templatesLoading } = useQuery({
        queryKey: ['templates', { isActive: true }],
        queryFn: () => feedbackService.getAllTemplates({ isActive: true }),
        enabled: open,
    })

    // Fetch services
    const { data: servicesData } = useQuery({
        // queryKey: ['services', { orgId: user?.orgId }],
        queryFn: () => serviceService.getServicesByOrg( user?.orgId),
        enabled: open,
    })

    const templates = templatesData?.data || []
    const services = servicesData || []

    // Clone template
    const cloneMutation = useMutation({
        mutationFn: (data) => feedbackService.cloneTemplateToForm(selectedTemplate.templateId, data),
        onSuccess: () => {
            toast.success('Form created from template successfully!')
            onSuccess()
            handleReset()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to clone template')
        },
    })

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template)
        setFormName(template.templateName)
        setFormDescription(template.description || '')
    }

    const handleSubmit = () => {
        if (!selectedTemplate) {
            toast.error('Please select a template')
            return
        }
        if (!formName.trim()) {
            toast.error('Form name is required')
            return
        }
        if (!selectedServiceId) {
            toast.error('Please select a service')
            return
        }

        cloneMutation.mutate({
            serviceId: parseInt(selectedServiceId),
            orgId: user?.orgId,
            formName,
            formDescription,
            fields:selectedTemplate.fields
        })
    }

    const handleReset = () => {
        setSelectedTemplate(null)
        setFormName('')
        setFormDescription('')
        setSelectedServiceId('')
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleReset}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { height: '90vh' },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>
                        Clone Template to Form
                    </Typography>
                    <IconButton onClick={handleReset} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {!selectedTemplate ? (
                    // Step 1: Select Template
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Select a Template
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Choose a template to create your form from
                        </Typography>

                        {templatesLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : templates.length === 0 ? (
                            <Alert severity="info">
                                No templates available. Contact your administrator.
                            </Alert>
                        ) : (
                            <Grid container spacing={2}>
                                {templates.map((template) => {
                                    const category = TEMPLATE_CATEGORIES[template.category?.toUpperCase().replace(' ', '_')] || TEMPLATE_CATEGORIES.OTHER
                                    return (
                                        <Grid item xs={12} sm={6} key={template.templateId}>
                                            <Card
                                                sx={{
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: 4,
                                                    },
                                                }}
                                                onClick={() => handleTemplateSelect(template)}
                                            >
                                                {template.previewImage ? (
                                                    <CardMedia
                                                        component="img"
                                                        height="120"
                                                        image={template.previewImage}
                                                        alt={template.templateName}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            height: 120,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            bgcolor: `${category.color}15`,
                                                            fontSize: 48,
                                                        }}
                                                    >
                                                        {category.icon}
                                                    </Box>
                                                )}
                                                <CardContent>
                                                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                                        {template.templateName}
                                                    </Typography>
                                                    <Chip
                                                        label={category.label}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: `${category.color}20`,
                                                            color: category.color,
                                                            mb: 1,
                                                        }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        {template.fields?.length || 0} fields • {template.usageCount || 0} uses
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        )}
                    </Box>
                ) : (
                    // Step 2: Configure Form
                    <Box>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Creating form from: <strong>{selectedTemplate.templateName}</strong>
                        </Alert>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Form Name"
                                fullWidth
                                required
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                helperText="Name for your feedback form"
                            />

                            <TextField
                                label="Form Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                helperText="Brief description of the form purpose"
                            />

                            <TextField
                                select
                                label="Service"
                                fullWidth
                                required
                                value={selectedServiceId}
                                onChange={(e) => setSelectedServiceId(e.target.value)}
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

                            <Alert severity="warning">
                                This will create a new DRAFT form. You can edit it before finalizing.
                            </Alert>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleReset}>Cancel</Button>
                {selectedTemplate && (
                    <Button onClick={() => setSelectedTemplate(null)}>
                        Back
                    </Button>
                )}
                {selectedTemplate && (
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={cloneMutation.isLoading}
                    >
                        {cloneMutation.isLoading ? 'Creating...' : 'Create Form'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}
