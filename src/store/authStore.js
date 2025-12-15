import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            accessToken: null,
            refreshToken: null,
            user: null,
            role: null, // PLATFORM_ADMIN, ORG_OWNER, ORG_ADMIN, DISTRIBUTOR

            // Actions
            setTokens: (accessToken, refreshToken) => {
                set({ accessToken, refreshToken })
            },

            setUser: (user) => {
                set({
                    user,
                    role: user?.roles?.[0] || null
                })
            },

            login: (accessToken, refreshToken, user) => {
                set({
                    accessToken,
                    refreshToken,
                    user,
                    role: user?.roles?.[0] || null,
                })
            },

            logout: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    role: null
                })
                localStorage.clear()
            },

            // Permission helpers
            isPlatformAdmin: () => get().role === 'PLATFORM_ADMIN',
            isOrgOwner: () => get().role === 'ORG_OWNER',
            isOrgAdmin: () => get().role === 'ORG_ADMIN',
            isDistributor: () => get().role === 'DISTRIBUTOR',

            hasPermission: (requiredRoles) => {
                const currentRole = get().role
                return requiredRoles.includes(currentRole)
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                user: state.user,
                role: state.role,
            }),
        }
    )
)
