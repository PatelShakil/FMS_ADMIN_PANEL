import React, {useState} from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'
import { Box, CircularProgress } from '@mui/material'
import {authService} from "../../api/services/authService.js";

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { accessToken, user } = useAuthStore()
    const roles = user?.roles || ''
    const location = useLocation()

    // Check if user is authenticated
    if (!accessToken || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.some((role) => roles.includes(role))) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

// Loading component while checking auth
export const AuthGuard = ({ children }) => {
    const { accessToken, user } = useAuthStore()
    const [isChecking, setIsChecking] = React.useState(true)
    const [isFailed, setIsFailed] = useState(false);


    async function fetchProfile(){
        if (accessToken && user) {
            setIsChecking(true)
            const res = await authService.getProfile()
            if(res.data){
                setIsFailed(false)
            }else{
                setIsFailed(true)
            }
            setIsChecking(false)

        } else {
            setIsChecking(false)
        }

    }

    React.useEffect(() => {
        // Simulate auth check (you can add actual token validation here)
        fetchProfile()

    }, [])

    if (isChecking) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    width: '100%',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if(isFailed){
        return <Navigate to="/login" replace />
    }

    return children
}
