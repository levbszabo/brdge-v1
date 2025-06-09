import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography as MuiTypography, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery, Divider, Chip, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard, { CardContent, CardHeader } from '../components/DotBridgeCard';
import DotBridgeIcon from '../components/DotBridgeIcon';
import Footer from '../components/Footer';

import AgentConnector from '../components/AgentConnector';

const DEMO_BRIDGE_ID = '448';

// Haptic feedback utility
const triggerHaptic = (style = 'light') => {
    if ('vibrate' in navigator) {
        switch (style) {
            case 'light': navigator.vibrate(10); break;
            case 'medium': navigator.vibrate(20); break;
            case 'success': navigator.vibrate([10, 10, 10]); break;
            default: break;
        }
    }
};

// Performance optimization: Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Section = ({ children, sx, variant = "default", ...props }) => {
    const theme = useTheme();
    const sectionVariants = {
        default: {},
        light: {
            bgcolor: theme.palette.background.subtle,
        },
        dark: {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        accent: {
            bgcolor: theme.palette.primary.lighter,
        }
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, sm: 8, md: 12 },
                px: { xs: 1, sm: 2, md: 3 },
                position: 'relative',
                ...sectionVariants[variant],
                ...sx
            }}
            {...props}
        >
            <Container maxWidth={props.fullWidth ? false : "xl"}>
                {children}
            </Container>
        </Box>
    );
};

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: prefersReducedMotion ? 0.01 : 0.7,
            ease: "easeOut"
        }
    }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: prefersReducedMotion ? 0.01 : 0.7,
            ease: "easeOut"
        }
    }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.15,
            delayChildren: prefersReducedMotion ? 0 : 0.2
        }
    }
};

