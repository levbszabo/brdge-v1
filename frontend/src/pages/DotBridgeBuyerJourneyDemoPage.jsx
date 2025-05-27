import React from 'react';
import { Box, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeIcon from '../components/DotBridgeIcon';
import Footer from '../components/Footer';
import JourneyStep from '../components/JourneyStep';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const journeyStepsData = [
    {
        id: 'awareness',
        title: 'Awareness Bridge',
        subtitle: 'Capture attention with an engaging, short-form explainer',
        videoUrl: 'https://dotbridge.io/viewBridge/431-b9759d',
        alignment: 'left',
        icon: 'Eye',
        description: 'First touchpoint that educates and qualifies prospects'
    },
    {
        id: 'discovery',
        title: 'Discovery Bridge',
        subtitle: 'Qualify the lead and gather requirements',
        videoUrl: '#discovery_video',
        alignment: 'right',
        icon: 'Search',
        description: 'Interactive questionnaire that understands customer needs'
    },
    {
        id: 'demo',
        title: 'Demo Bridge',
        subtitle: 'Tailored walkthrough of DotBridge based on Discovery answers',
        videoUrl: '#demo_video',
        alignment: 'left',
        icon: 'Play',
        description: 'Personalized product demonstration that converts'
    },
    {
        id: 'sales',
        title: 'Sales Bridge',
        subtitle: 'Answer objections, show pricing, and close',
        videoUrl: '#sales_video',
        alignment: 'right',
        icon: 'DollarSign',
        description: 'Handle objections and guide to purchase decision'
    },
    {
        id: 'onboarding',
        title: 'Onboarding Bridge',
        subtitle: 'Help new users get set up',
        videoUrl: '#onboarding_video',
        alignment: 'left',
        icon: 'Rocket',
        description: 'Smooth activation for new customers'
    },
    {
        id: 'success',
        title: 'Customer Success',
        subtitle: 'Post-purchase support and upsell',
        videoUrl: '#success_video',
        alignment: 'right',
        isLast: true,
        icon: 'Award',
        description: 'Ongoing engagement and expansion opportunities'
    },
];

const DotBridgeBuyerJourneyDemoPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [headerRef, headerInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const [journeyRef, journeyInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const [ctaRef, ctaInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : `linear-gradient(to bottom, ${theme.palette.grey[50]}, ${theme.palette.background.default})`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background decoration */}
                {!isMobile && (
                    <>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -200,
                                right: -200,
                                width: 400,
                                height: 400,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%)`,
                                filter: 'blur(40px)',
                                pointerEvents: 'none'
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -150,
                                left: -150,
                                width: 300,
                                height: 300,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${theme.palette.primary.light}08 0%, transparent 70%)`,
                                filter: 'blur(40px)',
                                pointerEvents: 'none'
                            }}
                        />
                    </>
                )}

                <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
                    {/* Header Section */}
                    <Box ref={headerRef} sx={{ mb: { xs: 6, md: 8 } }}>
                        <motion.div
                            initial="initial"
                            animate={headerInView ? "animate" : "initial"}
                            variants={staggerChildren}
                        >
                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h1"
                                    align="center"
                                    gradient
                                    sx={{
                                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                        fontWeight: 700,
                                        mb: 3,
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    The Buyer Journey
                                </DotBridgeTypography>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h5"
                                    align="center"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: '750px',
                                        mx: 'auto',
                                        lineHeight: 1.6,
                                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                                    }}
                                >
                                    Experience the future of the digital sales funnel. Below, explore each stage
                                    of a buyer's journey – powered by DotBridge AI agents. Each Bridge is
                                    a live demo. Click, watch, and interact.
                                </DotBridgeTypography>
                            </motion.div>
                        </motion.div>
                    </Box>

                    {/* Main Journey Content */}
                    <Grid container spacing={4} justifyContent="center" alignItems="stretch" ref={journeyRef}>
                        {/* Left Side Content - Hidden on mobile */}
                        {!isTablet && (
                            <Grid item md={2}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={journeyInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: theme.shape.borderRadius * 2,
                                            background: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            boxShadow: theme.shadows[1],
                                            mt: 4,
                                            position: 'sticky',
                                            top: 100
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            mb: 2
                                        }}>
                                            <DotBridgeIcon
                                                name="Play"
                                                size={20}
                                                color="primary.main"
                                            />
                                            <DotBridgeTypography
                                                variant="h6"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                Start Here
                                            </DotBridgeTypography>
                                        </Box>
                                        <DotBridgeTypography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6 }}
                                        >
                                            The beginning of the buyer's journey starts with awareness.
                                            Is this product right for your customers?
                                        </DotBridgeTypography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        )}

                        {/* Journey Steps Section - Central Column */}
                        <Grid item xs={12} md={8} lg={7}>
                            <motion.div
                                initial="initial"
                                animate={journeyInView ? "animate" : "initial"}
                                variants={staggerChildren}
                            >
                                <Box sx={{ position: 'relative', maxWidth: '680px', margin: 'auto' }}>
                                    {journeyStepsData.map((step, index) => (
                                        <motion.div
                                            key={step.id}
                                            variants={fadeInUp}
                                            custom={index}
                                        >
                                            <Box sx={{ mb: { xs: 6, md: 8 } }}>
                                                {/* Step Header */}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        mb: 3
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)'
                                                        }}
                                                    >
                                                        <DotBridgeIcon
                                                            name={step.icon}
                                                            size={24}
                                                            color="white"
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <DotBridgeTypography
                                                            variant="caption"
                                                            sx={{
                                                                color: 'primary.main',
                                                                fontWeight: 600,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em'
                                                            }}
                                                        >
                                                            Step {index + 1}
                                                        </DotBridgeTypography>
                                                        <DotBridgeTypography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {step.description}
                                                        </DotBridgeTypography>
                                                    </Box>
                                                </Box>

                                                {/* Journey Step Component */}
                                                <JourneyStep
                                                    title={step.title}
                                                    subtitle={step.subtitle}
                                                    videoUrl={step.videoUrl}
                                                    alignment={step.alignment}
                                                    isLast={step.isLast}
                                                    isComingSoonProp={step.id !== 'awareness'}
                                                />
                                            </Box>
                                        </motion.div>
                                    ))}
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* Right Side Content - Hidden on mobile */}
                        {!isTablet && (
                            <Grid item md={2} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end'
                            }}>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={journeyInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: theme.shape.borderRadius * 2,
                                            background: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`,
                                            boxShadow: theme.shadows[1],
                                            mb: { md: 8 }
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            mb: 2
                                        }}>
                                            <DotBridgeIcon
                                                name="Target"
                                                size={20}
                                                color="success.main"
                                            />
                                            <DotBridgeTypography
                                                variant="h6"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                End Here
                                            </DotBridgeTypography>
                                        </Box>
                                        <DotBridgeTypography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ lineHeight: 1.6 }}
                                        >
                                            The end of the buyer's journey is a happy customer.
                                            DotBridge extracts valuable insights and feeds them back
                                            into the system, creating a self-reinforcing value flywheel.
                                        </DotBridgeTypography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        )}
                    </Grid>

                    {/* CTA Section */}
                    <Box ref={ctaRef} sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}>
                        <motion.div
                            initial="initial"
                            animate={ctaInView ? "animate" : "initial"}
                            variants={staggerChildren}
                        >
                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography
                                    variant="h3"
                                    sx={{
                                        mb: 3,
                                        fontWeight: 600
                                    }}
                                >
                                    Want a flow like this for your business?
                                </DotBridgeTypography>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item xs={12} sm="auto">
                                        <DotBridgeButton
                                            variant="contained"
                                            size="large"
                                            component={RouterLink}
                                            to="/contact"
                                            sx={{
                                                minWidth: 200,
                                                px: 4,
                                                py: 1.5,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                }
                                            }}
                                        >
                                            Request a Demo
                                        </DotBridgeButton>
                                    </Grid>
                                    <Grid item xs={12} sm="auto">
                                        <DotBridgeButton
                                            variant="outlined"
                                            size="large"
                                            component={RouterLink}
                                            to="/signup"
                                            sx={{
                                                minWidth: 200,
                                                px: 4,
                                                py: 1.5,
                                                borderWidth: 2,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 6px 16px rgba(0, 122, 255, 0.15)'
                                                }
                                            }}
                                        >
                                            Create Your First Bridge (Free)
                                        </DotBridgeButton>
                                    </Grid>
                                </Grid>
                            </motion.div>
                        </motion.div>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default DotBridgeBuyerJourneyDemoPage;
