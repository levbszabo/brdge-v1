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
import { styled } from '@mui/material/styles';
import {
    Timeline,
    TouchApp,
    Equalizer,
    PeopleAlt,
    CheckCircle,
    PlayArrow,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { useNavigate, Link } from 'react-router-dom';
import AgentConnector from '../components/AgentConnector';
import { createParchmentContainerStyles } from '../theme';
import { api } from '../api';

// Scholarly divider for section separation
const ScholarlyDivider = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '40px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '40px 0',
    '&::before, &::after': {
        content: '""',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}80, transparent)`,
        flexGrow: 1,
    },
    '&::before': {
        marginRight: '20px',
    },
    '&::after': {
        marginLeft: '20px',
    }
}));

// Number bubble for process steps with sepia styling
const NumberBubble = styled(Box)(({ theme }) => ({
    width: { xs: '60px', sm: '70px' },
    height: { xs: '60px', sm: '70px' },
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.palette.sepia.light}, ${theme.palette.sepia.main})`,
    color: theme.palette.parchment.light,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: { xs: '1.6rem', sm: '1.8rem' },
    margin: '0 auto',
    boxShadow: `0 4px 15px ${theme.palette.sepia.main}30`,
    position: 'relative',
    transition: 'all 0.3s ease',
    border: `3px solid ${theme.palette.parchment.main}`,
    lineHeight: 1,
    padding: 0,
    aspectRatio: '1/1',
    '& span': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        textAlign: 'center',
    },
    '&:hover': {
        transform: 'scale(1.05) rotate(3deg)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: `2px solid ${theme.palette.sepia.main}30`,
        animation: 'pulse 3s infinite',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '120%',
        height: '120%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.sepia.main}20 0%, transparent 70%)`,
        animation: 'rotate 8s linear infinite',
    }
}));

// Sepia Gradient Text
const SepiaText = styled('span')(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.sepia.main}, ${theme.palette.sepia.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    fontFamily: theme.typography.headingFontFamily,
}));

// Neo-Scholar styled card
const ScholarlyCard = styled(Card)(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.parchment.main,
    position: 'relative',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.sepia.main}40`,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${theme.palette.sepia.main}60`,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${theme.textures.darkParchment})`,
        backgroundSize: 'cover',
        opacity: 0.15,
        mixBlendMode: 'multiply',
        zIndex: 0,
    },
    '& > *': {
        position: 'relative',
        zIndex: 1,
    }
}));

// Results Metric Card with parchment styling
const MetricCard = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.parchment.main,
    position: 'relative',
    borderRadius: '12px',
    padding: { xs: '24px 16px', sm: '32px 24px' },
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${theme.palette.sepia.main}40`,
    overflow: 'hidden',
    '&:hover': {
        transform: { xs: 'translateY(-5px)', sm: 'translateY(-10px)' },
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${theme.palette.sepia.main}70`,
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${theme.textures.darkParchment})`,
        backgroundSize: 'cover',
        opacity: 0.15,
        mixBlendMode: 'multiply',
        zIndex: 0,
    },
    '& > *': {
        position: 'relative',
        zIndex: 1,
    }
}));

