import { API_CONFIG } from "../../config/api.config.js";
import axiosInstance from "../axiosInstance.js";

const BASE_PATH = API_CONFIG.SERVICES.SERVICE

export const serviceService = {
    // GET /service-service/api/services/org/{orgId}
    getServicesByOrg: async (orgId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/org/${orgId}`)
        return data
    },

    // GET /service-service/api/services/org/{orgId}/tree
    getServiceTree: async (orgId) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/org/${orgId}/tree`)
        return data
    },

    // GET /service-service/api/services/{id}
    getServiceById: async (id) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${id}`)
        return data
    },

    // GET /service-service/api/services/{id}/children
    getServiceChildren: async (id) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${id}/children`)
        return data
    },

    // GET /service-service/api/services/{id}/ancestors
    getServiceAncestors: async (id) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${id}/ancestors`)
        return data
    },

    // GET /service-service/api/services/{id}/descendants
    getServiceDescendants: async (id) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${id}/descendants`)
        return data
    },

    // GET /service-service/api/services/code/{code}
    getServiceByCode: async (code) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/code/${code}`)
        return data
    },

    // POST /service-service/api/services
    createService: async (serviceData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}`, serviceData)
        return data
    },

    // PUT /service-service/api/services/{id}
    updateService: async (id, serviceData) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${id}`, serviceData)
        return data
    },

    // DELETE /service-service/api/services/{id}
    deleteService: async (id) => {
        const { data } = await axiosInstance.delete(`${BASE_PATH}/${id}`)
        return data
    },

    // PUT /service-service/api/services/{id}/activate
    activateService: async (id) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${id}/activate`)
        return data
    },

    // PUT /service-service/api/services/{id}/deactivate
    deactivateService: async (id) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${id}/deactivate`)
        return data
    },

    // PUT /service-service/api/services/{id}/maintenance
    setMaintenanceMode: async (id) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${id}/maintenance`)
        return data
    },
}
