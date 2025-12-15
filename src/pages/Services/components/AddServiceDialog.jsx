import React, { useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    FormControlLabel,
    Switch,
    Box,
    Typography,
    Divider,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Autocomplete,
} from '@mui/material'
import {
    Close as CloseIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Save as SaveIcon,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { serviceService } from '../../../api/services/serviceService'
import { useAuthStore } from '../../../store/authStore'
import { SERVICE_TYPES } from '../constants/serviceConstants'
import toast from 'react-hot-toast'

const serviceSchema = z.object({
    serviceName: z.string().min(3, 'Service name must be at least 3 characters'),
    displayCode: z.string().optional(),
    serviceType: z.enum(['DEPARTMENT', 'DIVISION', 'BRANCH', 'LOCATION', 'FACILITY', 'EQUIPMENT', 'OTHER']),
    description: z.string().optional(),
    shortDescription: z.string().max(200, 'Short description must be less than 200 characters').optional(),
    contactPersonName: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    contactAddress: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode').optional().or(z.literal('')),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    operatingHours: z.string().optional(),
    isPublic: z.boolean().default(true),
    isFeedbackEnabled: z.boolean().default(true),
    metadata: z.string().optional(),
})

const steps = ['Basic Information', 'Contact Details', 'Location & Settings']

export const AddServiceDialog = ({ open, onClose, parentServiceId, serviceId, onSuccess }) => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const [activeStep, setActiveStep] = React.useState(0)

    const isEdit = !!serviceId

    // Fetch service data if editing
    const { data: serviceData } = useQuery({
        queryKey: ['service', serviceId],
        queryFn: () => serviceService.getServiceById(serviceId),
        enabled: isEdit && open,
    })

    // Fetch all services for parent selection
    const { data: allServices } = useQuery({
        queryKey: ['services', user?.orgId],
        queryFn: () => serviceService.getServicesByOrg(user.orgId),
        enabled: open,
    })

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
        watch,
    } = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            serviceName: '',
            displayCode: '',
            serviceType: 'DEPARTMENT',
            description: '',
            shortDescription: '',
            contactPersonName: '',
            contactPhone: '',
            contactEmail: '',
            contactAddress: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            latitude: 0,
            longitude: 0,
            operatingHours: '',
            isPublic: true,
            isFeedbackEnabled: true,
            metadata: '',
        },
    })

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            if (isEdit && serviceData?.data) {
                reset(serviceData.data)
            } else {
                reset({
                    serviceName: '',
                    displayCode: '',
                    serviceType: 'DEPARTMENT',
                    description: '',
                    shortDescription: '',
                    contactPersonName: '',
                    contactPhone: '',
                    contactEmail: '',
                    contactAddress: '',
                    address: '',
                    city: '',
                    state: '',
                    pincode: '',
                    latitude: 0,
                    longitude: 0,
                    operatingHours: '',
                    isPublic: true,
                    isFeedbackEnabled: true,
                    metadata: '',
                })
            }
            setActiveStep(0)
        }
    }, [open, isEdit, serviceData, reset])

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data) => serviceService.createService(data),
        onSuccess: () => {
            toast.success('Service created successfully')
            queryClient.invalidateQueries(['service-tree'])
            queryClient.invalidateQueries(['services'])
            onSuccess()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create service')
        },
    })

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => serviceService.updateService(id, data),
        onSuccess: () => {
            toast.success('Service updated successfully')
            queryClient.invalidateQueries(['service-tree'])
            queryClient.invalidateQueries(['services'])
            queryClient.invalidateQueries(['service', serviceId])
            onSuccess()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update service')
        },
    })

    const onSubmit = (data) => {
        const payload = {
            ...data,
            parentServiceId: parentServiceId || null,
        }

        if (isEdit) {
            updateMutation.mutate({ id: serviceId, data: payload })
        } else {
            createMutation.mutate(payload)
        }
    }

    const handleNext = async () => {
        const fieldsToValidate = getFieldsForStep(activeStep)
        const isValid = await trigger(fieldsToValidate)

        if (isValid) {
            setActiveStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const getFieldsForStep = (step) => {
        switch (step) {
            case 0:
                return ['serviceName', 'displayCode', 'serviceType', 'description', 'shortDescription']
            case 1:
                return ['contactPersonName', 'contactPhone', 'contactEmail', 'contactAddress']
            case 2:
                return ['address', 'city', 'state', 'pincode', 'operatingHours']
            default:
                return []
        }
    }

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <BasicInformationStep control={control} errors={errors} parentServiceId={parentServiceId} allServices={allServices?.data} />
            case 1:
                return <ContactDetailsStep control={control} errors={errors} />
            case 2:
                return <LocationSettingsStep control={control} errors={errors} watch={watch} />
            default:
                return null
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={600}>
                        {isEdit ? 'Edit Service' : 'Add New Service'}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider />

            {/* Stepper */}
            <Box sx={{ px: 3, pt: 3 }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 3 }}>
                    {renderStepContent(activeStep)}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} disabled={createMutation.isLoading || updateMutation.isLoading}>
                        Cancel
                    </Button>

                    {activeStep > 0 && (
                        <Button
                            onClick={handleBack}
                            startIcon={<ArrowBackIcon />}
                            disabled={createMutation.isLoading || updateMutation.isLoading}
                        >
                            Back
                        </Button>
                    )}

                    {activeStep < steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={createMutation.isLoading || updateMutation.isLoading}
                        >
                            {createMutation.isLoading || updateMutation.isLoading
                                ? 'Saving...'
                                : isEdit
                                    ? 'Update Service'
                                    : 'Create Service'}
                        </Button>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    )
}

