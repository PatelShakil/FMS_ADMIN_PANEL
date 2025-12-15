import { API_CONFIG } from "../../config/api.config.js"
import axiosInstance from "../axiosInstance.js"

const BASE_PATH = `${API_CONFIG.SERVICES.QR}`

export const qrService = {
    // ========== QR CODE MANAGEMENT ==========

    /**
     * POST /api/qr/generate
     * Generate new QR code
     */
    generateQR: async (qrData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/generate`, qrData)
        return data
    },

    /**
     * GET /api/qr/{qrCodeId}
     * Get QR code by ID
     */
    getQRById: async (qrCodeId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${qrCodeId}`)
        return data
    },

    /**
     * PUT /api/qr/{qrCodeId}
     * Update QR code
     */
    updateQR: async (qrCodeId, updateData) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${qrCodeId}`, updateData)
        return data
    },

    /**
     * GET /api/qr/form/{formId}
     * Get all QR codes for a form
     */
    getQRByFormId: async (formId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/form/${formId}`)
        return data
    },

    /**
     * GET /api/qr/org/{orgId}
     * Get all QR codes for an organization
     */
    getQRByOrgId: async (orgId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/org/${orgId}`)
        return data
    },

    /**
     * PUT /api/qr/{qrCodeId}/activate
     * Activate QR code
     */
    activateQR: async (qrCodeId) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${qrCodeId}/activate`)
        return data
    },

    /**
     * PUT /api/qr/{qrCodeId}/deactivate
     * Deactivate QR code
     */
    deactivateQR: async (qrCodeId) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${qrCodeId}/deactivate`)
        return data
    },

    // ========== QR ASSIGNMENT ==========

    /**
     * POST /api/qr/{qrCodeId}/assign
     * Assign QR code to distributor
     */
    assignQR: async (qrCodeId, assignData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/${qrCodeId}/assign`, assignData)
        return data
    },

    /**
     * GET /api/qr/assignments/pending
     * Get pending assignments (for distributor)
     */
    getPendingAssignments: async () => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/assignments/pending`)
        return data
    },

    /**
     * GET /api/qr/my-assignments
     * Get my assignments (for distributor)
     */
    getMyAssignments: async () => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/my-assignments`)
        return data
    },

    /**
     * POST /api/qr/{qrCodeId}/accept
     * Accept QR assignment (distributor)
     */
    acceptAssignment: async (qrCodeId) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/${qrCodeId}/accept`)
        return data
    },

    /**
     * POST /api/qr/{qrCodeId}/reject
     * Reject QR assignment (distributor)
     */
    rejectAssignment: async (qrCodeId, rejectData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/${qrCodeId}/reject`, rejectData)
        return data
    },

    // ========== DEPLOYMENT ==========

    /**
     * POST /api/qr/{qrCodeId}/deploy
     * Submit deployment (distributor)
     */
    submitDeployment: async (qrCodeId, deploymentData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/${qrCodeId}/deploy`, deploymentData)
        return data
    },

    /**
     * POST /api/qr/{qrCodeId}/upload-photo
     * Upload deployment photo
     */
    uploadDeploymentPhoto: async (qrCodeId, file) => {
        const formData = new FormData()
        formData.append('file', file)

        const { data } = await axiosInstance.post(
            `${BASE_PATH}/${qrCodeId}/upload-photo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return data
    },

    /**
     * POST /api/qr/{qrCodeId}/approve-deployment
     * Approve deployment (admin)
     */
    approveDeployment: async (qrCodeId) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/${qrCodeId}/approve-deployment`)
        return data
    },

    /**
     * POST /api/qr/{qrCodeId}/reject-deployment
     * Reject deployment (admin)
     */
    rejectDeployment: async (qrCodeId, rejectData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/${qrCodeId}/reject-deployment`, rejectData)
        return data
    },

    // ========== MESSAGING ==========

    /**
     * POST /api/qr/{qrCodeId}/message
     * Send message
     */
    sendMessage: async (qrCodeId, messageData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/${qrCodeId}/message`, messageData)
        return data
    },

    /**
     * GET /api/qr/{qrCodeId}/messages
     * Get all messages for a QR code
     */
    getMessages: async (qrCodeId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${qrCodeId}/messages`)
        return data
    },

    /**
     * GET /api/qr/messages/unread-count
     * Get unread message count
     */
    getUnreadCount: async (qrCodeId = null) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/messages/unread-count`, {
            params: qrCodeId ? { qrCodeId } : {}
        })
        return data
    },

    /**
     * PUT /api/qr/message/{messageId}/read
     * Mark message as read
     */
    markMessageAsRead: async (messageId) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/message/${messageId}/read`)
        return data
    },

    // ========== SCANNING ==========

    /**
     * GET /api/qr/s/{qrCodeSlug}
     * Scan QR code (public)
     */
    scanQRCode: async (qrCodeSlug) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/s/${qrCodeSlug}`)
        return data
    },

    /**
     * POST /api/qr/scan/{qrCodeSlug}
     * Track QR scan
     */
    trackScan: async (qrCodeSlug, scanData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/scan/${qrCodeSlug}`, scanData)
        return data
    },

    // ========== ANALYTICS ==========

    /**
     * GET /api/qr/{qrCodeId}/analytics
     * Get analytics for single QR code
     */
    getQRAnalytics: async (qrCodeId, days = 7) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${qrCodeId}/analytics`, {
            params: { days }
        })
        return data
    },

    /**
     * GET /api/qr/org/{orgId}/analytics
     * Get organization-wide analytics
     */
    getOrgQRAnalytics: async (orgId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/org/${orgId}/analytics`)
        return data
    },
}
