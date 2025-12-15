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
} from '@mui/material'
import {
    Close as CloseIcon,
} from '@mui/icons-material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { qrService } from '../../../../api/services/qrService'
import { feedbackService } from '../../../../api/services/feedbackService'
import { useAuthStore } from '../../../../store/authStore'
import toast from 'react-hot-toast'

export const GenerateQRDialog = ({ open, onClose, onSuccess, formId = null }) => {
    const { user } = useAuthStore()

    const [formData, setFormData] = useState({
        qrCodeName: '',
        formId: formId || ''
    })

    // Fetch forms
    const { data: formsData, isLoading: formsLoading } = useQuery({
        queryKey: ['forms', { orgId: user?.orgId, status: 'ACTIVE' }],
        queryFn: () => feedbackService.getAllForms({ orgId: user?.orgId, status: 'ACTIVE' }),
        enabled: open && !formId,
    })

    const forms = formsData?.data || []

    // Generate QR mutation
    const generateMutation = useMutation({
        mutationFn: (data) => qrService.generateQR(data),
        onSuccess: () => {
            toast.success('QR Code generated successfully!')
            handleReset()
            onSuccess()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to generate QR code')
        },
    })

    const handleSubmit = () => {
        if (!formData.qrCodeName.trim()) {
            toast.error('QR Code name is required')
            return
        }
        if (!formData.formId) {
            toast.error('Please select a form')
            return
        }

        generateMutation.mutate({
            qrCodeName: formData.qrCodeName,
            formId: formData.formId,
            serviceId:formData.serviceId,
            orgId:formData.orgId
        })
    }

    const handleReset = () => {
        setFormData({
            qrCodeName: '',
            formId: formId || '',
            serviceId:''
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
                        Generate QR Code
                    </Typography>
                    <IconButton onClick={handleReset} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Alert severity="info" sx={{ mb: 3 }}>
                    The QR code will be generated and can be customized by the distributor on their Android app.
                </Alert>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="QR Code Name"
                        fullWidth
                        required
                        value={formData.qrCodeName}
                        onChange={(e) =>
                            setFormData({ ...formData, qrCodeName: e.target.value })
                        }
                        placeholder="e.g., Main Gate QR"
                        helperText="A descriptive name for this QR code"
                    />

                    {!formId && (
                        <TextField
                            select
                            label="Select Form"
                            fullWidth
                            required
                            value={formData.formId}
                            onChange={(e) => {
                                const f = forms.find(f => f.formId === e.target.value)
                                setFormData({
                                    ...formData,
                                    formId: e.target.value,
                                    serviceId: f.serviceId,
                                    orgId:f.orgId
                                })
                            }
                            }
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Select which form this QR code will link to"
                            disabled={formsLoading}
                        >
                            <option value="">Select a form</option>
                            {forms.map((form) => (
                                <option key={form.formId} value={form.formId}>
                                    {form.formName}
                                </option>
                            ))}
                        </TextField>
                    )}

                    <Alert severity="warning">
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            Next Steps:
                        </Typography>
                        <Typography variant="caption" component="div">
                            1. QR code will be generated with a unique slug<br />
                            2. Assign it to a distributor<br />
                            3. Distributor will customize and deploy it<br />
                            4. You'll approve the deployment
                        </Typography>
                    </Alert>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleReset}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={generateMutation.isLoading}
                >
                    {generateMutation.isLoading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Generating...
                        </>
                    ) : (
                        'Generate QR Code'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
