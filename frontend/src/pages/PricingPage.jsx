import React from 'react';
import { Container, Typography, Grid, Paper, Button, Box, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';

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
                "2 Monthly Brdges",
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

                <Grid container spacing={4}>
                    {pricingTiers.map((tier, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <PricingTier {...tier} />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 8 }}>
                    <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                        Plan Breakdown
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Free:</strong> Best for new users exploring Brdge AI. Includes up to 2 Brdges per month, basic customization, and limited analytics.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Standard ($29/month):</strong> Ideal for individual users or small teams. Provides up to 20 Brdges per month, standard customization, and basic analytics.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Premium ($59/month):</strong> Suited for heavy users or larger teams. Offers unlimited Brdges, full customization, advanced analytics, and priority support.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default PricingPage;
