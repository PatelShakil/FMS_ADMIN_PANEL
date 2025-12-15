import React, { useState, useEffect, useRef } from 'react'
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    CircularProgress,
    Alert,
} from '@mui/material'
import {
    Send as SendIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { qrService } from '../../../../api/services/qrService'
import { useAuthStore } from '../../../../store/authStore'
import { POLLING_INTERVALS, MESSAGE_SENDER_TYPE } from '../../constants/qrConstants'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export const QRChatPanel = ({ distributor,qrCode }) => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const messagesEndRef = useRef(null)
    const [message, setMessage] = useState('')

    // Fetch messages with polling
    const { data: messagesData, isLoading } = useQuery({
        queryKey: ['qr-messages', qrCode.qrCodeId],
        queryFn: () => qrService.getMessages(qrCode.qrCodeId),
        refetchInterval: POLLING_INTERVALS.MESSAGES, // 30 seconds
        enabled: !!qrCode.assignedTo,
    })

    const messages = messagesData?.data?.messages || []

    // Send message mutation
    const sendMutation = useMutation({
        mutationFn: (data) => qrService.sendMessage(qrCode.qrCodeId, data),
        onSuccess: () => {
            setMessage('')
            queryClient.invalidateQueries(['qr-messages', qrCode.qrCodeId])
            queryClient.invalidateQueries(['unread-messages'])
            scrollToBottom()
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Failed to send message')
        },
    })

    // Mark messages as read
    useEffect(() => {
        messages.forEach((msg) => {
            if (!msg.isRead && msg.senderType !== MESSAGE_SENDER_TYPE.ADMIN) {
                qrService.markMessageAsRead(msg.messageId).catch(() => {})
            }
        })
    }, [messages])

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (!message.trim()) return

        sendMutation.mutate({
            message: message.trim(),
        })
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!qrCode.assignedTo) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
                <Alert severity="info">
                    Chat will be available after assigning this QR code to a distributor.
                </Alert>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
            }}
        >
            {/* Chat Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                    bgcolor: 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:"between", gap: 2 }}>
                    <Avatar>{distributor?.data?.fullName?.charAt(0) || 'D'}</Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                            {distributor?.data?.fullName || 'Distributor'}
                        </Typography>
                        <Typography variant="caption" color={"text.secondary"}>
                            {distributor?.data?.phone || 'Phone No.'}
                        </Typography>

                    </Box>
                    <Typography variant="caption" color="text.secondary">
                    QR: {qrCode?.qrCodeName}
                </Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={() => queryClient.invalidateQueries(['qr-messages', qrCode.qrCodeId])}
                >
                    <RefreshIcon />
                </IconButton>
            </Box>

            {/* Messages Container */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : messages.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            gap: 1,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No messages yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start the conversation with the distributor
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {messages.map((msg) => {
                            const isAdmin = msg.senderType.includes(MESSAGE_SENDER_TYPE.ADMIN)
                            const isMe = isAdmin

                            return (
                                <Box
                                    key={msg.messageId}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                p: 2,
                                                bgcolor: isMe ? 'primary.main' : 'background.paper',
                                                color: isMe ? 'primary.contrastText' : 'text.primary',
                                                borderRadius: 2,
                                                borderTopRightRadius: isMe ? 0 : 2,
                                                borderTopLeftRadius: isMe ? 2 : 0,
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {msg.messageText}
                                            </Typography>
                                        </Paper>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ px: 1, textAlign: isMe ? 'right' : 'left' }}
                                        >
                                            {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                                        </Typography>
                                    </Box>
                                </Box>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </Box>

            {/* Message Input */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        multiline
                        maxRows={4}
                        disabled={sendMutation.isLoading}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sendMutation.isLoading}
                    >
                        {sendMutation.isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <SendIcon />
                        )}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}
