import React from 'react';
import { Container, Typography, Grid, Paper, Button, Box, useTheme, useMediaQuery, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const PricingTier = ({ title, price, features, buttonText, isPremium }) => {
    const theme = useTheme();
    return (
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Paper elevation={3} sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                background: isPremium ? 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)' : '#ffffff',
                color: isPremium ? '#ffffff' : 'inherit',
            }}>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="h4" component="p" gutterBottom fontWeight="bold">
                    {price}
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    {features.map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckIcon sx={{ mr: 1, color: isPremium ? '#ffffff' : theme.palette.primary.main }} />
                            <Typography variant="body1">{feature}</Typography>
                        </Box>
                    ))}
                </Box>
                <Button
                    component={RouterLink}
                    to="/signup"
                    variant={isPremium ? "contained" : "outlined"}
                    color={isPremium ? "secondary" : "primary"}
                    sx={{ mt: 2, borderRadius: '50px' }}
                >
                    {buttonText}
                </Button>
            </Paper>
        </motion.div>
    );
};

function PricingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const pricingTiers = [
        {
            title: "Free",
            price: "$0/month",
            features: [
                "Up to 2 Brdges",
                "Basic Customization",
                "Limited Analytics",
                "Standard Support"
            ],
            buttonText: "Try for Free"
        },
        {
            title: "Standard",
            price: "$29/month",
            features: [
                "Up to 20 Brdges",
                "Basic Customization",
                "Basic Analytics",
                "Standard Support"
            ],
            buttonText: "Upgrade to Standard"
        },
        {
            title: "Premium",
            price: "$59/month",
            features: [
                "Unlimited Brdges",
                "Full Customization",
                "Advanced Analytics",
                "Priority Support"
            ],
            buttonText: "Upgrade to Premium",
            isPremium: true
        }
    ];

    const useCases = [
        {
            icon: <SchoolIcon fontSize="large" />,
            title: "Effortless Onboarding",
            description: "Turn training documents into engaging, guided sessions that new hires can access anytime. Make onboarding fast, consistent, and easy to follow.",
            subheading: "Streamline training, save time, and ensure consistency."
        },
        {
            icon: <TrendingUpIcon fontSize="large" />,
            title: "Automated Sales Pitches",
            description: "Deliver the perfect pitch every time with AI presenters tailored to your prospect's needs. Reach more clients without being tied to the screen.",
            subheading: "Boost sales efficiency and reach more prospects."
        },
        {
            icon: <MonetizationOnIcon fontSize="large" />,
            title: "Profitable Online Courses",
            description: "Monetize your expertise with interactive, AI-led courses. Share knowledge, increase your reach, and generate revenue by turning content into immersive experiences.",
            subheading: "Scale your knowledge and increase revenue streams."
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
            <Box sx={{ my: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2" component="h1" align="center" sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 4,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        lineHeight: 1.2
                    }}>
                        Choose Your Plan
                    </Typography>
                    <Typography variant="h6" component="p" align="center" sx={{ mb: 6, color: theme.palette.text.secondary }}>
                        Select the perfect plan for your needs
                    </Typography>
                </motion.div>

                <Box display="flex" flexWrap="wrap" gap={4}>
                    {pricingTiers.map((tier, index) => (
                        <Box key={index} flexGrow={1} flexBasis={{ xs: '100%', md: '30%' }}>
                            <PricingTier {...tier} />
                        </Box>
                    ))}
                </Box>

                <Box sx={{ mt: 12, mb: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h2" component="h2" align="center" sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            mb: 3,
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                            background: 'linear-gradient(45deg, #00B4DB 30%, #0083B0 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Create Your First AI Presenter
                        </Typography>
                        <Typography variant="h6" component="p" align="center" sx={{ mb: 6, color: theme.palette.text.secondary, maxWidth: '800px', mx: 'auto' }}>
                            With Brdge AI, transform everyday documents into powerful, interactive presentations. Save time, scale your outreach, and drive engagement like never before.
                        </Typography>
                    </motion.div>

                    <Box sx={{ mb: 8 }}>
                        {useCases.map((useCase, index) => (
                            <React.Fragment key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        p: 3,
                                        mb: 3,
                                        backgroundColor: `rgba(0, 180, 219, 0.05)`,
                                        borderRadius: '16px',
                                    }}>
                                        <Box sx={{ color: theme.palette.primary.main, mr: 3, mt: 1 }}>
                                            {useCase.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                                                {useCase.title}
                                            </Typography>
                                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                                {useCase.subheading}
                                            </Typography>
                                            <Typography variant="body1">
                                                {useCase.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                                {index < useCases.length - 1 && (
                                    <Divider sx={{ my: 3 }} />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                component={RouterLink}
                                to="/signup"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    py: 2,
                                    px: 6,
                                    fontSize: '1.2rem',
                                    borderRadius: '50px',
                                    background: 'linear-gradient(45deg, #00B4DB 30%, #0083B0 90%)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #00A0C2 30%, #006F94 90%)',
                                    },
                                }}
                            >
                                Get Started Free
                            </Button>
                        </motion.div>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default PricingPage;
