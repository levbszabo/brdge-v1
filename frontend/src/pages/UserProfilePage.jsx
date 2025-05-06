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
    ListItem,
    Switch,
    TextField,
    DialogTitle,
    DialogActions,
    IconButton
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
import SaveIcon from '@mui/icons-material/Save';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const typography = {
    heading: {
        fontSize: { xs: '1.25rem', sm: '1.5rem' },
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color: 'white',
        fontFamily: 'Satoshi',
        background: 'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0.8))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subheading: {
        fontSize: { xs: '1rem', sm: '1.1rem' },
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: 'Satoshi'
    },
    body: {
        fontSize: { xs: '0.875rem', sm: '0.9rem' },
        letterSpacing: '0.01em',
        lineHeight: 1.5,
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'Satoshi'
    },
    caption: {
        fontSize: { xs: '0.75rem', sm: '0.8rem' },
        letterSpacing: '0.02em',
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Satoshi'
    }
};

const cardStyles = {
    background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.9), rgba(7, 11, 35, 0.9))',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
    }
};

const tierCardStyles = (isActive, isPremium) => ({
    background: isPremium
        ? 'linear-gradient(135deg, rgba(0, 82, 204, 0.15), rgba(7, 71, 166, 0.15))'
        : 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    border: isActive
        ? '1px solid rgba(34, 211, 238, 0.3)'
        : '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'all 0.4s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: isPremium
            ? 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    }
});

