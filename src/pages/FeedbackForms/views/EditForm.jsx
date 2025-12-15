import React, {useState, useEffect, useRef, useCallback} from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material'
import {
    ArrowBack as BackIcon,
    Save as SaveIcon,
    Visibility as PreviewIcon,
} from '@mui/icons-material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { feedbackService } from '../../../api/services/feedbackService'
import { serviceService } from '../../../api/services/serviceService'
import { FormBuilder } from '../components/FormBuilder/FormBuilder'
import { FormRenderer } from '../components/FormRenderer/FormRenderer'
import toast from 'react-hot-toast'
import {useAuthStore} from "../../../store/authStore.js";

export const EditForm = () => {
    const { formId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        formName: '',
        formDescription: '',
        serviceId: '',
        fields: [],
        settings: {},
    })
    const [showPreview, setShowPreview] = useState(false)

    // Fetch form data
    const { data: formResponse, isLoading: formLoading } = useQuery({
        queryKey: ['form', formId],
        queryFn: () => feedbackService.getFormById(formId),
        enabled: !!formId,
    })

    // Fetch services
    const { data: servicesData } = useQuery({
        queryKey: ['services', { orgId: user?.orgId }],
        queryFn: () => serviceService.getServicesByOrg( user?.orgId ),
    })

    const services = servicesData || []
    const form = formResponse?.data

    // Initialize form data when loaded
    useEffect(() => {
        // console.log(form)
        if (form) {
            setFormData({
                formName: form.formName || '',
                formDescription: form.formDescription || '',
                serviceId: form.serviceId?.toString() || '',
                fields:Array.isArray(form.fields) ? form.fields : [],
                settings: form.settings || {},
            })
            // setFormData(form)
            // setFormData({...form, fields: form.fields})
        }
    }, [form])

    // Update form mutation
    const updateMutation = useMutation({
        mutationFn: (data) => feedbackService.updateForm(formId, data),
        onSuccess: () => {
            toast.success('Form updated successfully!')
            queryClient.invalidateQueries(['form', formId])
            queryClient.invalidateQueries(['forms'])
            navigate('/feedback/forms')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update form')
        },
    })

    const handleSave = () => {
        if (!formData.formName.trim()) {
            toast.error('Form name is required')
            return
        }
        if (!formData.serviceId) {
            toast.error('Please select a service')
            return
        }
        if (formData.fields.length === 0) {
            toast.error('At least one field is required')
            return
        }

        updateMutation.mutate({
            ...formData,
            serviceId: parseInt(formData.serviceId),
            orgId: user?.orgId,
        })
    }

    const fieldsChangeTimeoutRef = useRef(null)


// Replace handleFieldsChange with this debounced version
    const handleFieldsChange = useCallback((newFields) => {
        // Clear previous timeout
        if (fieldsChangeTimeoutRef.current) {
            clearTimeout(fieldsChangeTimeoutRef.current)
        }

        // Debounce the update
        fieldsChangeTimeoutRef.current = setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                fields: newFields,
            }))
        }, 100)
    }, [])

// Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (fieldsChangeTimeoutRef.current) {
                clearTimeout(fieldsChangeTimeoutRef.current)
            }
        }
    }, [])

    if (formLoading) {
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

    if (!form) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Form not found</Alert>
            </Box>
        )
    }

    // Check if form can be edited
    if (form.status !== 'DRAFT') {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    This form cannot be edited because it has been finalized. Only DRAFT forms can be edited.
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/feedback/forms')}
                    sx={{ mt: 2 }}
                >
                    Back to Forms
                </Button>
            </Box>
        )
    }

    // Check if form has responses
    if (form.metadata?.totalResponsesReceived > 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    This form cannot be edited because it has received {form.metadata.totalResponsesReceived} response(s).
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/feedback/forms')}
                    sx={{ mt: 2 }}
                >
                    Back to Forms
                </Button>
            </Box>
        )
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
                        Edit Form
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Editing: {form.formName} (Version {form.version})
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    onClick={() => setShowPreview(!showPreview)}
                >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={updateMutation.isLoading}
                >
                    {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>

            {/* Alert */}
            <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
                <Alert severity="info">
                    This form is in DRAFT status. You can edit it freely until you finalize it.
                </Alert>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {showPreview ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 3,
                            height: '100%',
                        }}
                    >
                        {/* Left: Form Builder */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Basic Info
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Form Name"
                                        fullWidth
                                        required
                                        value={formData.formName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, formName: e.target.value })
                                        }
                                    />

                                    <TextField
                                        label="Form Description"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={formData.formDescription}
                                        onChange={(e) =>
                                            setFormData({ ...formData, formDescription: e.target.value })
                                        }
                                    />

                                    <TextField
                                        select
                                        label="Service"
                                        fullWidth
                                        required
                                        value={formData.serviceId ? formData.serviceId.toString() : ''}
                                        onChange={(e) =>
                                            setFormData({ ...formData, serviceId: e.target.value })
                                        }
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="">Select a service</option>
                                        {services.map((service) => (
                                            <option key={service.serviceId} value={service.serviceId}>
                                                {service.serviceName}
                                            </option>
                                        ))}
                                    </TextField>
                                </Box>
                            </Paper>

                            <Paper sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Form Fields
                                </Typography>
                                <FormBuilder
                                    initialFields={formData.fields}
                                    onFieldsChange={handleFieldsChange}
                                    mode="form"
                                />
                            </Paper>
                        </Box>

                        {/* Right: Live Preview */}
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Basic Info */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Basic Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Form Name"
                                    fullWidth
                                    required
                                    value={formData.formName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, formName: e.target.value })
                                    }
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

                        {/* Form Builder */}
                        <Box sx={{ flex: 1 }}>
                            {/*<code>{JSON.stringify(form?.fields, null, 2)}</code>*/}
                            <FormBuilder
                                initialFields={form?.fields}
                                onFieldsChange={handleFieldsChange}
                                mode="form"
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
