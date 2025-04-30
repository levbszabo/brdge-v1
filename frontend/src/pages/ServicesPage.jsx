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
    Select,
    MenuItem,
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
    Timeline,
    TouchApp,
    Equalizer,
    PeopleAlt,
    CheckCircle,
    PlayArrow,
    RocketLaunch,
    School,
    AccessTime,
    SupportAgent,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import AgentConnector from '../components/AgentConnector';
import { api } from '../api';

// Use theme colors for result metrics
const resultMetrics = [
    {
        metric: "+65%",
        description: "Course Completion Rate",
        icon: <School sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "3x",
        description: "Student Engagement",
        icon: <TouchApp sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "15+ Hrs",
        description: "Saved Weekly Per Instructor",
        icon: <AccessTime sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "-40%",
        description: "Support Requests",
        icon: <SupportAgent sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    }
];

// Service features array - Keep content, styling will be applied inline
const serviceFeatures = [
    {
        step: 1,
        title: "Strategy & Planning Call",
        description: "1-on-1 call to map your course structure, modules, and core learning objectives."
    },
    {
        step: 2,
        title: "Content Scripting & AI Prep",
        description: "We refine your scripts (or create them) and prepare materials for AI voice cloning and video generation."
    },
    {
        step: 3,
        title: "AI Video Production & Review",
        description: "Our system generates professional video modules. You review and provide feedback."
    },
    {
        step: 4,
        title: "Bridge Setup & Interaction Design",
        description: "We upload videos to the .bridge platform, configure the AI agent, and add interactive elements."
    },
    {
        step: 5,
        title: "Launch, Delivery & Training",
        description: "Receive your interactive course links, source files, and training on managing your new AI assets."
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
                        sx={{ mb: 3, color: 'text.primary' }} // Use theme text color
                    >
                        Let AI Build Your <PrimaryText>Next Course</PrimaryText>
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '750px',
                            mx: 'auto',
                            mb: 6
                        }}
                    >
                        Focus on your expertise, we'll handle the course creation. Our service turns your content into engaging, interactive AI-powered video courses hosted on the .bridge platform.
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

            {/* Removed ScholarlyDivider */}
            <Divider sx={{ my: { xs: 6, md: 10 }, maxWidth: 'md', mx: 'auto' }} />

            {/* Service Steps Section */}
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
                        How It Works: <PrimaryText>AI Course Creation</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: 8 }}
                    >
                        Our streamlined process takes your expertise and transforms it into a ready-to-launch interactive course.
                    </Typography>

                    {/* Use Grid for steps layout */}
                    <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
                        <Grid container spacing={{ xs: 4, md: 3 }} justifyContent="center">
                            {serviceFeatures.map((feature, idx) => (
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
                                        {/* Step Number */}
                                        <Typography
                                            variant="h1"
                                            component="div"
                                            sx={{
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                opacity: 0.2,
                                                lineHeight: 0.8,
                                                mb: 1
                                            }}
                                        >
                                            {`0${feature.step}`}
                                        </Typography>
                                        {/* Title */}
                                        <Typography
                                            variant="h6"
                                            sx={{ color: 'text.primary', fontWeight: 600, mb: 1.5 }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        {/* Description */}
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

            {/* Removed ScholarlyDivider */}
            <Divider sx={{ my: { xs: 6, md: 10 }, maxWidth: 'md', mx: 'auto' }} />

            {/* Results Section - Simplified */}
            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 15 }, position: 'relative', zIndex: 1 }} ref={resultsRef}>
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
                        Expected <PrimaryText>Outcomes</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', mb: 8 }}
                    >
                        Leverage AI to save time, boost engagement, and improve learning results.
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {resultMetrics.map((item, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={resultsInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                >
                                    {/* Simplified Metric Display - No Card */}
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box sx={{ color: item.color, mb: 1.5 }}>
                                            {item.icon}
                                        </Box>
                                        <Typography
                                            variant="h3" // Larger metric
                                            sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}
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

            {/* Removed ScholarlyDivider */}
            <Divider sx={{ my: { xs: 6, md: 10 }, maxWidth: 'md', mx: 'auto' }} />

            {/* Lead Form Section */}
            <Container maxWidth="sm" sx={{ mb: { xs: 8, md: 15 }, position: 'relative', zIndex: 1 }} ref={formRef} id="lead-form-section">
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
                        Apply for <PrimaryText>Done-For-You</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', mb: 6 }}
                    >
                        Limited spots available. Let us know about your project to see if it's a fit.
                    </Typography>

                    {/* Use standard Paper/Box for form container, styled with theme */}
                    <Paper
                        elevation={0} // Use border instead of elevation
                        sx={{
                            p: { xs: 3, sm: 4, md: 5 },
                            borderRadius: theme.shape.borderRadius,
                            border: `1px solid ${theme.palette.divider}`,
                            bgcolor: 'background.paper' // Ensure paper background
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
                                <Grid container spacing={3}> {/* Use Grid for form layout */}
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined" // Use theme default
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
                                            <FormLabel component="legend" sx={{ mb: 1, color: 'text.primary' }}> {/* Simpler label */}
                                                Do you have an existing course or content?
                                            </FormLabel>
                                            <RadioGroup
                                                name="hasExistingCourse"
                                                value={lead.hasExistingCourse}
                                                onChange={handleInputChange}
                                                row
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
                                            label="What is your course topic or area of expertise?"
                                            name="courseTopic"
                                            value={lead.courseTopic}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary" // Consistent primary button
                                            size="large" // Larger button
                                            fullWidth
                                            disabled={isSubmitting}
                                            sx={{ py: 1.5 }} // Theme padding
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                'Submit Application'
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

            {/* Removed ScholarlyDivider */}
            <Divider sx={{ my: { xs: 6, md: 10 }, maxWidth: 'md', mx: 'auto' }} />

            {/* Final CTA Section - Simplified */}
            <Container maxWidth="md" sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
                <Typography
                    variant="h2"
                    sx={{ color: 'text.primary', mb: 3 }}
                >
                    Ready to Build Your <PrimaryText>AI Course</PrimaryText>?
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'text.secondary', mb: 5, maxWidth: '700px', mx: 'auto' }}
                >
                    Let us handle the heavy lifting. Apply now to transform your content into an engaging, interactive learning experience.
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
                    Apply for Done-For-You Service
                </Button>
            </Container>
        </Box>
    );
};

export default ServicesPage;
