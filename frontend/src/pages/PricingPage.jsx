import React from 'react';
import { Container, Typography, Grid, Box, Button, useTheme, useMediaQuery, Card, CardContent, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import { useInView } from 'react-intersection-observer';
import { Check, Star } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

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
            style={{
                position: 'relative',
                zIndex: isPopular ? 2 : 1,
                height: '100%'
            }}
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
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                        mb: 2,
                        color: isPopular ? '#4F9CF9' : 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                    }}
                >
                    {tier.name}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    {tier.description}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        color: 'white',
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                    }}
                >
                    ${tier.price}
                    <Typography
                        component="span"
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                        /month
                    </Typography>
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    {tier.features.map((feature, index) => (
                        <Box
                            key={index}
                            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                            <Check sx={{ mr: 1, color: '#4F9CF9' }} />
                            <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                            >
                                {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    component={RouterLink}
                    to="/signup"
                    variant="outlined"
                    sx={{
                        mt: 4,
                        position: 'relative',
                        zIndex: 2,
                        background: isPopular
                            ? 'linear-gradient(45deg, #4F9CF9, #00B4DB)'
                            : 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        py: { xs: 1.25, sm: 1.5 },
                        borderRadius: '50px',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        fontWeight: 500,
                        letterSpacing: '0.03em',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            background: isPopular
                                ? 'linear-gradient(45deg, #00B4DB, #4F9CF9)'
                                : 'rgba(255, 255, 255, 0.1)',
                            transform: 'scale(1.05)',
                            boxShadow: isPopular
                                ? '0 6px 20px rgba(79, 156, 249, 0.4)'
                                : '0 4px 15px rgba(255, 255, 255, 0.1)',
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

    // Updated pricing tiers
    const tiers = [
        {
            name: 'Free',
            price: '0',
            description: 'Just getting started',
            features: [
                '1 Bridge',
                '30 Minutes Monthly Usage',
                'Email Support',
                'Basic Customization',
            ],
        },
        {
            name: 'Standard',
            price: '99',
            description: 'Ideal for small teams',
            features: [
                'Up to 10 Bridges',
                '300 Minutes Monthly Usage',
                'Email Support',
                'Basic Customization',
            ],
        },
        {
            name: 'Premium',
            price: '249',
            description: 'Best for larger teams',
            features: [
                'Unlimited Bridges',
                '1000 Minutes Monthly Usage',
                'Priority Support',
                'Advanced Customization',
            ],
        },
    ];

    return (
        <ParallaxProvider>
            <Box
                sx={{
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
                    }}
                />

                <Container maxWidth="lg" ref={ref}>
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
                                mb: { xs: 4, md: 6 },
                                fontFamily: 'Satoshi',
                                fontWeight: 600,
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
                                mb: 2,
                                fontFamily: 'Satoshi',
                                color: 'rgba(255, 255, 255, 0.9)',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                                fontWeight: 500,
                                letterSpacing: '0.01em',
                                lineHeight: 1.6
                            }}
                        >
                            Select the perfect plan to supercharge your sales and demand generation.
                        </Typography>
                        <Typography
                            align="center"
                            sx={{
                                mb: 8,
                                fontFamily: 'Satoshi',
                                color: '#4FC3F7',
                                maxWidth: '800px',
                                mx: 'auto',
                                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
                                fontWeight: 400,
                                letterSpacing: '0.02em',
                                textShadow: '0 0 10px rgba(79, 195, 247, 0.3)',
                                opacity: 0.9
                            }}
                        >
                            Additional minutes are billed at $0.12/minute
                        </Typography>
                    </motion.div>

                    <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} sx={{ position: 'relative', zIndex: 2 }}>
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
                    <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 400,
                            }}
                        >
                            For Enterprise or Custom solutions please{' '}
                            <Link
                                component={RouterLink}
                                to="/contact"
                                sx={{
                                    color: '#00ffcc',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#22d3ee',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Contact Us
                            </Link>
                        </Typography>
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
