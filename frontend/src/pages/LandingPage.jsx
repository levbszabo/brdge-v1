// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Container, Grid, Box,
    useMediaQuery, useTheme, IconButton, Paper
} from '@mui/material';
import {
    Menu as MenuIcon, CloudUpload, RecordVoiceOver, Slideshow,
    Group, Support, ArrowForward, School, Refresh
} from '@mui/icons-material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StepIcon = ({ icon }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
        >
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
        </motion.div>
    );
};

const UseCase = ({ icon, title, description }) => (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

function LandingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    React.useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

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

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Brdge AI
                    </Typography>
                    {isMobile ? (
                        <IconButton color="inherit">
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/features">Features</Button>
                            <Button color="inherit" component={Link} to="/pricing">Pricing</Button>
                            <Button color="inherit" component={Link} to="/about">About</Button>
                            <Button color="primary" variant="contained" component={Link} to="/demo">
                                Try Brdge AI
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg">
                <Box sx={{ my: 12, textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                            Unlock Knowledge with AI-Powered Presentations
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary" sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
                            Reduce meetings, streamline onboarding, and personalize content with Brdge AI—your new dynamic knowledge tool.
                        </Typography>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                component={Link}
                                to="/demo"
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<ArrowForward />}
                                sx={{
                                    py: 2,
                                    px: 6,
                                    fontSize: '1.2rem',
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    }
                                }}
                            >
                                Try Brdge AI
                            </Button>
                        </motion.div>
                    </motion.div>
                </Box>

                <Box sx={{ my: 16, position: 'relative' }} ref={ref}>
                    <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
                        How It Works
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {flowSteps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index} sx={{ position: 'relative' }}>
                                <motion.div
                                    custom={index}
                                    initial="hidden"
                                    animate={controls}
                                    variants={{
                                        hidden: { opacity: 0, y: 50 },
                                        visible: i => ({
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                delay: i * 0.3,
                                                duration: 0.5,
                                            },
                                        }),
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <StepIcon icon={step.icon} />
                                        <Typography variant="h6" gutterBottom>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </motion.div>
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

                <Box sx={{ my: 16 }}>
                    <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
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

                <Box sx={{ my: 16, textAlign: 'center' }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                            Ready to Transform Your Knowledge Sharing?
                        </Typography>
                        <Typography variant="h6" component="p" gutterBottom color="text.secondary" sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
                            Experience Brdge AI today and revolutionize how you share information.
                        </Typography>
                        <Button
                            component={Link}
                            to="/demo"
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                py: 2,
                                px: 6,
                                fontSize: '1.2rem',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                }
                            }}
                        >
                            Try Brdge AI
                        </Button>
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
}

export default LandingPage;