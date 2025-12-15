import React from 'react'
import {
    Box,
    Typography,
    TextField,
    FormControl,
    FormLabel,
    FormHelperText,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox,
    FormGroup,
    MenuItem,
    Rating,
    Chip,
    Button,
    Alert,
} from '@mui/material'
import {
    Star as StarIcon,
    LocationOn as LocationIcon,
    CloudUpload as UploadIcon,
} from '@mui/icons-material'
import { FIELD_TYPES } from '../../constants/formConstants'

export const FieldRenderer = ({ field, value, onChange, error }) => {
    const fieldConfig = FIELD_TYPES[field.fieldType?.toUpperCase()]

    const renderFieldLabel = () => (
        <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
                {field.fieldLabel}
                {field.required && (
                    <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                        *
                    </Typography>
                )}
            </Typography>
            {field.helpText && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {field.helpText}
                </Typography>
            )}
        </Box>
    )

    const renderError = () => {
        if (!error) return null
        return (
            <FormHelperText error>
                {Array.isArray(error) ? error.join(', ') : error}
            </FormHelperText>
        )
    }

    // TEXT
    if (field.fieldType === 'text') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    size="medium"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    error={!!error}
                    required={field.required}
                    inputProps={{
                        maxLength: field.validation?.maxLength,
                    }}
                />
                {renderError()}
            </Box>
        )
    }

    // TEXTAREA
    if (field.fieldType === 'textarea') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    multiline
                    rows={field.rows || 4}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    error={!!error}
                    required={field.required}
                    inputProps={{
                        maxLength: field.validation?.maxLength,
                    }}
                />
                {field.validation?.maxLength && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {(value || '').length} / {field.validation.maxLength}
                    </Typography>
                )}
                {renderError()}
            </Box>
        )
    }

    // EMAIL
    if (field.fieldType === 'email') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    type="email"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    error={!!error}
                    required={field.required}
                />
                {renderError()}
            </Box>
        )
    }

    // PHONE
    if (field.fieldType === 'phone') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    type="tel"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    error={!!error}
                    required={field.required}
                />
                {renderError()}
            </Box>
        )
    }

    // NUMBER
    if (field.fieldType === 'number') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    error={!!error}
                    required={field.required}
                    inputProps={{
                        min: field.validation?.min,
                        max: field.validation?.max,
                    }}
                />
                {renderError()}
            </Box>
        )
    }

    // DATE
    if (field.fieldType === 'date') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    error={!!error}
                    required={field.required}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                        min: field.validation?.min,
                        max: field.validation?.max,
                    }}
                />
                {renderError()}
            </Box>
        )
    }

    // TIME
    if (field.fieldType === 'time') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    type="time"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    error={!!error}
                    required={field.required}
                    InputLabelProps={{ shrink: true }}
                />
                {renderError()}
            </Box>
        )
    }

    // DATETIME
    if (field.fieldType === 'datetime') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    fullWidth
                    type="datetime-local"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    error={!!error}
                    required={field.required}
                    InputLabelProps={{ shrink: true }}
                />
                {renderError()}
            </Box>
        )
    }

    // DROPDOWN
    if (field.fieldType === 'dropdown') {
        return (
            <Box>
                {renderFieldLabel()}
                <TextField
                    select
                    fullWidth
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    error={!!error}
                    required={field.required}
                >
                    {field.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                {renderError()}
            </Box>
        )
    }

    // RADIO
    if (field.fieldType === 'radio') {
        return (
            <FormControl component="fieldset" error={!!error} required={field.required}>
                {renderFieldLabel()}
                <RadioGroup
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {field.options?.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                        />
                    ))}
                </RadioGroup>
                {renderError()}
            </FormControl>
        )
    }

    // CHECKBOX
    if (field.fieldType === 'checkbox') {
        const selectedValues = Array.isArray(value) ? value : []

        const handleCheckboxChange = (optionValue) => {
            if (selectedValues.includes(optionValue)) {
                onChange(selectedValues.filter(v => v !== optionValue))
            } else {
                onChange([...selectedValues, optionValue])
            }
        }

        return (
            <FormControl component="fieldset" error={!!error} required={field.required}>
                {renderFieldLabel()}
                <FormGroup>
                    {field.options?.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            control={
                                <Checkbox
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => handleCheckboxChange(option.value)}
                                />
                            }
                            label={option.label}
                        />
                    ))}
                </FormGroup>
                {renderError()}
            </FormControl>
        )
    }

    // RATING
    if (field.fieldType === 'rating') {
        return (
            <Box>
                {renderFieldLabel()}
                <Rating
                    value={parseInt(value) || 0}
                    onChange={(e, newValue) => onChange(newValue)}
                    max={field.validation?.max || 5}
                    size="large"
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={<StarIcon fontSize="inherit" />}
                />
                {renderError()}
            </Box>
        )
    }

    // FILE
    if (field.fieldType === 'file') {
        return (
            <Box>
                {renderFieldLabel()}
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ py: 2 }}
                >
                    {value ? `File: ${value.name}` : 'Choose File'}
                    <input
                        type="file"
                        hidden
                        accept={field.validation?.allowedFormats?.map(f => `.${f}`).join(',')}
                        onChange={(e) => onChange(e.target.files[0])}
                    />
                </Button>
                {field.validation?.maxSize && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Max size: {field.validation.maxSize}
                    </Typography>
                )}
                {field.validation?.allowedFormats && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {field.validation.allowedFormats.map(format => (
                            <Chip key={format} label={format} size="small" />
                        ))}
                    </Box>
                )}
                {renderError()}
            </Box>
        )
    }

    // IMAGE
    if (field.fieldType === 'image') {
        return (
            <Box>
                {renderFieldLabel()}
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ py: 2 }}
                >
                    {value ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {value instanceof File && (
                                <img
                                    src={URL.createObjectURL(value)}
                                    alt="Preview"
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                />
                            )}
                            <span>{value.name}</span>
                        </Box>
                    ) : (
                        'Choose Image'
                    )}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files[0])}
                    />
                </Button>
                {renderError()}
            </Box>
        )
    }

    // VIDEO
    if (field.fieldType === 'video') {
        return (
            <Box>
                {renderFieldLabel()}
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ py: 2 }}
                >
                    {value ? `Video: ${value.name}` : 'Choose Video'}
                    <input
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={(e) => onChange(e.target.files[0])}
                    />
                </Button>
                {field.validation?.maxDuration && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Max duration: {field.validation.maxDuration} seconds
                    </Typography>
                )}
                {renderError()}
            </Box>
        )
    }

    // AUDIO
    if (field.fieldType === 'audio') {
        return (
            <Box>
                {renderFieldLabel()}
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ py: 2 }}
                >
                    {value ? `Audio: ${value.name}` : 'Choose Audio'}
                    <input
                        type="file"
                        hidden
                        accept="audio/*"
                        onChange={(e) => onChange(e.target.files[0])}
                    />
                </Button>
                {renderError()}
            </Box>
        )
    }

    // LOCATION
    if (field.fieldType === 'location') {
        return (
            <Box>
                {renderFieldLabel()}
                <Alert severity="info" icon={<LocationIcon />}>
                    Location picker will be implemented in citizen portal
                </Alert>
                <TextField
                    fullWidth
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Latitude, Longitude"
                    error={!!error}
                    required={field.required}
                    sx={{ mt: 2 }}
                />
                {renderError()}
            </Box>
        )
    }

    // Fallback for unknown field types
    return (
        <Alert severity="warning">
            Unsupported field type: {field.fieldType}
        </Alert>
    )
}
