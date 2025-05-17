import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Button,
    Box,
    useTheme,
    useMediaQuery,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Card,
    CardContent,
    Divider,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    TouchApp,
    CheckCircle,
    PlayArrow,
    AccessTime,
    RateReview,
    QueryStats,
    TrendingUp,
    Groups,
    Build,
    School,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import AgentConnector from '../components/AgentConnector';
import { api } from '../api';

// Renamed and updated for "Impact Our Clients See"
const impactMetrics = [
    {
        metric: "+28%",
        description: "Demo Bookings from Interactive Funnels",
        icon: <RateReview sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "3x",
        description: "Learner Engagement vs. Passive Video",
        icon: <TouchApp sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "15+ Hrs",
        description: "Saved Weekly Per Subject-Matter Expert",
        icon: <AccessTime sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "Full", // Keep it short, description explains
        description: "Analytics on Every Click & Question",
        icon: <QueryStats sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    }
];

// Updated service features for the 5-step process
const SoftwareUsageSteps = [
    {
        step: 1,
        title: "Define Your Goal",
        description: "Clearly outline your sales, onboarding, or learning objectives for your AI Bridge."
    },
    {
        step: 2,
        title: "Upload Your Content",
        description: "Easily upload your existing videos (MP4, Loom, Zoom), scripts, or documents."
    },
    {
        step: 3,
        title: "Configure Your AI",
        description: "Customize the AI's persona, voice (optional), and knowledge base using simple controls."
    },
    {
        step: 4,
        title: "Assemble Your Bridge",
        description: "Use the intuitive DotBridge editor to add interactive prompts, CTAs, and conditional logic."
    },
    {
        step: 5,
        title: "Publish & Optimize",
        description: "Launch your Bridge with a shareable link or embed, then use analytics to track performance and iterate."
    }
];

// Use the same DEMO_BRIDGE_ID as landing page for consistency
const DEMO_BRIDGE_ID = '398';

const ServicesPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Simplified inView refs
    const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [stepsRef, stepsInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [resultsRef, resultsInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });

    // Lead form state - unchanged
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

    // handleLeadSubmit function - unchanged
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

    // Primary Color Text Span Helper
    const PrimaryText = ({ children }) => (
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 'inherit' }}>
            {children}
        </Box>
    );

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)', // Adjust for header
                bgcolor: theme.palette.background.default, // Use theme default background
                py: { xs: 8, md: 12 }, // Use theme spacing
                overflow: 'hidden' // Prevent animation overflows
            }}
        >
            {/* Hero Section */}
            <Container maxWidth="lg" ref={heroRef} sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center' }}
                >
                    <Typography
                        variant="h1" // Use theme H1
                        component="h1"
                        sx={{
                            mb: 4,
                            color: 'text.primary',
                            fontSize: { xs: '2.25rem', sm: '2.75rem', md: theme.typography.h1.fontSize } // Adjusted responsive font size
                        }}
                    >
                        Build AI-Powered Sales Funnels & <PrimaryText>Intelligent Onboarding That Convert</PrimaryText>
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '750px',
                            mx: 'auto',
                            mb: { xs: 4, md: 6 } // Adjusted bottom margin
                        }}
                    >
                        Stop losing leads and new customers. DotBridge empowers you to build AI experiences that <PrimaryText>engage, qualify, and onboard</PrimaryText> users automatically—24/7.
                    </Typography>

                    {/* Demo Section - Now correctly handles mobile video and desktop AgentConnector */}
                    <Box sx={{ mb: { xs: 4, sm: 6 }, mt: { xs: 2, sm: 0 } }}>
                        {isMobile ? (
                            <Box sx={{
                                maxWidth: '500px',
                                mx: 'auto',
                                textAlign: 'center',
                                mb: 4,
                                p: { xs: 1.5, sm: 2, md: 3 }, // Reduced padding for xs
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: theme.shape.borderRadius,
                                bgcolor: theme.palette.background.paper // Match card-like appearance
                            }}>
                                <Typography variant="h6" component="p" color="text.primary" sx={{ mb: 1.5 }}>
                                    Watch a Quick Overview
                                </Typography>
                                <Box sx={{
                                    backgroundColor: theme.palette.grey[300],
                                    borderRadius: theme.shape.borderRadius,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    paddingTop: '56.25%', // 16:9 Aspect Ratio
                                    mb: 1
                                }}>
                                    <video
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        controls
                                        poster="poster-services.jpg" // IMPORTANT: Replace with your video poster image URL
                                    >
                                        <source src="brdge-services-final.mp4" type="video/mp4" />
                                        Your browser does not support the video tag. Please update your browser.
                                    </video>
                                </Box>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, mb: 1.5 }}>
                                    (Explainer Video for Mobile)
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to={`/viewBridge/${DEMO_BRIDGE_ID}`}
                                    variant="outlined" // Differentiate from main CTA
                                    size="medium"
                                >
                                    Or Try the Interactive Demo
                                </Button>
                            </Box>
                        ) : (
                            // Desktop: Interactive AgentConnector in a themed card
                            <Card
                                variant="outlined"
                                sx={{
                                    maxWidth: { md: '1000px', lg: '1100px' },
                                    mx: 'auto',
                                    position: 'relative',
                                    aspectRatio: '16 / 9.5',
                                    minHeight: '500px',
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
                                <Box sx={{ position: 'absolute', top: 16, left: 24, zIndex: 1, background: 'rgba(0,0,0,0.5)', p: 0.5, borderRadius: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'white' }}>Live DotBridge Sales Funnel Demo</Typography>
                                </Box>
                                <div className="agent-connector-container">
                                    <AgentConnector
                                        brdgeId={DEMO_BRIDGE_ID} // Ensure this DEMO_BRIDGE_ID showcases a sales or onboarding funnel
                                        agentType="view"
                                        token=""
                                    />
                                </div>
                            </Card>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        sx={{ mb: { xs: 6, sm: 8, md: 10 } }}
                        onClick={() => {
                            document.getElementById('lead-form-section')?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}
                    >
                        Request a Personalized Demo
                    </Button>
                </motion.div>
            </Container>

            {/* Unlock Your Expertise Section */}
            <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Typography variant="h2" sx={{ color: 'text.primary', mb: 3 }}>
                            Stop Bottlenecks, <PrimaryText>Start Scaling with DotBridge.</PrimaryText>
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
                            Your expertise is invaluable, but manual sales calls, repetitive demos, and inconsistent onboarding slow you down. With DotBridge, you can <PrimaryText>automate qualification, deliver perfect product tours, and guide new users to success</PrimaryText>—effortlessly. Transform your process into an AI-driven machine that works for you, 24/7.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Divider sx={{ my: { xs: 6, md: 10 }, display: 'none' }} />

            {/* What We Deliver Section */}
            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 15 }, position: 'relative', zIndex: 1 }} ref={stepsRef}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{ color: 'text.primary', mb: 3 }}
                    >
                        Your Custom <PrimaryText>AI Growth Engine with DotBridge</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: 8 }}
                    >
                        Craft tailored DotBridge experiences to achieve your specific sales and customer success goals.
                    </Typography>

                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ maxWidth: '1100px', mx: 'auto' }}>
                        {[{
                            title: "AI Sales & Demo Funnels",
                            description: "Convert more leads by transforming your VSLs, webinars, or product demos into interactive DotBridge flows. The AI qualifies prospects, answers questions in real-time, and can seamlessly direct the most engaged leads to your sales team or booking system.",
                            icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
                        }, {
                            title: "Intelligent Onboarding Flows",
                            description: "Empower new users from day one. Build role-based, interactive onboarding paths with DotBridge that guide customers through setup, demonstrate key features, and proactively answer common questions, dramatically boosting activation and reducing support load.",
                            icon: <Groups sx={{ fontSize: 40, color: 'primary.main' }} />
                        }, {
                            title: "Interactive Content & Training",
                            description: "Enhance your funnels with engaging, AI-powered content. Create interactive product tutorials, value-packed lead magnets, or dynamic training modules with DotBridge to educate and build trust at scale.",
                            icon: <School sx={{ fontSize: 40, color: 'secondary.main' }} />
                        }].map((item, idx) => (
                            <Grid item xs={12} md={4} key={idx} sx={{ display: 'flex' }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        p: { xs: 2.5, md: 3.5 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                                    <Typography
                                        variant="h6"
                                        sx={{ color: 'text.primary', fontWeight: 600, mb: 1.5 }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: 'text.secondary', flexGrow: 1 }}
                                    >
                                        {item.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            <Divider sx={{ my: { xs: 6, md: 10 }, display: 'none' }} />

            {/* Our 5-Step Build Process Section */}
            <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{ color: 'text.primary', mb: 3 }}
                        >
                            Your 5-Step Journey to <PrimaryText>AI Automation with DotBridge</PrimaryText>
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: { xs: 4, md: 6 } }}
                        >
                            Streamlined for efficiency, designed for impact. DotBridge makes it easy to harness the power of AI.
                        </Typography>

                        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center" sx={{ my: { xs: 4, md: 6 } }}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    textAlign: 'center',
                                    maxWidth: '100%',
                                    mx: 'auto'
                                }}>
                                    <motion.img
                                        src="/dotbridge-hero1.jpg" // Consider an image more aligned with funnel/onboarding creation
                                        alt="DotBridge AI Ingestion Process for Funnels"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: theme.shape.borderRadius,
                                            boxShadow: theme.shadows[1]
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, delay: 0.4 }}
                                >
                                    <Typography variant="h4" component="h3" sx={{ color: 'text.primary', mb: 2, fontWeight: '600' }}>
                                        The DotBridge AI Engine:
                                        <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>Your Content, Intelligently Transformed</Box>
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                                        Our sophisticated AI ingestion takes your existing sales materials (VSLs, product docs) or onboarding guides. It performs deep semantic mapping to understand your customer journey, <PrimaryText>allowing you to automatically generate qualifying questions for sales funnels, identify key milestones for onboarding, and structure interactive dialogues.</PrimaryText> This intelligent foundation in DotBridge allows you to rapidly build a .bridge that doesn't just present information, but actively guides users to conversion or successful adoption.
                                    </Typography>
                                </motion.div>
                            </Grid>
                        </Grid>

                        <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: { xs: 4, md: 8 } }}>
                            <Grid container spacing={{ xs: 4, md: 3 }} justifyContent="center">
                                {SoftwareUsageSteps.map((feature, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={idx} sx={{ display: 'flex' }}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                p: 3,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                width: '100%'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                                                <Typography
                                                    variant="h1"
                                                    component="div"
                                                    sx={{
                                                        color: 'primary.main',
                                                        fontWeight: 'bold',
                                                        opacity: 0.2,
                                                        lineHeight: 0.8,
                                                        mr: 1.5
                                                    }}
                                                >
                                                    {`0${feature.step}`}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ color: 'text.primary', fontWeight: 600 }}
                                                >
                                                    {feature.title}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                sx={{ color: 'text.secondary', flexGrow: 1 }}
                                            >
                                                {feature.description} {/* Ensure DfyProcessSteps descriptions are also aligned if possible */}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            <Divider sx={{ my: { xs: 6, md: 10 }, display: 'none' }} />

            {/* Impact Our Clients See Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, mb: { xs: 8, md: 15 }, position: 'relative', zIndex: 1 }} ref={resultsRef}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center' }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{ color: 'text.primary', mb: 3 }}
                    >
                        Results You Can <PrimaryText>Achieve with DotBridge</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', mb: 8 }}
                    >
                        Transform your sales and onboarding by creating AI-driven experiences that deliver measurable outcomes.
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {impactMetrics /* Update impactMetrics data source with new values */.map((item, index) => (
                            <Grid item xs={6} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={resultsInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box sx={{ color: item.color || 'primary.main', mb: 1.5 }}>
                                            {React.cloneElement(item.icon, { sx: { fontSize: { xs: 32, md: 40 }, mb: 1.5 } })}
                                        </Box>
                                        <Typography
                                            variant={isMobile ? "h4" : "h3"}
                                            sx={{ fontWeight: 600, color: 'primary.main', mb: 1, lineHeight: 1.2 }}
                                        >
                                            {item.metric} {/* e.g., "+40% Sales", "2X Faster Onboarding" */}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {item.description} {/* e.g., "Increase in qualified leads", "Reduction in time-to-value" */}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            <Divider sx={{ my: { xs: 6, md: 10 }, display: 'none' }} />

            {/* Lead Form Section */}
            <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }} ref={formRef} id="lead-form-section">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={formInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{ color: 'text.primary', mb: 3 }}
                        >
                            Ready to <PrimaryText>Automate & Scale with DotBridge?</PrimaryText>
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', mb: 6 }}
                        >
                            Interested in leveraging DotBridge for advanced sales and onboarding funnels? Fill out the form to discuss your needs or request a personalized demo.
                        </Typography>

                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 4, md: 5 },
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: 'background.paper'
                            }}
                        >
                            {submitted ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                                        <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>
                                            Request Submitted!
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                            Thanks for your interest. We'll review your information and contact you via email within 1-2 business days to discuss your goals or schedule a demo.
                                        </Typography>
                                    </motion.div>
                                </Box>
                            ) : (
                                <form onSubmit={handleLeadSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                label="Your Name"
                                                name="name"
                                                value={lead.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                label="Your Email"
                                                name="email"
                                                type="email"
                                                required
                                                value={lead.email}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl component="fieldset" fullWidth>
                                                <FormLabel component="legend" sx={{ mb: 1, color: 'text.secondary' }}>
                                                    Do you have existing sales, onboarding, or training material to use with DotBridge?
                                                </FormLabel>
                                                <RadioGroup
                                                    name="hasExistingCourse"
                                                    value={lead.hasExistingCourse}
                                                    onChange={handleInputChange}
                                                    row
                                                    required
                                                >
                                                    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Yes" />
                                                    <FormControlLabel value="no" control={<Radio color="primary" />} label="No" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                label="Describe your desired sales/onboarding funnel & goals with DotBridge"
                                                name="courseTopic"
                                                value={lead.courseTopic}
                                                onChange={handleInputChange}
                                                multiline
                                                rows={3}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                fullWidth
                                                disabled={isSubmitting}
                                                sx={{ py: 1.5 }}
                                            >
                                                {isSubmitting ? (
                                                    <CircularProgress size={24} color="inherit" />
                                                ) : (
                                                    'Request Demo / Consultation'
                                                )}
                                            </Button>
                                        </Grid>
                                        {error && (
                                            <Grid item xs={12}>
                                                <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                                                    {error}
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </form>
                            )}
                        </Paper>
                    </motion.div>
                </Container>
            </Box>

            <Divider sx={{ my: { xs: 6, md: 10 }, display: 'none' }} />

            {/* Final CTA Section */}
            <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 8, md: 10 }, mb: { xs: 6, md: 10 } }}>
                <Typography
                    variant="h2"
                    sx={{ color: 'text.primary', mb: 3 }}
                >
                    Stop Selling Manually. <PrimaryText>Start Automating with AI.</PrimaryText>
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'text.secondary', mb: 5, maxWidth: '700px', mx: 'auto' }}
                >
                    Build your high-performance AI sales funnel or smart onboarding experience with DotBridge. Explore our features or request a demo to see how DotBridge can transform how you attract, convert, and retain customers.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{}}
                    onClick={() => {
                        document.getElementById('lead-form-section')?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }}
                >
                    Request a Demo
                </Button>
            </Container>

            {/* Powered by DotBridge Footer */}
            <Container maxWidth="lg" sx={{ textAlign: 'center', py: 3, mt: 5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Powered by DotBridge: the interface layer of the AI-native web.
                </Typography>
            </Container>

        </Box>
    );
};

export default ServicesPage;
