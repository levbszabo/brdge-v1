import React, { useState } from 'react';
import { Container, Typography, Grid, Box, Button, useTheme, useMediaQuery, Divider, Card, CardContent, Chip, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Star, Sparkles, Zap, Shield } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Footer from '../components/Footer';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeIcon from '../components/DotBridgeIcon';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut"
        }
    }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const PricingTier = ({ tier, isPopular, delay }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            style={{ height: '100%' }}
        >
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 3, md: 4 },
                    border: '2px solid',
                    borderColor: isPopular ? 'primary.main' : 'divider',
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isPopular && !isMobile ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isPopular
                        ? `0 20px 40px ${theme.palette.primary.main}20`
                        : theme.shadows[1],
                    '&:hover': {
                        transform: isPopular && !isMobile ? 'scale(1.05) translateY(-5px)' : 'translateY(-5px)',
                        boxShadow: isPopular
                            ? `0 24px 48px ${theme.palette.primary.main}25`
                            : theme.shadows[4],
                        borderColor: isPopular ? 'primary.main' : 'primary.light'
                    }
                }}
            >
                {isPopular && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -12,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            px: 2.5,
                            py: 0.5,
                            borderRadius: '99px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        <Star size={14} fill="currentColor" />
                        MOST POPULAR
                    </Box>
                )}

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <DotBridgeTypography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1,
                            fontSize: { xs: '1.75rem', md: '2rem' }
                        }}
                    >
                        {tier.name}
                    </DotBridgeTypography>
                    <DotBridgeTypography
                        variant="body1"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            minHeight: { xs: 'auto', md: '48px' }
                        }}
                    >
                        {tier.description}
                    </DotBridgeTypography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                        <DotBridgeTypography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                color: isPopular ? 'primary.main' : 'text.primary',
                                fontSize: { xs: '2.5rem', md: '3rem' },
                                lineHeight: 1
                            }}
                        >
                            ${tier.price}
                        </DotBridgeTypography>
                        <DotBridgeTypography
                            component="span"
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                ml: 1
                            }}
                        >
                            /month
                        </DotBridgeTypography>
                    </Box>
                </Box>

                <Box sx={{ flexGrow: 1, mb: 4 }}>
                    {tier.features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: delay + (index * 0.1) }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    px: 1
                                }}
                            >
                                <Box sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    bgcolor: isPopular ? 'primary.lighter' : 'grey.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    flexShrink: 0
                                }}>
                                    <Check sx={{
                                        fontSize: 16,
                                        color: isPopular ? 'primary.main' : 'text.secondary',
                                        fontWeight: 'bold'
                                    }} />
                                </Box>
                                <DotBridgeTypography
                                    variant="body1"
                                    sx={{
                                        color: 'text.primary',
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }}
                                >
                                    {feature}
                                </DotBridgeTypography>
                            </Box>
                        </motion.div>
                    ))}
                </Box>

                <DotBridgeButton
                    component={RouterLink}
                    to={`/signup?plan=${tier.name.toLowerCase()}`}
                    variant={isPopular ? "contained" : "outlined"}
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{
                        mt: 'auto',
                        py: 1.5,
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        fontWeight: 600,
                        ...(isPopular && {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 12px 32px ${theme.palette.primary.main}40`
                            }
                        })
                    }}
                >
                    {tier.name === 'Free' ? 'Get Started Free' : `Choose ${tier.name}`}
                </DotBridgeButton>
            </Box>
        </motion.div>
    );
};

function PricingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const tiers = [
        {
            name: 'Free',
            price: '0',
            description: 'Get started with the basics',
            features: [
                "1 Bridge Link",
                "30 AI Minutes/mo",
                "Voice Clone",
                "Basic Analytics",
                "1 Flow Limit",
                "Community Support"
            ],
        },
        {
            name: 'Standard',
            price: '49',
            description: 'For small sales teams looking to scale',
            features: [
                "10 Bridge Links",
                "300 AI Minutes/mo",
                "Voice Clone",
                "Basic Analytics",
                "1 Flow Limit",
                "Email Support",
                "Remove Watermark"
            ],
        },
        {
            name: 'Premium',
            price: '149',
            description: 'Unlock full power & customization',
            features: [
                "100 Bridge Links",
                "1000 AI Minutes/mo",
                "100 Flows",
                "Voice Clone",
                "CRM / Webhooks",
                "Advanced Analytics",
                "No Watermark",
                "Priority Support"
            ],
        },
    ];

    return (
        <>
            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    bgcolor: theme.palette.background.default,
                    py: { xs: 6, md: 10 },
                    pt: { xs: 4, md: 8 },
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Background decoration */}
                {!isMobile && (
                    <>
                        <Box sx={{
                            position: 'absolute',
                            top: '10%',
                            left: '-5%',
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                            filter: 'blur(40px)',
                            pointerEvents: 'none'
                        }} />
                        <Box sx={{
                            position: 'absolute',
                            bottom: '20%',
                            right: '-5%',
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${theme.palette.primary.light}10 0%, transparent 70%)`,
                            filter: 'blur(60px)',
                            pointerEvents: 'none'
                        }} />
                    </>
                )}

                <Container maxWidth="lg" ref={ref} sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                <Chip
                                    label="PRICING"
                                    sx={{
                                        mb: 2,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}50 100%)`,
                                        color: theme.palette.primary.dark,
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        px: 2,
                                        py: 0.5,
                                        border: '1px solid',
                                        borderColor: theme.palette.primary.light,
                                        boxShadow: '0 2px 8px rgba(0, 102, 255, 0.2)'
                                    }}
                                />
                            </motion.div>

                            <DotBridgeTypography
                                variant="h1"
                                component="h1"
                                sx={{
                                    mb: 3,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Simple Pricing for Growth
                            </DotBridgeTypography>

                            <DotBridgeTypography
                                variant="h5"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    maxWidth: '700px',
                                    mx: 'auto',
                                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.4rem' },
                                    lineHeight: 1.6
                                }}
                            >
                                Choose the plan that fits your needs. Start free or unlock powerful features to engage your audience and drive results.
                            </DotBridgeTypography>
                        </Box>
                    </motion.div>

                    <Grid container spacing={{ xs: 3, md: 4 }} sx={{ position: 'relative', zIndex: 2 }} alignItems="stretch">
                        {tiers.map((tier, index) => (
                            <Grid item xs={12} md={4} key={tier.name}>
                                <PricingTier
                                    tier={tier}
                                    isPopular={index === 1}
                                    delay={index * 0.15}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Box
                            sx={{
                                textAlign: 'center',
                                mt: { xs: 8, md: 12 },
                                mb: 4,
                                py: { xs: 6, md: 8 },
                                px: { xs: 3, md: 4 },
                                borderRadius: 4,
                                background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.background.paper} 100%)`,
                                border: '1px solid',
                                borderColor: theme.palette.divider,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
                                filter: 'blur(40px)'
                            }} />

                            <DotBridgeTypography
                                variant="h3"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                                }}
                            >
                                Need a Custom Solution?
                            </DotBridgeTypography>

                            <DotBridgeTypography
                                variant="body1"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    maxWidth: '650px',
                                    mx: 'auto',
                                    mb: 4,
                                    lineHeight: 1.6,
                                    fontSize: { xs: '1rem', md: '1.125rem' }
                                }}
                            >
                                For enterprise needs, high-volume usage, or specific integrations, contact our sales team for tailored solutions and dedicated support.
                            </DotBridgeTypography>

                            <DotBridgeButton
                                component={RouterLink}
                                to="/contact"
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<Sparkles size={20} />}
                                sx={{
                                    mt: 1.5,
                                    px: 4,
                                    py: 1.5,
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                    }
                                }}
                            >
                                Contact Sales
                            </DotBridgeButton>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
            <Footer />
        </>
    );
}

export default PricingPage;
