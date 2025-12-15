import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const OrgActivityChart = ({ stats }) => {
    const chartData = [
        {
            name: 'Team',
            Total: stats.totalAdmins,
            Active: stats.activeAdmins,
        },
        {
            name: 'Forms',
            Total: stats.totalForms,
            Active: stats.totalForms,
        },
        {
            name: 'Responses',
            Total: stats.totalResponses,
            Pending: stats.pendingResponses,
        },
    ]

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Organization Activity
                </Typography>

                <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Total" fill="#1976d2" />
                            <Bar dataKey="Active" fill="#2e7d32" />
                            <Bar dataKey="Pending" fill="#ed6c02" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    )
}
