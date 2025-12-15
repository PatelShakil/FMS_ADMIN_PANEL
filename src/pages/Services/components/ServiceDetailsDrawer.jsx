import React, { useState, useEffect } from 'react'
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    Chip,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    useMediaQuery,
    useTheme,
    CircularProgress,
} from '@mui/material'
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Business as BusinessIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    AccessTime as AccessTimeIcon,
    Feedback as FeedbackIcon,
    Public as PublicIcon,
    Block as InactiveIcon,
    CheckCircle as ActiveIcon,
    Build as MaintenanceIcon,
    AccountTree as HierarchyIcon,
    QrCode as QrCodeIcon,
    Description as FormIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { serviceService } from '../../../api/services/serviceService'
import { SERVICE_TYPES, SERVICE_STATUS } from '../constants/serviceConstants'
import { AddServiceDialog } from './AddServiceDialog'
import toast from 'react-hot-toast'

const InfoRow = ({ icon, label, value }) => (
    <ListItem>
        <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
            {icon}
        </ListItemIcon>
        <ListItemText
            primary={
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
            }
            secondary={
                <Typography variant="body2" fontWeight={500}>
                    {value || 'N/A'}
                </Typography>
            }
        />
    </ListItem>
)

export const ServiceDetailsDrawer = ({ open, onClose, service, onUpdate }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const queryClient = useQueryClient()

    const [activeTab, setActiveTab] = useState(0)
    const [anchorEl, setAnchorEl] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    // FIX: Fetch full service details when drawer opens
    const { data: fullServiceData, isLoading: detailsLoading } = useQuery({
        queryKey: ['service-details', service?.serviceId],
        queryFn: () => serviceService.getServiceById(service.serviceId),
        enabled: open && !!service?.serviceId,
    })

    // Fetch service children
    const { data: children } = useQuery({
        queryKey: ['service-children', service?.serviceId],
        queryFn: () => serviceService.getServiceChildren(service.serviceId),
        enabled: open && !!service?.serviceId,
    })

    // Fetch service ancestors (breadcrumb)
    const { data: ancestors } = useQuery({
        queryKey: ['service-ancestors', service?.serviceId],
        queryFn: () => serviceService.getServiceAncestors(service.serviceId),
        enabled: open && !!service?.serviceId,
    })

    // Use full service data if available, otherwise use passed service
    const displayService = fullServiceData || service

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => serviceService.deleteService(service.serviceId),
        onSuccess: () => {
            toast.success('Service deleted successfully')
            queryClient.invalidateQueries(['service-tree'])
            queryClient.invalidateQueries(['services'])
            onUpdate()
            onClose()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete service')
        },
    })

    // Activate/Deactivate mutations
    const activateMutation = useMutation({
        mutationFn: () => serviceService.activateService(service.serviceId),
        onSuccess: () => {
            toast.success('Service activated successfully')
            queryClient.invalidateQueries(['service-tree'])
            queryClient.invalidateQueries(['service-details', service.serviceId])
            onUpdate()
        },
    })

    const deactivateMutation = useMutation({
        mutationFn: () => serviceService.deactivateService(service.serviceId),
        onSuccess: () => {
            toast.success('Service deactivated successfully')
            queryClient.invalidateQueries(['service-tree'])
            queryClient.invalidateQueries(['service-details', service.serviceId])
            onUpdate()
        },
    })

    const maintenanceMutation = useMutation({
        mutationFn: () => serviceService.setMaintenanceMode(service.serviceId),
        onSuccess: () => {
            toast.success('Maintenance mode updated')
            queryClient.invalidateQueries(['service-tree'])
            queryClient.invalidateQueries(['service-details', service.serviceId])
            onUpdate()
        },
    })

    if (!service) return null

    const serviceTypeConfig = SERVICE_TYPES[displayService.serviceType] || SERVICE_TYPES.OTHER
    const statusConfig = SERVICE_STATUS[displayService.status] || SERVICE_STATUS.INACTIVE

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleDelete = () => {
        setDeleteDialogOpen(true)
        handleMenuClose()
    }

    const handleDeleteConfirm = () => {
        deleteMutation.mutate()
    }

    const handleEdit = () => {
        setEditDialogOpen(true)
        handleMenuClose()
    }

    const handleStatusChange = (action) => {
        handleMenuClose()
        switch (action) {
            case 'activate':
                activateMutation.mutate()
                break
            case 'deactivate':
                deactivateMutation.mutate()
                break
            case 'maintenance':
                maintenanceMutation.mutate()
                break
        }
    }

    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: isMobile ? '100%' : 480,
                    },
                }}
            >
                {detailsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Box
                            sx={{
                                p: 2,
                                background: `linear-gradient(135deg, ${serviceTypeConfig.color}20 0%, ${serviceTypeConfig.color}05 100%)`,
                                borderBottom: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        {displayService.serviceName}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
                                        {displayService.serviceCode && (
                                            <Chip label={displayService.serviceCode} size="small" variant="outlined" />
                                        )}
                                    </Box>
                                </Box>
                                <Box>
                                    <IconButton onClick={handleMenuOpen}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <IconButton onClick={onClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Breadcrumb */}
                            {ancestors?.data && ancestors.data.length > 0 && (
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                    <HierarchyIcon fontSize="small" color="action" />
                                    {ancestors.data.map((ancestor, index) => (
                                        <React.Fragment key={ancestor.serviceId || ancestor.id}>
                                            <Typography variant="caption" color="text.secondary">
                                                {ancestor.serviceName}
                                            </Typography>
                                            {index < ancestors.data.length - 1 && (
                                                <Typography variant="caption" color="text.secondary">
                                                    /
                                                </Typography>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {/* Tabs */}
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab label="Details" />
                            <Tab label="Contact" />
                            <Tab label="Location" />
                            <Tab label={`Children (${children?.data?.length || 0})`} />
                        </Tabs>

                        {/* Content */}
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                            {/* Tab 0: Details */}
                            {activeTab === 0 && (
                                <Box>
                                    {/* Stats Cards */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={6}>
                                            <Card>
                                                <CardContent sx={{ textAlign: 'center' }}>
                                                    <FormIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                                    <Typography variant="h5" fontWeight={700}>
                                                        {displayService.totalFeedbackForms || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Feedback Forms
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card>
                                                <CardContent sx={{ textAlign: 'center' }}>
                                                    <QrCodeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                                    <Typography variant="h5" fontWeight={700}>
                                                        {displayService.totalQrCodes || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        QR Codes
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    <List disablePadding>
                                        <InfoRow
                                            icon={<BusinessIcon />}
                                            label="Service Type"
                                            value={serviceTypeConfig.label}
                                        />
                                        {displayService.description && (
                                            <ListItem>
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                                        Description
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {displayService.description}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        )}
                                        {displayService.shortDescription && (
                                            <ListItem>
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                                        Short Description
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {displayService.shortDescription}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        )}
                                        <InfoRow
                                            icon={displayService.isPublic ? <PublicIcon /> : <Block />}
                                            label="Visibility"
                                            value={displayService.isPublic ? 'Public' : 'Private'}
                                        />
                                        <InfoRow
                                            icon={<FeedbackIcon />}
                                            label="Feedback"
                                            value={displayService.isFeedbackEnabled ? 'Enabled' : 'Disabled'}
                                        />
                                        {displayService.operatingHours && (
                                            <InfoRow
                                                icon={<AccessTimeIcon />}
                                                label="Operating Hours"
                                                value={displayService.operatingHours}
                                            />
                                        )}
                                        {displayService.fullPath && (
                                            <InfoRow
                                                icon={<HierarchyIcon />}
                                                label="Full Path"
                                                value={displayService.fullPath}
                                            />
                                        )}
                                        {displayService.slug && (
                                            <InfoRow
                                                icon={<HierarchyIcon />}
                                                label="Slug"
                                                value={displayService.slug}
                                            />
                                        )}
                                    </List>
                                </Box>
                            )}

                            {/* Tab 1: Contact */}
                            {activeTab === 1 && (
                                <List disablePadding>
                                    <InfoRow
                                        icon={<BusinessIcon />}
                                        label="Contact Person"
                                        value={displayService.contactPersonName}
                                    />
                                    <InfoRow
                                        icon={<PhoneIcon />}
                                        label="Phone"
                                        value={displayService.contactPhone}
                                    />
                                    <InfoRow
                                        icon={<EmailIcon />}
                                        label="Email"
                                        value={displayService.contactEmail}
                                    />
                                    {displayService.contactAddress && (
                                        <ListItem>
                                            <Box sx={{ width: '100%' }}>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Contact Address
                                                </Typography>
                                                <Typography variant="body2">
                                                    {displayService.contactAddress}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    )}
                                </List>
                            )}

                            {/* Tab 2: Location */}
                            {activeTab === 2 && (
                                <Box>
                                    <List disablePadding>
                                        {displayService.address && (
                                            <InfoRow
                                                icon={<LocationIcon />}
                                                label="Address"
                                                value={displayService.address}
                                            />
                                        )}
                                        <InfoRow
                                            icon={<LocationIcon />}
                                            label="City"
                                            value={displayService.city}
                                        />
                                        <InfoRow
                                            icon={<LocationIcon />}
                                            label="State"
                                            value={displayService.state}
                                        />
                                        <InfoRow
                                            icon={<LocationIcon />}
                                            label="Pincode"
                                            value={displayService.pincode}
                                        />
                                        {(displayService.latitude !== 0 && displayService.longitude !== 0) && (
                                            <ListItem>
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                                        Coordinates
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {displayService.latitude}, {displayService.longitude}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        )}
                                    </List>
                                </Box>
                            )}

                            {/* Tab 3: Children */}
                            {activeTab === 3 && (
                                <Box>
                                    {children?.data && children.data.length > 0 ? (
                                        <Grid container spacing={2}>
                                            {children.data.map((child) => {
                                                const childTypeConfig = SERVICE_TYPES[child.serviceType] || SERVICE_TYPES.OTHER
                                                const childStatusConfig = SERVICE_STATUS[child.status] || SERVICE_STATUS.INACTIVE

                                                return (
                                                    <Grid item xs={12} key={child.serviceId || child.id}>
                                                        <Card
                                                            sx={{
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow: 3,
                                                                },
                                                            }}
                                                        >
                                                            <CardContent>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <Box
                                                                        sx={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            borderRadius: 2,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            bgcolor: `${childTypeConfig.color}20`,
                                                                            color: childTypeConfig.color,
                                                                            flexShrink: 0,
                                                                        }}
                                                                    >
                                                                        <BusinessIcon />
                                                                    </Box>
                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Typography variant="body2" fontWeight={600} noWrap>
                                                                            {child.serviceName}
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                                                            <Chip
                                                                                label={childStatusConfig.label}
                                                                                size="small"
                                                                                color={childStatusConfig.color}
                                                                                sx={{ height: 20, fontSize: '0.65rem' }}
                                                                            />
                                                                            <Chip
                                                                                label={childTypeConfig.label}
                                                                                size="small"
                                                                                sx={{
                                                                                    height: 20,
                                                                                    fontSize: '0.65rem',
                                                                                    bgcolor: `${childTypeConfig.color}20`,
                                                                                    color: childTypeConfig.color,
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No child services
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Drawer>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Service</ListItemText>
                </MenuItem>

                {displayService.status === 'ACTIVE' && (
                    <MenuItem onClick={() => handleStatusChange('deactivate')}>
                        <ListItemIcon>
                            <InactiveIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Deactivate</ListItemText>
                    </MenuItem>
                )}

                {displayService.status === 'INACTIVE' && (
                    <MenuItem onClick={() => handleStatusChange('activate')}>
                        <ListItemIcon>
                            <ActiveIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText>Activate</ListItemText>
                    </MenuItem>
                )}

                <MenuItem onClick={() => handleStatusChange('maintenance')}>
                    <ListItemIcon>
                        <MaintenanceIcon fontSize="small" color="warning" />
                    </ListItemIcon>
                    <ListItemText>Set Maintenance Mode</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Service?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{displayService.serviceName}</strong>?
                        This action cannot be undone.
                    </Typography>
                    {children?.data && children.data.length > 0 && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            This service has {children.data.length} child service(s). They will also be deleted.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleteMutation.isLoading}
                    >
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <AddServiceDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                serviceId={service.serviceId}
                onSuccess={() => {
                    setEditDialogOpen(false)
                    onUpdate()
                }}
            />
        </>
    )
}
