import React from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    FormControlLabel,
    Switch,
    Button,
} from '@mui/material'
import { useThemeStore, THEME_PRESETS } from '../../store/themeStore'

export const ThemeSettings = () => {
    const { mode, activePreset, toggleMode, setPreset, resetTheme } = useThemeStore()

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Theme Settings
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={mode === 'dark'}
                                onChange={toggleMode}
                            />
                        }
                        label="Dark Mode"
                    />
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                    Select Theme
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {Object.values(THEME_PRESETS).map((preset) => (
                        <Grid item xs={6} sm={4} key={preset.id}>
                            <Card
                                sx={{
                                    border: activePreset === preset.id ? 2 : 1,
                                    borderColor: activePreset === preset.id ? 'primary.main' : 'divider',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setPreset(preset.id)}
                            >
                                <CardContent>
                                    <Typography variant="body2" align="center">
                                        {preset.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1, justifyContent: 'center' }}>
                                        {['primary', 'secondary', 'success'].map((color) => (
                                            <Box
                                                key={color}
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 0.5,
                                                    bgcolor: preset.colors[color],
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Button variant="outlined" onClick={resetTheme}>
                    Reset to Default
                </Button>
            </CardContent>
        </Card>
    )
}