// Lead Form Container with parchment styling
const LeadFormContainer = styled(Paper)(({ theme }) => ({
    ...createParchmentContainerStyles(theme),
    padding: { xs: '25px 15px', sm: '35px', md: '40px' },
    maxWidth: { xs: '100%', sm: '600px' },
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}, transparent)`,
    }
}));

// Process Step Card
const ProcessCard = styled(Box)(({ theme }) => ({
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
    }
}));

// Results and metrics with updated colors
const resultMetrics = [
    {
        metric: "65%",
        description: "Increase in course completion rates",
        icon: <Timeline sx={{ fontSize: 34, mb: 1 }} />,
        color: "#9C7C38" // sepia
    },
    {
        metric: "3x",
        description: "More student questions answered",
        icon: <TouchApp sx={{ fontSize: 34, mb: 1 }} />,
        color: "#B89F63" // sepiaLight
    },
    {
        metric: "15+",
        description: "Hours saved weekly per instructor",
        icon: <Equalizer sx={{ fontSize: 34, mb: 1 }} />,
        color: "#9C7C38" // sepia
    },
    {
        metric: "40%",
        description: "Reduction in support requests",
        icon: <PeopleAlt sx={{ fontSize: 34, mb: 1 }} />,
        color: "#B89F63" // sepiaLight
    }
];

// Process steps
const processSteps = [
    {
        step: 1,
        title: "Discovery & Content Review",
        description: "We analyze your course materials, teaching style, and objectives to create a perfect AI representation."
    },
    {
        step: 2,
        title: "Custom AI Development",
        description: "We create an AI assistant with your unique voice and expertise, matching your teaching style."
    },
    {
        step: 3,
        title: "Integration & Testing",
        description: "We integrate and rigorously test the AI with real student queries to ensure accurate responses."
    },
    {
        step: 4,
        title: "Launch & Optimization",
        description: "Your AI assistant goes live with ongoing performance enhancements and content updates."
    }
];

// Service features array
const serviceFeatures = [
    {
        step: 1,
        title: "Strategy & Planning Call",
        description: "1-on-1 call to determine your course offering, modules and layout a complete course sketch"
    },
    {
        step: 2,
        title: "Content Creation & Editing",
        description: "We generate slide materials, create AI voiceovers, and edit everything into professional video content"
    },
    {
        step: 3,
        title: "AI Platform Implementation",
        description: "Upload to Brdge platform with AI teaching assistants for each module, making videos interactive"
    },
    {
        step: 4,
        title: "Delivery & Analytics Access",
        description: "Receive all video/content materials and access to Brdge AI course modules with analytics dashboard"
    },
    {
        step: 5,
        title: "Ongoing Expert Support",
        description: "We help with any support issues going forward, ensuring your course continues to perform optimally"
    }
];

// HARDCODED BRIDGE ID FOR DEMO
const DEMO_BRIDGE_ID = '344'; // Demo Bridge ID from https://brdge-ai.com/viewBridge/344-96eac2

const ServicesPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mainRef, mainInView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });
    const [processRef, processInView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });
    const [resultsRef, resultsInView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });
    const [servicesRef, servicesInView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });
    const [formRef, formInView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

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
                // Clear form
                setLead({
                    name: '',
                    email: '',
                    hasExistingCourse: '',
                    courseTopic: ''
                });
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

    // Create parchment container styles from theme
    const parchmentContainerStyles = createParchmentContainerStyles(theme);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: theme.palette.parchment.light,
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 4, md: 6 },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    backgroundImage: `url(${theme.textures.darkParchment})`,
                    backgroundSize: 'cover',
                    opacity: 0.15,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                    zIndex: 0,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    backgroundImage: `
                        radial-gradient(circle at 20% 15%, ${theme.palette.sepia.main}15 0%, transparent 40%),
                        radial-gradient(circle at 80% 85%, ${theme.palette.sepia.light}15 0%, transparent 40%)
                    `,
                    pointerEvents: 'none',
                    zIndex: 0,
                },
            }}
        >
            {/* Hero Section */}
            <Container
                maxWidth="lg"
                ref={mainRef}
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    px: { xs: 1.5, sm: 3 }, // Reduce horizontal padding on mobile for more space
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={mainInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center' }}
                >
                    {/* Add a subtle mobile-only background highlight */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '10%',
                            left: '0%',
                            width: '100%',
                            height: '60%',
                            background: `radial-gradient(ellipse at center, ${theme.palette.sepia.main}10 0%, transparent 80%)`,
                            display: { xs: 'block', sm: 'none' },
                            zIndex: -1,
                        }}
                    />

                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontFamily: theme.typography.headingFontFamily,
                            fontWeight: 700,
                            fontSize: { xs: '2.1rem', sm: '2.2rem', md: '3rem' }, // Slightly larger on mobile
                            color: theme.palette.ink,
                            mb: { xs: 1.5, md: 2.5 }, // Less space below title on mobile
                            lineHeight: 1.15,
                            px: { xs: 0.5, md: 0 }, // Less side padding on mobile
                            maxWidth: { xs: '100%', sm: '95%' }, // Wider on smallest screens
                            mx: 'auto',
                            textAlign: 'center',
                            mt: { xs: 1, sm: 0 }, // Small top margin on mobile
                            // Add subtle text shadow on mobile only
                            textShadow: { xs: '0 1px 1px rgba(0,0,0,0.1)', sm: 'none' },
                        }}
                    >
                        Let AI Build Your Course
                    </Typography>

                    <Typography
                        component="div"
                        sx={{
                            fontFamily: theme.typography.headingFontFamily,
                            fontSize: { xs: '1.8rem', sm: '2rem', md: '2.8rem' }, // Slightly larger on mobile
                            mb: { xs: 2.5, md: 2.5 }, // Consistent spacing
                            textAlign: 'center',
                            lineHeight: 1.1,
                        }}
                    >
                        <SepiaText
                            sx={{
                                fontWeight: 600,
                                position: 'relative',
                                // Enhanced underline effect for mobile
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-6px',
                                    left: '5%',
                                    width: '90%',
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}, transparent)`,
                                    opacity: { xs: 0.8, sm: 0.6 }, // More visible on mobile
                                    boxShadow: { xs: '0 1px 3px rgba(156, 124, 56, 0.2)', sm: 'none' }, // Subtle glow on mobile
                                }
                            }}
                        >
                            While You Sleep
                        </SepiaText>
                    </Typography>

                    {/* Update the demo container for better mobile presentation */}
                    <Box sx={{ mb: { xs: 4, sm: 3.5 }, mt: { xs: 2, sm: 0 } }}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: theme.palette.text.primary,
                                maxWidth: '700px',
                                mx: 'auto',
                                mb: { xs: 1.5, sm: 1.5 },
                                fontSize: { xs: '0.95rem', md: '1.1rem' },
                                fontWeight: 500,
                            }}
                        >
                            👇 <SepiaText>Try it yourself</SepiaText> - This is what your students will experience 👇
                        </Typography>

                        <Box
                            sx={{
                                ...parchmentContainerStyles,
                                width: '100%',
                                height: { xs: '240px', sm: '320px', md: '400px' }, // Slightly shorter on mobile
                                maxWidth: { xs: '98%', sm: '90%', md: '900px' }, // Wider on mobile
                                mx: 'auto',
                                borderRadius: { xs: '10px', sm: '8px' }, // Slightly more rounded on mobile
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: {
                                    xs: '0 10px 25px rgba(0, 0, 0, 0.15), 0 0 15px rgba(156, 124, 56, 0.1)',
                                    sm: '0 15px 35px rgba(0, 0, 0, 0.18), 0 0 20px rgba(156, 124, 56, 0.15)'
                                }, // Softer shadow on mobile
                                border: `1px solid ${theme.palette.sepia.main}40`,
                                mb: 1.5,
                                transform: { xs: 'translateY(0)', sm: 'translateY(0)' }, // Prepare for hover effect on mobile
                                transition: 'transform 0.3s ease',
                                '&:active': { // Add touch feedback for mobile
                                    xs: { transform: 'translateY(2px)' },
                                    sm: {}
                                },
                                // Keep other styling...
                            }}
                        >
                            <AgentConnector
                                brdgeId={DEMO_BRIDGE_ID}
                                agentType="view"
                                token=""
                            />
                        </Box>

                        <Typography
                            variant="body2"
                            align="center"
                            sx={{
                                color: theme.palette.text.secondary,
                                maxWidth: '700px',
                                mx: 'auto',
                                fontSize: '0.85rem',
                                mt: { xs: 1.5, sm: 1 }, // More space on mobile
                            }}
                        >
                            Interactive demo: Ask questions and experience AI-powered learning
                        </Typography>
                    </Box>

                    {/* Enhanced CTA button for mobile */}
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            py: { xs: 1.4, sm: 1.5, md: 1.8 },
                            px: { xs: 3, sm: 4, md: 5 },
                            mt: { xs: 2.5, sm: 2 }, // More space above on mobile
                            borderRadius: '8px',
                            fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' },
                            fontWeight: 600,
                            mb: { xs: 4, sm: 6, md: 8 },
                            width: { xs: '100%', sm: 'auto' },
                            maxWidth: { xs: '300px', sm: 'none' }, // Slightly wider on mobile
                            mx: { xs: 'auto', sm: 0 },
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: { xs: '0 4px 12px rgba(0, 0, 0, 0.2)', sm: '0 4px 10px rgba(0, 0, 0, 0.15)' }, // Stronger shadow on mobile
                            // Subtle push effect on mobile
                            '&:active': {
                                transform: { xs: 'translateY(2px)', sm: 'none' },
                                boxShadow: { xs: '0 2px 6px rgba(0, 0, 0, 0.2)', sm: 'inherit' },
                            },
                            // Keep other styling...
                        }}
                        onClick={() => {
                            document.getElementById('lead-form-section').scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}
                    >
                        Apply Now – Let AI Build Your Course
                    </Button>
                </motion.div>
            </Container>

            <ScholarlyDivider>
                <Box
                    component="img"
                    src={theme.textures.stampLogo}
                    alt="Decorative stamp"
                    sx={{
                        width: '40px',
                        height: '40px',
                        opacity: 0.7
                    }}
                />
            </ScholarlyDivider>

            {/* Service Section */}
            <Container maxWidth="lg" sx={{ mb: 15, position: 'relative', zIndex: 1 }} ref={servicesRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontFamily: theme.typography.headingFontFamily,
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                        }}
                    >
                        Done-For-You <SepiaText>AI Course Creation</SepiaText>
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            color: theme.palette.text.primary,
                            maxWidth: '800px',
                            mx: 'auto',
                            mb: 6,
                            textAlign: 'center',
                            fontSize: { xs: '1.1rem', md: '1.3rem' },
                            lineHeight: 1.6,
                        }}
                    >
                        Let us build your entire course from the ground up using AI technology. We handle everything from content creation to platform setup and launch, while you maintain full creative control.
                    </Typography>

                    <Box
                        sx={{
                            ...parchmentContainerStyles,
                            maxWidth: '1000px',
                            mx: 'auto',
                            p: { xs: 2, sm: 3, md: 6 },
                            borderRadius: { xs: '15px', md: '20px' },
                            mb: 8,
                            position: 'relative',
                            overflow: 'hidden',
                            border: `1px solid ${theme.palette.sepia.main}30`,
                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${theme.textures.darkParchment})`,
                                backgroundSize: 'cover',
                                opacity: 0.1,
                                mixBlendMode: 'multiply',
                                zIndex: 0,
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}80, transparent)`,
                            },
                            '& > *': {
                                position: 'relative',
                                zIndex: 1,
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                fontWeight: 600,
                                mb: 5,
                                color: theme.palette.sepia.main,
                                fontSize: { xs: '1.3rem', md: '1.5rem' },
                                position: 'relative',
                                display: 'inline-block',
                                mx: 'auto',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '80px',
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}, transparent)`,
                                }
                            }}
                        >
                            From Zero to Complete AI Course in 5 Steps
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: { xs: '20px', md: '26px' },
                                width: '2px',
                                background: `linear-gradient(to bottom, ${theme.palette.sepia.light}, ${theme.palette.sepia.main}50, ${theme.palette.sepia.main})`,
                                zIndex: 0,
                                display: { xs: 'block', md: 'block' }
                            }
                        }}>
                            {serviceFeatures.map((feature, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: 'flex',
                                        mb: { xs: 4, md: 5 },
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: { xs: 'none', md: 'translateX(8px)' },
                                        },
                                        px: { xs: 1, md: 0 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: '40px', md: '54px' },
                                            height: { xs: '40px', md: '54px' },
                                            borderRadius: '50%',
                                            background: idx % 2 === 0
                                                ? `linear-gradient(135deg, ${theme.palette.sepia.light}, ${theme.palette.sepia.main})`
                                                : `linear-gradient(135deg, ${theme.palette.sepia.main}, ${theme.palette.sepia.light})`,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: theme.palette.parchment.light,
                                            fontWeight: 700,
                                            fontSize: { xs: '1.2rem', md: '1.4rem' },
                                            mr: { xs: 2, md: 3 },
                                            flexShrink: 0,
                                            boxShadow: `0 4px 15px ${theme.palette.sepia.main}30`,
                                            border: `4px solid ${theme.palette.parchment.main}`,
                                            zIndex: 2,
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: '-4px',
                                                left: '-4px',
                                                right: '-4px',
                                                bottom: '-4px',
                                                borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${theme.palette.sepia.main}20, ${theme.palette.sepia.light}20)`,
                                                zIndex: -1,
                                                animation: 'pulse 3s infinite',
                                            }
                                        }}
                                    >
                                        {feature.step}
                                    </Box>
                                    <Box sx={{ pt: 0.5 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: theme.typography.headingFontFamily,
                                                color: theme.palette.text.primary,
                                                fontWeight: 600,
                                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                                                mb: { xs: 0.5, md: 1 },
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                                                lineHeight: { xs: 1.5, md: 1.6 },
                                                position: 'relative',
                                                pl: 0.5,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Box
                            sx={{
                                mt: 5,
                                pt: 4,
                                borderTop: `1px dashed ${theme.palette.sepia.main}30`,
                                position: 'relative',
                            }}
                        >
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: '1.1rem',
                                    maxWidth: '850px',
                                    mx: 'auto',
                                    lineHeight: 1.7,
                                    letterSpacing: '0.02em',
                                }}
                            >
                                This is truly a Done-For-You service where we take you from zero to a complete AI course rapidly, creating state-of-the-art digital products that help monetize your knowledge and engage your audience.
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>
            </Container>

            <ScholarlyDivider>
                <Box
                    component="img"
                    src={theme.textures.stampLogo}
                    alt="Decorative stamp"
                    sx={{
                        width: '40px',
                        height: '40px',
                        opacity: 0.7,
                        transform: 'rotate(45deg)'
                    }}
                />
            </ScholarlyDivider>

            {/* Results Section */}
            <Container maxWidth="lg" sx={{ mb: 15, position: 'relative', zIndex: 1 }} ref={resultsRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center' }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontFamily: theme.typography.headingFontFamily,
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                        }}
                    >
                        Proven <SepiaText>Results</SepiaText> For Educators
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            maxWidth: '700px',
                            mx: 'auto',
                            mb: 8,
                        }}
                    >
                        Our AI-powered courses are transforming education outcomes
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {resultMetrics.map((item, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    whileHover={{ translateY: -8 }}
                                >
                                    <MetricCard>
                                        <Box sx={{ color: item.color, mb: 1 }}>
                                            {item.icon}
                                        </Box>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontFamily: theme.typography.headingFontFamily,
                                                fontWeight: 700,
                                                fontSize: { xs: '2.2rem', md: '2.8rem' },
                                                color: theme.palette.sepia.main,
                                                mb: 1,
                                            }}
                                        >
                                            {item.metric}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {item.description}
                                        </Typography>
                                    </MetricCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            <ScholarlyDivider>
                <Box
                    component="img"
                    src={theme.textures.stampLogo}
                    alt="Decorative stamp"
                    sx={{
                        width: '40px',
                        height: '40px',
                        opacity: 0.7,
                        transform: 'rotate(90deg)'
                    }}
                />
            </ScholarlyDivider>

            {/* Process Section */}
            <Container maxWidth="lg" sx={{ mb: 15, position: 'relative', zIndex: 1 }} ref={processRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={processInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center' }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontFamily: theme.typography.headingFontFamily,
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                        }}
                    >
                        Our <SepiaText>Proven</SepiaText> Process
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            maxWidth: '700px',
                            mx: 'auto',
                            mb: 8,
                        }}
                    >
                        We handle every step to turn your teaching into an interactive experience
                    </Typography>

                    <Box
                        sx={{
                            position: 'relative',
                            ...parchmentContainerStyles,
                            padding: { xs: 3, md: 5 },
                            borderRadius: '16px',
                        }}
                    >
                        {/* Connection line between process steps */}
                        <Box
                            sx={{
                                position: 'absolute',
                                height: '1px',
                                backgroundColor: `${theme.palette.sepia.main}30`,
                                top: '30px',
                                left: { xs: '0', md: '20%' },
                                right: { xs: '0', md: '20%' },
                                zIndex: 0,
                                display: { xs: 'none', md: 'block' }
                            }}
                        />

                        <Grid container spacing={4} justifyContent="center">
                            {processSteps.map((step, index) => (
                                <Grid item xs={12} md={3} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.3 }}
                                    >
                                        <ProcessCard>
                                            <NumberBubble>
                                                <span>{step.step}</span>
                                            </NumberBubble>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontFamily: theme.typography.headingFontFamily,
                                                    fontWeight: 600,
                                                    color: theme.palette.sepia.main,
                                                    mt: { xs: 2, sm: 3 },
                                                    mb: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                                }}
                                            >
                                                {step.title}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: theme.palette.text.primary,
                                                    lineHeight: 1.6,
                                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                                }}
                                            >
                                                {step.description}
                                            </Typography>
                                        </ProcessCard>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>
            </Container>

            <ScholarlyDivider>
                <Box
                    component="img"
                    src={theme.textures.stampLogo}
                    alt="Decorative stamp"
                    sx={{
                        width: '40px',
                        height: '40px',
                        opacity: 0.7,
                        transform: 'rotate(180deg)'
                    }}
                />
            </ScholarlyDivider>

            {/* Lead Form Section */}
            <Container maxWidth="lg" sx={{ mb: 15, position: 'relative', zIndex: 1 }} ref={formRef} id="lead-form-section">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={formInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontFamily: theme.typography.headingFontFamily,
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                        }}
                    >
                        Transform Your Course with <SepiaText>AI</SepiaText>
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            color: theme.palette.text.primary,
                            maxWidth: '700px',
                            mx: 'auto',
                            mb: 8,
                        }}
                    >
                        Limited spots available for personalized AI course transformations
                    </Typography>

                    <LeadFormContainer
                        sx={{
                            padding: { xs: '30px 20px', sm: '35px', md: '40px' },
                            maxWidth: { xs: '95%', sm: '600px' },
                        }}
                    >
                        {submitted ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CheckCircle sx={{ fontSize: 70, color: theme.palette.sepia.main, mb: 3 }} />
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            mb: 2,
                                            fontFamily: theme.typography.headingFontFamily,
                                        }}
                                    >
                                        Thank you for applying!
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        We'll be in touch within 24 hours to schedule your free AI course audit.
                                    </Typography>
                                </motion.div>
                            </Box>
                        ) : (
                            <form onSubmit={handleLeadSubmit}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="Your Name"
                                    name="name"
                                    value={lead.name}
                                    onChange={handleInputChange}
                                    required
                                    sx={{
                                        mb: 3,
                                    }}
                                />
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
                                        mb: 3,
                                    }}
                                />

                                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                                    <FormLabel
                                        component="legend"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            mb: 1.5,
                                            fontSize: '1rem',
                                            '&.Mui-focused': {
                                                color: theme.palette.sepia.main,
                                            },
                                        }}
                                    >
                                        Do you have an existing course?
                                    </FormLabel>
                                    <RadioGroup
                                        name="hasExistingCourse"
                                        value={lead.hasExistingCourse}
                                        onChange={handleInputChange}
                                        row
                                    >
                                        <FormControlLabel
                                            value="yes"
                                            control={<Radio sx={{
                                                color: theme.palette.sepia.light,
                                                '&.Mui-checked': {
                                                    color: theme.palette.sepia.main,
                                                },
                                            }} />}
                                            label="Yes"
                                            sx={{ color: theme.palette.text.primary }}
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={<Radio sx={{
                                                color: theme.palette.sepia.light,
                                                '&.Mui-checked': {
                                                    color: theme.palette.sepia.main,
                                                },
                                            }} />}
                                            label="No, I need one built from scratch"
                                            sx={{ color: theme.palette.text.primary }}
                                        />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="What's your course topic?"
                                    name="courseTopic"
                                    value={lead.courseTopic}
                                    onChange={handleInputChange}
                                    sx={{
                                        mb: 4,
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isSubmitting}
                                    sx={{
                                        py: { xs: 1.5, md: 2 },
                                        px: { xs: 4, md: 6 },
                                        borderRadius: '8px',
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        fontWeight: 600,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '10%',
                                            right: '10%',
                                            height: '2px',
                                            background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}, transparent)`,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover::after': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Transform Your Course Now'
                                    )}
                                </Button>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        textAlign: 'center',
                                        mt: 2,
                                        color: theme.palette.text.secondary,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Join the next cohort of AI course creators starting this month
                                </Typography>
                            </form>
                        )}
                    </LeadFormContainer>
                </motion.div>
            </Container>

            <ScholarlyDivider>
                <Box
                    component="img"
                    src={theme.textures.stampLogo}
                    alt="Decorative stamp"
                    sx={{
                        width: '40px',
                        height: '40px',
                        opacity: 0.7,
                        transform: 'rotate(270deg)'
                    }}
                />
            </ScholarlyDivider>

            {/* Final CTA Section */}
            <Box
                sx={{
                    mb: { xs: 4, md: 8 },
                    py: { xs: 4, sm: 6, md: 8 },
                    px: { xs: 2, sm: 3, md: 6 },
                    ...parchmentContainerStyles,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    mx: 'auto',
                    maxWidth: { xs: '95%', sm: '900px' },
                    borderRadius: { xs: '15px', sm: '20px' },
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                    border: `1px solid ${theme.palette.sepia.main}40`,
                    overflow: 'hidden',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${theme.palette.sepia.main}, transparent)`,
                    }
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontFamily: theme.typography.headingFontFamily,
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: { xs: 2, md: 3 },
                        fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.5rem' },
                    }}
                >
                    Scale Your Teaching with <SepiaText>AI Power</SepiaText>
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.primary,
                        mb: { xs: 3, sm: 4, md: 5 },
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                        maxWidth: '650px',
                        mx: 'auto',
                        lineHeight: 1.6,
                    }}
                >
                    Turn your teaching into unlimited personalized engagement. Let's create your AI teaching assistant together and transform how you reach your students.
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        py: { xs: 1.5, sm: 2 },
                        px: { xs: 4, sm: 6 },
                        borderRadius: '8px',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 600,
                        position: 'relative',
                        width: { xs: '100%', sm: 'auto' },
                        maxWidth: { xs: '280px', sm: 'none' },
                        mx: { xs: 'auto', sm: 0 },
                    }}
                    onClick={() => {
                        document.getElementById('lead-form-section').scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }}
                >
                    Transform Your Course Now
                </Button>
            </Box>

            {/* Keyframes for animations */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(20px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </Box>
    );
};

export default ServicesPage;
