import { API_CONFIG } from '../../config/api.config'
import axios from 'axios'

/**
 * Direct MinIO Upload Service
 * Uploads files directly to MinIO without backend
 */
export const minioService = {
    /**
     * Upload file directly to MinIO
     * @param {File} file - File object to upload
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<string>} - File URL
     */
    uploadFile: async (file, onProgress) => {
        try {
            // Generate unique filename
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(7)
            const extension = file.name.split('.').pop()
            const filename = `${timestamp}_${randomString}.${extension}`

            // MinIO endpoint
            const minioEndpoint = API_CONFIG.MINIO.ENDPOINT
            const bucket = API_CONFIG.MINIO.BUCKET
            const uploadUrl = `${minioEndpoint}/${bucket}/${filename}`

            // Upload using PUT request
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        onProgress(percentCompleted)
                    }
                },
            })

            // Return public URL
            return uploadUrl
        } catch (error) {
            console.error('MinIO upload error:', error)
            throw new Error('Failed to upload file to MinIO')
        }
    },

    /**
     * Upload multiple files
     * @param {File[]} files - Array of files
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<string[]>} - Array of file URLs
     */
    uploadMultipleFiles: async (files, onProgress) => {
        const uploadPromises = files.map((file, index) =>
            minioService.uploadFile(file, (percent) => {
                if (onProgress) {
                    const totalProgress = ((index * 100) + percent) / files.length
                    onProgress(Math.round(totalProgress))
                }
            })
        )
        return Promise.all(uploadPromises)
    },

    /**
     * Get file URL from MinIO
     * @param {string} filename - Filename
     * @returns {string} - Full file URL
     */
    getFileUrl: (filename) => {
        return `${API_CONFIG.MINIO.ENDPOINT}/${API_CONFIG.MINIO.BUCKET}/${filename}`
    },

    /**
     * Delete file from MinIO
     * @param {string} filename - Filename to delete
     */
    deleteFile: async (filename) => {
        try {
            const minioEndpoint = API_CONFIG.MINIO.ENDPOINT
            const bucket = API_CONFIG.MINIO.BUCKET
            const deleteUrl = `${minioEndpoint}/${bucket}/${filename}`

            await axios.delete(deleteUrl)
        } catch (error) {
            console.error('MinIO delete error:', error)
            throw new Error('Failed to delete file from MinIO')
        }
    },
}
