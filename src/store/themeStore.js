import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Predefined theme presets
export const THEME_PRESETS = {
    default: {
        id: 'default',
        name: 'BoloIndia Default',
        colors: {
            primary: '#1976d2',      // Blue
            secondary: '#dc004e',    // Pink
            success: '#2e7d32',      // Green
            error: '#d32f2f',        // Red
            warning: '#ed6c02',      // Orange
            info: '#0288d1',         // Light Blue
            background: '#ffffff',   // White
            paper: '#f5f5f5',        // Light Gray
            text: '#000000',         // Black
        }
    },
    government: {
        id: 'government',
        name: 'Government Blue',
        colors: {
            primary: '#0d47a1',      // Dark Blue
            secondary: '#ff6f00',    // Deep Orange
            success: '#1b5e20',      // Dark Green
            error: '#b71c1c',        // Dark Red
            warning: '#e65100',      // Deep Orange
            info: '#01579b',         // Deep Blue
            background: '#ffffff',
            paper: '#f5f5f5',
            text: '#000000',
        }
    },
    corporate: {
        id: 'corporate',
        name: 'Corporate Gray',
        colors: {
            primary: '#37474f',      // Blue Gray
            secondary: '#00bcd4',    // Cyan
            success: '#4caf50',      // Green
            error: '#f44336',        // Red
            warning: '#ff9800',      // Orange
            info: '#2196f3',         // Blue
            background: '#ffffff',
            paper: '#eceff1',
            text: '#263238',
        }
    },
    nature: {
        id: 'nature',
        name: 'Nature Green',
        colors: {
            primary: '#2e7d32',      // Green
            secondary: '#558b2f',    // Light Green
            success: '#388e3c',      // Green
            error: '#d32f2f',        // Red
            warning: '#f57c00',      // Orange
            info: '#0288d1',         // Blue
            background: '#ffffff',
            paper: '#f1f8e9',        // Light Green
            text: '#1b5e20',
        }
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset Orange',
        colors: {
            primary: '#e64a19',      // Deep Orange
            secondary: '#ffa726',    // Orange
            success: '#66bb6a',      // Green
            error: '#ef5350',        // Red
            warning: '#ffa726',      // Orange
            info: '#42a5f5',         // Blue
            background: '#ffffff',
            paper: '#fff3e0',        // Light Orange
            text: '#bf360c',
        }
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Blue',
        colors: {
            primary: '#006064',      // Cyan Dark
            secondary: '#0097a7',    // Cyan
            success: '#00897b',      // Teal
            error: '#c62828',        // Red
            warning: '#f57f17',      // Yellow
            info: '#0277bd',         // Light Blue
            background: '#ffffff',
            paper: '#e0f7fa',        // Light Cyan
            text: '#004d40',
        }
    },
    purple: {
        id: 'purple',
        name: 'Royal Purple',
        colors: {
            primary: '#6a1b9a',      // Purple
            secondary: '#ab47bc',    // Purple
            success: '#388e3c',      // Green
            error: '#d32f2f',        // Red
            warning: '#f57c00',      // Orange
            info: '#1976d2',         // Blue
            background: '#ffffff',
            paper: '#f3e5f5',        // Light Purple
            text: '#4a148c',
        }
    },
    dark: {
        id: 'dark',
        name: 'Dark Mode',
        colors: {
            primary: '#90caf9',      // Light Blue
            secondary: '#f48fb1',    // Pink
            success: '#81c784',      // Light Green
            error: '#e57373',        // Light Red
            warning: '#ffb74d',      // Light Orange
            info: '#64b5f6',         // Light Blue
            background: '#121212',   // Dark
            paper: '#1e1e1e',        // Dark Gray
            text: '#ffffff',         // White
        }
    },
}

export const useThemeStore = create(
    persist(
        (set, get) => ({
            // Current theme mode
            mode: 'light', // 'light' or 'dark'

            // Current active preset
            activePreset: 'default',

            // Custom colors (overrides preset)
            customColors: null,

            // Get current theme colors
            getCurrentColors: () => {
                const { customColors, activePreset } = get()
                return customColors || THEME_PRESETS[activePreset].colors
            },

            // Set theme mode
            setMode: (mode) => {
                set({ mode })
            },

            // Toggle between light and dark
            toggleMode: () => {
                set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' }))
            },

            // Set preset theme
            setPreset: (presetId) => {
                if (THEME_PRESETS[presetId]) {
                    set({
                        activePreset: presetId,
                        customColors: null // Reset custom colors when preset is selected
                    })
                }
            },

            // Set custom colors
            setCustomColors: (colors) => {
                set({
                    customColors: colors,
                    activePreset: 'custom'
                })
            },

            // Update single color
            updateColor: (colorKey, colorValue) => {
                set((state) => ({
                    customColors: {
                        ...(state.customColors || state.getCurrentColors()),
                        [colorKey]: colorValue
                    },
                    activePreset: 'custom'
                }))
            },

            // Reset to default
            resetTheme: () => {
                set({
                    mode: 'light',
                    activePreset: 'default',
                    customColors: null
                })
            },
        }),
        {
            name: 'theme-storage',
        }
    )
)
