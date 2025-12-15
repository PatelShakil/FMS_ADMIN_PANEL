import React, { useCallback, useEffect, useState, useMemo } from 'react'
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
    Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    useTheme,
    useMediaQuery,
    Fab,
    Typography,
} from '@mui/material'
import {
    Search as SearchIcon,
    FitScreen as FitScreenIcon,
    Add as AddIcon,
} from '@mui/icons-material'
import { CustomServiceNode } from '../components/CustomServiceNode'
import { ServiceDetailsDrawer } from '../components/ServiceDetailsDrawer'

const nodeTypes = { serviceNode: CustomServiceNode }

export const ServiceTreeView = ({ data, loading, onAddService, onRefresh }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedNode, setSelectedNode] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [reactFlowInstance, setReactFlowInstance] = useState(null)

    // Build tree structure from hierarchical data
    const buildTreeStructure = useCallback((services, parentX = 0, parentY = 0, level = 0, index = 0) => {
        if (!services || services.length === 0) return { nodes: [], edges: [] }

        const nodeList = []
        const edgeList = []

        services.forEach((service, idx) => {
            // FIX: Use 'id' from API response, not 'serviceId'
            const nodeId = service.id.toString()
            const x = level === 0 ? idx * 350 : parentX + (idx - services.length / 2) * 300
            const y = level * 250

            // Add node
            nodeList.push({
                id: nodeId,
                type: 'serviceNode',
                position: { x, y },
                data: {
                    ...service,
                    serviceId: service.id, // Map id to serviceId for consistency
                    label: service.serviceName,
                    hasChildren: service.children && service.children.length > 0,
                    onAddChild: () => onAddService(service.id),
                    onView: () => handleViewDetails(service),
                },
            })

            // Process children recursively
            if (service.children && service.children.length > 0) {
                const childResult = buildTreeStructure(
                    service.children,
                    x,
                    y + 250,
                    level + 1,
                    idx
                )

                nodeList.push(...childResult.nodes)
                edgeList.push(...childResult.edges)

                // Add edges to children
                service.children.forEach((child) => {
                    edgeList.push({
                        id: `${nodeId}-${child.id}`,
                        source: nodeId,
                        target: child.id.toString(),
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: theme.palette.primary.main, strokeWidth: 2 },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: theme.palette.primary.main,
                        },
                    })
                })
            }
        })

        return { nodes: nodeList, edges: edgeList }
    }, [theme, onAddService])

    const handleViewDetails = (service) => {
        // Map 'id' to 'serviceId' for drawer
        setSelectedNode({ ...service, serviceId: service.id })
        setDrawerOpen(true)
    }

    // Update nodes and edges when data changes
    useEffect(() => {
        if (data && data.length > 0) {
            const { nodes: newNodes, edges: newEdges } = buildTreeStructure(data)
            setNodes(newNodes)
            setEdges(newEdges)
        }
    }, [data, buildTreeStructure, setNodes, setEdges])

    const handleNodeClick = useCallback((event, node) => {
        handleViewDetails(node.data)
    }, [])

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    // Search functionality
    const filteredNodes = useMemo(() => {
        if (!searchQuery) return nodes

        const query = searchQuery.toLowerCase()
        return nodes.filter(node =>
            node.data.serviceName?.toLowerCase().includes(query) ||
            node.data.serviceCode?.toLowerCase().includes(query) ||
            node.data.slug?.toLowerCase().includes(query)
        )
    }, [nodes, searchQuery])

    // Fit view
    const handleFitView = () => {
        if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.2, duration: 800 })
        }
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
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',width:"100%", height: '100%', gap: 2 }}>
                <Typography variant="h6" color="text.secondary">
                    No services found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start by creating your first service
                </Typography>
                <IconButton
                    color="primary"
                    size="large"
                    onClick={() => onAddService()}
                    sx={{
                        mt: 2,
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
        <Box sx={{ width: '100%', height: '70vh', position: 'relative' }}>
            <ReactFlow
                nodes={filteredNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{
                    animated: true,
                    style: { strokeWidth: 2 },
                }}
                style={{
                    background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fafafa',
                }}
            >
                <Background
                    gap={16}
                    size={1}
                    color={theme.palette.mode === 'dark' ? '#444' : '#ddd'}
                />
                <Controls
                    style={{
                        button: {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.divider,
                        },
                    }}
                />
                <MiniMap
                    nodeColor={(node) => node.data.serviceType ?
                        theme.palette.primary.main : theme.palette.grey[400]
                    }
                    style={{
                        backgroundColor: theme.palette.background.paper,
                    }}
                />

                {/* Search Panel */}
                <Panel position="top-left" style={{ margin: 10 }}>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 3,
                            p: 1,
                        }}
                    >
                        <TextField
                            size="small"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: isMobile ? 200 : 300 }}
                        />
                    </Box>
                </Panel>

                {/* Stats Panel */}
                <Panel position="top-right" style={{ margin: 10 }}>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 3,
                            p: 1.5,
                            display: 'flex',
                            gap: 1,
                        }}
                    >
                        <Chip
                            label={`Total: ${nodes.length || 0}`}
                            size="small"
                            color="primary"
                        />
                        <Chip
                            label={`Active: ${nodes.filter(n => n.data.status === 'ACTIVE').length || 0}`}
                            size="small"
                            color="success"
                        />
                    </Box>
                </Panel>

                {/* Fit View Button */}
                <Panel position="bottom-right" style={{ margin: 10 }}>
                    <IconButton
                        onClick={handleFitView}
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 3,
                            '&:hover': { bgcolor: 'background.paper' },
                        }}
                    >
                        <FitScreenIcon />
                    </IconButton>
                </Panel>
            </ReactFlow>

            {/* Mobile FAB */}
            {isMobile && (
                <Fab
                    color="primary"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    onClick={() => onAddService()}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Service Details Drawer */}
            <ServiceDetailsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                service={selectedNode}
                onUpdate={() => {
                    onRefresh()
                    setDrawerOpen(false)
                }}
            />
        </Box>
    )
}
