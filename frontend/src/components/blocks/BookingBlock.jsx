import React, { useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import DotBridgeButton from '../DotBridgeButton';
import DotBridgeCard from '../DotBridgeCard';
import { useFunnel } from '../../contexts/FunnelContext';

const BookingBlock = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { proposalData, sessionId } = useFunnel();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!proposalData || proposalData.recommendedApproach !== 'live_call') {
        return null;
    }

    const handleBookCall = async () => {
        setIsProcessing(true);

        try {
            // Create order record
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const orderResponse = await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    proposalData,
                    offerType: 'ai-consulting-call'
                })
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            // Get Stripe payment link from environment
            const paymentLink = process.env.REACT_APP_STRIPE_CONSULTING_PAYMENT_LINK;

            if (!paymentLink) {
                throw new Error('Payment link not configured');
            }

            // Build URL with metadata
            const urlParams = new URLSearchParams({
                client_reference_id: orderData.orderId,
                prefilled_email: proposalData.clientEmail || ''
            });

            const fullPaymentUrl = `${paymentLink}?${urlParams.toString()}`;

            // Redirect to payment
            window.location.href = fullPaymentUrl;

        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to process booking. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <DotBridgeCard sx={{
                width: '100%',
                p: { xs: 2, sm: 3, md: 4 },
                textAlign: 'center',
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
                    <Calendar size={40} color="white" />
                </Box>

                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}>
                    Book Your 60-Min Strategy Call
                </Typography>

                <Typography variant="body1" sx={{
                    mb: 1,
                    color: theme.palette.text.secondary,
                    lineHeight: 1.6
                }}>
                    Ready to transform your AI project vision into reality?
                </Typography>

                <Typography variant="h5" sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    mb: 4
                }}>
                    Investment: ${(proposalData.priceCents / 100).toFixed(0)}
                </Typography>

                <DotBridgeButton
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleBookCall}
                    disabled={isProcessing}
                    endIcon={!isProcessing && <ArrowRight size={20} />}
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
                        }
                    }}
                >
                    {isProcessing ? (
                        <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Processing...
                        </>
                    ) : (
                        'Pay & Book Now'
                    )}
                </DotBridgeButton>

                <Typography variant="caption" sx={{
                    display: 'block',
                    mt: 2,
                    color: theme.palette.text.secondary
                }}>
                    You'll be redirected to secure payment and calendar booking
                </Typography>
            </DotBridgeCard>
        </motion.div>
    );
};

export default BookingBlock; 