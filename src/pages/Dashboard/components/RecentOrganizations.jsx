import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Button,
} from '@mui/material'
import { Visibility as ViewIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material'

const STATUS_COLORS = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
}

export const RecentOrganizations = ({ data }) => {
    const navigate = useNavigate()

    // Show only recent 5
    const recentOrgs = data?.slice(0, 5) || []

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Recent Organizations
                    </Typography>
                    <Button
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/organizations')}
                        size="small"
                    >
                        View All
                    </Button>
                </Box>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentOrgs.length > 0 ? (
                                recentOrgs.map((org) => (
                                    <TableRow key={org.orgId} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {org.orgName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{org.orgType}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">
                                                {org.city}, {org.state}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={org.status}
                                                size="small"
                                                color={STATUS_COLORS[org.status]}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/organizations/${org.id}`)}
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No organizations yet
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}
