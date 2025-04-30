import React from 'react';
import { Container, Typography, Grid, Box, Button, useTheme, useMediaQuery, Divider, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Star } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

const PricingTier = ({ tier, isPopular, delay }) => {
    const theme = useTheme();
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            style={{ height: '100%' }}
        >
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 3, md: 4 },
                    border: '1px solid',
                    borderColor: isPopular ? 'primary.main' : 'divider',
                    borderWidth: isPopular ? '2px' : '1px',
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: isPopular ? theme.shadows[2] : theme.shadows[1],
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[3],
                    },
                    ...(isPopular && {
                        transform: { md: 'scale(1.03)' },
                        '&:hover': {
                            transform: { md: 'scale(1.03) translateY(-5px)' },
                        }
                    })
                }}
            >
                {isPopular && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            px: 1.5,
                            py: 0.3,
                            borderRadius: '99px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                        }}
                    >
                        MOST POPULAR
                    </Box>
                )}
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                        mt: 0
                    }}
                >
                    {tier.name}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 3,
                        color: 'text.secondary',
                        minHeight: '48px'
                    }}
                >
                    {tier.description}
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                        mb: 4,
                        color: 'text.primary',
                        fontWeight: 600,
                    }}
                >
                    ${tier.price}
                    <Typography
                        component="span"
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            ml: 0.5
                        }}
                    >
                        /month
                    </Typography>
                </Typography>
                <Box sx={{ flexGrow: 1, mb: 3 }}>
                    {tier.features.map((feature, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1.5
                            }}
                        >
                            <Check sx={{
                                mr: 1.5,
                                color: 'primary.main',
                                fontSize: '1.2rem'
                            }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.primary',
                                    lineHeight: 1.5
                                }}
                            >
                                {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    component={RouterLink}
                    to={`/signup?plan=${tier.name.toLowerCase()}`}
                    variant={isPopular ? "contained" : "outlined"}
                    color="primary"
                    fullWidth
                    sx={{ mt: 'auto' }}
                >
                    Choose {tier.name}
                </Button>
            </Box>
        </motion.div>
    );
};

function PricingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const tiers = [
        {
            name: 'Free',
            price: '0',
            description: 'Get started with the basics',
            features: [
                "1 bridge Link",
                "Basic AI Q&A",
                "Voice Clone",
                "Basic Analytics",
                "1 Course Limit",
                "Watermark"
            ],
        },
        {
            name: 'Standard',
            price: '49',
            description: 'For creators scaling their content',
            features: [
                "10 bridge Links",
                "300 AI Minutes/mo",
                "Voice Clone",
                "Basic Analytics",
                "1 Course Limit",
                "Watermark"
            ],
        },
        {
            name: 'Premium',
            price: '149',
            description: 'Unlock full power & customization',
            features: [
                "Unlimited Links",
                "1000 AI Minutes/mo",
                "Unlimited Courses",
                "Voice Clone",
                "CRM / Webhooks",
                "Adv. Analytics",
                "No Watermark"
            ],
        },
    ];

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                bgcolor: theme.palette.background.default,
                py: { xs: 6, md: 10 },
                overflow: 'hidden'
            }}
        >
            <Container maxWidth="lg" ref={ref} sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        align="center"
                        sx={{
                            mb: 2,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Simple Pricing for Growth
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            mb: 6,
                            color: theme.palette.text.secondary,
                            maxWidth: '700px',
                            mx: 'auto',
                        }}
                    >
                        Choose the plan that fits your needs. Start free or unlock powerful features to engage your audience and drive results.
                    </Typography>
                </motion.div>

                <Grid container spacing={4} sx={{ position: 'relative', zIndex: 2 }} alignItems="stretch">
                    {tiers.map((tier, index) => (
                        <Grid item xs={12} md={4} key={tier.name}>
                            <PricingTier
                                tier={tier}
                                isPopular={index === 1}
                                delay={index * 0.15}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box
                    sx={{
                        textAlign: 'center',
                        mt: 8,
                        mb: 4,
                        py: 4,
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            mb: 2
                        }}
                    >
                        Need a Custom Solution?
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            maxWidth: '650px',
                            mx: 'auto',
                            mb: 3,
                            lineHeight: 1.6,
                        }}
                    >
                        For enterprise needs, high-volume usage, or specific integrations, contact our sales team for tailored solutions and dedicated support.
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/contact"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 1.5 }}
                    >
                        Contact Sales
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default PricingPage;
