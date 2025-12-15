import React, { useMemo } from 'react'
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useThemeStore } from '../store/themeStore'

export const ThemeProvider = ({ children }) => {
    const { mode, getCurrentColors } = useThemeStore()
    const colors = getCurrentColors()

    const theme = useMemo(() => {
        const isDark = mode === 'dark'

        return createTheme({
            palette: {
                mode: mode,
                primary: {
                    main: colors.primary,
                },
                secondary: {
                    main: colors.secondary,
                },
                success: {
                    main: colors.success,
                },
                error: {
                    main: colors.error,
                },
                warning: {
                    main: colors.warning,
                },
                info: {
                    main: colors.info,
                },
                background: {
                    default: isDark ? colors.background : '#fafafa',
                    paper: colors.paper,
                },
                text: {
                    primary: colors.text,
                    secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                },
            },
            typography: {
                fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ].join(','),
                h1: {
                    fontWeight: 600,
                },
                h2: {
                    fontWeight: 600,
                },
                h3: {
                    fontWeight: 600,
                },
            },
            shape: {
                borderRadius: 8,
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: 'none',
                            fontWeight: 500,
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            boxShadow: isDark
                                ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                                : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        },
                    },
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            boxShadow: isDark
                                ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                                : '0 2px 4px rgba(0, 0, 0, 0.1)',
                        },
                    },
                },
            },
        })
    }, [mode, colors])

    return (
        <MUIThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MUIThemeProvider>
    )
}
