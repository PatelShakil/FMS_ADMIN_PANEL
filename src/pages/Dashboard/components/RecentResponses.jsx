import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Divider,
    Box,
} from '@mui/material'
import { Visibility as VisibilityIcon } from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'

const STATUS_COLORS = {
    PENDING: 'warning',
    REVIEWED: 'info',
    RESOLVED: 'success',
    REJECTED: 'error',
    SPAM: 'default',
}

export const RecentResponses = ({ data }) => {
    const navigate = useNavigate()

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Recent Responses
                </Typography>

                {data && data.length > 0 ? (
                    <List sx={{ mt: 1 }}>
                        {data.map((response, index) => (
                            <React.Fragment key={response.responseId}>
                                <ListItem
                                    sx={{
                                        px: 0,
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                            borderRadius: 1,
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight={500}>
                                                {response.responseId || 'Form Response'}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDistanceToNow(new Date(response.submittedAt), {
                                                        addSuffix: true,
                                                    })}
                                                </Typography>
                                                {response.citizenEmail && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                        • {response.citizenEmail}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Chip
                                            label={response.status}
                                            size="small"
                                            color={STATUS_COLORS[response.status]}
                                            sx={{ mr: 1 }}
                                        />
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={() => navigate(`/responses/${response.responseId}`)}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < data.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No recent responses
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}
