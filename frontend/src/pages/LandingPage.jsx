// src/pages/LandingPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography, Button, Container, Grid, Box,
    useTheme, Paper, List, ListItem, ListItemIcon, ListItemText,
    Tabs, Tab, Card, CardContent
} from '@mui/material';
import {
    CloudUpload, RecordVoiceOver, Slideshow,
    Group, Support, ArrowForward, School, Refresh,
    Assessment, Description, Mic, Chat,
} from '@mui/icons-material';
import {
    Timeline, TimelineItem, TimelineSeparator,
    TimelineConnector, TimelineContent, TimelineDot
} from '@mui/lab';
import { motion } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import './LandingPage.css';
import V1Diagram from '../components/V1Diagram';
import V2Diagram from '../components/V2Diagram';
import V3Diagram from '../components/V3Diagram';

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

// Evolution of Information Transfer using Timeline
const EvolutionTimeline = () => {
    const theme = useTheme();
    const timelineItems = [
        { icon: <Mic />, title: "Spoken Word", description: "The original form of transferring knowledge through speech." },
        { icon: <Description />, title: "Papyrus & Paper", description: "Transitioning from ancient scripts to written documentation." },
        { icon: <Assessment />, title: "Screens & Presentations", description: "Digital displays enhancing information sharing." },
        { icon: <Chat />, title: "AI Agents", description: "AI-driven intermediaries that present and share knowledge on your behalf." },
        { icon: <Refresh />, title: "Brdge AI", description: "The next evolution in information transfer, seamlessly integrating AI into communication." },
    ];

    return (
        <Box sx={{ my: 16 }}>
            <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                The Evolution of Information Transfer
            </Typography>
            <Timeline position="alternate">
                {timelineItems.map((item, index) => (
                    <TimelineItem key={index}>
                        <TimelineSeparator>
                            <TimelineDot color="primary">
                                {item.icon}
                            </TimelineDot>
                            {index < timelineItems.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <Typography variant="h6" component="h3" fontWeight="bold">
                                    {item.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </motion.div>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
};

// Enhanced Tabs Component for Introducing Brdge AI
const IntroducingBrdgeAI = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const tabDetails = [
        {
            label: "V1 Static AI Presentation",
            icon: <Slideshow />,
            title: 'Static AI Presentation',
            description: 'V1 introduces a static, AI-generated presentation that delivers your content seamlessly. This version automates the creation of presentations, ensuring consistency and saving valuable time.',
            component: <V1Diagram />,
        },
        {
            label: "V2 AI Agent Presentation",
            icon: <Chat />,
            title: 'AI Agent Presentation',
            description: 'V2 enhances the experience by introducing AI Agents. These agents can interact with users, adapt the presentation in real-time, and provide personalized content based on user feedback and interactions.',
            component: <V2Diagram />,
        },
        {
            label: "V3 Bidirectionally Agentic",
            icon: <Group />,
            title: 'Bidirectionally Agentic Presentation',
            description: 'V3 combines the power of AI with human expertise. This hybrid approach ensures accuracy, personalization, and emotional intelligence in presentations, making interactions more meaningful and effective.',
            component: <V3Diagram />,
        },
    ];

    return (
        <Box sx={{ my: 16, backgroundColor: '#f0f4f8', p: { xs: 4, md: 8 }, borderRadius: 2 }}>
            <Grid container spacing={4} alignItems="center">
                {/* Textual Content */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                            Introducing Brdge AI
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            For the first time in history, AI Agents provide us with an intermediary—an extension of ourselves. With Brdge AI, we offload our expertise and knowledge onto these extensions, enabling seamless information sharing.
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Chat color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Interactive AI Agents" secondary="AI-driven intermediaries that present and share knowledge on your behalf." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Mic color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Voice Cloning & Transcription" secondary="Convert your voice into AI-generated interactions, making communication effortless." />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Description color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Generative AI Models" secondary="Extract rich signals from your documents to create dynamic, interactive presentations." />
                            </ListItem>
                        </List>
                    </motion.div>
                </Grid>

                {/* Tabs Component with Diagrams */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: 2,
                                boxShadow: 3,
                                p: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                variant="fullWidth"
                                indicatorColor="primary"
                                textColor="primary"
                                sx={{ mb: 2 }}
                                aria-label="AI Presentation Versions"
                            >
                                {tabDetails.map((tab, index) => (
                                    <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" />
                                ))}
                            </Tabs>
                            <Box sx={{ flexGrow: 1 }}>
                                <motion.div
                                    key={tabValue}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {tabDetails[tabValue].title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {tabDetails[tabValue].description}
                                    </Typography>
                                    <Box sx={{ mt: 2, width: '100%', height: '100%' }}>
                                        {tabDetails[tabValue].component}
                                    </Box>
                                </motion.div>
                            </Box>
                        </Box>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

// Building the Future of Communication
const FutureOfCommunication = () => {
    const theme = useTheme();
    const steps = [
        { icon: <CloudUpload />, title: "Upload Documents", description: "Transform your static documents into interactive AI experiences." },
        { icon: <RecordVoiceOver />, title: "Add Voiceovers", description: "Incorporate voice explanations to guide users seamlessly through your content." },
        { icon: <Slideshow />, title: "AI-Powered Presentations", description: "Generate personalized, interactive presentations effortlessly." },
        { icon: <Refresh />, title: "Continuous Improvement", description: "Update and refine your content based on real-time feedback and new data." }
    ];

    return (
        <Box sx={{ my: 16 }}>
            <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                Building the Future of Communication
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {steps.map((step, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Parallax translateY={[10, -10]}>
                            <FeatureCard
                                icon={step.icon}
                                title={step.title}
                                description={step.description}
                            />
                        </Parallax>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

function LandingPage() {
    const theme = useTheme();

    const useCases = [
        { icon: <Group />, title: "Employee Onboarding", subheading: "Efficient & Scalable", description: "Streamline the onboarding process with interactive, AI-powered training materials." },
        { icon: <Support />, title: "Customer Support", subheading: "Dynamic & Intelligent", description: "Enhance customer support with context-aware documentation and guides." },
        { icon: <School />, title: "Info Products", subheading: "Engaging & Monetizable", description: "Create and monetize interactive, AI-enhanced informational products for your audience." },
    ];

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
                            Transform Your Documents with AI
                        </Typography>
                        <Typography variant="h6" component="p" align="center" sx={{
                            mb: { xs: 4, sm: 6 },
                            color: theme.palette.text.secondary,
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                        }}>
                            Streamline your workflow, enhance onboarding, and personalize content effortlessly with our cutting-edge AI solutions.
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
                    <Box sx={{ my: 16 }}>
                        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                            Real-World Applications
                        </Typography>
                        <Grid container spacing={6}>
                            {useCases.map((useCase, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <FeatureCard
                                        icon={useCase.icon}
                                        title={useCase.title}
                                        description={`${useCase.subheading}: ${useCase.description}`}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

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
