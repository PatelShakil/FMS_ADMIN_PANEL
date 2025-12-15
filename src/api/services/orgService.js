import {API_CONFIG} from "../../config/api.config.js";
import axiosInstance from "../axiosInstance.js";

const BASE_PATH = API_CONFIG.SERVICES.ORG

export const orgService = {
    // GET /org/org-services/api/orgs
    getAllOrgs: async (params) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/list`, { params })
        return data
    },

    // GET /org/org-services/api/orgs/{id}
    getOrgById: async (id) => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/${id}`)
        return data
    },    // GET /org/org-services/api/orgs/{id}
    getMyOrg: async () => {
        const { data } = await axiosInstance.get(`${BASE_PATH}/my`)
        return data
    },

    // POST /org/org-services/api/orgs
    createOrg: async (orgData) => {
        const { data } = await axiosInstance.post(`${BASE_PATH}/`, orgData)
        return data
    },

    // PUT /org/org-services/api/orgs/{id}
    updateOrg: async (id, orgData) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${id}`, orgData)
        return data
    },

    // PUT /org/org-services/api/orgs/{id}/approve
    approveOrg: async (id) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${id}/approve`)
        return data
    },

    // PUT /org/org-services/api/orgs/{id}/reject
    rejectOrg: async (id) => {
        const { data } = await axiosInstance.put(`${BASE_PATH}/${id}/reject`)
        return data
    },
}
