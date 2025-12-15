import React, { useState, useMemo } from 'react'
import {
    Box,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Typography,
    Paper,
    Collapse,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Avatar,
} from '@mui/material'
import {
    Search as SearchIcon,
    KeyboardArrowDown as ExpandIcon,
    KeyboardArrowRight as CollapseIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material'
import { SERVICE_TYPES, SERVICE_STATUS } from '../constants/serviceConstants'
import { ServiceDetailsDrawer } from '../components/ServiceDetailsDrawer'

const ServiceRow = ({ service, level = 0, expandedNodes, onExpand, onAction, onView }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const serviceTypeConfig = SERVICE_TYPES[service.serviceType] || SERVICE_TYPES.OTHER
    const statusConfig = SERVICE_STATUS[service.status] || SERVICE_STATUS.INACTIVE

    const hasChildren = service.children && service.children.length > 0
    const isExpanded = expandedNodes.has(service.id)

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
            <TableRow
                hover
                sx={{
                    bgcolor: level > 0 ? `rgba(0, 0, 0, ${0.02 * level})` : 'inherit',
                }}
            >
                <TableCell sx={{ pl: level * 4 + 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {hasChildren ? (
                            <IconButton
                                size="small"
                                onClick={() => onExpand(service.id)}
                            >
                                {isExpanded ? <ExpandIcon /> : <CollapseIcon />}
                            </IconButton>
                        ) : (
                            <Box sx={{ width: 40 }} /> // Spacer for alignment
                        )}
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: `${serviceTypeConfig.color}20`,
                                color: serviceTypeConfig.color,
                            }}
                        >
                            {service.serviceName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {service.serviceName}
                            </Typography>
                            {service.serviceCode && (
                                <Typography variant="caption" color="text.secondary">
                                    {service.serviceCode}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </TableCell>

                <TableCell>
                    <Chip
                        label={serviceTypeConfig.label}
                        size="small"
                        sx={{
                            bgcolor: `${serviceTypeConfig.color}20`,
                            color: serviceTypeConfig.color,
                            fontWeight: 600,
                        }}
                    />
                </TableCell>

                <TableCell>
                    <Chip
                        label={statusConfig.label}
                        size="small"
                        color={statusConfig.color}
                    />
                </TableCell>

                <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {service.shortDescription || service.description || '-'}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2">{service.totalFeedbackForms || 0} Forms</Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2">{service.totalQrCodes || 0} QR Codes</Typography>
                </TableCell>

                <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {service.isPublic && (
                            <Chip label="Public" size="small" variant="outlined" />
                        )}
                        {service.isFeedbackEnabled && (
                            <Chip label="Feedback" size="small" variant="outlined" color="success" />
                        )}
                    </Box>
                </TableCell>

                <TableCell align="right">
                    <IconButton size="small" onClick={() => onView(service)}>
                        <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={handleMenuOpen}>
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                </TableCell>
            </TableRow>

            {/* Children rows */}
            {hasChildren && (
                <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Table size="small">
                                <TableBody>
                                    {service.children.map((child) => (
                                        <ServiceRow
                                            key={child.id}
                                            service={child}
                                            level={level + 1}
                                            expandedNodes={expandedNodes}
                                            onExpand={onExpand}
                                            onAction={onAction}
                                            onView={onView}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}

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

export const ServiceListView = ({ data, loading, onAddService, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [expandedNodes, setExpandedNodes] = useState(new Set())
    const [selectedService, setSelectedService] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    // Flatten hierarchy for counting/pagination (recursive)
    const flattenForCount = (services) => {
        let result = []
        services?.forEach(service => {
            result.push(service)
            if (expandedNodes.has(service.id) && service.children?.length > 0) {
                result = result.concat(flattenForCount(service.children))
            }
        })
        return result
    }

    // Search filter (searches in entire tree)
    const searchInTree = (services, query) => {
        if (!query) return services

        const lowerQuery = query.toLowerCase()

        return services?.filter(service => {
            const matchesCurrent =
                service.serviceName?.toLowerCase().includes(lowerQuery) ||
                service.serviceCode?.toLowerCase().includes(lowerQuery) ||
                service.fullPath?.toLowerCase().includes(lowerQuery)

            const matchesChildren = service.children?.some(child =>
                searchInTree([child], query).length > 0
            )

            return matchesCurrent || matchesChildren
        }).map(service => ({
            ...service,
            children: service.children ? searchInTree(service.children, query) : []
        }))
    }

    const filteredData = useMemo(() =>
            searchInTree(data, searchQuery),
        [data, searchQuery]
    )

    const flatCount = flattenForCount(filteredData).length

    const handleExpand = (serviceId) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev)
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId)
            } else {
                newSet.add(serviceId)
            }
            return newSet
        })
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
            {/* Search */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search services by name, code, or path..."
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

            {/* Table */}
            <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <TableContainer sx={{ flex: 1 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Service Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Forms</TableCell>
                                <TableCell>QR Codes</TableCell>
                                <TableCell>Settings</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((service) => (
                                <ServiceRow
                                    key={service.id}
                                    service={service}
                                    level={0}
                                    expandedNodes={expandedNodes}
                                    onExpand={handleExpand}
                                    onAction={handleAction}
                                    onView={handleView}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Info Bar */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {flatCount} service{flatCount !== 1 ? 's' : ''}
                        {searchQuery && ' (filtered)'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Click arrow to expand/collapse children
                    </Typography>
                </Box>
            </Paper>

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
