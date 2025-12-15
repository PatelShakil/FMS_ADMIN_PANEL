import React, { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    IconButton,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    InputAdornment,
    Chip,
    Alert,
} from '@mui/material'
import {
    Add as AddIcon,
    ViewList as ListIcon,
    ViewModule as GridIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { qrService } from '../../../api/services/qrService'
import { useAuthStore } from '../../../store/authStore'
import { QRList } from '../components/QRList/QRList'
import { GenerateQRDialog } from '../components/QRDialogs/GenerateQRDialog'
import { VIEW_MODES, QR_STATUS } from '../constants/qrConstants'

export const QRManagement = () => {
    const { formId } = useParams()
    const navigate = useNavigate()
    const { user,role } = useAuthStore()

    const [viewMode, setViewMode] = useState(VIEW_MODES.GRID)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [generateDialogOpen, setGenerateDialogOpen] = useState(false)

    // Fetch QR codes
    const { data: qrCodesData, isLoading, refetch } = useQuery({
        queryKey: ['qr-codes', user?.orgId, formId],
        queryFn: async () => {
            if (formId) {
                return await qrService.getQRByFormId(formId)
            } else {
                return await qrService.getQRByOrgId(user?.orgId)
            }
        },
        enabled: !!user?.orgId,
    })

    // Filter QR codes based on user role (Frontend RBAC)
    const filteredQRCodes = useMemo(() => {
        if (!qrCodesData?.data) return []

        let codes = qrCodesData.data.qrCodes
        // console.log('QRCodes:', codes)

        // TODO: Backend validation needed - Move this filter to backend for security
        // Apply role-based filtering
        if (role === 'ORG_ADMIN') {
            // ORG_ADMIN can only see QR codes they created
            codes = codes.filter(qr => qr.createdBy === user.id)
        }
        // ORG_OWNER sees all QR codes in their organization

        // Apply search filter
        if (searchQuery) {
            codes = codes.filter(qr =>
                qr.qrCodeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                qr.qrCodeSlug?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply status filter
        if (statusFilter !== 'ALL') {
            codes = codes.filter(qr => qr.status === statusFilter)
        }

        return codes
    }, [qrCodesData, user, searchQuery, statusFilter])

    // Calculate statistics
    const stats = useMemo(() => {
        const codes = qrCodesData?.data?.qrCodes || []

        // TODO: Backend validation - Filter by createdBy on backend
        const userCodes = role === 'ORG_ADMIN'
            ? codes.filter(qr => qr.createdBy === user.userId)
            : codes

        return {
            total: userCodes.length,
            active: userCodes.filter(qr => qr.status === 'ASSIGNED').length,
            deployed: userCodes.filter(qr => qr.isDeployed).length,
            pending: userCodes.filter(qr => qr.deploymentStatus === 'PENDING_APPROVAL').length,
        }
    }, [qrCodesData, user])

    const handleGenerateSuccess = () => {
        setGenerateDialogOpen(false)
        refetch()
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    flexShrink: 0,
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        QR Code Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {role === 'ORG_ADMIN'
                            ? 'Manage your QR codes'
                            : 'Manage all organization QR codes'
                        }
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setGenerateDialogOpen(true)}
                    >
                        Generate QR Code
                    </Button>
                </Box>
            </Box>

            {/* Stats & Filters */}
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                {/* Statistics */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip
                        label={`Total: ${stats.total}`}
                        color="default"
                        variant="outlined"
                    />
                    <Chip
                        label={`Assigned: ${stats.active}`}
                        color="success"
                        variant="outlined"
                    />
                    <Chip
                        label={`Deployed: ${stats.deployed}`}
                        color="info"
                        variant="outlined"
                    />
                    <Chip
                        label={`Pending Approval: ${stats.pending}`}
                        color="warning"
                        variant="outlined"
                    />
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* Search */}
                    <TextField
                        size="small"
                        placeholder="Search QR codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flex: 1, maxWidth: 400 }}
                    />

                    {/* Status Filter */}
                    <TextField
                        select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ minWidth: 150 }}
                    >
                        <option value="ALL">All Status</option>
                        {Object.values(QR_STATUS).map(status => (
                            <option key={status.value} value={status.value}>
                                {status.icon} {status.label}
                            </option>
                        ))}
                    </TextField>

                    {/* View Mode Toggle */}
                    <ToggleButtonGroup
                        size="small"
                        value={viewMode}
                        exclusive
                        onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    >
                        <ToggleButton value={VIEW_MODES.GRID}>
                            <GridIcon fontSize="small" />
                        </ToggleButton>
                        <ToggleButton value={VIEW_MODES.LIST}>
                            <ListIcon fontSize="small" />
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* Refresh */}
                    <IconButton onClick={() => refetch()} size="small">
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Role Info Alert */}
            {role === 'ORG_ADMIN' && (
                <Box sx={{ px: 3, pt: 2 }}>
                    <Alert severity="info" sx={{ mb: 0 }}>
                        You can only see and manage QR codes you created.
                        Organization owner can see all QR codes.
                    </Alert>
                </Box>
            )}

            {/* QR List/Grid */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <QRList
                    qrCodes={filteredQRCodes}
                    loading={isLoading}
                    viewMode={viewMode}
                    onRefresh={refetch}
                />
            </Box>

            {/* Generate QR Dialog */}
            <GenerateQRDialog
                open={generateDialogOpen}
                onClose={() => setGenerateDialogOpen(false)}
                onSuccess={handleGenerateSuccess}
                formId={formId}
            />
        </Box>
    )
}
