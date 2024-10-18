// src/pages/LandingPage.jsx
import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography, Button, Container, Grid, Box,
    useTheme, Paper
} from '@mui/material';
import {
    CloudUpload, RecordVoiceOver, Slideshow,
    Group, Support, ArrowForward, School, Refresh
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BrdgePlayer from '../components/BrdgePlayer';
import './LandingPage.css';
import { styled } from '@mui/material/styles';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

const StepIcon = ({ icon }) => {
    return (
        <Box sx={{
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 3,
            mb: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-5px)',
            }
        }}>
            {React.cloneElement(icon, { sx: { fontSize: 40, color: 'white' } })}
        </Box>
    );
};

const UseCase = ({ icon, title, subheading, description }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={3} sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 6,
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                }
            }}>
                <StepIcon icon={icon} />
                <Typography variant="h6" component="h3" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Typography variant="subtitle1" color="primary" align="center" sx={{ mb: 2 }}>
                    {subheading}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    {description}
                </Typography>
            </Paper>
        </motion.div>
    );
};

const StyledBrdgePlayer = styled(BrdgePlayer)(({ theme }) => ({
    width: '100%',
    maxWidth: '680px',
    margin: '0 auto',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    boxShadow: theme.shadows[4],
    '& .brdge-player-controls': {
        opacity: 0.7,
        transition: 'opacity 0.3s ease',
        '&:hover': {
            opacity: 1,
        },
    },
    '& .brdge-player-button': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
    },
    '& .track-title': {
        fontSize: '1.5rem',
        fontWeight: 600,
    },
    '& .progress-bar': {
        height: '8px',
        background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
    },
}));

function LandingPage() {
    const theme = useTheme();

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const flowSteps = [
        {
            icon: <CloudUpload />,
            title: "Upload Documents",
            description: "Transform your static documents into interactive AI experiences."
        },
        {
            icon: <RecordVoiceOver />,
            title: "Record Walkthrough",
            description: "Add voice explanations to guide users through your content."
        },
        {
            icon: <Slideshow />,
            title: "AI-Powered Presentation",
            description: "Our AI creates an interactive, personalized presentation."
        },
        {
            icon: <Refresh />,
            title: "Continuous Refinement",
            description: "Easily update and improve based on feedback and new information."
        }
    ];

    const memoizedBrdgePlayer = useMemo(() => (
        <StyledBrdgePlayer
            brdgeId="1"
            onError={(error) => console.error('BrdgePlayer error:', error)}
        />
    ), []);

    return (
        <ParallaxProvider>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                    <Box sx={{
                        my: { xs: 4, sm: 6 },
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        <Parallax translateY={[-20, 20]}>
                            <Typography
                                variant="h1"
                                component="h1"
                                gutterBottom
                                align="center"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                                    color: theme.palette.text.primary,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                Unlock Knowledge with AI-Powered Presentations
                            </Typography>
                        </Parallax>
                        <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            align="center"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                lineHeight: 1.5,
                            }}
                        >
                            Reduce meetings, streamline onboarding, and personalize content with Brdge AI—your new dynamic knowledge tool.
                        </Typography>

                        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }} data-aos="fade-up">
                            <Paper
                                elevation={6}
                                sx={{
                                    width: '100%',
                                    maxWidth: '680px',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 8,
                                    },
                                }}
                            >
                                {memoizedBrdgePlayer}
                            </Paper>
                        </Box>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                component={Link}
                                to="/demo"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                className="glow-button"
                                sx={{
                                    py: 2,
                                    px: 6,
                                    fontSize: '1.2rem',
                                    background: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #00B4E6 0%, #84E5A8 100%)',
                                    }
                                }}
                            >
                                Try Brdge AI Demo
                            </Button>
                        </motion.div>
                    </Box>

                    <Box sx={{ my: 8, position: 'relative' }} data-aos="fade-up">
                        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                            How It Works
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {flowSteps.map((step, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index} sx={{ position: 'relative' }}>
                                    <Parallax translateY={[10, -10]}>
                                        <Paper elevation={3} sx={{
                                            p: 4,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            transition: 'all 0.3s ease',
                                            borderRadius: '12px',
                                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                            '&:hover': {
                                                transform: 'translateY(-10px) scale(1.02)',
                                                boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.15)',
                                            }
                                        }}>
                                            <StepIcon icon={step.icon} />
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                {step.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {step.description}
                                            </Typography>
                                        </Paper>
                                    </Parallax>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box sx={{ my: 16 }} data-aos="fade-up">
                        <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                            Use Cases
                        </Typography>
                        <Grid container spacing={6}>
                            {[
                                { icon: <Group />, title: "Employee Onboarding", subheading: "Efficient, Scalable, AI-driven", description: "Streamline the onboarding process with interactive, AI-powered training materials." },
                                { icon: <Support />, title: "Customer Support", subheading: "Dynamic, Context-aware, Intelligent", description: "Enhance customer support with dynamic, context-aware documentation and guides." },
                                { icon: <School />, title: "Info Products", subheading: "Interactive, Engaging, Monetizable", description: "Create and monetize interactive, AI-enhanced info products for your audience." },
                            ].map((useCase, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <UseCase
                                        icon={useCase.icon}
                                        title={useCase.title}
                                        subheading={useCase.subheading}
                                        description={useCase.description}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Box sx={{
                        my: 16,
                        textAlign: 'center',
                        py: 8,
                        background: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: '0px 10px 30px rgba(0, 131, 176, 0.3)',
                    }} data-aos="fade-up">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'white' }}>
                                Ready to <span style={{ color: '#00ffcc' }}>Transform</span> Your Knowledge Sharing?
                            </Typography>
                            <Typography variant="h6" component="p" gutterBottom sx={{ mb: 6, maxWidth: '800px', mx: 'auto', color: 'rgba(255, 255, 255, 0.9)' }}>
                                Try Brdge AI today and revolutionize how you share information.
                            </Typography>
                            <Button
                                component={Link}
                                to="/waitlist"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                className="glow-button"
                                sx={{
                                    py: 2,
                                    px: 6,
                                    fontSize: '1.2rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    borderRadius: '50px',
                                    width: { xs: '90%', sm: 'auto' },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    }
                                }}
                            >
                                Join the Revolution
                            </Button>
                        </motion.div>
                    </Box>
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
