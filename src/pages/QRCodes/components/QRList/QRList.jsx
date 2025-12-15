import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material'
import { VIEW_MODES } from '../../constants/qrConstants'
import { QRCard } from './QRCard'
import { QRDetailsDialog } from '../QRDialogs/QRDetailsDialog'

export const QRList = ({ qrCodes, loading, viewMode, onRefresh }) => {
    const [selectedQR, setSelectedQR] = useState(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    const handleViewDetails = (qrCode) => {
        setSelectedQR(qrCode)
        setDetailsOpen(true)
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (!qrCodes || qrCodes.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap: 2,
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No QR codes found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Generate your first QR code to get started
                </Typography>
            </Box>
        )
    }

    return (
        <>
            <Grid container spacing={3}>
                {qrCodes.map((qrCode) => (
                    <Grid
                        item
                        xs={12}
                        sm={viewMode === VIEW_MODES.GRID ? 6 : 12}
                        md={viewMode === VIEW_MODES.GRID ? 4 : 12}
                        lg={viewMode === VIEW_MODES.GRID ? 3 : 12}
                        key={qrCode.qrCodeId}
                    >
                        <QRCard
                            qrCode={qrCode}
                            viewMode={viewMode}
                            onViewDetails={handleViewDetails}
                            onRefresh={onRefresh}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* QR Details Dialog */}
            <QRDetailsDialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                qrCode={selectedQR}
                onRefresh={onRefresh}
            />
        </>
    )
}
