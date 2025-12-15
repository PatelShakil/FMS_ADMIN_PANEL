export const SERVICE_TYPES = {
    DEPARTMENT: {
        value: 'DEPARTMENT',
        label: 'Department',
        color: '#1976d2',
        icon: 'business',
    },
    DIVISION: {
        value: 'DIVISION',
        label: 'Division',
        color: '#2e7d32',
        icon: 'category',
    },
    BRANCH: {
        value: 'BRANCH',
        label: 'Branch',
        color: '#9c27b0',
        icon: 'account_tree',
    },
    LOCATION: {
        value: 'LOCATION',
        label: 'Location',
        color: '#ed6c02',
        icon: 'location_on',
    },
    FACILITY: {
        value: 'FACILITY',
        label: 'Facility',
        color: '#0288d1',
        icon: 'apartment',
    },
    EQUIPMENT: {
        value: 'EQUIPMENT',
        label: 'Equipment',
        color: '#d32f2f',
        icon: 'settings',
    },
    OTHER: {
        value: 'OTHER',
        label: 'Other',
        color: '#757575',
        icon: 'label',
    },
}

export const SERVICE_STATUS = {
    ACTIVE: { value: 'ACTIVE', label: 'Active', color: 'success' },
    INACTIVE: { value: 'INACTIVE', label: 'Inactive', color: 'default' },
    UNDER_MAINTENANCE: { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance', color: 'warning' },
    TEMPORARILY_CLOSED: { value: 'TEMPORARILY_CLOSED', label: 'Temporarily Closed', color: 'error' },
}

export const VIEW_MODES = {
    TREE: 'tree',
    LIST: 'list',
    GRID: 'grid',
    KANBAN: 'kanban',
}
