import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress,
} from '@mui/material'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {authService} from "../../api/services/authService.js";

// Organization Types from org-service
const ORG_TYPES = [
    'MUNICIPALITY',
    'NGO',
    'HOSPITAL',
    'SCHOOL',
    'COLLEGE',
    'GOVERNMENT_DEPT',
    'CORPORATION',
    'OTHER',
]

// Validation Schema
const orgRegistrationSchema = z.object({
    // Organization Details
    orgName: z.string().min(3, 'Organization name must be at least 3 characters'),
    orgEmail: z.string().email('Invalid email address'),
    orgType: z.enum(ORG_TYPES),
    sector: z.string().optional(),
    registrationNo: z.string().optional(),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    address: z.string().min(10, 'Address must be at least 10 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),

    // Owner Details
    ownerName: z.string().min(3, 'Owner name must be at least 3 characters'),
    ownerEmail: z.string().email('Invalid email address'),
    ownerPassword: z.string().min(8, 'Password must be at least 8 characters'),
    ownerPhone: z.string().min(10, 'Phone must be at least 10 digits'),
})

const steps = ['Organization Details', 'Owner Details', 'Review']

export const RegisterOrganization = () => {
    const navigate = useNavigate()
    const [activeStep, setActiveStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        getValues,
    } = useForm({
        resolver: zodResolver(orgRegistrationSchema),
        defaultValues: {
            orgName: '',
            orgEmail: '',
            orgType: 'NGO',
            sector: '',
            registrationNo: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            website: '',
            ownerName: '',
            ownerEmail: '',
            ownerPassword: '',
            ownerPhone: '',
        },
    })

    const handleNext = async () => {
        let fieldsToValidate = []

        if (activeStep === 0) {
            fieldsToValidate = [
                'orgName', 'orgEmail', 'orgType', 'phone',
                'address', 'city', 'state', 'pincode'
            ]
        } else if (activeStep === 1) {
            fieldsToValidate = [
                'ownerName', 'ownerEmail', 'ownerPassword', 'ownerPhone'
            ]
        }

        const isValid = await trigger(fieldsToValidate)
        if (isValid) {
            setActiveStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const onSubmit = async (formData) => {
        try {
            setIsLoading(true)
            await authService.registerOrganization(formData)

            toast.success('Organization registered successfully! Please wait for approval.')
            navigate('/login')
        } catch (err) {
            console.error('Registration error:', err)
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <OrganizationDetailsStep control={control} errors={errors} />
            case 1:
                return <OwnerDetailsStep control={control} errors={errors} />
            case 2:
                return <ReviewStep values={getValues()} />
            default:
                return null
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 3 }}>
                    <Button
                        component={RouterLink}
                        to="/login"
                        startIcon={<ArrowBack />}
                        sx={{ mb: 2 }}
                    >
                        Back to Login
                    </Button>
                </Box>

                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Register Organization
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Fill in the details to register your organization
                        </Typography>

                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {renderStepContent()}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>

                                {activeStep === steps.length - 1 ? (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : 'Submit'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        endIcon={<ArrowForward />}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}

// Step Components
const OrganizationDetailsStep = ({ control, errors }) => (
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Controller
                name="orgName"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Organization Name *"
                        error={!!errors.orgName}
                        helperText={errors.orgName?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="orgEmail"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Organization Email *"
                        type="email"
                        error={!!errors.orgEmail}
                        helperText={errors.orgEmail?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="orgType"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        select
                        label="Organization Type *"
                        error={!!errors.orgType}
                        helperText={errors.orgType?.message}
                    >
                        {ORG_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type.replace('_', ' ')}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Phone *"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12}>
            <Controller
                name="address"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Address *"
                        multiline
                        rows={2}
                        error={!!errors.address}
                        helperText={errors.address?.message}
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
                        label="City *"
                        error={!!errors.city}
                        helperText={errors.city?.message}
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
                        label="State *"
                        error={!!errors.state}
                        helperText={errors.state?.message}
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
                        label="Pincode *"
                        error={!!errors.pincode}
                        helperText={errors.pincode?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="registrationNo"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Registration Number"
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="website"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Website"
                        error={!!errors.website}
                        helperText={errors.website?.message}
                    />
                )}
            />
        </Grid>
    </Grid>
)

const OwnerDetailsStep = ({ control, errors }) => (
    <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Controller
                name="ownerName"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Owner Name *"
                        error={!!errors.ownerName}
                        helperText={errors.ownerName?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="ownerEmail"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Owner Email *"
                        type="email"
                        error={!!errors.ownerEmail}
                        helperText={errors.ownerEmail?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="ownerPassword"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Password *"
                        type="password"
                        error={!!errors.ownerPassword}
                        helperText={errors.ownerPassword?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
                name="ownerPhone"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        fullWidth
                        label="Owner Phone *"
                        error={!!errors.ownerPhone}
                        helperText={errors.ownerPhone?.message}
                    />
                )}
            />
        </Grid>

        <Grid item xs={12}>
            <Alert severity="info">
                Your organization registration will be reviewed by platform administrators.
                You will be notified once approved.
            </Alert>
        </Grid>
    </Grid>
)

const ReviewStep = ({ values }) => (
    <Box>
        <Typography variant="h6" gutterBottom>
            Review Your Information
        </Typography>

        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Organization Details
            </Typography>
            <Typography><strong>Name:</strong> {values.orgName}</Typography>
            <Typography><strong>Email:</strong> {values.orgEmail}</Typography>
            <Typography><strong>Type:</strong> {values.orgType}</Typography>
            <Typography><strong>City:</strong> {values.city}, {values.state}</Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Owner Details
            </Typography>
            <Typography><strong>Name:</strong> {values.ownerName}</Typography>
            <Typography><strong>Email:</strong> {values.ownerEmail}</Typography>
            <Typography><strong>Phone:</strong> {values.ownerPhone}</Typography>
        </Box>
    </Box>
)
