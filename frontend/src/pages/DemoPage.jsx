import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, useTheme, Link, useMediaQuery } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { BusinessCenter, School, PresentToAll, AccessTime, ArrowForward, GroupAdd, MenuBook } from '@mui/icons-material';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '24px',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,180,219,0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0,180,219,0.1)',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(0,180,219,0.2)',
        backgroundColor: 'rgba(0,180,219,0.05)',
        '& .demo-icon': {
            transform: 'scale(1.1) rotate(5deg)',
            filter: 'drop-shadow(0 0 15px rgba(0,180,219,0.4))'
        },
        '& .card-content': {
            transform: 'translateY(-5px)'
        }
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,180,219,0.3), transparent)',
        opacity: 0.5,
        transition: 'opacity 0.3s ease-in-out'
    }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '180px',
    width: '100%',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,180,219,0.02)',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(0,180,219,0.03)'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,180,219,0.02) 10px, rgba(0,180,219,0.02) 20px)',
        opacity: 0.5
    }
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
                {React.cloneElement(icon, {
                    sx: {
                        fontSize: '80px',
                        color: '#00B4DB',
                        filter: 'drop-shadow(0 0 10px rgba(0,180,219,0.3))',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    },
                    className: 'demo-icon'
                })}
            </motion.div>
        </Box>
    );
};

function DemoPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <ParallaxProvider>
            <Box sx={{
                background: 'linear-gradient(180deg, #000B1F 0%, #0041C2 100%)',
                py: { xs: 6, md: 10 },
                minHeight: '100vh',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(0,180,219,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 15s infinite alternate'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '10%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(0,65,194,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 20s infinite alternate-reverse'
                }
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: '15%',
                    left: '5%',
                    width: '300px',
                    height: '300px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    animation: 'rotate 20s linear infinite',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -1,
                        borderRadius: 'inherit',
                        padding: '1px',
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                    }
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '5%',
                    width: '200px',
                    height: '200px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transform: 'rotate(45deg)',
                    animation: 'rotate 15s linear infinite reverse',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -1,
                        padding: '1px',
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                    }
                }} />

                <Container maxWidth="lg" ref={ref}>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            component="h1"
                            align="center"
                            sx={{
                                mb: { xs: 4, md: 6 },
                                fontWeight: '600',
                                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                                color: 'white',
                                textTransform: 'none',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                                position: 'relative',
                                textShadow: '0 0 40px rgba(255, 255, 255, 0.25)',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-16px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '80px',
                                    height: '4px',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    borderRadius: '2px',
                                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
                                }
                            }}
                        >
                            Experience Brdge AI in Action
                        </Typography>
                        <Typography
                            variant={isMobile ? "h6" : "h5"}
                            align="center"
                            sx={{
                                mb: 8,
                                color: 'rgba(255, 255, 255, 0.8)',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                                fontWeight: '400',
                                letterSpacing: '0.01em',
                                lineHeight: 1.6
                            }}
                        >
                            AI-narrated walkthroughs created in minutes. Transform your content into engaging, interactive experiences with just a few clicks.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={6}>
                        {demoData.map((demo, index) => (
                            <Grid item xs={12} md={4} key={demo.id}>
                                <Parallax translateY={[10, -10]} disabled={isMobile}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                    >
                                        <StyledCard>
                                            <IconWrapper>
                                                <AnimatedIcon icon={demo.icon} />
                                            </IconWrapper>
                                            <CardContent className="card-content" sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                p: 3,
                                                height: '300px',
                                                color: 'white',
                                                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}>
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 2,
                                                        color: '#00B4DB',
                                                        textShadow: '0 0 10px rgba(0,180,219,0.3)',
                                                        fontSize: { xs: '1.3rem', sm: '1.4rem' },
                                                        transition: 'color 0.3s ease'
                                                    }}
                                                >
                                                    {demo.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mb: 3,
                                                        flexGrow: 1,
                                                        overflow: 'auto',
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.95rem',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {demo.description}
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: 'rgba(0,180,219,0.05)',
                                                    p: 2.5,
                                                    borderRadius: '16px',
                                                    mb: 2,
                                                    border: '1px solid rgba(0,180,219,0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,180,219,0.08)',
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            mb: 1,
                                                            color: '#00B4DB',
                                                            textShadow: '0 0 10px rgba(0,180,219,0.2)'
                                                        }}
                                                    >
                                                        Key Benefits:
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.8)',
                                                            fontSize: '0.9rem',
                                                            lineHeight: 1.7
                                                        }}
                                                    >
                                                        {demo.value}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ justifyContent: 'center', p: 3 }}>
                                                <Button
                                                    variant="contained"
                                                    href={demo.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<AccessTime />}
                                                    fullWidth
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #00B4DB, #0080bf)',
                                                        color: 'white',
                                                        borderRadius: '50px',
                                                        py: 1.5,
                                                        fontSize: '0.9rem',
                                                        fontWeight: 600,
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        backdropFilter: 'blur(10px)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #0080bf, #00B4DB)',
                                                            transform: 'scale(1.02)',
                                                            boxShadow: '0 6px 20px rgba(0,180,219,0.4)',
                                                        },
                                                        '&:active': {
                                                            transform: 'scale(0.98)'
                                                        }
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
                </Container>

                <style>
                    {`
                        @keyframes float {
                            0% { transform: translateY(0px); }
                            50% { transform: translateY(-20px); }
                            100% { transform: translateY(0px); }
                        }
                        @keyframes rotate {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes pulse {
                            0% { opacity: 0.5; }
                            50% { opacity: 0.8; }
                            100% { opacity: 0.5; }
                        }
                    `}
                </style>
            </Box>
        </ParallaxProvider>
    );
}

export default DemoPage;
