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

const typography = {
    heading: {
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color: 'white',
        fontFamily: 'Satoshi'
    },
    subheading: {
        fontSize: '1.1rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Satoshi'
    },
    body: {
        fontSize: '0.9rem',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'Satoshi'
    },
    caption: {
        fontSize: '0.8rem',
        letterSpacing: '0.02em',
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Satoshi'
    }
};

const cardStyles = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }
};

const tierCardStyles = (isActive, isPremium) => ({
    ...cardStyles,
    p: 3,
    border: isActive ? '2px solid rgba(0, 188, 212, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
    background: isPremium ?
        'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(0, 188, 212, 0.1) 100%)' :
        'rgba(255, 255, 255, 0.02)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': isPremium ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #2196F3, #00BCD4)',
    } : {}
});

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
                borderRadius: '24px',
                background: isPremium
                    ? 'linear-gradient(90deg, #00B4DB 0%, #0041C2 100%)'
                    : '#ffffff',
                border: isActive ? '2px solid #00B4DB' : 'none',
                color: isPremium ? '#ffffff' : '#1a1a1a',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                '& .MuiTypography-root': {
                    color: isPremium ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
                },
                '& .MuiTypography-h5': {
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    marginBottom: 1
                },
                '& .MuiTypography-h4': {
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBottom: 2
                },
                '& .MuiTypography-body1': {
                    color: isPremium ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                    fontSize: '0.95rem'
                }
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h5">{title}</Typography>
                        <Typography variant="h4">{price}</Typography>
                    </Box>
                    {isActive && (
                        <Button
                            variant="contained"
                            disabled
                            sx={{
                                backgroundColor: '#0052CC',
                                color: 'white',
                                borderRadius: '50px',
                                textTransform: 'none',
                                px: 3,
                                '&.Mui-disabled': {
                                    backgroundColor: '#0052CC',
                                    color: 'white',
                                }
                            }}
                        >
                            Current Plan
                        </Button>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {features.map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CheckIcon sx={{
                                mr: 1.5,
                                color: isPremium ? '#ffffff' : '#00B4DB',
                                fontSize: '1.2rem'
                            }} />
                            <Typography variant="body1">{feature}</Typography>
                        </Box>
                    ))}
                </Box>
                {!isActive && (
                    <Button
                        variant={isPremium ? "contained" : "outlined"}
                        onClick={handleClick}
                        sx={{
                            mt: 2,
                            borderRadius: '50px',
                            backgroundColor: isPremium ? '#0052CC' : 'transparent',
                            color: isPremium ? '#ffffff' : '#0052CC',
                            borderColor: isPremium ? 'transparent' : '#0052CC',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            py: 1,
                            '&:hover': {
                                backgroundColor: isPremium ? '#0747A6' : 'rgba(0, 82, 204, 0.04)',
                                borderColor: isPremium ? 'transparent' : '#0052CC',
                            }
                        }}
                    >
                        {buttonText}
                    </Button>
                )}
            </Paper>
        </motion.div>
    );
};

const styles = {
    gradientText: {
        background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
    },
    glassCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative',
        '& .MuiTypography-root': {
            color: 'rgba(255, 255, 255, 0.9)'
        },
        '& .MuiTypography-body2': {
            color: 'rgba(255, 255, 255, 0.7)'
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
        }
    },
    premiumGradient: {
        background: 'linear-gradient(135deg, #00B4DB 0%, #0041C2 100%)',
        color: 'white',
        transition: 'all 0.3s ease'
    }
};

