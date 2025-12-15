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
    Avatar,
    IconButton,
    Button,
} from '@mui/material'
import {
    Visibility as ViewIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'

const STATUS_COLORS = {
    ACTIVE: 'success',
    INACTIVE: 'default',
    SUSPENDED: 'error',
}

export const TeamMembersList = ({ data }) => {
    const navigate = useNavigate()

    // Show only recent 5
    const recentMembers = data?.slice(0, 5) || []

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Team Members
                    </Typography>
                    <Button
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/team')}
                        size="small"
                    >
                        View All
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Joined</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentMembers.length > 0 ? (
                                recentMembers.map((member) => (
                                    <TableRow key={member.userId} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                    {member.fullName?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {member.fullName}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{member.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                member.userRoles.map((r) => (
                                                    <Chip label={r.role.roleName} size="small" variant="outlined" className={"mr-1"} />
                                                ))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={member.accountStatus}
                                                size="small"
                                                color={STATUS_COLORS[member.accountStatus]}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(member.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/team/${member.id}`)}
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No team members yet. Invite admins to get started.
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
