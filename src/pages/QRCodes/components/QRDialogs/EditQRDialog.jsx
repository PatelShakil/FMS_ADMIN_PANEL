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
    InputAdornment,
} from '@mui/material'
import {
    Close as CloseIcon,
    CurrencyRupee as RupeeIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qrService } from '../../../../api/services/qrService'
import { useAuthStore } from '../../../../store/authStore'
import { QR_STATUS } from '../../constants/qrConstants'
import toast from 'react-hot-toast'

export const EditQRDialog = ({ open, onClose, qrCode, onSuccess }) => {
    const { user,role } = useAuthStore()
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        qrCodeName: '',
        paymentAmount: '',
        status: '',
    })

    // TODO: Backend validation needed
    const canEdit = qrCode?.createdBy === user?.id || role === 'ORG_OWNER'

    // Initialize form data
    useEffect(() => {
        if (qrCode) {
            setFormData({
                qrCodeName: qrCode.qrCodeName || '',
                paymentAmount: qrCode.paymentAmount?.toString() || '',
                status: qrCode.status || '',
            })
        }
    }, [qrCode])

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data) => qrService.updateQR(qrCode.qrCodeId, data),
        onSuccess: () => {
            toast.success('QR Code updated successfully!')
            queryClient.invalidateQueries(['qr-codes'])
            queryClient.invalidateQueries(['qr-code', qrCode.qrCodeId])
            handleReset()
            onSuccess()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to update QR code')
        },
    })

    const handleSubmit = () => {
        if (!canEdit) {
            toast.error('You can only edit QR codes you created')
            return
        }

        // Validation
        if (!formData.qrCodeName.trim()) {
            toast.error('QR Code name is required')
            return
        }

        if (formData.paymentAmount && isNaN(parseFloat(formData.paymentAmount))) {
            toast.error('Payment amount must be a valid number')
            return
        }

        if (formData.paymentAmount && parseFloat(formData.paymentAmount) < 0) {
            toast.error('Payment amount cannot be negative')
            return
        }

        const submitData = {
            qrCodeName: formData.qrCodeName.trim(),
            status: formData.status,
        }

        // Add payment amount only if provided
        if (formData.paymentAmount) {
            submitData.paymentAmount = parseFloat(formData.paymentAmount)
        }

        updateMutation.mutate(submitData)
    }

    const handleReset = () => {
        onClose()
    }

    if (!qrCode) return null

    if (!canEdit) {
        return (
            <Dialog open={open} onClose={handleReset} maxWidth="sm" fullWidth>
                <DialogContent>
                    <Alert severity="error">
                        You can only edit QR codes you created.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleReset}>Close</Button>
                </DialogActions>
            </Dialog>
        )
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
                        Edit QR Code
                    </Typography>
                    <IconButton onClick={handleReset} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Editing: <strong>{qrCode.qrCodeName}</strong>
                </Alert>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* QR Code Name */}
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

                    {/* Payment Amount */}
                    <TextField
                        label="Payment Amount (Optional)"
                        fullWidth
                        type="number"
                        value={formData.paymentAmount}
                        onChange={(e) =>
                            setFormData({ ...formData, paymentAmount: e.target.value })
                        }
                        placeholder="0.00"
                        helperText="Amount to be paid (if applicable)"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <RupeeIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            min: 0,
                            step: 0.01,
                        }}
                    />

                    {/* Status */}
                    <TextField
                        select
                        label="Status"
                        fullWidth
                        required
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                        }
                        SelectProps={{
                            native: true,
                        }}
                        helperText="Update QR code status"
                    >
                        {Object.values(QR_STATUS).map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.icon} {status.label}
                            </option>
                        ))}
                    </TextField>

                    <Alert severity="warning">
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            Note:
                        </Typography>
                        <Typography variant="caption" component="div">
                            • Changing status may affect QR code functionality<br />
                            • Payment amount is optional and can be used for tracking<br />
                            • QR slug cannot be changed
                        </Typography>
                    </Alert>
                </Box>
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
                        'Update QR Code'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
