import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
    LinearProgress,
} from '@mui/material'
import {
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { authService } from '../../api/services/authService'

// Password strength checker
const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 10
    return Math.min(strength, 100)
}

const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return 'error'
    if (strength < 70) return 'warning'
    return 'success'
}

const getPasswordStrengthText = (strength) => {
    if (strength < 40) return 'Weak'
    if (strength < 70) return 'Medium'
    return 'Strong'
}

const acceptInviteSchema = z.object({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export const AcceptInvite = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [tokenError, setTokenError] = useState(null)
    const [passwordStrength, setPasswordStrength] = useState(0)

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
        watch,
    } = useForm({
        resolver: zodResolver(acceptInviteSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const password = watch('password')

    useEffect(() => {
        if (password) {
            setPasswordStrength(getPasswordStrength(password))
        } else {
            setPasswordStrength(0)
        }
    }, [password])

    const onSubmit = async (formData) => {
        if (!token) {
            toast.error('Invalid invitation token')
            return
        }

        try {
            setIsLoading(true)

            // Call accept invite endpoint
            await authService.acceptInvite({token,password:formData.password})

            toast.success('Account activated successfully! Please login to continue.')

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            console.error('Accept invite error:', err)
            const errorMessage = err.response?.data?.message || 'Failed to accept invitation'

            if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
                setTokenError('This invitation link has expired or is invalid. Please contact your administrator.')
            } else {
                toast.error(errorMessage)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // If token is invalid, show error page
    if (tokenError) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Card elevation={8} sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'error.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                }}
                            >
                                <Typography variant="h2" color="error.main">
                                    ⚠️
                                </Typography>
                            </Box>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                Invalid Invitation Link
                            </Typography>
                            <Alert severity="error" sx={{ mt: 2, mb: 3, textAlign: 'left' }}>
                                {tokenError}
                            </Alert>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/login')}
                                fullWidth
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
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 48, color: 'white' }} />
                    </Box>
                    <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
                        Welcome to BoloIndia!
                    </Typography>
                    <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
                        Set your password to activate your account
                    </Typography>
                </Box>

                {/* Main Card */}
                <Card elevation={8} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Activate Your Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Create a strong password to secure your account
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Password Field */}
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
                                        sx={{ mb: 1 }}
                                    />
                                )}
                            />

                            {/* Password Strength Indicator */}
                            {password && (
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Password Strength
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            fontWeight={600}
                                            color={`${getPasswordStrengthColor(passwordStrength)}.main`}
                                        >
                                            {getPasswordStrengthText(passwordStrength)}
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={passwordStrength}
                                        color={getPasswordStrengthColor(passwordStrength)}
                                        sx={{ height: 6, borderRadius: 3 }}
                                    />
                                </Box>
                            )}

                            {/* Confirm Password Field */}
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

                            {/* Password Requirements */}
                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="caption" display="block" fontWeight={600} gutterBottom>
                                    Password Requirements:
                                </Typography>
                                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                                    <Typography component="li" variant="caption">
                                        At least 8 characters long
                                    </Typography>
                                    <Typography component="li" variant="caption">
                                        Contains uppercase and lowercase letters
                                    </Typography>
                                    <Typography component="li" variant="caption">
                                        Contains at least one number
                                    </Typography>
                                </Box>
                            </Alert>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{ py: 1.5 }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Activate Account & Continue'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Typography
                    variant="body2"
                    color="rgba(255,255,255,0.9)"
                    align="center"
                    sx={{ mt: 3 }}
                >
                    Already have an account?{' '}
                    <Button
                        variant="text"
                        sx={{ color: 'white', textDecoration: 'underline' }}
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </Button>
                </Typography>
            </Container>
        </Box>
    )
}
