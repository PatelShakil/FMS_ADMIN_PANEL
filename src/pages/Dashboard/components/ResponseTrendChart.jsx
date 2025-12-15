import React, { useMemo } from 'react'
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'

export const ResponseTrendChart = ({ data, loading }) => {
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data)) return []

        return data.map((item) => ({
            date: format(parseISO(item.date), 'MMM dd'),
            responses: item.count || 0,
            resolved: item.resolved || 0,
        }))
    }, [data])

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={300} />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Response Trends (Last 7 Days)
                </Typography>

                <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="responses"
                                stroke="#1976d2"
                                strokeWidth={2}
                                name="Total Responses"
                            />
                            <Line
                                type="monotone"
                                dataKey="resolved"
                                stroke="#2e7d32"
                                strokeWidth={2}
                                name="Resolved"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    )
}
