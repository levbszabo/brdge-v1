// src/pages/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography, Button, Container, Grid, Box,
    useTheme, Paper, List, ListItem, ListItemIcon, ListItemText,
    Tabs, Tab, Card, CardContent, useMediaQuery, Icon
} from '@mui/material';
import {
    CloudUpload, RecordVoiceOver, Slideshow,
    Group, Support, ArrowForward, School, Refresh,
    Assessment, Description, Mic, Chat,
    AutoAwesome, Speed
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import './LandingPage.css';
import V1Diagram from '../components/V1Diagram';
import V2Diagram from '../components/V2Diagram';
import V3Diagram from '../components/V3Diagram';
import EvolutionTimeline from '../components/EvolutionTimeline';

// Reuse FeatureCard component
const FeatureCard = ({ icon, title, description }) => {
    const theme = useTheme();
    return (
        <Paper elevation={3} sx={{
            p: 4,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '16px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
            '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: theme.shadows[10],
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }
        }}>
            <Box sx={{
                color: theme.palette.primary.main,
                fontSize: '4rem',
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}>
                {icon}
            </Box>
            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" align="center">
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
                {description}
            </Typography>
        </Paper>
    );
};

const FeatureItem = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon component={icon} sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="body1"><strong>{text}</strong></Typography>
    </Box>
);

