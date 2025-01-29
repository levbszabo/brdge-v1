import React from 'react';
import { Container, Typography, Grid, Box, Button, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import { Check, Star } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const PricingTier = ({ tier, isPopular, delay }) => {
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
            style={{ position: 'relative', zIndex: isPopular ? 2 : 1 }}
        >
            <Box
                sx={{
                    position: 'relative',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    p: { xs: 3, sm: 3.5, md: 4 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, z-index 0s',
                    zIndex: 1,
                    '&:hover': {
                        transform: 'translateY(-10px)',
                        zIndex: 3,
                    },
                    ...(isPopular && {
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -1,
                            padding: '1px',
                            background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
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
                            top: 20,
                            right: 20,
                            color: '#4F9CF9',
                        }}
                    >
                        <Star />
                    </Box>
                )}
                <Typography variant="h3" component="h2"
                    sx={{
                        mb: 2,
                        color: isPopular ? '#4F9CF9' : 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}
                >
                    {tier.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
                    {tier.description}
                </Typography>
                <Typography variant="h4" sx={{ mb: 4, color: 'white', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
                    ${tier.price}
                    <Typography component="span" variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        /month
                    </Typography>
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    {tier.features.map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Check sx={{ mr: 1, color: '#4F9CF9' }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    component={Link}
                    to="/signup"
                    variant="outlined"
                    sx={{
                        mt: 4,
                        position: 'relative',
                        zIndex: 2,
                        background: isPopular ? 'linear-gradient(45deg, #4F9CF9, #00B4DB)' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        py: { xs: 1.25, sm: 1.5 },
                        borderRadius: '50px',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&:hover': {
                            background: isPopular ? 'linear-gradient(45deg, #00B4DB, #4F9CF9)' : 'rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.05)',
                            boxShadow: isPopular ? '0 6px 20px rgba(79, 156, 249, 0.4)' : 'none',
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

    const tiers = [
        {
            name: 'Free',
            price: '0',
            description: 'Perfect for getting started',
            features: [
                '1 Bridge',
                '30 Minutes Monthly Usage',
                'Basic Customization',
                'Limited Analytics',
                'Standard Support'
            ],
        },
        {
            name: 'Standard',
            price: '29',
            description: 'For growing businesses',
            features: [
                'Up to 10 Bridges',
                '120 Minutes Monthly Usage',
                'Basic Customization',
                'Basic Analytics',
                'Standard Support'
            ],
        },
        {
            name: 'Premium',
            price: '59',
            description: 'For teams and enterprises',
            features: [
                'Unlimited Bridges',
                '300 Minutes Monthly Usage',
                'Full Customization',
                'Advanced Analytics',
                'Priority Support'
            ],
        },
    ];

    return (
        <ParallaxProvider>
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
                {/* Geometric shapes */}
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
                                    background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent)',
                                    borderRadius: '1px',
                                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)'
                                }
                            }}
                        >
                            Choose Your Plan
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                mb: 8,
                                fontFamily: 'Satoshi',
                                color: 'rgba(255, 255, 255, 0.8)',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                                fontWeight: '400',
                                letterSpacing: '0.01em',
                                lineHeight: 1.6
                            }}
                        >
                            Select the perfect plan for your needs. Usage minutes are calculated based on AI presentation time.
                        </Typography>
                    </motion.div>

                    <Grid container spacing={{ xs: 3, sm: 4 }}>
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

                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            mt: 4,
                            fontFamily: 'Satoshi',
                            color: 'rgba(255, 255, 255, 0.8)',
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                            fontWeight: '400',
                            letterSpacing: '0.01em',
                            lineHeight: 1.6,
                            '& span': {
                                color: '#4F9CF9',
                                fontWeight: 500
                            }
                        }}
                    >
                        Standard and Premium plans are billed at <span>$0.12 per minute</span> for usage above the included monthly minutes.
                    </Typography>
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
