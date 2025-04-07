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

// Styled Card with a scholarly/parchment look
const StyledCard = styled(Card)(({ theme, disabled }) => ({
    height: '100%',
    minHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    filter: disabled ? 'grayscale(20%)' : 'none',
    '&:hover': {
        transform: disabled ? 'none' : 'translateY(-10px)',
        boxShadow: disabled
            ? theme.shadows[1]
            : theme.shadows[4],
        '& .icon-wrapper': {
            background: disabled
                ? `${theme.palette.secondary.main}15`
                : theme.palette.secondary.main,
            transform: 'scale(1.05)',
        },
        '& .highlight-text': {
            color: theme.palette.secondary.main,
        }
    },
}));

// Icon container with hover glow
const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.75rem',
    backgroundColor: `${theme.palette.secondary.main}15`,
    transition: 'all 0.3s ease-in-out',
    '& .MuiSvgIcon-root': {
        fontSize: '2.5rem',
        color: theme.palette.secondary.main,
        transition: 'color 0.3s',
    },
    '&:hover': {
        boxShadow: `0 0 15px ${theme.palette.secondary.main}40`,
        '& .MuiSvgIcon-root': {
            color: theme.palette.primary.main,
            transform: 'scale(1.1)',
        },
    },
}));

// Coming Soon ribbon
const ComingSoonBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '26px',
    right: '-32px',
    transform: 'rotate(45deg)',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    padding: '5px 36px',
    fontSize: '0.8rem',
    fontWeight: 600,
    zIndex: 10,
    boxShadow: theme.shadows[2],
    letterSpacing: '0.05em',
}));

// Custom CTA button with theme styling
const GradientButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    borderRadius: '50px',
    padding: '12px 32px',
    fontSize: '1.1rem',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    boxShadow: theme.shadows[2],
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        boxShadow: theme.shadows[4],
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
                bgcolor: theme.palette.background.default,
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 8, md: 12 },
                // Parchment texture background
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
                // Left glow effect
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 15s infinite alternate',
                    zIndex: 0,
                },
            }}
        >
            {/* Right glow effect */}
            <Box
                sx={{
                    content: '""',
                    position: 'absolute',
                    bottom: '5%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'float 12s infinite alternate-reverse',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" ref={ref} sx={{ position: 'relative', zIndex: 1 }}>
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
                            fontFamily: theme.typography.headingFontFamily,
                            fontWeight: '600',
                            fontSize: { xs: '1.8rem', sm: '2.4rem', md: '3rem' },
                            color: theme.palette.text.primary,
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '120px',
                                height: '2px',
                                background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}80, transparent)`,
                                borderRadius: '1px',
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
                            fontFamily: theme.typography.fontFamily,
                            color: theme.palette.text.secondary,
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
                                                                color: theme.palette.secondary.main,
                                                                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                                                                mb: { xs: 0.5, sm: 1 },
                                                            }}
                                                        >
                                                            {demo.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: theme.palette.text.primary,
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
                                                                            backgroundColor: theme.palette.secondary.main,
                                                                            mr: 1.5,
                                                                            minWidth: '6px',
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        variant="body2"
                                                                        className="highlight-text"
                                                                        sx={{
                                                                            color: theme.palette.text.secondary,
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
                                                                    backgroundColor: `${theme.palette.secondary.main}10`,
                                                                    color: theme.palette.secondary.main,
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
                                                            color="primary"
                                                            disabled={demo.disabled}
                                                            onClick={() =>
                                                                handleExploreDemo(demo.url, demo.disabled)
                                                            }
                                                            sx={{
                                                                borderRadius: '50px',
                                                                py: { xs: 1.2, sm: 1.5 },
                                                                textTransform: 'none',
                                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                                fontWeight: 500,
                                                                cursor: demo.disabled ? 'not-allowed' : 'pointer',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
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
                                                        backgroundColor: `${theme.palette.secondary.main}10`,
                                                    }}>
                                                        {demo.icon}
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: theme.palette.secondary.main,
                                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                                mb: 0.5,
                                                            }}
                                                        >
                                                            {demo.title}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: theme.palette.text.secondary,
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
                                    bgcolor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    p: { xs: 3, sm: 4 },
                                    zIndex: 2,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: `linear-gradient(90deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                                    }
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem' },
                                        fontWeight: 700,
                                        mb: 2,
                                        color: theme.palette.text.primary,
                                        lineHeight: 1.2,
                                        fontFamily: theme.typography.headingFontFamily,
                                    }}
                                >
                                    Want a Custom AI Demo for Your Course?
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '0.95rem', sm: '1rem' },
                                        color: theme.palette.text.secondary,
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
                                                    color: theme.palette.secondary.main,
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
                                                        color: theme.palette.secondary.main,
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {feature.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                                                        color: theme.palette.text.secondary,
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
                                                backgroundColor: `${theme.palette.secondary.main}05`,
                                                border: `1px solid ${theme.palette.secondary.main}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: `0 0 50px ${theme.palette.secondary.main}15`,
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: '-15px',
                                                    left: '-15px',
                                                    right: '-15px',
                                                    bottom: '-15px',
                                                    borderRadius: '50%',
                                                    border: `1px solid ${theme.palette.secondary.main}10`,
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
                                                    border: `1px solid ${theme.palette.secondary.main}05`,
                                                    animation: 'pulse 3s infinite ease-in-out 1.5s',
                                                },
                                            }}
                                        >
                                            <Chat
                                                sx={{
                                                    fontSize: '65px',
                                                    color: theme.palette.secondary.main,
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
                                                    backgroundColor: `${theme.palette.background.paper}80`,
                                                    backdropFilter: 'blur(5px)',
                                                    animation: 'float 4s ease-in-out infinite',
                                                }}
                                            >
                                                <School
                                                    sx={{
                                                        fontSize: '24px',
                                                        color: theme.palette.primary.main,
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
                                                    backgroundColor: `${theme.palette.background.paper}80`,
                                                    backdropFilter: 'blur(5px)',
                                                    animation: 'float 4s ease-in-out infinite 2s',
                                                }}
                                            >
                                                <AutoAwesome
                                                    sx={{
                                                        fontSize: '20px',
                                                        color: theme.palette.secondary.main,
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
