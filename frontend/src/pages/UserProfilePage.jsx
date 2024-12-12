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
    DialogContent,
    List,
    ListItem
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
    pageBackground: {
        background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 100%)',
        minHeight: '100vh',
        padding: '40px 0'
    },
    card: {
        background: 'rgba(2, 6, 23, 0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '24px',
        color: 'white',
        transition: 'transform 0.2s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        }
    },
    profileSection: {
        textAlign: 'center',
        padding: '32px 24px',
        '& .MuiAvatar-root': {
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            background: 'rgba(2, 6, 23, 0.7)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.9)'
        }
    },
    subscriptionCard: {
        background: 'rgba(2, 6, 23, 0.5)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        '&.active': {
            background: 'rgba(0, 122, 255, 0.1)',
            border: '1px solid rgba(0, 122, 255, 0.3)',
            '&::before': {
                content: '"Current Plan"',
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#007AFF',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500
            }
        }
    },
    planPrice: {
        fontSize: '32px',
        fontWeight: 700,
        color: 'white',
        marginBottom: '8px'
    },
    planFeatures: {
        '& li': {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            color: 'rgba(255, 255, 255, 0.8)',
            '& svg': {
                color: '#00B4DB'
            }
        }
    },
    usageStats: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '24px',
        '& .stat': {
            textAlign: 'center',
            '& .value': {
                fontSize: '36px',
                fontWeight: 700,
                background: 'linear-gradient(90deg, #007AFF, #00B4DB)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '4px'
            },
            '& .label': {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px'
            }
        }
    },
    progressBar: {
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #007AFF, #00B4DB)'
        }
    },
    button: {
        borderRadius: '20px',
        textTransform: 'none',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 500,
        '&.upgrade': {
            background: 'linear-gradient(90deg, #007AFF, #00B4DB)',
            color: 'white',
            '&:hover': {
                background: 'linear-gradient(90deg, #0066CC, #0099CC)'
            }
        },
        '&.cancel': {
            color: '#FF3B30',
            borderColor: '#FF3B30',
            '&:hover': {
                background: 'rgba(255, 59, 48, 0.1)'
            }
        }
    },
    billingInfo: {
        '& .billing-header': {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            '& .MuiSvgIcon-root': {
                color: '#007AFF',
                fontSize: '20px'
            },
            '& .MuiTypography-root': {
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px',
                fontWeight: 500
            }
        },
        '& .billing-content': {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        '& .billing-row': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            '& .label': {
                color: 'rgba(255, 255, 255, 0.5)'
            },
            '& .value': {
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500
            }
        },
        '& .payment-chip': {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content',
            '& .MuiSvgIcon-root': {
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.5)'
            }
        },
        '& .cancel-button': {
            marginTop: '24px',
            color: '#FF3B30',
            borderColor: 'rgba(255, 59, 48, 0.5)',
            '&:hover': {
                borderColor: '#FF3B30',
                background: 'rgba(255, 59, 48, 0.1)'
            }
        }
    }
};

