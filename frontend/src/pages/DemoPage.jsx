import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { GroupAdd, MenuBook, PresentToAll, BusinessCenter } from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 12px 40px rgba(0, 180, 219, 0.2)',
        '& .icon-wrapper': {
            background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
        }
    },
}));

const IconWrapper = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: 'rgba(79, 156, 249, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '& .MuiSvgIcon-root': {
        fontSize: '2.5rem',
        color: '#4F9CF9',
    }
});

// Demo Data
const demos = [
    {
        id: 1,
        title: '24/7 Sales Assistant',
        description: 'Automate lead qualification and FAQs so your team can focus on closing deals.',
        value: 'Shorten sales cycles and convert more leads effortlessly.',
        icon: <BusinessCenter />,
        url: 'https://brdge-ai.com/viewBrdge/141'
    },
    {
        id: 2,
        title: 'Onboarding AI Guide',
        description: 'Transform HR docs into an interactive guide for new employees.',
        value: 'Reduce repetitive Q&A and improve training engagement.',
        icon: <GroupAdd />,
        url: 'https://brdge-ai.com/viewBrdge/144'
    },
    {
        id: 3,
        title: 'Team Knowledge Hub',
        description: 'Centralize company knowledge and empower teams to self-serve answers.',
        value: 'Eliminate unnecessary meetings and reduce chat overload.',
        icon: <MenuBook />,
        url: 'https://brdge-ai.com/viewBrdge/173'
    },
    {
        id: 4,
        title: 'Expert Portfolio & Q&A',
        description: 'Showcase your expertise with instant answers for your audience.',
        value: 'Scale your personal brand and monetize your skills.',
        icon: <PresentToAll />,
        url: 'https://brdge-ai.com/viewBrdge/146'
    },
];

const DemoPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    const handleExploreDemo = (url) => {
        window.open(url, '_blank');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'relative',
            overflow: 'hidden',
            py: { xs: 8, md: 12 },
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
            }
        }}>
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant={isMobile ? "h3" : "h2"}
                        component="h1"
                        align="center"
                        sx={{
                            mb: { xs: 2, md: 3 },
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
                        Interactive AI Demos
                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            mb: { xs: 6, md: 8 },
                            color: 'rgba(255, 255, 255, 0.8)',
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                            px: { xs: 2, sm: 0 },
                        }}
                    >
                        See how Brdge AI helps teams automate tasks and scale their impact
                    </Typography>

                    <Grid container spacing={4}>
                        {demos.map((demo, index) => (
                            <Grid item xs={12} sm={6} md={3} key={demo.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <StyledCard>
                                        <IconWrapper className="icon-wrapper">
                                            {demo.icon}
                                        </IconWrapper>
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 2,
                                                    color: '#4F9CF9'
                                                }}
                                            >
                                                {demo.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {demo.description}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                {demo.value}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ p: 3, pt: 0 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleExploreDemo(demo.url)}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
                                                    color: 'white',
                                                    borderRadius: '50px',
                                                    py: 1.5,
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #00B4DB, #4F9CF9)',
                                                    },
                                                }}
                                            >
                                                Explore Demo
                                            </Button>
                                        </CardActions>
                                    </StyledCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default DemoPage;