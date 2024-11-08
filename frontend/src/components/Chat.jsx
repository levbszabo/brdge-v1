import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import {
    ChatMessage as ComponentsChatMessage,
    useChat,
    useVoiceAssistant,
} from "@livekit/components-react";

const ChatMessage = ({ name, message, isSelf }) => {
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
                    fontWeight: 500
                }}
            >
                {name}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: isSelf ? '#fff' : '#00e5ff',
                    whiteSpace: 'pre-line'
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

const Chat = () => {
    const [message, setMessage] = useState('');
    const containerRef = useRef(null);
    const { messages = [], send: sendMessage } = useChat() || {};
    const voiceAssistant = useVoiceAssistant();

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (message.trim() && sendMessage) {
            try {
                await sendMessage(message);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Format LiveKit messages to match our component's format
    const formattedMessages = messages?.map(msg => ({
        name: msg.from?.name || 'Agent',
        message: msg.message,
        isSelf: !msg.from?.isAgent,
        timestamp: msg.timestamp
    })) || [];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: 1
        }}>
            {/* Chat Header */}
            <Box sx={{
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <Typography variant="h6" sx={{ color: '#fff' }}>
                    CHAT
                </Typography>
            </Box>

            {/* Messages Container */}
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
                {formattedMessages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        name={msg.name}
                        message={msg.message}
                        isSelf={msg.isSelf}
                    />
                ))}
            </Box>

            {/* Input Area */}
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
                    placeholder="Type a message"
                    variant="outlined"
                    size="small"
                    disabled={voiceAssistant.state === 'speaking'}
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
                    disabled={!message.trim() || voiceAssistant.state === 'speaking'}
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