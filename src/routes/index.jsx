import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Auth Pages
import { Login } from '../pages/Auth/Login'
import { RegisterOrganization } from '../pages/Auth/RegisterOrganization'
import { Unauthorized } from '../pages/Unauthorized'

// Layout
import { DashboardLayout } from '../components/Layout/DashboardLayout'
import { ProtectedRoute } from '../components/Auth/ProtectedRoute'

// Dashboard Pages (we'll create these next)
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { Organizations } from '../pages/Organizations/Organizations'
import {OrganizationDetails} from "../pages/Organizations/OrganizationDetails.jsx";
import {TeamManagement} from "../pages/Team/TeamManagement.jsx";
import {InviteAdmin} from "../pages/Team/InviteAdmin.jsx";
import {TeamMemberDetails} from "../pages/Team/TeamMemberDetails.jsx";
import {MyOrganization} from "../pages/Dashboard/MyOrganization.jsx";
import {AcceptInvite} from "../pages/Team/AcceptInvite.jsx";
import {ServicesManagement} from "../pages/Services/ServiceManagement.jsx";
import FeedbackForms from "../pages/FeedbackForms/index.jsx";
import QRCodes from "../pages/QRCodes/index.jsx";
import Distributors from "../pages/Distributors/index.jsx";
import ResponsesPage from "../pages/Responses/ResponsesPage.jsx";
import {ResponseDetailPage} from "../pages/Responses/index.jsx";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage.jsx";
import NotificationSettings from "../pages/Notifications/components/NotificationSettings.jsx";
import NotificationsPage from "../pages/Notifications/NotificationsPage.jsx";

const AppRoutes = () => {
    const { accessToken } = useAuthStore()

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={accessToken ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route path="/register/organization" element={<RegisterOrganization />} />
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - All Admin Panel Routes */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ORG_OWNER', 'ORG_ADMIN']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Platform Admin Only */}
                // In the protected routes section
                <Route
                    path="organizations"
                    element={
                        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}>
                            <Organizations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="organizations/:orgId"
                    element={
                        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}>
                            <OrganizationDetails />
                        </ProtectedRoute>
                    }
                />
                // In the ORG_OWNER protected routes
                <Route
                    path="team"
                    element={
                        <ProtectedRoute allowedRoles={['ORG_OWNER']}>
                            <TeamManagement/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="team/invite"
                    element={
                        <ProtectedRoute allowedRoles={['ORG_OWNER']}>
                            <InviteAdmin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="team/:userId"
                    element={
                        <ProtectedRoute allowedRoles={['ORG_OWNER']}>
                            <TeamMemberDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="my-organization"
                    element={
                        <ProtectedRoute allowedRoles={['ORG_OWNER']}>
                            <MyOrganization />
                        </ProtectedRoute>
                    }
                />



                {/* Platform Admin & Org Owner */}
                <Route
                    path="services"
                    element={
                        <ProtectedRoute allowedRoles={['ORG_ADMIN','ORG_OWNER']}>
                            <ServicesManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Platform Admin & Org Owner */}
                <Route
                    path="responses"
                    element={
                        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ORG_OWNER', 'ORG_ADMIN']}>
                            <ResponsesPage />
                        </ProtectedRoute>
                    }
                />
                {/* Platform Admin & Org Owner */}
                <Route
                    path="responses/:responseId"
                    element={
                        <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ORG_OWNER', 'ORG_ADMIN']}>
                            <ResponseDetailPage />
                        </ProtectedRoute>
                    }
                />
                {/* Platform Admin */}
                {/*<Route*/}
                {/*    path="distributor"*/}
                {/*    element={*/}
                {/*        <ProtectedRoute allowedRoles={['ORG_ADMIN','ORG_O']}>*/}
                {/*        </ProtectedRoute>*/}
                {/*    }*/}
                {/*/>*/}
                <Route path="distributors/*" element={<Distributors />} />
                <Route path='analytics' element={<AnalyticsPage />} />
                <Route path='notifications' element={<NotificationsPage />} />
                <Route path='notifications/settings' element={<NotificationSettings />} />

                {/* All Authenticated Users */}
                <Route path="feedback/*" element={<FeedbackForms />} />
                <Route path="qr/*" element={<QRCodes />} />
                {/*<Route path="responses/*" element={<Responses />} />*/}

                {/* Add more routes as needed */}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default AppRoutes
