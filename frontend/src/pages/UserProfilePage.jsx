import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Avatar,
    useTheme,
    Button,
    Grid,
    Divider,
    Card,
    CardContent,
    Chip,
    Alert,
    LinearProgress,
    Dialog,
    DialogContent
} from '@mui/material';
import { api } from '../api';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import StarIcon from '@mui/icons-material/Star';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion } from 'framer-motion';

const SubscriptionTier = ({ title, price, features, buttonText, isActive, onClick, isPremium, tier }) => {
    const theme = useTheme();
    const handleClick = () => {
        localStorage.setItem('selected_tier', tier);
        onClick();
    };

    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Paper elevation={3} sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                background: isPremium ? 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)' : '#ffffff',
                color: isPremium ? '#ffffff' : 'inherit',
                border: isActive ? `2px solid ${theme.palette.primary.main}` : 'none',
            }}>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="h4" component="p" gutterBottom fontWeight="bold">
                    {price}
                </Typography>
                <Box sx={{ flexGrow: 1, my: 2 }}>
                    {features.map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckIcon sx={{ mr: 1, color: isPremium ? '#ffffff' : theme.palette.primary.main }} />
                            <Typography variant="body1">{feature}</Typography>
                        </Box>
                    ))}
                </Box>
                {!isActive && (
                    <Button
                        variant={isPremium ? "contained" : "outlined"}
                        color={isPremium ? "secondary" : "primary"}
                        onClick={handleClick}
                        sx={{
                            mt: 2,
                            borderRadius: '50px',
                            backgroundColor: isPremium ? '#ffffff' : undefined,
                            color: isPremium ? '#0083B0' : undefined,
                            '&:hover': {
                                backgroundColor: isPremium ? '#f5f5f5' : undefined,
                            }
                        }}
                    >
                        {buttonText}
                    </Button>
                )}
                {isActive && (
                    <Typography
                        variant="subtitle1"
                        sx={{
                            mt: 2,
                            textAlign: 'center',
                            color: isPremium ? '#ffffff' : theme.palette.primary.main,
                            fontWeight: 'bold'
                        }}
                    >
                        Current Plan
                    </Typography>
                )}
            </Paper>
        </motion.div>
    );
};

