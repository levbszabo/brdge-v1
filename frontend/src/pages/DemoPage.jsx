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
import {
    GroupAdd,
    MenuBook,
    PresentToAll,
    BusinessCenter,
    School,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

// Styled Card with a glassy look + subtle gradient
const StyledCard = styled(Card)(({ theme, disabled }) => ({
    height: '100%',
    minHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    filter: disabled ? 'grayscale(20%)' : 'none',
    '&:hover': {
        transform: disabled ? 'none' : 'translateY(-10px)',
        boxShadow: disabled
            ? '0 8px 32px rgba(0, 0, 0, 0.2)'
            : '0 12px 40px rgba(0, 180, 219, 0.2)',
        '& .icon-wrapper': {
            background: disabled
                ? 'rgba(79, 156, 249, 0.1)'
                : 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
            transform: 'scale(1.05)',
        },
        '& .highlight-text': {
            color: '#4FC3F7',
        }
    },
}));

// Icon container with hover glow
const IconWrapper = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.75rem',
    backgroundColor: 'rgba(79, 156, 249, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '& .MuiSvgIcon-root': {
        fontSize: '2.5rem',
        color: '#4F9CF9',
        transition: 'color 0.3s',
    },
    '&:hover': {
        boxShadow: '0 0 15px rgba(79, 156, 249, 0.4)',
        '& .MuiSvgIcon-root': {
            color: '#00FFCC',
            transform: 'scale(1.1)',
        },
    },
});

// Optional Coming Soon banner (if needed for future demos)
const ComingSoonBanner = styled(Box)({
    position: 'absolute',
    top: '24px',
    right: '-35px',
    transform: 'rotate(45deg)',
    backgroundColor: '#4F9CF9',
    color: 'white',
    padding: '6px 40px',
    fontSize: '0.8rem',
    fontWeight: 600,
    zIndex: 2,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    letterSpacing: '0.05em',
});

// Revised demo data – three demos focused on sales/demand gen and onboarding
const demos = [
    {
        id: 1,
        title: 'Interactive Property Tour',
        description:
            'Experience a virtual property walkthrough where the AI answers all your questions about the listing, persuading you like a top real estate agent would.',
        benefits: [
            'Get instant property details',
            'Ask questions about neighborhood',
            'Evaluate potential investment value'
        ],
        stats: 'Users report making more confident property decisions',
        icon: <BusinessCenter />,
        url: 'https://brdge-ai.com/viewBridge/350-6e0eed',
        disabled: false,
    },
    {
        id: 2,
        title: 'Brdge AI Demo & Setup Guide',
        description:
            'See Brdge AI in action and learn how to create your own interactive videos. Ask questions about features, pricing, or technical setup.',
        benefits: [
            'Learn how to build your own Bridge',
            'Understand AI configuration options',
            'See real engagement analytics'
        ],
        stats: 'Most users create their own Bridge after trying this demo',
        icon: <PresentToAll />,
        url: 'https://brdge-ai.com/viewBridge/349-95c580',
        disabled: false,
    },
    {
        id: 3,
        title: 'Interactive Finance Lecture',
        description:
            'Engage with a compound interest lecture featuring practice problems. Ask the AI for clarifications and get instant feedback on your quiz answers.',
        benefits: [
            'Get personalized explanations',
            'Receive instant problem-solving help',
            'Test your understanding with feedback'
        ],
        stats: 'Significantly improves concept retention and engagement',
        icon: <School />,
        url: 'https://brdge-ai.com/viewBridge/344-96eac2',
        disabled: false,
    },
];

const DemoPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    const handleExploreDemo = (url, disabled) => {
        if (disabled) return;
        window.open(url, '_blank');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background:
                    'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
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
                    background:
                        'radial-gradient(circle, rgba(0,180,219,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 15s infinite alternate',
                },
            }}
        >
            <Container maxWidth="lg" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant={isMobile ? 'h3' : 'h2'}
                        component="h1"
                        align="center"
                        sx={{
                            mb: { xs: 2, md: 3 },
                            fontFamily: 'Satoshi',
                            fontWeight: '600',
                            fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                            color: 'white',
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            position: 'relative',
                            textShadow: '0 0 40px rgba(34, 211, 238, 0.25)',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '120px',
                                height: '1px',
                                background:
                                    'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent)',
                                borderRadius: '1px',
                                boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)',
                            },
                        }}
                    >
                        Experience AI Conversations
                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            mb: { xs: 6, md: 8 },
                            fontFamily: 'Satoshi',
                            color: 'rgba(255, 255, 255, 0.8)',
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                            px: { xs: 2, sm: 0 },
                            lineHeight: 1.6,
                        }}
                    >
                        Try these interactive demos to see how Brdge AI transforms ordinary videos into engaging conversations. Ask questions, get instant answers, and imagine what you could create with your own content.
                    </Typography>

                    <Grid container spacing={4}>
                        {demos.map((demo, index) => (
                            <Grid item xs={12} sm={6} md={4} key={demo.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{ height: '100%' }}
                                >
                                    <StyledCard disabled={demo.disabled}>
                                        {demo.disabled && (
                                            <ComingSoonBanner>Coming Soon</ComingSoonBanner>
                                        )}
                                        <IconWrapper
                                            className="icon-wrapper"
                                            sx={{ opacity: demo.disabled ? 0.7 : 1 }}
                                        >
                                            {demo.icon}
                                        </IconWrapper>
                                        <CardContent
                                            sx={{
                                                flexGrow: 1,
                                                p: { xs: 2, sm: 3 },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: { xs: 1.5, sm: 2 },
                                                opacity: demo.disabled ? 0.7 : 1,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#4F9CF9',
                                                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                                    mb: { xs: 0.5, sm: 1 },
                                                }}
                                            >
                                                {demo.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    lineHeight: 1.6,
                                                    mb: { xs: 1.5, sm: 2 },
                                                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                                }}
                                            >
                                                {demo.description}
                                            </Typography>

                                            <Box sx={{ mt: 'auto' }}>
                                                {demo.benefits.map((benefit, idx) => (
                                                    <Box
                                                        key={idx}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: '6px',
                                                                height: '6px',
                                                                borderRadius: '50%',
                                                                backgroundColor: '#4F9CF9',
                                                                mr: 1.5,
                                                                minWidth: '6px',
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            className="highlight-text"
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.8)',
                                                                transition: 'color 0.3s ease',
                                                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                            }}
                                                        >
                                                            {benefit}
                                                        </Typography>
                                                    </Box>
                                                ))}

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        mt: 2,
                                                        py: 1,
                                                        px: 2,
                                                        borderRadius: '4px',
                                                        backgroundColor: 'rgba(79, 156, 249, 0.1)',
                                                        color: '#4FC3F7',
                                                        display: 'inline-block',
                                                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                                        fontWeight: 500,
                                                        width: '100%',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {demo.stats}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                disabled={demo.disabled}
                                                onClick={() =>
                                                    handleExploreDemo(demo.url, demo.disabled)
                                                }
                                                sx={{
                                                    background: demo.disabled
                                                        ? 'rgba(79, 156, 249, 0.3)'
                                                        : 'linear-gradient(45deg, #00B4DB, #4F9CF9)',
                                                    color: 'white',
                                                    borderRadius: '50px',
                                                    py: { xs: 1.2, sm: 1.5 },
                                                    textTransform: 'none',
                                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                                    fontWeight: 500,
                                                    cursor: demo.disabled ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: demo.disabled
                                                            ? 'rgba(79, 156, 249, 0.3)'
                                                            : 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 15px rgba(0, 180, 219, 0.3)',
                                                    },
                                                }}
                                            >
                                                {demo.disabled ? 'Coming Soon' : 'Try Live Demo'}
                                            </Button>
                                        </CardActions>
                                    </StyledCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

            {/* Keyframe for the "float" animation */}
            <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(20px); }
        }
      `}</style>
        </Box>
    );
};

export default DemoPage;
