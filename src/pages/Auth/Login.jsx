import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Divider,
    Link,
    Alert,
    CircularProgress,
} from '@mui/material'
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import {authService} from "../../api/services/authService.js";

// Validation Schema
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (formData) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await authService.login(formData.email, formData.password)
            console.log(response);
            // return;

            // Store auth data
            login(
                response.accessToken,
                response.refreshToken,
                response.user
            )

            toast.success(`Welcome back, ${response.user.fullName}!`)


            // Redirect based on role
            const role = response.user.role
            if (role === 'PLATFORM_ADMIN') {
                navigate('/admin/dashboard')
            } else if (role === 'ORG_OWNER' || role === 'ORG_ADMIN') {
                navigate('/dashboard')
            } else {
                navigate('/') // Fallback
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
            toast.error('Login failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                minWidth: '100%',
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
                        BoloIndia
                    </Typography>
                    <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
                        Citizen Feedback Management Platform
                    </Typography>
                </Box>

                <Card elevation={8} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Sign In
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Enter your credentials to access your account
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />

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
                                        sx={{ mb: 3 }}
                                    />
                                )}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ mb: 2, py: 1.5 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>
                        </form>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                New to BoloIndia?
                            </Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                component={RouterLink}
                                to="/register/organization"
                                variant="outlined"
                                fullWidth
                            >
                                Register Organization
                            </Button>
                        </Box>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link
                                component={RouterLink}
                                to="/forgot-password"
                                variant="body2"
                                underline="hover"
                            >
                                Forgot password?
                            </Link>
                        </Box>
                    </CardContent>
                </Card>

                <Typography
                    variant="body2"
                    color="rgba(255,255,255,0.9)"
                    align="center"
                    sx={{ mt: 3 }}
                >
                    © 2025 BoloIndia. All rights reserved.
                </Typography>
            </Container>
        </Box>
    )
}