const TierButton = ({ isActive, isPremium, onClick, children, tier }) => {
    const theme = useTheme();

    let buttonStyles = {};
    if (isActive) {
        buttonStyles = {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            cursor: 'default',
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderColor: theme.palette.primary.main,
                boxShadow: 'none',
                transform: 'none'
            },
            '&.Mui-disabled': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                opacity: 1
            }
        };
    } else if (tier === 'free') {
        buttonStyles = {
            borderColor: theme.palette.neutral.mid,
            color: theme.palette.primary.main,
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderColor: theme.palette.primary.light,
            },
        };
    }
    else if (isPremium) {
        buttonStyles = theme.components.MuiButton.styleOverrides.containedPrimary;
    } else {
        buttonStyles = theme.components.MuiButton.styleOverrides.outlinedPrimary;
    }

    return (
        <Button
            variant={isActive ? "outlined" : (isPremium && tier !== 'free') ? "contained" : "outlined"}
            disabled={isActive}
            onClick={onClick}
            sx={{
                ...buttonStyles,
                minWidth: '120px',
                height: '40px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: '0 16px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                margin: '0 auto',
                display: 'block',
                transition: 'all 0.2s ease-out',

                '&:hover': {
                    ...buttonStyles['&:hover'],
                    ...(isActive ? {} : { transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${theme.palette.primary.main}30` }),
                },

                '&:active': {
                    ...(isActive ? {} : { transform: 'translateY(0px)', boxShadow: 'none' }),
                },
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                width: '100%'
            }}>
                {isActive ? (
                    <>
                        <CheckIcon sx={{ fontSize: '18px', color: 'inherit' }} />
                        <span>Current Plan</span>
                    </>
                ) : (
                    <>
                        {isPremium && (
                            <StarIcon sx={{ fontSize: '18px', color: 'inherit' }} />
                        )}
                        <span>{children}</span>
                    </>
                )}
            </Box>
        </Button>
    );
};

const SubscriptionTier = ({ title, price, features, isActive, onClick, isPremium, tier }) => {
    const theme = useTheme();
    const handleClick = () => {
        localStorage.setItem('selected_tier', tier);
        onClick();
    };

    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ height: '100%' }}
        >
            <Paper
                elevation={isActive ? 4 : 1}
                sx={{
                    p: { xs: 2.5, sm: 3 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    border: isActive
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                    position: 'relative',
                    overflow: 'hidden',
                    '& > *': {
                        position: 'relative',
                        zIndex: 1,
                    },
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: isActive ? theme.shadows[6] : theme.shadows[4],
                        borderColor: isActive
                            ? theme.palette.primary.main
                            : theme.palette.primary.light,
                    },
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 1,
                }}>
                    <Box>
                        <Typography variant="h4" sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 0.5,
                            lineHeight: 1.2,
                        }}>
                            {title}
                        </Typography>
                        <Typography variant="h5" sx={{
                            fontWeight: 500,
                            color: theme.palette.secondary.main,
                            mb: 1,
                            lineHeight: 1.2,
                        }}>
                            {price}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 0.5, width: { xs: '100%', sm: 'auto' } }}>
                        <TierButton
                            isActive={isActive}
                            isPremium={isPremium}
                            tier={tier}
                            onClick={handleClick}
                        >
                            {isActive ? 'Current Plan' :
                                (tier === 'free' && !isActive) ? 'Select Plan' :
                                    (isPremium) ? 'Upgrade Plan' :
                                        'Select Plan'}
                        </TierButton>
                    </Box>
                </Box>

                <Box sx={{ flexGrow: 1, mb: 3 }}>
                    {features.map((feature, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1.5,
                            color: theme.palette.text.secondary,
                        }}>
                            <CheckIcon sx={{
                                mr: 1.5,
                                color: theme.palette.secondary.main,
                                fontSize: '1.1rem'
                            }} />
                            <Typography sx={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                                color: theme.palette.text.primary,
                                fontWeight: 400,
                            }}>
                                {feature}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </motion.div>
    );
};

function BillingCard({ userProfile, currentPlan, onSubscriptionChange }) {
    const theme = useTheme();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [showCancelSuccess, setShowCancelSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [allowOverage, setAllowOverage] = useState(userProfile?.account?.allow_overage ?? true);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const handleOverageToggle = async () => {
        const newOverageSetting = !allowOverage;
        setAllowOverage(newOverageSetting);
        setError(null);
        try {
            const response = await api.post('/update-overage-settings', {
                allow_overage: newOverageSetting
            });
            if (!response.data.success || response.data.allow_overage !== newOverageSetting) {
                setAllowOverage(!newOverageSetting);
                setError('Failed to update overage settings on the server.');
            }
        } catch (error) {
            setAllowOverage(!newOverageSetting);
            setError(error.response?.data?.error || 'Failed to communicate with server to update overage settings.');
            console.error("Error updating overage settings:", error);
        }
    };

    useEffect(() => {
        if (userProfile?.account?.allow_overage !== undefined) {
            setAllowOverage(userProfile.account.allow_overage);
        }
    }, [userProfile]);

    return (
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
                {showCancelSuccess && (
                    <Alert
                        severity="success"
                        onClose={() => setShowCancelSuccess(false)}
                        sx={{
                            mb: 2,
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            border: `1px solid ${theme.palette.success.main}`,
                            '& .MuiAlert-icon': { color: theme.palette.success.main }
                        }}
                    >
                        Your subscription has been successfully canceled and will remain active until the end of the current period.
                    </Alert>
                )}

                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError(null)}
                        sx={{
                            mb: 2,
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.error.main,
                            border: `1px solid ${theme.palette.error.main}`,
                            '& .MuiAlert-icon': { color: theme.palette.error.main }
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <ReceiptIcon sx={{ color: theme.palette.secondary.main }} />
                        <Typography variant="h6" sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                        }}>
                            Billing Information
                        </Typography>
                    </Box>

                    <Grid container spacing={1.5}>
                        <Grid item xs={5}><Typography variant="body2" color="text.secondary">Plan</Typography></Grid>
                        <Grid item xs={7} textAlign="right">
                            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                                {currentPlan === 'pro' ? 'Premium' :
                                    currentPlan === 'standard' ? 'Standard' : 'Free'} Plan
                                {userProfile?.account?.subscription_status === 'canceled' && currentPlan !== 'free' && (
                                    <Typography component="span" variant="caption" sx={{ display: 'block', color: theme.palette.warning.main }}>
                                        Cancels on: {formatDate(userProfile?.account?.next_billing_date)}
                                    </Typography>
                                )}
                            </Typography>
                        </Grid>

                        <Grid item xs={5}><Typography variant="body2" color="text.secondary">Billing Period</Typography></Grid>
                        <Grid item xs={7} textAlign="right"><Typography variant="body1" color="text.primary">Monthly</Typography></Grid>

                        {currentPlan !== 'free' && (
                            <>
                                <Grid item xs={5}><Typography variant="body2" color="text.secondary">Next Payment</Typography></Grid>
                                <Grid item xs={7} textAlign="right">
                                    <Typography variant="body1" color="text.primary">
                                        {userProfile?.account?.subscription_status === 'canceled' ? 'N/A' :
                                            formatDate(userProfile?.account?.next_billing_date)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={5}><Typography variant="body2" color="text.secondary">Payment Method</Typography></Grid>
                                <Grid item xs={7} textAlign="right">
                                    <Chip
                                        icon={<PaymentIcon sx={{ color: theme.palette.text.secondary }} />}
                                        label={`•••• ${userProfile?.payment_method_last4 || '****'}`}
                                        size="small"
                                        sx={{
                                            backgroundColor: theme.palette.neutral.light,
                                            color: theme.palette.text.primary,
                                            border: `1px solid ${theme.palette.divider}`,
                                            fontSize: '0.8rem',
                                            height: '26px'
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>

                {(currentPlan === 'standard' || currentPlan === 'pro') && (
                    <Box sx={{
                        mt: 2, mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '8px',
                        backgroundColor: theme.palette.neutral.light,
                        border: `1px solid ${theme.palette.divider}`,
                        p: 1.5,
                    }}>
                        <Box>
                            <Typography sx={{
                                color: theme.palette.text.primary,
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                lineHeight: 1.3,
                            }}>
                                Allow Overage Usage
                            </Typography>
                            <Typography sx={{
                                color: theme.palette.text.secondary,
                                fontSize: '0.8rem',
                                mt: 0.5,
                            }}>
                                $0.12/min for additional AI minutes
                            </Typography>
                        </Box>
                        <Switch
                            checked={allowOverage}
                            onChange={handleOverageToggle}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: theme.palette.secondary.main,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                    },
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: theme.palette.secondary.main,
                                },
                                '& .MuiSwitch-switchBase': {
                                    color: theme.palette.text.secondary,
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: theme.palette.neutral.mid,
                                }
                            }}
                        />
                    </Box>
                )}

                {currentPlan !== 'free' && userProfile?.account?.subscription_status !== 'canceled' && (
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        fullWidth
                        onClick={() => setOpenConfirmDialog(true)}
                        sx={{
                            borderColor: theme.palette.error.main,
                            color: theme.palette.error.main,
                            mt: 1,
                            '&:hover': {
                                borderColor: theme.palette.error.main,
                                backgroundColor: alpha(theme.palette.error.main, 0.08),
                            }
                        }}
                    >
                        Cancel Plan
                    </Button>
                )}

                <Dialog
                    open={openConfirmDialog}
                    onClose={() => setOpenConfirmDialog(false)}
                    PaperProps={{
                        sx: {
                            maxWidth: '500px',
                            width: '100%',
                            p: { xs: 2, sm: 3 },
                        }
                    }}
                >
                    <DialogTitle sx={{ p: 0, mb: 2, textAlign: 'center' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.error.main,
                                mb: 1,
                            }}
                        >
                            Cancel Subscription?
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.palette.text.secondary,
                                fontSize: '1rem',
                                fontWeight: 400,
                            }}
                        >
                            Your access remains until the current period ends.
                        </Typography>
                    </DialogTitle>

                    <DialogContent sx={{ p: 0 }}>
                        <Box sx={{ mb: 3 }}>
                            {[
                                {
                                    title: 'Active Until Period End',
                                    description: `Your ${currentPlan} plan remains active until ${formatDate(userProfile?.account?.next_billing_date)}.`,
                                    icon: <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />
                                },
                                {
                                    title: 'Preserved Content',
                                    description: 'Your Bridges and Flows will be preserved but inactive after the period ends.',
                                    icon: <SaveIcon sx={{ color: theme.palette.primary.main }} />
                                },
                                {
                                    title: 'Reactivate Anytime',
                                    description: 'You can easily reactivate your subscription later.',
                                    icon: <AutorenewIcon sx={{ color: theme.palette.primary.main }} />
                                },
                                {
                                    title: 'Free Tier Access',
                                    description: 'Free tier limits apply after cancellation (1 Bridge & 1 Flow, 30 mins/month).',
                                    icon: <LockOpenIcon sx={{ color: theme.palette.primary.main }} />
                                }
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        mb: 2,
                                        p: 1.5,
                                        borderRadius: '8px',
                                        backgroundColor: theme.palette.neutral.light,
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    <Box sx={{ pt: 0.5 }}>{item.icon}</Box>
                                    <Box>
                                        <Typography sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            color: theme.palette.text.primary,
                                            fontSize: '0.95rem'
                                        }}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: '0.85rem',
                                            color: theme.palette.text.secondary,
                                            lineHeight: 1.4,
                                        }}>
                                            {item.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 0, pt: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenConfirmDialog(false)}
                        >
                            Keep Subscription
                        </Button>
                        <Button
                            variant="contained"
                            onClick={async () => {
                                setError(null);
                                try {
                                    const response = await api.post('/cancel-subscription');
                                    if (response.data.message) {
                                        setShowCancelSuccess(true);
                                        setOpenConfirmDialog(false);
                                        onSubscriptionChange();
                                    } else {
                                        setError('Received an unexpected response while canceling.');
                                    }
                                } catch (error) {
                                    console.error('Error canceling subscription:', error);
                                    setError(error.response?.data?.error || 'Failed to cancel subscription. Please try again or contact support.');
                                }
                            }}
                            sx={{
                                backgroundColor: theme.palette.error.main,
                                color: theme.palette.error.contrastText || '#fff',
                                '&:hover': {
                                    backgroundColor: theme.palette.error.dark || '#a30000',
                                }
                            }}
                        >
                            Confirm Cancellation
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </motion.div>
    );
}

function UsageStats({ currentPlan }) {
    const theme = useTheme();
    const [stats, setStats] = useState({
        brdges_created: 0,
        brdges_limit: getBrdgeLimit(currentPlan),
        minutes_used: 0,
        minutes_limit: getMinutesLimit(currentPlan)
    });
    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState(null);

    function getBrdgeLimit(accountType) {
        switch (accountType) {
            case 'pro': return 'Unlimited';
            case 'standard': return 10;
            default: return 1;
        }
    }

    function getMinutesLimit(accountType) {
        switch (accountType) {
            case 'pro': return 1000;
            case 'standard': return 300;
            default: return 30;
        }
    }

    useEffect(() => {
        const fetchStats = async () => {
            setLoadingStats(true);
            setStatsError(null);
            try {
                const response = await api.get('/user/stats');
                const accountType = response.data.account_type || 'free';
                setStats({
                    brdges_created: response.data.brdges_created ?? 0,
                    minutes_used: Math.round(response.data.minutes_used ?? 0),
                    brdges_limit: getBrdgeLimit(accountType),
                    minutes_limit: getMinutesLimit(accountType)
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStatsError('Could not load usage statistics.');
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    const getBrdgeUsagePercentage = () => {
        if (loadingStats || statsError || stats.brdges_limit === 'Unlimited' || !stats.brdges_limit) return 0;
        return (stats.brdges_created / parseInt(stats.brdges_limit)) * 100;
    };

    const getMinutesUsagePercentage = () => {
        if (loadingStats || statsError || !stats.minutes_limit) return 0;
        const percentage = (stats.minutes_used / stats.minutes_limit) * 100;
        return Math.min(percentage, 100);
    };

    const getUsageDescription = (currentStats) => {
        if (!currentStats) return '';

        const brdgesUsed = currentStats.brdges_created;
        const brdgesLimit = currentStats.brdges_limit;
        const minutesUsed = Math.round(currentStats.minutes_used);
        const minutesLimit = currentStats.minutes_limit;

        return `Using ${brdgesUsed}/${brdgesLimit === 'Unlimited' ? '∞' : brdgesLimit} Courses/Modules and ${minutesUsed}/${minutesLimit} engagement minutes this period.`;
    };

    return (
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <StarIcon sx={{ color: theme.palette.secondary.main }} />
                    <Typography variant="h6" sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                    }}>
                        Usage Statistics
                    </Typography>
                </Box>

                {loadingStats && <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto' }} />}
                {statsError && <Alert severity="error" sx={{ mb: 2 }}>{statsError}</Alert>}

                {!loadingStats && !statsError && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                        Bridges
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {stats.brdges_created} / {stats.brdges_limit === 'Unlimited' ? '∞' : stats.brdges_limit}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={getBrdgeUsagePercentage()}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: theme.palette.neutral.light,
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: theme.palette.secondary.main
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                                        AI Minutes
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {stats.minutes_used} / {stats.minutes_limit}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={getMinutesUsagePercentage()}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: theme.palette.neutral.light,
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: theme.palette.secondary.main
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>

                        {(currentPlan === 'standard' || currentPlan === 'pro') && stats.minutes_used > stats.minutes_limit && (
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textAlign: 'center', display: 'block', mt: 1 }}>
                                    Overage minutes are billed at $0.12/min.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Paper>
        </motion.div>
    );
}

function UserProfilePage() {
    const theme = useTheme();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const [contactMessage, setContactMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching user profile...');
            const response = await api.get('/user/profile');
            console.log('Profile data received:', response.data);
            setUserProfile(response.data);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.error || 'Failed to load user profile. Please try refreshing the page.');
        } finally {
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
            const cancelled = urlParams.get('cancelled') === 'true';
            const tier = localStorage.getItem('selected_tier');

            if (paymentSuccess && tier) {
                console.log(`Payment success detected for ${tier}, verifying and refreshing...`);
                setLoading(true);
                setShowSuccess(false);
                try {
                    await fetchUserProfile();
                    setShowSuccess(true);
                    setSuccessMessage('Subscription updated successfully!');
                    window.history.replaceState({}, document.title, "/profile");
                    localStorage.removeItem('selected_tier');
                } catch (error) {
                    console.error('Error processing successful payment:', error);
                    setError('Payment succeeded, but failed to update profile. Please refresh.');
                } finally {
                    setLoading(false);
                }
            } else if (cancelled) {
                console.log('Checkout process cancelled.');
                setError('Checkout process was cancelled.');
                window.history.replaceState({}, document.title, "/profile");
                localStorage.removeItem('selected_tier');
            }
        };

        checkPaymentStatus();
    }, []);

    const handleCheckout = async (tier) => {
        setIsProcessing(true);
        setPaymentError(null);
        setError(null);
        try {
            localStorage.setItem('selected_tier', tier);
            const response = await api.post('/create-checkout-session', { tier });

            if (response.data.updated_directly) {
                // Subscription was updated directly by the backend (e.g., proration)
                setShowSuccess(true);
                setSuccessMessage(response.data.message || 'Subscription updated successfully!');
                fetchUserProfile(); // Refresh profile data
                setIsProcessing(false);

                if (response.data.requires_action && response.data.payment_intent_client_secret) {
                    // This is a simplified handling. A full implementation would use Stripe.js elements
                    // to call stripe.confirmCardPayment(response.data.payment_intent_client_secret).
                    console.warn('Subscription update requires further payment action (e.g., 3DS).');
                    alert('Your subscription update requires an additional confirmation step. Please follow any prompts from Stripe or your bank.');
                    // Optionally, you could try to guide the user or use Stripe.js to handle this.
                    setPaymentError('Your subscription change needs an extra confirmation step. Please follow any prompts from Stripe or your bank to complete it.');
                }

            } else if (response.data.url) {
                // Redirect to Stripe Checkout page for new subscriptions
                window.location.href = response.data.url;
            } else {
                // Should not happen if backend is correct, but handle defensively
                throw new Error(response.data.error || "Couldn't process subscription change. No redirect URL or direct update confirmation received.");
            }
        } catch (error) {
            console.error(`Error creating checkout/updating subscription for ${tier}:`, error);
            setPaymentError(error.response?.data?.error || error.message || `Failed to start ${tier} checkout process or update subscription. Please try again.`);
            localStorage.removeItem('selected_tier');
            setIsProcessing(false);
        }
    };

    const handleStandardUpgrade = () => handleCheckout('standard');
    const handlePremiumUpgrade = () => handleCheckout('premium');

    const handleManageSubscription = async () => {
        setIsProcessing(true);
        setError(null);
        setPaymentError(null);
        try {
            const response = await api.post('/create-portal-session');
            if (response.data.url) {
                localStorage.setItem('return_from_portal', 'true');
                console.log('Redirecting to portal:', response.data.url);
                window.location.href = response.data.url;
            } else {
                throw new Error("No portal URL received from server.");
            }
        } catch (error) {
            console.error('Error accessing subscription management:', error);
            setError(error.response?.data?.error || 'Failed to access subscription management portal. Please try again.');
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const handleReturnFromPortal = async () => {
            const returnFromPortal = localStorage.getItem('return_from_portal');
            if (returnFromPortal) {
                console.log("Returned from Stripe portal, refreshing profile...");
                localStorage.removeItem('return_from_portal');
                setLoading(true);
                setShowSuccess(false);
                try {
                    await fetchUserProfile();
                    setShowSuccess(true);
                    setSuccessMessage("Your subscription details may have been updated.");
                } catch (error) {
                    console.error('Error refreshing profile after portal return:', error);
                    setError('Failed to refresh profile after returning from portal. Please refresh the page.');
                } finally {
                    setLoading(false);
                }
            }
        };

        handleReturnFromPortal();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        } catch (e) {
            console.warn(`Invalid date encountered: ${dateString}`);
            return 'Invalid Date';
        }
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
        console.log("Subscription changed locally (e.g., cancellation), refreshing profile...");
        await fetchUserProfile();
    };

    const verifyPayment = async (tier) => {
        try {
            const response = await api.post('/verify-subscription', { tier });
            console.log('Verification response:', response.data);

            await fetchUserProfile();

            setShowSuccess(true);
            setPaymentError(null);

            window.history.replaceState({}, document.title, "/profile");
            localStorage.removeItem('selected_tier');

            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error verifying payment:', error);
            setPaymentError(error.response?.data?.error || 'Failed to verify payment');
        }
    };

    const handleContactSubmit = async () => {
        if (!contactMessage.trim()) return;
        setIsSending(true);
        setError(null);
        try {
            const response = await api.post('/contact', { message: contactMessage });
            if (response.data.success) {
                setContactMessage('');
                setOpenContactDialog(false);
                setShowSuccess(true);
                setSuccessMessage("Your message has been sent. We'll get back to you soon!");
            } else {
                throw new Error(response.data.error || "Failed to send message.");
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError(error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
                <CircularProgress sx={{ color: theme.palette.secondary.main }} />
            </Box>
        );
    }

    if (error && !userProfile) {
        return (
            <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
                <Alert severity="error" sx={{}}>{error}</Alert>
                <Button onClick={fetchUserProfile} sx={{ mt: 2 }}>Try Again</Button>
            </Container>
        );
    }

    if (!userProfile) {
        return (
            <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
                <Typography>Could not load user profile.</Typography>
                <Button onClick={fetchUserProfile} sx={{ mt: 2 }}>Try Again</Button>
            </Container>
        );
    }

    const currentPlan = userProfile?.account?.account_type || 'free';

    const subscriptionTiers = [
        {
            title: "Free",
            price: "$0 / month",
            features: [
                "1 bridge Link",
                "30 AI Minutes/mo",
                "Basic AI Q&A",
                "Voice Clone",
                "Basic Analytics",
                "1 Flow Limit",
                "Watermark"
            ],
            isActive: currentPlan === 'free',
            tier: 'free',
            onClick: currentPlan !== 'free' ? handleManageSubscription : undefined,
            isPremium: false,
        },
        {
            title: "Standard",
            price: "$49 / month",
            features: [
                "10 bridge Links",
                "300 AI Minutes/mo",
                "Basic AI Q&A",
                "Voice Clone",
                "Basic Analytics",
                "1 Flow Limit",
                "Watermark"
            ],
            isActive: currentPlan === 'standard',
            tier: 'standard',
            onClick: currentPlan === 'pro'
                ? handleManageSubscription
                : handleStandardUpgrade,
            isPremium: false,
        },
        {
            title: "Premium",
            price: "$149 / month",
            features: [
                "Unlimited Links",
                "1000 AI Minutes/mo",
                "Unlimited Flows",
                "Voice Clone",
                "CRM / Webhooks",
                "Adv. Analytics",
                "No Watermark"
            ],
            isActive: currentPlan === 'pro',
            tier: 'premium',
            onClick: handlePremiumUpgrade,
            isPremium: true,
        }
    ];

    const getSubscriptionDescription = (plan) => {
        switch (plan) {
            case 'standard':
                return "Manage your Standard plan or upgrade for unlimited possibilities.";
            case 'pro':
                return "You have unlocked all features with the Premium plan.";
            default:
                return "Choose a plan to unlock more features and increase your limits.";
        }
    };

    return (
        <Box sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: 'calc(100vh - 64px)',
            py: { xs: 3, md: 5 },
            position: 'relative',
            overflow: 'hidden',
        }}>
            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    px: { xs: 2, sm: 3 }
                }}
            >
                {(showSuccess && successMessage) && (
                    <motion.div>
                        <Alert
                            severity="success"
                            onClose={() => { setShowSuccess(false); setSuccessMessage(''); }}
                            sx={{
                                mb: 3,
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                                border: `1px solid ${theme.palette.secondary.light}`,
                                '& .MuiAlert-icon': { color: theme.palette.secondary.main }
                            }}
                        >
                            {successMessage}
                        </Alert>
                    </motion.div>
                )}
                {(error && !paymentError) && (
                    <motion.div>
                        <Alert
                            severity="error"
                            onClose={() => setError(null)}
                            sx={{
                                mb: 3,
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.error.main,
                                border: `1px solid ${theme.palette.error.main}`,
                                '& .MuiAlert-icon': { color: theme.palette.error.main }
                            }}
                        >
                            {error}
                        </Alert>
                    </motion.div>
                )}
                {paymentError && (
                    <motion.div>
                        <Alert
                            severity="error"
                            onClose={() => setPaymentError(null)}
                            sx={{
                                mb: 3,
                                backgroundColor: theme.palette.background.paper,
                                color: theme.palette.error.main,
                                border: `1px solid ${theme.palette.error.main}`,
                                '& .MuiAlert-icon': { color: theme.palette.error.main }
                            }}
                        >
                            {paymentError}
                        </Alert>
                    </motion.div>
                )}

                <Grid container spacing={{ xs: 3, md: 4 }}>
                    <Grid item xs={12} md={4}>
                        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <Paper elevation={1} sx={{ p: 3, mb: 3, textAlign: 'center', borderRadius: '16px' }}>
                                <motion.div whileHover={{ scale: 1.03 }}>
                                    <Avatar
                                        sx={{
                                            width: { xs: 80, md: 90 },
                                            height: { xs: 80, md: 90 },
                                            bgcolor: theme.palette.neutral.light,
                                            color: theme.palette.primary.main,
                                            margin: '0 auto',
                                            mb: 2,
                                            border: `2px solid ${theme.palette.divider}`,
                                            boxShadow: theme.shadows[2]
                                        }}
                                    >
                                        <PersonIcon sx={{ fontSize: { xs: 35, md: 40 } }} />
                                    </Avatar>
                                </motion.div>
                                <Typography variant="h6" sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                    mb: 0.5,
                                    wordBreak: 'break-all'
                                }}>
                                    {userProfile?.email}
                                </Typography>
                                <Typography variant="caption" sx={{
                                    display: 'block',
                                    mb: 2
                                }}>
                                    Member since {formatDate(userProfile?.account?.created_at)}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    startIcon={<MailOutlineIcon />}
                                    onClick={() => setOpenContactDialog(true)}
                                >
                                    Contact Support
                                </Button>
                            </Paper>
                        </motion.div>

                        <BillingCard
                            userProfile={userProfile}
                            currentPlan={currentPlan}
                            onSubscriptionChange={handleSubscriptionChange}
                        />

                        <UsageStats currentPlan={currentPlan} />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper elevation={1} sx={{
                            p: { xs: 2.5, sm: 3, md: 4 },
                            borderRadius: '16px',
                            position: 'relative',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: { xs: 4, md: 5 }
                            }}>
                                <Box>
                                    <Typography variant="h3" sx={{
                                        fontWeight: 500,
                                        mb: 0.5,
                                        lineHeight: 1.2,
                                    }}>
                                        Your Plan
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        color: theme.palette.text.secondary,
                                    }}>
                                        {getSubscriptionDescription(currentPlan)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                {subscriptionTiers.map((tier, index) => (
                                    <Grid item xs={12} md={4} key={index} sx={{ display: 'flex' }}>
                                        <SubscriptionTier {...tier} />
                                    </Grid>
                                ))}
                            </Grid>

                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 4,
                                    textAlign: 'center',
                                    color: theme.palette.text.secondary,
                                    '& span': {
                                        color: theme.palette.text.primary,
                                        fontWeight: 500,
                                    }
                                }}
                            >
                                Standard and Premium plans include an option for overage at <span>$0.12 per minute</span> for engagement beyond the monthly allowance. Manage this in Billing Information.
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 2,
                                    textAlign: 'center',
                                    display: 'block',
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                Need a custom solution?{' '}
                                <RouterLink
                                    to="/contact"
                                    style={{
                                        color: theme.palette.secondary.main,
                                        textDecoration: 'underline',
                                        textDecorationColor: theme.palette.secondary.light,
                                    }}
                                >
                                    Contact Us
                                </RouterLink>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Dialog
                open={openContactDialog}
                onClose={() => setOpenContactDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { p: { xs: 2, sm: 3 } }
                }}
            >
                <DialogTitle sx={{ p: 0, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                    >
                        Contact Support
                    </Typography>
                    <IconButton onClick={() => setOpenContactDialog(false)} size="small">
                        <CloseIcon sx={{ color: theme.palette.text.secondary }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, mb: 2 }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                        Have questions or need assistance? Send us a message.
                    </Typography>
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Type your message here..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                    />
                    {error && openContactDialog && (
                        <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 0 }}>
                    <Button
                        variant="outlined"
                        onClick={() => { setOpenContactDialog(false); setError(null); }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleContactSubmit}
                        disabled={!contactMessage.trim() || isSending}
                    >
                        {isSending ? <CircularProgress size={20} color="inherit" /> : 'Send Message'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

function alpha(color, opacity) {
    if (!color.startsWith('#')) {
        console.warn("Basic alpha function requires hex color format");
        return color;
    }
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default UserProfilePage;