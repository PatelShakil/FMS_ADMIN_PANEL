import React from 'react'
import { ThemeProvider } from './theme/ThemeProvider'
import { ThemeCustomizer } from './components/ThemeCustomizer/ThemeCustomizer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { AuthGuard } from './components/Auth/ProtectedRoute'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <AuthGuard>
                        <AppRoutes />
                        <ThemeCustomizer />
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                },
                            }}
                        />
                    </AuthGuard>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App
