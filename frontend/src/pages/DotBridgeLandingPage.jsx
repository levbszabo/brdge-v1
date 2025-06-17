import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery, Divider, Chip, Button, TextField, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeCard from '../components/DotBridgeCard';
import DotBridgeIcon from '../components/DotBridgeIcon';
import AgentConnector from '../components/AgentConnector';
import Footer from '../components/Footer';
import { api } from '../api';

// Use the same DEMO_BRIDGE_ID as landing page for consistency
const DEMO_BRIDGE_ID = '447';

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

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: prefersReducedMotion ? 0.01 : 0.6,
            ease: "easeOut"
        }
    }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: prefersReducedMotion ? 0.01 : 0.6,
            ease: "easeOut"
        }
    }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.1,
            delayChildren: prefersReducedMotion ? 0 : 0.2
        }
    }
};

// Hero Section with new messaging
const HeroSection = ({ lead, handleInputChange, handleLeadSubmit }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 300], [0, -50]);

    return (
        <Box sx={{
            minHeight: { xs: '100vh', md: '90vh' },
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            pt: { xs: 8, sm: 10, md: 12 },
            pb: { xs: 6, sm: 8, md: 10 },
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter}10 100%)`
        }}>
            {/* Enhanced animated background */}
            {!isMobile && (
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 opacity-5"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '10%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
                        filter: 'blur(100px)',
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                        filter: 'blur(120px)',
                    }} />

                    {/* Floating particles effect */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}60 0%, ${theme.palette.primary.light}40 100%)`,
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 3) * 20}%`,
                            }}
                            animate={{
                                y: [-20, 20, -20],
                                x: [-10, 10, -10],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 4 + i * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.8,
                            }}
                        />
                    ))}
                </motion.div>
            )}

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                >
                    {/* Main Headline */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h1"
                            component="h1"
                            align="center"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                                fontWeight: 800,
                                lineHeight: { xs: 1.1, md: 1.05 },
                                letterSpacing: '-0.03em',
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '100px',
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                    borderRadius: '2px',
                                    opacity: 0.7,
                                }
                            }}
                        >
                            Your Expertise,<br />
                            Productized with AI
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Subheadline */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 2,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                                lineHeight: 1.6,
                                fontWeight: 400,
                                position: 'relative',
                                zIndex: 2,
                            }}
                        >
                            We build intelligent systems that package your knowledge, qualify your prospects,
                            and deliver your services—automatically. No more trading time for money.
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Supporting Line */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="body1"
                            align="center"
                            sx={{
                                mb: 5,
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.125rem' },
                                fontWeight: 500,
                                fontStyle: 'italic',
                            }}
                        >
                            "The done-for-you system that transforms consultants into scalable businesses"
                        </DotBridgeTypography>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <DotBridgeButton
                                    variant="contained"
                                    size="large"
                                    component={Link}
                                    to="/ai-consulting"
                                    onClick={() => triggerHaptic('medium')}
                                    startIcon={<DotBridgeIcon name="Play" />}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        minWidth: { xs: '100%', sm: '220px' },
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                                        border: '2px solid transparent',
                                        position: 'relative',
                                        overflow: 'hidden',
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
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: `0 12px 40px ${theme.palette.primary.main}50`,
                                            '&::before': {
                                                left: '100%',
                                            }
                                        }
                                    }}
                                >
                                    See It In Action
                                </DotBridgeButton>
                            </motion.div>

                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <DotBridgeButton
                                    variant="outlined"
                                    size="large"
                                    onClick={() => {
                                        triggerHaptic('light');
                                        document.getElementById('investment-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        minWidth: { xs: '100%', sm: '220px' },
                                        borderWidth: 2,
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        background: 'transparent',
                                        backdropFilter: 'blur(10px)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '0%',
                                            height: '100%',
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            transition: 'width 0.3s ease',
                                            zIndex: -1,
                                        },
                                        '&:hover': {
                                            borderWidth: 2,
                                            borderColor: 'primary.main',
                                            color: 'white',
                                            transform: 'translateY(-1px)',
                                            boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                                            '&::before': {
                                                width: '100%',
                                            }
                                        }
                                    }}
                                >
                                    Get Your System Built
                                </DotBridgeButton>
                            </motion.div>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Problem Section
const ProblemSection = () => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const problems = [
        {
            icon: 'Clock',
            title: 'The Time Trap',
            description: 'Every new client means another discovery call, another proposal, another onboarding marathon. You\'re stuck in an endless loop.',
            color: 'error'
        },
        {
            icon: 'TrendingUp',
            title: 'The Scale Ceiling',
            description: 'Your income is capped by your calendar. Want to grow? You\'ll need to hire, manage, and watch your margins shrink.',
            color: 'warning'
        },
        {
            icon: 'RefreshCw',
            title: 'The Feast or Famine Cycle',
            description: 'When you\'re delivering, you can\'t sell. When you\'re selling, you can\'t deliver. The rollercoaster never ends.',
            color: 'info'
        }
    ];

    return (
        <Box
            ref={ref}
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.subtle',
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    {/* Section Title */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                            }}
                        >
                            You're Great at What You Do.
                            <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                                Selling It Shouldn't Be This Hard.
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Problem Cards */}
                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        {problems.map((problem, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    variants={fadeInUp}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <DotBridgeCard
                                        sx={{
                                            height: '100%',
                                            minHeight: { xs: '320px', md: '380px' },
                                            p: 4,
                                            textAlign: 'center',
                                            border: '2px solid',
                                            borderColor: 'transparent',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette[problem.color].lighter}05 100%)`,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: `linear-gradient(90deg, ${theme.palette[problem.color].main} 0%, ${theme.palette[problem.color].light} 100%)`,
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease'
                                            },
                                            '&:hover': {
                                                borderColor: `${problem.color}.main`,
                                                boxShadow: `0 12px 40px ${theme.palette[problem.color].main}20`,
                                                transform: 'translateY(-4px)',
                                            },
                                            '&:hover::before': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 2,
                                            bgcolor: `${problem.color}.lighter`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 3,
                                        }}>
                                            <DotBridgeIcon
                                                name={problem.icon}
                                                size={32}
                                                color={`${problem.color}.main`}
                                            />
                                        </Box>
                                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                            {problem.title}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {problem.description}
                                        </Typography>
                                    </DotBridgeCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Bridge Statement */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 600,
                                    fontStyle: 'italic',
                                    color: 'primary.main',
                                }}
                            >
                                There's a better way to package and sell your expertise.
                            </Typography>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Solution Section
