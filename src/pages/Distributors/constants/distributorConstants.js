// Distributor Status
export const DISTRIBUTOR_STATUS = {
    ACTIVE: {
        value: 'ACTIVE',
        label: 'Active',
        color: 'success',
        icon: '✅',
    },
    INACTIVE: {
        value: 'INACTIVE',
        label: 'Inactive',
        color: 'error',
        icon: '❌',
    },
    PENDING: {
        value: 'PENDING',
        label: 'Pending Verification',
        color: 'warning',
        icon: '⏳',
    },
}

// View Modes
export const VIEW_MODES = {
    LIST: 'list',
    GRID: 'grid',
}

// Sort Options
export const SORT_OPTIONS = {
    NAME_ASC: { value: 'name_asc', label: 'Name (A-Z)' },
    NAME_DESC: { value: 'name_desc', label: 'Name (Z-A)' },
    CREATED_DESC: { value: 'created_desc', label: 'Newest First' },
    CREATED_ASC: { value: 'created_asc', label: 'Oldest First' },
    QR_COUNT_DESC: { value: 'qr_desc', label: 'Most QR Codes' },
}
