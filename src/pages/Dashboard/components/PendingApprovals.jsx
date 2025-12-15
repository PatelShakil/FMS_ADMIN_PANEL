import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    Typography,
    Box,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material'
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orgService } from '../../../api/services/orgService'
import toast from 'react-hot-toast'

export const PendingApprovals = ({ data }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const approveMutation = useMutation({
        mutationFn: (orgId) => orgService.approveOrg(orgId),
        onSuccess: () => {
            toast.success('Organization approved successfully')
            queryClient.invalidateQueries(['all-organizations'])
            queryClient.invalidateQueries(['pending-organizations'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to approve organization')
        },
    })

    const rejectMutation = useMutation({
        mutationFn: (orgId) => orgService.rejectOrg(orgId),
        onSuccess: () => {
            toast.success('Organization rejected')
            queryClient.invalidateQueries(['all-organizations'])
            queryClient.invalidateQueries(['pending-organizations'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject organization')
        },
    })

    const handleApprove = (orgId) => {
        if (window.confirm('Are you sure you want to approve this organization?')) {
            approveMutation.mutate(orgId)
        }
    }

    const handleReject = (orgId) => {
        if (window.confirm('Are you sure you want to reject this organization?')) {
            rejectMutation.mutate(orgId)
        }
    }

    if (!data || data.length === 0) {
        return null
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Alert severity="warning" sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                            {data.length} organization{data.length > 1 ? 's' : ''} pending approval
                        </Typography>
                    </Alert>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Organization Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Owner</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Registered</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((org) => (
                                <TableRow key={org.orgId} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {org.orgName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {org.orgEmail}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={org.orgType} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{org.ownerName || 'N/A'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {org.city}, {org.state}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(org.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="View Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/organizations/${org.orgId}`)}
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Approve">
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => handleApprove(org.orgId)}
                                                disabled={approveMutation.isLoading}
                                            >
                                                <ApproveIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleReject(org.orgId)}
                                                disabled={rejectMutation.isLoading}
                                            >
                                                <RejectIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}
