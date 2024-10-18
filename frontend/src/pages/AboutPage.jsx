import React from 'react';
import { Container, Typography, Box, Grid, Button, useTheme, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6,
                    },
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ color: theme.palette.primary.main, fontSize: '3rem', mb: 2 }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

function AboutPage() {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 12 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Typography variant="h2" component="h1" align="center" sx={{ mb: 2, fontWeight: 'bold', color: '#004d99' }}>
                    About Brdge AI
                </Typography>
                <Typography variant="h5" component="h2" align="center" sx={{ mb: 6, fontWeight: 400, color: theme.palette.text.secondary }}>
                    Transforming Knowledge Sharing into Dynamic Experiences
                </Typography>
            </motion.div>

            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#004d99' }}>
                    What is Brdge AI?
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                    Brdge AI is a platform designed to make knowledge sharing as engaging and accessible as possible. We turn your static documents—like PowerPoints and PDFs—into interactive, voice-enhanced experiences called Brdges.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                    No more meetings, no more scheduling conflicts; your presentations are always available, delivered in your voice, whenever and wherever your audience needs them.
                </Typography>
            </Box>

            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#004d99' }}>
                    How It Works
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FeatureCard
                            icon={<CloudUploadIcon fontSize="inherit" />}
                            title="Upload Your Document"
                            description="Start by uploading a PDF or presentation file."
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FeatureCard
                            icon={<RecordVoiceOverIcon fontSize="inherit" />}
                            title="Record Your Walkthrough"
                            description="Walk your audience through the content, using your voice or AI-generated narration."
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FeatureCard
                            icon={<EditIcon fontSize="inherit" />}
                            title="Refine the Presentation"
                            description="Fine-tune the transcript for clarity and accuracy, ensuring everything sounds just right."
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FeatureCard
                            icon={<ShareIcon fontSize="inherit" />}
                            title="Share & Engage"
                            description="Deploy your Brdge and share it with anyone. They'll experience your content as if you were guiding them in real-time."
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#004d99' }}>
                    What We're Doing Today
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                    Brdge AI is already being used for:
                </Typography>
                <ul>
                    <li>
                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                            <strong>Corporate Training & Onboarding:</strong> Streamline learning and development with on-demand, narrated documents, eliminating repetitive meetings.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                            <strong>Education:</strong> Teachers and trainers create engaging lessons that students can access at their own pace, with the benefit of personalized narration.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                            <strong>Client Presentations:</strong> Businesses deliver consistent, polished presentations for clients, ensuring every demo and sales pitch has the same professional impact.
                        </Typography>
                    </li>
                </ul>
            </Box>

            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#004d99' }}>
                    Our Vision for the Future
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                    At Brdge AI, we believe knowledge sharing should be seamless, engaging, and accessible to everyone. We're building a platform that evolves with the needs of its users, and we have exciting plans for what's next:
                </Typography>
                <ul>
                    <li>
                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                            <strong>Conversational Presentations:</strong> Soon, you'll be able to create interactive presentations where AI-powered agents respond to questions and provide deeper insights.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                            <strong>Brdge AI Networks:</strong> We're developing a knowledge network, connecting experts and their Brdges, so users can learn from others in their field and share their own expertise.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                            <strong>Collaboration Tools:</strong> Multiple users will be able to collaborate on Brdges, making it easy for teams to work together on projects and create richer content.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }}>
                            <strong>Rewards Program:</strong> We're exploring ways to reward users for contributing valuable content and engaging with the platform, creating a thriving ecosystem of shared knowledge.
                        </Typography>
                    </li>
                </ul>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#004d99' }}>
                    The Future of Knowledge Sharing
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#333', maxWidth: '800px', margin: '0 auto 2rem' }}>
                    We're committed to making knowledge transfer smarter, more interactive, and more effective. Whether you're an educator, a corporate trainer, or a business professional, Brdge AI empowers you to share your expertise in a way that feels personal and is available on demand.
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
        </Container>
    );
}

export default AboutPage;
