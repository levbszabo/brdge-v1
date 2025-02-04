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
import { motion } from 'framer-motion';

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
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: isPremium
            ? '0 8px 32px rgba(34, 211, 238, 0.3)'
            : '0 8px 32px rgba(255, 255, 255, 0.1)',
        border: isPremium
            ? '1px solid rgba(34, 211, 238, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.12)',
    },
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

const TierButton = ({ isActive, isPremium, onClick, children }) => (
    <Button
        variant="contained"
        disabled={isActive}
        onClick={onClick}
        sx={{
            minWidth: '120px',
            height: '36px',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
            boxShadow: 'none',
            padding: '0 12px',
            background: isActive
                ? 'rgba(66, 133, 244, 0.1)'
                : isPremium
                    ? 'linear-gradient(to right, #4285F4, #5B9AF5)'
                    : '#4285F4',
            color: isActive
                ? '#4285F4'
                : '#FFFFFF',
            border: 'none',
            transition: 'all 0.2s ease',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            margin: '0 auto',
            display: 'block',

            '&:hover': {
                background: isActive
                    ? 'rgba(66, 133, 244, 0.1)'
                    : isPremium
                        ? 'linear-gradient(to right, #3B78E7, #4285F4)'
                        : '#3B78E7',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
                transform: 'translateY(-1px)'
            },

            '&.Mui-disabled': {
                background: 'rgba(66, 133, 244, 0.1)',
                color: '#4285F4',
                opacity: 1
            },

            '&:active': {
                transform: 'translateY(1px)',
                boxShadow: 'none'
            }
        }}
    >
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'center',
            width: '100%'
        }}>
            {isActive ? (
                <>
                    <CheckIcon sx={{
                        fontSize: '16px',
                        color: '#4285F4'
                    }} />
                    <span>Current Plan</span>
                </>
            ) : (
                <>
                    {isPremium && (
                        <StarIcon sx={{
                            fontSize: '16px',
                            color: '#FFFFFF'
                        }} />
                    )}
                    <span>{children}</span>
                </>
            )}
        </Box>
    </Button>
);

