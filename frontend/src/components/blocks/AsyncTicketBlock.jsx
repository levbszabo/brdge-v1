import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Alert,
    Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import DotBridgeButton from '../DotBridgeButton';
import DotBridgeCard from '../DotBridgeCard';
import { useFunnel } from '../../contexts/FunnelContext';

// NOTE: Pricing structure updated to $1,999-$4,999 for async projects
// Make sure REACT_APP_STRIPE_ASYNC_PAYMENT_LINK is configured for new pricing

const AsyncTicketBlock = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { proposalData, sessionId, chatHistory } = useFunnel();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        additionalNotes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    if (!proposalData) {
        return null;
    }

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email) {
            setError('Please enter your name and email address');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Submit AI consulting lead
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const leadResponse = await fetch(`${apiUrl}/ai-consulting/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    name: formData.name,
                    email: formData.email,
                    additionalNotes: formData.additionalNotes,
                    proposalData,
                    chatHistory,
                    source: 'ai_consulting_funnel'
                })
            });

            if (!leadResponse.ok) {
                const errorData = await leadResponse.json();
                throw new Error(errorData.error || 'Failed to submit request');
            }

            // Show success state
            setIsSubmitted(true);

        } catch (error) {
            console.error('Submission error:', error);
            setError('Failed to submit your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <DotBridgeCard sx={{
                    width: '100%',
                    p: { xs: 2, sm: 3, md: 4 },
                    background: `linear-gradient(135deg, ${theme.palette.success.main}05 0%, ${theme.palette.success.main}10 100%)`,
                    border: `2px solid ${theme.palette.success.main}`,
                    borderRadius: { xs: 2, md: 3 },
                    textAlign: 'center'
                }}>
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: `0 8px 32px ${theme.palette.success.main}40`
                    }}>
                        <CheckCircle size={40} color="white" />
                    </Box>

                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                    }}>
                        Request Submitted Successfully!
                    </Typography>

                    <Typography variant="body1" sx={{
                        mb: 3,
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6
                    }}>
                        Thank you for your interest, {formData.name}. Our team will review your requirements
                        and send you a detailed proposal within 24 hours.
                    </Typography>

                    <Typography variant="body2" sx={{
                        color: theme.palette.text.secondary
                    }}>
                        We'll reach out to you at: <strong>{formData.email}</strong>
                    </Typography>
                </DotBridgeCard>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <DotBridgeCard sx={{
                width: '100%',
                p: { xs: 2, sm: 3, md: 4 },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.primary.main}10 100%)`,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: { xs: 2, md: 3 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: `0 8px 32px ${theme.palette.primary.main}40`
                }}>
                    <Briefcase size={40} color="white" />
                </Box>

                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}>
                    Let's Get Started
                </Typography>

                <Typography variant="body1" sx={{
                    mb: 4,
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6
                }}>
                    Share your contact details and any additional context.
                    We'll review your requirements and send you a detailed proposal within 24 hours.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Your Name"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        required
                        disabled={isSubmitting}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                }
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Your Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                        disabled={isSubmitting}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                }
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Additional Notes (Optional)"
                        multiline
                        rows={4}
                        value={formData.additionalNotes}
                        onChange={handleInputChange('additionalNotes')}
                        disabled={isSubmitting}
                        placeholder="Any specific requirements, timeline constraints, budget considerations, or questions you'd like to discuss..."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                }
                            }
                        }}
                    />
                </Box>

                <Box sx={{
                    p: 2,
                    mb: 3,
                    background: theme.palette.grey[50],
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center'
                }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        No payment required now • Free consultation • Custom pricing based on your needs
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Chip label="24-hour response" size="small" />
                        <Chip label="Flexible packages" size="small" />
                        <Chip label="Enterprise-ready" size="small" />
                    </Box>
                </Box>

                <DotBridgeButton
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.email || !formData.name}
                    endIcon={!isSubmitting && <ArrowRight size={20} />}
                    sx={{
                        py: 2,
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: '0 8px 32px rgba(0, 102, 255, 0.3)',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(0, 102, 255, 0.4)'
                        },
                        '&:disabled': {
                            background: theme.palette.grey[400]
                        }
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Submitting...
                        </>
                    ) : (
                        'Submit Request'
                    )}
                </DotBridgeButton>

                <Typography variant="caption" sx={{
                    display: 'block',
                    mt: 2,
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                }}>
                    We respect your privacy • No spam • Unsubscribe anytime
                </Typography>
            </DotBridgeCard>
        </motion.div>
    );
};

export default AsyncTicketBlock; 