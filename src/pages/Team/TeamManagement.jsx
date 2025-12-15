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
    PersonAdd as InviteIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { authService } from '../../api/services/authService'
import { TeamMembersTable } from './components/TeamMembersTable'
import {useAuthStore} from "../../store/authStore.js";

export const TeamManagement = () => {
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const {user} = useAuthStore();

    // Fetch team members
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['team-members', activeTab, searchQuery],
        queryFn: () => authService.getTeamMembers(user?.orgId),
    })

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value)
    }

    // Filter data based on tab and search
    const filteredData = React.useMemo(() => {
        let filtered = data?.data || []

        // Filter by status
        if (activeTab !== 'all') {
            filtered = filtered.filter(member =>
                member.accountStatus.toLowerCase() === activeTab
            )
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(member =>
                member.fullName?.toLowerCase().includes(query) ||
                member.email?.toLowerCase().includes(query)
            )
        }

        return filtered
    }, [data, activeTab, searchQuery])

    const stats = {
        total: data?.data?.length || 0,
        active: data?.data?.filter(m => m.accountStatus === 'ACTIVE')?.length || 0,
        inactive: data?.data?.filter(m => m.accountStatus === 'INACTIVE')?.length || 0,
        suspended: data?.data?.filter(m => m.accountStatus  === 'SUSPENDED')?.length || 0,
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Team Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your organization admins and team members
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<InviteIcon />}
                        onClick={() => navigate('/team/invite')}
                    >
                        Invite Admin
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Total Members
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {stats.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: 4, borderColor: 'success.main' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Active
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                                {stats.active}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: 4, borderColor: 'warning.main' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Inactive
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="warning.main">
                                {stats.inactive}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderLeft: 4, borderColor: 'error.main' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Suspended
                            </Typography>
                            <Typography variant="h4" fontWeight={700} color="error.main">
                                {stats.suspended}
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
                        <Tab label="All Members" value="all" />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Active
                                    <Chip label={stats.active} size="small" color="success" />
                                </Box>
                            }
                            value="active"
                        />
                        <Tab label="Inactive" value="inactive" />
                        <Tab label="Suspended" value="suspended" />
                    </Tabs>
                </Box>

                {/* Search */}
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            placeholder="Search members by name or email..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            size="small"
                            sx={{ flexGrow: 1 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Team Members Table */}
                    <TeamMembersTable
                        data={filteredData}
                        loading={isLoading}
                        onRefresh={refetch}
                    />
                </CardContent>
            </Card>
        </Box>
    )
}