// Introducing Brdge AI
const IntroducingBrdgeAI = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const tabDetails = [
        {
            label: "Static",
            icon: <Slideshow />,
            title: 'Static AI Presentation',
            description: '',
            component: <V1Diagram />,
        },
        {
            label: "Agentic",
            icon: <Chat />,
            title: 'Agentic AI Presentation',
            description: '',
            component: <V2Diagram />,
        },
        {
            label: "Cybernetic",
            icon: <Group />,
            title: 'Hybrid AI-Human Presentation',
            description: '',
            component: <V3Diagram />,
        },
    ];

    return (
        <Box sx={{
            my: { xs: 4, md: 16 },
            backgroundColor: '#f0f4f8',
            p: { xs: 1, md: 8 },
            borderRadius: 2
        }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" align="center" sx={{ mb: { xs: 3, md: 6 } }}>
                Introducing Brdge AI
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <Typography variant="body1" paragraph>
                        <strong>Brdge AI:</strong> Your personal AI intermediary for <span style={{ color: theme.palette.primary.main }}>seamless communication</span> and <span style={{ color: theme.palette.primary.main }}>expertise-sharing</span>. We enable you to offload your knowledge onto AI extensions, revolutionizing information sharing.
                    </Typography>
                    <FeatureItem icon={AutoAwesome} text="Tailored Information Delivery" />
                    <FeatureItem icon={Speed} text="Real-time Adaptability" />
                    <FeatureItem icon={Refresh} text="Continuous Learning & Improvement" />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Discover how our three levels of AI-powered presentations can <strong>transform your information sharing experience</strong>.
                    </Typography>
                </Grid>

                <Grid item xs={12} md={7}>
                    <Box sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                        boxShadow: 3,
                        p: { xs: 1, md: 2 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                                mb: 2,
                                '& .MuiTabs-flexContainer': {
                                    justifyContent: 'center',
                                },
                                '& .MuiTab-root': {
                                    minWidth: 'auto',
                                    px: { xs: 1, md: 2 },
                                }
                            }}
                            aria-label="AI Presentation Versions"
                        >
                            {tabDetails.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab.label}
                                    icon={tab.icon}
                                    iconPosition="start"
                                    sx={{
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: 'center',
                                    }}
                                />
                            ))}
                        </Tabs>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={tabValue}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {tabDetails[tabValue].title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {tabDetails[tabValue].description}
                                    </Typography>
                                    <Box sx={{ flexGrow: 1, width: '100%', position: 'relative' }}>
                                        {tabDetails[tabValue].component}
                                    </Box>
                                </motion.div>
                            </AnimatePresence>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

// Building the Future of Communication
const FutureOfCommunication = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const steps = [
        { icon: <CloudUpload />, title: "Upload Documents", description: "Transform static documents into interactive AI experiences." },
        { icon: <RecordVoiceOver />, title: "Add Voiceovers", description: "Incorporate voice explanations for seamless content guidance." },
        { icon: <Slideshow />, title: "AI Presentations", description: "Generate personalized, interactive presentations effortlessly." },
        { icon: <Refresh />, title: "Continuous Improvement", description: "Update content based on real-time feedback and new data." }
    ];

    return (
        <Box sx={{ my: 16, px: 2 }}>
            <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                Building the Future of Communication
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {steps.map((step, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Paper elevation={3} sx={{
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderRadius: '16px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: theme.shadows[10],
                                }
                            }}>
                                <Box sx={{
                                    color: theme.palette.primary.main,
                                    fontSize: '2.5rem',
                                    mb: 1,
                                }}>
                                    {step.icon}
                                </Box>
                                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" align="center" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                                    {step.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                                    {step.description}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

// Use Cases Section
const UseCases = () => {
    const theme = useTheme();
    const useCases = [
        { icon: <Group />, title: "Employee Onboarding", subheading: "Efficient & Scalable", description: "Streamline the onboarding process with interactive, AI-powered training materials." },
        { icon: <Support />, title: "Customer Support", subheading: "Dynamic & Intelligent", description: "Enhance customer support with context-aware documentation and guides." },
        { icon: <School />, title: "Info Products", subheading: "Engaging & Monetizable", description: "Create and monetize interactive, AI-enhanced informational products for your audience." },
    ];

    return (
        <Box sx={{ my: 16, px: 2 }}>
            <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                Real-World Applications
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {useCases.map((useCase, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Paper elevation={3} sx={{
                                p: 4,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '16px',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-10px)',
                                    boxShadow: theme.shadows[10],
                                }
                            }}>
                                <Box sx={{
                                    color: theme.palette.primary.main,
                                    fontSize: '3rem',
                                    mb: 2,
                                    alignSelf: 'center',
                                }}>
                                    {useCase.icon}
                                </Box>
                                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" align="center">
                                    {useCase.title}
                                </Typography>
                                <Typography variant="subtitle1" color="primary" align="center" gutterBottom>
                                    {useCase.subheading}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" align="center">
                                    {useCase.description}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

function LandingPage() {
    const theme = useTheme();

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <ParallaxProvider>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 10, md: 12 } }}>
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Typography variant="h2" component="h1" align="center" sx={{
                            mb: { xs: 2, sm: 3 },
                            fontWeight: 'bold',
                            color: theme.palette.text.primary,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            lineHeight: 1.2
                        }}>
                            Revolutionize Communication with AI-powered Presentations
                        </Typography>
                        <Typography variant="h6" component="p" align="center" sx={{
                            mb: { xs: 4, sm: 6 },
                            color: theme.palette.text.secondary,
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                        }}>
                            Empower your communication. Simplify onboarding, automate content delivery, and captivate your audience.
                        </Typography>
                    </motion.div>

                    {/* Call to Action Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 6, sm: 8 } }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                component={Link}
                                to="/demos"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                sx={{
                                    py: { xs: 1.5, md: 2 },
                                    px: { xs: 4, md: 6 },
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                }}
                            >
                                Explore AI Use Cases
                            </Button>
                        </motion.div>
                    </Box>

                    {/* Evolution Timeline Section */}
                    <EvolutionTimeline />

                    {/* Introducing Brdge AI Section */}
                    <IntroducingBrdgeAI />

                    {/* Building the Future of Communication */}
                    <FutureOfCommunication />

                    {/* Use Cases Section */}
                    <UseCases />

                    {/* Final Call to Action */}
                    <Box sx={{
                        my: { xs: 8, md: 16 },
                        textAlign: 'center',
                        py: { xs: 6, md: 8 },
                        px: { xs: 2, md: 4 },
                        background: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
                        borderRadius: { xs: '24px', md: theme.shape.borderRadius },
                        boxShadow: '0px 10px 30px rgba(0, 131, 176, 0.3)',
                    }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Typography variant="h3" component="h2" gutterBottom sx={{
                                fontWeight: 'bold',
                                mb: { xs: 2, md: 4 },
                                color: 'white',
                                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
                            }}>
                                Ready to <span style={{ color: '#00ffcc' }}>Transform</span> Your Knowledge Sharing?
                            </Typography>
                            <Typography variant="h6" component="p" gutterBottom sx={{
                                mb: { xs: 3, md: 6 },
                                maxWidth: '800px',
                                mx: 'auto',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                            }}>
                                Join us today and revolutionize the way you share and interact with information.
                            </Typography>
                            <Button
                                component={Link}
                                to="/signup"
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                sx={{
                                    py: { xs: 1.5, md: 2 },
                                    px: { xs: 4, md: 6 },
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    borderRadius: '50px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    transition: 'all 0.3s ease-in-out',
                                }}
                            >
                                Start Your Free Trial
                            </Button>
                            <Typography variant="body2" sx={{
                                mt: 2,
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: { xs: '0.8rem', md: '0.875rem' }
                            }}>
                                Limited-time free access during our Beta period.
                                <br />
                                Sign up now to experience our AI solutions before the official launch!
                            </Typography>
                        </motion.div>
                    </Box>
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
