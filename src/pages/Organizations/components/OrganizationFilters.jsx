import React from 'react'
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Paper,
} from '@mui/material'

const ORG_TYPES = [
    'MUNICIPALITY',
    'NGO',
    'HOSPITAL',
    'SCHOOL',
    'COLLEGE',
    'GOVERNMENT_DEPT',
    'CORPORATION',
    'OTHER',
]

const STATES = [
    'Gujarat',
    'Maharashtra',
    'Karnataka',
    'Delhi',
    'Rajasthan',
    'Uttar Pradesh',
    'Tamil Nadu',
    'West Bengal',
    // Add more states as needed
]

export const OrganizationFilters = ({ filters, onChange }) => {
    const handleChange = (field) => (event) => {
        onChange({
            ...filters,
            [field]: event.target.value,
        })
    }

    return (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Organization Type"
                        value={filters.orgType}
                        onChange={handleChange('orgType')}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        {ORG_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type.replace('_', ' ')}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="State"
                        value={filters.state}
                        onChange={handleChange('state')}
                    >
                        <MenuItem value="">All States</MenuItem>
                        {STATES.map((state) => (
                            <MenuItem key={state} value={state}>
                                {state}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        size="small"
                        label="City"
                        value={filters.city}
                        onChange={handleChange('city')}
                        placeholder="Enter city name..."
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}
