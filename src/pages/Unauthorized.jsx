import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, Typography, Button } from '@mui/material'
import { Block as BlockIcon } from '@mui/icons-material'

export const Unauthorized = () => {
    const navigate = useNavigate()

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h3" fontWeight={600} gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    You don't have permission to access this page.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
            </Box>
        </Container>
    )
}
