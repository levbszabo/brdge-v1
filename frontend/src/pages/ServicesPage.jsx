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

// Number bubble for process steps with pulse animation
const NumberBubble = styled(Box)(({ theme }) => ({
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00B4DB, #4F9CF9)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1.8rem',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0, 180, 219, 0.4)',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1) rotate(5deg)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '2px solid rgba(0, 180, 219, 0.3)',
        animation: 'pulse 3s infinite',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '120%',
        height: '120%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 180, 219, 0.2) 0%, transparent 70%)',
        animation: 'rotate 8s linear infinite',
    }
}));

// Gradient Text
const GradientText = styled('span')({
    background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
});

// Service Option Card with consistent height and improved hover
const OptionCard = styled(Card)({
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        transform: 'translateY(-12px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(0, 180, 219, 0.3)',
    },
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover::before': {
        opacity: 1,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(0deg, rgba(0, 180, 219, 0.1) 0%, transparent 50%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    '&:hover::after': {
        opacity: 1,
    }
});

// Results Metric Card with improved animation
const MetricCard = styled(Box)({
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '32px 24px',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        transform: 'translateY(-12px) scale(1.03)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(0, 180, 219, 0.3)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(0, 255, 204, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        top: '-100px',
        right: '-100px',
        transition: 'all 0.6s ease',
    },
    '&:hover::after': {
        transform: 'scale(1.5) rotate(45deg)',
    }
});

// Lead Form Container with enhanced styling
const LeadFormContainer = styled(Paper)({
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #00ffcc, #00B4DB, #00ffcc)',
        backgroundSize: '200% 100%',
        animation: 'gradientMove 3s ease infinite',
    }
});

// Process Step Card
const ProcessCard = styled(Box)({
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
});

