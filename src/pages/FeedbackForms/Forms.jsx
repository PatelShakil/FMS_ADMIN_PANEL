import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'

export const Forms = () => {
    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Forms Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create and manage feedback forms
            </Typography>

            <Card>
                <CardContent>
                    <Typography variant="body1" color="text.secondary">
                        Forms builder and management coming next...
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}
