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
import JourneyStep from '../components/JourneyStep';
import { api } from '../api';
import Footer from '../components/Footer';

// Buyer Journey Steps Data
const journeyStepsData = [
    { id: 'awareness', title: 'Awareness Bridge', subtitle: 'Capture attention with an engaging, short-form explainer', videoUrl: '#awareness_video', alignment: 'left' },
    { id: 'discovery', title: 'Discovery Bridge', subtitle: 'Qualify the lead and gather requirements', videoUrl: '#discovery_video', alignment: 'right' },
    { id: 'demo', title: 'Demo Bridge', subtitle: 'Tailored walkthrough of DotBridge based on Discovery answers', videoUrl: '#demo_video', alignment: 'left' },
    { id: 'sales', title: 'Sales Bridge', subtitle: 'Answer objections, show pricing, and close', videoUrl: '#sales_video', alignment: 'right' },
    { id: 'onboarding', title: 'Onboarding Bridge', subtitle: 'Help new users get set up', videoUrl: '#onboarding_video', alignment: 'left' },
    { id: 'success', title: 'Customer Success', subtitle: 'Post-purchase support and upsell', videoUrl: '#success_video', alignment: 'right', isLast: true },
];

// Renamed and updated for "Impact Our Clients See"
const impactMetrics = [
    {
        metric: "+42%",
        description: "Lead-to-SQL Conversion",
        icon: <RateReview sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "3.5x",
        description: "Pipeline Generated Per Rep",
        icon: <TouchApp sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "-38%",
        description: "Sales Cycle Duration",
        icon: <AccessTime sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
    },
    {
        metric: "$2.6M",
        description: "ARR Influenced",
        icon: <QueryStats sx={{ fontSize: 36, mb: 1.5 }} />,
        color: "primary.main"
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
                overflow: 'hidden' // Prevent animation overflows
            }}
        >
            {/* Hero Section */}
            <Container maxWidth="lg" ref={heroRef} sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 12 } }}>
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
                        <PrimaryText>Your Videos Should Be Closing Deals, Not Just Getting Views.</PrimaryText>
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '750px',
                            mx: 'auto',
                            mb: { xs: 4, md: 6 },
                            lineHeight: 1.7,
                            '& .highlight': {
                                position: 'relative',
                                color: 'primary.main',
                                fontWeight: 500,
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'rgba(0, 122, 255, 0.15)',
                                    borderRadius: '4px',
                                    transform: 'translateY(2px)',
                                    zIndex: -1
                                }
                            }
                        }}
                    >
                        Tired of sales videos that just sit there? DotBridge transforms your passive content into <span className="highlight">AI-powered agents that engage, qualify, and close deals 24/7</span>, turning views into revenue automatically.
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
                                        poster="dotbridge-hero-cover.jpg" // IMPORTANT: Replace with your video poster image URL
                                    >
                                        <source src="dotbridge-hero-small.mp4" type="video/mp4" />
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

                    {/* Buyer Journey Visualization Section */}
                    <Box sx={{ mt: 10, mb: 8 }}>
                        <Typography
                            variant="h3"
                            align="center"
                            sx={{
                                mb: { xs: 2, md: 3 },
                                color: 'text.primary'
                            }}
                        >
                            From Prospect to <PrimaryText>Paying Customer, Automatically</PrimaryText>
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '850px',
                                mx: 'auto',
                                mb: { xs: 6, md: 8 }
                            }}
                        >
                            Stop losing prospects at each step. DotBridge creates a seamless journey where your videos don't just inform—they actively qualify, demo, handle objections, and drive conversions, 24/7.
                        </Typography>

                        {/* Main content Grid for side text and journey diagram */}
                        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                            {/* Left Side Content - Hidden on xs, visible md and up */}
                            <Grid item md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Box sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius, mt: 4 }}>
                                    <Typography variant="h6" gutterBottom>Start Here</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Your prospect's journey begins with awareness. DotBridge captures attention and qualifies in real-time.
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Journey Steps Section - Central Column */}
                            <Grid item xs={12} md={8} lg={7}>
                                <Box sx={{ position: 'relative', maxWidth: '680px', margin: 'auto' }}>
                                    {journeyStepsData.map((step) => (
                                        <Box key={step.id} sx={{ mb: 5 }}>
                                            <JourneyStep
                                                title={step.title}
                                                subtitle={step.subtitle}
                                                videoUrl={step.videoUrl}
                                                alignment={step.alignment}
                                                isLast={step.isLast}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Right Side Content - Adjusted for bottom alignment */}
                            <Grid item md={2} sx={{
                                display: { xs: 'none', md: 'flex' },
                                flexDirection: 'column',
                                justifyContent: 'flex-end'
                            }}>
                                <Box sx={{
                                    p: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: theme.shape.borderRadius,
                                    mb: 5 // Match last step's bottom margin for alignment
                                }}>
                                    <Typography variant="h6" gutterBottom>Revenue Growth</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        The journey culminates in closed deals and satisfied customers. DotBridge extracts valuable insights that feed directly into your sales flywheel.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
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
                        Get Your Custom AI Sales Engine
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
                            Your Best Sales Rep Can't Be Everywhere. <PrimaryText>Your Bridge Can.</PrimaryText>
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
                            Even your top talent has limits. DotBridge empowers you to <PrimaryText>clone your best sales conversations into AI agents that work tirelessly</PrimaryText>, delivering perfect, personalized interactions every time. Scale your reach, not your payroll.
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
                        Build Your <PrimaryText>Automated Sales & Onboarding Machine</PrimaryText>
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: 8 }}
                    >
                        Leverage DotBridge to create AI-driven experiences that address your specific sales bottlenecks and customer success challenges, turning potential into profit.
                    </Typography>

                    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" sx={{ maxWidth: '1100px', mx: 'auto' }}>
                        {[
                            {
                                title: "AI Sales & Demo Funnels",
                                description: "Slash sales cycles and boost pipeline quality. DotBridge transforms static demos and VSLs into interactive AI experiences that qualify leads 24/7, answer complex questions, and route high-intent prospects directly to your sales team's calendar.",
                                icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)'
                            }, {
                                title: "Intelligent Onboarding Flows",
                                description: "Maximize customer lifetime value and reduce churn. DotBridge automates personalized onboarding, guiding new clients to success with your product faster. Free up your CSMs from repetitive questions and cut support overheads.",
                                icon: <Groups sx={{ fontSize: 40, color: 'primary.main' }} />,
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)'
                            }, {
                                title: "Dynamic Lead Gen & Nurturing",
                                description: "Supercharge your content ROI. Turn ebooks, webinars, and case studies into interactive lead magnets that don't just capture emails, but actively qualify, educate, and nurture prospects down the funnel, delivering sales-ready leads.",
                                icon: <QueryStats sx={{ fontSize: 40, color: 'primary.main' }} />,
                                gradient: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0) 60%)'
                            }
                        ].map((item, idx) => (
                            <Grid item xs={12} md={4} key={idx} sx={{ display: 'flex' }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        p: { xs: 2.5, md: 3.5 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        textAlign: 'center',
                                        backgroundImage: item.gradient,
                                        backgroundPosition: 'top right',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '70% 70%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-6px)',
                                            boxShadow: theme.shadows[2],
                                            '& .icon-wrapper': {
                                                transform: 'scale(1.1)',
                                            }
                                        }
                                    }}
                                >
                                    <Box
                                        className="icon-wrapper"
                                        sx={{
                                            mb: 2,
                                            transition: 'transform 0.3s ease',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 600,
                                            mb: 1.5,
                                            fontSize: { xs: '1.1rem', md: '1.25rem' }
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            flexGrow: 1,
                                            lineHeight: 1.6
                                        }}
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
                            Ready to Stop Losing Leads and <PrimaryText>Start Closing More Deals?</PrimaryText>
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{ color: 'text.secondary', maxWidth: '700px', mx: 'auto', mb: 6 }}
                        >
                            Fill out the form to discover how DotBridge can automate your sales and onboarding, or request a personalized demo to see it in action. Let's turn your video views into valuable conversions.
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
                    Don't Let Another Lead Slip Away. <PrimaryText>Automate Your Conversions Now.</PrimaryText>
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ color: 'text.secondary', mb: 5, maxWidth: '700px', mx: 'auto' }}
                >
                    Your prospects demand a better experience. DotBridge delivers it: personalized, interactive, 24/7, and ready to turn interest into action. Stop leaving money on the table.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ px: 4, py: 1.2 }}
                    onClick={() => {
                        document.getElementById('lead-form-section')?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }}
                >
                    Get Started Today
                </Button>
            </Container>

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
                pointerEvents: 'none'
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
                pointerEvents: 'none'
            }} />

        </Box>
    );
};

export default ServicesPage;
