import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    IconButton,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    Chip,
    Alert,
} from '@mui/material'
import {
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
} from '@mui/icons-material'
import { FIELD_TYPES } from '../../constants/formConstants'

export const FieldConfigurator = ({ field, onUpdate, onClose }) => {
    const [localField, setLocalField] = useState(field || {})
    const [newOption, setNewOption] = useState({ value: '', label: '' })

    useEffect(() => {
        setLocalField(field || {})
    }, [field])

    if (!field) {
        return (
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Field Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Select a field from the canvas to edit its properties
                </Typography>
            </Box>
        )
    }

    const fieldConfig = FIELD_TYPES[field.fieldType?.toUpperCase()] || {}

    const handleChange = (key, value) => {
        const updated = { ...localField, [key]: value }
        setLocalField(updated)
        onUpdate(updated)
    }

    const handleValidationChange = (key, value) => {
        const updated = {
            ...localField,
            validation: {
                ...localField.validation,
                [key]: value,
            },
        }
        setLocalField(updated)
        onUpdate(updated)
    }

    const handleAddOption = () => {
        if (!newOption.value || !newOption.label) return

        const updated = {
            ...localField,
            options: [...(localField.options || []), { ...newOption }],
        }
        setLocalField(updated)
        onUpdate(updated)
        setNewOption({ value: '', label: '' })
    }

    const handleRemoveOption = (index) => {
        const updated = {
            ...localField,
            options: localField.options.filter((_, i) => i !== index),
        }
        setLocalField(updated)
        onUpdate(updated)
    }

    const handleUpdateOption = (index, key, value) => {
        const updated = {
            ...localField,
            options: localField.options.map((opt, i) =>
                i === index ? { ...opt, [key]: value } : opt
            ),
        }
        setLocalField(updated)
        onUpdate(updated)
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>
                        Field Properties
                    </Typography>
                    {onClose && (
                        <IconButton size="small" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography fontSize={24}>{fieldConfig.icon}</Typography>
                    <Chip
                        label={fieldConfig.label}
                        size="small"
                        sx={{
                            bgcolor: `${FIELD_TYPES[field.fieldType?.toUpperCase()]?.category}20`,
                        }}
                    />
                </Box>
            </Box>

            {/* Configuration Form */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {/* Basic Properties */}
                <Accordion defaultExpanded disableGutters elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            Basic Properties
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Field Label"
                                fullWidth
                                size="small"
                                required
                                value={localField.fieldLabel || ''}
                                onChange={(e) => handleChange('fieldLabel', e.target.value)}
                                helperText="Displayed to users"
                            />

                            <TextField
                                label="Field Name (Internal)"
                                fullWidth
                                size="small"
                                required
                                value={localField.fieldName || ''}
                                onChange={(e) => handleChange('fieldName', e.target.value)}
                                helperText="Used in data storage (no spaces)"
                            />

                            <TextField
                                label="Placeholder"
                                fullWidth
                                size="small"
                                value={localField.placeholder || ''}
                                onChange={(e) => handleChange('placeholder', e.target.value)}
                                helperText="Hint text shown in empty field"
                            />

                            <TextField
                                label="Help Text"
                                fullWidth
                                size="small"
                                multiline
                                rows={2}
                                value={localField.helpText || ''}
                                onChange={(e) => handleChange('helpText', e.target.value)}
                                helperText="Additional guidance for users"
                            />

                            <TextField
                                label="Default Value"
                                fullWidth
                                size="small"
                                value={localField.defaultValue || ''}
                                onChange={(e) => handleChange('defaultValue', e.target.value)}
                                helperText="Pre-filled value"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={localField.required || false}
                                        onChange={(e) => handleChange('required', e.target.checked)}
                                    />
                                }
                                label="Required Field"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Options (for choice fields) */}
                {fieldConfig.requiresOptions && (
                    <Accordion disableGutters elevation={0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Options ({localField.options?.length || 0})
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Existing Options */}
                                {localField.options && localField.options.length > 0 && (
                                    <List disablePadding>
                                        {localField.options.map((option, index) => (
                                            <ListItem
                                                key={index}
                                                sx={{
                                                    p: 1,
                                                    border: 1,
                                                    borderColor: 'divider',
                                                    borderRadius: 1,
                                                    mb: 1,
                                                }}
                                            >
                                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <TextField
                                                        label="Value"
                                                        size="small"
                                                        fullWidth
                                                        value={option.value}
                                                        onChange={(e) =>
                                                            handleUpdateOption(index, 'value', e.target.value)
                                                        }
                                                    />
                                                    <TextField
                                                        label="Label"
                                                        size="small"
                                                        fullWidth
                                                        value={option.label}
                                                        onChange={(e) =>
                                                            handleUpdateOption(index, 'label', e.target.value)
                                                        }
                                                    />
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveOption(index)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}

                                {/* Add New Option */}
                                <Box>
                                    <Typography variant="caption" fontWeight={600} gutterBottom display="block">
                                        Add New Option
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <TextField
                                            label="Value"
                                            size="small"
                                            fullWidth
                                            value={newOption.value}
                                            onChange={(e) =>
                                                setNewOption({ ...newOption, value: e.target.value })
                                            }
                                        />
                                        <TextField
                                            label="Label"
                                            size="small"
                                            fullWidth
                                            value={newOption.label}
                                            onChange={(e) =>
                                                setNewOption({ ...newOption, label: e.target.value })
                                            }
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddOption}
                                            disabled={!newOption.value || !newOption.label}
                                        >
                                            Add Option
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Validation Rules */}
                {fieldConfig.validation && fieldConfig.validation.length > 0 && (
                    <Accordion disableGutters elevation={0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Validation Rules
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {fieldConfig.validation.includes('minLength') && (
                                    <TextField
                                        label="Minimum Length"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.minLength || ''}
                                        onChange={(e) =>
                                            handleValidationChange('minLength', parseInt(e.target.value) || '')
                                        }
                                    />
                                )}

                                {fieldConfig.validation.includes('maxLength') && (
                                    <TextField
                                        label="Maximum Length"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.maxLength || ''}
                                        onChange={(e) =>
                                            handleValidationChange('maxLength', parseInt(e.target.value) || '')
                                        }
                                    />
                                )}

                                {fieldConfig.validation.includes('min') && (
                                    <TextField
                                        label="Minimum Value"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.min ?? ''}
                                        onChange={(e) =>
                                            handleValidationChange('min', parseFloat(e.target.value) || '')
                                        }
                                    />
                                )}

                                {fieldConfig.validation.includes('max') && (
                                    <TextField
                                        label="Maximum Value"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.max ?? ''}
                                        onChange={(e) =>
                                            handleValidationChange('max', parseFloat(e.target.value) || '')
                                        }
                                    />
                                )}

                                {fieldConfig.validation.includes('pattern') && (
                                    <TextField
                                        label="Pattern (Regex)"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.pattern || ''}
                                        onChange={(e) => handleValidationChange('pattern', e.target.value)}
                                        helperText="Regular expression for validation"
                                    />
                                )}

                                {fieldConfig.validation.includes('maxSize') && (
                                    <TextField
                                        label="Max File Size"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.maxSize || ''}
                                        onChange={(e) => handleValidationChange('maxSize', e.target.value)}
                                        helperText="e.g., 5MB, 10MB"
                                    />
                                )}

                                {fieldConfig.validation.includes('allowedFormats') && (
                                    <TextField
                                        label="Allowed Formats"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.allowedFormats?.join(', ') || ''}
                                        onChange={(e) =>
                                            handleValidationChange(
                                                'allowedFormats',
                                                e.target.value.split(',').map((f) => f.trim())
                                            )
                                        }
                                        helperText="Comma-separated (e.g., jpg, png, pdf)"
                                    />
                                )}

                                {fieldConfig.validation.includes('maxDuration') && (
                                    <TextField
                                        label="Max Duration (seconds)"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={localField.validation?.maxDuration || ''}
                                        onChange={(e) =>
                                            handleValidationChange('maxDuration', parseInt(e.target.value) || '')
                                        }
                                    />
                                )}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Help Alert */}
                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                        Changes are saved automatically as you type
                    </Typography>
                </Alert>
            </Box>
        </Box>
    )
}
