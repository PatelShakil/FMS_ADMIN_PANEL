import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    Grid,
    Tabs,
    Tab,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material'
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    Add as AddIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { orgService } from '../../api/services/orgService'
import { OrganizationsTable } from './components/OrganizationsTable'
import { OrganizationFilters } from './components/OrganizationFilters'

export const Organizations = () => {
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        orgType: '',
        state: '',
        city: '',
    })

    // Build query parameters
    const getQueryParams = () => {
        const params = { page: 1, limit: 50 }

        if (activeTab !== 'all') {
            params.status = activeTab.toUpperCase()
        }

        if (searchQuery) {
            params.search = searchQuery
        }

        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                params[key] = filters[key]
            }
        })

        return params
    }

    // Fetch organizations
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['organizations', activeTab, searchQuery, filters],
        queryFn: () => orgService.getAllOrgs(getQueryParams()),
    })

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
    }

    const handleClearFilters = () => {
        setFilters({
            orgType: '',
            state: '',
            city: '',
        })
        setSearchQuery('')
    }

    const stats = {
        total: data?.data?.length || 0,
        pending: data?.data?.filter(org => org.status === 'PENDING')?.length || 0,
        approved: data?.data?.filter(org => org.status === 'APPROVED')?.length || 0,
        rejected: data?.data?.filter(org => org.status === 'REJECTED')?.length || 0,
    }

    return (
        <Box sx={{width:"75vw"}}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Organizations Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage and approve organization registrations
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Total Organizations
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {stats.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Pending Approval
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="warning.main">
                                {stats.pending}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Approved
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                                {stats.approved}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Rejected
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="error.main">
                                {stats.rejected}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Card */}
            <Card>
                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="All Organizations" value="all" />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Pending
                                    {stats.pending > 0 && (
                                        <Chip label={stats.pending} size="small" color="warning" />
                                    )}
                                </Box>
                            }
                            value="pending"
                        />
                        <Tab label="Approved" value="approved" />
                        <Tab label="Rejected" value="rejected" />
                    </Tabs>
                </Box>

                {/* Search & Filters */}
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search organizations..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            size="small"
                            sx={{ flexGrow: 1, minWidth: 300 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant={showFilters ? 'contained' : 'outlined'}
                            startIcon={<FilterIcon />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filters
                        </Button>
                        {(searchQuery || Object.values(filters).some(v => v)) && (
                            <Button variant="outlined" onClick={handleClearFilters}>
                                Clear All
                            </Button>
                        )}
                    </Box>

                    {/* Filters Panel */}
                    {showFilters && (
                        <OrganizationFilters
                            filters={filters}
                            onChange={handleFilterChange}
                        />
                    )}

                    {/* Organizations Table */}
                    <OrganizationsTable
                        data={data?.data || []}
                        loading={isLoading}
                        onRefresh={refetch}
                    />
                </CardContent>
            </Card>
        </Box>
    )
}
