// Form Statuses
export const FORM_STATUS = {
    DRAFT: {
        value: 'DRAFT',
        label: 'Draft',
        color: 'default',
        icon: '📝',
        description: 'Form is being edited',
        canEdit: true,
        canActivate: false,
        canFinalize: true,
    },
    FINALIZED: {
        value: 'FINALIZED',
        label: 'Finalized',
        color: 'info',
        icon: '🔒',
        description: 'Form is locked, ready to activate',
        canEdit: false,
        canActivate: true,
        canFinalize: false,
    },
    ACTIVE: {
        value: 'ACTIVE',
        label: 'Active',
        color: 'success',
        icon: '✅',
        description: 'Form is accepting responses',
        canEdit: false,
        canActivate: false,
        canFinalize: false,
        canDeactivate: true,
    },
    INACTIVE: {
        value: 'INACTIVE',
        label: 'Inactive',
        color: 'warning',
        icon: '⏸️',
        description: 'Form is temporarily disabled',
        canEdit: false,
        canActivate: true,
        canFinalize: false,
    },
    ARCHIVED: {
        value: 'ARCHIVED',
        label: 'Archived',
        color: 'error',
        icon: '🗄️',
        description: 'Form is archived',
        canEdit: false,
        canActivate: false,
        canFinalize: false,
    },
}

// Template Categories
export const TEMPLATE_CATEGORIES = {
    INFRASTRUCTURE: {
        value: 'Infrastructure',
        label: 'Infrastructure',
        icon: '🏗️',
        color: '#1976d2',
        description: 'Roads, bridges, buildings, utilities'
    },
    HEALTH: {
        value: 'Health',
        label: 'Health',
        icon: '🏥',
        color: '#d32f2f',
        description: 'Hospitals, clinics, medical services'
    },
    EDUCATION: {
        value: 'Education',
        label: 'Education',
        icon: '🎓',
        color: '#388e3c',
        description: 'Schools, colleges, educational programs'
    },
    UTILITIES: {
        value: 'Utilities',
        label: 'Utilities',
        icon: '💡',
        color: '#f57c00',
        description: 'Water, electricity, gas, internet'
    },
    TRANSPORTATION: {
        value: 'Transportation',
        label: 'Transportation',
        icon: '🚗',
        color: '#0288d1',
        description: 'Public transport, traffic, parking'
    },
    ENVIRONMENT: {
        value: 'Environment',
        label: 'Environment',
        icon: '🌳',
        color: '#689f38',
        description: 'Parks, pollution, waste management'
    },
    PUBLIC_SAFETY: {
        value: 'Public Safety',
        label: 'Public Safety',
        icon: '👮',
        color: '#c62828',
        description: 'Police, fire, emergency services'
    },
    ADMINISTRATION: {
        value: 'Administration',
        label: 'Administration',
        icon: '📋',
        color: '#5e35b1',
        description: 'Government offices, documentation'
    },
    OTHER: {
        value: 'Other',
        label: 'Other',
        icon: '📁',
        color: '#757575',
        description: 'Miscellaneous services'
    },
}