const HeroSection = () => {
    const [logoRef, logoInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Add scroll animation hook
    const demoRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: demoRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to rotation values - reduced for mobile
    const rotateX = useTransform(scrollYProgress, [0, 0.5], isMobile ? [12, 0] : [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0.98, 1] : [0.97, 1]);

    return (
        <Box sx={{
            pt: { xs: 4, sm: 6, md: 10 },
            pb: { xs: 6, sm: 8, md: 8 },
            px: { xs: 1, sm: 2, md: 3 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: '100vh', md: '90vh' },
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter}10 50%, ${theme.palette.background.default} 100%)`
        }}>
            {/* Enhanced animated background elements */}
            {!isMobile && (
                <>
                    <Box sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '-5%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
                        filter: 'blur(40px)',
                        animation: prefersReducedMotion ? 'none' : 'float 6s ease-in-out infinite',
                        willChange: 'transform'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '-5%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.light}15 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        animation: prefersReducedMotion ? 'none' : 'float 8s ease-in-out infinite reverse',
                        willChange: 'transform'
                    }} />
                </>
            )}
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '400px', md: '600px' },
                height: { xs: '400px', md: '600px' },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}05 0%, transparent 50%)`,
                filter: 'blur(100px)',
                animation: prefersReducedMotion ? 'none' : 'pulse 10s ease-in-out infinite'
            }} />

            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 2 } }}>
                <motion.div
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.8, delay: 0.1 }}
                >
                    <Box sx={{ mb: 2 }}>
                        <Chip
                            label="🚀 THE OUTBOUND OS"
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                color: 'white',
                                fontWeight: 650,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                letterSpacing: '0.05em',
                                px: { xs: 2, sm: 2.5 },
                                py: 0.75,
                                borderRadius: theme.shape.borderRadius,
                                boxShadow: `0 4px 16px ${theme.palette.primary.shadow}`,
                                border: 'none',
                                animation: prefersReducedMotion ? 'none' : 'pulse 3s ease-in-out infinite',
                            }}
                        />
                    </Box>
                    <DotBridgeTypography
                        variant="h1"
                        component="h1"
                        balanced
                        sx={{
                            mb: { xs: 3, sm: 4, md: 4 },
                            fontSize: { xs: '3.5rem', sm: '4rem', md: '5rem' },
                            fontWeight: 800,
                            letterSpacing: { xs: '-0.03em', sm: '-0.04em', md: '-0.05em' },
                            lineHeight: { xs: 1.05, sm: 1.02, md: 1 },
                            textAlign: 'center',
                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Bridge the Gap Between<br />Attention and Action
                    </DotBridgeTypography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, delay: 0.3 }}
                >
                    {/* Subheadline */}
                    <DotBridgeTypography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            mb: { xs: 4, sm: 5, md: 6 },
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                            lineHeight: { xs: 1.5, sm: 1.55, md: 1.6 },
                            fontWeight: 400,
                            px: { xs: 2, sm: 1, md: 0 },
                            textAlign: 'center'
                        }}
                    >
                        DotBridge is the Outbound OS for sales and career growth.{' '}
                        <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                            AI agents powered by your voice
                        </Box>{' '}
                        turn static video into conversations that convert.
                    </DotBridgeTypography>
                </motion.div>

                <motion.div
                    initial={{ y: prefersReducedMotion ? 0 : 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, delay: 0.4 }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        gap: { xs: 2, sm: 2.5 },
                        mb: { xs: 6, md: 10 },
                        px: { xs: 2, sm: 0 }
                    }}>
                        <DotBridgeButton
                            size="large"
                            color="primary"
                            variant="contained"
                            component={Link}
                            to="/services"
                            onClick={() => triggerHaptic('medium')}
                            endIcon={<DotBridgeIcon name="ArrowRight" size={20} />}
                            sx={{
                                px: { xs: 4, sm: 5 },
                                py: { xs: 2, sm: 1.75 },
                                fontSize: { xs: '1.125rem', sm: '1.125rem' },
                                fontWeight: 600,
                                width: { xs: '100%', sm: 'auto' },
                                minHeight: { xs: '56px', sm: 'auto' },
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: `0 8px 32px ${theme.palette.primary.shadow}`,
                                borderRadius: theme.shape.borderRadiusLarge,
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    '@media (hover: hover)': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: `0 16px 40px ${theme.palette.primary.shadow}`,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`
                                    }
                                },
                                '&:active': {
                                    transform: 'scale(0.98)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                    transition: 'left 0.6s ease',
                                },
                                '&:hover::before': {
                                    '@media (hover: hover)': {
                                        left: '100%',
                                    }
                                }
                            }}
                        >
                            For B2B Sales Teams
                        </DotBridgeButton>
                        <DotBridgeButton
                            size="large"
                            color="primary"
                            variant={isMobile ? "text" : "outlined"}
                            component={Link}
                            to="/career-accelerator"
                            startIcon={!isMobile && <DotBridgeIcon name="Briefcase" size={20} variant="contained" />}
                            onClick={() => triggerHaptic('light')}
                            sx={{
                                px: { xs: 4, sm: 4 },
                                py: { xs: 1.5, sm: 1.75 },
                                fontSize: { xs: '1rem', sm: '1rem' },
                                fontWeight: { xs: 500, sm: 500 },
                                width: { xs: 'auto', sm: 'auto' },
                                borderWidth: { xs: '0', sm: '2px' },
                                borderRadius: theme.shape.borderRadiusLarge,
                                backdropFilter: 'blur(8px)',
                                '&:hover': {
                                    '@media (hover: hover)': {
                                        borderWidth: { xs: '0', sm: '2px' },
                                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                                        background: { xs: 'transparent', sm: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.primary.light}10 100%)` },
                                        textDecoration: { xs: 'underline', sm: 'none' },
                                        boxShadow: { xs: 'none', sm: theme.shadows[4] }
                                    }
                                }
                            }}
                        >
                            For Job Seekers
                        </DotBridgeButton>
                    </Box>

                    {/* Enhanced Third CTA */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <DotBridgeButton
                            size="medium"
                            color="primary"
                            variant="text"
                            component={Link}
                            to="/signup"
                            endIcon={<DotBridgeIcon name="Sparkles" size={16} animated="pulse" />}
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: 'text.secondary',
                                borderRadius: theme.shape.borderRadius,
                                '&:hover': {
                                    color: 'primary.main',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '4px',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.primary.light}05 100%)`,
                                }
                            }}
                        >
                            or try the self-serve platform
                        </DotBridgeButton>
                    </Box>
                </motion.div>

                {/* Enhanced Interactive Bridge Demo */}
                <motion.div
                    ref={demoRef}
                    initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.8, delay: 0.6 }}
                    style={{
                        perspective: isMobile ? '1000px' : '1500px',
                        perspectiveOrigin: '50% 30%'
                    }}
                >
                    <motion.div
                        style={{
                            rotateX: prefersReducedMotion ? 0 : rotateX,
                            scale: prefersReducedMotion ? 1 : scale,
                            transformStyle: 'preserve-3d',
                            transformOrigin: '50% 100%'
                        }}
                    >
                        <DotBridgeCard
                            variant="premium"
                            interactive
                            sx={{
                                maxWidth: { xs: '100%', sm: '850px', md: '1300px' },
                                mx: { xs: 0.5, sm: 'auto' },
                                aspectRatio: { xs: '16 / 9', sm: '16 / 9', md: '16 / 9' },
                                transform: 'translateZ(0)',
                                backfaceVisibility: 'hidden',
                                willChange: 'transform',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: `0 20px 60px ${theme.palette.primary.shadow}`,
                            }}
                        >
                            {/* Enhanced top bar */}
                            <Box sx={{
                                p: 1.5,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                background: `linear-gradient(135deg, ${theme.palette.grey[25]} 0%, ${theme.palette.grey[50]} 100%)`,
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                gap: 1.5
                            }}>
                                <Box sx={{ display: 'flex', gap: 0.75 }}>
                                    <Box sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        bgcolor: 'error.main',
                                        boxShadow: `0 2px 8px ${theme.palette.error.shadow}`
                                    }} />
                                    <Box sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        bgcolor: 'warning.main',
                                        boxShadow: `0 2px 8px ${theme.palette.warning.shadow}`
                                    }} />
                                    <Box sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main',
                                        boxShadow: `0 2px 8px ${theme.palette.success.shadow}`
                                    }} />
                                </Box>
                                <DotBridgeTypography variant="caption" color="text.secondary" sx={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontWeight: 550,
                                    letterSpacing: '0.05em'
                                }}>
                                    <DotBridgeIcon name="Sparkles" size={12} sx={{ mr: 0.5 }} />
                                    DotBridge Live Demo
                                </DotBridgeTypography>
                                <DotBridgeIcon name="Maximize2" size={16} color="text.secondary" interactive />
                            </Box>
                            <Box sx={{
                                position: 'relative',
                                height: { xs: '100%', sm: 'calc(100% - 52px)' },
                                '& .agent-connector-container': {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }
                            }}>
                                {isMobile ? (
                                    <video
                                        src="/dotbridge-vsl-hero-final.mp4"
                                        poster="/dotbridge-hero-cover.png"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '0'
                                        }}
                                    />
                                ) : (
                                    <div className="agent-connector-container">
                                        <AgentConnector
                                            brdgeId={DEMO_BRIDGE_ID}
                                            agentType="view"
                                            token=""
                                            userId={null}
                                            isEmbed={false}
                                        />
                                    </div>
                                )}
                            </Box>
                        </DotBridgeCard>
                    </motion.div>
                </motion.div>
            </Container>

            {/* Enhanced CSS Animation */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(120deg); }
                    66% { transform: translate(-20px, 20px) rotate(240deg); }
                }
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>
        </Box >
    );
};

const TrustedBySection = () => (
    <Section sx={{
        py: { xs: 3, sm: 4, md: 5 },
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(0,122,255,0.01) 0%, rgba(255,255,255,0) 100%)'
    }}>
        <DotBridgeTypography
            variant="overline"
            color="text.secondary"
            sx={{ mb: 2, opacity: 0.8 }}
        >
            The New Standard for Outbound
        </DotBridgeTypography>
        <DotBridgeTypography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Forward-thinking companies are replacing cold outreach with intelligent Bridges
        </DotBridgeTypography>
    </Section>
);

const WhyNowSection = () => {
    const theme = useTheme();

    return (
        <Section variant="light" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="lg" mx="auto" textAlign="center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <DotBridgeTypography variant='h2' component="h2" sx={{
                        mb: 3,
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                    }}>
                        Your Videos Can't Close Deals
                    </DotBridgeTypography>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                        mb: { xs: 6, md: 8 },
                        maxWidth: '700px',
                        mx: 'auto',
                        fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                        lineHeight: 1.6
                    }}>
                        73% drop off after 2 minutes. Questions go unanswered.
                        Deals die in silence. Every static video is a missed opportunity.
                    </DotBridgeTypography>
                </motion.div>
                <Grid container spacing={4} justifyContent="center" maxWidth="lg" mx="auto">
                    <motion.div
                        variants={staggerChildren}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        style={{ width: '100%' }}
                    >
                        <Grid container spacing={4} justifyContent="center">
                            {[
                                {
                                    icon: 'PlayCircle',
                                    title: 'You send a demo video',
                                    problem: 'They watch 2 minutes and leave',
                                    stat: '73% drop-off'
                                },
                                {
                                    icon: 'MessageSquareOff',
                                    title: 'They have questions',
                                    problem: "Your video can't respond",
                                    stat: 'Lost opportunity'
                                },
                                {
                                    icon: 'Calendar',
                                    title: 'You chase them for weeks',
                                    problem: "They've already moved on",
                                    stat: 'Deal lost'
                                }
                            ].map((item, i) => (
                                <Grid item key={i} xs={12} sm={4}>
                                    <motion.div variants={fadeInUp}>
                                        <DotBridgeCard sx={{
                                            height: '100%',
                                            p: 3,
                                            textAlign: 'center',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: theme.palette.grey[300],
                                                boxShadow: theme.shadows[1]
                                            }
                                        }}>
                                            <Box sx={{
                                                mb: 2,
                                                height: 64,
                                                width: 64,
                                                mx: 'auto',
                                                borderRadius: '50%',
                                                bgcolor: theme.palette.error.light + '20',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <DotBridgeIcon name={item.icon} size={32} color={theme.palette.error.main} />
                                            </Box>
                                            <DotBridgeTypography variant="h6" sx={{ mb: 1 }}>
                                                {item.title}
                                            </DotBridgeTypography>
                                            <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {item.problem}
                                            </DotBridgeTypography>
                                            <DotBridgeTypography
                                                variant="caption"
                                                sx={{
                                                    color: theme.palette.error.main,
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}
                                            >
                                                {item.stat}
                                            </DotBridgeTypography>
                                        </DotBridgeCard>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Grid>
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <DotBridgeTypography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                        There's a better way →
                    </DotBridgeTypography>
                </Box>
            </Box>
        </Section>
    );
};

const TransformationCarousel = () => {
    const theme = useTheme();
    const [activeTransformation, setActiveTransformation] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const transformations = [
        {
            title: "Sales Teams",
            icon: "TrendingUp",
            transformation: "AI qualifies every prospect and books qualified demos automatically",
            result: "22 meetings booked in 3 days",
            gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            bgColor: 'primary.lighter'
        },
        {
            title: "Job Seekers",
            icon: "Briefcase",
            transformation: "AI pitches you directly to hiring managers with personalized video introductions",
            result: "3 interviews in 2 weeks",
            gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            bgColor: 'secondary.lighter'
        },
        {
            title: "Coaches & Consultants",
            icon: "Users",
            transformation: "AI pre-qualifies clients and showcases your expertise before the sales call",
            result: "5x higher conversion rate",
            gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            bgColor: 'success.lighter'
        },
        {
            title: "Course Creators",
            icon: "Video",
            transformation: "AI demonstrates course value and answers student questions instantly",
            result: "3x enrollment increase",
            gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            bgColor: 'warning.lighter'
        }
    ];

    // Auto-cycle through transformations
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveTransformation((prev) => (prev + 1) % transformations.length);
        }, 1500); // 1.5 seconds per transformation

        return () => clearInterval(interval);
    }, [transformations.length, isPaused]);

    return (
        <Box
            sx={{ maxWidth: '800px', mx: 'auto', position: 'relative' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Progress indicators */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
                {transformations.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => {
                            setActiveTransformation(index);
                            setIsPaused(true);
                            setTimeout(() => setIsPaused(false), 2000);
                        }}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: activeTransformation === index ? 'primary.main' : 'grey.300',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: activeTransformation === index ? 'scale(1.2)' : 'scale(1)',
                            '&:hover': {
                                bgcolor: activeTransformation === index ? 'primary.dark' : 'grey.400'
                            }
                        }}
                    />
                ))}
            </Box>

            {/* Carousel content */}
            <Box sx={{
                height: '280px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                boxShadow: theme.shadows[3]
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTransformation}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <Box sx={{
                            height: '100%',
                            p: { xs: 3, md: 4 },
                            bgcolor: 'background.paper',
                            border: '2px solid',
                            borderImage: transformations[activeTransformation].gradient + ' 1',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Icon */}
                            <Box sx={{
                                width: 64,
                                height: 64,
                                mx: 'auto',
                                mb: 3,
                                borderRadius: 3,
                                background: transformations[activeTransformation].gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                            }}>
                                <DotBridgeIcon
                                    name={transformations[activeTransformation].icon}
                                    size={32}
                                    color="white"
                                />
                            </Box>

                            {/* Title */}
                            <Typography variant="h4" sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: '#1a1a1a'
                            }}>
                                {transformations[activeTransformation].title}
                            </Typography>

                            {/* Transformation text */}
                            <Typography variant="body1" sx={{
                                mb: 3,
                                fontSize: { xs: '1rem', md: '1.125rem' },
                                lineHeight: 1.6,
                                color: '#1a1a1a',
                                fontWeight: 700,
                                maxWidth: '600px',
                                mx: 'auto'
                            }}>
                                {transformations[activeTransformation].transformation}
                            </Typography>

                            {/* Result */}
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                mx: 'auto',
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                bgcolor: '#1a1a1a',
                                color: 'white',
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                            }}>
                                <DotBridgeIcon name="CheckCircle" size={20} color="white" />
                                <Typography variant="body2" sx={{
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: '0.875rem'
                                }}>
                                    {transformations[activeTransformation].result}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

const WhatIsBridgeSection = () => {
    const [sectionRef, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeStep, setActiveStep] = useState(0);

    // Automatic progression through steps when section is in view
    useEffect(() => {
        if (!inView) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 2500);

        return () => clearInterval(interval);
    }, [inView]);

    // Helper to determine if a step should be highlighted
    const isStepActive = (stepIndex) => activeStep === stepIndex;

    return (
        <Section
            sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                py: { xs: 8, sm: 12, md: 16 },
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter}05 100%)`
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 4, sm: 6, md: 8 }} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={staggerChildren}
                        >
                            <motion.div variants={fadeInUp}>
                                <Chip
                                    label="WHAT IS A BRIDGE?"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.05em',
                                        mb: 3
                                    }}
                                />
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography variant='h2' component="h2" sx={{
                                    mb: { xs: 3, md: 4 },
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    lineHeight: { xs: 1.2, md: 1.1 },
                                    textAlign: { xs: 'center', md: 'left' },
                                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Your Content Becomes
                                    <Box component="span" sx={{
                                        display: 'block',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        Your Best Rep
                                    </Box>
                                </DotBridgeTypography>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                                    mb: { xs: 4, md: 5 },
                                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.4rem' },
                                    lineHeight: 1.6,
                                    textAlign: { xs: 'center', md: 'left' },
                                    px: { xs: 2, md: 0 }
                                }}>
                                    A Bridge transforms any video into an AI agent that speaks,
                                    listens, and converts. Whether you're closing deals or landing jobs,
                                    your Bridge works 24/7 to turn viewers into meetings.
                                </DotBridgeTypography>
                            </motion.div>

                            <Grid container spacing={{ xs: 1, md: 0 }}>
                                {[
                                    { icon: 'MessageSquare', title: 'Handles Every Question', text: 'Answers objections, explains features, and guides meaningful conversations' },
                                    { icon: 'Target', title: 'Qualifies & Converts', text: 'Scores prospects by fit and readiness, then moves them forward' },
                                    { icon: 'Calendar', title: 'Books Real Meetings', text: 'Connects you directly with decision makers and key stakeholders' }
                                ].map((item, i) => (
                                    <Grid item xs={4} md={12} key={i}>
                                        <motion.div
                                            variants={{
                                                hidden: { opacity: 0, x: -30 },
                                                visible: {
                                                    opacity: 1,
                                                    x: 0,
                                                    transition: {
                                                        delay: 0.4 + (i * 0.15),
                                                        duration: 0.6
                                                    }
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                gap: { xs: 1, md: 2.5 },
                                                p: { xs: 1.5, md: 2.5 },
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                minHeight: { xs: '120px', md: 'auto' },
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    transform: { xs: 'translateY(-4px)', md: 'translateX(8px)' },
                                                    bgcolor: 'background.paper',
                                                    boxShadow: theme.shadows[2]
                                                }
                                            }}>
                                                <Box sx={{
                                                    width: { xs: 32, md: 48 },
                                                    height: { xs: 32, md: 48 },
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    color: 'white',
                                                    flexShrink: 0,
                                                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                                                    mb: { xs: 1, md: 0 }
                                                }}>
                                                    <DotBridgeIcon name={item.icon} size={isMobile ? 16 : 24} />
                                                </Box>
                                                <Box>
                                                    <DotBridgeTypography variant="h6" sx={{
                                                        fontSize: { xs: '0.75rem', md: '1.25rem' },
                                                        mb: { xs: 0.25, md: 0.5 },
                                                        fontWeight: 600,
                                                        lineHeight: 1.2
                                                    }}>
                                                        {item.title}
                                                    </DotBridgeTypography>
                                                    <DotBridgeTypography variant="body2" color="text.secondary" sx={{
                                                        fontSize: { xs: '0.65rem', md: '1rem' },
                                                        lineHeight: 1.3,
                                                        display: { xs: 'none', sm: 'block' } // Hide description on mobile for space
                                                    }}>
                                                        {item.text}
                                                    </DotBridgeTypography>
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6} ref={sectionRef}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <Box sx={{
                                position: 'relative',
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                {/* Bridge Creation Flow Animation */}
                                <Box sx={{
                                    p: 4,
                                    bgcolor: 'background.paper',
                                    position: 'relative'
                                }}>
                                    <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
                                        From Static Content to Smart Conversations
                                    </Typography>

                                    {/* Step 1: Video Upload */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            p: 1.5,
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            border: '2px solid',
                                            borderColor: isStepActive(0) ? 'primary.main' : 'transparent',
                                            bgcolor: isStepActive(0) ? 'primary.lighter' : 'transparent',
                                            transform: isStepActive(0) ? 'translateX(8px)' : 'translateX(0)',
                                            boxShadow: isStepActive(0) ? theme.shadows[2] : 'none'
                                        }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2.5,
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)'
                                            }}>
                                                1
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    Upload Any Video
                                                </Typography>
                                                <Box sx={{
                                                    p: 2,
                                                    border: '2px dashed',
                                                    borderColor: 'primary.light',
                                                    borderRadius: 2,
                                                    bgcolor: 'primary.lighter',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5
                                                }}>
                                                    <DotBridgeIcon name="Video" size={20} color="primary.main" />
                                                    <Typography variant="body2">Sales demo, pitch, or intro</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>



                                    {/* Step 2: AI Processing */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 1.0, duration: 0.6 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            p: 1.5,
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            border: '2px solid',
                                            borderColor: isStepActive(1) ? 'success.main' : 'transparent',
                                            bgcolor: isStepActive(1) ? 'success.lighter' : 'transparent',
                                            transform: isStepActive(1) ? 'translateX(8px)' : 'translateX(0)',
                                            boxShadow: isStepActive(1) ? theme.shadows[2] : 'none'
                                        }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2.5,
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 12px rgba(0, 199, 129, 0.3)'
                                            }}>
                                                2
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    AI Becomes Your Expert
                                                </Typography>
                                                <Box sx={{
                                                    p: 2,
                                                    border: '1px solid',
                                                    borderColor: 'success.light',
                                                    borderRadius: 2,
                                                    bgcolor: 'success.lighter',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5
                                                }}>
                                                    <DotBridgeIcon name="Brain" size={20} color="success.main" />
                                                    <Typography variant="body2">Masters your product or story</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>



                                    {/* Step 3: Personalization */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 1.5, duration: 0.6 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            p: 1.5,
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            border: '2px solid',
                                            borderColor: isStepActive(2) ? 'warning.main' : 'transparent',
                                            bgcolor: isStepActive(2) ? 'warning.lighter' : 'transparent',
                                            transform: isStepActive(2) ? 'translateX(8px)' : 'translateX(0)',
                                            boxShadow: isStepActive(2) ? theme.shadows[2] : 'none'
                                        }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2.5,
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                                            }}>
                                                3
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    Set Your Goals
                                                </Typography>
                                                <Box sx={{
                                                    p: 2,
                                                    border: '1px solid',
                                                    borderColor: 'warning.light',
                                                    borderRadius: 2,
                                                    bgcolor: 'warning.lighter',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5
                                                }}>
                                                    <DotBridgeIcon name="UserCog" size={20} color="warning.main" />
                                                    <Typography variant="body2">Book demos or interviews</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>



                                    {/* Step 4: Launch Bridge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 2.0, duration: 0.6 }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1.5,
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease',
                                            border: '2px solid',
                                            borderColor: isStepActive(3) ? 'info.main' : 'transparent',
                                            bgcolor: isStepActive(3) ? 'info.lighter' : 'transparent',
                                            transform: isStepActive(3) ? 'translateX(8px)' : 'translateX(0)',
                                            boxShadow: isStepActive(3) ? theme.shadows[2] : 'none'
                                        }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2.5,
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                                            }}>
                                                4
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    Watch It Convert
                                                </Typography>
                                                <Box sx={{
                                                    p: 2,
                                                    border: '1px solid',
                                                    borderColor: 'info.light',
                                                    borderRadius: 2,
                                                    bgcolor: 'info.lighter',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5
                                                }}>
                                                    <DotBridgeIcon name="Sparkles" size={20} color="info.main" />
                                                    <Typography variant="body2">Meetings booked automatically</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Transformation Carousel */}
                <Box sx={{ mt: { xs: 6, md: 8 }, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                        See The Bridge Difference
                    </Typography>
                    <TransformationCarousel />
                </Box>
            </Container>
        </Section>
    );
};

const DemoSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const videoRef = useRef(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handlePlayButtonClick = () => {
        if (videoRef.current) {
            videoRef.current.play()
                .then(() => setIsVideoPlaying(true))
                .catch(error => console.error("Error playing video:", error));
        }
    };

    return (
        <Section
            fullWidth
            sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                px: { xs: 0.5, sm: 1.5, md: 2 }
            }}
        >
            <Box maxWidth="lg" mx="auto" textAlign="center" mb={{ xs: 3, md: 8 }}> {/* Reduced bottom margin on mobile */}
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    See Bridge in Action
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    maxWidth: '750px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    Experience the difference. Interact with a live bridge demo or watch how easy it is to transform your videos.
                </DotBridgeTypography>
            </Box>

            {isMobile ? (
                <Box
                    sx={{
                        maxWidth: '100%', // Use full width instead of 600px
                        width: '100%',
                        mx: 'auto',
                        position: 'relative',
                        borderRadius: theme.shape.borderRadius,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[1],
                        background: theme.palette.background.paper,
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <video
                            ref={videoRef}
                            src="/dotbridge-hero-small.mp4"
                            controls={isVideoPlaying}
                            playsInline
                            poster="/dotbridge-hero-cover.jpg"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            preload="auto"
                            onPlay={() => setIsVideoPlaying(true)}
                            onEnded={() => setIsVideoPlaying(false)}
                            onPause={() => setIsVideoPlaying(false)}
                        />
                        {!isVideoPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                                onClick={handlePlayButtonClick}
                                style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.4)', cursor: 'pointer',
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.95)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        boxShadow: theme.shadows[2],
                                    }}
                                >
                                    <DotBridgeIcon name="Play" size={40} color="primary.main" style={{ transform: 'translateX(3px)' }} />
                                </motion.div>
                            </motion.div>
                        )}
                    </Box>
                    <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                        <MuiTypography variant="body2">
                            <Link
                                to={`https://dotbridge.io/viewBridge/${DEMO_BRIDGE_ID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                                Try Interactive Demo <DotBridgeIcon name="ExternalLink" size={14} />
                            </Link>
                        </MuiTypography>
                    </Box>
                </Box>
            ) : (
                <DotBridgeCard
                    variant="outlined"
                    sx={{
                        maxWidth: { md: '100%', lg: '1300px' },
                        mx: 'auto',
                        position: 'relative',
                        aspectRatio: '16 / 9',
                        minHeight: { xs: 'auto', md: '730px' },
                        overflow: 'hidden',
                        '& .agent-connector-container': {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        },
                    }}
                >
                    {isMobile ? (
                        // Show video on mobile/Safari with proper 16:9 aspect ratio
                        <video
                            src="/dotbridge-hero-small.mp4"
                            poster="/dotbridge-hero-cover.jpg"
                            controls
                            playsInline
                            preload="metadata"
                            style={{
                                width: '100%',
                                height: 'auto',
                                aspectRatio: '16 / 9',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                        />
                    ) : (
                        // Show AgentConnector on desktop
                        <div className="agent-connector-container">
                            <AgentConnector
                                brdgeId={DEMO_BRIDGE_ID}
                                agentType="view"
                                token=""
                                userId={null}
                                isEmbed={false}
                            />
                        </div>
                    )}
                </DotBridgeCard>
            )}
            {!isMobile && (
                <DotBridgeTypography variant="body1" color="text.secondary" align="center" sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}>
                    <strong>Interactive demo:</strong> Ask questions, see dynamic prompts, and experience AI-powered video firsthand.
                </DotBridgeTypography>
            )}
        </Section>
    );
};

const ComparisonSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const comparisons = [
        {
            useCase: "Product Demos",
            icon: "Presentation",
            before: "One-size-fits-all demo videos",
            afterText: "AI personalizes demo path by role and company",
            result: "3× higher conversion"
        },
        {
            useCase: "Portfolio Showcase",
            icon: "Briefcase",
            before: "Static portfolio links in applications",
            afterText: "Interactive portfolio that answers hiring manager questions",
            result: "5× more interviews"
        },
        {
            useCase: "Course Sales",
            icon: "GraduationCap",
            before: "Long sales pages with generic testimonials",
            afterText: "AI demonstrates course value for each visitor's goals",
            result: "40% higher enrollment"
        },
        {
            useCase: "Consulting Pitches",
            icon: "Users",
            before: "Send proposal deck and wait for response",
            afterText: "Interactive ROI calculator with personalized case studies",
            result: "2× faster decisions"
        }
    ];

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.subtle' }}>
            <Container maxWidth="xl">
                <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 6, md: 10 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant='h2' component="h2" sx={{
                            mb: { xs: 3, md: 4 },
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            lineHeight: { xs: 1.2, md: 1.1 },
                            textAlign: 'center'
                        }}>
                            Every Bridge Works
                            <Box component="span" sx={{
                                color: theme.palette.primary.main,
                                display: 'block',
                                mt: { xs: 0.5, md: 0.25 }
                            }}>
                                Around the Clock
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.4rem' },
                            maxWidth: '700px',
                            mx: 'auto',
                            textAlign: 'center',
                            px: { xs: 2, md: 0 }
                        }}>
                            Whether you're selling products or selling yourself, your Bridge never stops working. Turn every interaction into a meaningful connection.
                        </DotBridgeTypography>
                    </motion.div>
                </Box>

                <Grid container spacing={{ xs: 3, sm: 3 }} justifyContent="center">
                    {comparisons.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <DotBridgeCard
                                    sx={{
                                        height: { xs: 'auto', md: '360px' },
                                        minHeight: { xs: '280px', sm: '340px', md: '360px' },
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        overflow: 'visible',
                                        transition: 'all 0.3s ease',
                                        border: '2px solid transparent',
                                        p: { xs: 2.5, sm: 3 },
                                        // Adjust font sizes for mobile
                                        '& .MuiTypography-h6': {
                                            fontSize: { xs: '1.125rem', sm: '1rem', md: '1.125rem' },
                                            minHeight: { xs: 'auto', sm: '2.75em', md: '3em' },
                                            display: 'flex',
                                            alignItems: 'center',
                                            lineHeight: { xs: 1.2, md: 1.3 },
                                            fontWeight: { xs: 700, md: 600 }
                                        },
                                        '& .MuiTypography-body2': {
                                            fontSize: { xs: '0.875rem', sm: '0.8rem', md: '0.875rem' },
                                            minHeight: { xs: 'auto', sm: '2.75em', md: '3em' },
                                            lineHeight: { xs: 1.4, md: 1.5 },
                                            color: { xs: 'text.primary', md: 'text.secondary' }
                                        },
                                        '& .MuiTypography-caption': {
                                            fontSize: { xs: '0.875rem', sm: '0.7rem', md: '0.75rem' },
                                            fontWeight: { xs: 600, md: 400 },
                                            textTransform: { xs: 'uppercase', md: 'none' },
                                            letterSpacing: { xs: '0.05em', md: 'normal' }
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            borderColor: 'primary.light',
                                            '& .result-chip': {
                                                transform: 'scale(1.05)'
                                            }
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Box sx={{
                                            width: { xs: 40, sm: 56 },
                                            height: { xs: 40, sm: 56 },
                                            borderRadius: 2,
                                            bgcolor: 'primary.lighter',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: { xs: 1.5, sm: 2 }
                                        }}>
                                            <DotBridgeIcon name={item.icon} size={isMobile ? 20 : 28} color="primary.main" />
                                        </Box>

                                        <Typography variant="h6" sx={{ mb: { xs: 1.5, sm: 2 }, fontWeight: 600 }}>
                                            {item.useCase}
                                        </Typography>

                                        <Box sx={{ mt: 'auto', mb: { xs: 2, sm: 3 } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 0.5, sm: 1 } }}>
                                                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'error.main' }} />
                                                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                                    Before
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ pl: 1.5 }}>
                                                {item.before}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 0.5, sm: 1 } }}>
                                                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'success.main' }} />
                                                <Typography variant="caption" color="success.main" fontWeight="bold">
                                                    After
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ pl: 1.5 }}>
                                                {item.afterText}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Result badge */}
                                    <Box
                                        className="result-chip"
                                        sx={{
                                            position: 'absolute',
                                            top: { xs: -10, sm: -12 },
                                            right: { xs: 12, sm: 16 },
                                            bgcolor: 'success.main',
                                            color: 'white',
                                            px: { xs: 1.5, sm: 2 },
                                            py: 0.5,
                                            borderRadius: 10,
                                            fontSize: { xs: '0.875rem', sm: '0.75rem' },
                                            fontWeight: 600,
                                            boxShadow: '0 4px 12px rgba(0, 199, 129, 0.3)',
                                            transition: 'transform 0.3s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.result}
                                    </Box>
                                </DotBridgeCard>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Section>
    );
};

const PersonalizedOutboundSection = () => {
    const theme = useTheme();
    const [hoveredCard, setHoveredCard] = useState(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [statsInView, setStatsInView] = useState(false);
    const [processStep, setProcessStep] = useState(null);

    // Auto-advance process steps
    useEffect(() => {
        // Start with a delay so no card is highlighted initially
        const initialDelay = setTimeout(() => {
            setProcessStep(0);
        }, 1000);

        // Then cycle through steps
        const interval = setInterval(() => {
            setProcessStep((prev) => {
                if (prev === null) return 0;
                return (prev + 1) % 3;
            });
        }, 2500);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, []);

    // Animated counter component
    const AnimatedNumber = ({ value, suffix = '', prefix = '' }) => {
        const [displayValue, setDisplayValue] = useState(0);
        const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ''));

        useEffect(() => {
            if (!statsInView) return;

            const duration = 2000;
            const steps = 60;
            const stepValue = numericValue / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                setDisplayValue(Math.min(Math.round(stepValue * currentStep), numericValue));

                if (currentStep >= steps) {
                    clearInterval(timer);
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }, [statsInView, numericValue]);

        return (
            <Typography variant="h4" sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontSize: { xs: '2rem', md: '2.125rem' },
                lineHeight: 1.1
            }}>
                {prefix}{displayValue}{suffix}
            </Typography>
        );
    };

    return (
        <Section sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter}10 100%)`,
            px: { xs: 1, sm: 2, md: 3 }
        }}>
            <Container maxWidth="xl">
                <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 6, md: 10 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label="✨ NEW: BRIDGE-AS-OUTBOUND"
                                color="primary"
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                    letterSpacing: '0.05em',
                                    mb: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    color: 'white',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                                    animation: prefersReducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
                                }}
                            />
                        </Box>
                        <DotBridgeTypography variant='h2' component="h2" sx={{
                            mb: { xs: 3, md: 4 },
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            lineHeight: { xs: 1.2, md: 1.1 },
                            textAlign: 'center'
                        }}>
                            Create 1,000 Personal Connections
                            <Box component="span" sx={{
                                color: theme.palette.primary.main,
                                display: 'block',
                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                mt: { xs: 0.5, md: 0.25 }
                            }}>
                                in Minutes, Not Months
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.4rem' },
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.6,
                            px: { xs: 2, sm: 1, md: 0 },
                            textAlign: 'center'
                        }}>
                            Upload your list. Each person gets their own AI-powered Bridge that speaks
                            directly to their needs, goals, and interests. No more generic messages.
                        </DotBridgeTypography>
                    </motion.div>
                </Box>

                {/* Personalization Showcase */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={fadeInUp}
                            >
                                <Box sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}20 100%)`,
                                    border: '2px solid',
                                    borderColor: theme.palette.primary.light,
                                    boxShadow: theme.shadows[3]
                                }}>
                                    <Typography variant="h6" sx={{
                                        mb: 3,
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        textAlign: 'center',
                                        fontSize: { xs: '1.125rem', md: '1.25rem' }
                                    }}>
                                        ✨ See Your Bridge in Action
                                    </Typography>

                                    {/* Example personalized messages */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                        {[
                                            {
                                                name: "Sarah Chen",
                                                company: "TechCorp",
                                                role: "Product Lead",
                                                message: "Hi Sarah! I noticed your focus on AI-driven products at TechCorp. I'd love to show you how we're helping product teams automate personalized user interactions..."
                                            },
                                            {
                                                name: "Mike Rodriguez",
                                                company: "Design Portfolio",
                                                role: "UX Designer",
                                                message: "Hey Mike! Your portfolio shows amazing work in user experience design. Let me demonstrate how you could showcase your design process and results to hiring managers..."
                                            },
                                            {
                                                name: "Jennifer Kim",
                                                company: "Growth Academy",
                                                role: "Course Creator",
                                                message: "Jennifer, your course on growth marketing looks fantastic. Here's how we can help you engage with potential students and showcase real success stories..."
                                            }
                                        ].map((example, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.2 }}
                                            >
                                                <Box sx={{
                                                    p: 2.5,
                                                    borderRadius: 2,
                                                    bgcolor: 'background.paper',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    position: 'relative',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: 4,
                                                        bgcolor: 'primary.main',
                                                        borderRadius: '2px 0 0 2px'
                                                    }
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                        <Box sx={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '50%',
                                                            bgcolor: 'primary.lighter',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 600,
                                                            color: 'primary.main'
                                                        }}>
                                                            {example.name.split(' ').map(n => n[0]).join('')}
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                                {example.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {example.role} at {example.company}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="body2" sx={{
                                                        fontStyle: 'italic',
                                                        color: 'text.secondary',
                                                        fontSize: { xs: '0.8125rem', md: '0.875rem' },
                                                        lineHeight: 1.5
                                                    }}>
                                                        "{example.message}"
                                                    </Typography>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Box>

                                    <Box sx={{
                                        mt: 3,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'success.lighter',
                                        border: '1px solid',
                                        borderColor: 'success.light',
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="caption" sx={{
                                            color: 'success.dark',
                                            fontWeight: 600,
                                            fontSize: { xs: '0.75rem', md: '0.8125rem' }
                                        }}>
                                            ✨ Each Bridge adapts to create meaningful connections
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                                variants={staggerChildren}
                            >
                                <Typography variant="h6" sx={{
                                    mb: 4,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: { xs: '1.125rem', md: '1.25rem' }
                                }}>
                                    How It Works
                                </Typography>

                                {[
                                    {
                                        icon: 'Upload',
                                        title: 'Upload Your List',
                                        desc: 'Add your audience list with relevant details about each person',
                                        color: 'primary'
                                    },
                                    {
                                        icon: 'Sparkles',
                                        title: 'AI Creates Personal Connections',
                                        desc: 'Each Bridge speaks directly to individual needs and goals',
                                        color: 'success'
                                    },
                                    {
                                        icon: 'Send',
                                        title: 'Share Your Bridges',
                                        desc: 'Everyone gets a unique link to their personalized experience',
                                        color: 'info'
                                    }
                                ].map((step, index) => (
                                    <motion.div key={index} variants={fadeInUp}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: { xs: 3, md: 4 },
                                                p: { xs: 2.5, md: 3 },
                                                borderRadius: 2,
                                                border: '2px solid',
                                                borderColor: processStep === index
                                                    ? `${step.color}.main`
                                                    : `${step.color}.light`,
                                                background: processStep === index
                                                    ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette[step.color].lighter}60 100%)`
                                                    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette[step.color].lighter}30 100%)`,
                                                transition: 'all 0.3s ease',
                                                transform: processStep === index ? 'translateY(-8px)' : 'none',
                                                boxShadow: processStep === index ? theme.shadows[4] : 'none',
                                                '&:hover': {
                                                    transform: processStep === index ? 'translateY(-8px)' : 'translateY(-4px)',
                                                    boxShadow: processStep === index ? theme.shadows[4] : theme.shadows[3],
                                                    borderColor: `${step.color}.main`
                                                }
                                            }}
                                            onClick={() => setProcessStep(index)}
                                        >
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${theme.palette[step.color].main} 0%, ${theme.palette[step.color].dark} 100%)`,
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2.5,
                                                fontSize: '1.25rem',
                                                fontWeight: 700,
                                                boxShadow: processStep === index
                                                    ? `0 8px 16px ${theme.palette[step.color].main}60`
                                                    : `0 4px 12px ${theme.palette[step.color].main}40`,
                                                flexShrink: 0,
                                                position: 'relative',
                                                animation: processStep === index
                                                    ? 'pulse 2s infinite'
                                                    : 'none',
                                                '&::after': {
                                                    content: `"${index + 1}"`,
                                                    position: 'absolute',
                                                    top: -8,
                                                    right: -8,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    bgcolor: 'background.paper',
                                                    border: '2px solid',
                                                    borderColor: `${step.color}.main`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    color: `${step.color}.main`
                                                }
                                            }}>
                                                <DotBridgeIcon name={step.icon} size={24} />
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{
                                                    mb: 1,
                                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                                    fontWeight: 600,
                                                    color: `${step.color}.dark`
                                                }}>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                    lineHeight: 1.5
                                                }}>
                                                    {step.desc}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                ))}

                                {/* Result callout */}
                                <motion.div variants={fadeInUp}>
                                    <Box sx={{
                                        mt: 3,
                                        p: 3,
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        color: 'white',
                                        textAlign: 'center',
                                        boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)'
                                    }}>
                                        <Typography variant="h6" sx={{
                                            mb: 1,
                                            fontWeight: 700,
                                            fontSize: { xs: '1rem', md: '1.125rem' }
                                        }}>
                                            🚀 Result: 1,000 Personalized Demos
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            opacity: 1,
                                            fontSize: { xs: '0.9375rem', md: '0.875rem' },
                                            color: 'rgba(255, 255, 255, 0.95)',
                                            fontWeight: 400
                                        }}>
                                            Each perfectly tailored to the prospect's role, company, and pain points
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Box>

                {/* Results showcase with glass morphism - Desktop only */}
                <Box sx={{
                    textAlign: 'center',
                    display: { xs: 'none', md: 'block' }
                }} ref={(ref) => ref && setStatsInView(true)}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                        Real Results from Bridge Users
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {[
                            { metric: '22', suffix: ' connections', desc: 'made in 3 days', icon: 'Users' },
                            { metric: '67', suffix: '%', prefix: '', desc: 'engagement vs 20% average', icon: 'Eye' },
                            { metric: '5', suffix: ' minutes', desc: 'average interaction time', icon: 'Clock' }
                        ].map((stat, index) => (
                            <Grid item xs={4} sm={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => triggerHaptic('light')}
                                >
                                    <Paper sx={{
                                        p: { xs: 2, md: 3 },
                                        textAlign: 'center',
                                        background: 'rgba(255, 255, 255, 0.7)',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        border: '1px solid',
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        minHeight: { xs: '140px', md: 'auto' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 40px rgba(0, 102, 255, 0.15)'
                                        },
                                        '&:active': {
                                            transform: 'scale(0.98)'
                                        }
                                    }}>
                                        <Box sx={{
                                            width: { xs: 40, md: 48 },
                                            height: { xs: 40, md: 48 },
                                            mx: 'auto',
                                            mb: { xs: 1.5, md: 2 },
                                            borderRadius: '50%',
                                            bgcolor: 'primary.lighter',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)'
                                        }}>
                                            <DotBridgeIcon name={stat.icon} size={isMobile ? 20 : 24} color="primary.main" />
                                        </Box>
                                        <AnimatedNumber
                                            value={stat.metric}
                                            suffix={stat.suffix}
                                            prefix={stat.prefix}
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            mt: 0.5,
                                            fontSize: { xs: '0.875rem', md: '0.875rem' },
                                            lineHeight: 1.4,
                                            fontWeight: 500
                                        }}>
                                            {stat.desc}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>


            </Container>

            {/* Add pulse animation style */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            `}</style>
        </Section>
    );
};

const FlowsSection = () => {
    const theme = useTheme();
    const [activeFlow, setActiveFlow] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const flows = [
        {
            title: "Champion Enablement",
            icon: "Users",
            bridges: ["Product Overview", "ROI Calculator", "Security Deep Dive"],
            description: "Empower your champion with everything they need to sell internally"
        },
        {
            title: "Executive Briefing",
            icon: "Briefcase",
            bridges: ["Strategic Vision", "Business Case", "Implementation Timeline"],
            description: "C-suite ready content that focuses on business outcomes"
        },
        {
            title: "Technical Evaluation",
            icon: "Code",
            bridges: ["Architecture Overview", "API Documentation", "Integration Guide"],
            description: "Deep technical content for engineering stakeholders"
        }
    ];

    // Auto-cycle through flows with pause functionality
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveFlow((prev) => (prev + 1) % flows.length);
        }, 4000); // 4 seconds per flow

        return () => clearInterval(interval);
    }, [flows.length, isPaused]);

    return (
        <Section>
            <Container maxWidth="xl">
                <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 6, md: 10 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label="INTRODUCING FLOWS"
                                color="secondary"
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    mb: 2
                                }}
                            />
                        </Box>
                        <DotBridgeTypography variant='h2' component="h2" sx={{
                            mb: { xs: 2, md: 3 },
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                        }}>
                            The Digital Sales Room
                            <Box component="span" sx={{ color: theme.palette.primary.main, display: 'block' }}>
                                That Actually Sells
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.6
                        }}>
                            Combine multiple Bridges into adaptive buyer journeys. Each stakeholder gets
                            their own personalized path, while you get unified insights.
                        </DotBridgeTypography>
                    </motion.div>
                </Box>

                {/* Flow progress indicator */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 4,
                        gap: 1
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {flows.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                setActiveFlow(index);
                                setIsPaused(true);
                                setTimeout(() => setIsPaused(false), 2000); // Resume after 2 seconds
                            }}
                            sx={{
                                width: 60,
                                height: 4,
                                borderRadius: 2,
                                bgcolor: activeFlow === index ? 'primary.main' : 'grey.300',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    bgcolor: activeFlow === index ? 'primary.dark' : 'grey.400',
                                    transform: 'scaleY(1.5)'
                                }
                            }}
                        >
                            {activeFlow === index && !isPaused && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: '100%',
                                    bgcolor: 'primary.light',
                                    animation: 'flowProgress 4s linear infinite',
                                    transformOrigin: 'left'
                                }} />
                            )}
                        </Box>
                    ))}
                </Box>

                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerChildren}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            {flows.map((flow, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    animate={{
                                        scale: activeFlow === index ? 1.02 : 1,
                                        transition: { duration: 0.3, ease: "easeInOut" }
                                    }}
                                >
                                    <Box
                                        onClick={() => {
                                            setActiveFlow(index);
                                            setIsPaused(true);
                                            setTimeout(() => setIsPaused(false), 3000); // Resume after 3 seconds
                                        }}
                                        sx={{
                                            p: 3,
                                            mb: 2,
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: activeFlow === index ? 'primary.main' : 'divider',
                                            bgcolor: activeFlow === index ? 'primary.lighter' : 'background.paper',
                                            cursor: 'pointer',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: activeFlow === index ? 'translateX(8px)' : 'translateX(0px)',
                                            boxShadow: activeFlow === index
                                                ? `0 8px 24px ${theme.palette.primary.main}20`
                                                : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                height: '100%',
                                                width: activeFlow === index ? '4px' : '0px',
                                                bgcolor: 'primary.main',
                                                transition: 'width 0.4s ease',
                                                borderRadius: '0 2px 2px 0'
                                            },
                                            '&:hover': {
                                                borderColor: 'primary.light',
                                                transform: 'translateX(12px)',
                                                boxShadow: `0 12px 32px ${theme.palette.primary.main}15`
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 2,
                                                bgcolor: activeFlow === index ? 'primary.main' : 'grey.100',
                                                color: activeFlow === index ? 'white' : 'text.secondary',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.4s ease',
                                                transform: activeFlow === index ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                                                boxShadow: activeFlow === index
                                                    ? `0 4px 12px ${theme.palette.primary.main}40`
                                                    : 'none'
                                            }}>
                                                <DotBridgeIcon name={flow.icon} size={24} />
                                            </Box>
                                            <Box sx={{ flex: 1, textAlign: 'left' }}>
                                                <Typography variant="h6" sx={{
                                                    mb: 0.5,
                                                    color: activeFlow === index ? 'primary.dark' : 'text.primary',
                                                    fontWeight: activeFlow === index ? 700 : 600,
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    {flow.title}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    color: activeFlow === index ? 'primary.dark' : 'text.secondary',
                                                    transition: 'color 0.3s ease'
                                                }}>
                                                    {flow.description}
                                                </Typography>
                                            </Box>
                                            {/* Active flow indicator */}
                                            {activeFlow === index && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Box sx={{
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                        boxShadow: `0 0 8px ${theme.palette.primary.main}60`,
                                                        animation: 'pulse 2s infinite'
                                                    }} />
                                                </motion.div>
                                            )}
                                        </Box>
                                    </Box>
                                </motion.div>
                            ))}
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <Box sx={{
                                p: 4,
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                boxShadow: theme.shadows[4],
                                border: '1px solid',
                                borderColor: 'divider',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Animated background gradient based on active flow */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                    transform: `translateX(${(activeFlow / flows.length) * 100 - 100}%)`,
                                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: isPaused ? 0.6 : 1,
                                    '&::after': isPaused ? {
                                        content: '"⏸"',
                                        position: 'absolute',
                                        right: 8,
                                        top: -20,
                                        fontSize: '12px',
                                        color: 'primary.main'
                                    } : {}
                                }} />

                                <motion.div
                                    key={activeFlow}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <Typography variant="h5" sx={{
                                        mb: 3,
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
                                        }}>
                                            <DotBridgeIcon name={flows[activeFlow].icon} size={20} />
                                        </Box>
                                        {flows[activeFlow].title} Flow
                                    </Typography>

                                    <Box sx={{ mb: 3 }}>
                                        {flows[activeFlow].bridges.map((bridge, index) => (
                                            <motion.div
                                                key={`${activeFlow}-${index}`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.1,
                                                    ease: "easeOut"
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        p: 2,
                                                        mb: 1.5,
                                                        borderRadius: 1.5,
                                                        border: '1px solid',
                                                        borderColor: 'grey.200',
                                                        bgcolor: 'grey.50',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            borderColor: 'primary.light',
                                                            bgcolor: 'primary.lighter',
                                                            transform: 'translateX(4px)',
                                                            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)'
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2,
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                        boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
                                                        transition: 'all 0.3s ease'
                                                    }}>
                                                        {index + 1}
                                                    </Box>
                                                    <Typography variant="body1" sx={{
                                                        flex: 1,
                                                        fontWeight: 500,
                                                        transition: 'color 0.3s ease'
                                                    }}>
                                                        {bridge}
                                                    </Typography>
                                                    <Box sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.lighter',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.3s ease'
                                                    }}>
                                                        <DotBridgeIcon name="Play" size={16} color="primary.main" />
                                                    </Box>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Box>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                    >
                                        <Box sx={{
                                            p: 2.5,
                                            borderRadius: 1.5,
                                            bgcolor: 'primary.lighter',
                                            border: '1px solid',
                                            borderColor: 'primary.light',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '2px',
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                                            }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Box sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    bgcolor: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <DotBridgeIcon name="Sparkles" size={14} color="white" />
                                                </Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                                                    Unified Deal Summary
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                                AI automatically generates a comprehensive summary of all stakeholder
                                                interactions, objections, and next steps for your sales team.
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </motion.div>
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* CSS Animations */}
            <style jsx>{`
            @keyframes flowProgress {
                0% { transform: scaleX(0); }
                100% { transform: scaleX(1); }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
        `}</style>
        </Section >
    );
};

const SectionDivider = ({ variant = "light" }) => {
    const theme = useTheme();

    const styles = {
        light: {
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
        },
        accent: {
            bgcolor: theme.palette.primary.lighter,
        },
        none: {
            display: 'none'
        }
    };

    return (
        <Box
            sx={{
                py: 0,
                ...styles[variant]
            }}
        >
            <Container maxWidth="lg">
                <Divider sx={{ borderColor: theme.palette.divider }} />
            </Container>
        </Box>
    );
};

const FAQSection = () => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        {
            q: "How does DotBridge help my sales team close more deals?",
            a: "DotBridge turns your passive sales videos (demos, VSLs, webinars) into interactive AI agents. These \"Bridges\" can qualify leads 24/7, answer prospect questions instantly, deliver personalized demo content based on their needs, and guide them through the sales process—freeing up your sales team to focus on highly qualified, bottom-of-funnel opportunities.",
            id: "panel1"
        },
        {
            q: "Can DotBridge integrate with our existing CRM or sales tools?",
            a: "Yes, our Premium plan offers CRM and webhook integrations, allowing you to seamlessly feed lead data, engagement metrics, and conversation insights from DotBridge into your existing sales and marketing ecosystem.",
            id: "panel2"
        },
        {
            q: "Is DotBridge suitable for our entire sales team, and can we manage content collaboratively?",
            a: "DotBridge is designed for ease of use, allowing any team member to create and deploy AI-powered Bridges without technical skills. While direct multi-user collaborative editing on a single Bridge isn\'t explicitly detailed, \"Flows\" allow for organizing multiple Bridges, and different team members can manage different Bridges or Flows based on your internal processes. For specific enterprise team management needs, we recommend discussing a custom solution.",
            id: "panel3"
        },
        {
            q: "How secure is our sales content and the data collected through DotBridge?",
            a: "We prioritize security. We use enterprise-grade encryption and security practices. Your sales content, prospect interaction data, and any voice models remain private and are used solely to power your Bridges and provide you with analytics.",
            id: "panel4"
        },
        {
            q: "Can we customize the Bridge player to match our company branding?",
            a: "Yes, our Premium plan offers customization options for player colors and branding, ensuring a consistent and professional experience that aligns with your company\'s visual identity.",
            id: "panel5"
        },
        {
            q: "What kind of sales content works best with DotBridge?",
            a: "DotBridge is versatile. You can use it to supercharge existing MP4 videos like product demos, VSLs, recorded webinars, or even explainer videos. You can also supplement the AI\'s knowledge with PDF documents (e.g., sales decks, product sheets) to ensure comprehensive and accurate responses.",
            id: "panel6"
        },
        {
            q: "How can we measure the ROI of using DotBridge?",
            a: "DotBridge provides analytics on viewer engagement, questions asked, and conversion points within your interactive content. Our Premium plan offers advanced analytics, and with CRM integration, you can directly track how DotBridge interactions contribute to lead generation, qualification, and closed deals, giving you clear insight into its impact on your sales pipeline.",
            id: "panel7"
        },
        {
            q: "What are \"AI Minutes\" and how many do we need?",
            a: "AI Minutes are consumed when the AI interacts with a prospect—answering questions or guiding them through content. The number of minutes you\'ll need depends on the volume of traffic to your Bridges and the average interaction length. Our plans offer different tiers of AI Minutes, and you can monitor usage in your dashboard. For high-volume needs, we can discuss custom plans.",
            id: "panel8"
        }
    ];

    return (
        <Section>
            <Box maxWidth="md" mx="auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <DotBridgeTypography variant='h2' component="h2" sx={{
                        mb: { xs: 6, md: 8 },
                        textAlign: 'center',
                        fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                    }}>
                        Questions About Bridges?
                    </DotBridgeTypography>
                </motion.div>

                <motion.div
                    variants={staggerChildren}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {faqs.map((faq, index) => (
                        <motion.div key={faq.id} variants={fadeInUp} custom={index}>
                            <Accordion
                                expanded={expanded === faq.id}
                                onChange={handleChange(faq.id)}
                                sx={{
                                    mb: 1.5,
                                    boxShadow: expanded === faq.id ? theme.shadows[1] : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: expanded === faq.id ? '' : theme.palette.grey[50]
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<DotBridgeIcon name={expanded === faq.id ? "Minus" : "Plus"} size={20} color="primary.main" />}
                                    aria-controls={`${faq.id}-content`}
                                    id={`${faq.id}-header`}
                                    sx={{
                                        py: { xs: 1.5, md: 2 },
                                        px: { xs: 2, md: 3 },
                                    }}
                                >
                                    <DotBridgeTypography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1rem', md: '1.25rem' },
                                            fontWeight: expanded === faq.id ? 600 : 500,
                                            color: expanded === faq.id ? 'primary.main' : 'text.primary',
                                            transition: 'color 0.2s ease, font-weight 0.2s ease'
                                        }}
                                    >
                                        {faq.q}
                                    </DotBridgeTypography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ py: { xs: 2, md: 2.5 }, px: { xs: 2, md: 3 } }}>
                                    <DotBridgeTypography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {faq.a}
                                    </DotBridgeTypography>
                                </AccordionDetails>
                            </Accordion>
                        </motion.div>
                    ))}
                </motion.div>
            </Box>
        </Section>
    );
}

const UseCasesSection = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // Define primary blue colors
    const primaryBlue = theme.palette.primary.main;
    const lightBlue = theme.palette.primary.light;
    const darkBlue = theme.palette.primary.dark;
    const blueGradient = `linear-gradient(135deg, ${lightBlue} 0%, ${primaryBlue} 100%)`;

    const buyerJourneySteps = [
        {
            icon: 'Eye',
            title: 'First Impression',
            description: 'Initial connection point',
            bridgeAction: 'Introduction Bridge',
            example: 'Share expertise & build trust',
            color: 'primary',
            gradient: blueGradient
        },
        {
            icon: 'MessageSquare',
            title: 'Understanding',
            description: 'Learn about their needs',
            bridgeAction: 'Conversation Bridge',
            example: 'Ask questions & listen',
            color: 'primary',
            gradient: blueGradient
        },
        {
            icon: 'Presentation',
            title: 'Solution',
            description: 'Show how you can help',
            bridgeAction: 'Demo Bridge',
            example: 'Personalized presentation',
            color: 'primary',
            gradient: blueGradient
        },
        {
            icon: 'CheckCircle',
            title: 'Decision',
            description: 'Support their choice',
            bridgeAction: 'Support Bridge',
            example: 'Answer final questions',
            color: 'primary',
            gradient: blueGradient
        },
        {
            icon: 'Rocket',
            title: 'Success',
            description: 'Help them achieve goals',
            bridgeAction: 'Success Bridge',
            example: 'Guide & support journey',
            color: 'primary',
            gradient: blueGradient
        }
    ];

    // Auto-advance timer for both mobile and desktop
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => {
                const next = (prev + 1) % buyerJourneySteps.length;
                if (isMobile && scrollContainerRef.current) {
                    scrollToStep(next);
                }
                return next;
            });
        }, 1500); // 1.5 seconds per step

        return () => clearInterval(interval);
    }, [isMobile, buyerJourneySteps.length, isPaused]);

    // Check scroll position for indicators
    const checkScrollPosition = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

        // Update active step based on scroll position
        const cardWidth = clientWidth * 0.8; // 80% of viewport
        const newActiveStep = Math.round(scrollLeft / (cardWidth + 16)); // 16px gap
        setActiveStep(Math.min(newActiveStep, buyerJourneySteps.length - 1));
    };

    // Scroll to specific step
    const scrollToStep = (stepIndex) => {
        if (!scrollContainerRef.current || !isMobile) return;
        const cardWidth = scrollContainerRef.current.clientWidth * 0.8;
        const gap = 16;
        const scrollPosition = stepIndex * (cardWidth + gap);

        scrollContainerRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        triggerHaptic('light');
    };

    // Handle touch interactions
    const handleCardTouch = (index) => {
        if (isMobile) {
            setActiveStep(index);
            triggerHaptic('light');
        }
    };

    return (
        <Section
            sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                py: { xs: 6, sm: 10, md: 12 },
                px: { xs: 0, sm: 2, md: 3 }, // No padding on mobile for edge-to-edge scroll
                background: theme.palette.background.default
            }}
        >
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
                <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 4, md: 6 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant='h2' component="h2" sx={{
                            mb: { xs: 2, md: 3 },
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            color: darkBlue,
                            fontWeight: 700,
                            lineHeight: { xs: 1.2, md: 1.1 },
                            textAlign: 'center'
                        }}>
                            One Bridge for Every Stage
                            <Box component="span" sx={{
                                display: 'block',
                                color: primaryBlue,
                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                mt: { xs: 0.5, md: 0.25 }
                            }}>
                                of Your Connection Journey
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.25rem' },
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.6,
                            px: { xs: 2, sm: 2, md: 0 },
                            textAlign: 'center'
                        }}>
                            From first impression to success, create personalized Bridges that guide people through
                            every touchpoint. Each Bridge speaks to specific needs at the right moment.
                        </DotBridgeTypography>
                    </motion.div>
                </Box>

                {/* Progress indicators for mobile */}
                {isMobile && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        mb: 3,
                        px: 2
                    }}>
                        {buyerJourneySteps.map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => scrollToStep(index)}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: activeStep === index ? primaryBlue : 'grey.300',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: activeStep === index ? 'scale(1.3)' : 'scale(1)',
                                    '&:active': {
                                        transform: 'scale(0.9)'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                )}

                {/* Mobile horizontal scroll */}
                {isMobile ? (
                    <Box sx={{ position: 'relative', mx: -2 }}>
                        <Box
                            ref={scrollContainerRef}
                            onScroll={checkScrollPosition}
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                scrollSnapType: 'x mandatory',
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': { display: 'none' },
                                px: 2,
                                pb: 2,
                                // Momentum scrolling
                                scrollBehavior: 'smooth'
                            }}
                        >
                            {buyerJourneySteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{
                                        flex: '0 0 80%',
                                        scrollSnapAlign: 'center'
                                    }}
                                >
                                    <Box
                                        onClick={() => handleCardTouch(index)}
                                        sx={{
                                            minHeight: 280,
                                            p: 3,
                                            borderRadius: 3,
                                            border: '2px solid',
                                            borderColor: activeStep === index ? primaryBlue : 'divider',
                                            background: activeStep === index
                                                ? `linear-gradient(135deg, white 0%, ${theme.palette.primary.lighter} 100%)`
                                                : 'background.paper',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            transform: activeStep === index ? 'scale(1)' : 'scale(0.98)',
                                            boxShadow: activeStep === index
                                                ? `0 12px 24px ${primaryBlue}30`
                                                : theme.shadows[1],
                                            '&:active': {
                                                transform: 'scale(0.96)'
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            background: activeStep === index ? blueGradient : 'grey.100',
                                            color: activeStep === index ? 'white' : 'text.secondary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            mx: 'auto',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <DotBridgeIcon name={step.icon} size={28} />
                                        </Box>

                                        <Typography variant="h6" sx={{
                                            mb: 1,
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            color: activeStep === index ? darkBlue : 'text.primary',
                                            fontSize: '1.1rem'
                                        }}>
                                            {step.title}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{
                                            textAlign: 'center',
                                            mb: 2,
                                            minHeight: 40
                                        }}>
                                            {step.description}
                                        </Typography>

                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            background: activeStep === index
                                                ? blueGradient
                                                : 'grey.50',
                                            border: '1px solid',
                                            borderColor: activeStep === index ? 'transparent' : 'grey.200'
                                        }}>
                                            <Typography variant="caption" sx={{
                                                fontWeight: 600,
                                                color: activeStep === index ? 'white' : 'text.secondary',
                                                display: 'block',
                                                textAlign: 'center'
                                            }}>
                                                {step.bridgeAction}
                                            </Typography>
                                            <Typography variant="caption" sx={{
                                                display: 'block',
                                                textAlign: 'center',
                                                color: activeStep === index ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                                                fontSize: '0.65rem',
                                                mt: 0.5,
                                                fontStyle: 'italic'
                                            }}>
                                                {step.example}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            ))}
                        </Box>

                        {/* Swipe hint */}
                        <AnimatePresence>
                            {canScrollRight && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    <Typography variant="caption" sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: 'primary.main',
                                        fontWeight: 500
                                    }}>
                                        Swipe →
                                    </Typography>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                ) : (
                    // Desktop grid layout
                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'visible',
                            gap: 2,
                            pb: 0
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Progress indicator for desktop */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            mb: 3,
                            position: 'absolute',
                            top: -40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 10
                        }}>
                            {buyerJourneySteps.map((_, index) => (
                                <Box
                                    key={index}
                                    onClick={() => {
                                        setActiveStep(index);
                                        setIsPaused(true);
                                        setTimeout(() => setIsPaused(false), 3000); // Resume after 3 seconds
                                    }}
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: activeStep === index ? primaryBlue : 'grey.300',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        transform: activeStep === index ? 'scale(1.3)' : 'scale(1)',
                                        boxShadow: activeStep === index ? `0 2px 8px ${primaryBlue}40` : 'none',
                                        '&:hover': {
                                            bgcolor: activeStep === index ? primaryBlue : 'grey.400',
                                            transform: 'scale(1.2)'
                                        }
                                    }}
                                />
                            ))}
                        </Box>

                        <Grid container spacing={2} justifyContent="center">
                            {buyerJourneySteps.map((step, index) => (
                                <Grid item xs={6} sm={6} md={2.4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        style={{ height: '100%' }}
                                    >
                                        <Box
                                            onClick={() => {
                                                setActiveStep(index);
                                                setIsPaused(true);
                                                setTimeout(() => setIsPaused(false), 3000); // Resume after 3 seconds
                                            }}
                                            sx={{
                                                height: '100%',
                                                minHeight: 320,
                                                p: 3,
                                                borderRadius: 3,
                                                border: '2px solid',
                                                borderColor: activeStep === index ? primaryBlue : 'divider',
                                                background: activeStep === index
                                                    ? `linear-gradient(135deg, white 0%, ${theme.palette.primary.lighter} 100%)`
                                                    : 'background.paper',
                                                cursor: 'pointer',
                                                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                transform: activeStep === index ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
                                                boxShadow: activeStep === index
                                                    ? `0 16px 32px ${primaryBlue}25, 0 0 0 1px ${primaryBlue}40`
                                                    : theme.shadows[1],
                                                position: 'relative',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                '&:hover': {
                                                    transform: activeStep === index ? 'scale(1.05) translateY(-8px)' : 'scale(1.02) translateY(-4px)',
                                                    boxShadow: activeStep === index
                                                        ? `0 20px 40px ${primaryBlue}30, 0 0 0 1px ${primaryBlue}50`
                                                        : `0 8px 24px ${primaryBlue}20`,
                                                    borderColor: primaryBlue
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: 4,
                                                    background: activeStep === index ? blueGradient : 'transparent',
                                                    transition: 'all 0.6s ease'
                                                },
                                                // Add a subtle pulse animation for active step
                                                animation: activeStep === index ? 'subtle-pulse 2s ease-in-out infinite' : 'none',
                                                '@keyframes subtle-pulse': {
                                                    '0%, 100%': {
                                                        boxShadow: `0 16px 32px ${primaryBlue}25, 0 0 0 1px ${primaryBlue}40`
                                                    },
                                                    '50%': {
                                                        boxShadow: `0 20px 40px ${primaryBlue}35, 0 0 0 1px ${primaryBlue}60`
                                                    }
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 2,
                                                background: activeStep === index ? blueGradient : 'grey.100',
                                                color: activeStep === index ? 'white' : 'text.secondary',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 1.5,
                                                mx: 'auto',
                                                transition: 'all 0.3s ease',
                                                boxShadow: activeStep === index
                                                    ? `0 8px 16px ${primaryBlue}40`
                                                    : 'none'
                                            }}>
                                                <DotBridgeIcon name={step.icon} size={32} />
                                            </Box>

                                            <Typography variant="h6" sx={{
                                                mb: 1,
                                                textAlign: 'center',
                                                fontWeight: 600,
                                                color: activeStep === index ? darkBlue : 'text.primary',
                                                fontSize: '1.1rem',
                                                minHeight: 32
                                            }}>
                                                {step.title}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{
                                                textAlign: 'center',
                                                mb: 1.5,
                                                minHeight: 40,
                                                fontSize: '0.875rem'
                                            }}>
                                                {step.description}
                                            </Typography>

                                            <Box sx={{
                                                mt: 'auto',
                                                p: 1.5,
                                                borderRadius: 2,
                                                background: activeStep === index
                                                    ? blueGradient
                                                    : 'grey.50',
                                                border: '1px solid',
                                                borderColor: activeStep === index ? 'transparent' : 'grey.200'
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    fontWeight: 600,
                                                    color: activeStep === index ? 'white' : 'text.secondary',
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {step.bridgeAction}
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    color: activeStep === index ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                                                    fontSize: '0.7rem',
                                                    mt: 0.5,
                                                    fontStyle: 'italic',
                                                    minHeight: 18
                                                }}>
                                                    {step.example}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Results Section */}
                <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <Typography variant="h4" sx={{
                            mb: 4,
                            fontWeight: 600,
                            color: darkBlue,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                        }}>
                            The Result: 3× More Meaningful Connections
                        </Typography>
                    </motion.div>

                    <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
                        {[
                            { metric: '73%', label: 'Higher Engagement', desc: 'vs static content' },
                            { metric: '5× More', label: 'Quality Connections', desc: 'through AI conversations' },
                            { metric: '24/7', label: 'Always Available', desc: 'never miss an opportunity' }
                        ].map((stat, index) => (
                            <Grid item xs={4} sm={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Paper sx={{
                                        p: { xs: 1.5, md: 3 },
                                        textAlign: 'center',
                                        border: '2px solid',
                                        borderColor: 'divider',
                                        background: `linear-gradient(135deg, white 0%, ${lightBlue}15 100%)`,
                                        minHeight: { xs: '120px', md: 'auto' },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            borderColor: primaryBlue,
                                            transform: 'translateY(-4px)',
                                            transition: 'all 0.3s ease',
                                            boxShadow: `0 8px 24px ${primaryBlue}20`
                                        }
                                    }}>
                                        <Typography variant="h3" sx={{
                                            fontWeight: 700,
                                            color: primaryBlue,
                                            mb: { xs: 0.5, md: 1 },
                                            fontSize: { xs: '1.5rem', md: '2.5rem' },
                                            lineHeight: 1.1
                                        }}>
                                            {stat.metric}
                                        </Typography>
                                        <Typography variant="h6" sx={{
                                            mb: { xs: 0.25, md: 0.5 },
                                            fontSize: { xs: '0.875rem', md: '1.25rem' },
                                            lineHeight: 1.2
                                        }}>
                                            {stat.label}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                                            lineHeight: 1.3
                                        }}>
                                            {stat.desc}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: { xs: 4, md: 6 } }}>
                        <DotBridgeButton
                            variant="contained"
                            color="primary"
                            size="large"
                            component={Link}
                            to="/signup"
                            endIcon={<DotBridgeIcon name="ArrowRight" />}
                            onClick={() => triggerHaptic('medium')}
                            sx={{
                                px: { xs: 3, md: 4 },
                                py: 1.5,
                                fontSize: { xs: '0.9rem', md: '1.1rem' },
                                fontWeight: 600,
                                background: blueGradient,
                                color: 'white',
                                boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                },
                                '&:active': {
                                    transform: 'scale(0.98)'
                                }
                            }}
                        >
                            Start Your First Bridge Free
                        </DotBridgeButton>
                    </Box>
                </Box>
            </Container>
        </Section>
    );
};

const HowItWorksSection = () => {
    const theme = useTheme();
    const [hoveredStep, setHoveredStep] = useState(null);
    const [expandedStep, setExpandedStep] = useState(0);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [stepProgress, setStepProgress] = useState(0);

    const steps = [
        {
            icon: "UploadCloud",
            emoji: "☁️",
            title: "Upload",
            text: "Drop your video and select a use case",
            detail: "Supports MP4 files, optionally upload pdf as supporting data",
            color: 'primary',
            gradient: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
        },
        {
            icon: "UserCog",
            emoji: "🎯",
            title: "Configure",
            text: "Finalize AI personality and engagement points in 60 seconds",
            detail: "Define tone and conversation objectives",
            color: 'success',
            gradient: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`
        },
        {
            icon: "MicVocal",
            emoji: "🎤",
            title: "Personalize",
            text: "Clone your voice for authentic responses and add prospect data",
            detail: "Optional: Add your voice for truly personal AI interactions",
            color: 'warning',
            gradient: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.main} 100%)`
        },
        {
            icon: "Send",
            emoji: "🚀",
            title: "Launch",
            text: "Share your Bridge and track engagement",
            detail: "Get shareable links, embeds, and real-time analytics",
            color: 'info',
            gradient: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`
        }
    ];

    // Simulate progress for demo purposes
    useEffect(() => {
        const interval = setInterval(() => {
            setStepProgress(prev => {
                if (prev >= 100) {
                    setExpandedStep(current => (current + 1) % steps.length);
                    triggerHaptic('success');
                    return 0;
                }
                return prev + 2;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [steps.length]);

    const handleStepClick = (index) => {
        if (isMobile) {
            setExpandedStep(index);
            setStepProgress(0);
            triggerHaptic('light');
        }
    };

    return (
        <Section sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter}05 50%, ${theme.palette.background.default} 100%)`
        }}>
            <Container maxWidth="xl">
                <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 8, md: 12 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant='h2' component="h2" sx={{
                            mb: { xs: 3, md: 4 },
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            lineHeight: { xs: 1.2, md: 1.1 },
                            textAlign: 'center',
                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Launch Your First Bridge
                            <Box component="span" sx={{
                                display: 'block',
                                mt: { xs: 0.5, md: 0.25 },
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                in Minutes
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeInUp}
                    >
                        <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.4rem' },
                            textAlign: 'center',
                            px: { xs: 2, md: 0 }
                        }}>
                            No code required. No complex setup. Just upload, configure, and watch the magic happen.
                        </DotBridgeTypography>
                    </motion.div>
                </Box>

                {/* Desktop Flow - Completely redesigned */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 10 }}>
                    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                        <Grid container spacing={4}>
                            {steps.map((step, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.15, duration: 0.6 }}
                                        onHoverStart={() => setHoveredStep(index)}
                                        onHoverEnd={() => setHoveredStep(null)}
                                    >
                                        <Box sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            background: hoveredStep === index
                                                ? `linear-gradient(135deg, white 0%, ${theme.palette[step.color].lighter}20 100%)`
                                                : 'background.paper',
                                            border: '2px solid',
                                            borderColor: hoveredStep === index ? `${step.color}.light` : 'divider',
                                            boxShadow: hoveredStep === index ? theme.shadows[4] : theme.shadows[1],
                                            transition: 'all 0.3s ease',
                                            transform: hoveredStep === index ? 'translateY(-8px)' : 'translateY(0)',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 6,
                                                background: step.gradient,
                                                opacity: hoveredStep === index ? 1 : 0,
                                                transition: 'opacity 0.3s ease'
                                            }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                                <Box sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 3,
                                                    background: step.gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    boxShadow: `0 8px 24px ${theme.palette[step.color].main}30`,
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: `"${index + 1}"`,
                                                        position: 'absolute',
                                                        top: -10,
                                                        right: -10,
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        bgcolor: 'background.paper',
                                                        border: '2px solid',
                                                        borderColor: `${step.color}.main`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 700,
                                                        color: `${step.color}.main`
                                                    }
                                                }}>
                                                    <DotBridgeIcon
                                                        name={step.icon}
                                                        size={36}
                                                        color="white"
                                                    />
                                                </Box>

                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h5" sx={{
                                                        mb: 1,
                                                        fontWeight: 700,
                                                        color: hoveredStep === index ? `${step.color}.dark` : 'text.primary'
                                                    }}>
                                                        {step.title}
                                                    </Typography>

                                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                        {step.text}
                                                    </Typography>

                                                    <AnimatePresence>
                                                        {hoveredStep === index && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <Paper sx={{
                                                                    p: 2,
                                                                    bgcolor: `${step.color}.lighter`,
                                                                    border: '1px solid',
                                                                    borderColor: `${step.color}.light`
                                                                }}>
                                                                    <Typography variant="body2" sx={{
                                                                        color: `${step.color}.dark`,
                                                                        fontWeight: 500
                                                                    }}>
                                                                        {step.detail}
                                                                    </Typography>
                                                                </Paper>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>


                    </Box>
                </Box>

                {/* Mobile Flow - Accordion Style */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 6 }}>
                    <Box sx={{ maxWidth: '100%', mx: 'auto', px: 2 }}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <Box
                                    onClick={() => handleStepClick(index)}
                                    sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        border: '2px solid',
                                        borderColor: expandedStep === index ? `${step.color}.main` : 'divider',
                                        background: expandedStep === index
                                            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette[step.color].lighter}30 100%)`
                                            : 'background.paper',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        boxShadow: expandedStep === index ? theme.shadows[3] : theme.shadows[1],
                                        '&:active': {
                                            transform: 'scale(0.98)'
                                        }
                                    }}
                                >
                                    {/* Progress bar for active step - thicker and more visible */}
                                    {expandedStep === index && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            bgcolor: 'background.paper',
                                            overflow: 'hidden'
                                        }}>
                                            <Box sx={{
                                                height: '100%',
                                                width: `${stepProgress}%`,
                                                background: step.gradient,
                                                transition: 'width 0.1s linear'
                                            }} />
                                        </Box>
                                    )}

                                    <Box sx={{
                                        p: 2.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Box sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            background: step.gradient,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            boxShadow: `0 4px 12px ${theme.palette[step.color].main}30`,
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            opacity: expandedStep === index ? 1 : 0.85,
                                            transform: expandedStep === index ? 'scale(1)' : 'scale(0.95)',
                                            '&::after': {
                                                content: `"${index + 1}"`,
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                bgcolor: 'background.paper',
                                                border: '2px solid',
                                                borderColor: `${step.color}.main`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: `${step.color}.main`
                                            }
                                        }}>
                                            <DotBridgeIcon
                                                name={step.icon}
                                                size={28}
                                                color="white"
                                            />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                color: expandedStep === index ? `${step.color}.dark` : 'text.primary'
                                            }}>
                                                {step.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                fontSize: '0.8125rem',
                                                display: expandedStep === index ? 'none' : 'block',
                                                mt: 0.5
                                            }}>
                                                {step.text}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            transform: expandedStep === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease',
                                            color: expandedStep === index ? `${step.color}.main` : 'text.secondary'
                                        }}>
                                            <DotBridgeIcon name="ChevronDown" size={20} />
                                        </Box>
                                    </Box>

                                    {/* Expanded content */}
                                    <AnimatePresence>
                                        {expandedStep === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Box sx={{
                                                    px: 2.5,
                                                    pb: 2.5,
                                                    borderTop: '1px solid',
                                                    borderColor: 'divider',
                                                    pt: 2
                                                }}>
                                                    <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
                                                        {step.text}
                                                    </Typography>
                                                    <Paper sx={{
                                                        p: 2,
                                                        bgcolor: `${step.color}.lighter`,
                                                        border: '1px solid',
                                                        borderColor: `${step.color}.light`
                                                    }}>
                                                        <Typography variant="body2" sx={{
                                                            color: `${step.color}.dark`,
                                                            fontWeight: 500,
                                                            fontSize: '0.8125rem'
                                                        }}>
                                                            {step.detail}
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Box>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <Box textAlign="center" mt={{ xs: 4, md: 6 }}>
                        <Paper sx={{
                            display: 'inline-block',
                            p: { xs: 2, md: 3 },
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${theme.palette.success.lighter} 0%, ${theme.palette.success.lighter}50 100%)`,
                            border: '2px solid',
                            borderColor: 'success.light',
                            position: 'relative',
                            overflow: 'hidden',
                            maxWidth: { xs: '90%', md: 'auto' },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                                animation: prefersReducedMotion ? 'none' : 'shimmer 2s infinite'
                            }
                        }}>
                            <DotBridgeTypography variant="h6" sx={{
                                color: 'success.dark',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                fontSize: { xs: '0.9rem', md: '1.25rem' }
                            }}>
                                <DotBridgeIcon name="Clock" size={isMobile ? 18 : 20} color="success.main" />
                                Total setup time: under 10 minutes
                            </DotBridgeTypography>
                        </Paper>
                    </Box>
                </motion.div>
            </Container>

            {/* CSS for animations and mobile optimizations */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                
                /* Mobile performance optimizations */
                @media (max-width: 768px) {
                    * {
                        -webkit-tap-highlight-color: transparent;
                    }
                    
                    /* Smooth scrolling with momentum */
                    .horizontal-scroll {
                        -webkit-overflow-scrolling: touch;
                        scroll-behavior: smooth;
                    }
                    
                    /* Optimize animations for mobile */
                    .mobile-optimize {
                        transform: translateZ(0);
                        backface-visibility: hidden;
                        -webkit-backface-visibility: hidden;
                    }
                    
                    /* Reduce motion for battery saving */
                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                            transition-duration: 0.01ms !important;
                        }
                    }
                }
                
                /* Glass morphism support */
                @supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
                    .glass-morphism {
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                    }
                }
            `}</style>
        </Section>
    );
};

