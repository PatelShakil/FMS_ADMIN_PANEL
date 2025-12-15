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

export const CreateDistributorDialog = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        orgId: '',
        address: '',
    })

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data) => await authService.registerDistributor(data),
        onSuccess: () => {
            toast.success('Distributor created successfully!')
            handleReset()
            onSuccess()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to create distributor')
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
        if (!formData.password) {
            toast.error('Password is required')
            return
        }
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }


        const { confirmPassword, ...submitData } = formData
        createMutation.mutate({
            ...submitData,
            role: 'DISTRIBUTOR',
        })
    }

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            orgId: '',
            address: '',
        })
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
                        Add New Distributor
                    </Typography>
                    <IconButton onClick={handleReset} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Create a new distributor account. They will receive credentials to access the Android app.
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
                            placeholder="e.g., John Doe"
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
                            placeholder="john@example.com"
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
                            placeholder="+91 9876543210"
                        />
                    </Grid>

                    {/*/!* Organization *!/*/}
                    {/*<Grid item xs={12}>*/}
                    {/*    <TextField*/}
                    {/*        select*/}
                    {/*        label="Organization"*/}
                    {/*        fullWidth*/}
                    {/*        required*/}
                    {/*        value={formData.orgId}*/}
                    {/*        onChange={(e) =>*/}
                    {/*            setFormData({ ...formData, orgId: e.target.value })*/}
                    {/*        }*/}
                    {/*        SelectProps={{*/}
                    {/*            native: true,*/}
                    {/*        }}*/}
                    {/*        disabled={orgsLoading}*/}
                    {/*    >*/}
                    {/*        <option value="">Select Organization</option>*/}
                    {/*        {organizations.map((org) => (*/}
                    {/*            <option key={org.orgId} value={org.orgId}>*/}
                    {/*                {org.orgName}*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </TextField>*/}
                    {/*</Grid>*/}

                    {/* Password */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            helperText="Minimum 8 characters"
                        />
                    </Grid>

                    {/* Confirm Password */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            required
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                        />
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
                            placeholder="Full address..."
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleReset}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={createMutation.isLoading}
                >
                    {createMutation.isLoading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Creating...
                        </>
                    ) : (
                        'Create Distributor'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
