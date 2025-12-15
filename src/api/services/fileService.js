import axiosInstance from "../axiosInstance.js";
import {API_CONFIG} from "../../config/api.config.js";


export const fileService = {
    // Upload file to MinIO via backend
    uploadFile: async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)

        const { data } = await axiosInstance.post(
            '/files/upload', // You'll need a file upload endpoint in one of your services
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    if (onProgress) onProgress(percentCompleted)
                },
            }
        )
        return data
    },

    // Upload multiple files
    uploadMultipleFiles: async (files, onProgress) => {
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('files', file)
        })

        const { data } = await axiosInstance.post(
            '/files/upload-multiple',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    if (onProgress) onProgress(percentCompleted)
                },
            }
        )
        return data
    },

    // Get file URL from MinIO
    getFileUrl: (filename) => {
        return `${API_CONFIG.MINIO.ENDPOINT}/${API_CONFIG.MINIO.BUCKET}/${filename}`
    },
}
