import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import {
    useChat,
    useVoiceAssistant,
    useConnectionState,
} from "@livekit/components-react";

const ChatMessage = ({ name, message, isSelf, isTranscription, final }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            pt: 2,
            mb: 2
        }}>
            <Typography
                variant="caption"
                sx={{
                    color: isSelf ? 'text.secondary' : '#00e5ff',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    opacity: isTranscription && !final ? 0.8 : 1
                }}
            >
                {isTranscription ? `${name} (${final ? 'Final' : 'Live'})` : name}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: isSelf ? '#fff' : '#00e5ff',
                    whiteSpace: 'pre-line',
                    opacity: isTranscription && !final ? 0.8 : 1
                }}
            >
                {message}
                {isTranscription && !final ? '...' : ''}
            </Typography>
        </Box>
    );
};

const Chat = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const { messages = [], send: sendMessage } = useChat() || {};
    const { state, agentTranscriptions } = useVoiceAssistant();
    const [allMessages, setAllMessages] = useState([]);
    const connectionState = useConnectionState();

    useEffect(() => {
        if (!agentTranscriptions) return;

        const segments = Array.isArray(agentTranscriptions)
            ? agentTranscriptions
            : (agentTranscriptions.segments || []);

        const newMessages = segments.map((segment, index) => {
            const text = typeof segment === 'object' ? segment.text : segment;
            const final = typeof segment === 'object' ? segment.final : true;
            const id = typeof segment === 'object' ? segment.id : index;

            return {
                id,
                name: 'Agent',
                message: text,
                isSelf: false,
                timestamp: Date.now() - (segments.length - index),
                isTranscription: true,
                final
            };
        }).filter(msg => msg.message);

        setAllMessages(prevMessages => {
            const chatOnlyMessages = prevMessages.filter(msg => !msg.isTranscription);
            return [...newMessages, ...chatOnlyMessages].sort((a, b) => a.timestamp - b.timestamp);
        });
    }, [agentTranscriptions]);

    useEffect(() => {
        if (!messages?.length) return;

        setAllMessages(prevMessages => {
            const transcriptMessages = prevMessages.filter(msg => msg.isTranscription);
            const newChatMessages = messages.map(msg => ({
                name: msg.from?.name || 'Agent',
                message: msg.message,
                isSelf: !msg.from?.isAgent,
                timestamp: msg.timestamp,
                isTranscription: false
            }));

            return [...transcriptMessages, ...newChatMessages]
                .sort((a, b) => a.timestamp - b.timestamp);
        });
    }, [messages]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [allMessages]);

    const handleSend = async () => {
        if (!message.trim() || !sendMessage) return;

        if (connectionState !== 'connected') {
            setError('Cannot send message: Not connected to the server');
            return;
        }

        try {
            setError('');
            await sendMessage(message);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isDisabled = state === 'speaking' || connectionState !== 'connected';

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: 1
        }}>
            <Box sx={{
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                    CHAT {state && `(${state})`}
                </Typography>
                {connectionState !== 'connected' && (
                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                        Not connected to server
                    </Typography>
                )}
            </Box>

            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {allMessages.length > 0 ? (
                    allMessages.map((msg, index) => (
                        <ChatMessage
                            key={msg.id || `${index}-${msg.timestamp}-${msg.message}`}
                            name={msg.name}
                            message={msg.message}
                            isSelf={msg.isSelf}
                            isTranscription={msg.isTranscription}
                            final={msg.final}
                        />
                    ))
                ) : (
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>
                        No messages yet
                    </Typography>
                )}
            </Box>

            {error && (
                <Typography
                    sx={{
                        color: 'error.main',
                        px: 2,
                        py: 1,
                        textAlign: 'center',
                        fontSize: '0.875rem'
                    }}
                >
                    {error}
                </Typography>
            )}

            <Box sx={{
                p: 2,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: 1
            }}>
                <TextField
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isDisabled ? "Cannot send messages while disconnected" : "Type a message"}
                    variant="outlined"
                    size="small"
                    disabled={isDisabled}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& fieldset': {
                                borderColor: 'rgba(255,255,255,0.1)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(255,255,255,0.2)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#00e5ff',
                            },
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'rgba(255,255,255,0.5)',
                        },
                    }}
                />
                <Button
                    onClick={handleSend}
                    disabled={isDisabled || !message.trim()}
                    variant="contained"
                    sx={{
                        backgroundColor: '#00e5ff',
                        color: '#000',
                        '&:hover': {
                            backgroundColor: '#33eaff',
                        },
                        '&.Mui-disabled': {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.3)',
                        },
                    }}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat; 