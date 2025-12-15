import React, { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    LinearProgress,
    Alert,
} from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import { FieldRenderer } from './FieldRenderer'
import { validateForm } from '../../constants/validationRules'

export const FormRenderer = ({
                                 fields = [],
                                 settings = {},
                                 mode = 'preview', // 'preview' or 'submit'
                                 onSubmit,
                                 formTitle,
                                 formDescription,
                             }) => {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFieldChange = (fieldName, value) => {
        setFormData({
            ...formData,
            [fieldName]: value,
        })

        // Clear error for this field
        if (errors[fieldName]) {
            setErrors({
                ...errors,
                [fieldName]: null,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate form
        const validation = validateForm(fields, formData)

        if (!validation.isValid) {
            setErrors(validation.errors)
            return
        }

        if (mode === 'preview') {
            console.log('Preview mode - Form data:', formData)
            alert('Preview mode: Form submission disabled')
            return
        }

        // Submit form
        if (onSubmit) {
            setIsSubmitting(true)
            try {
                await onSubmit(formData)
            } catch (error) {
                console.error('Form submission error:', error)
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    if (!fields || fields.length === 0) {
        return (
            <Alert severity="warning">
                This form has no fields configured.
            </Alert>
        )
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: '100%',
                maxWidth: 800,
                mx: 'auto',
            }}
        >
            {/* Form Header */}
            {(formTitle || formDescription) && (
                <Box sx={{ mb: 4 }}>
                    {formTitle && (
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            {formTitle}
                        </Typography>
                    )}
                    {formDescription && (
                        <Typography variant="body1" color="text.secondary">
                            {formDescription}
                        </Typography>
                    )}
                </Box>
            )}

            {/* Preview Mode Alert */}
            {mode === 'preview' && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    This is a preview. Form submission is disabled.
                </Alert>
            )}

            {/* Form Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {fields
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((field) => (
                        <Paper
                            key={field.fieldId}
                            sx={{
                                p: 3,
                                border: 1,
                                borderColor: errors[field.fieldName] ? 'error.main' : 'divider',
                                bgcolor: 'background.paper',
                            }}
                        >
                            <FieldRenderer
                                field={field}
                                value={formData[field.fieldName]}
                                onChange={(value) => handleFieldChange(field.fieldName, value)}
                                error={errors[field.fieldName]}
                            />
                        </Paper>
                    ))}
            </Box>

            {/* Submit Button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={!isSubmitting && <SendIcon />}
                    sx={{ minWidth: 200 }}
                >
                    {isSubmitting ? (
                        <>
                            <LinearProgress sx={{ width: 100, mr: 2 }} />
                            Submitting...
                        </>
                    ) : (
                        settings.submitButtonText || 'Submit Feedback'
                    )}
                </Button>
            </Box>

            {/* Success Message (if configured) */}
            {settings.successMessage && mode === 'preview' && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    {settings.successMessage}
                </Alert>
            )}
        </Box>
    )
}
