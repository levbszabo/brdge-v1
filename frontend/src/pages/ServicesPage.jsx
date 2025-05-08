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
const DfyProcessSteps = [
    {
        step: 1,
        title: "Strategy Call",
        description: "Map revenue or learning goals in 45 min."
    },
    {
        step: 2,
        title: "Content & Persona Modeling",
        description: "We script (or refine) and clone your voice + brand tone."
    },
    {
        step: 3,
        title: "AI Video Production",
        description: "DotBridge engine generates pro modules; you approve."
    },
    {
        step: 4,
        title: "Bridge Assembly",
        description: "We layer quizzes, CTAs, branching, and analytics—no code on your side."
    },
    {
        step: 5,
        title: "Launch & Training",
        description: "You get live links, source files, and a 30-minute hand-off. Go live the same day."
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
                    {/* Removed mobile background highlight */}

                    <Typography
                        variant="h1" // Use theme H1
                        component="h1"
                        sx={{ mb: 4, color: 'text.primary' }} // Changed mb to 4
                    >
                        Done-For-You AI <PrimaryText>Funnels, Courses & Training</PrimaryText>
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
                        We build the entire interactive flow—so your team sells, onboards, and teaches while you sleep.
                    </Typography>

                    {/* Demo Section - Simplified */}
                    <Box sx={{ mb: { xs: 4, sm: 6 }, mt: { xs: 2, sm: 0 } }}>
                        {isMobile ? (
                            // Mobile: Simple Video Placeholder Box
                            <Card
                                variant="outlined"
                                sx={{
                                    maxWidth: '500px',
                                    mx: 'auto',
                                    mb: 4,
                                    bgcolor: 'neutral.light', // Use light neutral bg
                                    p: 3,
                                    textAlign: 'center'
                                }}
                            >
                                <PlayArrow sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                                <Typography variant="body1" color="text.secondary">
                                    (Service Explainer Video)
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to={`/viewBridge/${DEMO_BRIDGE_ID}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="text"
                                    size="small"
                                    sx={{ mt: 2 }}
                                >
                                    See Live Demo
                                </Button>
                            </Card>
                        ) : (
                            // Desktop: Interactive AgentConnector in a themed card
                            <Card
                                variant="outlined"
                                sx={{
                                    maxWidth: { md: '1000px', lg: '1100px' },
                                    mx: 'auto',
                                    position: 'relative',
                                    aspectRatio: '16 / 9.5', // Adjust aspect ratio slightly
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
                                <div className="agent-connector-container">
                                    <AgentConnector
                                        brdgeId={DEMO_BRIDGE_ID}
                                        agentType="view"
                                        token=""
                                    />
                                </div>
                            </Card>
                        )}
                    </Box>

                    {/* CTA Button - Styled with theme */}
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
                        Apply for Done-For-You Service
                    </Button>
                </motion.div>
            </Container>

            {/* Unlock Your Expertise Section (Formerly Why This Matters) */}
            <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100', py: { xs: 8, md: 12 } }}>
                <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Typography variant="h2" sx={{ color: 'text.primary', mb: 3 }}>
                            Your Knowledge, <PrimaryText>AI-Powered & Always On.</PrimaryText>
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
                            Your team's knowledge is your greatest asset, but packaging it into compelling funnels, courses, or onboarding experiences is a major bottleneck. Filming, editing, and complex integrations devour time and resources. DotBridge's DFY service is your dedicated AI production crew, transforming your expertise into dynamic video journeys that captivate users, provide instant answers, and drive results—24/7.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Divider sx={{ my: { xs: 6, md: 10 }, display: 'none' }} />

            {/* What We Deliver Section (Replaces old Service Steps Title/Intro) */}
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
                        What We <PrimaryText>Deliver</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: 8 }}
                    >
                        Your knowledge transformed into powerful AI-driven experiences that achieve your business goals.
                    </Typography>

                    {/* Grid for Deliverables */}
                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ maxWidth: '1100px', mx: 'auto' }}>
                        {[{
                            title: "AI Sales Funnel",
                            description: "VSL → Webinar → Product Demo, stitched into a single .bridge flow that chats back and books calls.",
                            icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
                        }, {
                            title: "Interactive Course",
                            description: "Voice-cloned lessons, auto-generated quizzes, and real-time Q&A that boost completion 65%.",
                            icon: <School sx={{ fontSize: 40, color: 'primary.main' }} /> // Re-add School icon if not imported
                        }, {
                            title: "Smart Onboarding",
                            description: "Role-based paths and AI assistants that cut support tickets 40%.",
                            icon: <Groups sx={{ fontSize: 40, color: 'primary.main' }} />
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
                            Our 5-Step <PrimaryText>"Hands-Off" Build Process</PrimaryText>
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: { xs: 4, md: 6 } }}
                        >
                            Streamlined for efficiency, designed for impact. We handle the complexity so you can focus on your expertise.
                        </Typography>

                        {/* AI Ingestion Diagram and Description - Two Column Layout */}
                        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center" sx={{ my: { xs: 4, md: 6 } }}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    textAlign: 'center',
                                    maxWidth: '100%', // Image will take full width of this grid item
                                    mx: 'auto'
                                }}>
                                    <motion.img
                                        src="/dotbridge-hero1.jpg"
                                        alt="DotBridge AI Ingestion Process"
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
                                        <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>From Video to Interactive Experience</Box>
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                                        Our sophisticated AI ingestion takes your raw video and instantly gets to work. It performs semantic mapping to understand your content deeply, automatically generating initial questions, identifying key topics, and preparing your material for voice cloning (if chosen) and persona alignment. This intelligent foundation allows us to rapidly build a .bridge that doesn't just play video, but interacts, teaches, and converts.
                                    </Typography>
                                </motion.div>
                            </Grid>
                        </Grid>

                        {/* Use Grid for steps layout - This is the existing 5 steps */}
                        <Box sx={{ maxWidth: '1000px', mx: 'auto', mt: { xs: 4, md: 8 } }}> {/* Added margin top here */}
                            <Grid container spacing={{ xs: 4, md: 3 }} justifyContent="center">
                                {DfyProcessSteps.map((feature, idx) => (
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
                                                {feature.description}
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

            {/* Impact Our Clients See Section (Previously Results Section) */}
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
                        Impact Our <PrimaryText>Clients See</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', mb: 8 }}
                    >
                        Transforming how businesses engage, educate, and sell with AI-driven interactive experiences.
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {impactMetrics.map((item, index) => (
                            <Grid item xs={6} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={resultsInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box sx={{ color: item.color, mb: 1.5 }}>
                                            {React.cloneElement(item.icon, { sx: { fontSize: { xs: 32, md: 40 }, mb: 1.5 } })}
                                        </Box>
                                        <Typography
                                            variant={isMobile ? "h4" : "h3"}
                                            sx={{ fontWeight: 600, color: 'primary.main', mb: 1, lineHeight: 1.2 }}
                                        >
                                            {item.metric}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            {item.description}
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
                            Limited <PrimaryText>Build Slots Open</PrimaryText>
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', mb: 6 }}
                        >
                            We take on a handful of DFY projects each quarter to keep quality white-glove. Tell us about your funnel, course, or onboarding plan—let's see if it's a fit.
                        </Typography>

                        {/* Use standard Paper/Box for form container, styled with theme */}
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
                                            Application Received!
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                            Thanks for your interest. We'll review your application and contact you via email within 1-2 business days.
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
                                                    Do you have an existing course or content?
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
                                                label="Tell us about your project (funnel, course, or onboarding plan)"
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
                                                    'Apply for a Done-For-You Build'
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

            {/* Final CTA Section - Simplified */}
            <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 8, md: 10 }, mb: { xs: 6, md: 10 } }}>
                <Typography
                    variant="h2"
                    sx={{ color: 'text.primary', mb: 3 }}
                >
                    Ready to Build Your <PrimaryText>AI-Powered Journey</PrimaryText>?
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'text.secondary', mb: 5, maxWidth: '700px', mx: 'auto' }}
                >
                    Let us handle the heavy lifting. Apply now to transform your knowledge into an engaging, interactive experience that drives results.
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
                    Apply for a Done-For-You Build
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