const SolutionSection = () => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const solutions = [
        {
            number: '1',
            title: 'Instant Value Delivery',
            description: 'Your AI analyzes prospect needs and delivers personalized insights immediately',
            example: 'A marketing consultant\'s AI that audits websites in seconds',
            result: 'Prospects experience your expertise before they buy',
            icon: 'Zap',
            gradient: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
        },
        {
            number: '2',
            title: 'Intelligent Qualification',
            description: 'AI guides prospects through consultative conversations, not sales pitches',
            example: 'Co-creates custom strategies based on their specific situation',
            result: 'Only qualified, ready-to-buy clients reach you',
            icon: 'MessageSquare',
            gradient: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`
        },
        {
            number: '3',
            title: 'Automated Fulfillment',
            description: 'Collects requirements, processes payments, and starts delivery seamlessly',
            example: 'Books paid sessions without a single back-and-forth email',
            result: 'Focus on delivery while your system handles the rest',
            icon: 'Rocket',
            gradient: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`
        }
    ];

    return (
        <Box
            ref={ref}
            sx={{
                py: { xs: 8, md: 12 },
                position: 'relative',
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    {/* Section Header */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 2,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                            }}
                        >
                            Turn Your Knowledge Into Products
                            <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                                That Sell Themselves
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 8,
                                maxWidth: '700px',
                                mx: 'auto',
                            }}
                        >
                            Stop selling hours. Start selling systems. We build AI-powered funnels that transform how you deliver value.
                        </Typography>
                    </motion.div>

                    {/* Solution Steps */}
                    <Box sx={{ position: 'relative' }}>
                        {/* Connection Line - Desktop Only */}
                        {!useMediaQuery(theme.breakpoints.down('md')) && (
                            <Box sx={{
                                position: 'absolute',
                                top: '60px',
                                left: '20%',
                                right: '20%',
                                height: '2px',
                                bgcolor: 'divider',
                                zIndex: 0,
                            }} />
                        )}

                        <Grid container spacing={4}>
                            {solutions.map((solution, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div
                                        variants={fadeInUp}
                                        custom={index}
                                        whileHover={{ y: -8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Box sx={{ position: 'relative', height: '100%' }}>
                                            {/* Step Number */}
                                            <Box sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: solution.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                position: 'relative',
                                                zIndex: 1,
                                                boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                                            }}>
                                                <Typography
                                                    variant="h3"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {solution.number}
                                                </Typography>
                                            </Box>

                                            <DotBridgeCard sx={{
                                                p: 4,
                                                height: '100%',
                                                minHeight: { xs: '420px', md: '480px' },
                                                textAlign: 'center',
                                                border: '2px solid',
                                                borderColor: 'divider',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}03 100%)`,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '3px',
                                                    background: solution.gradient,
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                },
                                                '&:hover': {
                                                    borderColor: 'primary.light',
                                                    boxShadow: '0 16px 48px rgba(0, 102, 255, 0.15)',
                                                    transform: 'translateY(-6px)',
                                                },
                                                '&:hover::before': {
                                                    opacity: 1
                                                }
                                            }}>
                                                <DotBridgeIcon
                                                    name={solution.icon}
                                                    size={32}
                                                    color="primary.main"
                                                    sx={{ mb: 2 }}
                                                />

                                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                                    {solution.title}
                                                </Typography>

                                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                                    {solution.description}
                                                </Typography>

                                                <Box sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: 'primary.lighter',
                                                    mb: 2,
                                                }}>
                                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                        Example: {solution.example}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                    Result: {solution.result}
                                                </Typography>
                                            </DotBridgeCard>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

// Transformation Section
const TransformationSection = () => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const beforeAfter = [
        { before: 'Endless discovery calls', after: 'Prospects qualify themselves' },
        { before: 'Custom proposals for every prospect', after: 'Standardized packages that convert' },
        { before: 'Revenue tied to your availability', after: 'Revenue runs without you' },
        { before: 'Constantly context-switching', after: 'Focus on high-value work' },
        { before: 'Growth means more hours', after: 'Growth means more systems' },
    ];

    return (
        <Box
            ref={ref}
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.subtle',
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    {/* Section Title */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                            }}
                        >
                            The Shift From Service Provider
                            <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                                to System Owner
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Before/After Comparison */}
                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <Grid item xs={12} md={6}>
                            <motion.div variants={fadeInUp}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        border: '2px solid',
                                        borderColor: 'error.light',
                                        borderRadius: 3,
                                        bgcolor: 'error.lighter',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <DotBridgeIcon name="X" size={24} color="error.main" />
                                        <Typography variant="h5" sx={{ ml: 3, fontWeight: 600, color: 'error.dark' }}>
                                            Without DotBridge
                                        </Typography>
                                    </Box>
                                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                        {beforeAfter.map((item, index) => (
                                            <Box
                                                component="li"
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    mb: 2,
                                                }}
                                            >
                                                <DotBridgeIcon
                                                    name="AlertCircle"
                                                    size={20}
                                                    color="error.main"
                                                    sx={{ mt: 0.5, mr: 3, flexShrink: 0 }}
                                                />
                                                <Typography variant="body1">
                                                    {item.before}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <motion.div variants={fadeInUp}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        border: '2px solid',
                                        borderColor: 'success.light',
                                        borderRadius: 3,
                                        bgcolor: 'success.lighter',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <DotBridgeIcon name="CheckCircle" size={24} color="success.main" />
                                        <Typography variant="h5" sx={{ ml: 3, fontWeight: 600, color: 'success.dark' }}>
                                            With DotBridge
                                        </Typography>
                                    </Box>
                                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                        {beforeAfter.map((item, index) => (
                                            <Box
                                                component="li"
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    mb: 2,
                                                }}
                                            >
                                                <DotBridgeIcon
                                                    name="Check"
                                                    size={20}
                                                    color="success.main"
                                                    sx={{ mt: 0.5, mr: 3, flexShrink: 0 }}
                                                />
                                                <Typography variant="body1">
                                                    {item.after}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>

                    {/* Key Message */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 4,
                            borderRadius: 3,
                            bgcolor: 'primary.lighter',
                            border: '2px solid',
                            borderColor: 'primary.light',
                        }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: 'primary.dark',
                                }}
                            >
                                Own a business, not a job.
                            </Typography>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// How It Works Section
const HowItWorksSection = () => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    const [activeWeek, setActiveWeek] = useState(0);

    const weeks = [
        {
            week: 'Week 1',
            title: 'Blueprint Your Expertise',
            description: 'We map out your knowledge and design your productized offer',
            icon: 'Map',
            tasks: ['Expertise audit', 'Offer design', 'Pricing strategy'],
            gradient: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
        },
        {
            week: 'Week 2',
            title: 'Build Your AI System',
            description: 'Our team creates your custom analyzer, strategist, and delivery portal',
            icon: 'Code',
            tasks: ['AI training', 'Funnel creation', 'Integration setup'],
            gradient: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
        },
        {
            week: 'Week 3',
            title: 'Configure Your Funnel',
            description: 'Everything gets connected, tested, and optimized for conversion',
            icon: 'Settings',
            tasks: ['System testing', 'Optimization', 'Quality assurance'],
            gradient: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
        },
        {
            week: 'Week 4',
            title: 'Launch and Iterate',
            description: 'Your system goes live and starts generating qualified opportunities',
            icon: 'Rocket',
            tasks: ['Go live', 'Monitor results', 'Continuous improvement'],
            gradient: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
        },
    ];

    useEffect(() => {
        if (inView) {
            const interval = setInterval(() => {
                setActiveWeek((prev) => (prev + 1) % weeks.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [inView, weeks.length]);

    return (
        <Box
            ref={ref}
            sx={{
                py: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter}05 100%)`,
            }}
        >
            {/* Background decorative elements */}
            <Box sx={{
                position: 'absolute',
                top: '20%',
                left: '-5%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
                filter: 'blur(50px)',
                display: { xs: 'none', md: 'block' }
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '20%',
                right: '-5%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.light}08 0%, transparent 70%)`,
                filter: 'blur(60px)',
                display: { xs: 'none', md: 'block' }
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    {/* Section Title */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            From Concept to Cash Flow
                            <Box component="span" sx={{
                                display: 'block',
                                color: 'primary.main',
                                background: 'unset',
                                backgroundClip: 'unset',
                                WebkitBackgroundClip: 'unset',
                                WebkitTextFillColor: 'unset',
                            }}>
                                in 4 Weeks
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Timeline */}
                    <Grid container spacing={4}>
                        {/* Progress Bar */}
                        <Grid item xs={12}>
                            <Box sx={{ position: 'relative', mb: 6 }}>
                                <Box sx={{
                                    height: 6,
                                    bgcolor: 'divider',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    background: `linear-gradient(90deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[100]} 100%)`,
                                }}>
                                    <motion.div
                                        style={{
                                            height: '100%',
                                            width: `${((activeWeek + 1) / weeks.length) * 100}%`,
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                            borderRadius: '3px',
                                            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
                                        }}
                                    />
                                </Box>

                                {/* Week Markers */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: -10,
                                    left: 0,
                                    right: 0,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                    {weeks.map((week, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.1, duration: 0.4 }}
                                        >
                                            <Box
                                                onClick={() => setActiveWeek(index)}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    background: index <= activeWeek ? week.gradient : `linear-gradient(135deg, ${theme.palette.grey[300]} 0%, ${theme.palette.grey[400]} 100%)`,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    transform: index === activeWeek ? 'scale(1.4)' : 'scale(1)',
                                                    boxShadow: index === activeWeek ? `0 0 0 8px ${theme.palette.primary.main}15, 0 4px 12px ${theme.palette.primary.main}40` : 'none',
                                                    border: '2px solid white',
                                                    '&:hover': {
                                                        transform: 'scale(1.2)',
                                                    }
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Week Details */}
                        <Grid item xs={12} md={6}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeWeek}
                                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <DotBridgeCard sx={{
                                        p: 4,
                                        height: '100%',
                                        minHeight: '320px',
                                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}03 100%)`,
                                        border: '2px solid',
                                        borderColor: 'divider',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: weeks[activeWeek].gradient,
                                            opacity: 1,
                                        },
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 12px 40px rgba(0, 102, 255, 0.1)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <Box sx={{
                                                    width: 72,
                                                    height: 72,
                                                    borderRadius: 3,
                                                    background: weeks[activeWeek].gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 3,
                                                    boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                                                }}>
                                                    <DotBridgeIcon
                                                        name={weeks[activeWeek].icon}
                                                        size={36}
                                                        sx={{ color: 'white' }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                        {weeks[activeWeek].week}
                                                    </Typography>
                                                    <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                        {weeks[activeWeek].title}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}>
                                                {weeks[activeWeek].description}
                                            </Typography>
                                        </Box>

                                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                            {weeks[activeWeek].tasks.map((task, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                                >
                                                    <Box
                                                        component="li"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <DotBridgeIcon
                                                            name="CheckCircle"
                                                            size={20}
                                                            color="success.main"
                                                            sx={{ mr: 3, flexShrink: 0 }}
                                                        />
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {task}
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
                                            ))}
                                        </Box>
                                    </DotBridgeCard>
                                </motion.div>
                            </AnimatePresence>
                        </Grid>

                        {/* What You Get */}
                        <Grid item xs={12} md={6}>
                            <motion.div variants={fadeInUp}>
                                <DotBridgeCard sx={{
                                    p: 4,
                                    height: '100%',
                                    minHeight: '320px',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}20 100%)`,
                                    border: '2px solid',
                                    borderColor: 'primary.light',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                    },
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 16px 48px rgba(0, 102, 255, 0.15)',
                                        transform: 'translateY(-2px)',
                                    }
                                }}>
                                    <Box>
                                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.dark' }}>
                                            What You Get
                                        </Typography>

                                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                            {[
                                                'Complete AI-powered funnel',
                                                'Custom-trained on your expertise',
                                                'Ready to scale from day one',
                                                '90-day optimization support',
                                                'Full documentation & training',
                                            ].map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                                >
                                                    <Box
                                                        component="li"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'flex-start',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        <DotBridgeIcon
                                                            name="Check"
                                                            size={20}
                                                            color="primary.main"
                                                            sx={{ mt: 0.5, mr: 3, flexShrink: 0 }}
                                                        />
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {item}
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        mt: 4,
                                        p: 3,
                                        borderRadius: 2,
                                        bgcolor: 'background.paper',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.1)',
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                                            Total Time: 4 Weeks
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Your involvement: ~2 hours per week
                                        </Typography>
                                    </Box>
                                </DotBridgeCard>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

