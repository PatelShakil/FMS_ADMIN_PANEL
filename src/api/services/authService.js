import {API_CONFIG} from "../../config/api.config.js";
import axiosInstance from "../axiosInstance.js";


const BASE_PATH = API_CONFIG.SERVICES.AUTH

export const authService = {
    // POST /auth/auth-services/api/auth/login
    login: async (email, password) => {
        const {data} = await axiosInstance.post(`${BASE_PATH}/login`, {
            email,
            password,
        })
        console.log(data)
        return data
    },

    // POST /auth/auth-services/api/auth/register
    logout: async (refreshToken) => {
        const {data} = await axiosInstance.post(`${BASE_PATH}/logout`,{refreshToken})
        return data
    },
    // POST /auth/auth-services/api/auth/register
    getDistributorStats: async () => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/distributors/stats`)
        return data
    },
    // POST /auth/auth-services/api/auth/register-distributor
    registerDistributor: async (userData) => {
        const {data} = await axiosInstance.post(`${BASE_PATH}/register-distributor`, userData)
        return data
    },
    // POST /auth/auth-services/api/auth/register
    registerOrganization: async (userData) => {
        const {data} = await axiosInstance.post(`${BASE_PATH}/register-organization`, userData)
        return data
    },

    // POST /auth/auth-services/api/auth/refresh
    refreshToken: async (refreshToken) => {
        const {data} = await axiosInstance.post(`${BASE_PATH}`, {
            refreshToken,
        })
        return data
    },

    // GET /auth/auth-services/api/auth/profile
    getProfile: async () => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/profile`)
        return data
    },
    // GET /auth/auth-services/api/auth/profile
    getUserById: async (userId) => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/user/${userId}`)
        return data
    },

    // PUT /auth/auth-services/api/auth/profile
    updateProfile: async (profileData) => {
        const {data} = await axiosInstance.put(`${BASE_PATH}/profile`, profileData)
        return data
    },

    // GET /auth/auth-services/api/auth/distributors/active
    getActiveDistributors: async () => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/distributors/active`)
        return data
    },

    // GET /auth/auth-services/api/auth/distributors/all
    getAllDistributors: async () => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/distributors/all`)
        return data
    },

    // GET /auth/auth-services/api/auth/distributors/pending
    getPendingDistributors: async () => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/distributors/pending`)
        return data
    },

    // POST /auth/auth-services/api/auth/distributors/{id}/approve
    approveDistributor: async (id) => {
        const {data} = await axiosInstance.put(`${BASE_PATH}/distributors/${id}/approve`)
        return data
    },
  // POST /auth/auth-services/api/auth/distributors/{id}/approve
    reactivateDistributor: async (id) => {
        const {data} = await axiosInstance.put(`${BASE_PATH}/distributors/${id}/reactivate`)
        return data
    },

    // POST /auth/auth-services/api/auth/distributors/{id}/reject
    rejectDistributor: async (id) => {
        const {data} = await axiosInstance.put(`${BASE_PATH}/distributors/${id}/reject`)
        return data
    },
    // POST /auth/auth-services/api/auth/distributors/{id}/reject
    suspendDistributor: async (id) => {
        const {data} = await axiosInstance.put(`${BASE_PATH}/distributors/${id}/suspend`,{reason:"Distributor is Suspended."})
        return data
    },
    inviteAdmin: async (inviteData) => {
        const {data} = await axiosInstance.post(`${BASE_PATH}/invite-admin`, inviteData)
        return data
    },
    // POST /auth/auth-services/api/auth/accept-invite
    acceptInvite: async (inviteData) => {
        const {data} = await axiosInstance.post(`${BASE_PATH}/accept-invite`, inviteData)
        return data
    },

    getTeamMembers: async (orgId) => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/org?orgId=${orgId}`)
        return data // List of ORG_ADMINs in the organization
    },
    // GET /auth/auth-service/api/auth/team/members/{userId}
    getTeamMemberById: async (userId) => {
        const {data} = await axiosInstance.get(`${BASE_PATH}/member?memberId=${userId}`)
        return data
    },

    // PUT /auth/auth-service/api/auth/team/members/{userId}/suspend
    suspendTeamMember: async (userId, reason) => {
        const {data} = await axiosInstance.put(
            `${BASE_PATH}/auth/team/members/${userId}/suspend`,
            {reason}
        )
        return data
    },

// PUT /auth/auth-service/api/auth/team/members/{userId}/reactivate
    reactivateTeamMember: async (userId) => {
        const {data} = await axiosInstance.put(
            `${BASE_PATH}/auth/team/members/${userId}/reactivate`
        )
        return data
    },

// DELETE /auth/auth-service/api/auth/team/members/{userId}
    removeTeamMember: async (userId) => {
        const {data} = await axiosInstance.delete(
            `${BASE_PATH}/auth/team/members/${userId}`
        )
        return data
    },
}