const ProofSection = () => {
    const metrics = [
        { value: "+42%", label: "Lead-to-SQL Conversion", sub: "(Enterprise SaaS)" },
        { value: "-38%", label: "Sales Cycle Duration", sub: "(Average Reduction)" },
        { value: "4.7x", label: "Pipeline Generated", sub: "(Per Sales Rep)" },
        { value: "$2.6M", label: "ARR Influenced", sub: "(Early Customers)" }
    ];
    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <Box maxWidth="md" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Enterprise-Grade Results
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
                }}>
                    How B2B companies are transforming their sales pipeline with DotBridge
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
                {metrics.map((metric, index) => (
                    <Grid item xs={6} sm={6} md={3} key={index}>
                        <DotBridgeCard variant="outlined" sx={{
                            height: '100%',
                            textAlign: 'center',
                            p: { xs: 2, sm: 3, md: 4 },
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                            }
                        }}>
                            <DotBridgeTypography variant="h3" color="primary.main" sx={{
                                mb: 1,
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                                fontWeight: 700
                            }}>
                                {metric.value}
                            </DotBridgeTypography>
                            <DotBridgeTypography variant="h6" sx={{
                                mb: 0.5,
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                            }}>{metric.label}</DotBridgeTypography>
                            <DotBridgeTypography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>{metric.sub}</DotBridgeTypography>
                        </DotBridgeCard>
                    </Grid>
                ))}
            </Grid>
            <Box textAlign="center" mt={{ xs: 4, md: 6 }}>
                <DotBridgeTypography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    "DotBridge has completely changed how we engage with enterprise prospects."
                </DotBridgeTypography>
                <DotBridgeTypography variant="body2" color="text.secondary">
                    — VP of Sales, Leading Enterprise SaaS Platform
                </DotBridgeTypography>
            </Box>
        </Section>
    );
};

