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
    IconButton,
    useMediaQuery,
    Tabs,
    Tab
} from '@mui/material';
import { api } from '../api';
import {
    User,
    Check,
    Calendar,
    Crown,
    CreditCard,
    Receipt,
    RefreshCw,
    Star,
    X,
    Save,
    Unlock,
    Mail,
    Zap,
    TrendingUp,
    Shield,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import DotBridgeButton from '../components/DotBridgeButton';
import DotBridgeTypography from '../components/DotBridgeTypography';
import DotBridgeIcon from '../components/DotBridgeIcon';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const TierButton = ({ isActive, isPremium, onClick, children, tier }) => {
    const theme = useTheme();

    return (
        <DotBridgeButton
            variant={isActive ? "outlined" : (isPremium && tier !== 'free') ? "contained" : "outlined"}
            disabled={isActive}
            onClick={onClick}
            sx={{
                minWidth: '120px',
                height: '44px',
                borderRadius: 2,
                fontSize: '0.9rem',
                fontWeight: 600,
                width: '100%',
                transition: 'all 0.2s ease',
                ...(isActive && {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}10`,
                    color: theme.palette.primary.main,
                    '&.Mui-disabled': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: `${theme.palette.primary.main}10`,
                        color: theme.palette.primary.main,
                        opacity: 1
                    }
                }),
                ...(isPremium && !isActive && {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}30`
                })
            }}
            startIcon={isActive ? <Check size={16} /> : (isPremium && <Star size={16} />)}
        >
            {isActive ? 'Current Plan' : children}
        </DotBridgeButton>
    );
};

