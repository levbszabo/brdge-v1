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
    Divider,
    Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
    School,
    Chat,
    CheckCircle,
    AutoAwesome,
    ArrowForward,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { useNavigate, Link } from 'react-router-dom';

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

// Coming Soon ribbon
const ComingSoonBadge = styled(Box)({
    position: 'absolute',
    top: '26px',
    right: '-32px',
    transform: 'rotate(45deg)',
    backgroundColor: '#4F9CF9',
    color: 'white',
    padding: '5px 36px',
    fontSize: '0.8rem',
    fontWeight: 600,
    zIndex: 10,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    letterSpacing: '0.05em',
});

// Custom CTA button with gradient
const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #00ffcc, #00B4DB)',
    color: '#000000',
    fontWeight: 600,
    borderRadius: '50px',
    padding: '12px 32px',
    fontSize: '1.1rem',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 255, 204, 0.3)',
    '&:hover': {
        background: 'linear-gradient(45deg, #00B4DB, #00ffcc)',
        boxShadow: '0 6px 20px rgba(0, 255, 204, 0.4)',
        transform: 'translateY(-2px)',
    }
}));

// Array of demos, with the first one active and others coming soon
const demos = [
    {
        id: 1,
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
    {
        id: 2,
        title: 'Biology Concepts Explorer',
        description:
            'An interactive lesson on cellular biology concepts with visual aids. Ask questions about cell structure, function, and processes.',
        benefits: [
            'Visualize complex biological processes',
            'Personalized explanations of concepts',
            'Interactive diagrams and models'
        ],
        stats: 'Makes abstract concepts easier to understand',
        icon: <School />,
        url: '#',
        disabled: true,
    },
    {
        id: 3,
        title: 'History Timeline Navigator',
        description:
            'Explore historical events and timelines with an AI guide that can answer questions about causes, effects, and connections between events.',
        benefits: [
            'Connect historical dots across eras',
            'Understand cause and effect relationships',
            'Contextualize events with AI insights'
        ],
        stats: 'Helps students grasp historical context and connections',
        icon: <School />,
        url: '#',
        disabled: true,
    }
];

// Feature list for the request a demo section
const customDemoFeatures = [
    {
        title: "Customized for Your Course Content",
        description: "We'll transform your lecture or course material into an interactive AI experience."
    },
    {
        title: "Your Teaching Voice & Style",
        description: "The AI assistant will reflect your unique teaching approach and personality."
    },
    {
        title: "Tailored Learning Outcomes",
        description: "We'll focus on your specific educational goals and student learning objectives."
    },
    {
        title: "Analytics Dashboard",
        description: "See what questions students ask most and identify knowledge gaps."
    }
];

const DemoPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    const handleExploreDemo = (url, disabled) => {
        if (disabled) return;
        window.open(url, '_blank');
    };

    const handleContactClick = () => {
        navigate('/contact');
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
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '5%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background:
                        'radial-gradient(circle, rgba(0,255,204,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 12s infinite alternate-reverse',
                    zIndex: 0,
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
                            fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3rem' },
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
                        See Your Course Come Alive with AI
                    </Typography>

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            mb: { xs: 4, md: 6 },
                            fontFamily: 'Satoshi',
                            color: 'rgba(255, 255, 255, 0.8)',
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.15rem' },
                            px: { xs: 2, sm: 0 },
                            lineHeight: 1.5,
                        }}
                    >
                        Give your students instant, personalized guidance in your voice, available 24/7. Transform your teaching expertise into an AI assistant that answers questions, boosts completion rates by 65%, and saves you 15+ hours weekly on repetitive explanations.
                    </Typography>

                    {/* Side by side layout */}
                    <Grid container spacing={4} alignItems="stretch">
                        {/* Demo Cards - Left Side */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: { xs: 3, md: 4 }
                            }}>
                                {demos.map((demo, index) => (
                                    <motion.div
                                        key={demo.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <StyledCard disabled={demo.disabled} sx={{
                                            height: '100%',
                                            minHeight: index === 0 ? '320px' : '180px',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            {demo.disabled && (
                                                <ComingSoonBadge>Coming Soon</ComingSoonBadge>
                                            )}

                                            {index === 0 ? (
                                                // Full expanded card for the active demo
                                                <>
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
                                                            Try Live Education Demo
                                                        </Button>
                                                    </CardActions>
                                                </>
                                            ) : (
                                                // Compact card for the "coming soon" demos
                                                <Box sx={{
                                                    display: 'flex',
                                                    height: '100%',
                                                    alignItems: 'center',
                                                    p: { xs: 2, sm: 3 },
                                                    opacity: 0.8,
                                                }}>
                                                    <Box sx={{
                                                        mr: 3,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '60px',
                                                        height: '60px',
                                                        flexShrink: 0,
                                                        borderRadius: '12px',
                                                        backgroundColor: 'rgba(79, 156, 249, 0.1)',
                                                    }}>
                                                        {demo.icon}
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: '#4F9CF9',
                                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            {demo.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.75)',
                                                                lineHeight: 1.5,
                                                                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            {demo.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </StyledCard>
                                    </motion.div>
                                ))}
                            </Box>
                        </Grid>

                        {/* Request Custom Demo Section - Right Side */}
                        <Grid item xs={12} md={6}>
                            <Box
                                component={Paper}
                                elevation={0}
                                sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    p: { xs: 3, sm: 4 },
                                    zIndex: 2,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #00ffcc, #00B4DB, #00ffcc)',
                                    }
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
                                        fontWeight: 700,
                                        mb: 2,
                                        color: 'white',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    Want a Custom AI Demo for Your Course?
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '0.95rem', sm: '1rem' },
                                        color: 'rgba(255, 255, 255, 0.85)',
                                        mb: 3,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Let us create a personalized AI teaching assistant demo using your actual course content. See how your students could interact with an AI version of you that answers questions in your teaching style.
                                </Typography>

                                <Box sx={{ mb: 4 }}>
                                    {customDemoFeatures.map((feature, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: 2,
                                            }}
                                        >
                                            <CheckCircle
                                                sx={{
                                                    color: '#00ffcc',
                                                    mr: 1.5,
                                                    fontSize: '1.25rem',
                                                    mt: 0.2,
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontSize: { xs: '0.95rem', sm: '1rem' },
                                                        fontWeight: 600,
                                                        color: '#00ffcc',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {feature.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                        color: 'rgba(255, 255, 255, 0.75)',
                                                    }}
                                                >
                                                    {feature.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                    <GradientButton
                                        component={Link}
                                        to="/contact"
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForward />}
                                        sx={{ minWidth: '220px' }}
                                    >
                                        Request a Custom Demo
                                    </GradientButton>

                                    <Box sx={{ display: { xs: 'none', sm: 'block' }, width: '140px', height: '140px', position: 'relative' }}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                position: 'relative',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(0, 255, 204, 0.05)',
                                                border: '1px solid rgba(0, 255, 204, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 0 50px rgba(0, 255, 204, 0.15)',
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: '-15px',
                                                    left: '-15px',
                                                    right: '-15px',
                                                    bottom: '-15px',
                                                    borderRadius: '50%',
                                                    border: '1px solid rgba(0, 255, 204, 0.1)',
                                                    animation: 'pulse 3s infinite ease-in-out',
                                                },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: '-30px',
                                                    left: '-30px',
                                                    right: '-30px',
                                                    bottom: '-30px',
                                                    borderRadius: '50%',
                                                    border: '1px solid rgba(0, 255, 204, 0.05)',
                                                    animation: 'pulse 3s infinite ease-in-out 1.5s',
                                                },
                                            }}
                                        >
                                            <Chat
                                                sx={{
                                                    fontSize: '65px',
                                                    color: '#00ffcc',
                                                    opacity: 0.8,
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '15%',
                                                    right: '-10%',
                                                    padding: '10px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    backdropFilter: 'blur(5px)',
                                                    animation: 'float 4s ease-in-out infinite',
                                                }}
                                            >
                                                <School
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: '#00B4DB',
                                                    }}
                                                />
                                            </Box>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: '10%',
                                                    left: '-5%',
                                                    padding: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    backdropFilter: 'blur(5px)',
                                                    animation: 'float 4s ease-in-out infinite 2s',
                                                }}
                                            >
                                                <AutoAwesome
                                                    sx={{
                                                        fontSize: '20px',
                                                        color: '#00ffcc',
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>

            {/* Keyframes for animations */}
            <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
                    50% { transform: translateY(20px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes pulse {
                    0% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                    100% { opacity: 0.4; transform: scale(1); }
        }
      `}</style>
        </Box>
    );
};

export default DemoPage;