const PricingSection = () => {
    const theme = useTheme();

    return (
        <Section sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.subtle' }}>
            <Box maxWidth="lg" mx="auto" textAlign="center" mb={{ xs: 4, md: 8 }}>
                <DotBridgeTypography variant='h2' component="h2" sx={{
                    mb: { xs: 1, md: 2 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                }}>
                    Simple, Transparent Pricing
                </DotBridgeTypography>
                <DotBridgeTypography variant="h5" color="text.secondary" sx={{
                    fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                    maxWidth: '600px',
                    mx: 'auto'
                }}>
                    Start free. Scale as you grow. No surprises.
                </DotBridgeTypography>
            </Box>
            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="stretch">
                <Grid item xs={12} sm={6} md={4}>
                    <DotBridgeCard sx={{
                        p: { xs: 3, md: 4 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        bgcolor: 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: 'grey.300',
                            boxShadow: (theme) => theme.shadows[2],
                            transform: 'translateY(-4px)'
                        }
                    }}>
                        <DotBridgeTypography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 2 }}>Free</DotBridgeTypography>
                        <Box sx={{ mb: 3 }}>
                            <DotBridgeTypography variant="h2" sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700
                            }}>$0</DotBridgeTypography>
                            <DotBridgeTypography variant="body2" color="text.secondary">Forever free</DotBridgeTypography>
                        </Box>
                        <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Perfect for trying out DotBridge
                        </DotBridgeTypography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                            {[
                                "1 Bridge",
                                "30 AI minutes/month",
                                "Voice cloning",
                                "Basic analytics",
                                "Community support"
                            ].map(feature => (
                                <Box component="li" key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <DotBridgeIcon name="Check" size={18} color="primary.main" />
                                    <DotBridgeTypography variant="body2" component="span">{feature}</DotBridgeTypography>
                                </Box>
                            ))}
                        </Box>
                        <DotBridgeButton fullWidth variant="outlined" color="primary" component={Link} to="/signup">
                            Get Started
                        </DotBridgeButton>
                    </DotBridgeCard>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DotBridgeCard sx={{
                        p: { xs: 3, md: 4 },
                        height: '100%',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'background.paper',
                        boxShadow: (theme) => theme.shadows[3],
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: (theme) => theme.shadows[4],
                            transform: 'translateY(-4px)'
                        }
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: -12,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            px: 2,
                            py: 0.5,
                            borderRadius: '16px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Most Popular
                        </Box>
                        <DotBridgeTypography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 2 }}>Standard</DotBridgeTypography>
                        <Box sx={{ mb: 3 }}>
                            <DotBridgeTypography variant="h2" sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700
                            }}>$49</DotBridgeTypography>
                            <DotBridgeTypography variant="body2" color="text.secondary">per month</DotBridgeTypography>
                        </Box>
                        <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            For growing sales teams
                        </DotBridgeTypography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                            {[
                                "10 Bridges",
                                "300 AI minutes/month",
                                "Voice cloning",
                                "Advanced analytics",
                                "Email support",
                                "Custom branding"
                            ].map(feature => (
                                <Box component="li" key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <DotBridgeIcon name="Check" size={18} color="primary.main" />
                                    <DotBridgeTypography variant="body2" component="span">{feature}</DotBridgeTypography>
                                </Box>
                            ))}
                        </Box>
                        <DotBridgeButton fullWidth variant="contained" color="primary" component={Link} to="/signup?plan=standard" sx={{ color: 'white' }}>
                            Start Free Trial
                        </DotBridgeButton>
                    </DotBridgeCard>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <DotBridgeCard sx={{
                        p: { xs: 3, md: 4 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: 'grey.300',
                            transform: 'translateY(-4px)',
                            boxShadow: (theme) => theme.shadows[2]
                        }
                    }}>
                        <DotBridgeTypography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 2 }}>Premium</DotBridgeTypography>
                        <Box sx={{ mb: 3 }}>
                            <DotBridgeTypography variant="h2" sx={{
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                fontWeight: 700
                            }}>$149</DotBridgeTypography>
                            <DotBridgeTypography variant="body2" color="text.secondary">per month</DotBridgeTypography>
                        </Box>
                        <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            For scaling revenue teams
                        </DotBridgeTypography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, flexGrow: 1 }}>
                            {[
                                "Unlimited Bridges",
                                "1,000 AI minutes/month",
                                "Voice cloning",
                                "Advanced analytics",
                                "Priority support",
                                "CRM integrations",
                                "Custom branding",
                                "API access"
                            ].map(feature => (
                                <Box component="li" key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <DotBridgeIcon name="Check" size={18} color="primary.main" />
                                    <DotBridgeTypography variant="body2" component="span">{feature}</DotBridgeTypography>
                                </Box>
                            ))}
                        </Box>
                        <DotBridgeButton fullWidth variant="outlined" color="primary" component={Link} to="/signup?plan=premium">
                            Start Free Trial
                        </DotBridgeButton>
                    </DotBridgeCard>
                </Grid>
            </Grid>
            <Box textAlign="center" mt={6}>
                <MuiTypography variant="body2" color="text.secondary">
                    Need more? Contact us for enterprise pricing with custom limits and dedicated support.
                </MuiTypography>
            </Box>
        </Section>
    );
};

