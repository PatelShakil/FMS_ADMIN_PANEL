import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material'
import { VIEW_MODES } from '../../constants/distributorConstants'
import { DistributorCard } from './DistributorCard'
import { DistributorDetailsDialog } from '../DistributorDialogs/DistributorDetailsDialog'

export const DistributorList = ({ distributors, loading, viewMode, onRefresh }) => {
    const [selectedDistributor, setSelectedDistributor] = useState(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    const handleViewDetails = (distributor) => {
        setSelectedDistributor(distributor)
        setDetailsOpen(true)
    }

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (!distributors || distributors.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap: 2,
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No distributors found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Add your first distributor to get started
                </Typography>
            </Box>
        )
    }

    return (
        <>
            <Grid container spacing={3}>
                {distributors.map((distributor) => (
                    <Grid
                        item
                        xs={12}
                        sm={viewMode === VIEW_MODES.GRID ? 6 : 12}
                        md={viewMode === VIEW_MODES.GRID ? 4 : 12}
                        lg={viewMode === VIEW_MODES.GRID ? 3 : 12}
                        key={distributor.userId}
                    >
                        <DistributorCard
                            distributor={distributor}
                            viewMode={viewMode}
                            onViewDetails={handleViewDetails}
                            onRefresh={onRefresh}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Distributor Details Dialog */}
            <DistributorDetailsDialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                distributor={selectedDistributor}
                onRefresh={onRefresh}
            />
        </>
    )
}
