import axiosInstance from '../axiosInstance'
import { API_CONFIG } from '../../config/api.config'

const FORMS_BASE = `${API_CONFIG.SERVICES.FORMS}`
const TEMPLATES_BASE = `${API_CONFIG.SERVICES.TEMPLATES}`

export const feedbackService = {
    // ========== FORMS ==========

    /**
     * GET /api/forms
     * List all forms with filters and pagination
     */
    getAllForms: async (params = {}) => {
        const { data } = await axiosInstance.get(FORMS_BASE, { params })
        return data
    },

    /**
     * GET /api/forms/{formId}
     * Get form by ID (requires authentication)
     */
    getFormById: async (formId) => {
        const { data } = await axiosInstance.get(`${FORMS_BASE}/${formId}`)
        return data
    },

    /**
     * GET /api/forms/{formId}/public
     * Get form for public access (no authentication required)
     */
    getPublicForm: async (formId) => {
        const { data } = await axiosInstance.get(`${FORMS_BASE}/${formId}/public`)
        return data
    },

    /**
     * POST /api/forms
     * Create a new form
     */
    createForm: async (formData) => {
        const { data } = await axiosInstance.post(FORMS_BASE, formData)
        return data
    },

    /**
     * PUT /api/forms/{formId}
     * Update form (only DRAFT forms without responses)
     */
    updateForm: async (formId, formData) => {
        const { data } = await axiosInstance.put(`${FORMS_BASE}/${formId}`, formData)
        return data
    },

    /**
     * DELETE /api/forms/{formId}
     * Delete form (soft delete, only if no responses)
     */
    deleteForm: async (formId) => {
        const { data } = await axiosInstance.delete(`${FORMS_BASE}/${formId}`)
        return data
    },

    /**
     * POST /api/forms/{formId}/finalize
     * Finalize form (lock for editing) - DRAFT → FINALIZED
     */
    finalizeForm: async (formId) => {
        const { data } = await axiosInstance.post(`${FORMS_BASE}/${formId}/finalize`)
        return data
    },

    /**
     * PUT /api/forms/{formId}/activate
     * Activate form (make it available for responses) - FINALIZED → ACTIVE
     */
    activateForm: async (formId) => {
        const { data } = await axiosInstance.put(`${FORMS_BASE}/${formId}/activate`)
        return data
    },

    /**
     * PUT /api/forms/{formId}/deactivate
     * Deactivate form (stop accepting responses) - ACTIVE → INACTIVE
     */
    deactivateForm: async (formId) => {
        const { data } = await axiosInstance.put(`${FORMS_BASE}/${formId}/deactivate`)
        return data
    },

    // ========== TEMPLATES ==========

    /**
     * GET /api/templates
     * List all templates with filters and pagination
     */
    getAllTemplates: async (params = {}) => {
        const { data } = await axiosInstance.get(TEMPLATES_BASE, { params })
        return data
    },

    /**
     * GET /api/templates/popular
     * Get popular templates (most used)
     */
    getPopularTemplates: async (limit = 10) => {
        const { data } = await axiosInstance.get(`${TEMPLATES_BASE}/popular`, {
            params: { limit }
        })
        return data
    },

    /**
     * GET /api/templates/category/{category}
     * Get templates by category
     */
    getTemplatesByCategory: async (category) => {
        const { data } = await axiosInstance.get(`${TEMPLATES_BASE}/category/${category}`)
        return data
    },

    /**
     * GET /api/templates/{templateId}
     * Get template by ID
     */
    getTemplateById: async (templateId) => {
        const { data } = await axiosInstance.get(`${TEMPLATES_BASE}/${templateId}`)
        return data
    },

    /**
     * POST /api/templates
     * Create a new template (PLATFORM_ADMIN only)
     */
    createTemplate: async (templateData) => {
        const { data } = await axiosInstance.post(TEMPLATES_BASE, templateData)
        return data
    },

    /**
     * PUT /api/templates/{templateId}
     * Update template (PLATFORM_ADMIN only)
     */
    updateTemplate: async (templateId, templateData) => {
        const { data } = await axiosInstance.put(`${TEMPLATES_BASE}/${templateId}`, templateData)
        return data
    },

    /**
     * DELETE /api/templates/{templateId}
     * Delete template (soft delete, PLATFORM_ADMIN only)
     */
    deleteTemplate: async (templateId) => {
        const { data } = await axiosInstance.delete(`${TEMPLATES_BASE}/${templateId}`)
        return data
    },

    /**
     * POST /api/forms/clone/{templateId}
     * Clone template to create a new form
     */
    cloneTemplateToForm: async (templateId, formData) => {
        const { data } = await axiosInstance.post(`${FORMS_BASE}/clone/${templateId}`, formData)
        return data
    },
}