// Results and metrics
const resultMetrics = [
    {
        metric: "65%",
        description: "Increase in course completion rates",
        icon: <Timeline sx={{ fontSize: 34, mb: 1 }} />,
        color: "#00ffcc"
    },
    {
        metric: "3x",
        description: "More student questions answered",
        icon: <TouchApp sx={{ fontSize: 34, mb: 1 }} />,
        color: "#4F9CF9"
    },
    {
        metric: "15+",
        description: "Hours saved weekly per instructor",
        icon: <Equalizer sx={{ fontSize: 34, mb: 1 }} />,
        color: "#00B4DB"
    },
    {
        metric: "40%",
        description: "Reduction in support requests",
        icon: <PeopleAlt sx={{ fontSize: 34, mb: 1 }} />,
        color: "#00ffcc"
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

// Service features array update with accurate process steps
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLead(prev => ({ ...prev, [name]: value }));
    };

    const handleLeadSubmit = (e) => {
        e.preventDefault();
        // For now, simulate form submission
        console.log('Lead submitted:', lead);
        setSubmitted(true);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 40%, #003366 100%)',
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 8, md: 12 },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100%',
                    backgroundImage: `
                        radial-gradient(circle at 20% 15%, rgba(0, 180, 219, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 80% 85%, rgba(0, 255, 204, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 60% 40%, rgba(79, 156, 249, 0.1) 0%, transparent 50%)
                    `,
                    pointerEvents: 'none',
                    animation: 'gradientShift 15s ease infinite',
                },
            }}
        >
            {/* Hero Section */}
            <Container maxWidth="lg" ref={mainRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={mainInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center' }}
                >
                    <Typography
                        variant={isMobile ? 'h3' : 'h1'}
                        component="h1"
                        sx={{
                            fontFamily: 'Satoshi',
                            fontWeight: 700,
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                            color: 'white',
                            mb: { xs: 1, md: 1.5 },
                            lineHeight: 1.2,
                            textTransform: 'none',
                            textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                            px: { xs: 1, md: 0 },
                        }}
                    >
                        Let AI Build Your Course <GradientText>While You Sleep</GradientText>
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            maxWidth: '850px',
                            mx: 'auto',
                            mb: 2.5,
                            fontSize: { xs: '1rem', md: '1.2rem' },
                            lineHeight: 1.4,
                        }}
                    >
                        We take your course materials <GradientText>(or help you create them from scratch)</GradientText> and transform them into a fully AI-powered, interactive learning experience so you can scale faster and engage more students.
                    </Typography>

                    {/* Interactive Demo Section - Moved to top and always visible */}
                    <Box sx={{ mb: 3.5 }}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                maxWidth: '700px',
                                mx: 'auto',
                                mb: 1.5,
                                fontSize: { xs: '0.9rem', md: '1.1rem' },
                                fontWeight: 500,
                            }}
                        >
                            👇 <GradientText>Try it yourself</GradientText> - This is what your students will experience 👇
                        </Typography>

                        <Box
                            sx={{
                                width: '100%',
                                height: { xs: '320px', sm: '350px', md: '400px' },
                                maxWidth: '900px',
                                mx: 'auto',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(0, 180, 219, 0.3)',
                                mb: 1.5,
                                animation: 'fadeIn 0.8s ease',
                                '@keyframes fadeIn': {
                                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                                    '100%': { opacity: 1, transform: 'translateY(0)' },
                                },
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
                                color: 'rgba(255,255,255,0.7)',
                                maxWidth: '700px',
                                mx: 'auto',
                                fontSize: '0.85rem',
                                fontStyle: 'italic',
                            }}
                        >
                            Interactive demo: Ask questions and experience AI-powered learning
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            py: { xs: 1.5, md: 1.8 },
                            px: 5,
                            mt: 2,
                            borderRadius: '50px',
                            fontSize: '1.1rem',
                            background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
                            fontWeight: 600,
                            boxShadow: '0 8px 25px rgba(0, 255, 204, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #00B4DB, #00ffcc)',
                                boxShadow: '0 10px 30px rgba(0, 255, 204, 0.4)',
                                transform: 'translateY(-3px)',
                            },
                            transition: 'all 0.3s ease',
                            mb: { xs: 6, md: 8 },
                        }}
                        onClick={() => {
                            document.getElementById('lead-form-section').scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }}
                    >
                        Apply Now – Let AI Build Your Course Faster Than Ever!
                    </Button>
                </motion.div>
            </Container>

            {/* Service Section */}
            <Container maxWidth="lg" sx={{ mb: 15 }} ref={servicesRef}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontFamily: 'Satoshi',
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                            textTransform: 'none',
                        }}
                    >
                        Done-For-You <GradientText>AI Course Creation</GradientText>
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
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
                            maxWidth: '1000px',
                            mx: 'auto',
                            p: { xs: 2, sm: 3, md: 6 },
                            borderRadius: { xs: '15px', md: '20px' },
                            background: 'linear-gradient(135deg, rgba(0,27,55,0.6) 0%, rgba(0,41,84,0.4) 100%)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            mb: 8,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 204, 0.5), transparent)',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(79, 156, 249, 0.5), transparent)',
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                fontWeight: 600,
                                mb: 5,
                                background: 'linear-gradient(45deg, #4F9CF9, #00ffcc)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
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
                                    height: '2px',
                                    background: 'linear-gradient(90deg, #00ffcc, #4F9CF9)',
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
                                background: 'linear-gradient(to bottom, #00ffcc, rgba(0,180,219,0.4), #4F9CF9)',
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
                                                ? 'linear-gradient(135deg, #00B4DB, #4F9CF9)'
                                                : 'linear-gradient(135deg, #00ffcc, #00B4DB)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: { xs: '1.2rem', md: '1.4rem' },
                                            mr: { xs: 2, md: 3 },
                                            flexShrink: 0,
                                            boxShadow: '0 4px 20px rgba(0, 180, 219, 0.3)',
                                            border: '4px solid rgba(2,12,27,0.8)',
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
                                                background: 'linear-gradient(135deg, rgba(0, 180, 219, 0.2), rgba(0, 255, 204, 0.2))',
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
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.3rem' },
                                                mb: { xs: 0.5, md: 1 },
                                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                                background: idx % 2 === 0
                                                    ? 'linear-gradient(45deg, #ffffff, #4F9CF9)'
                                                    : 'linear-gradient(45deg, #ffffff, #00ffcc)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'rgba(255,255,255,0.9)',
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
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    background: 'linear-gradient(90deg, transparent, rgba(0, 180, 219, 0.3), transparent)',
                                }
                            }}
                        >
                            <Typography
                                variant="body1"
                                align="center"
                                sx={{
                                    color: 'rgba(255,255,255,0.95)',
                                    fontSize: '1.1rem',
                                    fontStyle: 'italic',
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

            {/* Results Section */}
            <Container maxWidth="lg" sx={{ mb: 15 }} ref={resultsRef}>
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
                            fontFamily: 'Satoshi',
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                            textTransform: 'none',
                        }}
                    >
                        Proven <GradientText>Results</GradientText> For Educators
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
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
                                                fontWeight: 700,
                                                fontSize: { xs: '2.2rem', md: '2.8rem' },
                                                background: `linear-gradient(45deg, ${item.color}, #00B4DB)`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                mb: 1,
                                            }}
                                        >
                                            {item.metric}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'white',
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

            {/* Process Section */}
            <Container maxWidth="lg" sx={{ mb: 15 }} ref={processRef}>
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
                            fontFamily: 'Satoshi',
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                            textTransform: 'none',
                        }}
                    >
                        Our <GradientText>Proven</GradientText> Process
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            maxWidth: '700px',
                            mx: 'auto',
                            mb: 8,
                        }}
                    >
                        We handle every step to turn your teaching into an interactive experience
                    </Typography>

                    <Box sx={{ position: 'relative' }}>
                        {/* Connection line between process steps */}
                        <Box
                            sx={{
                                position: 'absolute',
                                height: '2px',
                                backgroundColor: 'rgba(79, 156, 249, 0.3)',
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
                                            <NumberBubble>{step.step}</NumberBubble>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#4F9CF9',
                                                    mt: 3,
                                                    mb: 2,
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                {step.title}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}
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

            {/* Lead Form Section */}
            <Container maxWidth="lg" sx={{ mb: 15 }} ref={formRef} id="lead-form-section">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={formInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                            fontSize: { xs: '1.8rem', md: '2.5rem' },
                            textAlign: 'center',
                            textTransform: 'none',
                        }}
                    >
                        Transform Your Course with <GradientText>AI</GradientText>
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
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
                                    <CheckCircle sx={{ fontSize: 70, color: '#00ffcc', mb: 3 }} />
                                    <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                                        Thank you for applying!
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
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
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '8px',
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#00B4DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00B4DB',
                                            },
                                        },
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
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '8px',
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#00B4DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00B4DB',
                                            },
                                        },
                                    }}
                                />

                                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                                    <FormLabel component="legend" sx={{ color: 'white', mb: 1.5, fontSize: '1rem' }}>
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
                                                color: 'white',
                                                '&.Mui-checked': {
                                                    color: '#00ffcc',
                                                },
                                            }} />}
                                            label="Yes"
                                            sx={{ color: 'white' }}
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={<Radio sx={{
                                                color: 'white',
                                                '&.Mui-checked': {
                                                    color: '#00ffcc',
                                                },
                                            }} />}
                                            label="No, I need one built from scratch"
                                            sx={{ color: 'white' }}
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
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '8px',
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#00B4DB',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00B4DB',
                                            },
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        py: { xs: 1.5, md: 2 },
                                        px: { xs: 4, md: 6 },
                                        borderRadius: '50px',
                                        fontSize: { xs: '1rem', md: '1.1rem' },
                                        background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
                                        fontWeight: 600,
                                        boxShadow: '0 8px 25px rgba(0, 255, 204, 0.3)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #00B4DB, #00ffcc)',
                                            boxShadow: '0 12px 35px rgba(0, 255, 204, 0.4)',
                                            transform: { xs: 'translateY(-2px)', md: 'translateY(-4px)' },
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                            animation: 'shimmer 2s infinite',
                                        },
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    Transform Your Course Now
                                </Button>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        textAlign: 'center',
                                        mt: 2,
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '0.9rem',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    Join the next cohort of AI course creators starting this month
                                </Typography>
                            </form>
                        )}
                    </LeadFormContainer>
                </motion.div>
            </Container>

            {/* Final CTA Section */}
            <Box
                sx={{
                    mb: { xs: 6, md: 8 },
                    py: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3, md: 6 },
                    backgroundImage: 'linear-gradient(135deg, rgba(0,180,219,0.18) 0%, rgba(0,41,74,0.18) 100%)',
                    border: '1px solid rgba(0,180,219,0.25)',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    mx: 'auto',
                    maxWidth: { xs: '95%', sm: '900px' },
                    borderRadius: '20px',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        left: '-20%',
                        width: '140%',
                        height: '200%',
                        backgroundImage: 'radial-gradient(circle, rgba(0, 255, 204, 0.08) 0%, transparent 60%)',
                        transform: 'rotate(-20deg)',
                        pointerEvents: 'none',
                    }
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 3,
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        textTransform: 'none',
                    }}
                >
                    Scale Your Teaching with <GradientText>AI Power</GradientText>
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'rgba(255,255,255,0.9)',
                        mb: 5,
                        fontSize: '1.2rem',
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
                        py: 2,
                        px: 6,
                        borderRadius: '50px',
                        fontSize: '1.1rem',
                        background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
                        fontWeight: 600,
                        boxShadow: '0 8px 25px rgba(0, 255, 204, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #00B4DB, #00ffcc)',
                            boxShadow: '0 12px 35px rgba(0, 255, 204, 0.4)',
                            transform: 'translateY(-4px)',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            animation: 'shimmer 2s infinite',
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                @keyframes gradientShift {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
        }
      `}</style>
        </Box>
    );
};

export default ServicesPage;
