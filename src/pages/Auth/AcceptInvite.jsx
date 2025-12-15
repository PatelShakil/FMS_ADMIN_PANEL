import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom'
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
} from '@mui/material'
import { Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authService } from '../../api/services/authService'
import { useAuthStore } from '../../store/authStore'

const acceptInviteSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export const AcceptInvite = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { login } = useAuthStore()

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [tokenError, setTokenError] = useState(null)

    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            setTokenError('Invalid invitation link. Token is missing.')
        }
    }, [token])

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(acceptInviteSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (formData) => {
        if (!token) {
            toast.error('Invalid invitation token')
            return
        }

        try {
            setIsLoading(true)
            const response = await authService.acceptInvite(token, formData.password)

            // Login user with returned tokens
            login(
                response.data.accessToken,
                response.data.refreshToken,
                response.data.user
            )

            toast.success('Welcome! Your account has been activated.')
            navigate('/dashboard')
        } catch (err) {
            console.error('Accept invite error:', err)
            toast.error(err.response?.data?.message || 'Failed to accept invitation')
        } finally {
            setIsLoading(false)
        }
    }

    if (tokenError) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <Container maxWidth="sm">
                    <Card elevation={8}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {tokenError}
                            </Alert>
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="contained"
                            >
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
                        Welcome to BoloIndia
                    </Typography>
                    <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
                        Set your password to complete your account setup
                    </Typography>
                </Box>

                <Card elevation={8} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Accept Invitation
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Create a secure password for your account
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />

                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 3 }}
                                    />
                                )}
                            />

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Password must be at least 8 characters long
                            </Alert>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Activate Account'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}
