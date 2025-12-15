import React, { useState } from 'react'
import {
    Box,
    Button,
    IconButton,
    Typography,
    LinearProgress,
    Alert,
} from '@mui/material'
import {
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Image as ImageIcon,
} from '@mui/icons-material'
import { minioService } from '../../../../api/services/minioService'
import toast from 'react-hot-toast'

export const TemplateImageUpload = ({ currentImage, onImageChange }) => {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState(null)

    const handleFileSelect = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image file (JPG, PNG, WEBP, GIF)')
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            setError('Image size must be less than 5MB')
            return
        }

        setError(null)
        setUploading(true)
        setUploadProgress(0)

        try {
            // Upload to MinIO
            const imageUrl = await minioService.uploadFile(file, (progress) => {
                setUploadProgress(progress)
            })

            onImageChange(imageUrl)
            toast.success('Image uploaded successfully!')
        } catch (err) {
            console.error('Upload error:', err)
            setError('Failed to upload image. Please try again.')
            toast.error('Failed to upload image')
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    const handleRemove = () => {
        onImageChange('')
        toast.success('Image removed')
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {currentImage ? (
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: 200,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    <img
                        src={currentImage}
                        alt="Template preview"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'error.main', color: 'white' },
                        }}
                        onClick={handleRemove}
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        height: 200,
                        border: 2,
                        borderStyle: 'dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        bgcolor: 'background.default',
                    }}
                >
                    <ImageIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" align="center">
                        Upload a preview image for this template
                        <br />
                        (JPG, PNG, WEBP, GIF - Max 5MB)
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<UploadIcon />}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Choose Image'}
                        <input
                            type="file"
                            hidden
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={handleFileSelect}
                        />
                    </Button>
                </Box>
            )}

            {uploading && (
                <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5 }}>
                        Uploading... {uploadProgress}%
                    </Typography>
                </Box>
            )}
        </Box>
    )
}
