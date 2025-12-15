import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    Box,
    IconButton,
    Typography,
    Tabs,
    Tab,
} from '@mui/material'
import {
    Close as CloseIcon,
} from '@mui/icons-material'
import { QRDetailsPanel } from '../QRDetails/QRDetailsPanel'
import { QRChatPanel } from '../QRChat/QRChatPanel'
import { useAuthStore } from '../../../../store/authStore'
import {authService} from "../../../../api/services/authService.js";
import {useQuery} from "@tanstack/react-query";

export const QRDetailsDialog = ({ open, onClose, qrCode, onRefresh }) => {
    const { user,role } = useAuthStore()
    const [activeTab, setActiveTab] = useState(0)

    const { data: distributor, isLoading: distributorLoading } = useQuery({
        queryKey: ['userById', qrCode?.assignedTo || 0],
        queryFn: () => authService.getUserById(qrCode.assignedTo),
        enabled: open && qrCode.assignedTo !== undefined,
    });



    if (!qrCode) return null

    // TODO: Backend validation needed
    const canManage = qrCode.createdBy === user?.id || role === 'ORG_OWNER'
    const canChat = canManage && qrCode.assignedTo != null

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { height: '90vh' },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        {qrCode.qrCodeName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        QR Code ID: {qrCode.qrCodeId}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Tabs */}
            {canChat && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                        <Tab label="Details" />
                        <Tab label="Chat" />
                    </Tabs>
                </Box>
            )}

            {/* Content */}
            <DialogContent sx={{ p: 0, height: 'calc(100% - 130px)', overflow: 'hidden' }}>
                {activeTab === 0 ? (
                    <QRDetailsPanel distributor={distributor} qrCode={qrCode} onRefresh={onRefresh} />
                ) : (
                    <QRChatPanel distributor={distributor} qrCode={qrCode} />
                )}
            </DialogContent>
        </Dialog>
    )
}
