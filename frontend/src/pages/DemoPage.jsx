import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, useTheme, Link, useMediaQuery } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { BusinessCenter, School, PresentToAll, AccessTime, ArrowForward, GroupAdd, MenuBook } from '@mui/icons-material';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    backgroundColor: theme.palette.primary.light + '10',
    position: 'relative',
}));

const demoData = [
    {
        id: 1,
        title: 'Onboarding Demo',
        description: 'Experience how Brdge AI revolutionizes employee onboarding. This demo transforms a legacy company\'s process into an engaging, AI-driven walkthrough that ensures consistent and comprehensive onboarding for every new hire.',
        value: 'Reduce training time by up to 50%, ensure compliance, and provide a seamless onboarding experience that new employees can access 24/7.',
        link: 'https://brdge-ai.com/b/0283eb9c-c249-4ece-889d-9fc60d1cca80',
        icon: <GroupAdd />,
    },
    {
        id: 2,
        title: 'Online Course Demo',
        description: 'Witness the future of e-learning with our Nutrition 101 demo. See how Brdge AI effortlessly converts course materials into interactive, AI-led sessions that adapt to each learner\'s pace and style.',
        value: 'Increase course completion rates by 40%, improve knowledge retention, and offer personalized learning experiences at scale.',
        link: 'https://brdge-ai.com/b/ee39133a-9f49-42ed-89fc-63c59bc09c3b',
        icon: <MenuBook />,
    },
    {
        id: 3,
        title: 'Sales Demo',
        description: 'Discover how Brdge AI transforms a standard sales presentation into an interactive and engaging experience. Prepare your pitch once, then let AI deliver it consistently to multiple clients.',
        value: 'Boost conversion rates by 30%, ensure every prospect receives your best pitch, and free up your sales team to focus on high-value activities.',
        link: 'https://brdge-ai.com/b/a04ffc4c-8f3a-4aac-b3f8-c96b49f77fa1',
        icon: <PresentToAll />,
    },
];

const AnimatedIcon = ({ icon }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const iconAnimation = useAnimation();

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        setMousePosition({ x, y });
    };

    React.useEffect(() => {
        const moveX = (mousePosition.x - 0.5) * 40;
        const moveY = (mousePosition.y - 0.5) * 40;
        iconAnimation.start({
            x: moveX,
            y: moveY,
            scale: 1.1,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        });
    }, [mousePosition, iconAnimation]);

    return (
        <Box
            onMouseMove={handleMouseMove}
            onMouseLeave={() => iconAnimation.start({ x: 0, y: 0, scale: 1 })}
            sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <motion.div animate={iconAnimation}>
                {React.cloneElement(icon, { sx: { fontSize: '100px', color: 'primary.main' } })}
            </motion.div>
        </Box>
    );
};

function DemoPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ParallaxProvider>
            <Box sx={{
                background: 'linear-gradient(180deg, #f0f8ff 0%, #ffffff 100%)',
                py: { xs: 6, md: 10 }
            }}>
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            component="h1"
                            gutterBottom
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 6 },
                                fontWeight: 'bold',
                                color: theme.palette.primary.main,
                                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
                            }}
                        >
                            Experience Brdge AI in Action
                        </Typography>
                        <Typography
                            variant={isMobile ? "h6" : "h5"}
                            align="center"
                            sx={{ mb: 8, color: theme.palette.text.secondary, maxWidth: '800px', mx: 'auto' }}
                        >
                            AI-Narrated Walkthroughs Created in Minutes. Transform your content into engaging, interactive experiences with just a few clicks.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={6}>
                        {demoData.map((demo) => (
                            <Grid item xs={12} md={4} key={demo.id}>
                                <Parallax translateY={[10, -10]} disabled={isMobile}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: demo.id * 0.1 }}
                                    >
                                        <StyledCard>
                                            <IconWrapper>
                                                <AnimatedIcon icon={demo.icon} />
                                            </IconWrapper>
                                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, height: '300px' }}>
                                                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>
                                                    {demo.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, overflow: 'auto' }}>
                                                    {demo.description}
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: theme.palette.primary.light + '20',
                                                    p: 2,
                                                    borderRadius: '8px',
                                                    mb: 2,
                                                    border: `1px solid ${theme.palette.primary.light}`
                                                }}>
                                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        Key Benefits:
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {demo.value}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'center', p: 3 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    href={demo.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<AccessTime />}
                                                    fullWidth
                                                    sx={{
                                                        borderRadius: '50px',
                                                        py: 1,
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'scale(1.05)',
                                                            boxShadow: '0 6px 20px rgba(0, 180, 219, 0.4)',
                                                        },
                                                    }}
                                                >
                                                    Try This Demo (2 min)
                                                </Button>
                                            </CardActions>
                                        </StyledCard>
                                    </motion.div>
                                </Parallax>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: { xs: 8, md: 12 }, textAlign: 'center' }}>
                        <Typography variant={isMobile ? "h4" : "h3"} gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            Ready to Create Your Own AI Presenter?
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                            Sign up now and start creating your own AI-powered presentations in minutes.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            component={Link}
                            href="/signup"
                            endIcon={<ArrowForward />}
                            sx={{
                                borderRadius: '50px',
                                px: { xs: 4, md: 6 },
                                py: { xs: 1.5, md: 2 },
                                fontSize: { xs: '1rem', md: '1.2rem' },
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            Get Started Free
                        </Button>
                    </Box>
                </Container>
            </Box>
        </ParallaxProvider>
    );
}

export default DemoPage;
