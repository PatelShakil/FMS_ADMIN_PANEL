// pages/Responses/constants/permissions.js
export const PERMISSIONS = {
    VIEW_RESPONSES: 'view_responses',
    UPDATE_STATUS: 'update_status',
    FLAG_RESPONSE: 'flag_response',
    DELETE_RESPONSE: 'delete_response',
    EXPORT_DATA: 'export_data',
    DOWNLOAD_ATTACHMENTS: 'download_attachments',
    BULK_ACTIONS: 'bulk_actions'
}

export const ROLE_PERMISSIONS = {
    PLATFORM_ADMIN: Object.values(PERMISSIONS),
    ORG_OWNER: Object.values(PERMISSIONS),
    ORG_ADMIN: [
        PERMISSIONS.VIEW_RESPONSES,
        PERMISSIONS.UPDATE_STATUS,
        PERMISSIONS.FLAG_RESPONSE,
        PERMISSIONS.EXPORT_DATA
    ]
}

export const hasPermission = (userRole, permission) => {
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}
