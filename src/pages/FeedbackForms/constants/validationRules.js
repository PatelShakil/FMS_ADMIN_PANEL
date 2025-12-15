/**
 * Validation patterns and rules
 */

export const VALIDATION_PATTERNS = {
    email: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Please enter a valid email address',
    },
    phone: {
        pattern: /^[+]?[0-9]{10,15}$/,
        message: 'Please enter a valid phone number (10-15 digits)',
    },
    url: {
        pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        message: 'Please enter a valid URL',
    },
    alphanumeric: {
        pattern: /^[a-zA-Z0-9]+$/,
        message: 'Only letters and numbers are allowed',
    },
    alphabetic: {
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Only letters are allowed',
    },
    numeric: {
        pattern: /^[0-9]+$/,
        message: 'Only numbers are allowed',
    },
}

export const FILE_SIZE_LIMITS = {
    image: 5 * 1024 * 1024, // 5MB
    video: 50 * 1024 * 1024, // 50MB
    audio: 10 * 1024 * 1024, // 10MB
    file: 5 * 1024 * 1024, // 5MB
}

export const ALLOWED_FILE_FORMATS = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
    audio: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
    file: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'],
}

/**
 * Validate field value based on field type and validation rules
 */
export const validateField = (field, value) => {
    const errors = []

    // Required validation
    if (field.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field.fieldLabel} is required`)
        return errors
    }

    // Skip further validation if empty and not required
    if (!value) return errors

    const validation = field.validation || {}

    // Min/Max length for text fields
    if (validation.minLength && value.length < validation.minLength) {
        errors.push(`${field.fieldLabel} must be at least ${validation.minLength} characters`)
    }
    if (validation.maxLength && value.length > validation.maxLength) {
        errors.push(`${field.fieldLabel} must not exceed ${validation.maxLength} characters`)
    }

    // Min/Max value for number fields
    if (validation.min !== undefined && parseFloat(value) < validation.min) {
        errors.push(`${field.fieldLabel} must be at least ${validation.min}`)
    }
    if (validation.max !== undefined && parseFloat(value) > validation.max) {
        errors.push(`${field.fieldLabel} must not exceed ${validation.max}`)
    }

    // Pattern validation
    if (validation.pattern) {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(value)) {
            errors.push(`${field.fieldLabel} format is invalid`)
        }
    }

    return errors
}

/**
 * Validate entire form
 */
export const validateForm = (fields, formData) => {
    const allErrors = {}

    fields.forEach(field => {
        const value = formData[field.fieldName]
        const fieldErrors = validateField(field, value)

        if (fieldErrors.length > 0) {
            allErrors[field.fieldName] = fieldErrors
        }
    })

    return {
        isValid: Object.keys(allErrors).length === 0,
        errors: allErrors
    }
}
