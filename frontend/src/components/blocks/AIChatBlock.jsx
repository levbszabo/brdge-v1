import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    IconButton,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Chip,
    Alert
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import DotBridgeButton from '../DotBridgeButton';
import DotBridgeCard from '../DotBridgeCard';
import { useFunnel } from '../../contexts/FunnelContext';

const AIChatBlock = ({
    agentType,
    systemPrompt,
    initialMessage,
    endConversationCtaText = "Generate My Proposal"
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { sessionId, chatHistory, setChatHistory, setProposalData, setCurrentStep } = useFunnel();

    const [currentMessage, setCurrentMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
    const [error, setError] = useState(null);
    const chatContainerRef = useRef(null);

    // Debug logging and fallback for agentType
    const effectiveAgentType = agentType || 'ai_consultant';

    useEffect(() => {
        console.log('AIChatBlock props:', { agentType, effectiveAgentType, systemPrompt, initialMessage });
        if (!agentType) {
            console.warn('AIChatBlock: agentType prop is missing or undefined, falling back to "ai_consultant"');
        }
    }, [agentType, effectiveAgentType, systemPrompt, initialMessage]);

    // Initialize with AI's first message
    useEffect(() => {
        if (chatHistory.length === 0 && initialMessage) {
            setChatHistory([{
                role: 'assistant',
                content: initialMessage,
                timestamp: new Date().toISOString()
            }]);
        }
    }, []);

    // Auto-scroll chat container to bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            // Use a small delay to ensure content is rendered
            const timeoutId = setTimeout(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (!currentMessage.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: currentMessage.trim(),
            timestamp: new Date().toISOString()
        };

        const newChatHistory = [...chatHistory, userMessage];
        setChatHistory(newChatHistory);
        setCurrentMessage('');
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

            const requestBody = {
                sessionId,
                agentType: effectiveAgentType, // Use the fallback value
                history: newChatHistory
            };

            console.log('Sending chat request:', requestBody);

            const response = await fetch(`${apiUrl}/funnels/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to get AI response');
            }

            // Add a placeholder for the assistant's message
            setChatHistory(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                const chunk = decoder.decode(value, { stream: !done });

                // Check for our custom error JSON
                try {
                    const errorJson = JSON.parse(chunk);
                    if (errorJson.error) {
                        setError(errorJson.error);
                        // Remove the empty assistant message
                        setChatHistory(prev => prev.slice(0, -1));
                        return; // Stop processing
                    }
                } catch (e) {
                    // Not a JSON error, process as text
                }

                setChatHistory(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                        const updatedMessage = {
                            ...lastMessage,
                            content: lastMessage.content + chunk
                        };
                        return [...prev.slice(0, -1), updatedMessage];
                    }
                    return prev;
                });
            }

        } catch (err) {
            console.error('Chat error:', err);
            setError('Failed to send message. Please try again.');
            // Remove the empty assistant message if it was added
            setChatHistory(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content === '') {
                    return prev.slice(0, -1);
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateProposal = async () => {
        setIsGeneratingProposal(true);
        setError(null);

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/funnels/generate-proposal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    chatHistory
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate proposal');
            }

            const data = await response.json();
            setProposalData(data);
            setCurrentStep(prev => prev + 1);
        } catch (err) {
            console.error('Proposal generation error:', err);
            setError('Failed to generate proposal. Please try again.');
        } finally {
            setIsGeneratingProposal(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <DotBridgeCard sx={{
            maxWidth: '100%',
            mx: 'auto',
            p: { xs: 1.5, sm: 2.5, md: 3 },
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}10 100%)`,
            border: `1px solid ${theme.palette.primary.light}`,
            borderRadius: { xs: 2, md: 3 },
            height: { xs: '75vh', sm: 830 },
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: { xs: 2, sm: 3 },
                pb: { xs: 1.5, sm: 2 },
                borderBottom: `1px solid ${theme.palette.divider}`,
                flexShrink: 0
            }}>
                <Chip
                    icon={<Sparkles size={isMobile ? 14 : 16} />}
                    label="AI STRATEGIST"
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.light}30 100%)`,
                        color: theme.palette.primary.dark,
                        fontWeight: 600,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        letterSpacing: '0.05em',
                        border: '1px solid',
                        borderColor: theme.palette.primary.light,
                        height: { xs: 28, sm: 32 }
                    }}
                />
            </Box>

            {/* Chat Messages */}
            <Box
                ref={chatContainerRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    mb: { xs: 1.5, sm: 2 },
                    px: { xs: 0.5, sm: 2 },
                    position: 'relative',
                    contain: 'layout style paint',
                    scrollBehavior: 'auto',
                    '&::-webkit-scrollbar': {
                        width: { xs: '4px', sm: '8px' },
                    },
                    '&::-webkit-scrollbar-track': {
                        background: theme.palette.grey[100],
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: theme.palette.grey[400],
                        borderRadius: '4px',
                        '&:hover': {
                            background: theme.palette.grey[600],
                        }
                    }
                }}
            >
                <AnimatePresence>
                    {chatHistory.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box sx={{
                                display: 'flex',
                                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                                mb: { xs: 1.5, sm: 2 }
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: { xs: 1, sm: 1.5 },
                                    maxWidth: { xs: '95%', sm: '85%' },
                                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                                }}>
                                    <Box sx={{
                                        width: { xs: 28, sm: 32 },
                                        height: { xs: 28, sm: 32 },
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: message.role === 'user'
                                            ? theme.palette.primary.main
                                            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        {message.role === 'user' ? <User size={isMobile ? 14 : 18} /> : <Bot size={isMobile ? 14 : 18} />}
                                    </Box>

                                    <Paper sx={{
                                        p: { xs: 1.25, sm: 2 },
                                        background: message.role === 'user'
                                            ? theme.palette.primary.lighter
                                            : theme.palette.background.paper,
                                        border: `1px solid ${message.role === 'user'
                                            ? theme.palette.primary.light
                                            : theme.palette.divider}`,
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        boxShadow: 1
                                    }}>
                                        <Typography variant="body1" sx={{
                                            fontSize: { xs: '0.85rem', sm: '1rem' },
                                            lineHeight: { xs: 1.5, sm: 1.6 },
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {message.content}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: theme.palette.text.secondary,
                        px: { xs: 1, sm: 0 }
                    }}>
                        <CircularProgress size={isMobile ? 14 : 16} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>AI is thinking...</Typography>
                    </Box>
                )}
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: { xs: 1.5, sm: 2 }, flexShrink: 0, mx: { xs: 0.5, sm: 0 } }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Input Area */}
            <Box sx={{
                display: 'flex',
                gap: { xs: 0.75, sm: 1 },
                alignItems: 'flex-end',
                flexShrink: 0,
                px: { xs: 0.5, sm: 0 }
            }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={isMobile ? 3 : 4}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading || isGeneratingProposal}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: { xs: 1.5, sm: 2 },
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            '& .MuiOutlinedInput-input': {
                                py: { xs: 1, sm: 1.5 },
                                px: { xs: 1.25, sm: 1.5 }
                            },
                            '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                            }
                        }
                    }}
                />

                <IconButton
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isLoading || isGeneratingProposal}
                    sx={{
                        background: theme.palette.primary.main,
                        color: 'white',
                        width: { xs: 36, sm: 48 },
                        height: { xs: 36, sm: 48 },
                        '&:hover': {
                            background: theme.palette.primary.dark,
                        },
                        '&:disabled': {
                            background: theme.palette.grey[300],
                        }
                    }}
                >
                    <Send size={isMobile ? 16 : 20} />
                </IconButton>
            </Box>

            {/* Conversation Progress */}
            {chatHistory.length > 1 && (
                <Box sx={{
                    mt: { xs: 1.5, sm: 2 },
                    p: { xs: 1.5, sm: 2 },
                    mx: { xs: 0.5, sm: 0 },
                    background: theme.palette.grey[50],
                    borderRadius: { xs: 1.5, sm: 2 },
                    border: `1px solid ${theme.palette.divider}`,
                    flexShrink: 0
                }}>
                    <Typography variant="body2" sx={{
                        fontWeight: 600,
                        mb: { xs: 0.75, sm: 1 },
                        color: theme.palette.text.secondary,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}>
                        Discovery Progress
                    </Typography>
                    <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Business Goals', threshold: 2 },
                            { label: 'Technical Stack', threshold: 4 },
                            { label: 'Timeline & Budget', threshold: 6 },
                            { label: 'Success Metrics', threshold: 8 }
                        ].map((item, index) => (
                            <Chip
                                key={item.label}
                                label={item.label}
                                size="small"
                                color={chatHistory.length >= item.threshold ? 'primary' : 'default'}
                                variant={chatHistory.length >= item.threshold ? 'filled' : 'outlined'}
                                sx={{
                                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                    height: { xs: 22, sm: 24 }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Generate Proposal Button */}
            {chatHistory.length > 4 && (
                <Box sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center', flexShrink: 0, px: { xs: 0.5, sm: 0 } }}>
                    <DotBridgeButton
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        onClick={handleGenerateProposal}
                        disabled={isGeneratingProposal}
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            px: { xs: 3, sm: 4 },
                            py: { xs: 1.25, sm: 1.5 },
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            fontWeight: 600,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)'
                            }
                        }}
                    >
                        {isGeneratingProposal ? (
                            <>
                                <CircularProgress size={isMobile ? 16 : 20} color="inherit" sx={{ mr: 1 }} />
                                {isMobile ? 'Generating...' : 'Generating Proposal...'}
                            </>
                        ) : (
                            isMobile ? 'Generate Proposal' : endConversationCtaText
                        )}
                    </DotBridgeButton>
                </Box>
            )}
        </DotBridgeCard>
    );
};

export default AIChatBlock; 