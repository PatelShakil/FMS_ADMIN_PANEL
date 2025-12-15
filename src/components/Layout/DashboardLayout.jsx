// layouts/DashboardLayout/DashboardLayout.jsx
import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery,
    Tooltip
} from '@mui/material'
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon,
    Feedback as FeedbackIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    QrCode,
    Assessment,
    Assignment,
    People as PeopleIcon,
    NotificationsActiveSharp,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    DesignServices
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import toast from 'react-hot-toast'
import { authService } from '../../api/services/authService'

const drawerWidth = 260
const drawerWidthCollapsed = 72

export const DashboardLayout = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const navigate = useNavigate()
    const location = useLocation()

    const { user, role, logout } = useAuthStore()
    const { mode, toggleMode } = useThemeStore()

    const [mobileOpen, setMobileOpen] = useState(false)
    const [desktopOpen, setDesktopOpen] = useState(true) // Desktop drawer toggle state
    const [anchorEl, setAnchorEl] = useState(null)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleDesktopDrawerToggle = () => {
        setDesktopOpen(!desktopOpen)
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleProfileMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = async () => {
        try {
            const refreshToken = useAuthStore.getState().refreshToken
            await authService.logout(refreshToken)
            logout()
            toast.success('Logged out successfully')
            navigate('/login')
        } catch (err) {
            console.error('Logout error:', err)
            logout()
            navigate('/login')
        }
    }

    // Navigation items based on role
    const getNavigationItems = () => {
        let role = user?.roles[0]

        if (role === 'PLATFORM_ADMIN') {
            return [
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
                { text: 'Organizations', icon: <BusinessIcon />, path: '/organizations' },
                { text: 'Form Templates', path: '/feedback/templates', icon: <DescriptionIcon /> },
                { text: 'Distributors', icon: <PeopleIcon/>, path: '/distributors' },
                // { text: 'System Settings', icon: <SettingsIcon />, path: '/settings' },
                { text: 'Notifications', icon: <NotificationsActiveSharp />, path: '/notifications' },
            ]
        }

        if (role === 'ORG_OWNER') {
            return [
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
                { text: 'My Organization', icon: <BusinessIcon />, path: '/my-organization' },
                { text: 'Team Members', icon: <PersonIcon />, path: '/team' },
                // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
                { text: 'QR Codes', icon: <QrCode />, path: '/qr' },
                { text: 'Responses', icon: <FeedbackIcon />, path: '/responses' },
                { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
                { text: 'Notifications', icon: <NotificationsActiveSharp />, path: '/notifications' },
            ]
        }

        // ORG_ADMIN
        return [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { text: 'Services', icon: <DesignServices />, path: '/services' },
            { text: 'Feedback Forms', path: '/feedback/forms', icon: <Assignment /> },
            { text: 'QR Codes', icon: <QrCode />, path: '/qr' },
            { text: 'Responses', icon: <FeedbackIcon />, path: '/responses' },
            { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
            { text: 'Notifications', icon: <NotificationsActiveSharp />, path: '/notifications' },
        ]
    }

    const navigationItems = getNavigationItems()

    const drawer = (isCollapsed = false) => (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo/Header */}
            <Toolbar sx={{
                justifyContent: isCollapsed ? 'center' : 'space-between',
                py: 2,
                px: isCollapsed ? 1 : 2
            }}>
                {!isCollapsed && (
                    <Typography variant="h5" fontWeight={700} color="primary">
                        BoloIndia
                    </Typography>
                )}
                {isCollapsed && (
                    <Typography variant="h5" fontWeight={700} color="primary">
                        B
                    </Typography>
                )}
            </Toolbar>

            <Divider />

            {/* Navigation Items */}
            <List sx={{ px: isCollapsed ? 1 : 2, py: 1, flexGrow: 1 }}>
                {navigationItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <Tooltip title={isCollapsed ? item.text : ''} placement="right" arrow>
                            <ListItemButton
                                selected={location.pathname.startsWith(item.path)}
                                onClick={() => {
                                    navigate(item.path)
                                    if (isMobile) setMobileOpen(false)
                                }}
                                sx={{
                                    borderRadius: 2,
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    px: isCollapsed ? 1 : 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: isCollapsed ? 'unset' : 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                {!isCollapsed && <ListItemText primary={item.text} />}
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>

            {/* Toggle Button (Desktop only) */}
            {!isMobile && (
                <>
                    <Divider />
                    <Box sx={{ p: 1 }}>
                        <IconButton
                            onClick={handleDesktopDrawerToggle}
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                bgcolor: 'action.hover',
                                '&:hover': { bgcolor: 'action.selected' }
                            }}
                        >
                            {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </Box>
                </>
            )}
        </Box>
    )

    const currentDrawerWidth = isMobile ? drawerWidth : (desktopOpen ? drawerWidth : drawerWidthCollapsed)

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                    ml: { md: `${currentDrawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
                elevation={1}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                            {user?.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {role?.replace('_', ' ')}
                        </Typography>
                    </Box>

                    <IconButton onClick={toggleMode} sx={{ mr: 1 }}>
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    <IconButton onClick={handleProfileMenuOpen}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                            {user?.fullName?.charAt(0)}
                        </Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose() }}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose() }}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Drawer */}
            <Box
                component="nav"
                sx={{
                    width: { md: currentDrawerWidth },
                    flexShrink: { md: 0 },
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth
                        },
                    }}
                >
                    {drawer(false)}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: currentDrawerWidth,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            overflowX: 'hidden',
                        },
                    }}
                    open
                >
                    {drawer(!desktopOpen)}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: location.pathname.includes('/services') ? 0 : 3,
                    width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <Outlet />
            </Box>
        </Box>
    )
}