const styles = {
    gradientText: {
        background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    premiumGradient: {
        background: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
        color: 'white',
        transition: 'all 0.3s ease'
    }
};

function BillingCard({ userProfile, currentPlan, onSubscriptionChange, onManageSubscription }) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState(null);

    // Calculate next billing date (one month from now)
    const nextBillingDate = userProfile?.account?.next_billing_date ?
        new Date(userProfile.account.next_billing_date) :
        new Date(new Date().setMonth(new Date().getMonth() + 1));

    const handleCancelSubscription = async () => {
        try {
            setCancelling(true);
            const response = await api.post('/cancel-subscription');

            if (response.data.success) {
                if (onSubscriptionChange) {
                    onSubscriptionChange();
                }
                setOpenConfirmDialog(false);
            } else {
                setError(response.data.message || 'Failed to cancel subscription');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel subscription');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ ...styles.glassCard, p: 4, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon color="primary" />
                Billing Information
            </Typography>
            <Divider sx={{ my: 2 }} />

            {currentPlan !== 'free' ? (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography color="text.secondary">Plan</Typography>
                                <Typography fontWeight="bold">
                                    {currentPlan === 'pro' ? 'Premium' : 'Standard'} Plan
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography color="text.secondary">Billing Period</Typography>
                                <Typography>Monthly</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography color="text.secondary">Next Payment</Typography>
                                <Typography>{nextBillingDate.toLocaleDateString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography color="text.secondary">Payment Method</Typography>
                                <Chip
                                    icon={<PaymentIcon />}
                                    label="••••4242"
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={onManageSubscription}
                                    startIcon={<AutorenewIcon />}
                                    sx={{ borderRadius: '50px' }}
                                >
                                    Manage Subscription
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    sx={{ borderRadius: '50px' }}
                                    onClick={() => setOpenConfirmDialog(true)}
                                >
                                    Cancel Plan
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Dialog
                        open={openConfirmDialog}
                        onClose={() => setOpenConfirmDialog(false)}
                    >
                        <DialogContent sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Cancel Subscription?
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                By canceling your subscription:
                                <ul>
                                    <li>You'll be downgraded to the free plan</li>
                                    <li>Only your first 2 Brdges will be kept</li>
                                    <li>Additional Brdges will be deleted</li>
                                </ul>
                            </Typography>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenConfirmDialog(false)}
                                    disabled={cancelling}
                                >
                                    Keep Subscription
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleCancelSubscription}
                                    disabled={cancelling}
                                >
                                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                                </Button>
                            </Box>
                        </DialogContent>
                    </Dialog>
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography color="text.secondary" paragraph>
                        You're currently on the Free plan.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Upgrade to unlock premium features and increase your limits.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

function UsageStats({ currentPlan }) {
    const [stats, setStats] = useState({
        brdges_created: 0,
        brdges_limit: '2'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/user/stats');
                setStats(response.data);
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Error fetching stats:', error);
                }
            }
        };

        fetchStats();
    }, []);

    const getUsagePercentage = () => {
        if (stats.brdges_limit === 'Unlimited') return 0;
        return (stats.brdges_created / parseInt(stats.brdges_limit)) * 100;
    };

    return (
        <Paper elevation={0} sx={{ ...styles.glassCard, p: 4, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon color="primary" />
                Usage Statistics
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                        {stats.brdges_created}
                    </Typography>
                    <Typography color="text.secondary">
                        Brdges Created
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                        {stats.brdges_limit}
                    </Typography>
                    <Typography color="text.secondary">
                        Brdge Limit
                    </Typography>
                </Grid>
                {stats.brdges_limit !== 'Unlimited' && (
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={getUsagePercentage()}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 5,
                                        background: 'linear-gradient(90deg, #2196F3, #00BCD4)'
                                    }
                                }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
                                {getUsagePercentage().toFixed(0)}% used
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
}

function UserProfilePage() {
    const theme = useTheme();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/user/profile');
            setUserProfile(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load user profile');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const isSuccess = urlParams.get('redirect_status') === 'succeeded';
            const tier = localStorage.getItem('selected_tier');

            console.log('Payment check - Success:', isSuccess, 'Tier:', tier);

            if (isSuccess && tier) {
                try {
                    console.log('Attempting to update subscription...');

                    const response = await api.post('/verify-subscription', { tier });
                    console.log('Subscription update response:', response.data);

                    await fetchUserProfile();

                    setShowSuccess(true);

                    window.history.replaceState({}, document.title, "/profile");
                    localStorage.removeItem('selected_tier');
                } catch (error) {
                    console.error('Error updating subscription:', error);
                    setError('Failed to update subscription. Please contact support.');
                }
            }
        };

        checkPaymentStatus();
    }, []);

    const handleStandardUpgrade = async () => {
        try {
            localStorage.setItem('selected_tier', 'standard');
            // Direct link to Stripe payment page
            const success_url = encodeURIComponent(`${window.location.origin}/profile?redirect_status=succeeded`);
            const cancel_url = encodeURIComponent(`${window.location.origin}/profile`);
            const paymentUrl = `https://buy.stripe.com/test_14k02B3XE8Qa43CfYY?success_url=${success_url}&cancel_url=${cancel_url}`;

            // Open in popup
            const popup = window.open(
                paymentUrl,
                'Stripe Checkout',
                'width=600,height=600,top=50,left=50'
            );

            if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                alert('Please enable popups to proceed with payment');
                return;
            }

            // Monitor popup
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkPopup);
                    // Check URL parameters for success
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('redirect_status') === 'succeeded') {
                        const verifyPayment = async () => {
                            try {
                                await api.post('/verify-subscription', { tier: 'standard' });
                                await fetchUserProfile();
                                setShowSuccess(true);
                            } catch (error) {
                                console.error('Error verifying payment:', error);
                            }
                        };
                        verifyPayment();
                    }
                }
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePremiumUpgrade = async () => {
        try {
            localStorage.setItem('selected_tier', 'premium');
            // Direct link to Stripe payment page
            const success_url = encodeURIComponent(`${window.location.origin}/profile?redirect_status=succeeded`);
            const cancel_url = encodeURIComponent(`${window.location.origin}/profile`);
            const paymentUrl = `https://buy.stripe.com/test_bIYeXvgKqfeyfMkcMN?success_url=${success_url}&cancel_url=${cancel_url}`;

            // Open in popup
            const popup = window.open(
                paymentUrl,
                'Stripe Checkout',
                'width=600,height=600,top=50,left=50'
            );

            if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                alert('Please enable popups to proceed with payment');
                return;
            }

            // Monitor popup
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkPopup);
                    // Check URL parameters for success
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('redirect_status') === 'succeeded') {
                        const verifyPayment = async () => {
                            try {
                                await api.post('/verify-subscription', { tier: 'premium' });
                                await fetchUserProfile();
                                setShowSuccess(true);
                            } catch (error) {
                                console.error('Error verifying payment:', error);
                            }
                        };
                        verifyPayment();
                    }
                }
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleManageSubscription = async () => {
        try {
            const response = await api.post('/create-portal-session');
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'  // Ensure consistent timezone handling
        }).format(date);
    };

    const getPlanBadgeColor = (plan) => {
        switch (plan) {
            case 'pro':
                return 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)';
            case 'standard':
                return 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
            default:
                return 'linear-gradient(135deg, #9E9E9E 0%, #616161 100%)';
        }
    };

    const handleSubscriptionChange = async () => {
        // Refresh user profile after subscription change
        await fetchUserProfile();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Typography color="error" align="center">{error}</Typography>
            </Container>
        );
    }

    const currentPlan = userProfile?.account?.account_type || 'free';

    const subscriptionTiers = [
        {
            title: "Free",
            price: "$0/month",
            features: [
                "Up to 2 Brdges",
                "Basic Customization",
                "Limited Analytics",
                "Standard Support"
            ],
            buttonText: "Current Plan",
            isActive: currentPlan === 'free',
            tier: 'free'
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
            buttonText: "Upgrade to Standard",
            isActive: currentPlan === 'standard',
            onClick: handleStandardUpgrade,
            tier: 'standard'
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
            isActive: currentPlan === 'pro',
            onClick: handlePremiumUpgrade,
            isPremium: true,
            tier: 'premium'
        }
    ];

    const getSubscriptionDescription = (currentPlan) => {
        switch (currentPlan) {
            case 'standard':
                return "You're currently on our standard plan. Upgrade to premium for more features!";
            case 'pro':
                return "You're currently on our premium plan. Enjoy all the advanced features!";
            default:
                return "Upgrade your plan to unlock more features and capabilities.";
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            pt: 8,
            pb: 8
        }}>
            <Container maxWidth="lg">
                {showSuccess && (
                    <Box sx={{ mb: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Alert
                                severity="success"
                                sx={{
                                    ...styles.glassCard,
                                    '& .MuiAlert-icon': {
                                        color: '#00BCD4'
                                    }
                                }}
                            >
                                Subscription updated successfully!
                            </Alert>
                        </motion.div>
                    </Box>
                )}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        {/* Profile Card */}
                        <Paper elevation={0} sx={{ ...styles.glassCard, p: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            bgcolor: 'transparent',
                                            margin: '0 auto',
                                            mb: 3,
                                            background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
                                            border: '4px solid white',
                                            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)'
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: 60, color: 'white' }} />
                                    </Avatar>
                                </motion.div>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{
                                        ...styles.gradientText,
                                        wordBreak: 'break-word',
                                        fontSize: '1.2rem',
                                        mb: 2
                                    }}
                                >
                                    {userProfile?.email}
                                </Typography>

                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Chip
                                        label={currentPlan.toUpperCase()}
                                        sx={{
                                            ...styles.premiumGradient,
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem',
                                            py: 1.5,
                                            mb: 3,
                                            '& .MuiChip-icon': {
                                                color: 'white'
                                            }
                                        }}
                                        icon={<WorkspacePremiumIcon />}
                                    />
                                </motion.div>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    color: 'text.secondary',
                                    '& svg': {
                                        color: '#00BCD4'
                                    }
                                }}>
                                    <CalendarTodayIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: '0.875rem',
                                            color: 'text.secondary'
                                        }}
                                    >
                                        Joined {formatDate(userProfile?.account?.created_at)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <BillingCard
                            userProfile={userProfile}
                            currentPlan={currentPlan}
                            onSubscriptionChange={handleSubscriptionChange}
                            onManageSubscription={handleManageSubscription}
                        />

                        <UsageStats currentPlan={currentPlan} />
                    </Grid>

                    {/* Subscription Plans Section */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ ...styles.glassCard, p: 4 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 3,
                                '& svg': {
                                    color: '#00BCD4'
                                }
                            }}>
                                <WorkspacePremiumIcon sx={{ fontSize: 32 }} />
                                <div>
                                    <Typography variant="h5" gutterBottom sx={styles.gradientText}>
                                        Your Subscription
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {getSubscriptionDescription(currentPlan)}
                                    </Typography>
                                </div>
                            </Box>

                            <Grid container spacing={3}>
                                {subscriptionTiers.map((tier, index) => (
                                    <Grid item xs={12} key={index}>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    ...styles.glassCard,
                                                    border: tier.isActive ? '2px solid #00BCD4' : '1px solid rgba(255, 255, 255, 0.2)',
                                                    background: tier.isPremium ? styles.premiumGradient.background : 'rgba(255, 255, 255, 0.9)',
                                                    color: tier.isPremium ? 'white' : 'inherit',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Grid container alignItems="center" spacing={2}>
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="h6" component="div" fontWeight="bold">
                                                                {tier.title}
                                                            </Typography>
                                                            <Typography variant="h5" component="div" fontWeight="bold">
                                                                {tier.price}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={5}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                {tier.features.map((feature, idx) => (
                                                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <CheckIcon sx={{ mr: 1, fontSize: '1rem' }} />
                                                                        <Typography variant="body2">{feature}</Typography>
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                                                            {tier.isActive ? (
                                                                <Chip
                                                                    label="Current Plan"
                                                                    color="primary"
                                                                    sx={{ fontWeight: 'bold' }}
                                                                />
                                                            ) : (
                                                                !shouldShowUpgradeButton(currentPlan, tier.tier) ? null : (
                                                                    <Button
                                                                        variant={tier.isPremium ? "contained" : "outlined"}
                                                                        color="primary"
                                                                        onClick={tier.onClick}
                                                                        sx={{ borderRadius: '50px' }}
                                                                    >
                                                                        {tier.buttonText}
                                                                    </Button>
                                                                )
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

const shouldShowUpgradeButton = (currentPlan, targetTier) => {
    const planOrder = { 'free': 0, 'standard': 1, 'premium': 2, 'pro': 2 };
    return planOrder[targetTier] > planOrder[currentPlan];
};

export default UserProfilePage;
