// pages/Responses/constants/statuses.js
export const RESPONSE_STATUS = {
    PENDING: 'PENDING',
    REVIEWED: 'REVIEWED',
    RESOLVED: 'RESOLVED',
    REJECTED: 'REJECTED'
}

export const STATUS_CONFIG = {
    PENDING: {
        label: 'Pending',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        dotColor: 'bg-yellow-400',
        icon: '⏳'
    },
    REVIEWED: {
        label: 'Reviewed',
        color: 'blue',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        dotColor: 'bg-blue-400',
        icon: '👁️'
    },
    RESOLVED: {
        label: 'Resolved',
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        dotColor: 'bg-green-400',
        icon: '✅'
    },
    REJECTED: {
        label: 'Rejected',
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        dotColor: 'bg-red-400',
        icon: '❌'
    }
}

export const STATUS_TRANSITIONS = {
    PENDING: ['REVIEWED', 'RESOLVED', 'REJECTED'],
    REVIEWED: ['RESOLVED', 'REJECTED'],
    RESOLVED: [],
    REJECTED: []
}
