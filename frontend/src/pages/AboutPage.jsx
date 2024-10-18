import React from 'react';
import { Container, Typography, Box, Grid, Button, useTheme, Link, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '@fontsource/poppins';
import RedeemIcon from '@mui/icons-material/Redeem';

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
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: theme.shadows[10],
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            }
        }}>
            <Box sx={{
                color: theme.palette.primary.main,
                fontSize: '3rem',
                mb: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}>
                {icon}
            </Box>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" align="center">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                {description}
            </Typography>
        </Paper>
    );
};

function AboutPage() {
    const theme = useTheme();

    return (
        <>
            <HeroBackground />
            <Container maxWidth="lg" sx={{ mt: { xs: -16, sm: -20, md: -24 }, mb: 12, position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Typography variant="h1" component="h1" align="center" sx={{
                        mb: { xs: 2, sm: 3 },
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                        lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                    }}>
                        About Brdge AI
                    </Typography>
                    <Typography variant="h5" component="h2" align="center" sx={{
                        mb: { xs: 3, sm: 4, md: 6 },
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.9)',
                        maxWidth: '800px',
                        mx: 'auto',
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                    }}>
                        Revolutionizing knowledge sharing through AI-powered interactive experiences
                    </Typography>
                </motion.div>

                <Box sx={{ my: { xs: 8, md: 12 }, px: { xs: 2, md: 0 } }}>
                    <Typography variant="body1" paragraph sx={{
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.6,
                        color: theme.palette.text.primary,
                        maxWidth: '800px',
                        mx: 'auto',
                        textAlign: 'center'
                    }}>
                        At Brdge AI, we're on a mission to transform how knowledge is shared and consumed. We believe that learning should be engaging, accessible, and personalized. Our platform turns static documents into dynamic, voice-enhanced experiences, making information more impactful and easier to understand than ever before.
                    </Typography>
                </Box>

                <Box sx={{ my: { xs: 6, md: 12 } }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mb: { xs: 4, md: 6 }, fontWeight: 'bold', color: theme.palette.primary.main, textAlign: 'center' }}>
                        How Brdge AI Works
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            { icon: <CloudUploadIcon />, title: "Upload", description: "Start by uploading your PDF or presentation file. Our AI analyzes the content, preparing it for transformation." },
                            { icon: <RecordVoiceOverIcon />, title: "Narrate", description: "Add your voice or use our AI-generated narration to guide users through your content, providing context and insights." },
                            { icon: <EditIcon />, title: "Refine", description: "Fine-tune the presentation for clarity and accuracy. Our AI assists in optimizing the content for maximum engagement." },
                            { icon: <ShareIcon />, title: "Share", description: "Deploy your Brdge to your audience. They'll experience your content as an interactive, personalized journey." }
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <FeatureCard {...item} />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ my: { xs: 6, md: 12 } }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mb: { xs: 4, md: 6 }, fontWeight: 'bold', color: theme.palette.primary.main, textAlign: 'center' }}>
                        Transforming Industries
                    </Typography>
                    <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
                        {[
                            { title: "Corporate Training", description: "Streamline onboarding and development with on-demand, interactive materials. Reduce training time and increase knowledge retention." },
                            { title: "Education", description: "Create engaging lessons for self-paced learning with personalized narration. Enhance student engagement and accommodate diverse learning styles." },
                            { title: "Client Presentations", description: "Deliver consistent, polished presentations for impactful client interactions. Ensure every team member presents with the same level of expertise and professionalism." }
                        ].map((item, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                                        <Typography variant="body2">{item.description}</Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ my: { xs: 6, md: 12 } }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mb: { xs: 4, md: 6 }, fontWeight: 'bold', color: theme.palette.primary.main, textAlign: 'center' }}>
                        The Future of Brdge AI
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            { icon: <AutoStoriesIcon />, title: "AI-Powered Insights", description: "We're developing advanced AI capabilities to provide real-time insights and answer complex questions based on your content." },
                            { icon: <PeopleIcon />, title: "Collaborative Creation", description: "Soon, teams will be able to collaborate on Brdges in real-time, combining expertise to create richer, more comprehensive content." },
                            { icon: <TrendingUpIcon />, title: "Brdge Networks", description: "Create interconnected Brdges to form knowledge networks, allowing for deeper exploration and understanding of complex topics." },
                            { icon: <RedeemIcon />, title: "Creator Rewards", description: "Our upcoming reward program will incentivize high-quality Brdge creation, fostering a vibrant ecosystem of knowledge sharing." }
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <FeatureCard {...item} />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ my: { xs: 6, md: 12 }, textAlign: 'center' }}>
                    <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Join the Knowledge Revolution
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, color: theme.palette.text.primary, maxWidth: '800px', mx: 'auto', mb: 4 }}>
                        Brdge AI is more than just a platform; it's a movement towards more effective, engaging, and accessible knowledge sharing. Whether you're an educator, trainer, or business professional, we invite you to join us in reshaping how information is communicated and consumed.
                    </Typography>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            href="/demos"
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1.1rem',
                                borderRadius: 2,
                            }}
                        >
                            Explore Our Platform
                        </Button>
                    </motion.div>
                </Box>

                <Box sx={{ mt: 10, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>Get in Touch</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>Have questions or want to learn more? We'd love to hear from you!</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2, flexWrap: 'wrap' }}>
                        <Link href="https://www.linkedin.com/in/levbszabo" target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
                            <LinkedInIcon sx={{ mr: 1 }} />
                            LinkedIn
                        </Link>
                        <Link href="mailto:levente@journeymanai.io" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
                            <EmailIcon sx={{ mr: 1 }} />
                            levente@journeymanai.io
                        </Link>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default AboutPage;
