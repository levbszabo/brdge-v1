import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Divider, Chip } from '@mui/material';
import { CheckCircle, Clock, Mail, Sparkles, User, ArrowRight, Shield } from 'lucide-react';
import DotBridgeTypography from '../components/DotBridgeTypography';
import { useTheme } from '@mui/material/styles';

const PaymentSuccessCareer = () => {
    const theme = useTheme();
    const [purchaseData, setPurchaseData] = useState(null);

    useEffect(() => {
        const transactionId = `dotbridge_${Date.now()}`;

        // Retrieve stored purchase data
        const storedData = localStorage.getItem('dotbridge_purchase_data');
        if (storedData) {
            setPurchaseData(JSON.parse(storedData));
            // Clear it after use
            localStorage.removeItem('dotbridge_purchase_data');
        }

        // Track successful purchase
        if (typeof window.gtag !== 'undefined') {
            // GA4 Purchase tracking
            window.gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: 299,
                currency: 'USD',
                items: [{
                    item_id: 'career_playbook_complete',
                    item_name: 'DotBridge Career Acceleration System',
                    quantity: 1,
                    price: 299
                }]
            });

            // Google Ads conversion tracking
            window.gtag('event', 'conversion', {
                send_to: 'AW-11258450970/2lmaCL-GyNsaEJgoufgp',
                value: 299.00,
                currency: 'USD',
                transaction_id: transactionId
            });
        }
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            {/* Main Success Card */}
            <Card sx={{
                p: { xs: 3, md: 5 },
                textAlign: 'center',
                background: `linear-gradient(135deg, #dcfce7 0%, #dbeafe 50%, #ffffff 100%)`,
                border: `2px solid #059669`,
                borderRadius: 4,
                boxShadow: `0 20px 60px rgba(5, 150, 105, 0.2)`,
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: `linear-gradient(90deg, #059669 0%, #007AFF 100%)`,
                }
            }}>
                <CardContent>
                    {/* Success Badge */}
                    <Chip
                        icon={<Shield size={16} />}
                        label="PAYMENT CONFIRMED"
                        sx={{
                            mb: 3,
                            background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em',
                            px: 2,
                            py: 0.5,
                            height: 32,
                            boxShadow: `0 4px 12px rgba(5, 150, 105, 0.3)`,
                        }}
                    />

                    <CheckCircle size={100} color="#059669" style={{ marginBottom: 24 }} />

                    <DotBridgeTypography variant="h2" sx={{
                        mb: 2,
                        fontWeight: 800,
                        color: '#059669',
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        lineHeight: 1.2
                    }}>
                        🎉 Welcome to DotBridge!
                    </DotBridgeTypography>

                    <DotBridgeTypography variant="h4" sx={{
                        mb: 1,
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                    }}>
                        Your Career Acceleration System is Now Being Built
                    </DotBridgeTypography>

                    <Typography variant="h6" sx={{
                        mb: 4,
                        color: 'text.secondary',
                        maxWidth: 600,
                        mx: 'auto',
                        lineHeight: 1.6
                    }}>
                        Thank you for investing $299 in your career growth. Our expert team is already working on your personalized playbook.
                    </Typography>

                    {/* Three-Column Feature Grid */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 3,
                        mb: 5,
                        mt: 4
                    }}>
                        <Box sx={{
                            p: 3,
                            bgcolor: 'white',
                            borderRadius: 3,
                            border: `1px solid #e5e7eb`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                            }
                        }}>
                            <Mail size={40} color="#007AFF" style={{ marginBottom: 16 }} />
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
                                Check Your Email
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                We will be sending you access to your portal in the next few days.
                            </Typography>
                        </Box>

                        <Box sx={{
                            p: 3,
                            bgcolor: 'white',
                            borderRadius: 3,
                            border: `1px solid #e5e7eb`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                            }
                        }}>
                            <Clock size={40} color="#f59e0b" style={{ marginBottom: 16 }} />
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
                                48-72 Hours
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                Complete playbook delivery with your private portal access
                            </Typography>
                        </Box>

                        <Box sx={{
                            p: 3,
                            bgcolor: 'white',
                            borderRadius: 3,
                            border: `1px solid #e5e7eb`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                            }
                        }}>
                            <User size={40} color="#8b5cf6" style={{ marginBottom: 16 }} />
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
                                Personal Touch
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                AI-generated + human expert review for maximum impact
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* What Happens Next Section */}
            <Card sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: `1px solid #e5e7eb`,
                mb: 4
            }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                        <Sparkles size={28} color="#007AFF" style={{ marginRight: 12 }} />
                        <Typography variant="h4" fontWeight={700} sx={{
                            color: 'text.primary',
                            fontSize: { xs: '1.5rem', md: '1.75rem' }
                        }}>
                            What Happens Next
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: 4,
                        alignItems: 'start'
                    }}>
                        {/* Left Column - What You'll Get */}
                        <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, color: '#007AFF' }}>
                                Your Complete Career Playbook Includes:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[
                                    { step: '1', text: 'AI-Optimized Resume Analysis & Rewrite', color: '#007AFF' },
                                    { step: '2', text: 'Targeted Employer List with Decision-Maker Contacts', color: '#8b5cf6' },
                                    { step: '3', text: 'Custom Email & LinkedIn Outreach Templates', color: '#f59e0b' },
                                    { step: '4', text: 'Personalized 14-Day Action Calendar', color: '#059669' },
                                    { step: '5', text: 'Interview Prep & Salary Negotiation Guide', color: '#dc2626' }
                                ].map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: item.color,
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                            mt: 0.25
                                        }}>
                                            {item.step}
                                        </Box>
                                        <Typography variant="body1" sx={{
                                            lineHeight: 1.6,
                                            color: 'text.primary',
                                            flex: 1
                                        }}>
                                            {item.text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Right Column - Next Steps */}
                        <Box sx={{
                            p: 3,
                            bgcolor: '#f0f9ff',
                            borderRadius: 3,
                            border: `1px solid rgba(0, 122, 255, 0.2)`
                        }}>
                            <Typography variant="h6" fontWeight={700} sx={{
                                mb: 2,
                                color: '#007AFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <ArrowRight size={20} />
                                Next Steps
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: 'text.primary' }}>
                                <strong>Your playbook will be ready in 48-72 hours.</strong> Here's what to expect:
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    ✅ We'll review your AI-generated strategy
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    ✅ Build your complete playbook system
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    ✅ Send your private portal access
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" sx={{
                                color: 'text.secondary',
                                fontStyle: 'italic',
                                textAlign: 'center'
                            }}>
                                Have questions before then?
                            </Typography>
                            <Typography variant="body1" sx={{
                                fontWeight: 600,
                                color: '#007AFF',
                                textAlign: 'center',
                                mt: 1
                            }}>
                                levi@dotbridge.io
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Footer Note */}
            <Box sx={{
                textAlign: 'center',
                p: 3,
                bgcolor: '#f8fafc',
                borderRadius: 2,
                border: `1px solid #e5e7eb`
            }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                    🎯 Thank You for Choosing DotBridge
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    We're excited to help you accelerate your career growth. Your complete playbook will combine AI-powered insights
                    with proven outreach strategies to help you connect with the right opportunities.
                </Typography>
            </Box>
        </Container>
    );
};

export default PaymentSuccessCareer; 