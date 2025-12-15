import React, { useState, useMemo } from 'react'
import {
    Box,
    TextField,
    InputAdornment,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Breadcrumbs,
    Link,
    Button,
    Fade,
} from '@mui/material'
import {
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    ArrowBack as ArrowBackIcon,
    NavigateNext as NavigateNextIcon,
    FolderOpen as FolderIcon,
} from '@mui/icons-material'
import { SERVICE_TYPES, SERVICE_STATUS } from '../constants/serviceConstants'
import { ServiceDetailsDrawer } from '../components/ServiceDetailsDrawer'

const ServiceCard = ({ service, onNavigate, onAction, onView }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const serviceTypeConfig = SERVICE_TYPES[service.serviceType] || SERVICE_TYPES.OTHER
    const statusConfig = SERVICE_STATUS[service.status] || SERVICE_STATUS.INACTIVE

    const childrenCount = service.children?.length || 0

    const handleMenuOpen = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleAction = (action) => {
        handleMenuClose()
        onAction(action, service)
    }

    return (
        <>
            <Fade in timeout={300}>
                <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: childrenCount > 0 ? 'pointer' : 'default',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 8,
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            bgcolor: serviceTypeConfig.color,
                            borderRadius: '4px 4px 0 0',
                        },
                    }}
                    onClick={(e) => {
                        if (childrenCount > 0 && !e.target.closest('button')) {
                            onNavigate(service)
                        }
                    }}
                >
                    <CardContent sx={{ flex: 1, pt: 2 }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: `${serviceTypeConfig.color}20`,
                                    color: serviceTypeConfig.color,
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                }}
                            >
                                {service.serviceName?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" fontWeight={700} noWrap>
                                    {service.serviceName}
                                </Typography>
                                {service.serviceCode && (
                                    <Typography variant="caption" color="text.secondary">
                                        {service.serviceCode}
                                    </Typography>
                                )}
                            </Box>
                            <IconButton size="small" onClick={handleMenuOpen}>
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* Status Chips */}
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                            <Chip
                                label={statusConfig.label}
                                size="small"
                                color={statusConfig.color}
                            />
                            <Chip
                                label={serviceTypeConfig.label}
                                size="small"
                                sx={{
                                    bgcolor: `${serviceTypeConfig.color}20`,
                                    color: serviceTypeConfig.color,
                                }}
                            />
                        </Box>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                                label={`${service.totalFeedbackForms || 0} Forms`}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`${service.totalQrCodes || 0} QR Codes`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        {/* Children Indicator */}
                        {childrenCount > 0 && (
                            <Chip
                                icon={<FolderIcon />}
                                label={`${childrenCount} sub-service${childrenCount !== 1 ? 's' : ''}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ width: 'fit-content' }}
                            />
                        )}
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                        <Button size="small" onClick={(e) => { e.stopPropagation(); onView(service); }}>
                            View Details
                        </Button>
                        {childrenCount > 0 && (
                            <Button
                                size="small"
                                variant="contained"
                                onClick={(e) => { e.stopPropagation(); onNavigate(service); }}
                            >
                                Explore
                            </Button>
                        )}
                    </CardActions>
                </Card>
            </Fade>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleAction('view')}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAction('addChild')}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add Child</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAction('edit')}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAction('delete')}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}

export const ServiceGridView = ({ data, loading, onAddService, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [navigationPath, setNavigationPath] = useState([])
    const [selectedService, setSelectedService] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    // Get current level services based on navigation path
    const currentServices = useMemo(() => {
        if (!data) return []

        if (navigationPath.length === 0) {
            return data
        }

        let current = data
        for (const pathNode of navigationPath) {
            const found = current.find(s => s.id === pathNode.id)
            if (found && found.children) {
                current = found.children
            } else {
                return []
            }
        }
        return current
    }, [data, navigationPath])

    // Search filter
    const filteredServices = useMemo(() => {
        if (!searchQuery) return currentServices

        const query = searchQuery.toLowerCase()
        return currentServices.filter(service =>
            service.serviceName?.toLowerCase().includes(query) ||
            service.serviceCode?.toLowerCase().includes(query) ||
            service.fullPath?.toLowerCase().includes(query)
        )
    }, [currentServices, searchQuery])

    const handleNavigate = (service) => {
        setNavigationPath([...navigationPath, service])
    }

    const handleBreadcrumbClick = (index) => {
        if (index === -1) {
            setNavigationPath([])
        } else {
            setNavigationPath(navigationPath.slice(0, index + 1))
        }
    }

    const handleAction = (action, service) => {
        switch (action) {
            case 'view':
                setSelectedService({ ...service, serviceId: service.id })
                setDrawerOpen(true)
                break
            case 'addChild':
                onAddService(service.id)
                break
            case 'edit':
                console.log('Edit:', service)
                break
            case 'delete':
                console.log('Delete:', service)
                break
        }
    }

    const handleView = (service) => {
        setSelectedService({ ...service, serviceId: service.id })
        setDrawerOpen(true)
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Loading services...</Typography>
            </Box>
        )
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    No services found
                </Typography>
                <IconButton
                    color="primary"
                    size="large"
                    onClick={() => onAddService()}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        width: 56,
                        height: 56,
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>
        )
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            {/* Breadcrumb Navigation */}
            {navigationPath.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => setNavigationPath([])}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => handleBreadcrumbClick(-1)}
                            sx={{ cursor: 'pointer' }}
                        >
                            All Services
                        </Link>
                        {navigationPath.map((node, index) => (
                            <Link
                                key={node.id}
                                component="button"
                                variant="body2"
                                onClick={() => handleBreadcrumbClick(index)}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight: index === navigationPath.length - 1 ? 600 : 400,
                                }}
                            >
                                {node.serviceName}
                            </Link>
                        ))}
                    </Breadcrumbs>
                </Box>
            )}

            {/* Search */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Grid */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {filteredServices.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredServices.map((service) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                                <ServiceCard
                                    service={service}
                                    onNavigate={handleNavigate}
                                    onAction={handleAction}
                                    onView={handleView}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No services found
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => onAddService()}
                            sx={{ mt: 2 }}
                        >
                            Add Service
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Details Drawer */}
            <ServiceDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                service={selectedService}
                onUpdate={onRefresh}
            />
        </Box>
    )
}
