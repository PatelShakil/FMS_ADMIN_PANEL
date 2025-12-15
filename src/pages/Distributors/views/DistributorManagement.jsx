import React, {useState, useMemo, useEffect} from 'react'
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
// import { userService } from '../../../api/services/userService'
import { useAuthStore } from '../../../store/authStore'
import { DistributorList } from '../components/DistributorList/DistributorList'
import { CreateDistributorDialog } from '../components/DistributorDialogs/CreateDistributorDialog'
import { VIEW_MODES, DISTRIBUTOR_STATUS } from '../constants/distributorConstants'
import {authService} from "../../../api/services/authService.js";

export const DistributorManagement = () => {
    const { user,role } = useAuthStore()

    const [viewMode, setViewMode] = useState(VIEW_MODES.GRID)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [createDialogOpen, setCreateDialogOpen] = useState(false)


    // // Check if user is platform admin
    // if (role !== 'PLATFORM_ADMIN') {
    //     return (
    //         <Box sx={{ p: 3 }}>
    //             <Alert severity="error">
    //                 Access Denied: Only Platform Admins can manage distributors
    //             </Alert>
    //         </Box>
    //     )
    // }

    // Fetch distributors
    const { data: distributorsData, isLoading,refetch } = useQuery({
        queryKey: ['distributors'],
        queryFn: () => authService.getAllDistributors(),
        enabled:true
    })
    // useEffect(() => {
    //     console.log(distributorsData)
    //
    // }, [distributorsData,isLoading]);

    // Filter distributors
    const filteredDistributors = useMemo(() => {
        if (!distributorsData?.data) return []

        let distributors = distributorsData?.data?.distributors

        // Apply search filter
        if (searchQuery) {
            distributors = distributors.filter(dist =>
                dist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dist.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dist.phone?.includes(searchQuery)
            )
        }

        // Apply status filter
        if (statusFilter !== 'ALL') {
            distributors = distributors.filter(dist => dist.status === statusFilter)
        }

        return distributors
    }, [distributorsData, searchQuery, statusFilter])

    // Calculate statistics
    const stats = useMemo(() => {
        const distributors = distributorsData?.data.distributors || []
        return {
            total: distributors.length,
            active: distributors.filter(d => d.accountStatus === 'ACTIVE').length,
            inactive: distributors.filter(d => d.accountStatus === 'INACTIVE').length,
            pending: distributors.filter(d => d.accountStatus === 'PENDING').length,
        }
    }, [distributorsData])

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false)
        refetch()
    }

    if(isLoading){
        return <p>Loading</p>
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
                        Distributor Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage all distributors across organizations
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        Add Distributor
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
                        label={`Active: ${stats.active}`}
                        color="success"
                        variant="outlined"
                    />
                    <Chip
                        label={`Inactive: ${stats.inactive}`}
                        color="error"
                        variant="outlined"
                    />
                    <Chip
                        label={`Pending: ${stats.pending}`}
                        color="warning"
                        variant="outlined"
                    />
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* Search */}
                    <TextField
                        size="small"
                        placeholder="Search distributors..."
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
                        {Object.values(DISTRIBUTOR_STATUS).map(status => (
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

            {/* Distributor List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <DistributorList
                    distributors={filteredDistributors}
                    loading={isLoading}
                    viewMode={viewMode}
                    onRefresh={refetch}
                />
            </Box>

            {/* Create Distributor Dialog */}
            <CreateDistributorDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </Box>
    )
}
