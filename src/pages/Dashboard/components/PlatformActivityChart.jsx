import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#2e7d32', '#ed6c02', '#d32f2f']

export const PlatformActivityChart = ({ stats }) => {
    const chartData = [
        { name: 'Active', value: stats.activeOrganizations },
        { name: 'Pending', value: stats.pendingOrganizations },
        { name: 'Total Forms', value: stats.totalForms },
    ]

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Platform Overview
                </Typography>

                <Box sx={{ width: '100%', height: 250, mt: 2 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    )
}
