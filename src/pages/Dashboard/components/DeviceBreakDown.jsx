import React, {useEffect} from 'react'
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0']

export const DeviceBreakdown = ({ data, loading }) => {

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
                    <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
                </CardContent>
            </Card>
        )
    }


    const chartData = data
        ? Object.entries(data).map(([platform, obj]) => ({
            name: obj.platform.charAt(0).toUpperCase() + obj.platform.slice(1),
            value:obj.count,
        }))
        : []

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Device Breakdown
                </Typography>

                {chartData.length > 0 ? (
                    <Box sx={{ width: '100%', height: 250, mt: 2 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No data available
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}