// Who This Is For Section
const WhoThisIsForSection = () => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const personas = [
        {
            icon: 'Users',
            title: 'Consultants & Strategists',
            description: 'Package your frameworks into intelligent systems that diagnose and prescribe solutions',
            examples: ['Business consultants', 'Marketing strategists', 'Operations experts'],
        },
        {
            icon: 'Heart',
            title: 'Coaches & Advisors',
            description: 'Transform your methodology into AI-guided experiences that deliver personalized insights',
            examples: ['Executive coaches', 'Career advisors', 'Life coaches'],
        },
        {
            icon: 'Briefcase',
            title: 'Agencies & Studios',
            description: 'Productize your services into repeatable offerings that clients can buy instantly',
            examples: ['Design agencies', 'Marketing firms', 'Development studios'],
        },
    ];

    return (
        <Box
            ref={ref}
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.subtle',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    {/* Section Title */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Built for Experts Ready to Scale
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Persona Cards */}
                    <Grid container spacing={4} sx={{ mb: 6, alignItems: 'stretch' }} justifyContent="center">
                        {personas.map((persona, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                                <motion.div
                                    variants={fadeInUp}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ width: '100%', display: 'flex' }}
                                >
                                    <DotBridgeCard sx={{
                                        p: 4,
                                        width: '100%',
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}04 100%)`,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        },
                                        '&:hover': {
                                            boxShadow: '0 16px 48px rgba(0, 102, 255, 0.12)',
                                            borderColor: 'primary.light',
                                        },
                                        '&:hover::before': {
                                            opacity: 1
                                        }
                                    }}>
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 3,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                                            }}>
                                                <DotBridgeIcon
                                                    name={persona.icon}
                                                    size={40}
                                                    sx={{ color: 'white' }}
                                                />
                                            </Box>

                                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, lineHeight: 1.3 }}>
                                                {persona.title}
                                            </Typography>

                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.5, px: 1, flex: 1 }}>
                                                {persona.description}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'background.subtle',
                                            mt: 'auto',
                                        }}>
                                            {persona.examples.map((example, idx) => (
                                                <Typography
                                                    key={idx}
                                                    variant="body2"
                                                    sx={{
                                                        mb: idx < persona.examples.length - 1 ? 1 : 0,
                                                        fontSize: '0.875rem',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    • {example}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </DotBridgeCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Qualifying Statement */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 4,
                            borderRadius: 3,
                            border: '2px dashed',
                            borderColor: 'primary.light',
                            background: `linear-gradient(135deg, ${theme.palette.primary.lighter}20 0%, ${theme.palette.primary.light}10 100%)`,
                            maxWidth: '800px',
                            mx: 'auto',
                        }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    lineHeight: 1.4,
                                }}
                            >
                                If you have proven expertise and want to scale beyond your time, we should talk.
                            </Typography>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Demo Section
const DemoSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Add scroll animation for demo tilt effect
    const demoRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: demoRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to rotation values - reduced for mobile
    const rotateX = useTransform(scrollYProgress, [0, 0.5], isMobile ? [8, 0] : [15, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0.98, 1] : [0.97, 1]);

    return (
        <Box
            id="demo-section"
            ref={ref}
            sx={{
                py: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.lighter}08 100%)`,
            }}
        >
            {/* Background decorative elements */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '-10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                filter: 'blur(60px)',
                display: { xs: 'none', md: 'block' }
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '-10%',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.light}10 0%, transparent 70%)`,
                filter: 'blur(80px)',
                display: { xs: 'none', md: 'block' }
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    {/* Section Title */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Experience the Difference
                        </DotBridgeTypography>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h6"
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 6,
                                maxWidth: '600px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                fontWeight: 400,
                            }}
                        >
                            See how AI can transform your expertise into a scalable system
                        </Typography>
                    </motion.div>

                    {/* Interactive Demo */}
                    <motion.div variants={fadeInUp}>
                        {isMobile ? (
                            // Mobile: Show attractive button that links to demo
                            <Box sx={{
                                maxWidth: '600px',
                                mx: 'auto',
                                p: { xs: 4, sm: 6 },
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}20 100%)`,
                                border: '2px solid',
                                borderColor: 'primary.light',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `radial-gradient(circle at 30% 30%, ${theme.palette.primary.main}20 0%, transparent 50%)`,
                                    pointerEvents: 'none'
                                }
                            }}>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <motion.div
                                        animate={{
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <DotBridgeIcon
                                            name="Play"
                                            size={80}
                                            sx={{
                                                mb: 3,
                                                color: 'white',
                                                p: 3,
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                boxShadow: `0 12px 40px ${theme.palette.primary.main}40`
                                            }}
                                        />
                                    </motion.div>
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
                                        Try Our AI Strategist
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.125rem' }}>
                                        Experience firsthand how our AI qualifies prospects and delivers personalized insights
                                    </Typography>
                                    <DotBridgeButton
                                        variant="contained"
                                        size="large"
                                        component={Link}
                                        to={`/viewBridge/${DEMO_BRIDGE_ID}`}
                                        startIcon={<DotBridgeIcon name="Sparkles" />}
                                        sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            px: 4,
                                            py: 2,
                                            fontSize: '1.125rem',
                                            fontWeight: 600,
                                            boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 12px 40px ${theme.palette.primary.main}50`,
                                            }
                                        }}
                                    >
                                        Start Conversation
                                    </DotBridgeButton>
                                </Box>
                            </Box>
                        ) : (
                            // Desktop: Show embedded AgentConnector with 3D effects
                            <motion.div
                                ref={demoRef}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                style={{
                                    perspective: '1500px',
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
                                    <Box sx={{
                                        maxWidth: '1200px',
                                        mx: 'auto',
                                        position: 'relative',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        boxShadow: '0 30px 80px rgba(0, 102, 255, 0.2)',
                                        border: '2px solid',
                                        borderColor: 'transparent',
                                        borderImage: `linear-gradient(135deg, ${theme.palette.primary.light}50, ${theme.palette.primary.main}50) 1`,
                                        bgcolor: 'background.paper',
                                        aspectRatio: '16 / 9',
                                        transform: 'translateZ(0)',
                                        backfaceVisibility: 'hidden',
                                        willChange: 'transform'
                                    }}>
                                        {/* Browser top bar */}
                                        <Box sx={{
                                            p: 1.5,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
                                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
                                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                                            </Box>
                                            <DotBridgeTypography variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: 'center', fontWeight: 500 }}>
                                                Live DotBridge Demo - AI Strategist
                                            </DotBridgeTypography>
                                        </Box>

                                        {/* AgentConnector Container */}
                                        <Box sx={{
                                            position: 'relative',
                                            height: 'calc(100% - 48px)',
                                            '& .agent-connector-container': {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                            }
                                        }}>
                                            <div className="agent-connector-container">
                                                <AgentConnector
                                                    brdgeId={DEMO_BRIDGE_ID}
                                                    agentType="view"
                                                    token=""
                                                    userId={null}
                                                    isEmbed={false}
                                                />
                                            </div>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Call to action below demo */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                                This is exactly what your prospects will experience
                            </Typography>
                            <DotBridgeButton
                                variant="outlined"
                                size="large"
                                component={Link}
                                to="/contact"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    '&:hover': {
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 8px 24px ${theme.palette.primary.main}30`,
                                    }
                                }}
                            >
                                Build Your Own System
                            </DotBridgeButton>
                        </Box>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Investment Section
