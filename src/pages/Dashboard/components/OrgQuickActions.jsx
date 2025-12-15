import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material'
import {
    PersonAdd as InviteIcon,
    Business as OrgIcon,
    People as TeamIcon,
    Settings as SettingsIcon,
    Assessment as AnalyticsIcon,
} from '@mui/icons-material'

export const OrgQuickActions = ({ orgData,totalAdmins }) => {
    const navigate = useNavigate()

    const actions = [
        {
            title: 'Invite Admin',
            subtitle: 'Add new team member',
            icon: <InviteIcon color="primary" />,
            path: '/team/invite',
        },
        {
            title: 'View Team',
            subtitle: `${totalAdmins || 0} members`,
            icon: <TeamIcon color="primary" />,
            path: '/team',
        },
        {
            title: 'Organization Profile',
            subtitle: 'Manage organization details',
            icon: <OrgIcon color="primary" />,
            path: '/my-organization',
        },
        {
            title: 'Analytics',
            subtitle: 'View detailed reports',
            icon: <AnalyticsIcon color="primary" />,
            path: '/analytics',
        },
        // {
        //     title: 'Settings',
        //     subtitle: 'Configure preferences',
        //     icon: <SettingsIcon color="primary" />,
        //     path: '/settings',
        // },
    ]

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Quick Actions
                </Typography>
                <List sx={{ pt: 1 }}>
                    {actions.map((action, index) => (
                        <React.Fragment key={index}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(action.path)}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 0.5,
                                    }}
                                >
                                    <ListItemIcon>{action.icon}</ListItemIcon>
                                    <ListItemText
                                        primary={action.title}
                                        secondary={action.subtitle}
                                    />
                                </ListItemButton>
                            </ListItem>
                            {index < actions.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
}
