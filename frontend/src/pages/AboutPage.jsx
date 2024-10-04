import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Button, useTheme, Card, CardContent, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';

// FeatureCard component to display features
const FeatureCard = ({ icon, title, description }) => {
    const theme = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <Card
                sx={{
                    textAlign: 'center',
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                    },
                }}
            >
                <CardContent>
                    <Box sx={{ color: theme.palette.primary.main, fontSize: '3rem', mb: 1 }}>
                        {icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ maxWidth: '550px', margin: '0 auto' }}>
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

function AboutPage() {
    const theme = useTheme();
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the email to your backend
        console.log('Whitepaper requested for:', email);
        // Reset the email field
        setEmail('');
        // You might want to show a success message to the user
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 12 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Typography variant="h2" component="h1" align="center" sx={{ mb: 4, fontWeight: 700 }}>
                    About Brdge AI
                </Typography>
                <Typography variant="h5" component="h2" align="center" sx={{ mb: 8, fontWeight: 400, color: theme.palette.text.secondary }}>
                    Elevating Presentations with AI-Driven Innovation
                </Typography>
            </motion.div>

            {/* What Brdge AI is */}
            <Box sx={{ mb: 10 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                    What is Brdge AI?
                </Typography>
                <Typography variant="body1" paragraph>
                    Brdge AI is a cutting-edge platform that revolutionizes the way presentations are created, delivered, and experienced. By harnessing the power of artificial intelligence, we bridge the gap between static slides and dynamic, engaging content.
                </Typography>
                <Typography variant="body1" paragraph>
                    Our innovative technology analyzes your slides, extracts key information, and transforms your presentations into captivating narratives. With Brdge AI, you can bring your ideas to life in ways never before possible, creating unforgettable experiences for your audience.
                </Typography>
            </Box>

            {/* Feature Sections */}
            <Grid container spacing={4} sx={{ mb: 10 }}>
                <Grid item xs={12} md={4}>
                    <FeatureCard
                        icon={<AutoStoriesIcon fontSize="inherit" />}
                        title="Intelligent Slide Analysis"
                        description="Our advanced AI analyzes your slides, extracting key information and context to create a seamless narrative that captivates your audience."
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FeatureCard
                        icon={<RecordVoiceOverIcon fontSize="inherit" />}
                        title="Natural Voice Synthesis"
                        description="Transform your presentations into lifelike narrations with our state-of-the-art voice cloning technology, bringing your content to life."
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FeatureCard
                        icon={<ShareIcon fontSize="inherit" />}
                        title="Easy Sharing & Collaboration"
                        description="Share your AI-enhanced presentations effortlessly, fostering collaboration and engagement across teams and audiences worldwide."
                    />
                </Grid>
            </Grid>

            {/* Our Vision */}
            <Box sx={{ mb: 10 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                    Our Vision
                </Typography>
                <Typography variant="body1" paragraph>
                    At Brdge AI, we envision a future where every presentation has the power to inspire, educate, and transform. We believe that by combining cutting-edge AI technology with intuitive design, we can empower presenters to communicate their ideas more effectively and engagingly than ever before.
                </Typography>
                <Typography variant="body1" paragraph>
                    Our goal is to revolutionize knowledge management and presentation delivery, making it easier for organizations to share complex information, foster collaboration, and drive innovation. We're committed to pushing the boundaries of what's possible in presentation technology, always with the aim of enhancing human creativity and communication.
                </Typography>
            </Box>

            {/* Learn More Section with Contact Form */}
            <Box sx={{ textAlign: 'center', mb: 10 }}>
                <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
                    Learn More
                </Typography>
                <Typography variant="body1" paragraph sx={{ maxWidth: '700px', margin: '0 auto', mb: 5 }}>
                    Discover how Brdge AI is transforming presentations and why our AI-powered platform is the future of knowledge sharing. Request our whitepaper for in-depth insights into our technology, market potential, and strategic vision.
                </Typography>
                <Card sx={{ maxWidth: 500, margin: '0 auto', p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Your Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                sx={{
                                    fontSize: '1.25rem',
                                    py: 1.75,
                                    px: 5,
                                    borderRadius: 2,
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    transition: 'box-shadow 0.3s, transform 0.3s',
                                    '&:hover': {
                                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
                                    },
                                }}
                            >
                                SEND ME WHITEPAPER
                            </Button>
                        </motion.div>
                    </form>
                </Card>
            </Box>

            {/* Contact Section */}
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
                    Contact Us
                </Typography>
                <Typography variant="body1" paragraph sx={{ maxWidth: '700px', margin: '0 auto', mb: 3 }}>
                    Have questions or want to learn more about Brdge AI? We'd love to hear from you. Reach out to us directly at:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" component="a" href="mailto:levbszabo@gmail.com" sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                        levbszabo@gmail.com
                    </Typography>
                </Box>
                <Typography variant="body2">
                    We'll get back to you as soon as possible.
                </Typography>
            </Box>
        </Container>
    );
}

export default AboutPage;