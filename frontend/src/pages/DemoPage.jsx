import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { BusinessCenter, School, Storefront } from '@mui/icons-material';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: theme.shadows[10],
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    fontSize: '4rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
}));

const demoData = [
    {
        id: 1,
        title: 'Onboarding Demo',
        description: 'Reimagine onboarding with Brdge AI. This demo showcases how Brdge AI can take a legacy company\'s process and quickly convert it into an engaging, AI-driven walkthrough.',
        link: 'https://brdge-ai.com/b/0283eb9c-c249-4ece-889d-9fc60d1cca80',
        icon: <BusinessCenter />,
    },
    {
        id: 2,
        title: 'Online Course Demo',
        description: 'Experience the future of e-learning with Brdge AI. Our Nutrition 101 demo demonstrates how effortlessly Brdge AI turns course materials into interactive sessions that captivate learners.',
        link: 'https://brdge-ai.com/b/ee39133a-9f49-42ed-89fc-63c59bc09c3b',
        icon: <School />,
    },
    {
        id: 3,
        title: 'Sales Demo',
        description: 'See how Brdge AI turns a standard sales presentation into an interactive and engaging experience. Prepare your sales pitch once, then make a Brdge to communicate it to your client(s).',
        link: 'https://brdge-ai.com/b/a04ffc4c-8f3a-4aac-b3f8-c96b49f77fa1',
        icon: <Storefront />,
    },
];

function DemoPage() {
    const theme = useTheme();

    return (
        <ParallaxProvider>
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                        Brdge AI Demo Gallery
                    </Typography>
                </motion.div>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" align="center" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        Experience the power of Brdge AI through our interactive demos. See how our platform transforms static content into engaging, AI-powered presentations.
                    </Typography>
                </Box>
                <Grid container spacing={6}>
                    {demoData.map((demo) => (
                        <Grid item xs={12} md={4} key={demo.id}>
                            <Parallax translateY={[10, -10]}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: demo.id * 0.1 }}
                                >
                                    <StyledCard>
                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                            <IconWrapper>
                                                {demo.icon}
                                            </IconWrapper>
                                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                {demo.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                                {demo.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href={demo.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    borderRadius: '50px',
                                                    px: 4,
                                                    py: 1,
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    transition: 'all 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                        boxShadow: theme.shadows[8],
                                                    },
                                                }}
                                            >
                                                Try This Demo
                                            </Button>
                                        </CardActions>
                                    </StyledCard>
                                </motion.div>
                            </Parallax>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </ParallaxProvider>
    );
}

export default DemoPage;
