import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { TemplateManagement } from './views/TemplateManagement'
import { FormManagement } from './views/FormManagement'
import { CreateForm } from './views/CreateForm'
import { EditForm } from './views/EditForm'
import {useAuthStore} from "../../store/authStore.js";


export const FeedbackForms = () => {
    const { user,role } = useAuthStore()

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <Routes>
                {/* Template Management - Platform Admin Only */}
                {role === 'PLATFORM_ADMIN' && (
                    <Route path="/templates" element={<TemplateManagement />} />
                )}

                {/* Form Management - Org Admin */}
                <Route path="/forms" element={<FormManagement />} />
                <Route path="/forms/create" element={<CreateForm />} />
                <Route path="/forms/edit/:formId" element={<EditForm />} />

                {/* Default redirect */}
                <Route
                    path="/"
                    element={
                        user?.role === 'PLATFORM_ADMIN' ? (
                            <Navigate to="/feedback/templates" replace />
                        ) : (
                            <Navigate to="/feedback/forms" replace />
                        )
                    }
                />
            </Routes>
        </Box>
    )
}

export default FeedbackForms
