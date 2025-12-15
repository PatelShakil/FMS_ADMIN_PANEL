import React, { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Tooltip,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    InputAdornment,
    Chip,
    Menu,
    MenuItem,
} from '@mui/material'
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    ViewModule as GridIcon,
    ViewList as ListIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    GetApp as TemplateIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { feedbackService } from '../../../api/services/feedbackService'
import { VIEW_MODES, FORM_STATUS } from '../constants/formConstants'
import { FormList } from '../components/FormManagement/FormList'
import { CloneTemplateDialog } from '../components/FormManagement/CloneTemplateDialog'
import {useAuthStore} from "../../../store/authStore.js";

export const FormManagement = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const [viewMode, setViewMode] = useState(VIEW_MODES.GRID)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(true)
    const [cloneDialogOpen, setCloneDialogOpen] = useState(false)
    const [filterAnchorEl, setFilterAnchorEl] = useState(null)

    // Fetch forms
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['forms', {
            search:searchQuery != null || searchQuery !== "" ? searchQuery : null,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            orgId: user?.orgId,
        }],
        queryFn: () => feedbackService.getAllForms({
            search:searchQuery != null || searchQuery !== "" ? searchQuery : null,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            orgId: user?.orgId,
        }),
    })

    const forms = data?.data || []

    return (
        <Box
            sx={{
                width: '75vw',
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 3,
                    pt: 2,
                    pb: 1,
                    flexShrink: 0,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Feedback Forms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your feedback forms
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Toggle Filters">
                        <IconButton onClick={() => setShowFilters(!showFilters)}>
                            <FilterIcon color={showFilters ? 'primary' : 'default'} />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="outlined"
                        startIcon={<TemplateIcon />}
                        onClick={() => setCloneDialogOpen(true)}
                    >
                        Use Template
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/feedback/forms/create')}
                    >
                        Create Form
                    </Button>
                </Box>
            </Box>

            {/* Filters & Search */}
            {showFilters && (
                <Box
                    sx={{
                        px: 3,
                        pb: 2,
                        flexShrink: 0,
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search forms by name or description..."
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
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(e, newMode) => newMode && setViewMode(newMode)}
                            size="small"
                        >
                            <ToggleButton value={VIEW_MODES.GRID}>
                                <GridIcon fontSize="small" />
                            </ToggleButton>
                            <ToggleButton value={VIEW_MODES.LIST}>
                                <ListIcon fontSize="small" />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Status Filters */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label="All Status"
                            onClick={() => setStatusFilter('all')}
                            color={statusFilter === 'all' ? 'primary' : 'default'}
                            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                        />
                        {Object.values(FORM_STATUS).map((status) => (
                            <Chip
                                key={status.value}
                                label={`${status.icon} ${status.label}`}
                                onClick={() => setStatusFilter(status.value)}
                                color={statusFilter === status.value ? status.color : 'default'}
                                variant={statusFilter === status.value ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Forms List */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
                <FormList
                    forms={forms}
                    loading={isLoading}
                    viewMode={viewMode}
                    onRefresh={refetch}
                />
            </Box>

            {/* Clone Template Dialog */}
            <CloneTemplateDialog
                open={cloneDialogOpen}
                onClose={() => setCloneDialogOpen(false)}
                onSuccess={() => {
                    setCloneDialogOpen(false)
                    refetch()
                }}
            />
        </Box>
    )
}
