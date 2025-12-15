import React, { useState, useEffect } from 'react'
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
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material'
import {
    Close as CloseIcon,
} from '@mui/icons-material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { orgService } from '../../../../api/services/orgService'
import toast from 'react-hot-toast'
import {authService} from "../../../../api/services/authService.js";

export const EditDistributorDialog = ({ open, onClose, distributor, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        orgId: '',
        address: '',
        newPassword: '',
        confirmNewPassword: '',
    })

    // Fetch organizations
    const { data: orgsData, isLoading: orgsLoading } = useQuery({
        queryKey: ['organizations'],
        queryFn:async () =>await orgService.getAllOrgs(),
        enabled: open,
    })

    const organizations = orgsData?.data || []

    // Initialize form data
    useEffect(() => {
        if (distributor) {
            setFormData({
                name: distributor.name || '',
                email: distributor.email || '',
                phone: distributor.phone || '',
                orgId: distributor.orgId?.toString() || '',
                address: distributor.address || '',
                newPassword: '',
                confirmNewPassword: '',
            })
        }
    }, [distributor])

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async (data) => await authService.updateProfile({...data,userId:distributor.userId}),
        onSuccess: () => {
            toast.success('Distributor updated successfully!')
            handleReset()
            onSuccess()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update distributor')
        },
    })

    const handleSubmit = () => {
        // Validation
        if (!formData.name.trim()) {
            toast.error('Name is required')
            return
        }
        if (!formData.email.trim()) {
            toast.error('Email is required')
            return
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error('Invalid email format')
            return
        }
        if (!formData.phone.trim()) {
            toast.error('Phone is required')
            return
        }
        if (!formData.orgId) {
            toast.error('Please select an organization')
            return
        }

        // Password validation (if provided)
        if (formData.newPassword) {
            if (formData.newPassword.length < 8) {
                toast.error('Password must be at least 8 characters')
                return
            }
            if (formData.newPassword !== formData.confirmNewPassword) {
                toast.error('Passwords do not match')
                return
            }
        }

        const submitData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            orgId: parseInt(formData.orgId),
            address: formData.address,
        }

        // Add password only if provided
        if (formData.newPassword) {
            submitData.password = formData.newPassword
        }

        updateMutation.mutate(submitData)
    }

    const handleReset = () => {
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleReset}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>
                        Edit Distributor
                    </Typography>
                    <IconButton onClick={handleReset} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Editing: <strong>{distributor?.name}</strong>
                </Alert>

                <Grid container spacing={2}>
                    {/* Name */}
                    <Grid item xs={12}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone"
                            type="tel"
                            fullWidth
                            required
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                        />
                    </Grid>

                    {/* Organization */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Organization"
                            fullWidth
                            required
                            value={formData.orgId}
                            onChange={(e) =>
                                setFormData({ ...formData, orgId: e.target.value })
                            }
                            SelectProps={{
                                native: true,
                            }}
                            disabled={orgsLoading}
                        >
                            <option value="">Select Organization</option>
                            {organizations.map((org) => (
                                <option key={org.orgId} value={org.orgId}>
                                    {org.orgName}
                                </option>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12}>
                        <TextField
                            label="Address (Optional)"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({ ...formData, address: e.target.value })
                            }
                        />
                    </Grid>

                    {/* Divider */}
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Change Password (leave blank to keep current password)
                        </Typography>
                    </Grid>

                    {/* New Password */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={formData.newPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, newPassword: e.target.value })
                            }
                            helperText="Minimum 8 characters"
                        />
                    </Grid>

                    {/* Confirm New Password */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            value={formData.confirmNewPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmNewPassword: e.target.value })
                            }
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleReset}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={updateMutation.isLoading}
                >
                    {updateMutation.isLoading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Updating...
                        </>
                    ) : (
                        'Update Distributor'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
