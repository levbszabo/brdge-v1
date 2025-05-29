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
    Typography,
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
    Rocket as RocketIcon,
    Send as SendIcon,
    Analytics as AnalyticsIcon,
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
const DEMO_BRIDGE_ID = '431';

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

// Results metrics
const resultMetrics = [
    {
        metric: "22",
        description: "Meetings Booked",
        subtitle: "in just 3 days",
        icon: <Calendar sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "67%",
        description: "Open Rate",
        subtitle: "vs 20% average",
        icon: <Eye sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "5.2min",
        description: "Avg Watch Time",
        subtitle: "highly engaged prospects",
        icon: <Clock sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "$180K",
        description: "Pipeline Generated",
        subtitle: "from one campaign",
        icon: <TrendingUp sx={{ fontSize: 36, mb: 1.5 }} />,
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
    const [processRef, processInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [resultsRef, resultsInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });

    // Lead form state
    const [lead, setLead] = useState({
        name: '',
        email: '',
        company: '',
        monthlyTarget: '',
        message: '',
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
                company: lead.company,
                monthlyTarget: lead.monthlyTarget,
                message: lead.message,
                serviceType: 'pipeline-acceleration'
            });

            if (response.data.success) {
                setSubmitted(true);
                setLead({ name: '', email: '', company: '', monthlyTarget: '', message: '' });
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
            <Container maxWidth="lg" ref={heroRef} sx={{
                position: 'relative',
                zIndex: 1,
                pt: { xs: 4, md: 10 },
                px: { xs: 2, sm: 3, md: 3 }
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center' }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Chip
                            label="🚀 PIPELINE-AS-A-SERVICE"
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                letterSpacing: '0.05em',
                                px: 2,
                                py: 0.5,
                                border: 'none',
                                boxShadow: '0 2px 8px rgba(0, 199, 129, 0.3)',
                                mb: 2
                            }}
                        />
                    </Box>

                    <DotBridgeTypography
                        variant="h1"
                        component="h1"
                        sx={{
                            mb: { xs: 3, md: 4 },
                            fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
                            fontWeight: 800,
                            lineHeight: { xs: 1.1, md: 1.05 },
                            textAlign: 'center',
                            letterSpacing: { xs: '-0.02em', md: '-0.03em' },
                            px: { xs: 1, md: 0 }
                        }}
                    >
                        <Box component="span" sx={{
                            background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Book 22 Meetings
                        </Box>
                        <Box component="span" sx={{
                            display: 'block',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mt: { xs: 0.25, md: 0.15 }
                        }}>
                            in 3 Days
                        </Box>
                    </DotBridgeTypography>

                    <DotBridgeTypography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '900px',
                            mx: 'auto',
                            mb: { xs: 5, md: 6 },
                            lineHeight: { xs: 1.5, md: 1.6 },
                            fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
                            px: { xs: 3, md: 0 },
                            textAlign: 'center',
                            fontWeight: 400
                        }}
                    >
                        We send 1,000 personalized AI demos of your product that
                        <Box component="span" sx={{
                            fontWeight: 600,
                            color: 'primary.main'
                        }}> greet each prospect by name, answer their specific questions, and book meetings directly.</Box>
                        <Box component="span" sx={{
                            display: 'block',
                            mt: 2,
                            fontSize: '0.9em',
                            color: 'text.secondary'
                        }}>
                            <strong>$25K/month</strong> - Cheaper than one SDR. Better results than ten.
                        </Box>
                    </DotBridgeTypography>

                    {/* CTA Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', mb: 8 }}>
                        <DotBridgeButton
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                document.getElementById('strategy-call-form')?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }}
                            sx={{
                                px: 4,
                                py: 1.75,
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 600,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 32px rgba(0, 102, 255, 0.4)'
                                }
                            }}
                        >
                            Book Strategy Call →
                        </DotBridgeButton>
                        <DotBridgeButton
                            size="large"
                            variant="outlined"
                            color="primary"
                            component={RouterLink}
                            to={`/viewBridge/${DEMO_BRIDGE_ID}`}
                            sx={{
                                px: 4,
                                py: 1.75,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                borderWidth: '2px',
                                '&:hover': {
                                    borderWidth: '2px',
                                    background: `${theme.palette.primary.main}10`
                                }
                            }}
                        >
                            See Live Example
                        </DotBridgeButton>
                    </Box>

                    {/* Demo Video Section */}
                    <Box sx={{ mb: { xs: 6, sm: 8 }, mt: { xs: 2, sm: 0 } }}>
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
                                    maxWidth: { xs: '100%', sm: '600px', md: '900px' },
                                    mx: { xs: 0.5, sm: 'auto' },
                                    position: 'relative',
                                    borderRadius: { xs: 2, sm: 3 },
                                    overflow: 'hidden',
                                    boxShadow: { xs: '0 8px 24px rgba(0, 102, 255, 0.1)', sm: '0 30px 80px rgba(0, 102, 255, 0.15)' },
                                    border: { xs: '1px solid', sm: '2px solid' },
                                    borderColor: { xs: 'divider', sm: 'transparent' },
                                    borderImage: { xs: 'none', sm: `linear-gradient(135deg, ${theme.palette.primary.light}50, ${theme.palette.primary.main}50) 1` },
                                    bgcolor: 'background.paper',
                                    aspectRatio: { xs: '16 / 9', sm: '16 / 10', md: '16 / 10' },
                                }}>
                                    <Box sx={{
                                        p: 1,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                                        display: { xs: 'none', sm: 'flex' },
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: 'center' }}>
                                            Experience Your Personalized Demo
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        position: 'relative',
                                        height: { xs: '100%', sm: 'calc(100% - 40px)' },
                                    }}>
                                        {isMobile ? (
                                            <video
                                                src="/dotbridge-hero-small.mp4"
                                                poster="/dotbridge-hero-cover.jpg"
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
                                </Box>
                            </motion.div>
                        </motion.div>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, fontStyle: 'italic' }}>
                            ☝️ This exact system booked our last 5 clients
                        </Typography>
                    </Box>
                </motion.div>
            </Container>

            {/* How It Works Section */}
            <Box sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                py: { xs: 8, md: 12 },
                borderTop: '1px solid',
                borderColor: 'divider'
            }} ref={processRef}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={processInView ? { opacity: 1, y: 0 } : {}}
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
                            The System That
                            <Box component="span" sx={{
                                color: 'primary.main',
                                display: { xs: 'block', sm: 'inline' }
                            }}> Actually Works</Box>
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
                            We don't just send emails. We create personalized experiences that convert.
                        </DotBridgeTypography>

                        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ maxWidth: '1000px', mx: 'auto' }}>
                            {[
                                {
                                    week: "Week 1",
                                    title: "Transform Your Content",
                                    description: "We take your existing demo and transform it into an AI-powered Bridge that can answer questions, handle objections, and book meetings.",
                                    icon: <Sparkles sx={{ fontSize: 40 }} />,
                                    color: 'primary'
                                },
                                {
                                    week: "Week 2",
                                    title: "Launch 1,000 Campaigns",
                                    description: "We personalize your Bridge for 1,000 prospects and launch targeted outreach campaigns that get 67% open rates.",
                                    icon: <SendIcon sx={{ fontSize: 40 }} />,
                                    color: 'success'
                                },
                                {
                                    week: "Week 3",
                                    title: "Watch Meetings Roll In",
                                    description: "Qualified prospects book directly through your Bridge. You get daily reports on engagement and pipeline growth.",
                                    icon: <Calendar sx={{ fontSize: 40 }} />,
                                    color: 'warning'
                                },
                                {
                                    week: "Week 4+",
                                    title: "Scale & Optimize",
                                    description: "We analyze what's working and continuously improve your campaigns for maximum ROI.",
                                    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
                                    color: 'info'
                                }
                            ].map((step, idx) => (
                                <Grid item xs={12} sm={6} key={idx}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={processInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: idx * 0.1, duration: 0.6 }}
                                    >
                                        <DotBridgeCard
                                            sx={{
                                                p: { xs: 3, md: 4 },
                                                height: '100%',
                                                textAlign: 'center',
                                                border: '2px solid',
                                                borderColor: `${step.color}.light`,
                                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette[step.color].lighter}20 100%)`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    borderColor: `${step.color}.main`,
                                                    boxShadow: theme.shadows[4]
                                                }
                                            }}
                                        >
                                            <Box sx={{
                                                width: 80,
                                                height: 80,
                                                mx: 'auto',
                                                mb: 2,
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${theme.palette[step.color].light} 0%, ${theme.palette[step.color].main} 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                boxShadow: `0 8px 24px ${theme.palette[step.color].main}30`
                                            }}>
                                                {step.icon}
                                            </Box>

                                            <Typography variant="overline" sx={{
                                                color: `${step.color}.dark`,
                                                fontWeight: 700,
                                                letterSpacing: '0.1em'
                                            }}>
                                                {step.week}
                                            </Typography>

                                            <DotBridgeTypography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 2,
                                                    fontSize: { xs: '1.125rem', md: '1.25rem' }
                                                }}
                                            >
                                                {step.title}
                                            </DotBridgeTypography>

                                            <DotBridgeTypography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    lineHeight: 1.6,
                                                    fontSize: { xs: '0.875rem', md: '0.9375rem' }
                                                }}
                                            >
                                                {step.description}
                                            </DotBridgeTypography>
                                        </DotBridgeCard>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Results Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }} ref={resultsRef}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <DotBridgeTypography
                        variant="h2"
                        align="center"
                        sx={{
                            mb: { xs: 2, md: 3 },
                            fontSize: { xs: '1.875rem', sm: '2.5rem', md: '2.75rem' },
                            fontWeight: 600,
                            lineHeight: { xs: 1.2, md: 1.1 },
                            px: { xs: 2, md: 0 }
                        }}
                    >
                        Real Results from
                        <Box component="span" sx={{
                            color: 'primary.main',
                            display: { xs: 'block', sm: 'inline' }
                        }}> Real Campaigns</Box>
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
                        These aren't projections. These are actual results from campaigns we've run.
                    </DotBridgeTypography>

                    <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
                        {resultMetrics.map((metric, index) => (
                            <Grid item xs={6} sm={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                >
                                    <DotBridgeCard
                                        sx={{
                                            p: { xs: 2, md: 3 },
                                            textAlign: 'center',
                                            height: '100%',
                                            minHeight: { xs: '140px', md: '180px' },
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}20 100%)`,
                                            border: '1px solid',
                                            borderColor: 'primary.light'
                                        }}
                                    >
                                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                                            {metric.icon}
                                        </Box>

                                        <DotBridgeTypography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'primary.main',
                                                mb: 1,
                                                fontSize: { xs: '1.5rem', md: '2.25rem' }
                                            }}
                                        >
                                            {metric.metric}
                                        </DotBridgeTypography>

                                        <DotBridgeTypography
                                            variant="h6"
                                            sx={{
                                                mb: 0.5,
                                                fontSize: { xs: '0.875rem', md: '1rem' },
                                                fontWeight: 600
                                            }}
                                        >
                                            {metric.description}
                                        </DotBridgeTypography>

                                        <DotBridgeTypography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                fontStyle: 'italic',
                                                fontSize: { xs: '0.75rem', md: '0.8125rem' }
                                            }}
                                        >
                                            {metric.subtitle}
                                        </DotBridgeTypography>
                                    </DotBridgeCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
                        <Paper sx={{
                            display: 'inline-block',
                            p: { xs: 2, md: 3 },
                            maxWidth: { xs: '90%', md: '600px' },
                            background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}30 100%)`,
                            border: '1px solid',
                            borderColor: 'primary.light'
                        }}>
                            <DotBridgeTypography
                                variant="body1"
                                sx={{
                                    fontStyle: 'italic',
                                    color: 'primary.dark',
                                    fontWeight: 500,
                                    mb: 1,
                                    fontSize: { xs: '0.9375rem', md: '1rem' }
                                }}
                            >
                                "I sent 1,000 personalized demos and booked 22 calls in 3 days. Nobody else is doing this."
                            </DotBridgeTypography>
                            <DotBridgeTypography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                                — Early DotBridge User
                            </DotBridgeTypography>
                        </Paper>
                    </Box>
                </motion.div>
            </Container>

            {/* What's Included Section */}
            <Box sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                py: { xs: 8, md: 12 },
                borderTop: '1px solid',
                borderColor: 'divider'
            }}>
                <Container maxWidth="lg">
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
                        Everything You Need to
                        <Box component="span" sx={{
                            color: 'primary.main',
                            display: { xs: 'block', sm: 'inline' }
                        }}> 10X Your Pipeline</Box>
                    </DotBridgeTypography>

                    <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 6 }}>
                        <Grid container spacing={2}>
                            {[
                                "Transform your demo into an AI-powered Bridge",
                                "Voice cloning for authentic personalization",
                                "1,000 personalized campaigns per month",
                                "Targeted prospect research & enrichment",
                                "Email outreach with 67%+ open rates",
                                "Real-time engagement analytics",
                                "Weekly optimization reports",
                                "Dedicated campaign manager",
                                "Unlimited revisions & A/B testing",
                                "Direct calendar booking integration"
                            ].map((item, idx) => (
                                <Grid item xs={12} sm={6} key={idx}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                        <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                                        <DotBridgeTypography variant="body1">
                                            {item}
                                        </DotBridgeTypography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Paper sx={{
                            display: 'inline-block',
                            p: { xs: 3, md: 4 },
                            background: `linear-gradient(135deg, ${theme.palette.success.lighter} 0%, ${theme.palette.success.light}30 100%)`,
                            border: '2px solid',
                            borderColor: 'success.main'
                        }}>
                            <DotBridgeTypography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: 'success.dark',
                                    mb: 1
                                }}
                            >
                                $25,000/month
                            </DotBridgeTypography>
                            <DotBridgeTypography
                                variant="body1"
                                sx={{
                                    color: 'success.dark',
                                    fontWeight: 500
                                }}
                            >
                                Less than the cost of one SDR. Better results than ten.
                            </DotBridgeTypography>
                        </Paper>
                    </Box>
                </Container>
            </Box>

            {/* Lead Form Section */}
            <Container maxWidth="sm" sx={{ py: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }} ref={formRef} id="strategy-call-form">
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
                            fontSize: { xs: '1.875rem', sm: '2.25rem', md: '2.5rem' },
                            fontWeight: 700,
                            lineHeight: { xs: 1.2, md: 1.1 },
                            px: { xs: 2, md: 0 }
                        }}
                    >
                        Ready to Fill Your Calendar?
                        <Box component="span" sx={{
                            color: 'primary.main',
                            display: 'block',
                            mt: { xs: 0.25, md: 0.15 }
                        }}>
                            Book Your Strategy Call
                        </Box>
                    </DotBridgeTypography>

                    <DotBridgeTypography
                        variant="h6"
                        align="center"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto',
                            mb: 4,
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                            px: { xs: 2, md: 0 },
                            fontWeight: 400
                        }}
                    >
                        Limited to 5 clients per month to ensure quality. Book now to secure your spot.
                    </DotBridgeTypography>

                    <DotBridgeCard
                        sx={{
                            p: { xs: 3, sm: 4, md: 4 },
                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}10 100%)`,
                            border: '2px solid',
                            borderColor: 'primary.light',
                            boxShadow: '0 8px 32px rgba(0, 102, 255, 0.1)'
                        }}
                    >
                        {submitted ? (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CheckCircle sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
                                    <DotBridgeTypography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                                        Request Received!
                                    </DotBridgeTypography>
                                    <DotBridgeTypography variant="body1" color="text.secondary">
                                        We'll contact you within 24 hours to schedule your strategy call.
                                    </DotBridgeTypography>
                                </motion.div>
                            </Box>
                        ) : (
                            <form onSubmit={handleLeadSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            label="Your Name"
                                            name="name"
                                            value={lead.name}
                                            onChange={handleInputChange}
                                            required
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
                                            label="Your Email"
                                            name="email"
                                            type="email"
                                            required
                                            value={lead.email}
                                            onChange={handleInputChange}
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
                                            label="Company Name"
                                            name="company"
                                            value={lead.company}
                                            onChange={handleInputChange}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset" fullWidth>
                                            <FormLabel component="legend" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 500 }}>
                                                How many meetings do you need per month?
                                            </FormLabel>
                                            <RadioGroup
                                                name="monthlyTarget"
                                                value={lead.monthlyTarget}
                                                onChange={handleInputChange}
                                                required
                                                sx={{ gap: 1 }}
                                            >
                                                <FormControlLabel
                                                    value="20-50"
                                                    control={<Radio color="primary" />}
                                                    label="20-50 meetings"
                                                />
                                                <FormControlLabel
                                                    value="50-100"
                                                    control={<Radio color="primary" />}
                                                    label="50-100 meetings"
                                                />
                                                <FormControlLabel
                                                    value="100+"
                                                    control={<Radio color="primary" />}
                                                    label="100+ meetings"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            label="What's your biggest sales challenge?"
                                            name="message"
                                            value={lead.message}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={3}
                                            placeholder="e.g., Low demo show rates, long sales cycles, not enough qualified leads..."
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
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
                                                py: 1.75,
                                                fontSize: { xs: '1.125rem', md: '1.25rem' },
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
                                            {isSubmitting ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                'Book Strategy Call →'
                                            )}
                                        </DotBridgeButton>
                                    </Grid>
                                    {error && (
                                        <Grid item xs={12}>
                                            <DotBridgeTypography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                                                {error}
                                            </DotBridgeTypography>
                                        </Grid>
                                    )}
                                </Grid>
                            </form>
                        )}
                    </DotBridgeCard>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <DotBridgeTypography variant="body2" color="text.secondary">
                            Only 2 spots remaining for this month
                        </DotBridgeTypography>
                    </Box>
                </motion.div>
            </Container>

            {/* Final CTA Section */}
            <Box sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                py: { xs: 8, md: 10 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
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
                        Stop Losing Deals to Slow Follow-Up
                        <Box component="span" sx={{
                            display: 'block',
                            mt: { xs: 0.5, md: 0 }
                        }}>
                            Start Booking Meetings at Scale
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
                        Every day you wait is another day your competitors are booking meetings while you're not.
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
                            document.getElementById('strategy-call-form')?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}
                    >
                        Claim Your Spot Now
                    </DotBridgeButton>
                </Container>
            </Box>

            {/* Add Footer */}
            <Footer />
        </Box>
    );
};

export default ServicesPage;
