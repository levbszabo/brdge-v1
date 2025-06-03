import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Grid,
    Box,
    useTheme,
    useMediaQuery,
    Paper,
    TextField,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    CircularProgress,
    Chip,
    Divider,
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    CheckCircle,
    TrendingUp,
    Groups,
    QueryStats,
    Bolt as Zap,
    People as Users,
    CalendarMonth as Calendar,
    AccessTime as Clock,
    Visibility as Eye,
    AutoAwesome as Sparkles,
    ArrowForward as ArrowRight,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AgentConnector from '../components/AgentConnector';
import { api } from '../api';
import Footer from '../components/Footer';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeCard, { CardContent } from '../components/DotBridgeCard';
import DotBridgeTypography from '../components/DotBridgeTypography';

// Use the same DEMO_BRIDGE_ID as landing page for consistency
const DEMO_BRIDGE_ID = '447';

// Performance optimization: Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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



// Impact metrics with updated copy
const impactMetrics = [
    {
        metric: "3x",
        description: "Qualified Pipeline",
        subtitle: "in first 90 days",
        icon: <TrendingUp sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "-60%",
        description: "Cost Per Lead",
        subtitle: "with targeted outreach",
        icon: <QueryStats sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "24/7",
        description: "Revenue Engine",
        subtitle: "works while you sleep",
        icon: <Zap sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "85%",
        description: "Time Savings",
        subtitle: "on manual outreach",
        icon: <Clock sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    }
];

const ServicesPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Add scroll animation hook for demo tilt effect
    const demoRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: demoRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to rotation values - reduced for mobile
    const rotateX = useTransform(scrollYProgress, [0, 0.5], isMobile ? [12, 0] : [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], isMobile ? [0.98, 1] : [0.97, 1]);

    // Simplified inView refs
    const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [stepsRef, stepsInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [resultsRef, resultsInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });

    // Lead form state
    const [lead, setLead] = useState({
        name: '',
        email: '',
        phone: '',
        hasExistingCourse: '',
        courseTopic: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showFloatingCTA, setShowFloatingCTA] = useState(false);

    // Track scroll position for floating CTA
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const threshold = window.innerHeight * 1.5; // Show after 1.5 screen heights
            setShowFloatingCTA(scrolled > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                courseTopic: lead.courseTopic
            });

            if (response.data.success) {
                setSubmitted(true);
                setLead({ name: '', email: '', phone: '', hasExistingCourse: '', courseTopic: '' });
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
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                bgcolor: 'background.default',
                overflow: 'hidden'
            }}
        >
            {/* Hero Section */}
            <Container maxWidth="xl" ref={heroRef} sx={{
                position: 'relative',
                zIndex: 1,
                pt: { xs: 3, sm: 4, md: 10 },
                pb: { xs: 2, sm: 3, md: 4 },
                px: { xs: 1.5, sm: 2, md: 3 }
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center' }}
                >
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                        <Chip
                            label="🎯 PIPELINE-AS-A-SERVICE"
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}50 100%)`,
                                color: theme.palette.primary.dark,
                                fontWeight: 600,
                                fontSize: { xs: '0.675rem', sm: '0.75rem', md: '0.875rem' },
                                letterSpacing: '0.05em',
                                px: { xs: 1.5, sm: 2 },
                                py: { xs: 0.4, sm: 0.5 },
                                border: '1px solid',
                                borderColor: theme.palette.primary.light,
                                boxShadow: '0 2px 8px rgba(0, 102, 255, 0.2)',
                                mb: { xs: 1.5, sm: 2 },
                                height: { xs: 24, sm: 32 }
                            }}
                        />
                    </Box>

                    <DotBridgeTypography
                        variant="h1"
                        component="h1"
                        sx={{
                            mb: { xs: 2, sm: 3, md: 4 },
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '4rem' },
                            fontWeight: 800,
                            lineHeight: { xs: 1.2, sm: 1.15, md: 1.05 },
                            textAlign: 'center',
                            letterSpacing: { xs: '-0.01em', sm: '-0.02em', md: '-0.03em' },
                            px: { xs: 1, sm: 2, md: 0 }
                        }}
                    >
                        <Box component="span" sx={{
                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'block',
                            mb: { xs: 0.25, sm: 0.5, md: 0.25 }
                        }}>
                            Install a GTM Engine That
                        </Box>
                        <Box component="span" sx={{
                            display: 'block',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mt: { xs: 0.15, sm: 0.25, md: 0.15 }
                        }}>
                            Books Sales Calls While You Sleep
                        </Box>
                    </DotBridgeTypography>

                    <DotBridgeTypography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '900px',
                            mx: 'auto',
                            mb: { xs: 4, sm: 4, md: 6 },
                            lineHeight: { xs: 1.6, sm: 1.5, md: 1.6 },
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.5rem' },
                            px: { xs: 1, sm: 2, md: 0 },
                            textAlign: 'center',
                            fontWeight: 400,
                            opacity: { xs: 0.95, sm: 0.85 }
                        }}
                    >
                        We combine
                        <Box component="span" sx={{
                            fontWeight: 600,
                            color: 'primary.main',
                            whiteSpace: { xs: 'normal', sm: 'nowrap' },
                            display: { xs: 'block', sm: 'inline' },
                            my: { xs: 1, sm: 0 }
                        }}> AI-powered demos, scraping, and outreach</Box>
                        <Box component="span" sx={{
                            display: { xs: 'block', sm: 'inline' },
                            my: { xs: 1, sm: 0 }
                        }}> to deliver qualified pipeline</Box>
                        <Box component="span" sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            display: { xs: 'block', sm: 'inline' },
                            mt: { xs: 1, sm: 0 }
                        }}> without hiring more SDRs.</Box>
                        <Box component="span" sx={{
                            display: 'block',
                            mt: { xs: 3, sm: 2, md: 1 },
                            mb: { xs: 1, sm: 0 },
                            fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.35rem' },
                            color: 'text.secondary',
                            fontStyle: 'normal',
                            lineHeight: { xs: 1.6, sm: 1.5 },
                            px: { xs: 1, md: 0 },
                            opacity: { xs: 0.9, sm: 0.85 }
                        }}>
                            Your first GTM hire that never sleeps, never quits, and scales infinitely.
                        </Box>
                    </DotBridgeTypography>

                    {/* Demo Section - Clean styling with proper mobile aspect ratio and 3D tilt */}
                    <Box sx={{ mb: { xs: 6, sm: 8, md: 10 }, mt: { xs: 2, sm: 0 } }}>
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
                                <Box sx={{
                                    maxWidth: { xs: '100%', sm: '700px', md: '1300px' },
                                    mx: { xs: 0.5, sm: 'auto' },
                                    position: 'relative',
                                    borderRadius: { xs: 1.5, sm: 2, md: 3 },
                                    overflow: 'hidden',
                                    boxShadow: {
                                        xs: '0 4px 16px rgba(0, 102, 255, 0.1)',
                                        sm: '0 8px 24px rgba(0, 102, 255, 0.1)',
                                        md: '0 30px 80px rgba(0, 102, 255, 0.15)'
                                    },
                                    border: { xs: '1px solid', sm: '2px solid' },
                                    borderColor: { xs: 'divider', sm: 'transparent' },
                                    borderImage: { xs: 'none', sm: `linear-gradient(135deg, ${theme.palette.primary.light}50, ${theme.palette.primary.main}50) 1` },
                                    bgcolor: 'background.paper',
                                    aspectRatio: '16 / 9',
                                    transform: 'translateZ(0)',
                                    backfaceVisibility: 'hidden',
                                    willChange: 'transform'
                                }}>
                                    {/* Top bar - only show on desktop */}
                                    <Box sx={{
                                        p: 1,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                                        display: { xs: 'none', sm: 'flex' },
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main' }} />
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'warning.main' }} />
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main' }} />
                                        </Box>
                                        <DotBridgeTypography variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: 'center' }}>
                                            Live DotBridge Sales Demo
                                        </DotBridgeTypography>
                                    </Box>
                                    <Box sx={{
                                        position: 'relative',
                                        height: { xs: '100%', sm: 'calc(100% - 40px)' },
                                        '& .agent-connector-container': {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                        }
                                    }}>
                                        {isMobile ? (
                                            // Show video on mobile/Safari with proper 16:9 aspect ratio
                                            <video
                                                src="/dotbridge-services-vsl-final.mp4"
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
                                    </Box>
                                </Box>
                            </motion.div>
                        </motion.div>
                    </Box>

                    {/* How It Works Section - NEW */}
                    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <DotBridgeTypography
                                variant="h2"
                                align="center"
                                sx={{
                                    mb: 2,
                                    fontSize: { xs: '1.875rem', sm: '2.5rem', md: '2.75rem' },
                                    fontWeight: 700,
                                    lineHeight: { xs: 1.2, md: 1.1 },
                                    px: { xs: 2, md: 0 }
                                }}
                            >
                                Your GTM Engine
                                <Box component="span" sx={{
                                    color: 'primary.main',
                                    display: { xs: 'block', sm: 'inline' }
                                }}> in 5 Simple Steps</Box>
                            </DotBridgeTypography>

                            <DotBridgeTypography
                                variant="h5"
                                align="center"
                                sx={{
                                    color: 'text.secondary',
                                    maxWidth: '700px',
                                    mx: 'auto',
                                    mb: { xs: 6, md: 8 },
                                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                    px: { xs: 2, md: 0 }
                                }}
                            >
                                From first touch to booked meeting - completely automated and personalized at scale
                            </DotBridgeTypography>

                            {/* Process Flow Diagram */}
                            <Box sx={{ position: 'relative', maxWidth: '1000px', mx: 'auto' }}>
                                <Grid container spacing={{ xs: 2, md: 0 }} sx={{ position: 'relative' }}>
                                    {[
                                        {
                                            number: "1",
                                            title: "Scrape Ideal Leads",
                                            description: "AI identifies and enriches your perfect prospects",
                                            icon: <QueryStats sx={{ fontSize: 40 }} />,
                                            color: '#007AFF'
                                        },
                                        {
                                            number: "2",
                                            title: "Create Interactive Bridge",
                                            description: "Personalized demos that adapt to each viewer",
                                            icon: <Eye sx={{ fontSize: 40 }} />,
                                            color: '#5856D6'
                                        },
                                        {
                                            number: "3",
                                            title: "Launch Multi-Channel Campaign",
                                            description: "Coordinated email + LinkedIn outreach",
                                            icon: <Groups sx={{ fontSize: 40 }} />,
                                            color: '#AF52DE'
                                        },
                                        {
                                            number: "4",
                                            title: "Bridge Responds & Qualifies",
                                            description: "AI handles objections and captures intent",
                                            icon: <Sparkles sx={{ fontSize: 40 }} />,
                                            color: '#FF3B30'
                                        },
                                        {
                                            number: "5",
                                            title: "Book Meeting → CRM/Slack",
                                            description: "Qualified leads routed directly to your team",
                                            icon: <Calendar sx={{ fontSize: 40 }} />,
                                            color: '#34C759'
                                        }
                                    ].map((step, index) => (
                                        <Grid item xs={12} md={2.4} key={index}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                            >
                                                <Box sx={{
                                                    textAlign: 'center',
                                                    position: 'relative',
                                                    px: { xs: 2, md: 1 }
                                                }}>
                                                    {/* Step Number */}
                                                    <Box sx={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, ${step.color}20 0%, ${step.color}10 100%)`,
                                                        border: `3px solid ${step.color}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 2,
                                                        position: 'relative',
                                                        boxShadow: `0 8px 24px ${step.color}30`
                                                    }}>
                                                        <Box sx={{ color: step.color }}>
                                                            {step.icon}
                                                        </Box>
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: -10,
                                                            right: -10,
                                                            width: 30,
                                                            height: 30,
                                                            borderRadius: '50%',
                                                            bgcolor: step.color,
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            fontSize: '1rem'
                                                        }}>
                                                            {step.number}
                                                        </Box>
                                                    </Box>

                                                    <DotBridgeTypography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            mb: 1,
                                                            fontSize: { xs: '1rem', md: '1.125rem' }
                                                        }}
                                                    >
                                                        {step.title}
                                                    </DotBridgeTypography>

                                                    <DotBridgeTypography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                            lineHeight: 1.5
                                                        }}
                                                    >
                                                        {step.description}
                                                    </DotBridgeTypography>
                                                </Box>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Mobile arrow indicators */}
                                <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mt: 2 }}>
                                    <ArrowRight sx={{ fontSize: 30, color: 'primary.main', transform: 'rotate(90deg)' }} />
                                </Box>
                            </Box>

                            {/* CTA after How It Works */}
                            <Box sx={{ textAlign: 'center', mt: 6 }}>
                                <DotBridgeButton
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => {
                                        document.getElementById('lead-form-section')?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                        }
                                    }}
                                >
                                    Ready to Build Your GTM Engine? →
                                </DotBridgeButton>
                            </Box>
                        </motion.div>
                    </Container>

                    {/* Package Breakdown Section - NEW */}
                    <Box sx={{
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                        py: { xs: 8, md: 12 },
                        borderTop: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <DotBridgeTypography
                                    variant="h2"
                                    align="center"
                                    sx={{
                                        mb: 2,
                                        fontSize: { xs: '1.875rem', sm: '2.5rem', md: '2.75rem' },
                                        fontWeight: 700,
                                        lineHeight: { xs: 1.2, md: 1.1 },
                                        px: { xs: 1, md: 0 }
                                    }}
                                >
                                    Choose Your
                                    <Box component="span" sx={{
                                        color: 'primary.main',
                                        display: { xs: 'block', sm: 'inline' }
                                    }}> Revenue Growth Package</Box>
                                </DotBridgeTypography>

                                <DotBridgeTypography
                                    variant="h5"
                                    align="center"
                                    sx={{
                                        color: 'text.secondary',
                                        maxWidth: '700px',
                                        mx: 'auto',
                                        mb: { xs: 6, md: 8 },
                                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                        px: { xs: 1, md: 0 }
                                    }}
                                >
                                    From getting started to scaling infinitely - we have the right solution for your growth stage
                                </DotBridgeTypography>

                                <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ mb: 8, overflow: 'visible', px: { xs: 0, md: 2 } }}>
                                    {[
                                        {
                                            tier: "Starter",
                                            price: "$5K",
                                            subtitle: "one-time setup",
                                            description: "Perfect for testing the waters",
                                            mainValue: "Get 500+ qualified leads delivered with automated outreach",
                                            includes: {
                                                leads: "500+",
                                                bridges: "1",
                                                channels: "Email only",
                                                routing: "Basic",
                                                creative: false,
                                                launch: "2 weeks",
                                                support: "Email"
                                            },
                                            highlights: [
                                                "Scraped & enriched B2B leads",
                                                "1 personalized interactive demo",
                                                "5-touch email sequence",
                                                "Basic CRM integration"
                                            ],
                                            color: 'grey',
                                            popular: false
                                        },
                                        {
                                            tier: "Pro",
                                            price: "$10K-$15K",
                                            subtitle: "one-time setup",
                                            description: "For serious pipeline builders",
                                            mainValue: "2,000+ leads with multi-channel outreach and A/B testing",
                                            includes: {
                                                leads: "2,000+",
                                                bridges: "2-3",
                                                channels: "Email + LinkedIn",
                                                routing: "Advanced",
                                                creative: "Optional",
                                                launch: "10 days",
                                                support: "Priority"
                                            },
                                            highlights: [
                                                "2,000+ enriched prospects",
                                                "2-3 segment-specific demos",
                                                "LinkedIn + email automation",
                                                "Advanced lead scoring",
                                                "A/B testing framework"
                                            ],
                                            color: 'primary',
                                            popular: true
                                        },
                                        {
                                            tier: "Growth",
                                            price: "$3K",
                                            subtitle: "per month",
                                            description: "Continuous pipeline optimization",
                                            mainValue: "Never-ending pipeline with monthly campaign refresh",
                                            includes: {
                                                leads: "2,000+/mo",
                                                bridges: "Ongoing",
                                                channels: "Email + LinkedIn",
                                                routing: "Custom",
                                                creative: true,
                                                launch: "Ongoing",
                                                support: "Dedicated Manager"
                                            },
                                            highlights: [
                                                "2,000+ new leads monthly",
                                                "Weekly optimization calls",
                                                "AI-generated ad creative",
                                                "Custom integrations",
                                                "Dedicated success manager"
                                            ],
                                            color: 'success',
                                            popular: false
                                        }
                                    ].map((pkg, index) => (
                                        <Grid item xs={12} md={4} key={index} sx={{
                                            position: 'relative',
                                            overflow: 'visible',
                                            ...(pkg.popular && { zIndex: 50 })
                                        }}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                                style={{ height: '100%', overflow: 'visible' }}
                                            >
                                                <DotBridgeCard
                                                    sx={{
                                                        p: { xs: 2.5, md: 3.5 },
                                                        pt: { xs: 5, md: 6 },
                                                        height: '100%',
                                                        minHeight: { xs: 'auto', md: '720px' },
                                                        position: 'relative',
                                                        border: pkg.popular ? '2px solid' : '1px solid',
                                                        borderColor: pkg.popular ? 'primary.main' : 'divider',
                                                        background: pkg.popular
                                                            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}10 100%)`
                                                            : 'background.paper',
                                                        boxShadow: pkg.popular
                                                            ? '0 20px 60px rgba(0, 102, 255, 0.15)'
                                                            : '0 8px 24px rgba(0, 0, 0, 0.05)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        transition: 'all 0.3s ease',
                                                        overflow: 'visible',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: pkg.popular
                                                                ? '0 24px 70px rgba(0, 102, 255, 0.2)'
                                                                : '0 12px 32px rgba(0, 0, 0, 0.08)'
                                                        },
                                                        ...(pkg.popular && { zIndex: 50 })
                                                    }}
                                                >
                                                    {pkg.popular && (
                                                        <Chip
                                                            label="MOST POPULAR"
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: { xs: -10, md: -12 },
                                                                left: '50%',
                                                                transform: 'translateX(-50%)',
                                                                bgcolor: 'primary.main',
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                                letterSpacing: '0.05em',
                                                                px: { xs: 1.5, md: 2 },
                                                                py: { xs: 0.25, md: 0.5 },
                                                                boxShadow: '0 4px 12px rgba(0, 102, 255, 0.3)',
                                                                zIndex: 100,
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        />
                                                    )}

                                                    {/* Header Section */}
                                                    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
                                                        <DotBridgeTypography
                                                            variant="h4"
                                                            sx={{
                                                                fontWeight: 700,
                                                                mb: 1,
                                                                color: pkg.popular ? 'primary.main' : 'text.primary',
                                                                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                                                            }}
                                                        >
                                                            {pkg.tier}
                                                        </DotBridgeTypography>

                                                        <Box sx={{ mb: 2 }}>
                                                            <DotBridgeTypography
                                                                variant="h2"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    color: 'text.primary',
                                                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                                    lineHeight: 1
                                                                }}
                                                            >
                                                                {pkg.price}
                                                            </DotBridgeTypography>
                                                            <DotBridgeTypography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    mt: 0.5,
                                                                    fontSize: { xs: '0.875rem', md: '1rem' }
                                                                }}
                                                            >
                                                                {pkg.subtitle}
                                                            </DotBridgeTypography>
                                                        </Box>

                                                        <DotBridgeTypography
                                                            variant="body1"
                                                            sx={{
                                                                color: 'text.secondary',
                                                                fontStyle: 'italic',
                                                                mb: 2,
                                                                fontSize: { xs: '0.9375rem', md: '1rem' },
                                                                px: { xs: 0.5, md: 0 }
                                                            }}
                                                        >
                                                            {pkg.description}
                                                        </DotBridgeTypography>

                                                        {/* Main Value Proposition */}
                                                        <Box sx={{
                                                            p: { xs: 1.5, md: 2 },
                                                            borderRadius: 2,
                                                            bgcolor: pkg.popular ? 'primary.lighter' : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                                                            border: '1px solid',
                                                            borderColor: pkg.popular ? 'primary.light' : 'divider'
                                                        }}>
                                                            <DotBridgeTypography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: pkg.popular ? 'primary.dark' : 'text.primary',
                                                                    lineHeight: 1.6,
                                                                    fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                                    textAlign: 'center'
                                                                }}
                                                            >
                                                                {pkg.mainValue}
                                                            </DotBridgeTypography>
                                                        </Box>
                                                    </Box>

                                                    {/* Key Metrics Grid */}
                                                    <Box sx={{ mb: { xs: 2, md: 3 } }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <Box sx={{
                                                                    textAlign: 'center',
                                                                    p: { xs: 1.5, md: 2 },
                                                                    borderRadius: 2,
                                                                    bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                                                                    height: '100%'
                                                                }}>
                                                                    <DotBridgeTypography
                                                                        variant="h4"
                                                                        sx={{
                                                                            fontWeight: 700,
                                                                            color: pkg.popular ? 'primary.main' : 'text.primary',
                                                                            mb: 0.5,
                                                                            fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1.5rem' },
                                                                            lineHeight: 1.1
                                                                        }}
                                                                    >
                                                                        {pkg.includes.leads}
                                                                    </DotBridgeTypography>
                                                                    <DotBridgeTypography
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: 'text.secondary',
                                                                            display: 'block',
                                                                            fontSize: { xs: '0.7rem', md: '0.8125rem' }
                                                                        }}
                                                                    >
                                                                        Scraped Leads
                                                                    </DotBridgeTypography>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={6}>
                                                                <Box sx={{
                                                                    textAlign: 'center',
                                                                    p: { xs: 1.5, md: 2 },
                                                                    borderRadius: 2,
                                                                    bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                                                                    height: '100%'
                                                                }}>
                                                                    <DotBridgeTypography
                                                                        variant="h4"
                                                                        sx={{
                                                                            fontWeight: 700,
                                                                            color: pkg.popular ? 'primary.main' : 'text.primary',
                                                                            mb: 0.5,
                                                                            fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1.5rem' },
                                                                            lineHeight: 1.1
                                                                        }}
                                                                    >
                                                                        {pkg.includes.bridges}
                                                                    </DotBridgeTypography>
                                                                    <DotBridgeTypography
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: 'text.secondary',
                                                                            display: 'block',
                                                                            fontSize: { xs: '0.7rem', md: '0.8125rem' }
                                                                        }}
                                                                    >
                                                                        Interactive Bridges
                                                                    </DotBridgeTypography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>

                                                    {/* Key Features List */}
                                                    <Box sx={{ mb: { xs: 2, md: 3 }, flex: 1 }}>
                                                        <DotBridgeTypography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                mb: { xs: 1.5, md: 2 },
                                                                color: 'text.primary',
                                                                textTransform: 'uppercase',
                                                                fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                                letterSpacing: '0.1em',
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            What's Included:
                                                        </DotBridgeTypography>

                                                        {pkg.highlights.map((feature, idx) => (
                                                            <Box key={idx} sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                mb: { xs: 1, md: 1.5 },
                                                                textAlign: 'left'
                                                            }}>
                                                                <CheckCircle sx={{
                                                                    fontSize: { xs: 16, md: 18 },
                                                                    color: pkg.popular ? 'primary.main' : 'success.main',
                                                                    mr: { xs: 1, md: 1.5 },
                                                                    mt: 0.125,
                                                                    flexShrink: 0
                                                                }} />
                                                                <DotBridgeTypography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontSize: { xs: '0.8125rem', md: '0.9375rem' },
                                                                        lineHeight: 1.5,
                                                                        color: 'text.secondary',
                                                                        textAlign: 'left',
                                                                        flex: 1
                                                                    }}
                                                                >
                                                                    {feature}
                                                                </DotBridgeTypography>
                                                            </Box>
                                                        ))}
                                                    </Box>

                                                    <Divider sx={{ mb: { xs: 2, md: 3 } }} />

                                                    {/* Additional Details */}
                                                    <Box sx={{ mb: { xs: 3, md: 4 } }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <Box sx={{ textAlign: 'left' }}>
                                                                    <DotBridgeTypography variant="caption" sx={{
                                                                        color: 'text.secondary',
                                                                        display: 'block',
                                                                        mb: 0.5,
                                                                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                                        fontWeight: 500,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.05em'
                                                                    }}>
                                                                        Outreach Channels
                                                                    </DotBridgeTypography>
                                                                    <DotBridgeTypography variant="body2" sx={{
                                                                        fontWeight: 600,
                                                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                                                        lineHeight: 1.4,
                                                                        color: 'text.primary'
                                                                    }}>
                                                                        {pkg.includes.channels}
                                                                    </DotBridgeTypography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Box sx={{ textAlign: 'left' }}>
                                                                    <DotBridgeTypography variant="caption" sx={{
                                                                        color: 'text.secondary',
                                                                        display: 'block',
                                                                        mb: 0.5,
                                                                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                                        fontWeight: 500,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.05em'
                                                                    }}>
                                                                        Launch Time
                                                                    </DotBridgeTypography>
                                                                    <DotBridgeTypography variant="body2" sx={{
                                                                        fontWeight: 600,
                                                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                                                        lineHeight: 1.4,
                                                                        color: 'text.primary'
                                                                    }}>
                                                                        {pkg.includes.launch}
                                                                    </DotBridgeTypography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Box sx={{ textAlign: 'left' }}>
                                                                    <DotBridgeTypography variant="caption" sx={{
                                                                        color: 'text.secondary',
                                                                        display: 'block',
                                                                        mb: 0.5,
                                                                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                                        fontWeight: 500,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.05em'
                                                                    }}>
                                                                        CRM Routing
                                                                    </DotBridgeTypography>
                                                                    <DotBridgeTypography variant="body2" sx={{
                                                                        fontWeight: 600,
                                                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                                                        lineHeight: 1.4,
                                                                        color: 'text.primary'
                                                                    }}>
                                                                        {pkg.includes.routing}
                                                                    </DotBridgeTypography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Box sx={{ textAlign: 'left' }}>
                                                                    <DotBridgeTypography variant="caption" sx={{
                                                                        color: 'text.secondary',
                                                                        display: 'block',
                                                                        mb: 0.5,
                                                                        fontSize: { xs: '0.7rem', md: '0.75rem' },
                                                                        fontWeight: 500,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.05em'
                                                                    }}>
                                                                        Support Level
                                                                    </DotBridgeTypography>
                                                                    <DotBridgeTypography variant="body2" sx={{
                                                                        fontWeight: 600,
                                                                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                                                                        lineHeight: 1.4,
                                                                        color: 'text.primary',
                                                                        whiteSpace: { xs: 'normal', md: 'nowrap' },
                                                                        overflow: { xs: 'visible', md: 'hidden' },
                                                                        textOverflow: { xs: 'clip', md: 'ellipsis' }
                                                                    }}>
                                                                        {pkg.includes.support}
                                                                    </DotBridgeTypography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>

                                                    <DotBridgeButton
                                                        fullWidth
                                                        variant={pkg.popular ? "contained" : "outlined"}
                                                        color="primary"
                                                        size="large"
                                                        sx={{
                                                            py: { xs: 1.5, md: 1.75 },
                                                            fontWeight: 600,
                                                            borderRadius: 2,
                                                            fontSize: { xs: '0.9375rem', md: '1rem' },
                                                            mt: 'auto',
                                                            ...(pkg.popular && {
                                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                                boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                                }
                                                            })
                                                        }}
                                                        onClick={() => {
                                                            document.getElementById('lead-form-section')?.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'start'
                                                            });
                                                        }}
                                                    >
                                                        Book Strategy Call →
                                                    </DotBridgeButton>
                                                </DotBridgeCard>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </motion.div>
                        </Container>
                    </Box>

                    {/* Lead Form Section - Moved up */}
                    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }} ref={formRef} id="lead-form-section">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={formInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7 }}
                        >
                            <DotBridgeTypography
                                variant="h2"
                                align="center"
                                sx={{
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                    fontWeight: 700,
                                    lineHeight: { xs: 1.2, md: 1.1 },
                                    px: { xs: 1, md: 0 }
                                }}
                            >
                                Want a GTM System That
                                <Box component="span" sx={{
                                    color: 'primary.main',
                                    display: 'block',
                                    mt: { xs: 0.25, md: 0.15 }
                                }}>
                                    Replaces Your First SDR?
                                </Box>
                            </DotBridgeTypography>

                            <DotBridgeTypography
                                variant="h6"
                                align="center"
                                sx={{
                                    color: 'text.secondary',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    mb: { xs: 3, md: 4 },
                                    fontSize: { xs: '0.9375rem', sm: '1.125rem', md: '1.25rem' },
                                    px: { xs: 1, md: 0 },
                                    fontWeight: 400,
                                    lineHeight: 1.6
                                }}
                            >
                                Book a free strategy walkthrough to see how our Pipeline-as-a-Service can 3x your qualified pipeline
                                in the next 90 days.
                            </DotBridgeTypography>

                            <DotBridgeCard
                                sx={{
                                    p: { xs: 2.5, sm: 3, md: 4 },
                                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}10 100%)`,
                                    border: '2px solid',
                                    borderColor: 'primary.light',
                                    boxShadow: '0 8px 32px rgba(0, 102, 255, 0.1)',
                                    borderRadius: { xs: 2, md: 3 }
                                }}
                            >
                                {submitted ? (
                                    <Box sx={{ textAlign: 'center', py: { xs: 2, md: 3 } }}>
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <CheckCircle sx={{ fontSize: { xs: 48, md: 56 }, color: 'success.main', mb: 2 }} />
                                            <DotBridgeTypography variant="h5" sx={{ mb: 1, fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                                                Request Submitted!
                                            </DotBridgeTypography>
                                            <DotBridgeTypography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9375rem', md: '1rem' } }}>
                                                We'll contact you shortly to schedule your personalized demo.
                                            </DotBridgeTypography>
                                        </motion.div>
                                    </Box>
                                ) : (
                                    <form onSubmit={handleLeadSubmit}>
                                        <Grid container spacing={{ xs: 2, md: 3 }}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Full Name"
                                                    name="name"
                                                    value={lead.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' }
                                                        },
                                                        '& .MuiOutlinedInput-input': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' },
                                                            py: { xs: 1.25, md: 1.5 }
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
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' }
                                                        },
                                                        '& .MuiOutlinedInput-input': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' },
                                                            py: { xs: 1.25, md: 1.5 }
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
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' }
                                                        },
                                                        '& .MuiOutlinedInput-input': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' },
                                                            py: { xs: 1.25, md: 1.5 }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormLabel component="legend" sx={{
                                                    mb: 1.5,
                                                    color: 'text.primary',
                                                    fontWeight: 500,
                                                    fontSize: { xs: '0.9375rem', md: '1rem' }
                                                }}>
                                                    What's your current biggest pipeline challenge?
                                                </FormLabel>
                                                <RadioGroup
                                                    name="hasExistingCourse"
                                                    value={lead.hasExistingCourse}
                                                    onChange={handleInputChange}
                                                    required
                                                    sx={{ gap: { xs: 0.5, md: 1 } }}
                                                >
                                                    <FormControlLabel
                                                        value="lead-gen"
                                                        control={<Radio color="primary" />}
                                                        label="Not enough qualified leads"
                                                        sx={{
                                                            '& .MuiFormControlLabel-label': {
                                                                fontSize: { xs: '0.875rem', md: '0.95rem' }
                                                            }
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="conversion"
                                                        control={<Radio color="primary" />}
                                                        label="Low demo-to-close conversion"
                                                        sx={{
                                                            '& .MuiFormControlLabel-label': {
                                                                fontSize: { xs: '0.875rem', md: '0.95rem' }
                                                            }
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="scaling"
                                                        control={<Radio color="primary" />}
                                                        label="Can't scale current process"
                                                        sx={{
                                                            '& .MuiFormControlLabel-label': {
                                                                fontSize: { xs: '0.875rem', md: '0.95rem' }
                                                            }
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="attribution"
                                                        control={<Radio color="primary" />}
                                                        label="Poor pipeline attribution/visibility"
                                                        sx={{
                                                            '& .MuiFormControlLabel-label': {
                                                                fontSize: { xs: '0.875rem', md: '0.95rem' }
                                                            }
                                                        }}
                                                    />
                                                </RadioGroup>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Tell us about your current revenue goals & team size"
                                                    name="courseTopic"
                                                    value={lead.courseTopic}
                                                    onChange={handleInputChange}
                                                    multiline
                                                    rows={3}
                                                    required
                                                    placeholder="e.g., $10M ARR target, 15-person sales team, struggling with lead quality..."
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' }
                                                        },
                                                        '& .MuiOutlinedInput-input': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' }
                                                        },
                                                        '& .MuiInputBase-inputMultiline': {
                                                            fontSize: { xs: '0.9375rem', md: '1rem' }
                                                        }
                                                    }}
                                                />
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
                                                        py: { xs: 1.5, md: 1.75 },
                                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                                        fontWeight: 600,
                                                        borderRadius: 2,
                                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                        boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                                        },
                                                        '&:disabled': {
                                                            transform: 'none',
                                                            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)'
                                                        }
                                                    }}
                                                >
                                                    {isSubmitting ? (
                                                        <CircularProgress size={24} color="inherit" />
                                                    ) : (
                                                        'Get Your Revenue Engine Audit →'
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
                                                            fontSize: { xs: '0.875rem', md: '0.9375rem' }
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
                    </Container>


                </motion.div>
            </Container>

            {/* Value Proposition Section */}
            <Box sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                py: { xs: 8, md: 12 },
                borderTop: '1px solid',
                borderColor: 'divider'
            }}>
                <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 3 } }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <DotBridgeTypography
                            variant="h2"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                                fontWeight: 600,
                                lineHeight: { xs: 1.25, md: 1.1 },
                                px: { xs: 1, md: 0 }
                            }}
                        >
                            Stop Building Pipeline Piece by Piece.
                            <Box component="span" sx={{
                                color: 'primary.main',
                                display: 'block',
                                mt: { xs: 0.75, md: 0.5 }
                            }}>
                                Get Your Complete Revenue Engine.
                            </Box>
                        </DotBridgeTypography>

                        <DotBridgeTypography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.375rem' },
                                px: { xs: 2, sm: 3, md: 0 },
                                lineHeight: { xs: 1.6, md: 1.6 }
                            }}
                        >
                            Why juggle 8 different tools when you can have
                            <Box component="span" sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                display: { xs: 'block', sm: 'inline' },
                                mt: { xs: 0.5, sm: 0 }
                            }}>
                                {' '}one integrated system that finds, engages, and converts prospects
                            </Box>
                            <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
                                {' '}from first touch to signed contract?
                            </Box>
                        </DotBridgeTypography>
                    </motion.div>
                </Container>
            </Box>

            {/* What We Deliver Section - Updated with Interactive Cards */}
            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 15 }, position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }} ref={stepsRef}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <DotBridgeTypography
                        variant="h2"
                        align="center"
                        sx={{
                            mb: 3,
                            fontSize: { xs: '1.875rem', sm: '2.5rem', md: '2.75rem' },
                            fontWeight: 600,
                            lineHeight: { xs: 1.2, md: 1.1 },
                            px: { xs: 2, md: 0 }
                        }}
                    >
                        Your Complete
                        <Box component="span" sx={{
                            color: 'primary.main',
                            display: { xs: 'block', sm: 'inline' }
                        }}> Pipeline-as-a-Service</Box>
                    </DotBridgeTypography>

                    <DotBridgeTypography
                        variant="h5"
                        align="center"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '800px',
                            mx: 'auto',
                            mb: { xs: 6, md: 8 },
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                            px: { xs: 2, md: 0 }
                        }}
                    >
                        From prospect identification to deal closure - we handle your entire revenue engine
                        so you can focus on scaling your business.
                    </DotBridgeTypography>

                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
                        {[
                            {
                                title: "Intelligent Lead Discovery & Enrichment",
                                description: "AI-powered prospect identification with deep data enrichment. We find your ideal customers and build comprehensive profiles before first contact.",
                                icon: <QueryStats sx={{ fontSize: 40, color: 'primary.main' }} />,
                                features: ["Intent data analysis", "Company & contact enrichment", "Ideal Customer Profile matching"],
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)',
                                delay: 0
                            },
                            {
                                title: "Personalized Multi-Channel Outreach",
                                description: "Coordinated email and LinkedIn campaigns that adapt messaging based on prospect behavior and engagement patterns.",
                                icon: <Users sx={{ fontSize: 40, color: 'primary.main' }} />,
                                features: ["Email sequence automation", "LinkedIn outreach campaigns", "Behavioral response triggers"],
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)',
                                delay: 0.1
                            },
                            {
                                title: "Interactive Demo Experiences",
                                description: "Transform prospects into qualified leads with AI-powered video demos that adapt to viewer interests and capture intent signals.",
                                icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
                                features: ["Real-time interaction", "Lead qualification", "Automated booking"],
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)',
                                delay: 0.2
                            },
                            {
                                title: "CRM Integration & Analytics",
                                description: "Seamless data flow into your existing systems with comprehensive attribution tracking and pipeline performance analytics.",
                                icon: <Groups sx={{ fontSize: 40, color: 'primary.main' }} />,
                                features: ["Native CRM sync", "Attribution tracking", "Performance dashboards"],
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)',
                                delay: 0.3
                            },
                            {
                                title: "AI-Generated Creative Assets",
                                description: "Dynamic ad creative generation and A/B testing to maximize conversion rates across all touchpoints.",
                                icon: <Sparkles sx={{ fontSize: 40, color: 'primary.main' }} />,
                                features: ["Dynamic ad creation", "A/B testing automation", "Creative optimization"],
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)',
                                delay: 0.4
                            }
                        ].map((item, idx) => (
                            <Grid item xs={12} md={idx < 3 ? 4 : 6} key={idx} sx={{ display: 'flex' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: item.delay, duration: 0.6 }}
                                    whileHover={{ y: -8 }}
                                    style={{ width: '100%', display: 'flex' }}
                                >
                                    <DotBridgeCard
                                        sx={{
                                            p: { xs: 3, md: 4 },
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '100%',
                                            textAlign: 'left',
                                            backgroundImage: item.gradient,
                                            backgroundPosition: 'top right',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '70% 70%',
                                            minHeight: { xs: 'auto', md: '320px' },
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px rgba(0, 102, 255, 0.15)',
                                                borderColor: 'primary.light',
                                                '& .feature-icon': {
                                                    transform: 'scale(1.1) rotate(5deg)',
                                                },
                                                '& .feature-list': {
                                                    opacity: 1,
                                                    transform: 'translateY(0)',
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease'
                                            },
                                            '&:hover::before': {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                className="feature-icon"
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 2,
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                                    transition: 'transform 0.3s ease',
                                                    '& svg': {
                                                        color: 'white'
                                                    }
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                            <DotBridgeTypography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                                                    flex: 1
                                                }}
                                            >
                                                {item.title}
                                            </DotBridgeTypography>
                                        </Box>

                                        <DotBridgeTypography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 3,
                                                lineHeight: 1.6,
                                                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                textAlign: 'left'
                                            }}
                                        >
                                            {item.description}
                                        </DotBridgeTypography>

                                        <Box
                                            className="feature-list"
                                            sx={{
                                                mt: 'auto',
                                                opacity: { xs: 1, md: 0.8 },
                                                transform: { xs: 'translateY(0)', md: 'translateY(4px)' },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {item.features.map((feature, featureIdx) => (
                                                <motion.div
                                                    key={featureIdx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                                                    transition={{ delay: item.delay + (featureIdx * 0.1), duration: 0.4 }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mb: 1,
                                                        '&:hover': {
                                                            '& .check-icon': {
                                                                transform: 'scale(1.2)',
                                                                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                                            }
                                                        }
                                                    }}>
                                                        <Box
                                                            className="check-icon"
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                background: 'success.main',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mr: 1.5,
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                                                        </Box>
                                                        <DotBridgeTypography variant="caption" sx={{
                                                            fontSize: '0.875rem',
                                                            color: 'text.secondary',
                                                            fontWeight: 500
                                                        }}>
                                                            {feature}
                                                        </DotBridgeTypography>
                                                    </Box>
                                                </motion.div>
                                            ))}
                                        </Box>
                                    </DotBridgeCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            {/* Who This Is For Section - NEW */}
            <Box sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                py: { xs: 8, md: 12 },
                borderTop: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background gradient effect */}
                <Box sx={{
                    position: 'absolute',
                    top: -200,
                    right: -150,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 70%)',
                    pointerEvents: 'none',
                    display: { xs: 'none', lg: 'block' }
                }} />

                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <DotBridgeTypography
                            variant="h2"
                            align="center"
                            sx={{
                                mb: 2,
                                fontSize: { xs: '1.875rem', sm: '2.5rem', md: '2.75rem' },
                                fontWeight: 700,
                                lineHeight: { xs: 1.2, md: 1.1 },
                                px: { xs: 2, md: 0 }
                            }}
                        >
                            Built for
                            <Box component="span" sx={{
                                color: 'primary.main',
                                display: { xs: 'block', sm: 'inline' }
                            }}> Forward-Thinking Revenue Teams</Box>
                        </DotBridgeTypography>

                        <DotBridgeTypography
                            variant="h5"
                            align="center"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '700px',
                                mx: 'auto',
                                mb: { xs: 6, md: 8 },
                                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                                px: { xs: 2, md: 0 }
                            }}
                        >
                            If you're tired of the same old playbook, you're in the right place
                        </DotBridgeTypography>

                        <Grid container spacing={4} justifyContent="center">
                            {[
                                {
                                    title: "Founders & CEOs",
                                    description: "Who don't want to hire a sales team yet",
                                    pain: "You need revenue, not overhead",
                                    icon: <Users sx={{ fontSize: 48 }} />,
                                    gradient: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)'
                                },
                                {
                                    title: "CROs & VP Sales",
                                    description: "Who want to scale without more SDRs",
                                    pain: "Your CAC is too high to keep hiring",
                                    icon: <TrendingUp sx={{ fontSize: 48 }} />,
                                    gradient: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                                },
                                {
                                    title: "RevOps Leaders",
                                    description: "Optimizing funnel ROI",
                                    pain: "You're drowning in tools, not insights",
                                    icon: <QueryStats sx={{ fontSize: 48 }} />,
                                    gradient: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)'
                                },
                                {
                                    title: "Growth Agencies",
                                    description: "Automating client acquisition",
                                    pain: "You practice what you preach",
                                    icon: <Groups sx={{ fontSize: 48 }} />,
                                    gradient: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
                                }
                            ].map((persona, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1, duration: 0.6 }}
                                        whileHover={{ scale: 1.05 }}
                                        style={{ height: '100%' }}
                                    >
                                        <DotBridgeCard
                                            interactive
                                            sx={{
                                                p: { xs: 2.5, md: 3 },
                                                height: '100%',
                                                minHeight: { xs: '280px', md: '320px' },
                                                textAlign: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                background: 'background.paper',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '4px',
                                                    background: persona.gradient,
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                },
                                                '&:hover::before': {
                                                    opacity: 1
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                width: { xs: 64, md: 80 },
                                                height: { xs: 64, md: 80 },
                                                borderRadius: '20px',
                                                background: persona.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                mb: { xs: 2, md: 2.5 },
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                                flexShrink: 0
                                            }}>
                                                {persona.icon}
                                            </Box>

                                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                <DotBridgeTypography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: { xs: 1, md: 1.5 },
                                                        color: 'text.primary',
                                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                                        lineHeight: 1.3,
                                                        minHeight: { xs: '1.3em', md: '1.5em' }
                                                    }}
                                                >
                                                    {persona.title}
                                                </DotBridgeTypography>

                                                <DotBridgeTypography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        mb: { xs: 1.5, md: 2 },
                                                        fontWeight: 500,
                                                        fontSize: { xs: '0.875rem', md: '0.9375rem' },
                                                        lineHeight: 1.4,
                                                        minHeight: { xs: '2.8em', md: '3em' }
                                                    }}
                                                >
                                                    {persona.description}
                                                </DotBridgeTypography>
                                            </Box>

                                            <DotBridgeTypography
                                                variant="caption"
                                                sx={{
                                                    color: 'primary.main',
                                                    fontStyle: 'italic',
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.75rem', md: '0.8125rem' },
                                                    lineHeight: 1.3,
                                                    textAlign: 'center',
                                                    px: 1,
                                                    minHeight: { xs: '2.6em', md: '2.6em' },
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                "{persona.pain}"
                                            </DotBridgeTypography>
                                        </DotBridgeCard>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>



            {/* Final CTA Section */}
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                py: { xs: 8, md: 10 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background pattern */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    background: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
                    pointerEvents: 'none',
                    display: { xs: 'none', md: 'block' }
                }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <DotBridgeTypography
                        variant="h2"
                        sx={{
                            mb: 3,
                            color: 'inherit',
                            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '2.75rem' },
                            fontWeight: 600,
                            lineHeight: { xs: 1.2, md: 1.1 },
                            px: { xs: 2, md: 0 }
                        }}
                    >
                        Your Competition is Building
                        <Box component="span" sx={{
                            display: 'block',
                            mt: { xs: 0.5, md: 0 }
                        }}>
                            Their GTM Engine Right Now.
                        </Box>
                    </DotBridgeTypography>

                    <DotBridgeTypography
                        variant="h5"
                        sx={{
                            mb: 5,
                            maxWidth: '700px',
                            mx: 'auto',
                            color: 'inherit',
                            opacity: 0.9,
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                            px: { xs: 2, md: 0 }
                        }}
                    >
                        While they're hiring SDRs at $80K+ each, you could have an AI system
                        booking qualified meetings 24/7. Which strategy wins in 2024?
                    </DotBridgeTypography>

                    <DotBridgeButton
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: 'common.white',
                            color: 'primary.main',
                            px: 4,
                            py: 1.5,
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            fontWeight: 600,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            '&:hover': {
                                bgcolor: 'grey.100',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                            }
                        }}
                        onClick={() => {
                            document.getElementById('lead-form-section')?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}
                    >
                        Install Your GTM Engine Today →
                    </DotBridgeButton>
                </Container>
            </Box>

            {/* Add Footer */}
            <Footer />

            {/* Floating CTA Button */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: showFloatingCTA ? 1 : 0,
                    y: showFloatingCTA ? 0 : 100
                }}
                transition={{ duration: 0.3 }}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                    pointerEvents: showFloatingCTA ? 'auto' : 'none'
                }}
            >
                <DotBridgeButton
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                        document.getElementById('lead-form-section')?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }}
                    sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: '0 8px 32px rgba(0, 102, 255, 0.4)',
                        '&:hover': {
                            transform: 'translateY(-3px) scale(1.02)',
                            boxShadow: '0 12px 40px rgba(0, 102, 255, 0.5)'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Get Revenue Audit →
                </DotBridgeButton>
            </motion.div>

            {/* Mobile Performance Optimizations */}
            <style jsx>{`
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
        </Box>
    );
};

export default ServicesPage;
