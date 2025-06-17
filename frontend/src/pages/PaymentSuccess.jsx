import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Mail, Calendar, Rocket } from 'lucide-react';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import Footer from '../components/Footer';

const SUCCESS_CONFIG = {
    'career-accelerator': {
        title: 'Your Career Acceleration System is Now Being Built',
        message: 'Thank you for your investment in your career future. Our team is already working on your personalized job search strategy.',
        icon: <Rocket size={64} />,
        nextSteps: [
            'Check your email for order confirmation and next steps',
            'Our team will begin building your custom materials within 24 hours',
            'You\'ll receive your complete Career Acceleration package within 72 hours',
            'Access your client dashboard to track progress'
        ],
        dashboardCta: 'View My Dashboard'
    },
    'ai-consulting-call': {
        title: 'Your AI Strategy Call is Booked!',
        message: 'Thank you for your payment. Please check your email for a calendar invitation and a link to our pre-call questionnaire.',
        icon: <Calendar size={64} />,
        nextSteps: [
            'Check your email for your calendar invitation',
            'Complete the pre-call questionnaire (takes 5 minutes)',
            'Review the AI strategy preparation guide we\'ve sent',
            'Join the call 5 minutes early to test your connection'
        ],
        dashboardCta: 'Access Resources'
    },
    'ai-consulting-async': {
        title: 'Your AI Project is Queued!',
        message: 'We\'ve received your project requirements and payment. Our AI engineering team will begin work within 24 hours.',
        icon: <Clock size={64} />,
        nextSteps: [
            'Check your email for project confirmation and timeline',
            'Our project manager will reach out within 24 hours',
            'You\'ll receive regular updates on your project progress',
            'Access your client dashboard to communicate with the team'
        ],
        dashboardCta: 'Track My Project'
    }
};

const PaymentSuccess = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderData, setOrderData] = useState(null);

    const offerSlug = searchParams.get('offer_slug');
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                if (!sessionId) {
                    throw new Error('No session ID provided');
                }

                // Verify payment with backend
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${apiUrl}/verify-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId })
                });

                if (!response.ok) {
                    throw new Error('Payment verification failed');
                }

                const data = await response.json();
                setOrderData(data);
            } catch (err) {
                console.error('Payment verification error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    // Get configuration based on offer slug
    const config = SUCCESS_CONFIG[offerSlug] || SUCCESS_CONFIG['ai-consulting-call'];

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Container maxWidth="md" sx={{ py: 8 }}>
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                    <DotBridgeButton
                        variant="contained"
                        onClick={() => navigate('/')}
                    >
                        Return to Home
                    </DotBridgeButton>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="md" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <Paper sx={{
                        p: { xs: 4, sm: 6, md: 8 },
                        textAlign: 'center',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.success.main}05 100%)`,
                        border: `2px solid ${theme.palette.success.main}`,
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: theme.palette.success.main
                        }
                    }}>
                        {/* Success Icon */}
                        <Box sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 4,
                            color: 'white',
                            boxShadow: `0 12px 40px ${theme.palette.success.main}40`
                        }}>
                            {config.icon}
                        </Box>

                        {/* Success Message */}
                        <DotBridgeTypography variant="h3" sx={{
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.success.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {config.title}
                        </DotBridgeTypography>

                        <Typography variant="h6" sx={{
                            mb: 4,
                            color: theme.palette.text.secondary,
                            lineHeight: 1.6,
                            maxWidth: '600px',
                            mx: 'auto'
                        }}>
                            {config.message}
                        </Typography>

                        {/* Next Steps */}
                        <Box sx={{
                            maxWidth: '600px',
                            mx: 'auto',
                            mb: 4,
                            textAlign: 'left'
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <CheckCircle size={24} color={theme.palette.success.main} />
                                Your Next Steps
                            </Typography>

                            <List>
                                {config.nextSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <Box sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    background: theme.palette.success.main,
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700
                                                }}>
                                                    {index + 1}
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText primary={step} />
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </List>
                        </Box>

                        {/* CTA Buttons */}
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <DotBridgeButton
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/dashboard')}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                {config.dashboardCta}
                            </DotBridgeButton>

                            <DotBridgeButton
                                variant="outlined"
                                size="large"
                                onClick={() => window.location.href = 'mailto:support@dotbridge.com'}
                                startIcon={<Mail size={20} />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                Contact Support
                            </DotBridgeButton>
                        </Box>

                        {/* Order Details */}
                        {orderData && (
                            <Box sx={{
                                mt: 4,
                                pt: 4,
                                borderTop: `1px solid ${theme.palette.divider}`,
                                color: theme.palette.text.secondary,
                                fontSize: '0.875rem'
                            }}>
                                <Typography variant="caption">
                                    Order ID: {orderData.orderId} | Amount: ${orderData.amount / 100}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </motion.div>
            </Container>
            <Footer />
        </Box>
    );
};

export default PaymentSuccess; 