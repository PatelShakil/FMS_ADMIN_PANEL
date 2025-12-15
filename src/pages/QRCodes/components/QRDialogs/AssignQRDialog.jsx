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
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Radio,
} from '@mui/material'
import {
    Close as CloseIcon,
    Person as PersonIcon,
} from '@mui/icons-material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { qrService } from '../../../../api/services/qrService'
import { useAuthStore } from '../../../../store/authStore'
import toast from 'react-hot-toast'
import {authService} from "../../../../api/services/authService.js";

export const AssignQRDialog = ({ open, onClose, qrCode, onSuccess }) => {
    const { user } = useAuthStore()

    const [selectedDistributor, setSelectedDistributor] = useState(null)
    const [notes, setNotes] = useState('')

    // Fetch distributors
    const { data: distributorsData, isLoading: distributorsLoading } = useQuery({
        queryKey: ['distributors', user?.orgId],
        queryFn: () => authService.getActiveDistributors(),
        enabled: open,
    })

    const distributors = distributorsData?.data?.distributors || []

    // Assign mutation
    const assignMutation = useMutation({
        mutationFn: (data) => qrService.assignQR(qrCode.qrCodeId, data),
        onSuccess: () => {
            toast.success('QR Code assigned successfully!')
            handleReset()
            onSuccess()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to assign QR code')
        },
    })

    const handleSubmit = () => {
        if (!selectedDistributor) {
            toast.error('Please select a distributor')
            return
        }

        assignMutation.mutate({
            distributorId: selectedDistributor.id,
            notes: notes.trim() || null,
        })
    }

    const handleReset = () => {
        setSelectedDistributor(null)
        setNotes('')
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
                        Assign QR Code
                    </Typography>
                    <IconButton onClick={handleReset} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Assigning: <strong>{qrCode?.qrCodeName}</strong>
                </Alert>

                {/* Distributor Selection */}
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Select Distributor
                </Typography>

                {distributorsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : distributors.length === 0 ? (
                    <Alert severity="warning">
                        No distributors found. Please add distributors first.
                    </Alert>
                ) : (
                    <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                        {distributors.map((distributor) => (
                            <ListItem
                                key={distributor.id}
                                button
                                selected={selectedDistributor?.id === distributor.id}
                                onClick={() => setSelectedDistributor(distributor)}
                                sx={{
                                    border: 1,
                                    borderColor: selectedDistributor?.id === distributor.id
                                        ? 'primary.main'
                                        : 'divider',
                                    borderRadius: 1,
                                    mb: 1,
                                }}
                            >
                                <Radio
                                    checked={selectedDistributor?.id === distributor.id}
                                    sx={{ mr: 1 }}
                                />
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={distributor.name}
                                    secondary={
                                        <>
                                            {distributor.email}
                                            {distributor.phone && ` • ${distributor.phone}`}
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                {/* Notes */}
                <TextField
                    label="Assignment Notes (Optional)"
                    fullWidth
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions or notes for the distributor..."
                    helperText="These notes will be visible to the distributor"
                />

                <Alert severity="warning" sx={{ mt: 2 }}>
                    The distributor will receive a notification and can accept or reject this assignment.
                </Alert>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleReset}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={assignMutation.isLoading || !selectedDistributor}
                >
                    {assignMutation.isLoading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Assigning...
                        </>
                    ) : (
                        'Assign QR Code'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
