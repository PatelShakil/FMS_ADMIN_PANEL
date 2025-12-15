import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { DistributorManagement } from './views/DistributorManagement'
import { useAuthStore } from '../../store/authStore'

export const Distributors = () => {
    const { user,role } = useAuthStore()

    // Only PLATFORM_ADMIN can access
    if (role !== 'PLATFORM_ADMIN') {
        return <Navigate to="/" replace />
    }

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Routes>
                <Route path="/" element={<DistributorManagement />} />
            </Routes>
        </Box>
    )
}

export default Distributors
