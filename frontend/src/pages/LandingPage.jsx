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
import { useSpring, animated } from 'react-spring';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import BrdgePlayer from '../components/BrdgePlayer';
import './LandingPage.css';
import { styled } from '@mui/material/styles';

const HeroBackground = () => {
    const props = useSpring({
        from: { background: 'linear-gradient(135deg, #0072ff, #00c6ff)' },
        to: { background: 'linear-gradient(135deg, #00c6ff, #0072ff)' },
        config: { duration: 5000 },
        loop: true,
    });
    return <animated.div style={{ ...props, padding: '10rem 0 6rem', borderRadius: '0 0 50% 50% / 20px' }} />;
};

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
            transition: 'all 0.3s ease-in-out',
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
                transition: 'all 0.3s ease-in-out',
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

const StyledBrdgePlayer = styled(BrdgePlayer)(({ theme }) => ({
    width: '100%',
    maxWidth: '680px',
    margin: '0 auto',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    boxShadow: theme.shadows[4],
    '& .brdge-player-controls': {
        opacity: 0.9,
        transition: 'opacity 0.3s ease',
        '&:hover': {
            opacity: 1,
        },
    },
    '& .brdge-player-button': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: theme.palette.common.white,
        padding: '10px 15px',
        fontSize: '1.1rem',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
    },
    '& .brdge-player-play-button': {
        padding: '15px 20px',
        fontSize: '1.3rem',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
            transform: 'scale(1.05)',
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

    const flowSteps = [
        { icon: <CloudUpload />, title: "Upload Documents", description: "Transform your static documents into interactive AI experiences." },
        { icon: <RecordVoiceOver />, title: "Record Walkthrough", description: "Add voice explanations to guide users through your content." },
        { icon: <Slideshow />, title: "AI-Powered Presentation", description: "Our AI creates an interactive, personalized presentation." },
        { icon: <Refresh />, title: "Continuous Refinement", description: "Easily update and improve based on feedback and new information." }
    ];

    const memoizedBrdgePlayer = useMemo(() => (
        <StyledBrdgePlayer
            brdgeId="1"
            onError={(error) => console.error('BrdgePlayer error:', error)}
            autoplay={true}  // Add this prop
        />
    ), []);

    return (
        <ParallaxProvider>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <HeroBackground />
                <Container maxWidth="lg" sx={{ mt: { xs: -24, sm: -28, md: -32 }, mb: 12, position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <Typography variant="h1" component="h1" align="center" sx={{
                            mb: { xs: 2, sm: 3 },
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                        }}>
                            Transform Documents into Interactive AI Experiences
                        </Typography>
                        <Typography variant="h5" component="h2" align="center" sx={{
                            mb: { xs: 3, sm: 4, md: 6 },
                            fontWeight: 400,
                            color: 'rgba(255, 255, 255, 0.9)',
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' }
                        }}>
                            Reduce meetings, streamline onboarding, and personalize content with Brdge AI
                        </Typography>
                    </motion.div>

                    <Box sx={{ my: { xs: 2, sm: 4, md: 8 }, display: 'flex', justifyContent: 'center' }}>
                        <Paper
                            elevation={6}
                            sx={{
                                width: '100%',
                                maxWidth: { xs: '100%', sm: '680px' },
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

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
                                }}
                            >
                                Brdge AI Use Cases
                            </Button>
                        </motion.div>
                    </Box>

                    <Box sx={{ my: 16 }}>
                        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                            How It Works
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {flowSteps.map((step, index) => (
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

                    <Box sx={{ my: 16 }}>
                        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                            Use Cases
                        </Typography>
                        <Grid container spacing={6}>
                            {[
                                { icon: <Group />, title: "Employee Onboarding", subheading: "Efficient, Scalable, AI-driven", description: "Streamline the onboarding process with interactive, AI-powered training materials." },
                                { icon: <Support />, title: "Customer Support", subheading: "Dynamic, Context-aware, Intelligent", description: "Enhance customer support with dynamic, context-aware documentation and guides." },
                                { icon: <School />, title: "Info Products", subheading: "Interactive, Engaging, Monetizable", description: "Create and monetize interactive, AI-enhanced info products for your audience." },
                            ].map((useCase, index) => (
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
                                Try Brdge AI today and revolutionize how you share information.
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
                                Join the Free Beta Trial
                            </Button>
                            <Typography variant="body2" sx={{
                                mt: 2,
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: { xs: '0.8rem', md: '0.875rem' }
                            }}>
                                Limited-time free access during the Beta period.
                                <br />
                                Sign up now to experience Brdge AI before launch!
                            </Typography>
                        </motion.div>
                    </Box>
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default LandingPage;