// Step 1: Basic Information
const BasicInformationStep = ({ control, errors, parentServiceId, allServices }) => {
    const parentService = allServices?.find(s => s.serviceId === parentServiceId)

    return (
        <Grid container spacing={3}>
            {parentServiceId && parentService && (
                <Grid item xs={12}>
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'primary.light',
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'primary.main',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Parent Service
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                            {parentService.serviceName}
                        </Typography>
                    </Box>
                </Grid>
            )}

            <Grid item xs={12} md={8}>
                <Controller
                    name="serviceName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Service Name *"
                            error={!!errors.serviceName}
                            helperText={errors.serviceName?.message}
                            placeholder="e.g., Municipal Corporation"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={4}>
                <Controller
                    name="displayCode"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Display Code"
                            placeholder="e.g., MC-001"
                            helperText="Unique identifier code"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="serviceType"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            select
                            label="Service Type *"
                            error={!!errors.serviceType}
                            helperText={errors.serviceType?.message}
                        >
                            {Object.values(SERVICE_TYPES).map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                bgcolor: type.color,
                                            }}
                                        />
                                        {type.label}
                                    </Box>
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="shortDescription"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Short Description"
                            placeholder="Brief one-line description"
                            error={!!errors.shortDescription}
                            helperText={errors.shortDescription?.message || 'Max 200 characters'}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            label="Detailed Description"
                            placeholder="Provide comprehensive details about this service..."
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}

// Step 2: Contact Details
const ContactDetailsStep = ({ control, errors }) => (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Primary Contact Information
            </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="contactPersonName"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Contact Person Name"
                        placeholder="e.g., John Doe"
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="contactPhone"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Contact Phone"
                        placeholder="+91 9876543210"
                        error={!!errors.contactPhone}
                        helperText={errors.contactPhone?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12}>
            <Controller
                name="contactEmail"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Contact Email"
                        type="email"
                        placeholder="contact@example.com"
                        error={!!errors.contactEmail}
                        helperText={errors.contactEmail?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12}>
            <Controller
                name="contactAddress"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Contact Address"
                        placeholder="Full contact address..."
                    />
                )}
            />
        </Grid>
    </Grid>
)

// Step 3: Location & Settings
const LocationSettingsStep = ({ control, errors, watch }) => {
    const isPublic = watch('isPublic')
    const isFeedbackEnabled = watch('isFeedbackEnabled')

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Service Location
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Service Address"
                            placeholder="Street address"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={4}>
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="City"
                            placeholder="e.g., Surat"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={4}>
                <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="State"
                            placeholder="e.g., Gujarat"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={4}>
                <Controller
                    name="pincode"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Pincode"
                            placeholder="395009"
                            error={!!errors.pincode}
                            helperText={errors.pincode?.message}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Controller
                    name="latitude"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Latitude"
                            placeholder="21.1702"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Controller
                    name="longitude"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Longitude"
                            placeholder="72.8311"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="operatingHours"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label="Operating Hours"
                            placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM"
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Service Settings
                </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
                <Controller
                    name="isPublic"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} color="primary" />}
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        Public Service
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Make this service visible to all citizens
                                    </Typography>
                                </Box>
                            }
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Controller
                    name="isFeedbackEnabled"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Switch {...field} checked={field.value} color="primary" />}
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        Enable Feedback
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Allow citizens to submit feedback
                                    </Typography>
                                </Box>
                            }
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="metadata"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={2}
                            label="Additional Metadata (JSON)"
                            placeholder='{"key": "value"}'
                            helperText="Optional JSON metadata for custom fields"
                        />
                    )}
                />
            </Grid>
        </Grid>
    )
}
