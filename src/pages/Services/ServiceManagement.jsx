import React, { useEffect, useState } from 'react'
import { Box, Typography, Tabs, Tab, Button, IconButton, Tooltip } from '@mui/material'
import {
    AccountTree as TreeIcon,
    ViewList as ListIcon,
    ViewModule as GridIcon,
    ViewKanban as KanbanIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    FileDownload as ExportIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { serviceService } from '../../api/services/serviceService'
import { VIEW_MODES } from './constants/serviceConstants'

// View Components
import { ServiceTreeView } from './views/ServiceTreeView'
import { ServiceListView } from './views/ServiceListView'
import { ServiceGridView } from './views/ServiceGridView'
import { ServiceKanbanView } from './views/ServiceKanbanView'
import { AddServiceDialog } from './components/AddServiceDialog'

export const ServicesManagement = () => {
    const { user } = useAuthStore()
    const [viewMode, setViewMode] = useState(VIEW_MODES.TREE)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [selectedParentId, setSelectedParentId] = useState(null)

    // Fetch service tree
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['service-tree', user?.orgId],
        queryFn: () => serviceService.getServiceTree(user.orgId),
    })

    useEffect(() => {
        console.log('Service Tree Data:', data)
    }, [data])

    const handleViewChange = (event, newView) => {
        if (newView) setViewMode(newView)
    }

    const handleAddService = (parentId = null) => {
        setSelectedParentId(parentId)
        setAddDialogOpen(true)
    }

    const handleExport = () => {
        console.log('Export:', viewMode)
    }

    const viewTabs = [
        { value: VIEW_MODES.TREE, label: 'Tree View', icon: <TreeIcon /> },
        { value: VIEW_MODES.LIST, label: 'List View', icon: <ListIcon /> },
        { value: VIEW_MODES.GRID, label: 'Grid View', icon: <GridIcon /> },
        { value: VIEW_MODES.KANBAN, label: 'Kanban View', icon: <KanbanIcon /> },
    ]

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%', // Takes full height from parent
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
                        Services Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your organization's service hierarchy
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export">
                        <IconButton onClick={handleExport}>
                            <ExportIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddService()}
                    >
                        Add Service
                    </Button>
                </Box>
            </Box>

            {/* View Mode Tabs */}
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    px: 3,
                    flexShrink: 0,
                }}
            >
                <Tabs value={viewMode} onChange={handleViewChange}>
                    {viewTabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            icon={tab.icon}
                            label={tab.label}
                            iconPosition="start"
                            sx={{ minHeight: 48 }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* View Content - Takes remaining space */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {viewMode === VIEW_MODES.TREE && (
                    <ServiceTreeView
                        data={data}
                        loading={isLoading}
                        onAddService={handleAddService}
                        onRefresh={refetch}
                    />
                )}
                {viewMode === VIEW_MODES.LIST && (
                    <ServiceListView
                        data={data}
                        loading={isLoading}
                        onAddService={handleAddService}
                        onRefresh={refetch}
                    />
                )}
                {viewMode === VIEW_MODES.GRID && (
                    <ServiceGridView
                        data={data}
                        loading={isLoading}
                        onAddService={handleAddService}
                        onRefresh={refetch}
                    />
                )}
                {viewMode === VIEW_MODES.KANBAN && (
                    <ServiceKanbanView
                        data={data}
                        loading={isLoading}
                        onAddService={handleAddService}
                        onRefresh={refetch}
                    />
                )}
            </Box>

            {/* Add Service Dialog */}
            <AddServiceDialog
                open={addDialogOpen}
                onClose={() => {
                    setAddDialogOpen(false)
                    setSelectedParentId(null)
                }}
                parentServiceId={selectedParentId}
                onSuccess={() => {
                    refetch()
                    setAddDialogOpen(false)
                    setSelectedParentId(null)
                }}
            />
        </Box>
    )
}