const SubscriptionTier = ({ title, price, features, isActive, onClick, isPremium, tier }) => {
    const theme = useTheme();
    const handleClick = () => {
        localStorage.setItem('selected_tier', tier);
        onClick();
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
        >
            <Paper elevation={3} sx={{
                p: { xs: 3, sm: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                background: isPremium
                    ? 'linear-gradient(135deg, rgba(0, 82, 204, 0.15), rgba(7, 71, 166, 0.15))'
                    : 'rgba(255, 255, 255, 0.02)',
                border: isActive ? '2px solid #22D3EE' : '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: isPremium
                        ? '0 12px 40px rgba(34, 211, 238, 0.3)'
                        : '0 12px 40px rgba(0, 0, 0, 0.3)',
                    border: isActive
                        ? '2px solid #22D3EE'
                        : `1px solid ${isPremium ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                }
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 1,
                            fontFamily: 'Satoshi'
                        }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{
                            fontSize: { xs: '2rem', sm: '2.5rem' },
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            background: isPremium
                                ? 'linear-gradient(135deg, #22D3EE, #0EA5E9)'
                                : 'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0.8))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                            fontFamily: 'Satoshi'
                        }}>
                            {price}
                        </Typography>
                    </Box>
                    <TierButton
                        isActive={isActive}
                        isPremium={isPremium}
                        onClick={handleClick}
                    >
                        {isActive ? 'Current Plan' : 'Upgrade'}
                    </TierButton>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    {features.map((feature, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            <CheckIcon sx={{
                                mr: 1.5,
                                color: isPremium ? '#22D3EE' : 'rgba(255, 255, 255, 0.5)',
                                fontSize: '1.2rem'
                            }} />
                            <Typography sx={{
                                fontSize: '1rem',
                                lineHeight: 1.5,
                                letterSpacing: '0.01em',
                                fontFamily: 'Satoshi'
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

const styles = {
    pageBackground: {
        background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 100%)',
        minHeight: '100vh',
        padding: '40px 0',
        position: 'relative',
        overflow: 'hidden'
    },
    card: {
        ...cardStyles,
        padding: '24px',
        color: 'white',
        marginBottom: '24px'
    },
    profileSection: {
        textAlign: 'center',
        padding: { xs: '24px', md: '32px' },
        '& .MuiAvatar-root': {
            width: { xs: 80, md: 100 },
            height: { xs: 80, md: 100 },
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(34, 211, 238, 0.2))',
            border: '2px solid rgba(34, 211, 238, 0.3)',
            boxShadow: '0 8px 32px rgba(34, 211, 238, 0.2)',
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
    const [showCancelSuccess, setShowCancelSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [allowOverage, setAllowOverage] = useState(true);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const handleOverageToggle = async () => {
        try {
            const response = await api.post('/update-overage-settings', {
                allow_overage: !allowOverage
            });
            if (response.data.success) {
                setAllowOverage(!allowOverage);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update overage settings');
        }
    };

    useEffect(() => {
        // Initialize allowOverage from user profile if available
        if (userProfile?.account?.allow_overage !== undefined) {
            setAllowOverage(userProfile.account.allow_overage);
        }
    }, [userProfile]);

    return (
        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Paper elevation={0} sx={styles.card}>
                {showCancelSuccess && (
                    <Alert
                        severity="success"
                        onClose={() => setShowCancelSuccess(false)}
                        sx={{
                            mb: 2,
                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                            color: '#22D3EE',
                            border: '1px solid rgba(34, 211, 238, 0.2)',
                            '& .MuiAlert-icon': { color: '#22D3EE' }
                        }}
                    >
                        Your subscription has been successfully canceled.
                    </Alert>
                )}

                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError(null)}
                        sx={{
                            mb: 2,
                            backgroundColor: 'rgba(255, 75, 75, 0.1)',
                            color: '#FF4B4B',
                            border: '1px solid rgba(255, 75, 75, 0.2)',
                            '& .MuiAlert-icon': { color: '#FF4B4B' }
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box sx={styles.billingInfo}>
                    <div className="billing-header">
                        <ReceiptIcon sx={{ color: '#22D3EE' }} />
                        <Typography sx={{
                            background: 'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0.8))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Billing Information
                        </Typography>
                    </div>

                    <div className="billing-content">
                        <div className="billing-row">
                            <span className="label">Plan</span>
                            <span className="value" style={{
                                background: 'linear-gradient(90deg, #22D3EE, #0EA5E9)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 600
                            }}>
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

                        {/* Add overage toggle for standard and premium plans */}
                        {(currentPlan === 'standard' || currentPlan === 'pro') && (
                            <Box sx={{
                                mt: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                p: 1.5,
                            }}>
                                <Box>
                                    <Typography sx={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        lineHeight: 1.2,
                                    }}>
                                        Allow overage usage
                                    </Typography>
                                    <Typography sx={{
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: '0.75rem',
                                        mt: 0.5,
                                    }}>
                                        $0.12/min above plan limit
                                    </Typography>
                                </Box>
                                <Switch
                                    checked={allowOverage}
                                    onChange={handleOverageToggle}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#22D3EE',
                                            '&:hover': {
                                                backgroundColor: 'rgba(34, 211, 238, 0.08)',
                                            },
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#22D3EE',
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        {currentPlan !== 'free' && (
                            <Button
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                fullWidth
                                sx={{
                                    mt: 3,
                                    color: '#FF4B4B',
                                    borderColor: 'rgba(255, 75, 75, 0.3)',
                                    '&:hover': {
                                        borderColor: '#FF4B4B',
                                        backgroundColor: 'rgba(255, 75, 75, 0.1)'
                                    }
                                }}
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
                            background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(7, 11, 35, 0.95))',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            borderRadius: '24px',
                            color: 'white',
                            maxWidth: '480px',
                            width: '100%',
                            p: 4,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            '& .MuiDialogContent-root': {
                                padding: 0,
                                mt: 2
                            }
                        }
                    }}
                >
                    <DialogContent>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #FF3B30, #FF453A)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 2,
                                    fontFamily: 'Satoshi'
                                }}
                            >
                                Cancel Subscription?
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    fontFamily: 'Satoshi'
                                }}
                            >
                                We're sorry to see you go
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            {[
                                {
                                    title: 'Active Until Period End',
                                    description: 'Your subscription remains active until the end of your current billing period',
                                    icon: <CalendarTodayIcon />
                                },
                                {
                                    title: 'Preserved Content',
                                    description: 'Your brdges will be preserved but will become inactive',
                                    icon: <SaveIcon />
                                },
                                {
                                    title: 'Reactivate Anytime',
                                    description: 'You can reactivate your subscription at any time to regain access',
                                    icon: <AutorenewIcon />
                                },
                                {
                                    title: 'Free Tier Access',
                                    description: 'Free tier limits will apply after cancellation',
                                    icon: <LockOpenIcon />
                                }
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        mb: 3,
                                        p: 2,
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: '8px',
                                        background: 'rgba(255, 59, 48, 0.1)',
                                        color: '#FF3B30'
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontFamily: 'Satoshi'
                                        }}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: '0.9rem',
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            lineHeight: 1.4,
                                            fontFamily: 'Satoshi'
                                        }}>
                                            {item.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'flex-end',
                            mt: 4
                        }}>
                            <Button
                                variant="outlined"
                                onClick={() => setOpenConfirmDialog(false)}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    px: 3,
                                    py: 1.2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    fontFamily: 'Satoshi',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        background: 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                            >
                                Keep Subscription
                            </Button>
                            <Button
                                variant="contained"
                                onClick={async () => {
                                    try {
                                        const response = await api.post('/cancel-subscription');
                                        if (response.data.message) {
                                            setShowCancelSuccess(true);
                                            setOpenConfirmDialog(false);
                                            onSubscriptionChange();
                                        }
                                    } catch (error) {
                                        console.error('Error canceling subscription:', error);
                                        setError(error.response?.data?.error || 'Failed to cancel subscription');
                                    }
                                }}
                                sx={{
                                    background: 'linear-gradient(135deg, #FF3B30, #FF453A)',
                                    borderRadius: '12px',
                                    px: 3,
                                    py: 1.2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    fontFamily: 'Satoshi',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #FF453A, #FF5147)'
                                    }
                                }}
                            >
                                Confirm Cancellation
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Paper>
        </motion.div>
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
                return 1000;
            case 'standard':
                return 300;
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

    const getUsageDescription = (currentStats) => {
        if (!currentStats) return '';

        const brdgesUsed = currentStats.brdges_created;
        const brdgesLimit = currentStats.brdges_limit;
        const minutesUsed = Math.round(currentStats.minutes_used);
        const minutesLimit = currentStats.minutes_limit;

        return `Using ${brdgesUsed}/${brdgesLimit === 'Unlimited' ? '∞' : brdgesLimit} brdges and ${minutesUsed}/${minutesLimit} minutes`;
    };

    const isNearLimit = (currentStats) => {
        if (!currentStats || currentStats.brdges_limit === 'Unlimited') return false;

        const brdgeUsagePercent = (currentStats.brdges_created / parseInt(currentStats.brdges_limit)) * 100;
        const minuteUsagePercent = (currentStats.minutes_used / currentStats.minutes_limit) * 100;

        return brdgeUsagePercent >= 80 || minuteUsagePercent >= 80;
    };

    return (
        <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Paper elevation={0} sx={styles.card}>
                <Typography variant="h6" gutterBottom sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                    background: 'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0.8))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    <StarIcon sx={{ color: '#22D3EE' }} />
                    Usage Statistics
                </Typography>

                <Grid container spacing={4}>
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
                                sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '& .MuiLinearProgress-bar': {
                                        background: 'linear-gradient(90deg, #22D3EE, #0EA5E9)'
                                    }
                                }}
                            />
                        </Box>
                    </Grid>

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
                                sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    '& .MuiLinearProgress-bar': {
                                        background: 'linear-gradient(90deg, #22D3EE, #0EA5E9)'
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {isNearLimit(stats) && (
                    <Alert
                        severity="warning"
                        sx={{
                            mt: 2,
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            color: '#FFA726'
                        }}
                    >
                        You're approaching your plan limits. Consider upgrading to avoid interruption.
                    </Alert>
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
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const [contactMessage, setContactMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
            setPaymentError(error.response?.data?.error || 'Failed to start checkout process');
        } finally {
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
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Error:', error);
            setPaymentError(error.response?.data?.error || 'Failed to start checkout process');
        } finally {
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

    const handleContactSubmit = async () => {
        if (!contactMessage.trim()) return;

        setIsSending(true);
        try {
            const response = await api.post('/contact', { message: contactMessage });
            if (response.data.success) {
                setContactMessage('');
                setOpenContactDialog(false);
                setShowSuccess(true);
                setSuccessMessage("Your message has been submitted. We'll get back to you soon!");
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
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
                "Email Support",
                "Basic Customization"
            ],
            isActive: currentPlan === 'free',
            tier: 'free',
            onClick: handleManageSubscription
        },
        {
            title: "Standard",
            price: "$99/month",
            features: [
                "Up to 10 Bridges",
                "300 Minutes Monthly Usage",
                "Email Support",
                "Basic Customization"
            ],
            isActive: currentPlan === 'standard',
            onClick: currentPlan === 'pro' ? handleManageSubscription : handleStandardUpgrade,
            tier: 'standard'
        },
        {
            title: "Premium",
            price: "$249/month",
            features: [
                "Unlimited Bridges",
                "1000 Minutes Monthly Usage",
                "Priority Support",
                "Advanced Customization"
            ],
            isActive: currentPlan === 'pro',
            onClick: handlePremiumUpgrade,
            isPremium: true,
            tier: 'premium'
        }
    ];

    const getSubscriptionDescription = (currentPlan) => {
        switch (currentPlan) {
            case 'standard':
                return "You're on our Standard plan with 300 minutes/month. Upgrade to Premium for unlimited bridges!";
            case 'pro':
                return "You're on our Premium plan with 1000 minutes/month and unlimited bridges!";
            default:
                return "Upgrade your plan to get more minutes and bridges.";
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

            <Container
                maxWidth="lg"
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    px: { xs: 2, sm: 3, md: 4 } // Responsive padding
                }}
            >
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
                                {successMessage || 'Your subscription has been updated successfully!'}
                            </Alert>
                        </motion.div>
                    </Box>
                )}

                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
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
                                <Typography sx={{
                                    ...typography.heading,
                                    mb: 0.5,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                }}>
                                    {userProfile?.email}
                                </Typography>
                                <Typography sx={{ ...typography.caption, mb: 3 }}>
                                    Member since {formatDate(userProfile?.account?.created_at)}
                                </Typography>

                                <Button
                                    onClick={() => setOpenContactDialog(true)}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: '0.85rem',
                                        textTransform: 'none',
                                        '&:hover': {
                                            color: '#22D3EE',
                                            background: 'rgba(34, 211, 238, 0.05)'
                                        },
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        minWidth: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        mx: 'auto'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
                                    </svg>
                                    Contact Support
                                </Button>
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
                        <Paper elevation={0} sx={{
                            ...styles.card,
                            padding: { xs: '24px', sm: '32px', md: '40px' },
                            paddingLeft: { xs: '16px', sm: '24px', md: '32px' },
                            paddingRight: { xs: '16px', sm: '24px', md: '32px' },
                            background: 'linear-gradient(145deg, rgba(2, 6, 23, 0.98), rgba(7, 11, 35, 0.98))',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '32px',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <Box>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    mb: 8
                                }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '14px',
                                            background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(33, 150, 243, 0.1))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 32px rgba(0, 188, 212, 0.1)',
                                            zIndex: 3
                                        }}
                                    >
                                        <StarIcon
                                            sx={{
                                                fontSize: 24,
                                                color: '#00BCD4',
                                                filter: 'drop-shadow(0 0 10px rgba(0, 188, 212, 0.3))'
                                            }}
                                        />
                                    </Box>
                                    <div>
                                        <Typography sx={{
                                            fontSize: '2.5rem',
                                            fontWeight: 600,
                                            background: 'linear-gradient(to right, #FFFFFF, rgba(255, 255, 255, 0.8))',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mb: 1,
                                            letterSpacing: '-0.02em'
                                        }}>
                                            Choose Your Plan
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: '1.1rem',
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            fontWeight: 400
                                        }}>
                                            {getSubscriptionDescription(currentPlan)}
                                        </Typography>
                                    </div>
                                </Box>

                                <Grid container spacing={1.5} sx={{ position: 'relative', zIndex: 2 }}>
                                    {subscriptionTiers.map((tier, index) => (
                                        <Grid item xs={12} sm={4} key={index}>
                                            <motion.div
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                style={{ height: '100%', position: 'relative', zIndex: 2 }}
                                            >
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        ...tierCardStyles(tier.isActive, tier.isPremium),
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        position: 'relative',
                                                        zIndex: 2
                                                    }}
                                                >
                                                    <CardContent sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        height: '100%',
                                                        p: 2.5,
                                                        '&:last-child': { pb: 2.5 },
                                                        position: 'relative',
                                                        zIndex: 2
                                                    }}>
                                                        {/* Title and Price */}
                                                        <Box sx={{ mb: 3, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontSize: '1.1rem',
                                                                    fontWeight: 500,
                                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                                    mb: 2,
                                                                    letterSpacing: '-0.01em'
                                                                }}
                                                            >
                                                                {tier.title}
                                                            </Typography>
                                                            <Typography
                                                                variant="h4"
                                                                sx={{
                                                                    fontSize: '2.5rem',
                                                                    fontWeight: 600,
                                                                    background: tier.isPremium
                                                                        ? 'linear-gradient(135deg, #2196F3, #00BCD4)'
                                                                        : 'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0.8))',
                                                                    WebkitBackgroundClip: 'text',
                                                                    WebkitTextFillColor: 'transparent',
                                                                    mb: 0.5,
                                                                    letterSpacing: '-0.02em'
                                                                }}
                                                            >
                                                                {tier.price.split('/')[0]}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontSize: '0.9rem',
                                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                                    fontWeight: 400
                                                                }}
                                                            >
                                                                per month
                                                            </Typography>
                                                        </Box>

                                                        {/* Features List */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 2,
                                                            mb: 3,
                                                            flexGrow: 1,
                                                            position: 'relative',
                                                            zIndex: 2
                                                        }}>
                                                            {tier.features.map((feature, idx) => (
                                                                <Box
                                                                    key={idx}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 2,
                                                                        position: 'relative',
                                                                        zIndex: 2
                                                                    }}
                                                                >
                                                                    <CheckIcon sx={{
                                                                        fontSize: '1rem',
                                                                        color: tier.isPremium ? '#00BCD4' : '#4CAF50',
                                                                        filter: tier.isPremium ? 'drop-shadow(0 0 6px rgba(0, 188, 212, 0.3))' : 'none'
                                                                    }} />
                                                                    <Typography sx={{
                                                                        fontSize: '0.95rem',
                                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                                        fontWeight: 400,
                                                                        letterSpacing: '0.01em',
                                                                        lineHeight: 1.2
                                                                    }}>
                                                                        {feature}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                        {/* Action Button */}
                                                        <Box sx={{ mt: 'auto', position: 'relative', zIndex: 2 }}>
                                                            <Button
                                                                fullWidth
                                                                variant={tier.isPremium ? "contained" : "outlined"}
                                                                disabled={tier.isActive}
                                                                onClick={tier.onClick}
                                                                sx={{
                                                                    py: 1.5,
                                                                    borderRadius: '12px',
                                                                    textTransform: 'none',
                                                                    fontSize: '1rem',
                                                                    fontWeight: 500,
                                                                    letterSpacing: '0.01em',
                                                                    background: tier.isPremium
                                                                        ? 'linear-gradient(135deg, #00BCD4, #00ACC1)'
                                                                        : 'transparent',
                                                                    border: tier.isPremium
                                                                        ? 'none'
                                                                        : '1px solid rgba(255, 255, 255, 0.15)',
                                                                    color: tier.isPremium ? 'white' : '#00BCD4',
                                                                    boxShadow: tier.isPremium ? '0 8px 32px rgba(0, 188, 212, 0.15)' : 'none',
                                                                    '&:hover': {
                                                                        background: tier.isPremium
                                                                            ? 'linear-gradient(135deg, #00ACC1, #0097A7)'
                                                                            : 'rgba(0, 188, 212, 0.1)',
                                                                        border: tier.isPremium
                                                                            ? 'none'
                                                                            : '1px solid #00BCD4',
                                                                        boxShadow: tier.isPremium ? '0 12px 40px rgba(0, 188, 212, 0.2)' : 'none'
                                                                    },
                                                                    '&.Mui-disabled': {
                                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                                        color: 'white',
                                                                        border: 'none'
                                                                    }
                                                                }}
                                                            >
                                                                {tier.isActive ? 'Current Plan' :
                                                                    (tier.title === 'Free' && currentPlan !== 'free') ? 'Downgrade' :
                                                                        (tier.title === 'Standard' && currentPlan === 'free') ? 'Upgrade' :
                                                                            (tier.title === 'Standard' && currentPlan === 'pro') ? 'Downgrade' :
                                                                                (tier.title === 'Premium' && currentPlan !== 'pro') ? 'Upgrade' :
                                                                                    'Select Plan'}
                                                            </Button>
                                                            {paymentError && (
                                                                <Typography
                                                                    color="error"
                                                                    sx={{
                                                                        mt: 1,
                                                                        fontSize: '0.875rem',
                                                                        textAlign: 'center'
                                                                    }}
                                                                >
                                                                    {paymentError}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Typography
                                    sx={{
                                        mt: 4,
                                        textAlign: 'center',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '1rem',
                                        fontWeight: 400,
                                        letterSpacing: '0.01em',
                                        lineHeight: 1.6,
                                        fontFamily: 'Satoshi',
                                        '& span': {
                                            color: '#22D3EE',
                                            fontWeight: 500
                                        }
                                    }}
                                >
                                    Standard and Premium plans are billed at <span>$0.12 per minute</span> for usage above the included monthly minutes.
                                </Typography>
                            </Box>
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
                    sx: {
                        background: 'linear-gradient(145deg, rgba(2, 6, 23, 0.98), rgba(7, 11, 35, 0.98))',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            background: 'linear-gradient(to right, #FFFFFF 30%, rgba(255, 255, 255, 0.8))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 600
                        }}
                    >
                        Contact Us
                    </Typography>
                    <IconButton
                        onClick={() => setOpenContactDialog(false)}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            '&:hover': { color: 'white' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            mb: 2,
                            fontSize: '0.95rem'
                        }}
                    >
                        Have questions or need assistance? We're here to help!
                    </Typography>
                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Type your message here..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(34, 211, 238, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#22D3EE',
                                },
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: 'rgba(255, 255, 255, 0.5)',
                                opacity: 1,
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button
                        onClick={() => setOpenContactDialog(false)}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.05)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleContactSubmit}
                        disabled={!contactMessage.trim() || isSending}
                        sx={{
                            background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)',
                            color: 'white',
                            px: 3,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                            },
                            '&.Mui-disabled': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.3)',
                            }
                        }}
                    >
                        {isSending ? 'Sending...' : 'Send Message'}
                    </Button>
                </DialogActions>
            </Dialog>

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
                    .tier-card {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .tier-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 6px 16px rgba(0, 188, 212, 0.4);
                    }
                    @media (max-width: 600px) {
                        .tier-card {
                            margin-bottom: 16px;
                        }
                        .feature-list {
                            padding-left: 8px;
                            padding-right: 8px;
                        }
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