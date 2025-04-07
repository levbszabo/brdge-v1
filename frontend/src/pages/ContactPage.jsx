import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Divider, TextField, useTheme } from '@mui/material';
import { Mail, Calendar, MessageSquare, Phone, Users, ThumbsUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ParallaxProvider } from 'react-scroll-parallax';

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

    return (
        <ParallaxProvider>
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'visible',
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    minHeight: '100vh',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: { xs: 0, sm: 0, md: 0 },
                    // Apply parchment texture
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${theme.textures.darkParchment})`,
                        backgroundSize: 'cover',
                        opacity: 0.1,
                        pointerEvents: 'none',
                        zIndex: 0,
                        mixBlendMode: 'multiply'
                    },
                    // Add subtle glow effect
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '5%',
                        right: '5%',
                        width: '40%',
                        height: '40%',
                        background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        animation: 'float 25s infinite alternate-reverse',
                        zIndex: 0
                    }
                }}
            >
                <style>{`
                    .calendly-inline-widget {
                        min-width: 320px;
                        height: 700px;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
                    }
                    
                    /* Better mobile responsiveness for Calendly */
                    @media (max-width: 600px) {
                        .calendly-inline-widget {
                            height: 500px;
                        }
                    }
                    
                    /* Improve mobile touch targets */
                    @media (max-width: 600px) {
                        button, a {
                            min-height: 44px; /* Better touch targets on mobile */
                        }
                    }
                `}</style>

                {/* Header Section */}
                <Container
                    maxWidth="lg"
                    sx={{
                        pt: { xs: 6, sm: 10 },
                        pb: { xs: 4, sm: 6 },
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography
                            variant="h1"
                            align="center"
                            sx={{
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                fontWeight: 700,
                                mb: 2,
                                color: theme.palette.text.primary,
                                fontFamily: theme.typography.headingFontFamily,
                                textTransform: 'none',
                                letterSpacing: '-0.02em',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -10,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '120px',
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}80, transparent)`,
                                    borderRadius: '1px',
                                }
                            }}
                        >
                            Transform Your Teaching
                        </Typography>

                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                maxWidth: '800px',
                                mx: 'auto',
                                mb: 5,
                                color: theme.palette.text.secondary,
                                lineHeight: 1.6
                            }}
                        >
                            Ready to scale your educational impact without sacrificing personalization?
                            Connect with us to turn your expertise into interactive learning experiences
                            that engage students 24/7.
                        </Typography>
                    </motion.div>
                </Container>

                {/* Main Content */}
                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        mb: 8,
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Grid container spacing={4}>
                        {/* Get in Touch Section */}
                        <Grid item xs={12} md={5} ref={contactRef}>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, sm: 4 },
                                        borderRadius: '16px',
                                        bgcolor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: theme.shadows[1]
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 3,
                                            color: theme.palette.secondary.main,
                                            fontSize: { xs: '1.75rem', sm: '2rem' },
                                            fontFamily: theme.typography.headingFontFamily
                                        }}
                                    >
                                        Get in Touch
                                    </Typography>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: '1.1rem',
                                                mb: 3,
                                                color: theme.palette.text.primary,
                                                lineHeight: 1.6
                                            }}
                                        >
                                            Questions about creating your AI teaching assistant? Want to see how
                                            your educational content can become interactive? Reach out directly
                                            or schedule a demo tailored to your course needs.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '12px',
                                                    background: `${theme.palette.secondary.main}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: theme.palette.secondary.main
                                                }}
                                            >
                                                <Mail size={20} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
                                                >
                                                    Email Us
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    component="a"
                                                    href="mailto:levi@brdge-ai.com"
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        textDecoration: 'none',
                                                        '&:hover': { color: theme.palette.secondary.main }
                                                    }}
                                                >
                                                    levi@brdge-ai.com
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '12px',
                                                    background: `${theme.palette.secondary.main}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: theme.palette.secondary.main
                                                }}
                                            >
                                                <Calendar size={20} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
                                                >
                                                    Schedule a Call
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    component="a"
                                                    href="https://calendly.com/levi-brdge-ai/30min"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        color: theme.palette.text.primary,
                                                        textDecoration: 'none',
                                                        '&:hover': { color: theme.palette.secondary.main }
                                                    }}
                                                >
                                                    Book a 30-minute consultation
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            component="a"
                                            href="https://calendly.com/levi-brdge-ai/30min"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                px: { xs: 2, sm: 4 },
                                                py: { xs: 1.25, sm: 1.5 },
                                                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                                fontWeight: 600,
                                                borderRadius: '50px',
                                                width: '100%',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.3s ease-in-out'
                                            }}
                                            startIcon={<Calendar size={20} />}
                                        >
                                            Schedule an Educational Demo
                                        </Button>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Calendly Integration */}
                        <Grid item xs={12} md={7}>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 0, sm: 1 },
                                        borderRadius: '16px',
                                        bgcolor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        height: '100%',
                                        overflow: 'hidden',
                                        boxShadow: theme.shadows[1]
                                    }}
                                >
                                    <div className="calendly-inline-widget">
                                        <iframe
                                            src="https://calendly.com/levi-brdge-ai/30min?embed_domain=brdge-ai.com&embed_type=Inline"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            title="Schedule a meeting with Brdge AI"
                                            style={{ border: 'none', borderRadius: '16px' }}
                                        ></iframe>
                                    </div>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>

                    {/* Custom Solutions Section */}
                    <Box
                        ref={customSolutionsRef}
                        sx={{
                            mt: { xs: 6, sm: 8 },
                            p: { xs: 2.5, sm: 5 },
                            borderRadius: '16px',
                            bgcolor: `${theme.palette.primary.main}10`,
                            border: `1px solid ${theme.palette.primary.main}20`,
                            boxShadow: theme.shadows[1]
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={customSolutionsInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography
                                variant="h3"
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                                    mb: 3,
                                    color: theme.palette.text.primary,
                                    fontFamily: theme.typography.headingFontFamily
                                }}
                            >
                                Custom AI Teaching Solutions
                            </Typography>

                            <Typography
                                variant="h6"
                                align="center"
                                sx={{
                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                    maxWidth: '800px',
                                    mx: 'auto',
                                    mb: 5,
                                    color: theme.palette.text.secondary,
                                    lineHeight: 1.6
                                }}
                            >
                                Let us create a personalized AI teaching assistant that embodies your knowledge
                                and teaching style. We'll handle everything from course content transformation
                                to AI assistant training and deployment.
                            </Typography>

                            <Grid container spacing={4}>
                                {[
                                    {
                                        icon: <MessageSquare size={24} />,
                                        title: "AI Teaching Assistants",
                                        description: "We'll build AI assistants that answer your students' specific questions about your course content in your teaching voice and style."
                                    },
                                    {
                                        icon: <Users size={24} />,
                                        title: "Interactive Learning Experiences",
                                        description: "Transform your lectures and course materials into dynamic conversations that improve student engagement and comprehension."
                                    },
                                    {
                                        icon: <ThumbsUp size={24} />,
                                        title: "Educational Content Integration",
                                        description: "Our experts will convert your existing educational content into AI-powered interactive experiences that scale your teaching impact."
                                    }
                                ].map((item, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={customSolutionsInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                            style={{ height: '100%' }}
                                        >
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 3,
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderRadius: '12px',
                                                    bgcolor: theme.palette.background.paper,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: theme.shadows[2]
                                                    }
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        mb: 2
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 45,
                                                            height: 45,
                                                            borderRadius: '10px',
                                                            background: `${theme.palette.secondary.main}15`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: theme.palette.secondary.main
                                                        }}
                                                    >
                                                        {item.icon}
                                                    </Box>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '1.2rem',
                                                            color: theme.palette.text.primary
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
                                                        mb: 2,
                                                        lineHeight: 1.6,
                                                        flex: 1 // This helps maintain equal height
                                                    }}
                                                >
                                                    {item.description}
                                                </Typography>
                                            </Paper>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 5
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    size="large"
                                    component="a"
                                    href="https://calendly.com/levi-brdge-ai/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: '50px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    endIcon={<ChevronRight size={20} />}
                                >
                                    Discuss Your Course Transformation
                                </Button>
                            </Box>
                        </motion.div>
                    </Box>
                </Container>

                {/* FAQ Section - Short version */}
                <Container maxWidth="lg" sx={{ mb: 8, position: 'relative', zIndex: 1 }}>
                    <Box
                        sx={{
                            p: { xs: 3, sm: 5 },
                            borderRadius: '16px',
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[1]
                        }}
                    >
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontWeight: 600,
                                mb: 4,
                                color: theme.palette.secondary.main,
                                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                                fontFamily: theme.typography.headingFontFamily
                            }}
                        >
                            Frequently Asked Questions
                        </Typography>

                        <Grid container spacing={4}>
                            {[
                                {
                                    question: "How quickly can you transform my course content?",
                                    answer: "We can typically transform your educational content into an interactive AI experience within 1-2 weeks, depending on the complexity and volume of your material."
                                },
                                {
                                    question: "What types of educational content work best?",
                                    answer: "Lectures, tutorials, lesson plans, course modules, and training materials all work exceptionally well. If your content teaches concepts or processes, it's perfect for Brdge AI."
                                },
                                {
                                    question: "Do you offer solutions for educational institutions?",
                                    answer: "Yes, we offer institutional solutions for universities, schools, and training organizations with custom integrations, LMS compatibility, and department-wide deployment options."
                                },
                                {
                                    question: "What makes Brdge AI different from other educational tools?",
                                    answer: "We uniquely combine your teaching voice, expertise, and educational content to create AI assistants that truly represent you. Students receive personalized guidance that scales your teaching impact without requiring your constant presence."
                                }
                            ].map((item, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                color: theme.palette.text.primary,
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            {item.question}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: theme.palette.text.secondary,
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {item.answer}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </ParallaxProvider>
    );
};

export default ContactPage; 