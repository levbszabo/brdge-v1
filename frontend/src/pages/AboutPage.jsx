import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button, useTheme, Link, useMediaQuery } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LayersIcon from '@mui/icons-material/Layers'; // New import for the icon

const FeatureSection = ({ icon, title, description, index }) => {
    const theme = useTheme();
    const isEven = index % 2 === 0;
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
                alignItems: 'center',
                justifyContent: 'space-between',
                my: { xs: 4, md: 8 },
                px: { xs: 2, md: 4 },
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', md: '45%' },
                    mb: { xs: 3, md: 0 },
                    textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {React.cloneElement(icon, { sx: { fontSize: '4rem', color: theme.palette.primary.main, mb: 2 } })}
                    <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                        {title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {description}
                    </Typography>
                </motion.div>
            </Box>
            <Box
                sx={{
                    width: { xs: '100%', md: '45%' },
                    height: { xs: '200px', md: '300px' },
                    backgroundColor: 'rgba(0, 180, 219, 0.1)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {React.cloneElement(icon, { sx: { fontSize: '8rem', color: theme.palette.primary.main } })}
                </motion.div>
            </Box>
        </Box>
    );
};

const AnimatedSection = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        {children}
    </motion.div>
);

const ProcessStep = ({ number, title, description }) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <Typography
                variant="h2"
                sx={{
                    color: theme.palette.primary.main,
                    opacity: 0.2,
                    fontWeight: 'bold',
                    mr: 2,
                    fontSize: { xs: '3rem', md: '4rem' }
                }}
            >
                {number}
            </Typography>
            <Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {description}
                </Typography>
            </Box>
        </Box>
    );
};

function AboutPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const iconAnimation = useAnimation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        setMousePosition({ x, y });
    };

    React.useEffect(() => {
        const moveX = (mousePosition.x - 0.5) * 20;
        const moveY = (mousePosition.y - 0.5) * 20;
        iconAnimation.start({
            x: moveX,
            y: moveY,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        });
    }, [mousePosition, iconAnimation]);

    return (
        <ParallaxProvider>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
                    {/* Hero Section */}
                    <Box sx={{ position: 'relative', mb: { xs: 6, md: 12 }, textAlign: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <Typography variant="h1" component="h1" sx={{
                                fontWeight: 900,
                                color: theme.palette.primary.main,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                                lineHeight: 1.2,
                                mb: 4,
                            }}>
                                Meet Your AI Presenter
                            </Typography>
                        </motion.div>
                        <Parallax y={[-20, 20]} tagOuter="figure" disabled={isMobile}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: { xs: '200px', md: '300px' },
                                    backgroundColor: 'rgba(0, 180, 219, 0.1)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                }}
                                onMouseMove={handleMouseMove}
                            >
                                <motion.div animate={iconAnimation}>
                                    <SmartToyIcon sx={{ fontSize: { xs: '100px', md: '150px' }, color: theme.palette.primary.main }} />
                                </motion.div>
                            </Box>
                        </Parallax>
                    </Box>

                    {/* Mission Statement */}
                    <AnimatedSection>
                        <Box sx={{ my: { xs: 4, md: 8 }, px: { xs: 2, md: 0 } }}>
                            <Typography variant="h4" component="h2" align="center" sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                mb: 3,
                                fontSize: { xs: '1.5rem', md: '2rem' },
                            }}>
                                Brdge AI: Your Personal AI Presenter
                            </Typography>
                            <Typography variant="body1" paragraph sx={{
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                lineHeight: 1.6,
                                color: theme.palette.text.primary,
                                maxWidth: '800px',
                                mx: 'auto',
                                textAlign: 'center',
                            }}>
                                Imagine having an AI agent that can present your content, answer questions, and deliver consistent information on your behalf. That's the power of Brdge AI. We create intelligent presenters that bring your documents to life, ensuring your message is delivered perfectly every time.
                            </Typography>
                        </Box>
                    </AnimatedSection>

                    {/* How Brdge AI Works Section - Revised */}
                    <Box sx={{ my: { xs: 4, md: 8 } }}>
                        <Typography variant="h4" component="h2" align="center" sx={{ mb: 4, fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            How Brdge AI Works: Our Unique Approach
                        </Typography>
                        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                            <ProcessStep
                                number="01"
                                title="Create a Static Walkthrough"
                                description="We start by having you create a fixed, static walkthrough of your content. This step is crucial as it establishes a baseline presentation that captures your expertise, tone, and key points. It's like creating a perfect, scripted version of your presentation."
                            />
                            <ProcessStep
                                number="02"
                                title="Train the Baseline AI"
                                description="Using your static walkthrough, we train our AI to understand and replicate your presentation style. This baseline AI learns the structure, content, and nuances of your presentation, creating a foundation for more dynamic interactions."
                            />
                            <ProcessStep
                                number="03"
                                title="Add Agentic Capabilities"
                                description="Once the baseline is established, we layer on agentic capabilities. This allows the AI to go beyond the script, answering questions and adapting the presentation in real-time. By building on the solid foundation of your static walkthrough, the AI maintains consistency while gaining flexibility."
                            />
                            <ProcessStep
                                number="04"
                                title="Refine and Personalize"
                                description="You can now fine-tune your AI presenter, adjusting its responses and presentation style. This step ensures that the AI accurately represents your brand and expertise, creating a truly personalized presentation experience."
                            />
                            <ProcessStep
                                number="05"
                                title="Deploy and Iterate"
                                description="Launch your AI presenter to your audience. As it interacts with users, you can gather insights and further refine its performance, creating a continuously improving presentation tool."
                            />
                        </Box>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Box
                                sx={{
                                    mt: { xs: 3, md: 6 },
                                    p: { xs: 2, md: 4 },
                                    background: 'linear-gradient(to right, #f0f4f8, #e7ecf3)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                                    borderLeft: '4px solid #2a9df4',
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignItems: { xs: 'flex-start', md: 'center' },
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                                        transform: 'translateY(-5px)',
                                    },
                                }}
                            >
                                <LayersIcon sx={{ fontSize: '2rem', color: '#2a9df4', mr: { xs: 0, md: 2 }, mb: { xs: 2, md: 0 }, alignSelf: { xs: 'center', md: 'flex-start' } }} />
                                <Box>
                                    <Typography variant="h6" gutterBottom fontWeight="bold" color="#2a9df4">
                                        A Static-First Approach
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                        Our unique method of starting with a static walkthrough before adding <span style={{ fontWeight: 'bold', color: '#2a9df4' }}>agentic capabilities</span> ensures that your AI presenter maintains the <span style={{ fontWeight: 'bold', color: '#2a9df4' }}>consistency and quality</span> of your original presentation while gaining the ability to <span style={{ fontWeight: 'bold', color: '#2a9df4' }}>interact dynamically</span>. This approach bridges the gap between scripted content and AI flexibility, resulting in presentations that are both reliable and adaptable. It's the perfect blend of your expertise and cutting-edge AI technology.
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>

                    {/* Why Brdge AI Matters */}
                    <Box sx={{ my: { xs: 6, md: 12 }, backgroundColor: 'rgba(0, 180, 219, 0.05)', py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 }, borderRadius: '20px' }}>
                        <Typography variant="h4" component="h2" align="center" sx={{ mb: 6, fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                            Why Brdge AI Matters
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {[
                                { icon: <SchoolIcon />, title: "24/7 Learning", description: "Create AI tutors that explain complex topics, answer questions, and adapt to each student's pace." },
                                { icon: <BusinessIcon />, title: "Consistent Onboarding", description: "Ensure every new hire gets the same high-quality introduction to your company, products, and processes." },
                                { icon: <PresentToAllIcon />, title: "Perfect Pitches", description: "Your best salesperson, replicated. Deliver consistent, engaging presentations to every potential client." }
                            ].map((item, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Box sx={{ textAlign: 'center' }}>
                                            {React.cloneElement(item.icon, { sx: { fontSize: '4rem', color: theme.palette.primary.main, mb: 2 } })}
                                            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Call to Action */}
                    <Box sx={{
                        my: { xs: 4, md: 8 },
                        textAlign: 'center',
                        py: { xs: 4, md: 6 },
                        px: { xs: 2, md: 4 },
                        background: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
                        borderRadius: '20px',
                        boxShadow: '0px 10px 30px rgba(0, 131, 176, 0.3)',
                    }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Typography variant="h2" component="h2" gutterBottom sx={{
                                fontWeight: 'bold',
                                mb: { xs: 2, md: 3 },
                                color: 'white',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                            }}>
                                Ready to Create Your AI Presenter?
                            </Typography>
                            <Typography variant="h5" component="p" gutterBottom sx={{
                                mb: { xs: 3, md: 4 },
                                maxWidth: '800px',
                                mx: 'auto',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                                fontWeight: 300,
                            }}>
                                Experience the future of content delivery with Brdge AI.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                href="/signup"
                                sx={{
                                    py: { xs: 1, md: 1.5 },
                                    px: { xs: 3, md: 4 },
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: '#fff',
                                    borderRadius: '50px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    transition: 'all 0.3s ease-in-out',
                                }}
                            >
                                Sign Up Now
                            </Button>
                        </motion.div>
                    </Box>

                    {/* Contact Information */}
                    <Box sx={{ mt: { xs: 4, md: 8 }, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>Get in Touch</Typography>
                        <Typography variant="body1" sx={{ mb: 2, fontSize: { xs: '0.9rem', md: '1rem' } }}>Have questions or want to learn more? We'd love to hear from you!</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2, flexWrap: 'wrap' }}>
                            <Link href="https://www.linkedin.com/in/levbszabo" target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                <LinkedInIcon sx={{ mr: 1 }} />
                                LinkedIn
                            </Link>
                            <Link href="mailto:levente@journeymanai.io" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                <EmailIcon sx={{ mr: 1 }} />
                                levente@journeymanai.io
                            </Link>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default AboutPage;
