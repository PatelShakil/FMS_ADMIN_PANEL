// src/api/services/responseService.js - CORRECTED VERSION
import { API_CONFIG } from "../../config/api.config.js";
import axiosInstance from "../axiosInstance.js";

const BASE_PATH = API_CONFIG.SERVICES.RESPONSES
const ANALYTICS_PATH = API_CONFIG.SERVICES.ANALYTICS
const EXPORT_PATH = API_CONFIG.SERVICES.EXPORT

export const responseService = {
    // ========== RESPONSE CRUD ==========

    /**
     * POST /api/responses
     * Submit a new response (citizen submission)
     */
    submitResponse: async (responseData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}`, responseData)
        return data
    },

    /**
     * GET /api/responses
     * List responses with filters and pagination
     */
    getAllResponses: async (params) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}`, { params })
        return data
    },

    /**
     * GET /api/responses/{responseId}
     * Get single response by ID
     */
    getResponseById: async (responseId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${responseId}`)
        return data
    },

    /**
     * GET /api/responses/form/{formId}
     * Get all responses for a specific form
     */
    getResponsesByForm: async (formId, params) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/form/${formId}`, { params })
        return data
    },

    /**
     * GET /api/responses/qr/{qrCodeId}
     * Get all responses from a QR code
     */
    getResponsesByQR: async (qrCodeId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/qr/${qrCodeId}`)
        return data
    },

    /**
     * DELETE /api/responses/{responseId}
     * Delete (soft delete) a response
     */
    deleteResponse: async (responseId) => {
        const { data } = await axiosInstance.delete(`${BASE_PATH}/${responseId}`)
        return data
    },

    // ========== STATUS MANAGEMENT ==========

    /**
     * PUT /api/responses/{responseId}/review
     * Mark response as reviewed
     */
    reviewResponse: async (responseId, notes = null) => {
        const { data } = await axiosInstance.put(
            `${BASE_PATH}/${responseId}/review`,
            { notes }
        )
        return data
    },

    /**
     * PUT /api/responses/{responseId}/resolve
     * Mark response as resolved (REQUIRED: resolutionNotes)
     */
    resolveResponse: async (responseId, resolutionNotes) => {
        const { data } = await axiosInstance.put(
            `${BASE_PATH}/${responseId}/resolve`,
            { resolutionNotes }
        )
        return data
    },

    /**
     * POST /api/responses/{responseId}/flag
     * Flag a response
     * @param reason - SPAM | INAPPROPRIATE | DUPLICATE | FAKE | OTHER
     */
    flagResponse: async (responseId, flagData) => {
        const { data } = await axiosInstance.post(
            `${BASE_PATH}/${responseId}/flag`,
            flagData
        )
        return data
    },

    /**
     * POST /api/responses/{responseId}/reply
     * Add organization reply to response
     */
    replyToResponse: async (responseId, replyData) => {
        const { data } = await axiosInstance.post(
            `${BASE_PATH}/${responseId}/reply`,
            replyData
        )
        return data
    },

    // ========== STATISTICS ==========

    /**
     * GET /api/responses/stats
     * Get response statistics (formId or orgId required)
     */
    getResponseStats: async (params) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/stats`, { params })
        return data
    },

    // ========== ANALYTICS ==========

    /**
     * GET /api/analytics/form/{formId}
     * Get form analytics
     */
    getFormAnalytics: async (formId, params) => {
        const { data } = await axiosInstance.get(
            `${ANALYTICS_PATH}/form/${formId}`,
            { params }
        )
        return data
    },

    /**
     * GET /api/analytics/org/{orgId}
     * Get organization analytics
     */
    getOrgAnalytics: async (orgId, params) => {
        const { data } = await axiosInstance.get(
            `${ANALYTICS_PATH}/org/${orgId}`,
            { params }
        )
        return data
    },

    /**
     * GET /api/analytics/dashboard
     * Get comprehensive dashboard data
     */
    getDashboardAnalytics: async (params) => {
        const { data } = await axiosInstance.get(
            `${ANALYTICS_PATH}/dashboard`,
            { params }
        )
        return data
    },

    /**
     * GET /api/analytics/realtime
     * Get real-time statistics
     */
    getRealtimeStats: async (params) => {
        const { data } = await axiosInstance.get(
            `${ANALYTICS_PATH}/realtime`,
            { params }
        )
        return data
    },

    /**
     * GET /api/analytics/top-forms
     * Get top forms by response count
     */
    getTopForms: async (params) => {
        const { data } = await axiosInstance.get(
            `${ANALYTICS_PATH}/top-forms`,
            { params }
        )
        return data
    },

    /**
     * GET /api/analytics/device-breakdown
     * Get device platform breakdown
     */
    getDeviceBreakdown: async (params) => {
        const { data } = await axiosInstance.get(
            `${ANALYTICS_PATH}/device-breakdown`,
            { params }
        )
        return data
    },

    /**
     * GET /api/analytics/location-breakdown
     * Get location breakdown
     */
    getLocationBreakdown: async (params) => {
        const { data} = await axiosInstance.get(
            `${ANALYTICS_PATH}/location-breakdown`,
            { params }
        )
        return data
    },

    // ========== EXPORT ==========

    /**
     * GET /api/export/csv
     * Export responses as CSV (formId required)
     */
    exportCSV: async (params) => {
        const response = await axiosInstance.get(`${EXPORT_PATH}/csv`, {
            params,
            responseType: 'blob'
        })
        return response.data
    },

    /**
     * GET /api/export/excel
     * Export responses as Excel (formId required)
     */
    exportExcel: async (params) => {
        const response = await axiosInstance.get(`${EXPORT_PATH}/excel`, {
            params,
            responseType: 'blob'
        })
        return response.data
    },

    /**
     * GET /api/export/pdf
     * Export responses as PDF (formId required, max 100 records)
     */
    exportPDF: async (params) => {
        const response = await axiosInstance.get(`${EXPORT_PATH}/pdf`, {
            params,
            responseType: 'blob'
        })
        return response.data
    },
}
