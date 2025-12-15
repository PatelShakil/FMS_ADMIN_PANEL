import React from 'react'
import {
    Box,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material'
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useFormBuilder } from '../../hooks/useFormBuilder'
import { FieldPalette } from './FieldPalette'
import { FormCanvas } from './FormCanvas'
import { FieldConfigurator } from './FieldConfigurator'
import { FieldItem } from './FieldItem'

export const FormBuilder = ({ initialFields, onFieldsChange, mode = 'form' }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const {
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
    } = useFormBuilder(initialFields)

    // Update parent when fields change
    React.useEffect(() => {
        // console.log(initialFields)
        if (onFieldsChange) {
            onFieldsChange(fields)
        }
    }, [fields, onFieldsChange])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const [activeId, setActiveId] = React.useState(null)

    const handleDragStart = (event) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active && over && active.id !== over.id) {
            // Check if dragging from palette
            if (typeof active.id === 'string' && active.id.startsWith('palette-')) {
                const fieldType = active.id.replace('palette-', '')
                addField(fieldType)
            } else {
                // Reordering existing fields
                reorderFields(active.id, over.id)
            }
        }

        setActiveId(null)
    }

    const handleDragCancel = () => {
        setActiveId(null)
    }

    if (isMobile) {
        return (
            <Box sx={{ p: 2 }}>
                <Paper sx={{ p: 2, mb: 2 }}>
                    <FieldPalette onAddField={addField} compact />
                </Paper>
                <Paper sx={{ p: 2, mb: 2 }}>
                    <FormCanvas
                        fields={fields}
                        selectedFieldId={selectedFieldId}
                        onSelectField={selectField}
                        onDeleteField={deleteField}
                        onDuplicateField={duplicateField}
                    />
                </Paper>
                {selectedFieldId && (
                    <Paper sx={{ p: 2 }}>
                        <FieldConfigurator
                            field={getSelectedField()}
                            onUpdate={(updates) => updateField(selectedFieldId, updates)}
                            onClose={() => selectField(null)}
                        />
                    </Paper>
                )}
            </Box>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '280px 1fr 320px',
                    gap: 2,
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                {/* Left Panel - Field Palette */}
                <Paper
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                        borderRadius: 2,
                    }}
                >
                    <FieldPalette onAddField={addField} />
                </Paper>

                {/* Center Panel - Form Canvas */}
                <Paper
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                        borderRadius: 2,
                        bgcolor: 'background.default',
                    }}
                >
                    <SortableContext
                        items={fields.map(f => f.fieldId)}
                        strategy={verticalListSortingStrategy}
                    >
                        <FormCanvas
                            fields={fields}
                            selectedFieldId={selectedFieldId}
                            onSelectField={selectField}
                            onDeleteField={deleteField}
                            onDuplicateField={duplicateField}
                        />
                    </SortableContext>
                </Paper>

                {/* Right Panel - Field Configurator */}
                <Paper
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                        borderRadius: 2,
                    }}
                >
                    <FieldConfigurator
                        field={getSelectedField()}
                        onUpdate={(updates) => updateField(selectedFieldId, updates)}
                        onClose={() => selectField(null)}
                    />
                </Paper>
            </Box>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeId ? (
                    <Box
                        sx={{
                            opacity: 0.8,
                            transform: 'rotate(3deg)',
                        }}
                    >
                        <FieldItem
                            field={fields.find(f => f.fieldId === activeId)}
                            isDragging
                        />
                    </Box>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
