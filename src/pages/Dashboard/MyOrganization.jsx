import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Skeleton,
} from '@mui/material'
import {
    Edit as EditIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Language as WebsiteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { orgService } from '../../api/services/orgService'
import toast from 'react-hot-toast'

const InfoRow = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        <Box sx={{ color: 'primary.main', mt: 0.5 }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
                {value || 'N/A'}
            </Typography>
        </Box>
    </Box>
)

const orgUpdateSchema = z.object({
    orgName: z.string().min(3, 'Organization name must be at least 3 characters'),
    orgEmail: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    address: z.string().min(10, 'Address must be at least 10 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const MyOrganization = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    // Fetch organization details
    const { data: orgData, isLoading } = useQuery({
        queryKey: ['my-organization'],
        queryFn: () => orgService.getMyOrg(),
    })

    const organization = orgData?.data

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(orgUpdateSchema),
        defaultValues: organization || {},
    })

    // Update organization mutation
    const updateMutation = useMutation({
        mutationFn: (data) => orgService.updateOrg(organization.id, data),
        onSuccess: () => {
            toast.success('Organization updated successfully')
            queryClient.invalidateQueries(['my-organization'])
            setEditDialogOpen(false)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update organization')
        },
    })

    const handleEdit = () => {
        reset(organization)
        setEditDialogOpen(true)
    }

    const onSubmit = (data) => {
        updateMutation.mutate(data)
    }

    if (isLoading) {
        return (
            <Box>
                <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={400} />
            </Box>
        )
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        My Organization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        View and manage your organization details
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={organization?.status} color="success" />
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Organization Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Organization Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Organization Name"
                                value={organization?.orgName}
                            />
                            <InfoRow
                                icon={<EmailIcon />}
                                label="Email"
                                value={organization?.orgEmail}
                            />
                            <InfoRow
                                icon={<PhoneIcon />}
                                label="Phone"
                                value={organization?.phone}
                            />
                            <InfoRow
                                icon={<WebsiteIcon />}
                                label="Website"
                                value={organization?.website}
                            />
                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Organization Type"
                                value={organization?.orgType}
                            />
                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Sector"
                                value={organization?.sector}
                            />
                            <InfoRow
                                icon={<BusinessIcon />}
                                label="Registration Number"
                                value={organization?.registrationNo}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Location Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Location
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <InfoRow
                                icon={<LocationIcon />}
                                label="Address"
                                value={organization?.address}
                            />
                            <InfoRow
                                icon={<LocationIcon />}
                                label="City"
                                value={organization?.city}
                            />
                            <InfoRow
                                icon={<LocationIcon />}
                                label="State"
                                value={organization?.state}
                            />
                            <InfoRow
                                icon={<LocationIcon />}
                                label="Pincode"
                                value={organization?.pincode}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* System Information */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                System Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Organization ID
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {organization?.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Created At
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {new Date(organization?.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {new Date(organization?.updatedAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {organization?.status}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Organization</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Grid container spacing={2}>
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
                                            label="Email *"
                                            error={!!errors.orgEmail}
                                            helperText={errors.orgEmail?.message}
                                        />
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
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setEditDialogOpen(false)}
                            startIcon={<CancelIcon />}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={updateMutation.isLoading}
                        >
                            {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    )
}
