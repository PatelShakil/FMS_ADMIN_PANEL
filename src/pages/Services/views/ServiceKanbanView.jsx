import React, { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    InputAdornment,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
} from '@mui/icons-material'
import { SERVICE_TYPES, SERVICE_STATUS } from '../constants/serviceConstants'
import { ServiceDetailsDrawer } from '../components/ServiceDetailsDrawer'

const KanbanCard = ({ service, onAction, onView }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const serviceTypeConfig = SERVICE_TYPES[service.serviceType] || SERVICE_TYPES.OTHER
    const statusConfig = SERVICE_STATUS[service.status] || SERVICE_STATUS.INACTIVE

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
            <Card
                sx={{
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                    },
                }}
                onClick={() => onView(service)}
            >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: `${serviceTypeConfig.color}20`,
                                color: serviceTypeConfig.color,
                                fontSize: '0.9rem',
                            }}
                        >
                            {service.serviceName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
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

                    {/* Path */}
                    {service.fullPath && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            📍 {service.fullPath}
                        </Typography>
                    )}

                    {/* Stats & Status */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                            label={statusConfig.label}
                            size="small"
                            color={statusConfig.color}
                            sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                        <Chip
                            label={`${service.totalFeedbackForms || 0} Forms`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                        <Chip
                            label={`${service.totalQrCodes || 0} QR`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                    </Box>
                </CardContent>
            </Card>

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

const KanbanColumn = ({ title, color, services, onAction, onView }) => {
    return (
        <Paper
            sx={{
                minWidth: 300,
                maxWidth: 350,
                bgcolor: 'background.default',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    p: 2,
                    bgcolor: `${color}15`,
                    borderBottom: 2,
                    borderColor: color,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        {title}
                    </Typography>
                    <Chip
                        label={services.length}
                        size="small"
                        sx={{
                            bgcolor: color,
                            color: 'white',
                            fontWeight: 700,
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                {services.map((service) => (
                    <KanbanCard
                        key={service.id}
                        service={service}
                        onAction={onAction}
                        onView={onView}
                    />
                ))}
                {services.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                        No services
                    </Typography>
                )}
            </Box>
        </Paper>
    )
}

export const ServiceKanbanView = ({ data, loading, onAddService, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedService, setSelectedService] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    // Flatten hierarchical data (recursively)
    const flattenServices = (services) => {
        let result = []
        services?.forEach(service => {
            result.push(service)
            if (service.children && service.children.length > 0) {
                result = result.concat(flattenServices(service.children))
            }
        })
        return result
    }

    const flatData = useMemo(() => flattenServices(data), [data])

    // Group services by type
    const groupedServices = useMemo(() => {
        const filtered = searchQuery
            ? flatData.filter(
                (s) =>
                    s.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.serviceCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.fullPath?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : flatData

        return Object.keys(SERVICE_TYPES).reduce((acc, type) => {
            acc[type] = filtered.filter((s) => s.serviceType === type)
            return acc
        }, {})
    }, [flatData, searchQuery])

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

            {/* Kanban Columns */}
            <Box
                className={"max-w-7xl mx-auto"}
                sx={{
                    flex: 1,
                    display: 'flex',
                    gap: 2,
                    overflow: 'auto',
                    pb: 2,
                }}
            >
                {Object.entries(SERVICE_TYPES).map(([key, config]) => (
                    <KanbanColumn
                        key={key}
                        title={config.label}
                        color={config.color}
                        services={groupedServices[key] || []}
                        onAction={handleAction}
                        onView={handleView}
                    />
                ))}
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
