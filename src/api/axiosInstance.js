import axios from 'axios'
import { API_CONFIG } from '../config/api.config'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        const { data } = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.SERVICES.AUTH}/refresh`,
          { refreshToken }
        )
          console.log(data)

        const { accessToken} = data.data

        // Update tokens in store
        useAuthStore.getState().setTokens(accessToken, refreshToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout user
        useAuthStore.getState().logout()
        toast.error('Session expired. Please login again.')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.')
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
