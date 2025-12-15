import React, { useState } from 'react'
import { Handle, Position } from 'reactflow'
import {
    Box,
    Typography,
    IconButton,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Card,
    useTheme,
    Avatar,
} from '@mui/material'
import {
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    Visibility as ViewIcon,
    ExpandMore as ExpandMoreIcon,
    Business as BusinessIcon,
    Category as CategoryIcon,
    AccountTree as BranchIcon,
    LocationOn as LocationIcon,
    Apartment as ApartmentIcon,
    Settings as SettingsIcon,
    Label as LabelIcon,
} from '@mui/icons-material'
import { SERVICE_TYPES, SERVICE_STATUS } from '../constants/serviceConstants'

const getServiceIcon = (type) => {
    const iconMap = {
        DEPARTMENT: <BusinessIcon />,
        DIVISION: <CategoryIcon />,
        BRANCH: <BranchIcon />,
        LOCATION: <LocationIcon />,
        FACILITY: <ApartmentIcon />,
        EQUIPMENT: <SettingsIcon />,
        OTHER: <LabelIcon />,
    }
    return iconMap[type] || <LabelIcon />
}

export const CustomServiceNode = ({ data }) => {
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState(null)

    const serviceTypeConfig = SERVICE_TYPES[data.serviceType] || SERVICE_TYPES.OTHER
    const statusConfig = SERVICE_STATUS[data.status] || SERVICE_STATUS.INACTIVE

    const handleMenuOpen = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleAction = (action) => {
        handleMenuClose()
        action()
    }

    return (
        <>
            <Card
                sx={{
                    width: 280,
                    minHeight: 100,
                    position: 'relative',
                    overflow: 'visible',
                    background: `linear-gradient(135deg, ${serviceTypeConfig.color}15 0%, ${serviceTypeConfig.color}05 100%)`,
                    border: `2px solid ${serviceTypeConfig.color}`,
                    borderRadius: 3,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 24px ${serviceTypeConfig.color}40`,
                        borderColor: serviceTypeConfig.color,
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${serviceTypeConfig.color}, ${serviceTypeConfig.color}80)`,
                        borderRadius: '12px 12px 0 0',
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ p: 1.5, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: `${serviceTypeConfig.color}20`,
                                color: serviceTypeConfig.color,
                                flexShrink: 0,
                            }}
                        >
                            {getServiceIcon(data.serviceType)}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: 'text.primary',
                                }}
                                title={data.serviceName}
                            >
                                {data.serviceName}
                            </Typography>
                            {data.serviceCode && (
                                <Typography variant="caption" color="text.secondary">
                                    {data.serviceCode}
                                </Typography>
                            )}
                        </Box>
                        <IconButton
                            size="small"
                            onClick={handleMenuOpen}
                            sx={{ flexShrink: 0 }}
                        >
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content */}
                <Box sx={{ px: 1.5, pb: 1.5 }}>
                    {/* Status & Type Chips */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        <Chip
                            label={statusConfig.label}
                            size="small"
                            color={statusConfig.color}
                            sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                        <Chip
                            label={serviceTypeConfig.label}
                            size="small"
                            variant="outlined"
                            sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                borderColor: serviceTypeConfig.color,
                                color: serviceTypeConfig.color,
                            }}
                        />
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {data.totalFeedbackForms !== undefined && (
                            <Chip
                                label={`${data.totalFeedbackForms} Forms`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.6rem' }}
                            />
                        )}
                        {data.totalQrCodes !== undefined && (
                            <Chip
                                label={`${data.totalQrCodes} QR Codes`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.6rem' }}
                            />
                        )}
                        {data.isFeedbackEnabled && (
                            <Chip
                                label="Feedback"
                                size="small"
                                variant="outlined"
                                color="success"
                                sx={{ height: 18, fontSize: '0.6rem' }}
                            />
                        )}
                    </Box>

                    {/* Children Indicator */}
                    {data.hasChildren && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 1,
                                pt: 1,
                                borderTop: 1,
                                borderColor: 'divider',
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                Has sub-services
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Handles for connections */}
                <Handle
                    type="target"
                    position={Position.Top}
                    style={{
                        width: 12,
                        height: 12,
                        background: serviceTypeConfig.color,
                        border: `2px solid ${theme.palette.background.paper}`,
                    }}
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{
                        width: 12,
                        height: 12,
                        background: serviceTypeConfig.color,
                        border: `2px solid ${theme.palette.background.paper}`,
                    }}
                />
            </Card>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={() => handleAction(data.onView)}>
                    <ListItemIcon>
                        <ViewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleAction(data.onAddChild)}>
                    <ListItemIcon>
                        <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add Child Service</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}
