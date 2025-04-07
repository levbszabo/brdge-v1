import React from 'react';
import { Container, Typography, Grid, Box, Button, useTheme, useMediaQuery, Card, CardContent, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import { Check, Star } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

const PricingTier = ({ tier, isPopular, delay }) => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay }}
            style={{
                position: 'relative',
                zIndex: isPopular ? 2 : 1,
                height: '100%'
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    p: { xs: 2.5, sm: 3, md: 3.5 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, z-index 0s, box-shadow 0.3s ease',
                    zIndex: 1,
                    '&:hover': {
                        transform: 'translateY(-10px)',
                        zIndex: 3,
                        boxShadow: theme.shadows[3],
                    },
                    ...(isPopular && {
                        boxShadow: `0 8px 25px ${theme.palette.secondary.main}30`,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -1,
                            padding: '1px',
                            background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude',
                            zIndex: 0,
                        }
                    })
                }}
            >
                {isPopular && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 14,
                            right: 14,
                            backgroundColor: `${theme.palette.secondary.main}15`,
                            borderRadius: '12px',
                            px: 1.5,
                            py: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        <Star sx={{ color: theme.palette.secondary.main, fontSize: '0.9rem' }} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.secondary.main,
                                fontWeight: 600,
                                letterSpacing: '0.02em',
                                fontSize: '0.75rem'
                            }}
                        >
                            MOST POPULAR
                        </Typography>
                    </Box>
                )}
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                        mb: 0.5,
                        color: isPopular ? theme.palette.secondary.main : theme.palette.text.primary,
                        fontWeight: 'bold',
                        fontFamily: theme.typography.headingFontFamily,
                        fontSize: { xs: '1.6rem', sm: '1.75rem', md: '2.2rem' }
                    }}
                >
                    {tier.name}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 2,
                        color: isPopular ? theme.palette.secondary.light : theme.palette.text.secondary,
                        fontWeight: 500,
                        fontSize: { xs: '0.9rem', sm: '0.95rem' }
                    }}
                >
                    {tier.description}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        color: theme.palette.text.primary,
                        fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' },
                        fontWeight: 700
                    }}
                >
                    ${tier.price}
                    <Typography
                        component="span"
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            ml: 0.5
                        }}
                    >
                        /month
                    </Typography>
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    {tier.features.map((feature, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                mb: 2,
                                ...(index < 2 && {
                                    pb: 1.5,
                                    borderBottom: index === 0 ? `1px dashed ${theme.palette.divider}` : 'none'
                                })
                            }}
                        >
                            <Check sx={{
                                mr: 1.5,
                                color: isPopular ? theme.palette.primary.main : theme.palette.secondary.main,
                                mt: 0.2,
                                fontSize: '1.1rem'
                            }} />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: index < 2 ? theme.palette.text.primary : theme.palette.text.secondary,
                                    fontWeight: index < 2 ? 500 : 400,
                                    lineHeight: 1.3,
                                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                                }}
                            >
                                {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    component={RouterLink}
                    to="/signup"
                    variant={isPopular ? "contained" : "outlined"}
                    color={isPopular ? "primary" : "secondary"}
                    sx={{
                        mt: 3,
                        position: 'relative',
                        zIndex: 2,
                        py: { xs: 1.25, sm: 1.4 },
                        borderRadius: '50px',
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    Get Started
                </Button>
            </Box>
        </motion.div>
    );
};

function PricingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    // Updated pricing tiers for educational focus
    const tiers = [
        {
            name: 'Free',
            price: '0',
            description: 'Perfect for individual educators',
            features: [
                '1 Course with 1 Module',
                '30 Minutes of Student Engagement per month',
                'Email Support',
                'Basic Customization',
            ],
        },
        {
            name: 'Standard',
            price: '99',
            description: 'Ideal for course creators',
            features: [
                '1 Course with up to 10 Modules',
                '300 Minutes of Student Engagement per month',
                'Priority Email Support',
                'Advanced Customization',
                'Basic Student Analytics',
            ],
        },
        {
            name: 'Premium',
            price: '249',
            description: 'Best for institutions',
            features: [
                'Unlimited Courses and Modules',
                '1000 Minutes of Student Engagement per month',
                'Priority Support',
                'Complete Customization',
                'Comprehensive Student Analytics',
            ],
        },
    ];

    return (
        <ParallaxProvider>
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: theme.palette.background.default,
                    position: 'relative',
                    overflow: 'hidden',
                    py: { xs: 4, md: 6 },
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
                    // Add subtle glow effects in sepia/ink
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '10%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        animation: 'float 20s infinite alternate-reverse',
                        zIndex: 0
                    }
                }}
            >
                {/* Floating Geometric Shape */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '15%',
                        left: '5%',
                        width: '300px',
                        height: '300px',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '50%',
                        animation: 'rotate 20s linear infinite',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -1,
                            borderRadius: 'inherit',
                            padding: '1px',
                            background: `linear-gradient(45deg, transparent, ${theme.palette.secondary.main}30)`,
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            maskComposite: 'exclude'
                        }
                    }}
                />

                <Container maxWidth="lg" ref={ref} sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant={isMobile ? 'h3' : 'h2'}
                            component="h1"
                            align="center"
                            sx={{
                                mb: { xs: 2.5, md: 3 },
                                fontFamily: theme.typography.headingFontFamily,
                                fontWeight: 700,
                                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3.0rem' },
                                color: theme.palette.text.primary,
                                textTransform: 'none',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.3,
                                paddingBottom: '0.2em',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '120px',
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}80, transparent)`,
                                    borderRadius: '1px',
                                }
                            }}
                        >
                            Pricing for Course Creators
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                mb: 2,
                                fontFamily: theme.typography.fontFamily,
                                color: theme.palette.text.primary,
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                                fontWeight: 500,
                                letterSpacing: '0.01em',
                                lineHeight: 1.5
                            }}
                        >
                            Choose the perfect plan to create interactive courses and enhance student engagement.
                        </Typography>

                        <Box
                            sx={{
                                p: { xs: 1.5, sm: 2 },
                                mb: 3,
                                maxWidth: '850px',
                                mx: 'auto',
                                backgroundColor: `${theme.palette.secondary.main}08`,
                                borderRadius: '12px',
                                border: `1px solid ${theme.palette.secondary.main}20`,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{
                                    fontFamily: theme.typography.fontFamily,
                                    color: theme.palette.secondary.main,
                                    maxWidth: '800px',
                                    mx: 'auto',
                                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                    fontWeight: 500,
                                    letterSpacing: '0.02em',
                                    lineHeight: 1.5
                                }}
                            >
                                <strong>How it works:</strong> Each plan includes a fixed number of courses and interactive modules.
                                Student engagement minutes are allocated monthly and additional minutes are billed at $0.12/minute.
                            </Typography>
                        </Box>
                    </motion.div>

                    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ position: 'relative', zIndex: 2 }}>
                        {tiers.map((tier, index) => (
                            <Grid item xs={12} sm={6} md={4} key={tier.name}>
                                <PricingTier
                                    tier={tier}
                                    isPopular={index === 1}
                                    delay={index * 0.2}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Enterprise/Custom solutions text */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            mt: 6,
                            mb: 4,
                            p: 3,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: theme.palette.text.primary,
                                fontFamily: theme.typography.headingFontFamily,
                                fontSize: { xs: '1.2rem', sm: '1.35rem' },
                                fontWeight: 600,
                                mb: 2
                            }}
                        >
                            For Educational Institutions or Custom Solutions please{' '}
                            <Link
                                component={RouterLink}
                                to="/contact"
                                sx={{
                                    color: theme.palette.primary.main,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: theme.palette.primary.dark,
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Contact Us
                            </Link>
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.secondary,
                                maxWidth: '850px',
                                mx: 'auto',
                                px: 2,
                                mb: 2,
                                lineHeight: 1.6,
                                fontSize: { xs: '0.95rem', sm: '1rem' }
                            }}
                        >
                            We offer a range of service-based solutions including{' '}
                            <span style={{ color: theme.palette.secondary.main, fontWeight: 600 }}>Implementation Services</span> for LMS integration,{' '}
                            <span style={{ color: theme.palette.secondary.main, fontWeight: 600 }}>Course Development</span> to transform your materials into interactive experiences,{' '}
                            and <span style={{ color: theme.palette.secondary.main, fontWeight: 600 }}>Managed Solutions</span> with dedicated support for educational institutions.
                        </Typography>

                        <Button
                            component={RouterLink}
                            to="/contact"
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 1.5,
                                py: { xs: 1.25, sm: 1.4 },
                                px: 4,
                                borderRadius: '50px',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                fontWeight: 600,
                                letterSpacing: '0.03em',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            Learn About Our Services
                        </Button>
                    </Box>
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
          `}
                </style>
            </Box>
        </ParallaxProvider>
    );
}

export default PricingPage;
