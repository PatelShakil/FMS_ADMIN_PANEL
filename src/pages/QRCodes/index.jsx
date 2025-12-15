import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { QRManagement } from './views/QRManagement'
import { DeploymentApproval } from './views/DeploymentApproval'
import { QRAnalytics } from './views/QRAnalytics'

export const QRCodes = () => {
    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Routes>
                <Route path="/management" element={<QRManagement />} />
                <Route path="/management/:formId" element={<QRManagement />} />
                <Route path="/deployment/:qrCodeId" element={<DeploymentApproval />} />
                <Route path="/analytics/:qrCodeId" element={<QRAnalytics />} />
                <Route path="/analytics" element={<QRAnalytics />} />
                <Route path="/" element={<Navigate to="/qr/management" replace />} />
            </Routes>
        </Box>
    )
}

export default QRCodes