const InvestmentSection = ({ lead, handleInputChange, handleLeadSubmit, submitted, isSubmitting, error }) => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <Box
            id="investment-section"
            ref={ref}
            sx={{
                py: { xs: 8, md: 12 },
                bgcolor: 'background.subtle',
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={staggerChildren}
                >
                    {/* Section Title */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 6,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                            }}
                        >
                            Your Productized Business, Built For You
                        </DotBridgeTypography>
                    </motion.div>

                    <Grid container spacing={4} alignItems="stretch">
                        {/* Pricing Card */}
                        <Grid item xs={12} md={6}>
                            <motion.div variants={fadeInUp}>
                                <DotBridgeCard sx={{
                                    p: { xs: 4, md: 6 },
                                    textAlign: 'center',
                                    border: '3px solid',
                                    borderColor: 'primary.main',
                                    position: 'relative',
                                    overflow: 'visible',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}>
                                    {/* Badge */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: -20,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        px: 3,
                                        py: 1,
                                        borderRadius: 20,
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                    }}>
                                        PILOT PROGRAM
                                    </Box>

                                    <Box>
                                        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
                                            DotBridge Pilot Program
                                        </Typography>

                                        <Typography variant="body1" sx={{ mb: 4, maxWidth: '400px', mx: 'auto' }}>
                                            We'll build your complete AI-powered system:
                                        </Typography>

                                        {/* Features */}
                                        <Box sx={{ mb: 4, textAlign: 'left', maxWidth: '350px', mx: 'auto' }}>
                                            {[
                                                'Custom AI analyzer for instant value delivery',
                                                'Intelligent strategist that qualifies and converts',
                                                'Automated fulfillment portal',
                                                'Full setup and configuration',
                                                '90-day optimization support',
                                            ].map((feature, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        mb: 2,
                                                    }}
                                                >
                                                    <DotBridgeIcon
                                                        name="CheckCircle"
                                                        size={20}
                                                        color="success.main"
                                                        sx={{ mr: 3, mt: 0.25, flexShrink: 0 }}
                                                    />
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        {/* Pilot Offer */}
                                        <Box sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                            color: 'white',
                                            mb: 3,
                                            textAlign: 'center',
                                            boxShadow: '0 8px 24px rgba(52, 199, 89, 0.3)',
                                        }}>
                                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                                                50% Off Pilot Pricing
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '1rem', fontWeight: 500 }}>
                                                Limited to first 10 qualified experts
                                            </Typography>
                                        </Box>

                                        {/* Why This Offer */}
                                        <Box sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: 'primary.lighter',
                                            mb: 4,
                                        }}>
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                                                We're selecting a small group of experts to perfect our process.
                                                In exchange for your feedback and case study, you get our complete
                                                system at 50% off our standard rate.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Note */}
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                        Note: Future platform access included when we launch self-serve
                                    </Typography>
                                </DotBridgeCard>
                            </motion.div>
                        </Grid>

                        {/* Lead Form */}
                        <Grid item xs={12} md={6}>
                            <motion.div variants={fadeInUp}>
                                <DotBridgeCard
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}10 100%)`,
                                        border: '2px solid',
                                        borderColor: 'primary.light',
                                        boxShadow: '0 8px 32px rgba(0, 102, 255, 0.1)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box sx={{ mb: 3 }}>
                                        <DotBridgeTypography
                                            variant="h4"
                                            align="center"
                                            sx={{
                                                mb: 2,
                                                fontSize: { xs: '1.5rem', md: '1.75rem' },
                                                fontWeight: 700,
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            Ready to Get Started?
                                        </DotBridgeTypography>

                                        <DotBridgeTypography
                                            variant="body1"
                                            align="center"
                                            sx={{
                                                color: 'text.secondary',
                                                fontSize: { xs: '0.9375rem', md: '1rem' },
                                                lineHeight: 1.5
                                            }}
                                        >
                                            Book a free strategy session to see how our system can transform your business
                                        </DotBridgeTypography>
                                    </Box>

                                    {submitted ? (
                                        <Box sx={{ textAlign: 'center', py: 3 }}>
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <DotBridgeIcon name="CheckCircle" size={48} color="success.main" sx={{ mb: 2 }} />
                                                <DotBridgeTypography variant="h5" sx={{ mb: 1, fontWeight: 600, fontSize: '1.25rem' }}>
                                                    Request Submitted!
                                                </DotBridgeTypography>
                                                <DotBridgeTypography variant="body1" color="text.secondary" sx={{ fontSize: '0.9375rem' }}>
                                                    We'll contact you shortly to schedule your personalized demo.
                                                </DotBridgeTypography>
                                            </motion.div>
                                        </Box>
                                    ) : (
                                        <form onSubmit={handleLeadSubmit}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        label="Full Name"
                                                        name="name"
                                                        value={lead.name}
                                                        onChange={handleInputChange}
                                                        required
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        label="Work Email"
                                                        name="email"
                                                        type="email"
                                                        value={lead.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        label="Phone Number (Optional)"
                                                        name="phone"
                                                        type="tel"
                                                        value={lead.phone}
                                                        onChange={handleInputChange}
                                                        placeholder="(555) 123-4567"
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormLabel component="legend" sx={{
                                                        mb: 1,
                                                        color: 'text.primary',
                                                        fontWeight: 500,
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        What's your biggest challenge?
                                                    </FormLabel>
                                                    <RadioGroup
                                                        name="hasExistingCourse"
                                                        value={lead.hasExistingCourse}
                                                        onChange={handleInputChange}
                                                        required
                                                        sx={{ gap: 0.5 }}
                                                    >
                                                        <FormControlLabel
                                                            value="lead-gen"
                                                            control={<Radio color="primary" size="small" />}
                                                            label="Not enough qualified prospects"
                                                            sx={{
                                                                '& .MuiFormControlLabel-label': {
                                                                    fontSize: '0.8125rem'
                                                                }
                                                            }}
                                                        />
                                                        <FormControlLabel
                                                            value="conversion"
                                                            control={<Radio color="primary" size="small" />}
                                                            label="Low meeting-to-close conversion"
                                                            sx={{
                                                                '& .MuiFormControlLabel-label': {
                                                                    fontSize: '0.8125rem'
                                                                }
                                                            }}
                                                        />
                                                        <FormControlLabel
                                                            value="scaling"
                                                            control={<Radio color="primary" size="small" />}
                                                            label="Can't scale current sales process"
                                                            sx={{
                                                                '& .MuiFormControlLabel-label': {
                                                                    fontSize: '0.8125rem'
                                                                }
                                                            }}
                                                        />
                                                        <FormControlLabel
                                                            value="attribution"
                                                            control={<Radio color="primary" size="small" />}
                                                            label="Poor sales tracking/visibility"
                                                            sx={{
                                                                '& .MuiFormControlLabel-label': {
                                                                    fontSize: '0.8125rem'
                                                                }
                                                            }}
                                                        />
                                                    </RadioGroup>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <DotBridgeButton
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        size="large"
                                                        fullWidth
                                                        disabled={isSubmitting}
                                                        sx={{
                                                            py: 1.5,
                                                            fontSize: '1rem',
                                                            fontWeight: 600,
                                                            borderRadius: 2,
                                                            bgcolor: 'primary.main',
                                                            color: 'white',
                                                            border: '2px solid',
                                                            borderColor: 'primary.main',
                                                            boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                            '&:hover': {
                                                                bgcolor: 'primary.dark',
                                                                borderColor: 'primary.dark',
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                            },
                                                            '&:disabled': {
                                                                bgcolor: 'grey.400',
                                                                borderColor: 'grey.400',
                                                                color: 'white',
                                                                transform: 'none',
                                                                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)'
                                                            }
                                                        }}
                                                    >
                                                        {isSubmitting ? (
                                                            <CircularProgress size={24} color="inherit" />
                                                        ) : (
                                                            'Apply for 50% Off →'
                                                        )}
                                                    </DotBridgeButton>
                                                </Grid>
                                                {error && (
                                                    <Grid item xs={12}>
                                                        <DotBridgeTypography
                                                            color="error"
                                                            variant="body2"
                                                            align="center"
                                                            sx={{
                                                                mt: 1,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            {error}
                                                        </DotBridgeTypography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </form>
                                    )}
                                </DotBridgeCard>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

// FAQ Section
const FAQSection = () => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const faqs = [
        {
            q: "How is this different from chatbots?",
            a: "Chatbots answer questions. Our AI system delivers actual work product, qualifies prospects, and facilitates transactions. It's a complete business system, not a support tool.",
            id: "panel1"
        },
        {
            q: "What if I don't have a productized offer yet?",
            a: "That's exactly why we start with strategy. We'll help you identify and package your most scalable, valuable expertise.",
            id: "panel2"
        },
        {
            q: "Can this work for my industry?",
            a: "If you sell expertise or knowledge-based services, yes. We've built systems for consultants, coaches, agencies, and professional services.",
            id: "panel3"
        },
        {
            q: "How long until I see results?",
            a: "Most clients have their first qualified conversations within days of launch. The system improves with every interaction.",
            id: "panel4"
        },
        {
            q: "What's included in the 90-day support?",
            a: "We monitor performance, optimize conversion points, refine AI responses, and ensure your system is performing at its best. Plus, you get direct access to our team for questions.",
            id: "panel5"
        },
        {
            q: "Can I modify the system after it's built?",
            a: "Yes, you'll have access to update content, adjust pricing, and refine your offers. We also provide training on how to manage your system.",
            id: "panel6"
        },
    ];

    return (
        <Box sx={{ py: { xs: 8, md: 12 } }}>
            <Container maxWidth="md">
                <DotBridgeTypography
                    variant="h2"
                    align="center"
                    sx={{
                        mb: 6,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        fontWeight: 700,
                    }}
                >
                    Common Questions
                </DotBridgeTypography>

                {faqs.map((faq) => (
                    <Accordion
                        key={faq.id}
                        expanded={expanded === faq.id}
                        onChange={handleChange(faq.id)}
                        sx={{
                            mb: 2,
                            boxShadow: 'none',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': {
                                borderColor: 'primary.main',
                            }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<DotBridgeIcon name={expanded === faq.id ? "Minus" : "Plus"} size={20} />}
                            sx={{
                                py: 2,
                                '& .MuiAccordionSummary-content': {
                                    my: 0,
                                }
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {faq.q}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                                {faq.a}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        </Box>
    );
};

// Final CTA Section
const FinalCTASection = () => {
    const theme = useTheme();

    return (
        <Box sx={{
            py: { xs: 8, md: 12 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background Pattern */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
                pointerEvents: 'none',
            }} />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerChildren}
                >
                    {/* Headline */}
                    <motion.div variants={fadeInUp}>
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 3,
                                color: 'inherit',
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                fontWeight: 700,
                            }}
                        >
                            Stop Selling Your Time.
                            <Box component="span" sx={{ display: 'block' }}>
                                Start Scaling Your Expertise.
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>

                    {/* Subheadline */}
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                mb: 6,
                                maxWidth: '600px',
                                mx: 'auto',
                                opacity: 0.9,
                            }}
                        >
                            The tools exist. The opportunity is here. The only question is whether
                            you'll build the business you've always wanted, or keep trading hours for dollars.
                        </Typography>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div variants={fadeInUp}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <DotBridgeButton
                                variant="contained"
                                size="large"
                                component={Link}
                                to="/apply"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    minWidth: { xs: '100%', sm: '200px' },
                                    '&:hover': {
                                        bgcolor: 'grey.100',
                                        transform: 'translateY(-2px)',
                                    }
                                }}
                            >
                                I'm Ready to Build
                            </DotBridgeButton>
                            <DotBridgeButton
                                variant="outlined"
                                size="large"
                                component={Link}
                                to="/schedule"
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    minWidth: { xs: '100%', sm: '200px' },
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderWidth: 2,
                                    }
                                }}
                            >
                                I Need More Details
                            </DotBridgeButton>
                        </Box>
                    </motion.div>

                    {/* Closing Line */}
                    <motion.div variants={fadeInUp}>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{
                                mt: 6,
                                opacity: 0.8,
                                fontStyle: 'italic',
                            }}
                        >
                            The future of expert businesses is productized, automated, and scalable. Let's build yours.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
};

// Main Component
function DotBridgeLandingPage() {
    // Lead form state
    const [lead, setLead] = useState({
        name: '',
        email: '',
        phone: '',
        hasExistingCourse: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLead(prev => ({ ...prev, [name]: value }));
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.post('/services/leads', {
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                hasExistingCourse: lead.hasExistingCourse,
            });

            if (response.data.success) {
                setSubmitted(true);
                setLead({ name: '', email: '', phone: '', hasExistingCourse: '' });
            } else {
                throw new Error(response.data.error || 'Failed to submit form');
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
            setError(error.response?.data?.error || 'Failed to submit form. Please try again.');
            setSubmitted(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <HeroSection lead={lead} handleInputChange={handleInputChange} handleLeadSubmit={handleLeadSubmit} />
            <ProblemSection />
            <SolutionSection />
            <TransformationSection />
            <HowItWorksSection />
            <WhoThisIsForSection />
            <DemoSection />
            <InvestmentSection
                lead={lead}
                handleInputChange={handleInputChange}
                handleLeadSubmit={handleLeadSubmit}
                submitted={submitted}
                isSubmitting={isSubmitting}
                error={error}
            />
            <FAQSection />
            <Footer />
        </Box>
    );
}

export default DotBridgeLandingPage;