// QR Code Statuses
export const QR_STATUS = {
    GENERATED: {
        value: 'GENERATED',
        label: 'Generated',
        color: 'default',
        icon: '📋',
        description: 'QR code has been generated',
    },
    ASSIGNED: {
        value: 'ASSIGNED',
        label: 'Assigned',
        color: 'info',
        icon: '👤',
        description: 'Assigned to distributor',
    },
    ACCEPTED: {
        value: 'ACCEPTED',
        label: 'Accepted',
        color: 'primary',
        icon: '✅',
        description: 'Distributor accepted assignment',
    },
    DEPLOYED: {
        value: 'DEPLOYED',
        label: 'Deployed',
        color: 'warning',
        icon: '📍',
        description: 'Awaiting deployment approval',
    },
    ACTIVE: {
        value: 'ACTIVE',
        label: 'Active',
        color: 'success',
        icon: '🟢',
        description: 'QR code is active and scannable',
    },
    INACTIVE: {
        value: 'INACTIVE',
        label: 'Inactive',
        color: 'error',
        icon: '🔴',
        description: 'QR code is inactive',
    },
    REJECTED: {
        value: 'REJECTED',
        label: 'Rejected',
        color: 'error',
        icon: '❌',
        description: 'Assignment rejected by distributor',
    },
}

// View Modes
export const VIEW_MODES = {
    LIST: 'list',
    GRID: 'grid',
}

// Deployment Status
export const DEPLOYMENT_STATUS = {
    PENDING: {
        value: 'PENDING',
        label: 'Pending Approval',
        color: 'warning',
        icon: '⏳',
    },
    APPROVED: {
        value: 'APPROVED',
        label: 'Approved',
        color: 'success',
        icon: '✅',
    },
    REJECTED: {
        value: 'REJECTED',
        label: 'Rejected',
        color: 'error',
        icon: '❌',
    },
}

// Message Types
export const MESSAGE_SENDER_TYPE = {
    ADMIN: 'ADMIN',
    DISTRIBUTOR: 'DISTRIBUTOR',
}

// Analytics Time Ranges
export const ANALYTICS_TIME_RANGES = {
    WEEK: { value: 7, label: 'Last 7 Days' },
    TWO_WEEKS: { value: 14, label: 'Last 14 Days' },
    MONTH: { value: 30, label: 'Last 30 Days' },
    THREE_MONTHS: { value: 90, label: 'Last 90 Days' },
}

// Device Types for Analytics
export const DEVICE_TYPES = {
    MOBILE: { label: 'Mobile', color: '#4caf50', icon: '📱' },
    TABLET: { label: 'Tablet', color: '#2196f3', icon: '💻' },
    DESKTOP: { label: 'Desktop', color: '#ff9800', icon: '🖥️' },
}

// Polling Intervals (milliseconds)
export const POLLING_INTERVALS = {
    MESSAGES: 30000, // 30 seconds
    QR_STATUS: 60000, // 1 minute
    ANALYTICS: 300000, // 5 minutes
}
