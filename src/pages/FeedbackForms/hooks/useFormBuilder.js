import { useState, useCallback, useMemo } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { STARTER_FIELDS, DEFAULT_FORM_SETTINGS, FIELD_TYPES } from '../constants/formConstants'

export const useFormBuilder = (initialFields = STARTER_FIELDS, initialSettings = DEFAULT_FORM_SETTINGS) => {
    // Initialize state only once with useMemo
    const [fields, setFields] = useState(() => initialFields)
    const [selectedFieldId, setSelectedFieldId] = useState(null)
    const [formSettings, setFormSettings] = useState(() => initialSettings)

    // Generate unique field ID
    const generateFieldId = useCallback(() => {
        return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }, [])

    // Add field to canvas
    const addField = useCallback((fieldType) => {
        const fieldConfig = FIELD_TYPES[fieldType.toUpperCase()]
        if (!fieldConfig) return

        setFields(prevFields => {
            const newField = {
                fieldId: generateFieldId(),
                fieldName: `${fieldConfig.value}_${Date.now()}`,
                fieldLabel: fieldConfig.label,
                fieldType: fieldConfig.value,
                required: false,
                order: prevFields.length + 1,
                placeholder: fieldConfig.defaultProps?.placeholder || '',
                helpText: '',
                defaultValue: '',
                validation: {},
                ...(fieldConfig.requiresOptions && {
                    options: fieldConfig.defaultOptions || []
                }),
            }

            setSelectedFieldId(newField.fieldId)
            return [...prevFields, newField]
        })
    }, [generateFieldId])

    // Update field
    const updateField = useCallback((fieldId, updates) => {
        setFields(prevFields =>
            prevFields.map(field =>
                field.fieldId === fieldId
                    ? { ...field, ...updates }
                    : field
            )
        )
    }, [])

    // Delete field
    const deleteField = useCallback((fieldId) => {
        setFields(prevFields => prevFields.filter(field => field.fieldId !== fieldId))
        setSelectedFieldId(prev => prev === fieldId ? null : prev)
    }, [])

    // Duplicate field
    const duplicateField = useCallback((fieldId) => {
        setFields(prevFields => {
            const fieldToDuplicate = prevFields.find(f => f.fieldId === fieldId)
            if (!fieldToDuplicate) return prevFields

            const newField = {
                ...fieldToDuplicate,
                fieldId: generateFieldId(),
                fieldName: `${fieldToDuplicate.fieldName}_copy`,
                fieldLabel: `${fieldToDuplicate.fieldLabel} (Copy)`,
                order: prevFields.length + 1,
            }

            setSelectedFieldId(newField.fieldId)
            return [...prevFields, newField]
        })
    }, [generateFieldId])

    // Reorder fields
    const reorderFields = useCallback((activeId, overId) => {
        setFields(prevFields => {
            const oldIndex = prevFields.findIndex(f => f.fieldId === activeId)
            const newIndex = prevFields.findIndex(f => f.fieldId === overId)

            if (oldIndex === -1 || newIndex === -1) return prevFields

            const reordered = arrayMove(prevFields, oldIndex, newIndex)
            return reordered.map((field, index) => ({
                ...field,
                order: index + 1,
            }))
        })
    }, [])

    // Select field
    const selectField = useCallback((fieldId) => {
        setSelectedFieldId(fieldId)
    }, [])

    // Get selected field (memoized)
    const getSelectedField = useCallback(() => {
        return fields.find(f => f.fieldId === selectedFieldId)
    }, [fields, selectedFieldId])

    // Clear all fields
    const clearAllFields = useCallback(() => {
        setFields([])
        setSelectedFieldId(null)
    }, [])

    // Reset to starter fields
    const resetToStarter = useCallback(() => {
        setFields([...STARTER_FIELDS])
        setSelectedFieldId(null)
    }, [])

    return {
        fields,
        setFields,
        selectedFieldId,
        formSettings,
        setFormSettings,
        addField,
        updateField,
        deleteField,
        duplicateField,
        reorderFields,
        selectField,
        getSelectedField,
        clearAllFields,
        resetToStarter,
    }
}
