import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Divider, TextField, useTheme } from '@mui/material';
import { Mail, Calendar, MessageSquare, Users, ThumbsUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

const ContactPage = () => {
    const theme = useTheme();
    const [contactRef, contactInView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const [customSolutionsRef, customSolutionsInView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.getElementById(hash.slice(1));
            if (element) {
                const yOffset = -80;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, []);

    const PrimaryText = ({ children }) => (
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 'inherit' }}>
            {children}
        </Box>
    );

    return (
        <Box
            sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                minHeight: 'calc(100vh - 64px)',
                py: { xs: 8, md: 12 }
            }}
        >
            <style>{`
                .calendly-inline-widget {
                    min-width: 320px;
                    height: 700px;
                    border-radius: ${theme.shape.borderRadius}px;
                    overflow: hidden;
                    box-shadow: ${theme.shadows[1]};
                }
                
                @media (max-width: 600px) {
                    .calendly-inline-widget {
                        height: 580px;
                    }
                }
            `}</style>

            <Container
                maxWidth="md"
                sx={{
                    textAlign: 'center',
                    mb: { xs: 8, md: 10 }
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{ mb: 2, color: 'text.primary' }}
                    >
                        Get In Touch
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{ color: 'text.secondary', maxWidth: '750px', mx: 'auto' }}
                    >
                        Have questions about creating your AI-powered course, need a custom solution, or want to see a demo? Reach out below or schedule a time to chat.
                    </Typography>
                </motion.div>
            </Container>

            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
                <Grid container spacing={{ xs: 4, md: 6 }}>
                    <Grid item xs={12} md={5} ref={contactRef}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={contactInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            style={{ height: '100%' }}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    bgcolor: 'background.paper'
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}
                                >
                                    Contact Information
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                                    >
                                        Reach out directly via email or schedule a quick call.
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: '8px', background: `${theme.palette.primary.main}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                                            <Mail size={20} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.25 }}>
                                                Email Us
                                            </Typography>
                                            <Link href="mailto:levi@brdge-ai.com" sx={{ color: 'text.primary', fontWeight: 500, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                                levi@brdge-ai.com
                                            </Link>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: '8px', background: `${theme.palette.primary.main}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                                            <Calendar size={20} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.25 }}>
                                                Schedule a Call
                                            </Typography>
                                            <Link href="https://calendly.com/levi-brdge-ai/30min" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.primary', fontWeight: 500, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                                                Book a 30-min Demo/Consult
                                            </Link>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ mt: 'auto' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        component="a"
                                        href="https://calendly.com/levi-brdge-ai/30min"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        startIcon={<Calendar size={18} />}
                                    >
                                        Schedule Now
                                    </Button>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={contactInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 0, sm: 0.5 },
                                    height: '100%',
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper'
                                }}
                            >
                                <div className="calendly-inline-widget" style={{ height: '700px' }}>
                                    <iframe
                                        src="https://calendly.com/levi-brdge-ai/30min?hide_gdpr_banner=1&background_color=ffffff&text_color=101017&primary_color=007aff"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        title="Schedule a meeting with Brdge AI"
                                        style={{ border: 'none', borderRadius: `${theme.shape.borderRadius}px` }}
                                    ></iframe>
                                </div>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
                <Box
                    ref={customSolutionsRef}
                    sx={{
                        mt: { xs: 6, md: 10 },
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: theme.shape.borderRadius,
                        bgcolor: 'neutral.light',
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={customSolutionsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        <Typography
                            variant="h2"
                            align="center"
                            sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
                        >
                            Custom AI Solutions
                        </Typography>

                        <Typography
                            variant="h5"
                            align="center"
                            sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto', mb: 6 }}
                        >
                            Need something more specific? We offer tailored solutions including content transformation, platform integration, and dedicated support for larger projects.
                        </Typography>

                        <Grid container spacing={4}>
                            {[
                                {
                                    icon: <MessageSquare size={28} />,
                                    title: "Custom AI Agents",
                                    description: "Develop AI assistants trained specifically on your unique knowledge base and brand voice."
                                },
                                {
                                    icon: <Users size={28} />,
                                    title: "Enterprise Deployments",
                                    description: "Solutions for teams and organizations, including advanced analytics and user management."
                                },
                                {
                                    icon: <ThumbsUp size={28} />,
                                    title: "Integration Services",
                                    description: "Connect .bridge with your existing CRM, LMS, or other platforms for seamless workflows."
                                }
                            ].map((item, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={customSolutionsInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
                                        style={{ height: '100%' }}
                                    >
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                component={RouterLink}
                                to="/contact"
                                sx={{}}
                                endIcon={<ChevronRight size={18} />}
                            >
                                Discuss Custom Solutions
                            </Button>
                        </Box>
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
};

export default ContactPage; 