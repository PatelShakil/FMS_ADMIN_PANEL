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
    Stack,
} from '@mui/material'
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    ViewModule as GridIcon,
    ViewList as ListIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { feedbackService } from '../../../api/services/feedbackService'
import { VIEW_MODES, TEMPLATE_CATEGORIES } from '../constants/formConstants'
import { TemplateGallery } from '../components/TemplateGallery/TemplateGallery'
import { CreateTemplateDialog } from '../components/TemplateGallery/CreateTemplateDialog'
import toast from 'react-hot-toast'

export const TemplateManagement = () => {
    const [viewMode, setViewMode] = useState(VIEW_MODES.GRID)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [showFilters, setShowFilters] = useState(true)

    // Fetch templates
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['templates', { search: searchQuery, category: selectedCategory !== 'all' ? selectedCategory : undefined }],
        queryFn: () => feedbackService.getAllTemplates({
            search: searchQuery ? searchQuery : undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            isActive:true,
            page : 1 ,
            pageSize: 20,
            sortBy:"createdAt",
            sortOrder:"desc"
        }),
    })

    const templates = data?.data || []

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
    }

    const handleCreateSuccess = () => {
        toast.success('Template created successfully!')
        refetch()
        setCreateDialogOpen(false)
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
                        Template Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Create and manage feedback form templates
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
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        Create Template
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
                    <Stack spacing={2}>
                        {/* Search */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search templates by name or description..."
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

                        {/* Category Filters */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label="All Categories"
                                onClick={() => handleCategoryChange('all')}
                                color={selectedCategory === 'all' ? 'primary' : 'default'}
                                variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                            />
                            {Object.values(TEMPLATE_CATEGORIES).map((category) => (
                                <Chip
                                    key={category.value}
                                    label={`${category.icon} ${category.label}`}
                                    onClick={() => handleCategoryChange(category.value)}
                                    color={selectedCategory === category.value ? 'primary' : 'default'}
                                    variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                                    sx={{
                                        '&.MuiChip-filled': {
                                            bgcolor: category.color,
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: category.color,
                                                filter: 'brightness(0.9)',
                                            },
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Stack>
                </Box>
            )}

            {/* Template Gallery */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 3 }}>
                <TemplateGallery
                    templates={templates}
                    loading={isLoading}
                    viewMode={viewMode}
                    onRefresh={refetch}
                />
            </Box>

            {/* Create Template Dialog */}
            <CreateTemplateDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </Box>
    )
}
