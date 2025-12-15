import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Box,
} from '@mui/material'
import { Visibility as VisibilityIcon } from '@mui/icons-material'

export const TopFormsTable = ({ data }) => {
    const navigate = useNavigate()

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Top Forms by Responses
                </Typography>

                <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Form Name</TableCell>
                                <TableCell align="right">Responses</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((form) => (
                                    <TableRow key={form.formId} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {form.formName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight={600}>
                                                {form.responseCount || 0}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={form.status}
                                                size="small"
                                                color={form.status === 'ACTIVE' ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/feedback/forms`)}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            No forms available
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
