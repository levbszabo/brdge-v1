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
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BrdgePlayer from '../components/BrdgePlayer';
import './LandingPage.css';
import { styled } from '@mui/material/styles';

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

const UseCase = ({ icon, title, description }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
            }}
            transition={{ duration: 0.5 }}
        >
            <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 } }}>
                <StepIcon icon={icon} />
                <Typography variant="h6" component="h3" gutterBottom align="center">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    {description}
                </Typography>
            </Paper>
        </motion.div>
    );
};

const StyledBrdgePlayer = styled(BrdgePlayer)(({ theme }) => ({
    width: '85%',
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

    // Memoize the BrdgePlayer component to prevent re-rendering
    const memoizedBrdgePlayer = useMemo(() => (
        <StyledBrdgePlayer
            brdgeId="1"
            onError={(error) => console.error('BrdgePlayer error:', error)}
        />
    ), []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ my: { xs: 4, sm: 6 }, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Typography
                            variant="h1"
                            component="h1"
                            gutterBottom
                            align="center"
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
                            }}
                        >
                            Unlock Knowledge with AI-Powered Presentations
                        </Typography>
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
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                            }}
                        >
                            Reduce meetings, streamline onboarding, and personalize content with Brdge AI—your new dynamic knowledge tool.
                        </Typography>

                        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }} data-aos="fade-up">
                            <Paper
                                elevation={6}
                                sx={{
                                    width: '85%',
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
                                color="primary"
                                size="large"
                                endIcon={<ArrowForward />}
                                className="glow-button"
                                sx={{
                                    py: 1.5,
                                    px: 5,
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    }
                                }}
                            >
                                Try Brdge AI Demo
                            </Button>
                        </motion.div>
                    </motion.div>
                </Box>

                <Box sx={{ my: 16, position: 'relative' }} data-aos="fade-up">
                    <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                        How It Works
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {flowSteps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index} sx={{ position: 'relative' }}>
                                <Box className="use-case-card" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <StepIcon icon={step.icon} />
                                    <Typography variant="h6" gutterBottom>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.description}
                                    </Typography>
                                </Box>
                                {index < flowSteps.length - 1 && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '30%',
                                        right: '-10%',
                                        width: '20%',
                                        height: '2px',
                                        backgroundColor: 'primary.main',
                                        display: { xs: 'none', md: 'block' },
                                    }} />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ my: 16 }} data-aos="fade-up">
                    <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                        Use Cases
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <UseCase
                                icon={<Group />}
                                title="Employee Onboarding"
                                description="Streamline the onboarding process with interactive, AI-powered training materials."
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <UseCase
                                icon={<Support />}
                                title="Customer Support"
                                description="Enhance customer support with dynamic, context-aware documentation and guides."
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <UseCase
                                icon={<School />}
                                title="Info Products"
                                description="Create and monetize interactive, AI-enhanced info products for your audience."
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ my: 16, textAlign: 'center' }} data-aos="fade-up">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                            Ready to Transform Your Knowledge Sharing?
                        </Typography>
                        <Typography variant="h6" component="p" gutterBottom color="text.secondary" sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
                            Try Brdge AI today and revolutionize how you share information.
                        </Typography>
                        <Button
                            component={Link}
                            to="/waitlist"
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<ArrowForward />}
                            className="glow-button"
                            sx={{
                                py: 2,
                                px: 6,
                                fontSize: '1.2rem',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                }
                            }}
                        >
                            Join Beta
                        </Button>
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
}

export default LandingPage;
