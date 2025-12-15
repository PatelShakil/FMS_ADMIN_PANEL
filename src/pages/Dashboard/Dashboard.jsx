import React from 'react'
import { Grid, Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { orgService } from '../../api/services/orgService'

// Platform Admin Components
import { PlatformAdminDashboard } from './PlatformAdminDashboard'
import {OrgOwnerDashboard} from "./OrgOwnerDashboard.jsx";
import {OrgAdminDashboard} from "./OrgAdminDashboard.jsx";
// import { OrgOwnerDashboard } from './OrgOwnerDashboard'
// import { OrgAdminDashboard } from './OrgAdminDashboard'

export const Dashboard = () => {
    const { role,email, user } = useAuthStore()

    // Render dashboard based on role
    const renderDashboard = () => {
        switch (role) {
            case 'PLATFORM_ADMIN':
                return <PlatformAdminDashboard user={user} />
            case 'ORG_OWNER':
                return <OrgOwnerDashboard user={user} />
            case 'ORG_ADMIN':
                return <OrgAdminDashboard user={user} />
            default:
                return null
        }
    }

    return <Box>{renderDashboard()}</Box>
}
