export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.16:8000',
    TIMEOUT: 30000,
    CITIZEN_PORTAL:import.meta.env.VITE_API_CITIZEN_PORTAL_URL || 'http://192.168.1.16:5174',

    // Service Paths (Kong Routes)
    SERVICES: {
        AUTH: '/auth',
        ORG: '/org',
        SERVICE: '/services',
        FORMS: '/forms',
        TEMPLATES: '/templates',
        QR: '/qr',
        RESPONSES: '/responses',
        EXPORT: '/export',
        ANALYTICS: '/analytics',
        NOTIFICATIONS: '/notifications',
        PREFERENCES: '/preferences',
        WEBHOOK: '/webhook',
    },

    // MinIO Configuration
    MINIO: {
        ENDPOINT: import.meta.env.VITE_MINIO_ENDPOINT || 'http://localhost:9000',
        BUCKET: 'feedback-templates',
    }
}
