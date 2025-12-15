import React, { useState } from 'react'
import {
    Drawer,
    IconButton,
    Box,
    Typography,
    Divider,
    Grid,
    Card,
    CardActionArea,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Stack,
    Chip,
    Tooltip,
} from '@mui/material'
import {
    Palette as PaletteIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon,
    CheckCircle as CheckCircleIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
} from '@mui/icons-material'
import { useThemeStore, THEME_PRESETS } from '../../store/themeStore'

export const ThemeCustomizer = () => {
    const [open, setOpen] = useState(false)
    const [showColorPicker, setShowColorPicker] = useState(false)

    const {
        mode,
        activePreset,
        customColors,
        setMode,
        toggleMode,
        setPreset,
        updateColor,
        resetTheme,
        getCurrentColors
    } = useThemeStore()

    const currentColors = getCurrentColors()

    const handleToggle = () => setOpen(!open)

    const colorFields = [
        { key: 'primary', label: 'Primary Color' },
        { key: 'secondary', label: 'Secondary Color' },
        { key: 'success', label: 'Success Color' },
        { key: 'error', label: 'Error Color' },
        { key: 'warning', label: 'Warning Color' },
        { key: 'info', label: 'Info Color' },
    ]

    return (
        <>
            {/* Floating Button */}
            <Tooltip title="Customize Theme" placement="left">
                <IconButton
                    onClick={handleToggle}
                    sx={{
                        position: 'fixed',
                        right: 20,
                        bottom: 20,
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 56,
                        height: 56,
                        boxShadow: 3,
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                        zIndex: 1000,
                    }}
                >
                    <PaletteIcon />
                </IconButton>
            </Tooltip>

            {/* Theme Customizer Drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={handleToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '100%', sm: 400 },
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                            Theme Customization
                        </Typography>
                        <IconButton onClick={handleToggle} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Dark/Light Mode Toggle */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Theme Mode
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={mode === 'dark'}
                                    onChange={toggleMode}
                                    icon={<LightModeIcon />}
                                    checkedIcon={<DarkModeIcon />}
                                />
                            }
                            label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Preset Themes */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Preset Themes
                        </Typography>
                        <Grid container spacing={1.5}>
                            {Object.values(THEME_PRESETS).map((preset) => (
                                <Grid item xs={6} key={preset.id}>
                                    <Card
                                        sx={{
                                            border: activePreset === preset.id ? 2 : 1,
                                            borderColor: activePreset === preset.id ? 'primary.main' : 'divider',
                                            position: 'relative',
                                        }}
                                    >
                                        <CardActionArea onClick={() => setPreset(preset.id)}>
                                            <Box sx={{ p: 1.5 }}>
                                                <Typography variant="body2" fontWeight={500} gutterBottom>
                                                    {preset.name}
                                                </Typography>
                                                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                                    {['primary', 'secondary', 'success'].map((colorKey) => (
                                                        <Box
                                                            key={colorKey}
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: 0.5,
                                                                bgcolor: preset.colors[colorKey],
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </CardActionArea>
                                        {activePreset === preset.id && (
                                            <CheckCircleIcon
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    color: 'primary.main',
                                                    fontSize: 20,
                                                }}
                                            />
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Custom Colors */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Custom Colors
                            </Typography>
                            {customColors && (
                                <Chip
                                    label="Custom"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>

                        <Stack spacing={2}>
                            {colorFields.map((field) => (
                                <Box key={field.key}>
                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                        {field.label}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <TextField
                                            type="color"
                                            value={currentColors[field.key]}
                                            onChange={(e) => updateColor(field.key, e.target.value)}
                                            size="small"
                                            sx={{ width: 60 }}
                                        />
                                        <TextField
                                            value={currentColors[field.key]}
                                            onChange={(e) => updateColor(field.key, e.target.value)}
                                            size="small"
                                            fullWidth
                                            placeholder="#000000"
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Preview */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Preview
                        </Typography>
                        <Stack spacing={1}>
                            <Button variant="contained" fullWidth>
                                Primary Button
                            </Button>
                            <Button variant="contained" color="secondary" fullWidth>
                                Secondary Button
                            </Button>
                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" color="success" size="small" fullWidth>
                                    Success
                                </Button>
                                <Button variant="outlined" color="error" size="small" fullWidth>
                                    Error
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Reset Button */}
                    <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        startIcon={<RefreshIcon />}
                        onClick={resetTheme}
                    >
                        Reset to Default
                    </Button>
                </Box>
            </Drawer>
        </>
    )
}
