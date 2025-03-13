import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Divider, TextField } from '@mui/material';
import { Mail, Calendar, MessageSquare, Phone, Users, ThumbsUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ParallaxProvider } from 'react-scroll-parallax';

const ContactPage = () => {
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
                className="gradient-animate"
                sx={{
                    flexGrow: 1,
                    overflow: 'visible',
                    background: 'linear-gradient(180deg, #001B3D 0%, #000C1F 25%, #001F5C 50%, #0041C2 75%, #00B4DB 100%)',
                    backgroundSize: '200% 200%',
                    color: 'white',
                    minHeight: '100vh',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: { xs: 0, sm: 0, md: 0 },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 30%, rgba(0,65,194,0.2) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        opacity: 0.6,
                        mixBlendMode: 'soft-light',
                        transform: 'translateZ(0)',
                        willChange: 'opacity',
                        transition: 'opacity 0.3s ease-out'
                    }
                }}
            >
                <style>{`
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .gradient-animate {
                        animation: gradientShift 15s ease infinite;
                    }

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
                    
                    /* UI improvement: Light ray animation for subtle visual interest */
                    @keyframes lightRay {
                        0% {
                            opacity: 0;
                            transform: translateY(-50%) translateX(-50%) rotate(0deg);
                        }
                        20% {
                            opacity: 0.2;
                        }
                        80% {
                            opacity: 0.2;
                        }
                        100% {
                            opacity: 0;
                            transform: translateY(-50%) translateX(-50%) rotate(360deg);
                        }
                    }
                    
                    .header-container::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 150%;
                        height: 150%;
                        background: linear-gradient(90deg, transparent, rgba(0, 255, 204, 0.08), transparent);
                        transform: translateY(-50%) translateX(-50%) rotate(0deg);
                        opacity: 0;
                        animation: lightRay 15s ease-in-out infinite;
                        pointer-events: none;
                        z-index: -1;
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
                        overflow: 'hidden'
                    }}
                    className="header-container"
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
                                background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                textTransform: 'none',
                                letterSpacing: '-0.02em'
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
                                color: 'rgba(255, 255, 255, 0.9)',
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
                        mb: 8
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
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 3,
                                            color: '#00ffcc',
                                            fontSize: { xs: '1.75rem', sm: '2rem' }
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
                                                color: 'rgba(255, 255, 255, 0.9)',
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
                                                    background: 'rgba(0, 255, 204, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#00ffcc'
                                                }}
                                            >
                                                <Mail size={20} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
                                                >
                                                    Email Us
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    component="a"
                                                    href="mailto:levi@brdge-ai.com"
                                                    sx={{
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        '&:hover': { color: '#00ffcc' }
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
                                                    background: 'rgba(0, 255, 204, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#00ffcc'
                                                }}
                                            >
                                                <Calendar size={20} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
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
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        '&:hover': { color: '#00ffcc' }
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
                                            size="large"
                                            component="a"
                                            href="https://calendly.com/levi-brdge-ai/30min"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
                                                color: '#000000',
                                                px: { xs: 2, sm: 4 },
                                                py: { xs: 1.25, sm: 1.5 },
                                                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                                fontWeight: 600,
                                                borderRadius: '50px',
                                                width: '100%',
                                                boxShadow: '0 4px 20px rgba(0, 255, 204, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #00B4DB, #00ffcc)',
                                                    boxShadow: '0 6px 25px rgba(0, 255, 204, 0.4)',
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
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        height: '100%',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
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
                            background: 'linear-gradient(135deg, rgba(0, 41, 122, 0.2) 0%, rgba(0, 180, 219, 0.2) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 255, 204, 0.1)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
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
                                    color: 'white'
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
                                    color: 'rgba(255, 255, 255, 0.9)',
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
                                                    background: 'rgba(0, 41, 122, 0.3)',
                                                    backdropFilter: 'blur(5px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: '0 10px 30px rgba(0, 255, 204, 0.15)'
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
                                                            background: 'rgba(0, 255, 204, 0.15)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#00ffcc'
                                                        }}
                                                    >
                                                        {item.icon}
                                                    </Box>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '1.2rem',
                                                            color: '#ffffff'
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.85)',
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
                                    size="large"
                                    component="a"
                                    href="https://calendly.com/levi-brdge-ai/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: '#00ffcc',
                                        borderColor: 'rgba(0, 255, 204, 0.4)',
                                        borderWidth: '2px',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: '50px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: 'rgba(0, 255, 204, 0.6)',
                                            backgroundColor: 'rgba(0, 255, 204, 0.05)',
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
                <Container maxWidth="lg" sx={{ mb: 8 }}>
                    <Box
                        sx={{
                            p: { xs: 3, sm: 5 },
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                fontWeight: 600,
                                mb: 4,
                                color: '#00ffcc',
                                fontSize: { xs: '1.8rem', sm: '2.2rem' }
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
                                                color: 'white',
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            {item.question}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.8)',
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