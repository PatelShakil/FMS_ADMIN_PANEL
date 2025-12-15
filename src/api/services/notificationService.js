import {API_CONFIG} from "../../config/api.config.js";
import axiosInstance from "../axiosInstance.js";


const NOTIFICATIONS_PATH = API_CONFIG.SERVICES.NOTIFICATIONS
const PREFERENCES_PATH = API_CONFIG.SERVICES.PREFERENCES

export const notificationService = {
    // GET /notifications/api/notifications
    getAllNotifications: async (params) => {
        const { data } = await axiosInstance.get(`${NOTIFICATIONS_PATH}`, { params })
        return data
    },
    // GET /notifications/api/notifications
    getAllNotificationsByUserId: async (params) => {
        const { data } = await axiosInstance.get(`${NOTIFICATIONS_PATH}/user/${params.userId}`, { params })
        return data
    },

    // GET /notifications/api/notifications/{id}
    getNotificationById: async (id) => {
        const { data } = await axiosInstance.get(`${NOTIFICATIONS_PATH}/${id}`)
        return data
    },

    // GET /preferences/api/preferences/{userId}
    getUserPreferences: async (userId) => {
        const { data } = await axiosInstance.get(`${PREFERENCES_PATH}/${userId}`)
        return data
    },

    // PUT /preferences/api/preferences/{userId}
    updateUserPreferences: async (userId, preferences) => {
        const { data } = await axiosInstance.put(`${PREFERENCES_PATH}/${userId}`, preferences)
        return data
    },
}