const FinalCTASection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Section sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            py: { xs: 6, sm: 8, md: 10 },
            px: { xs: 2, sm: 3, md: 4 }
        }}>
            {/* Background pattern - simplified for mobile */}
            {!isMobile && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />
            )}

            <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <DotBridgeTypography variant='h2' component="h2" sx={{
                        mb: { xs: 2, md: 3 },
                        color: 'inherit',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '2.5rem' },
                        lineHeight: { xs: 1.2, md: 1.1 },
                        textAlign: 'center'
                    }}>
                        The Future of Outbound is Here.
                    </DotBridgeTypography>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <DotBridgeTypography variant="h5" sx={{
                        mb: { xs: 4, md: 5 },
                        maxWidth: '600px',
                        mx: 'auto',
                        color: 'inherit',
                        opacity: 0.9,
                        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.25rem' },
                        px: { xs: 2, sm: 1, md: 0 },
                        textAlign: 'center'
                    }}>
                        Join the companies replacing manual outreach with intelligent Bridges.
                        Whether you're selling software or yourself, the old way is dead.
                    </DotBridgeTypography>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        gap: { xs: 2, sm: 2.5 },
                        px: { xs: 2, sm: 0 }
                    }}>
                        <DotBridgeButton
                            size="large"
                            variant="contained"
                            component={Link}
                            to="/services"
                            onClick={() => triggerHaptic('medium')}
                            endIcon={<DotBridgeIcon name="ArrowRight" size={20} />}
                            sx={{
                                bgcolor: 'white',
                                color: 'common.white',
                                px: { xs: 4, sm: 5 },
                                py: { xs: 2.25, sm: 2 },
                                fontSize: { xs: '1.125rem', sm: '1.125rem' },
                                fontWeight: 700,
                                width: { xs: '100%', sm: 'auto' },
                                minHeight: { xs: '60px', sm: 'auto' },
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                borderRadius: theme.shape.borderRadiusLarge,
                                border: '2px solid',
                                borderColor: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    bgcolor: 'grey.100',
                                    color: 'primary.dark',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                                    borderColor: 'grey.100',
                                    '&::before': {
                                        opacity: 1,
                                    }
                                },
                                '&:active': {
                                    transform: 'scale(0.98)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                    transition: 'all 0.6s ease',
                                    opacity: 0,
                                },
                                '&:hover::before': {
                                    left: '100%',
                                    opacity: 1,
                                }
                            }}
                        >
                            Explore B2B Solutions
                        </DotBridgeButton>
                        <DotBridgeButton
                            size="large"
                            variant="outlined"
                            component={Link}
                            to="/career-accelerator"
                            sx={{
                                color: 'common.white',
                                borderColor: 'common.white',
                                borderWidth: '2px',
                                px: { xs: 4, sm: 4 },
                                py: { xs: 1.75, sm: 1.5 },
                                fontSize: { xs: '1rem', sm: '1rem' },
                                fontWeight: 600,
                                width: { xs: '100%', sm: 'auto' },
                                minHeight: { xs: '56px', sm: 'auto' },
                                borderRadius: { xs: 2, sm: 1.5 },
                                boxShadow: '0 4px 16px rgba(255,255,255,0.1)',
                                '&:hover': {
                                    borderColor: 'common.white',
                                    bgcolor: 'common.white',
                                    color: 'primary.dark',
                                    transform: 'translateY(-2px)',
                                    borderWidth: '2px',
                                    boxShadow: '0 8px 24px rgba(255,255,255,0.2)'
                                },
                                '&:active': {
                                    transform: 'scale(0.98)'
                                }
                            }}
                            onClick={() => triggerHaptic('light')}
                        >
                            Career Solutions
                        </DotBridgeButton>
                    </Box>
                </motion.div>
            </Container>
        </Section>
    );
};

function DotBridgeLandingPage() {
    const theme = useTheme();
    const { scrollY } = useScroll();

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default }}>
            <HeroSection />

            {/* <WhyNowSection /> */}

            <WhatIsBridgeSection />

            {/* <Section variant="light">
                <DemoSection />
            </Section> */}

            <UseCasesSection />

            <ComparisonSection />

            <PersonalizedOutboundSection />

            {/* <Section variant="light">
                <FlowsSection />
            </Section> */}

            <HowItWorksSection />

            {/* <Section variant="light">
                <FAQSection />
            </Section> */}

            <FinalCTASection />

            <Footer />
        </Box>
    );
}

export default DotBridgeLandingPage;