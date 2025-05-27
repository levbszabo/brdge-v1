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



// Impact metrics with updated copy
const impactMetrics = [
    {
        metric: "+73%",
        description: "Higher Engagement",
        subtitle: "vs static videos",
        icon: <Eye sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "5x",
        description: "More Qualified Leads",
        subtitle: "through AI conversations",
        icon: <TrendingUp sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "-38%",
        description: "Shorter Sales Cycles",
        subtitle: "with pre-qualified prospects",
        icon: <Clock sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "24/7",
        description: "Sales Coverage",
        subtitle: "never miss a prospect",
        icon: <Zap sx={{ fontSize: 36, mb: 1.5 }} />,
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
        hasExistingCourse: '',
        courseTopic: '',
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
                hasExistingCourse: lead.hasExistingCourse,
                courseTopic: lead.courseTopic
            });

            if (response.data.success) {
                setSubmitted(true);
                setLead({ name: '', email: '', hasExistingCourse: '', courseTopic: '' });
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
                            label="🚀 TRANSFORM YOUR SALES PROCESS"
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}50 100%)`,
                                color: theme.palette.primary.dark,
                                fontWeight: 600,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                letterSpacing: '0.05em',
                                px: 2,
                                py: 0.5,
                                border: '1px solid',
                                borderColor: theme.palette.primary.light,
                                boxShadow: '0 2px 8px rgba(0, 102, 255, 0.2)',
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
                            Turn Your Sales Videos Into
                        </Box>
                        <Box component="span" sx={{
                            display: 'block',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mt: { xs: 0.25, md: 0.15 }
                        }}>
                            Revenue-Generating Machines
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
                        Transform static demos into intelligent conversations that
                        <Box component="span" sx={{
                            fontWeight: 600,
                            color: 'primary.main'
                        }}> qualify prospects, answer objections, and book meetings</Box> while you sleep.
                        <Box component="span" sx={{
                            display: 'block',
                            mt: 1,
                            fontSize: '0.9em',
                            color: 'text.secondary',
                            fontStyle: 'italic'
                        }}>
                            No more chasing unqualified leads. Let AI do the heavy lifting.
                        </Box>
                    </DotBridgeTypography>

                    {/* Demo Section - Clean styling with proper mobile aspect ratio and 3D tilt */}
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
                                    mx: { xs: 1, sm: 'auto' },
                                    position: 'relative',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: '0 30px 80px rgba(0, 102, 255, 0.15)',
                                    border: '2px solid',
                                    borderImage: `linear-gradient(135deg, ${theme.palette.primary.light}50, ${theme.palette.primary.main}50) 1`,
                                    bgcolor: 'background.paper',
                                    aspectRatio: { xs: '9 / 16', sm: '16 / 10', md: '16 / 10' },
                                    transform: 'translateZ(0)',
                                    backfaceVisibility: 'hidden',
                                    willChange: 'transform'
                                }}>
                                    <Box sx={{
                                        p: 1,
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
                                        <DotBridgeTypography variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: 'center' }}>
                                            Live DotBridge Sales Demo
                                        </DotBridgeTypography>
                                    </Box>
                                    <Box sx={{
                                        position: 'relative',
                                        height: 'calc(100% - 40px)',
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
                    </Box>

                    {/* Lead Form Section - Moved up */}
                    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }} ref={formRef} id="lead-form-section">
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
                                Ready to Transform Your Sales?
                                <Box component="span" sx={{
                                    color: 'primary.main',
                                    display: 'block',
                                    mt: { xs: 0.25, md: 0.15 }
                                }}>
                                    Get Your Custom Demo
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
                                See how DotBridge can automate your sales process and turn your content into a revenue-generating machine.
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
                                                Request Submitted!
                                            </DotBridgeTypography>
                                            <DotBridgeTypography variant="body1" color="text.secondary">
                                                We'll contact you within 1-2 business days to schedule your personalized demo.
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
                                                <FormControl component="fieldset" fullWidth>
                                                    <FormLabel component="legend" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 500 }}>
                                                        Do you have existing sales content to transform?
                                                    </FormLabel>
                                                    <RadioGroup
                                                        name="hasExistingCourse"
                                                        value={lead.hasExistingCourse}
                                                        onChange={handleInputChange}
                                                        row
                                                        required
                                                        sx={{ gap: 2 }}
                                                    >
                                                        <FormControlLabel
                                                            value="yes"
                                                            control={<Radio color="primary" />}
                                                            label="Yes, I have content"
                                                            sx={{
                                                                '& .MuiFormControlLabel-label': {
                                                                    fontSize: '0.95rem'
                                                                }
                                                            }}
                                                        />
                                                        <FormControlLabel
                                                            value="no"
                                                            control={<Radio color="primary" />}
                                                            label="No, I need help creating it"
                                                            sx={{
                                                                '& .MuiFormControlLabel-label': {
                                                                    fontSize: '0.95rem'
                                                                }
                                                            }}
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    label="Tell us about your sales goals & current challenges"
                                                    name="courseTopic"
                                                    value={lead.courseTopic}
                                                    onChange={handleInputChange}
                                                    multiline
                                                    rows={3}
                                                    required
                                                    placeholder="e.g., We need to qualify leads better, reduce sales cycle time, scale our demo process..."
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
                                                        'Get Your Custom Demo →'
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
                <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <DotBridgeTypography
                            variant="h2"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '1.875rem', sm: '2.5rem', md: '2.75rem' },
                                fontWeight: 600,
                                lineHeight: { xs: 1.2, md: 1.1 },
                                px: { xs: 2, md: 0 }
                            }}
                        >
                            Your Best Sales Rep Can't Be Everywhere.
                            <Box component="span" sx={{
                                color: 'primary.main',
                                display: 'block',
                                mt: { xs: 0.5, md: 0 }
                            }}>
                                Your Bridge Can.
                            </Box>
                        </DotBridgeTypography>

                        <DotBridgeTypography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' },
                                px: { xs: 2, md: 0 }
                            }}
                        >
                            Even your top talent has limits. DotBridge empowers you to
                            <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {' '}clone your best sales conversations into AI agents that work tirelessly
                            </Box>,
                            delivering perfect, personalized interactions every time.
                        </DotBridgeTypography>
                    </motion.div>
                </Container>
            </Box>

            {/* What We Deliver Section */}
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
                        Build Your
                        <Box component="span" sx={{
                            color: 'primary.main',
                            display: { xs: 'block', sm: 'inline' }
                        }}> Automated Sales Machine</Box>
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
                        Transform your sales bottlenecks into automated revenue engines.
                        DotBridge turns potential into profit, 24/7.
                    </DotBridgeTypography>

                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ maxWidth: '1100px', mx: 'auto' }}>
                        {[
                            {
                                title: "AI Sales & Demo Funnels",
                                description: "Transform static demos into interactive AI experiences that qualify leads, answer questions, and route high-intent prospects directly to your calendar—cutting sales cycles and boosting pipeline quality.",
                                icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)'
                            },
                            {
                                title: "Intelligent Onboarding Flows",
                                description: "Automate personalized customer onboarding with AI-guided experiences that reduce churn, accelerate time-to-value, and free up your success team from repetitive tasks.",
                                icon: <Groups sx={{ fontSize: 40, color: 'primary.main' }} />,
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)'
                            },
                            {
                                title: "Dynamic Lead Generation",
                                description: "Turn content into conversion machines. Transform ebooks, webinars, and case studies into interactive experiences that capture, qualify, and nurture prospects automatically.",
                                icon: <QueryStats sx={{ fontSize: 40, color: 'primary.main' }} />,
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)'
                            }
                        ].map((item, idx) => (
                            <Grid item xs={12} md={4} key={idx} sx={{ display: 'flex' }}>
                                <DotBridgeCard
                                    interactive
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        textAlign: 'center',
                                        backgroundImage: item.gradient,
                                        backgroundPosition: 'top right',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '70% 70%',
                                        minHeight: { xs: 'auto', md: '320px' }
                                    }}
                                >
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                        {item.icon}
                                    </Box>

                                    <DotBridgeTypography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 2,
                                            fontSize: { xs: '1.125rem', md: '1.25rem' }
                                        }}
                                    >
                                        {item.title}
                                    </DotBridgeTypography>

                                    <DotBridgeTypography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            flexGrow: 1,
                                            lineHeight: 1.6,
                                            fontSize: { xs: '0.875rem', md: '0.9375rem' }
                                        }}
                                    >
                                        {item.description}
                                    </DotBridgeTypography>
                                </DotBridgeCard>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            {/* Results Section */}
            <Box sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                py: { xs: 8, md: 12 },
                borderTop: '1px solid',
                borderColor: 'divider'
            }} ref={resultsRef}>
                <Container maxWidth="lg">
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
                            }}> Forward-Thinking Teams</Box>
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
                            See how B2B companies are transforming their sales pipeline with DotBridge
                        </DotBridgeTypography>

                        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
                            {impactMetrics.map((metric, index) => (
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
                                    "DotBridge has completely transformed how we engage with enterprise prospects.
                                    Our demos now qualify themselves."
                                </DotBridgeTypography>
                                <DotBridgeTypography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                                    — VP of Sales, Leading Enterprise SaaS Platform
                                </DotBridgeTypography>
                            </Paper>
                        </Box>
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
                        Don't Let Another Lead Slip Away.
                        <Box component="span" sx={{
                            display: 'block',
                            mt: { xs: 0.5, md: 0 }
                        }}>
                            Automate Your Conversions Now.
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
                        Your prospects demand a better experience. DotBridge delivers it:
                        personalized, interactive, 24/7, and ready to turn interest into action.
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
                        Get Started Today
                    </DotBridgeButton>
                </Container>
            </Box>

            {/* Add Footer */}
            <Footer />

            {/* Background Elements */}
            <Box sx={{
                position: 'absolute',
                top: -120,
                right: -80,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,122,255,0.05) 0%, rgba(0,122,255,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none',
                display: { xs: 'none', md: 'block' }
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: -150,
                left: -100,
                width: 350,
                height: 350,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,122,255,0.03) 0%, rgba(0,122,255,0) 60%)',
                zIndex: 0,
                pointerEvents: 'none',
                display: { xs: 'none', md: 'block' }
            }} />

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