function BillingCard({ userProfile, currentPlan, onSubscriptionChange, onManageSubscription }) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);
    const [cancelSuccess, setCancelSuccess] = useState(null);

    // Calculate next billing date (one month from now)
    const nextBillingDate = userProfile?.account?.next_billing_date ?
        new Date(userProfile.account.next_billing_date) :
        new Date(new Date().setMonth(new Date().getMonth() + 1));

    const handleCancelSubscription = async () => {
        setCancelling(true);
        setCancelError(null);
        try {
            const response = await api.post('/cancel-subscription');
            console.log('Cancellation response:', response.data);

            setCancelSuccess(response.data);
            // Close dialog after short delay
            setTimeout(() => {
                setOpenConfirmDialog(false);
                // Refresh profile data
                if (onSubscriptionChange) {
                    onSubscriptionChange();
                }
            }, 2000);

        } catch (error) {
            console.error('Error canceling subscription:', error);
            setCancelError(error.response?.data?.error || 'Failed to cancel subscription');
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
                        onClose={() => !cancelling && setOpenConfirmDialog(false)}
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

                            {cancelError && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {cancelError}
                                </Alert>
                            )}

                            {cancelSuccess && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Subscription canceled successfully.
                                    Kept {cancelSuccess.brdges_kept} brdges,
                                    deleted {cancelSuccess.brdges_deleted} brdges.
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
            <Typography variant="h6" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
            }}>
                <StarIcon color="primary" />
                Usage Statistics
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4} alignItems="center">
                {/* Brdges Created */}
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h2"
                            fontWeight="bold"
                            color="primary"
                            sx={{
                                mb: 1,
                                fontSize: { xs: '2rem', sm: '2.5rem' }
                            }}
                        >
                            {stats.brdges_created}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                        >
                            Brdges Created
                        </Typography>
                    </Box>
                </Grid>

                {/* Brdge Limit */}
                <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h2"
                            fontWeight="bold"
                            color="primary"
                            sx={{
                                mb: 1,
                                fontSize: stats.brdges_limit === 'Unlimited'
                                    ? { xs: '1.5rem', sm: '2rem' }
                                    : { xs: '2rem', sm: '2.5rem' },
                                background: stats.brdges_limit === 'Unlimited'
                                    ? 'linear-gradient(45deg, #2196F3, #00BCD4)'
                                    : 'inherit',
                                WebkitBackgroundClip: stats.brdges_limit === 'Unlimited' ? 'text' : 'inherit',
                                WebkitTextFillColor: stats.brdges_limit === 'Unlimited' ? 'transparent' : 'inherit',
                            }}
                        >
                            {stats.brdges_limit}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                        >
                            Brdge Limit
                        </Typography>
                    </Box>
                </Grid>

                {/* Usage Bar - Only show if not unlimited */}
                {stats.brdges_limit !== 'Unlimited' && (
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Usage
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getUsagePercentage().toFixed(0)}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={getUsagePercentage()}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: 'linear-gradient(90deg, #2196F3, #00BCD4)'
                                    }
                                }}
                            />
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
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const fetchUserProfile = async () => {
        try {
            console.log('Fetching user profile...');
            const response = await api.get('/user/profile');
            console.log('Profile data received:', response.data);
            setUserProfile(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
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
            const paymentSuccess = urlParams.get('payment') === 'success';

            if (paymentSuccess) {
                console.log('Payment success detected, refreshing profile...');
                try {
                    await fetchUserProfile();
                    setShowSuccess(true);
                    window.history.replaceState({}, document.title, "/profile");
                } catch (error) {
                    console.error('Error refreshing profile:', error);
                    setError('Failed to refresh profile after payment');
                }
            }
        };

        checkPaymentStatus();
        fetchUserProfile(); // Initial profile fetch
    }, []);

    const handleStandardUpgrade = async () => {
        setIsProcessing(true);
        setPaymentError(null);
        try {
            localStorage.setItem('selected_tier', 'standard');
            const response = await api.post('/create-checkout-session', {
                tier: 'standard'
            });

            if (response.data.url) {
                // Direct redirect to Stripe
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
            setPaymentError(error.response?.data?.error || 'Failed to start checkout process');
            setIsProcessing(false);
        }
    };

    const handlePremiumUpgrade = async () => {
        setIsProcessing(true);
        setPaymentError(null);
        try {
            localStorage.setItem('selected_tier', 'premium');
            const response = await api.post('/create-checkout-session', {
                tier: 'premium'
            });

            if (response.data.url) {
                // Direct redirect to Stripe
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
            setPaymentError(error.response?.data?.error || 'Failed to start checkout process');
            setIsProcessing(false);
        }
    };

    const handleManageSubscription = async () => {
        try {
            setIsProcessing(true);
            setError(null);
            const response = await api.post('/create-portal-session');

            if (response.data.url) {
                console.log('Redirecting to portal:', response.data.url);
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error accessing subscription management:', error);
            setError(error.response?.data?.error || 'Failed to access subscription management');
        } finally {
            setIsProcessing(false);
        }
    };

    // Add this useEffect to handle return from portal
    useEffect(() => {
        const handleReturnFromPortal = async () => {
            const returnToProfile = localStorage.getItem('return_to_profile');
            if (returnToProfile) {
                localStorage.removeItem('return_to_profile');
                await fetchUserProfile();
                setShowSuccess(true);
            }
        };

        handleReturnFromPortal();
    }, []);

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

    const verifyPayment = async (tier) => {
        try {
            const response = await api.post('/verify-subscription', { tier });
            console.log('Verification response:', response.data);

            // Refresh the user profile
            await fetchUserProfile();

            // Show success message
            setShowSuccess(true);
            setPaymentError(null);

            // Clean up URL and localStorage
            window.history.replaceState({}, document.title, "/profile");
            localStorage.removeItem('selected_tier');

            // Scroll to top to show success message
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error verifying payment:', error);
            setPaymentError(error.response?.data?.error || 'Failed to verify payment');
        }
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
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'relative',
            pt: 8,
            pb: 8,
            color: 'white',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '5%',
                left: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(79, 156, 249, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 20s infinite alternate',
                zIndex: 0
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '5%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0, 180, 219, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 25s infinite alternate-reverse',
                zIndex: 0
            }
        }}>
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '15%',
                width: '400px',
                height: '400px',
                border: '1px solid rgba(255,255,255,0.1)',
                transform: 'rotate(45deg)',
                animation: 'rotate 30s linear infinite',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -1,
                    padding: '1px',
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                }
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '300px',
                height: '300px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: 'rotateReverse 25s linear infinite',
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

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                                    backgroundColor: 'rgba(0, 200, 83, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    '& .MuiAlert-icon': {
                                        color: '#00ffcc'
                                    }
                                }}
                                onClose={() => setShowSuccess(false)}
                            >
                                Your subscription has been updated successfully!
                            </Alert>
                        </motion.div>
                    </Box>
                )}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        {/* Profile Card */}
                        <Paper elevation={0} sx={cardStyles}>
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            bgcolor: 'transparent',
                                            margin: '0 auto',
                                            mb: 3,
                                            background: 'linear-gradient(135deg, #2196F3, #00BCD4)',
                                            border: '3px solid rgba(255, 255, 255, 0.1)',
                                            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2)'
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: 40, color: 'white' }} />
                                    </Avatar>
                                </motion.div>
                                <Typography sx={{ ...typography.heading, mb: 0.5 }}>
                                    {userProfile?.email}
                                </Typography>
                                <Typography sx={{ ...typography.caption, mb: 3 }}>
                                    Member since {formatDate(userProfile?.account?.created_at)}
                                </Typography>
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
                        <Paper elevation={0} sx={cardStyles}>
                            <Box sx={{ p: 4 }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 4
                                }}>
                                    <WorkspacePremiumIcon
                                        sx={{
                                            fontSize: 28,
                                            color: '#00BCD4',
                                            filter: 'drop-shadow(0 0 10px rgba(0, 188, 212, 0.3))'
                                        }}
                                    />
                                    <div>
                                        <Typography sx={{ ...typography.heading, mb: 0.5 }}>
                                            Your Subscription
                                        </Typography>
                                        <Typography sx={typography.body}>
                                            {getSubscriptionDescription(currentPlan)}
                                        </Typography>
                                    </div>
                                </Box>

                                <Grid container spacing={2}>
                                    {subscriptionTiers.map((tier, index) => (
                                        <Grid item xs={12} key={index}>
                                            <motion.div
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <Card
                                                    elevation={0}
                                                    sx={tierCardStyles(tier.isActive, tier.isPremium)}
                                                >
                                                    <CardContent>
                                                        <Grid container alignItems="center" spacing={2}>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography sx={{ ...typography.subheading, mb: 1 }}>
                                                                    {tier.title}
                                                                </Typography>
                                                                <Typography sx={typography.heading}>
                                                                    {tier.price}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={5}>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                    {tier.features.map((feature, idx) => (
                                                                        <Box key={idx} sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 1
                                                                        }}>
                                                                            <CheckIcon sx={{
                                                                                fontSize: '0.9rem',
                                                                                color: tier.isPremium ? '#00BCD4' : '#4CAF50'
                                                                            }} />
                                                                            <Typography sx={typography.body}>
                                                                                {feature}
                                                                            </Typography>
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
                                                                            disabled={isProcessing}
                                                                            sx={{ borderRadius: '50px' }}
                                                                        >
                                                                            {isProcessing ? 'Processing...' : tier.buttonText}
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
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotateReverse {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                `}
            </style>
        </Box>
    );
}

const shouldShowUpgradeButton = (currentPlan, targetTier) => {
    const planOrder = { 'free': 0, 'standard': 1, 'premium': 2, 'pro': 2 };
    return planOrder[targetTier] > planOrder[currentPlan];
};

export default UserProfilePage;