// Add custom tab panel component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Simplified subscription tier component
const SubscriptionTierCompact = ({ title, price, features, isActive, onClick, isPremium, tier }) => {
    const theme = useTheme();
    const handleClick = () => {
        localStorage.setItem('selected_tier', tier);
        onClick();
    };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ height: '100%' }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isActive
                        ? theme.palette.primary.main
                        : theme.palette.divider,
                    position: 'relative',
                    overflow: 'hidden',
                    background: theme.palette.background.paper,
                    transition: 'all 0.2s ease',
                    ...(isPremium && !isActive && {
                        borderColor: theme.palette.primary.light,
                    }),
                    '&:hover': {
                        boxShadow: theme.shadows[2],
                        borderColor: isActive
                            ? theme.palette.primary.main
                            : theme.palette.primary.light,
                    },
                }}
            >
                {isPremium && (
                    <Chip
                        size="small"
                        label="RECOMMENDED"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            color: 'white'
                        }}
                    />
                )}

                <Box sx={{ mb: 2 }}>
                    <DotBridgeTypography variant="h6" sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 0.5,
                        fontSize: '1.1rem'
                    }}>
                        {title}
                    </DotBridgeTypography>
                    <DotBridgeTypography variant="h5" sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontSize: '1.5rem'
                    }}>
                        {price}
                    </DotBridgeTypography>
                </Box>

                <Box sx={{ flexGrow: 1, mb: 2 }}>
                    {features.slice(0, 4).map((feature, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 0.75,
                            gap: 1
                        }}>
                            <Check size={14} color={theme.palette.primary.main} />
                            <DotBridgeTypography sx={{
                                fontSize: '0.8rem',
                                color: theme.palette.text.secondary,
                            }}>
                                {feature}
                            </DotBridgeTypography>
                        </Box>
                    ))}
                    {features.length > 4 && (
                        <DotBridgeTypography sx={{
                            fontSize: '0.75rem',
                            color: theme.palette.text.secondary,
                            fontStyle: 'italic',
                            mt: 0.5
                        }}>
                            +{features.length - 4} more features
                        </DotBridgeTypography>
                    )}
                </Box>

                <DotBridgeButton
                    variant={isActive ? "outlined" : isPremium ? "contained" : "text"}
                    fullWidth
                    size="small"
                    onClick={handleClick}
                    disabled={isActive}
                    sx={{
                        py: 0.75,
                        fontSize: '0.8rem',
                        ...(isActive && {
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                        })
                    }}
                >
                    {isActive ? 'Current Plan' : 'Select'}
                </DotBridgeButton>
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
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
        >
            <Paper elevation={0} sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: theme.palette.divider,
                background: theme.palette.background.paper
            }}>
                <AnimatePresence>
                    {showCancelSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Alert
                                severity="success"
                                onClose={() => setShowCancelSuccess(false)}
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        color: theme.palette.success.main
                                    }
                                }}
                            >
                                Your subscription has been successfully canceled and will remain active until the end of the current period.
                            </Alert>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Alert
                                severity="error"
                                onClose={() => setError(null)}
                                sx={{
                                    mb: 2,
                                    borderRadius: 2
                                }}
                            >
                                {error}
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: 'primary.lighter',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Receipt size={20} color={theme.palette.primary.main} />
                        </Box>
                        <DotBridgeTypography variant="h6" sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary
                        }}>
                            Billing Information
                        </DotBridgeTypography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <DotBridgeTypography variant="body2" color="text.secondary">Plan</DotBridgeTypography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                <DotBridgeTypography variant="body1" sx={{ fontWeight: 600 }}>
                                    {currentPlan === 'pro' ? 'Premium' :
                                        currentPlan === 'standard' ? 'Standard' : 'Free'}
                                </DotBridgeTypography>
                                <Chip
                                    size="small"
                                    label={currentPlan === 'pro' ? 'PRO' : currentPlan.toUpperCase()}
                                    sx={{
                                        height: 22,
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        bgcolor: currentPlan === 'pro' ? 'primary.main' :
                                            currentPlan === 'standard' ? 'success.main' :
                                                'grey.500',
                                        color: 'white'
                                    }}
                                />
                            </Box>
                            {userProfile?.account?.subscription_status === 'canceled' && currentPlan !== 'free' && (
                                <DotBridgeTypography variant="caption" sx={{
                                    display: 'block',
                                    color: theme.palette.warning.main,
                                    mt: 0.5
                                }}>
                                    Cancels on: {formatDate(userProfile?.account?.next_billing_date)}
                                </DotBridgeTypography>
                            )}
                        </Grid>

                        <Grid item xs={6}>
                            <DotBridgeTypography variant="body2" color="text.secondary">Billing Period</DotBridgeTypography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <DotBridgeTypography variant="body1">Monthly</DotBridgeTypography>
                        </Grid>

                        {currentPlan !== 'free' && (
                            <>
                                <Grid item xs={6}>
                                    <DotBridgeTypography variant="body2" color="text.secondary">Next Payment</DotBridgeTypography>
                                </Grid>
                                <Grid item xs={6} textAlign="right">
                                    <DotBridgeTypography variant="body1">
                                        {userProfile?.account?.subscription_status === 'canceled' ? 'N/A' :
                                            formatDate(userProfile?.account?.next_billing_date)}
                                    </DotBridgeTypography>
                                </Grid>

                                <Grid item xs={6}>
                                    <DotBridgeTypography variant="body2" color="text.secondary">Payment Method</DotBridgeTypography>
                                </Grid>
                                <Grid item xs={6} textAlign="right">
                                    <Chip
                                        icon={<CreditCard size={14} />}
                                        label={`•••• ${userProfile?.payment_method_last4 || '****'}`}
                                        size="small"
                                        sx={{
                                            bgcolor: 'grey.100',
                                            color: 'text.primary',
                                            fontSize: '0.8rem',
                                            height: '26px',
                                            '& .MuiChip-icon': {
                                                color: 'text.secondary',
                                                ml: 0.5
                                            }
                                        }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>

                {(currentPlan === 'standard' || currentPlan === 'pro') && (
                    <Box sx={{
                        mt: 2,
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box>
                            <DotBridgeTypography sx={{
                                fontWeight: 500,
                                fontSize: '0.95rem',
                                color: 'text.primary'
                            }}>
                                Allow Overage Usage
                            </DotBridgeTypography>
                            <DotBridgeTypography sx={{
                                fontSize: '0.8rem',
                                color: 'text.secondary',
                                mt: 0.5
                            }}>
                                $0.12/min for additional AI minutes
                            </DotBridgeTypography>
                        </Box>
                        <Switch
                            checked={allowOverage}
                            onChange={handleOverageToggle}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: theme.palette.primary.main,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: theme.palette.primary.main,
                                }
                            }}
                        />
                    </Box>
                )}

                {currentPlan !== 'free' && userProfile?.account?.subscription_status !== 'canceled' && (
                    <DotBridgeButton
                        variant="outlined"
                        startIcon={<X size={16} />}
                        fullWidth
                        onClick={() => setOpenConfirmDialog(true)}
                        sx={{
                            borderColor: theme.palette.error.main,
                            color: theme.palette.error.main,
                            mt: 1,
                            '&:hover': {
                                borderColor: theme.palette.error.main,
                                backgroundColor: `${theme.palette.error.main}08`
                            }
                        }}
                    >
                        Cancel Plan
                    </DotBridgeButton>
                )}

                <Dialog
                    open={openConfirmDialog}
                    onClose={() => setOpenConfirmDialog(false)}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            maxWidth: '500px',
                            width: '100%',
                            p: { xs: 2, sm: 3 }
                        }
                    }}
                >
                    <DialogTitle sx={{ p: 0, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <DotBridgeTypography variant="h5" sx={{ fontWeight: 600 }}>
                                Cancel Subscription?
                            </DotBridgeTypography>
                            <IconButton onClick={() => setOpenConfirmDialog(false)} size="small">
                                <X size={20} />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ p: 0 }}>
                        <DotBridgeTypography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                            Your access remains until the current period ends.
                        </DotBridgeTypography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[
                                {
                                    icon: <Calendar size={20} />,
                                    title: 'Active Until Period End',
                                    description: `Your ${currentPlan} plan remains active until ${formatDate(userProfile?.account?.next_billing_date)}.`
                                },
                                {
                                    icon: <Save size={20} />,
                                    title: 'Preserved Content',
                                    description: 'Your Bridges and Flows will be preserved but inactive after the period ends.'
                                },
                                {
                                    icon: <RefreshCw size={20} />,
                                    title: 'Reactivate Anytime',
                                    description: 'You can easily reactivate your subscription later.'
                                },
                                {
                                    icon: <Unlock size={20} />,
                                    title: 'Free Tier Access',
                                    description: 'Free tier limits apply after cancellation (1 Bridge & 1 Flow, 30 mins/month).'
                                }
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'grey.50',
                                        border: '1px solid',
                                        borderColor: 'grey.200'
                                    }}
                                >
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 1.5,
                                        bgcolor: 'primary.lighter',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        color: 'primary.main'
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <DotBridgeTypography sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            fontSize: '0.95rem'
                                        }}>
                                            {item.title}
                                        </DotBridgeTypography>
                                        <DotBridgeTypography sx={{
                                            fontSize: '0.85rem',
                                            color: 'text.secondary',
                                            lineHeight: 1.5
                                        }}>
                                            {item.description}
                                        </DotBridgeTypography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ p: 0, pt: 3 }}>
                        <DotBridgeButton
                            variant="outlined"
                            onClick={() => setOpenConfirmDialog(false)}
                        >
                            Keep Subscription
                        </DotBridgeButton>
                        <DotBridgeButton
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
                                bgcolor: theme.palette.error.main,
                                '&:hover': {
                                    bgcolor: theme.palette.error.dark
                                }
                            }}
                        >
                            Confirm Cancellation
                        </DotBridgeButton>
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

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
        >
            <Paper elevation={0} sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: theme.palette.divider,
                background: theme.palette.background.paper
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'primary.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TrendingUp size={20} color={theme.palette.primary.main} />
                    </Box>
                    <DotBridgeTypography variant="h6" sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary
                    }}>
                        Usage Statistics
                    </DotBridgeTypography>
                </Box>

                {loadingStats && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                {statsError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{statsError}</Alert>
                )}

                {!loadingStats && !statsError && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
                                    <DotBridgeTypography variant="body1" sx={{ fontWeight: 500 }}>
                                        Bridges
                                    </DotBridgeTypography>
                                    <DotBridgeTypography variant="body2" color="text.secondary">
                                        {stats.brdges_created} / {stats.brdges_limit === 'Unlimited' ? '∞' : stats.brdges_limit}
                                    </DotBridgeTypography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={getBrdgeUsagePercentage()}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: theme.palette.grey[200],
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
                                    <DotBridgeTypography variant="body1" sx={{ fontWeight: 500 }}>
                                        AI Minutes
                                    </DotBridgeTypography>
                                    <DotBridgeTypography variant="body2" color="text.secondary">
                                        {stats.minutes_used} / {stats.minutes_limit}
                                    </DotBridgeTypography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={getMinutesUsagePercentage()}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: theme.palette.grey[200],
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                            background: getMinutesUsagePercentage() > 90
                                                ? `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`
                                                : `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>

                        {(currentPlan === 'standard' || currentPlan === 'pro') && stats.minutes_used > stats.minutes_limit && (
                            <Grid item xs={12}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: 'warning.lighter',
                                    border: '1px solid',
                                    borderColor: 'warning.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <AlertCircle size={16} color={theme.palette.warning.main} />
                                    <DotBridgeTypography variant="caption" sx={{
                                        color: theme.palette.warning.dark,
                                        fontWeight: 500
                                    }}>
                                        Overage minutes are billed at $0.12/min
                                    </DotBridgeTypography>
                                </Box>
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    const [tabValue, setTabValue] = useState(0);

    // New state for upgrade confirmation modal
    const [upgradePreview, setUpgradePreview] = useState(null);
    const [openUpgradeConfirmDialog, setOpenUpgradeConfirmDialog] = useState(false);
    const [targetUpgradeTier, setTargetUpgradeTier] = useState(null);

    const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/user/profile');
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
                setError('Checkout process was cancelled.');
                window.history.replaceState({}, document.title, "/profile");
                localStorage.removeItem('selected_tier');
            }
        };

        checkPaymentStatus();
    }, []);

    const executeSubscriptionChange = async (tier) => {
        setIsProcessing(true);
        setPaymentError(null);
        setError(null);
        try {
            const response = await api.post('/create-checkout-session', { tier: tier });

            if (response.data.updated_directly) {
                setShowSuccess(true);
                setSuccessMessage(response.data.message || 'Subscription updated successfully!');
                fetchUserProfile();
                if (response.data.requires_action && response.data.payment_intent_client_secret) {
                    console.warn('Subscription update requires further payment action (e.g., 3DS).');
                    alert('Your subscription update requires an additional confirmation step. Please follow any prompts from Stripe or your bank.');
                    setPaymentError('Your subscription change needs an extra confirmation step. Please complete it to activate your new plan.');
                }
            } else if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error(response.data.error || "Couldn't process subscription change.");
            }
        } catch (error) {
            console.error(`Error executing subscription change for ${targetUpgradeTier}:`, error);
            setPaymentError(error.response?.data?.error || error.message || `Failed to complete ${targetUpgradeTier} subscription. Please try again.`);
            localStorage.removeItem('selected_tier');
        } finally {
            setIsProcessing(false);
            setOpenUpgradeConfirmDialog(false);
            setTargetUpgradeTier(null);
            setUpgradePreview(null);
        }
    };

    const handleUpgradeIntent = async (tier) => {
        const currentPlan = userProfile?.account?.account_type || 'free';
        const isActualUpgrade = (currentPlan === 'standard' && tier === 'premium');

        if (currentPlan === 'free' || !isActualUpgrade) {
            setTargetUpgradeTier(tier);
            localStorage.setItem('selected_tier', tier);
            executeSubscriptionChange(tier);
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);
        setError(null);
        setTargetUpgradeTier(tier);
        localStorage.setItem('selected_tier', tier);

        try {
            const response = await api.post('/preview-subscription-upgrade', { target_tier: tier });
            if (response.data.already_on_plan) {
                setShowSuccess(true);
                setSuccessMessage(response.data.message || "You are already on this plan.");
                setIsProcessing(false);
                setTargetUpgradeTier(null);
                localStorage.removeItem('selected_tier');
            } else {
                setUpgradePreview(response.data);
                setOpenUpgradeConfirmDialog(true);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(`Error fetching upgrade preview for ${tier}:`, error);
            setPaymentError(error.response?.data?.error || `Failed to get upgrade preview for ${tier}. Please try again.`);
            setIsProcessing(false);
            setTargetUpgradeTier(null);
            localStorage.removeItem('selected_tier');
        }
    };

    const handleStandardUpgrade = () => {
        if (currentPlan === 'free') {
            setTargetUpgradeTier('standard');
            localStorage.setItem('selected_tier', 'standard');
            executeSubscriptionChange('standard');
        } else {
            handleManageSubscription();
        }
    };

    const handlePremiumUpgrade = () => {
        const currentPlan = userProfile?.account?.account_type || 'free';
        if (currentPlan === 'standard' || currentPlan === 'free') {
            handleUpgradeIntent('premium');
        } else {
            setShowSuccess(true);
            setSuccessMessage("You are already on the Premium plan or higher.");
        }
    };

    const handleManageSubscription = async () => {
        setIsProcessing(true);
        setError(null);
        setPaymentError(null);
        try {
            const response = await api.post('/create-portal-session');
            if (response.data.url) {
                localStorage.setItem('return_from_portal', 'true');
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
        await fetchUserProfile();
    };

    const verifyPayment = async (tier) => {
        try {
            const response = await api.post('/verify-subscription', { tier });

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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    if (error && !userProfile) {
        return (
            <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                <DotBridgeButton onClick={fetchUserProfile} sx={{ mt: 2 }}>Try Again</DotBridgeButton>
            </Container>
        );
    }

    if (!userProfile) {
        return (
            <Container maxWidth="md" sx={{ py: 5, textAlign: 'center' }}>
                <DotBridgeTypography variant="h6">Could not load user profile.</DotBridgeTypography>
                <DotBridgeButton onClick={fetchUserProfile} sx={{ mt: 2 }}>Try Again</DotBridgeButton>
            </Container>
        );
    }

    const currentPlan = userProfile?.account?.account_type || 'free';

    const formatCurrency = (amountCents, currencyCode = 'USD') => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amountCents / 100);
    };

    const subscriptionTiers = [
        {
            title: "Free",
            price: "$0 / month",
            features: [
                "1 Bridge Link",
                "30 AI Minutes/mo",
                "Voice Clone",
                "Basic Analytics",
                "1 Flow Limit",
                "Community Support"
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
                "10 Bridge Links",
                "300 AI Minutes/mo",
                "Voice Clone",
                "Basic Analytics",
                "1 Flow Limit",
                "Email Support"
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
                "100 Bridge Links",
                "1000 AI Minutes/mo",
                "100 Flows",
                "Voice Clone",
                "CRM / Webhooks",
                "Advanced Analytics",
                "No Watermark",
                "Priority Support"
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
            py: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
        }}>
            {!isMobile && (
                <>
                    <Box sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '-10%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        pointerEvents: 'none'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '-10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${theme.palette.primary.light}08 0%, transparent 70%)`,
                        filter: 'blur(80px)',
                        pointerEvents: 'none'
                    }} />
                </>
            )}

            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    px: { xs: 2, sm: 3 }
                }}
            >
                <AnimatePresence>
                    {(showSuccess && successMessage) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Alert
                                severity="success"
                                onClose={() => { setShowSuccess(false); setSuccessMessage(''); }}
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[2]
                                }}
                            >
                                {successMessage}
                            </Alert>
                        </motion.div>
                    )}
                    {(error && !paymentError) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Alert
                                severity="error"
                                onClose={() => setError(null)}
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[2]
                                }}
                            >
                                {error}
                            </Alert>
                        </motion.div>
                    )}
                    {paymentError && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Alert
                                severity="error"
                                onClose={() => setPaymentError(null)}
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[2]
                                }}
                            >
                                {paymentError}
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <Paper elevation={0} sx={{
                        p: { xs: 3, md: 4 },
                        mb: 4,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        background: theme.palette.background.paper
                    }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md="auto">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: { xs: 64, md: 80 },
                                            height: { xs: 64, md: 80 },
                                            bgcolor: 'primary.lighter',
                                            color: 'primary.main',
                                            border: '2px solid',
                                            borderColor: 'primary.light',
                                        }}
                                    >
                                        <User size={isMobile ? 32 : 40} />
                                    </Avatar>
                                    <Box>
                                        <DotBridgeTypography variant="h5" sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            color: theme.palette.text.primary
                                        }}>
                                            {userProfile?.email}
                                        </DotBridgeTypography>
                                        <DotBridgeTypography variant="body2" sx={{
                                            color: 'text.secondary'
                                        }}>
                                            Member since {formatDate(userProfile?.account?.created_at)}
                                        </DotBridgeTypography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md>
                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    justifyContent: { xs: 'stretch', md: 'flex-end' },
                                    flexDirection: { xs: 'column', sm: 'row' }
                                }}>
                                    <DotBridgeButton
                                        variant="outlined"
                                        startIcon={<Mail size={16} />}
                                        onClick={() => setOpenContactDialog(true)}
                                        sx={{ flex: { xs: 1, sm: 'initial' } }}
                                    >
                                        Contact Support
                                    </DotBridgeButton>
                                    {currentPlan !== 'free' && (
                                        <DotBridgeButton
                                            variant="contained"
                                            onClick={handleManageSubscription}
                                            disabled={isProcessing}
                                            sx={{ flex: { xs: 1, sm: 'initial' } }}
                                        >
                                            Manage Subscription
                                        </DotBridgeButton>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>

                <Paper elevation={0} sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    background: theme.palette.background.paper,
                    overflow: 'hidden'
                }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    minHeight: 48,
                                },
                            }}
                        >
                            <Tab label="Subscription" />
                            <Tab label="Billing & Usage" />
                            <Tab label="Account Settings" />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ mb: 3 }}>
                                <DotBridgeTypography variant="h4" sx={{
                                    fontWeight: 600,
                                    mb: 1
                                }}>
                                    Choose Your Plan
                                </DotBridgeTypography>
                                <DotBridgeTypography variant="body1" color="text.secondary">
                                    {getSubscriptionDescription(currentPlan)}
                                </DotBridgeTypography>
                            </Box>

                            <Grid container spacing={{ xs: 2, md: 3 }}>
                                {subscriptionTiers.map((tier, index) => (
                                    <Grid item xs={12} md={4} key={index} sx={{ display: 'flex' }}>
                                        <SubscriptionTierCompact {...tier} />
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{
                                mt: 4,
                                p: 2,
                                borderRadius: 1,
                                bgcolor: 'grey.50',
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}>
                                <DotBridgeTypography
                                    variant="caption"
                                    sx={{ color: theme.palette.text.secondary }}
                                >
                                    Standard and Premium plans include overage at <strong>$0.12/min</strong> for additional usage.
                                    Need a custom solution?{' '}
                                    <RouterLink to="/contact" style={{ color: theme.palette.primary.main }}>
                                        Contact Us
                                    </RouterLink>
                                </DotBridgeTypography>
                            </Box>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <BillingCard
                                        userProfile={userProfile}
                                        currentPlan={currentPlan}
                                        onSubscriptionChange={handleSubscriptionChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <UsageStats currentPlan={currentPlan} />
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Box sx={{ maxWidth: 600 }}>
                                <DotBridgeTypography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                                    Account Settings
                                </DotBridgeTypography>
                                <Box sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: theme.palette.divider,
                                    bgcolor: theme.palette.background.paper
                                }}>
                                    <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Email
                                    </DotBridgeTypography>
                                    <DotBridgeTypography variant="body1" sx={{ mb: 3 }}>
                                        {userProfile?.email}
                                    </DotBridgeTypography>

                                    <DotBridgeTypography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Member Since
                                    </DotBridgeTypography>
                                    <DotBridgeTypography variant="body1">
                                        {formatDate(userProfile?.account?.created_at)}
                                    </DotBridgeTypography>
                                </Box>
                            </Box>
                        </TabPanel>
                    </Box>
                </Paper>
            </Container>

            {upgradePreview && (
                <Dialog
                    open={openUpgradeConfirmDialog}
                    onClose={() => {
                        setOpenUpgradeConfirmDialog(false);
                        setUpgradePreview(null);
                        setTargetUpgradeTier(null);
                        localStorage.removeItem('selected_tier');
                    }}
                    PaperProps={{
                        sx: {
                            p: { xs: 2, sm: 3 },
                            minWidth: { sm: '450px' },
                            borderRadius: 3
                        }
                    }}
                >
                    <DialogTitle sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <DotBridgeTypography variant="h5" sx={{ fontWeight: 600 }}>
                            Confirm Upgrade to {upgradePreview.target_tier_name}
                        </DotBridgeTypography>
                        <IconButton onClick={() => {
                            setOpenUpgradeConfirmDialog(false);
                            setUpgradePreview(null);
                            setTargetUpgradeTier(null);
                            localStorage.removeItem('selected_tier');
                        }} size="small">
                            <X size={20} />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0, mb: 2 }}>
                        <DotBridgeTypography variant="body1" sx={{ mb: 2 }}>
                            You are upgrading to the <strong>{upgradePreview.target_tier_name}</strong> plan.
                        </DotBridgeTypography>

                        <Box sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: 'primary.lighter',
                            border: '1px solid',
                            borderColor: 'primary.light',
                            mb: 2
                        }}>
                            {upgradePreview.prorated_charge_now_cents > 0 ? (
                                <DotBridgeTypography variant="body2" sx={{ fontWeight: 500 }}>
                                    Immediate prorated charge: <strong>{formatCurrency(upgradePreview.prorated_charge_now_cents, upgradePreview.currency)}</strong>
                                </DotBridgeTypography>
                            ) : (
                                <DotBridgeTypography variant="body2" sx={{ fontWeight: 500 }}>
                                    No immediate prorated charge for this upgrade.
                                </DotBridgeTypography>
                            )}
                        </Box>

                        <DotBridgeTypography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Your next bill on <strong>{new Date(upgradePreview.next_billing_date_timestamp * 1000).toLocaleDateString()}</strong> will be <strong>{formatCurrency(upgradePreview.next_regular_charge_cents, upgradePreview.currency)}</strong>.
                        </DotBridgeTypography>

                        <DotBridgeTypography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                            By confirming, your subscription will be updated immediately.
                        </DotBridgeTypography>

                        {paymentError && openUpgradeConfirmDialog && (
                            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{paymentError}</Alert>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 0, gap: 1 }}>
                        <DotBridgeButton
                            variant="outlined"
                            onClick={() => {
                                setOpenUpgradeConfirmDialog(false);
                                setUpgradePreview(null);
                                setTargetUpgradeTier(null);
                                localStorage.removeItem('selected_tier');
                            }}
                        >
                            Cancel
                        </DotBridgeButton>
                        <DotBridgeButton
                            variant="contained"
                            onClick={() => executeSubscriptionChange(targetUpgradeTier)}
                            disabled={isProcessing}
                            loading={isProcessing}
                        >
                            Confirm & Upgrade
                        </DotBridgeButton>
                    </DialogActions>
                </Dialog>
            )}

            <Dialog
                open={openContactDialog}
                onClose={() => setOpenContactDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        p: { xs: 2, sm: 3 },
                        borderRadius: 3
                    }
                }}
            >
                <DialogTitle sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <DotBridgeTypography variant="h5" sx={{ fontWeight: 600 }}>
                        Contact Support
                    </DotBridgeTypography>
                    <IconButton onClick={() => setOpenContactDialog(false)} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, mb: 2 }}>
                    <DotBridgeTypography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Have questions or need assistance? Send us a message.
                    </DotBridgeTypography>
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Type your message here..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    {error && openContactDialog && (
                        <Alert severity="error" sx={{ mt: 1, borderRadius: 2 }}>{error}</Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 0, gap: 1 }}>
                    <DotBridgeButton
                        variant="outlined"
                        onClick={() => { setOpenContactDialog(false); setError(null); }}
                    >
                        Cancel
                    </DotBridgeButton>
                    <DotBridgeButton
                        variant="contained"
                        onClick={handleContactSubmit}
                        disabled={!contactMessage.trim() || isSending}
                        loading={isSending}
                    >
                        Send Message
                    </DotBridgeButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default UserProfilePage;