function BillingCard({ userProfile, currentPlan, onSubscriptionChange }) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    return (
        <Paper elevation={0} sx={styles.card}>
            <Box sx={styles.billingInfo}>
                <div className="billing-header">
                    <ReceiptIcon />
                    <Typography>Billing Information</Typography>
                </div>

                <div className="billing-content">
                    <div className="billing-row">
                        <span className="label">Plan</span>
                        <span className="value">
                            {currentPlan === 'pro' ? 'Premium' :
                                currentPlan === 'standard' ? 'Standard' : 'Free'} Plan
                        </span>
                    </div>

                    <div className="billing-row">
                        <span className="label">Billing Period</span>
                        <span className="value">Monthly</span>
                    </div>

                    {currentPlan !== 'free' && (
                        <div className="billing-row">
                            <span className="label">Next Payment</span>
                            <span className="value">
                                {formatDate(userProfile?.account?.next_billing_date)}
                            </span>
                        </div>
                    )}

                    {currentPlan !== 'free' && (
                        <div className="billing-row">
                            <span className="label">Payment Method</span>
                            <div className="payment-chip">
                                <PaymentIcon />
                                <span>••••4242</span>
                            </div>
                        </div>
                    )}

                    {currentPlan !== 'free' && (
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            fullWidth
                            className="cancel-button"
                            onClick={() => setOpenConfirmDialog(true)}
                        >
                            Cancel Plan
                        </Button>
                    )}
                </div>
            </Box>

            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
                PaperProps={{
                    sx: {
                        background: 'rgba(2, 6, 23, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        color: 'white',
                        maxWidth: '400px',
                        width: '100%',
                        p: 3
                    }
                }}
            >
                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Cancel Subscription?
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                        By canceling your subscription:
                        <ul style={{ marginTop: '8px' }}>
                            <li>You'll be downgraded to the free plan</li>
                            <li>Only your first Bridge will be kept</li>
                            <li>Additional Bridges will be deleted</li>
                            <li>Usage will be limited to 30 minutes per month</li>
                        </ul>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenConfirmDialog(false)}
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                }
                            }}
                        >
                            Keep Subscription
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                // Handle cancellation
                                setOpenConfirmDialog(false);
                            }}
                            sx={{
                                bgcolor: '#FF3B30',
                                '&:hover': {
                                    bgcolor: '#FF453A'
                                }
                            }}
                        >
                            Confirm Cancellation
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Paper>
    );
}

function UsageStats({ currentPlan }) {
    const [stats, setStats] = useState({
        brdges_created: 0,
        brdges_limit: '2',
        minutes_used: 0,
        minutes_limit: 30
    });

    const getBrdgeLimit = (accountType) => {
        switch (accountType) {
            case 'pro':
                return 'Unlimited';
            case 'standard':
                return 10;
            default:
                return 1;
        }
    };

    const getMinutesLimit = (accountType) => {
        switch (accountType) {
            case 'pro':
                return 300;
            case 'standard':
                return 120;
            default:
                return 30;
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/user/stats');
                const accountType = response.data.account_type || 'free';
                setStats({
                    ...response.data,
                    brdges_limit: getBrdgeLimit(accountType),
                    minutes_limit: getMinutesLimit(accountType)
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const getBrdgeUsagePercentage = () => {
        if (stats.brdges_limit === 'Unlimited') return 0;
        return (stats.brdges_created / parseInt(stats.brdges_limit)) * 100;
    };

    const getMinutesUsagePercentage = () => {
        return (stats.minutes_used / stats.minutes_limit) * 100;
    };

    return (
        <Paper elevation={0} sx={styles.card}>
            <Typography variant="h6" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
            }}>
                <StarIcon color="primary" />
                Usage Statistics
            </Typography>

            <Grid container spacing={4}>
                {/* Bridges Usage */}
                <Grid item xs={12}>
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Bridges Used
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                                {stats.brdges_created} / {stats.brdges_limit === 'Unlimited' ? '∞' : stats.brdges_limit}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={getBrdgeUsagePercentage()}
                            sx={styles.progressBar}
                        />
                    </Box>
                </Grid>

                {/* Minutes Usage */}
                <Grid item xs={12}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Minutes Used
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white' }}>
                                {stats.minutes_used} / {stats.minutes_limit}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={getMinutesUsagePercentage()}
                            sx={styles.progressBar}
                        />
                    </Box>
                </Grid>
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
                "1 Bridge",
                "30 Minutes Monthly Usage",
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
                "Up to 10 Bridges",
                "120 Minutes Monthly Usage",
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
                "Unlimited Bridges",
                "300 Minutes Monthly Usage",
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
        <Box sx={styles.pageBackground}>
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
                        <Paper elevation={0} sx={styles.card}>
                            <Box sx={styles.profileSection}>
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
                        <Paper elevation={0} sx={styles.card}>
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