// Field Types
export const FIELD_TYPES = {
    TEXT: {
        value: 'text',
        label: 'Short Text',
        icon: '📝',
        category: 'basic',
        description: 'Single line text input',
        validation: ['minLength', 'maxLength', 'pattern'],
        defaultProps: {
            placeholder: 'Enter text...',
            maxLength: 255,
        }
    },
    TEXTAREA: {
        value: 'textarea',
        label: 'Long Text',
        icon: '📄',
        category: 'basic',
        description: 'Multi-line text input',
        validation: ['minLength', 'maxLength'],
        defaultProps: {
            placeholder: 'Enter description...',
            rows: 4,
            maxLength: 5000,
        }
    },
    EMAIL: {
        value: 'email',
        label: 'Email',
        icon: '📧',
        category: 'basic',
        description: 'Email address input',
        validation: ['pattern'],
        defaultProps: {
            placeholder: 'user@example.com',
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        }
    },
    PHONE: {
        value: 'phone',
        label: 'Phone Number',
        icon: '📞',
        category: 'basic',
        description: 'Phone number input',
        validation: ['pattern', 'minLength', 'maxLength'],
        defaultProps: {
            placeholder: '+91 XXXXX XXXXX',
            pattern: '^[+]?[0-9]{10,15}$',
            minLength: 10,
            maxLength: 15,
        }
    },
    NUMBER: {
        value: 'number',
        label: 'Number',
        icon: '🔢',
        category: 'basic',
        description: 'Numeric input',
        validation: ['min', 'max'],
        defaultProps: {
            placeholder: 'Enter number...',
            min: 0,
        }
    },
    DATE: {
        value: 'date',
        label: 'Date',
        icon: '📅',
        category: 'datetime',
        description: 'Date picker',
        validation: ['min', 'max'],
        defaultProps: {}
    },
    TIME: {
        value: 'time',
        label: 'Time',
        icon: '⏰',
        category: 'datetime',
        description: 'Time picker',
        validation: [],
        defaultProps: {}
    },
    DATETIME: {
        value: 'datetime',
        label: 'Date & Time',
        icon: '📆',
        category: 'datetime',
        description: 'Date and time picker',
        validation: ['min', 'max'],
        defaultProps: {}
    },
    DROPDOWN: {
        value: 'dropdown',
        label: 'Dropdown',
        icon: '📋',
        category: 'choice',
        description: 'Single selection dropdown',
        validation: [],
        requiresOptions: true,
        defaultProps: {
            placeholder: 'Select an option...',
        },
        defaultOptions: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ]
    },
    CHECKBOX: {
        value: 'checkbox',
        label: 'Checkbox',
        icon: '☑️',
        category: 'choice',
        description: 'Multiple selection checkboxes',
        validation: [],
        requiresOptions: true,
        multiSelect: true,
        defaultOptions: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ]
    },
    RADIO: {
        value: 'radio',
        label: 'Radio Button',
        icon: '🔘',
        category: 'choice',
        description: 'Single selection radio buttons',
        validation: [],
        requiresOptions: true,
        defaultOptions: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ]
    },
    FILE: {
        value: 'file',
        label: 'File Upload',
        icon: '📎',
        category: 'media',
        description: 'General file upload',
        validation: ['maxSize', 'allowedFormats'],
        defaultProps: {
            maxSize: '5MB',
            allowedFormats: ['pdf', 'doc', 'docx', 'txt'],
        }
    },
    IMAGE: {
        value: 'image',
        label: 'Image Upload',
        icon: '🖼️',
        category: 'media',
        description: 'Image file upload',
        validation: ['maxSize', 'allowedFormats'],
        defaultProps: {
            maxSize: '5MB',
            allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        }
    },
    VIDEO: {
        value: 'video',
        label: 'Video Upload',
        icon: '🎥',
        category: 'media',
        description: 'Video file upload',
        validation: ['maxSize', 'allowedFormats', 'maxDuration'],
        defaultProps: {
            maxSize: '50MB',
            allowedFormats: ['mp4', 'avi', 'mov', 'wmv'],
            maxDuration: 300, // 5 minutes
        }
    },
    AUDIO: {
        value: 'audio',
        label: 'Audio Upload',
        icon: '🎵',
        category: 'media',
        description: 'Audio file upload',
        validation: ['maxSize', 'allowedFormats', 'maxDuration'],
        defaultProps: {
            maxSize: '10MB',
            allowedFormats: ['mp3', 'wav', 'ogg', 'm4a'],
            maxDuration: 600, // 10 minutes
        }
    },
    RATING: {
        value: 'rating',
        label: 'Rating/Stars',
        icon: '⭐',
        category: 'special',
        description: 'Star rating input',
        validation: ['min', 'max'],
        defaultProps: {
            min: 1,
            max: 5,
        }
    },
    LOCATION: {
        value: 'location',
        label: 'Location/GPS',
        icon: '📍',
        category: 'special',
        description: 'GPS location picker',
        validation: [],
        defaultProps: {
            placeholder: 'Select location on map...',
        }
    },
}

// Field Categories for Grouping in Palette
export const FIELD_CATEGORIES = {
    basic: { label: 'Basic Inputs', icon: '📝', order: 1, color: '#1976d2' },
    datetime: { label: 'Date & Time', icon: '📅', order: 2, color: '#388e3c' },
    choice: { label: 'Choice Fields', icon: '☑️', order: 3, color: '#f57c00' },
    media: { label: 'Media Upload', icon: '📎', order: 4, color: '#d32f2f' },
    special: { label: 'Special Fields', icon: '⭐', order: 5, color: '#5e35b1' },
}

// View Modes
export const VIEW_MODES = {
    LIST: 'list',
    GRID: 'grid',
}

// Starter Fields (for new form creation)
export const STARTER_FIELDS = [
    {
        fieldId: 'field_name',
        fieldName: 'name',
        fieldLabel: 'Full Name',
        fieldType: 'text',
        required: true,
        order: 1,
        placeholder: 'Enter your full name',
        helpText: 'Please provide your complete name',
        validation: {
            minLength: 2,
            maxLength: 100,
        }
    },
    {
        fieldId: 'field_email',
        fieldName: 'email',
        fieldLabel: 'Email Address',
        fieldType: 'email',
        required: true,
        order: 2,
        placeholder: 'your.email@example.com',
        helpText: 'We will send confirmation to this email',
        validation: {
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        }
    },
]

// Default Form Settings
export const DEFAULT_FORM_SETTINGS = {
    allowAnonymous: true,
    allowMultipleSubmissions: false,
    requireLocation: false,
    enableNotifications: true,
    maxFileSize: 5242880, // 5MB in bytes
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf'],
    submitButtonText: 'Submit Feedback',
    successMessage: 'Thank you for your feedback! We will review it shortly.',
    redirectUrl: null,
    captchaEnabled: false,
}
