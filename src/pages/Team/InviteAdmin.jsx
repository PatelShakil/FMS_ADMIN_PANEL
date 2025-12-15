import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    Grid,
    IconButton,
    Alert,
    Chip,
    Divider,
} from '@mui/material'
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../../api/services/authService'
import toast from 'react-hot-toast'

const inviteSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
})

export const InviteAdmin = () => {
    const navigate = useNavigate()
    const [invitedEmails, setInvitedEmails] = useState([])

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
        },
    })

    const inviteMutation = useMutation({
        mutationFn: (data) => authService.inviteAdmin({
            ...data,
            roles: ['ORG_ADMIN'],
        }),
        onSuccess: (response, variables) => {
            toast.success('Invitation sent successfully!')
            setInvitedEmails([...invitedEmails, variables.email])
            reset()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to send invitation')
        },
    })

    const onSubmit = (data) => {
        inviteMutation.mutate(data)
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/team')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Invite Admin
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Send invitation to add new admin to your organization
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Invitation Form */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <PersonAddIcon color="primary" fontSize="large" />
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        Admin Details
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Enter the details of the person you want to invite
                                    </Typography>
                                </Box>
                            </Box>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="fullName"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Full Name *"
                                                    error={!!errors.fullName}
                                                    helperText={errors.fullName?.message}
                                                    placeholder="Enter admin's full name"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="Email Address *"
                                                    type="email"
                                                    error={!!errors.email}
                                                    helperText={errors.email?.message}
                                                    placeholder="admin@example.com"
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
                                                    label="Phone Number *"
                                                    error={!!errors.phone}
                                                    helperText={errors.phone?.message}
                                                    placeholder="+91 9876543210"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Alert severity="info">
                                            An invitation email will be sent to the admin with a secure link to set their password and activate their account.
                                        </Alert>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => navigate('/team')}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={<SendIcon />}
                                                disabled={inviteMutation.isLoading}
                                            >
                                                {inviteMutation.isLoading ? 'Sending...' : 'Send Invitation'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Info Panel */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                About Admin Role
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="body2" color="text.secondary" paragraph>
                                Organization Admins have the following permissions:
                            </Typography>

                            <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Create and manage services
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Design and publish feedback forms
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Generate and manage QR codes
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    View and respond to citizen feedback
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                    Access analytics and reports
                                </Typography>
                            </Box>

                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <Typography variant="caption">
                                    Admins cannot invite other admins or modify organization settings.
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>

                    {/* Recently Invited */}
                    {invitedEmails.length > 0 && (
                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Recently Invited
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {invitedEmails.map((email, index) => (
                                        <Chip
                                            key={index}
                                            label={email}
                                            color="success"
                                            size="small"
                                            sx={{ justifyContent: 'flex-start' }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}
