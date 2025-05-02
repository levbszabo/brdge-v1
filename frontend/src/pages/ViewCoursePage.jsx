import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Typography, CircularProgress, Button, Container, Divider,
    Card, CardContent, Avatar, Chip, IconButton, useTheme, useMediaQuery,
    Tooltip, Paper, Grid, Alert, Dialog, DialogTitle, DialogContent,
    DialogActions, DialogContentText
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TimerIcon from '@mui/icons-material/Timer';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Check, AlertTriangle, Lock } from 'lucide-react';
import { getAuthToken } from '../utils/auth';
import { api } from '../api';
import { AuthContext } from '../App';
import { useSnackbar } from '../utils/snackbar';

// Add the alpha helper function definition
function alpha(color, opacity) {
    // Basic implementation for hex colors
    if (!color || !color.startsWith('#')) {
        console.warn("Basic alpha function requires hex color format, received:", color);
        return color;
    }
    const hex = color.replace('#', '');
    if (hex.length !== 6) {
        console.warn("Basic alpha function requires 6-digit hex color, received:", color);
        return color;
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        console.warn("Failed to parse hex color:", color);
        return color;
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function ViewCoursePage() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { publicId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const token = getAuthToken();
    const { isAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flowData, setFlowData] = useState(null);
    const [activeBridgeIndex, setActiveBridgeIndex] = useState(0);
    const [bookmarkedBridges, setBookmarkedBridges] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const { showSnackbar } = useSnackbar();

    // Flow data states
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollButtonLoading, setEnrollButtonLoading] = useState(false);
    const [unenrollButtonLoading, setUnenrollButtonLoading] = useState(false);

    // Dialog states
    const [unenrollDialogOpen, setUnenrollDialogOpen] = useState(false);
    const [bridgeAccessDialogOpen, setBridgeAccessDialogOpen] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    useEffect(() => {
        const loadingTimer = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loadingTimer);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        return () => clearInterval(loadingTimer);
    }, []);

    useEffect(() => {
        const fetchFlowData = async () => {
            try {
                setLoading(true);
                console.log(`Fetching flow with public ID: ${publicId}`);

                const response = await api.get(`/courses/public/${publicId}`);
                console.log('Flow data received:', response.data);

                if (response.data.modules) {
                    response.data.modules.sort((a, b) => a.position - b.position);
                }

                setFlowData(response.data);

                if (response.data.user_enrolled) {
                    setIsEnrolled(true);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching flow data:', error);
                const errorMsg = error.response?.data?.error || 'Flow not found or not accessible';
                setError(errorMsg);
                setLoading(false);
            }
        };

        if (publicId) {
            fetchFlowData();
        }
    }, [publicId, token]);

    useEffect(() => {
        if (flowData && flowData.modules) {
            console.log('Flow bridges:', flowData.modules);
            if (flowData.modules.length > 0) {
                const firstBridge = flowData.modules[0];
                console.log('Bridge description:', firstBridge.description);
                console.log('Bridge has brdge object?', !!firstBridge.brdge);
                if (firstBridge.brdge) {
                    console.log('Brdge object description:', firstBridge.brdge.description);
                }
            }
        }
    }, [flowData]);

    useEffect(() => {
        if (flowData && flowData.modules) {
            console.log('Flow bridges:', flowData.modules);
            if (flowData.modules.length > 0) {
                flowData.modules.forEach(bridge => {
                    console.log(`Bridge ${bridge.id} thumbnail_url:`, bridge.thumbnail_url);
                    if (bridge.thumbnail_url) {
                        console.log(`Bridge ${bridge.id} normalized thumbnail:`, normalizeThumbnailUrl(bridge.thumbnail_url));
                    }
                });
            }
        }
    }, [flowData]);

    useEffect(() => {
        if (flowData && flowData.modules && flowData.modules.length > 0) {
            console.log('Flow has thumbnail?', !!flowData.thumbnail_url);
            console.log('All bridges:', flowData.modules);

            const firstBridge = flowData.modules[0];
            console.log('First bridge detailed inspection:', {
                id: firstBridge.id,
                direct_thumbnail: firstBridge.thumbnail_url,
                brdge_id: firstBridge.brdge_id,
                has_brdge_obj: !!firstBridge.brdge,
                brdge_thumbnail: firstBridge.brdge?.thumbnail_url,
                full_bridge: firstBridge
            });
        }
    }, [flowData]);

    useEffect(() => {
        if (flowData && flowData.modules && flowData.modules.length > 0) {
            console.log('DEBUGGING BRIDGE STRUCTURE:');
            flowData.modules.forEach((bridge, index) => {
                console.log(`Bridge ${index}`, {
                    id: bridge.id,
                    name: bridge.name || bridge.brdge?.name,
                    has_thumbnail: !!bridge.thumbnail_url,
                    thumbnail_url: bridge.thumbnail_url,
                    has_brdge: !!bridge.brdge
                });

                if (!bridge.thumbnail_url && bridge.brdge?.thumbnail_url) {
                    console.log(`Bridge ${index} has thumbnail in brdge but not directly`);
                }
            });

            setFlowData(prevFlow => {
                if (!prevFlow || !prevFlow.modules) return prevFlow;

                const updatedModules = prevFlow.modules.map(bridge => {
                    if (!bridge.thumbnail_url && bridge.brdge?.thumbnail_url) {
                        console.log(`Bridge ${bridge.id} has thumbnail in brdge but not directly`);
                        return {
                            ...bridge,
                            thumbnail_url: bridge.brdge.thumbnail_url
                        };
                    }
                    return bridge;
                });

                return {
                    ...prevFlow,
                    modules: updatedModules
                };
            });
        }
    }, [flowData?.id]);

    const handleStartBridge = (bridgeId, publicBridgeId) => {
        const bridgeData = flowData.modules.find(m => m.brdge_id === bridgeId);
        const isBridgePublic = bridgeData?.is_public || false;

        if (!isEnrolled && !isBridgePublic) {
            setBridgeAccessDialogOpen(true);
            return;
        }

        if (bridgeId) {
            const shortPublicId = typeof publicBridgeId === 'string' ?
                publicBridgeId.substring(0, 6) : publicBridgeId;
            navigate(`/viewBridge/${bridgeId}-${shortPublicId}`);
        }
    };

    const toggleBridgeBookmark = (bridgeId) => {
        setBookmarkedBridges(prev =>
            prev.includes(bridgeId)
                ? prev.filter(id => id !== bridgeId)
                : [...prev, bridgeId]
        );
    };

    const handleBackToDashboard = () => {
        navigate('/');
    };

    const normalizeThumbnailUrl = (url) => {
        if (!url) return null;

        if (url.startsWith('http')) return url;

        if (url.startsWith('/api')) {
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

            if (baseUrl.endsWith('/api')) {
                const cleanUrl = url.replace(/^\/api/, '');
                return `${baseUrl}${cleanUrl}`;
            }

            return `${baseUrl}${url}`;
        }

        return url;
    };

    const getBridgeThumbnail = (bridge) => {
        if (bridge && bridge.thumbnail_url) {
            return normalizeThumbnailUrl(bridge.thumbnail_url);
        }
        if (bridge && bridge.brdge && bridge.brdge.thumbnail_url) {
            return normalizeThumbnailUrl(bridge.brdge.thumbnail_url);
        }
        return null;
    };

    useEffect(() => {
        if (flowData?.modules?.length > 0) {
            console.log('DETAILED BRIDGE STRUCTURE:', JSON.stringify(flowData.modules[0], null, 2));
            const thumbnailUrls = flowData.modules
                .map(m => ({ id: m.id, thumb: m.thumbnail_url }))
                .filter(m => m.thumb);
            console.log('Bridges with thumbnails:', thumbnailUrls);
        }
    }, [flowData]);

    const getBridgeDescription = (bridge) => {
        if (bridge.description && bridge.description.trim() !== '') {
            return bridge.description;
        }
        if (bridge.brdge?.description && bridge.brdge.description.trim() !== '') {
            return bridge.brdge.description;
        }
        return "Explore this interactive bridge to enhance your understanding and skills.";
    };

    const getNestedProperty = (obj, path) => {
        if (!obj || !path) return undefined;
        return path.split('.').reduce((acc, part) =>
            acc && typeof acc === 'object' ? acc[part] : undefined,
            obj);
    };

    const getBridgeName = (bridge) => {
        return bridge.name ||
            bridge.brdge?.name ||
            `Bridge ${bridge.position || 'Unknown'}`;
    };

    const handleEnrollClick = async () => {
        if (!isAuthenticated) {
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/signup');
            return;
        }
        if (!flowData) return;

        setEnrollButtonLoading(true);
        try {
            await api.post(`/courses/${flowData.id}/enroll`);
            setIsEnrolled(true);
            showSnackbar('Successfully enrolled in the flow!', 'success');
        } catch (error) {
            console.error('Error enrolling in flow:', error);
            showSnackbar('Failed to enroll. Please try again.', 'error');
        } finally {
            setEnrollButtonLoading(false);
        }
    };

    const handleUnenrollClick = () => {
        setUnenrollDialogOpen(true);
    };

    const confirmUnenroll = async () => {
        setUnenrollButtonLoading(true);
        try {
            await api.post(`/courses/${flowData.id}/unenroll`);
            setIsEnrolled(false);
            showSnackbar('Successfully unenrolled from the flow', 'success');
        } catch (error) {
            console.error('Error unenrolling from flow:', error);
            showSnackbar('Failed to unenroll. Please try again.', 'error');
        } finally {
            setUnenrollButtonLoading(false);
            setUnenrollDialogOpen(false);
        }
    };

    const handleBridgeClick = (bridgePublicId, bridgeId) => {
        const bridgeData = flowData.modules.find(m => m.brdge_id === bridgeId);
        const isBridgePublic = bridgeData?.is_public || false;

        if (!isEnrolled && !isBridgePublic) {
            setBridgeAccessDialogOpen(true);
            return;
        }

        if (bridgeId) {
            const shortPublicId = typeof bridgePublicId === 'string' ?
                bridgePublicId.substring(0, 6) : bridgePublicId;
            navigate(`/viewBridge/${bridgeId}-${shortPublicId}`);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100vh',
                bgcolor: theme.palette.background.default,
                position: 'relative',
            }}>
                <Box sx={{ position: 'relative', width: 120, height: 120, zIndex: 1 }}>
                    <CircularProgress
                        variant="determinate"
                        value={loadingProgress}
                        size={120}
                        thickness={2}
                        sx={{
                            color: theme.palette.primary.main,
                        }}
                    />
                    <CircularProgress
                        size={120}
                        thickness={3}
                        sx={{
                            color: theme.palette.primary.light,
                            position: 'absolute',
                            left: 0,
                            animationDuration: '3s',
                            opacity: 0.5
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Typography variant="h4" sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 'bold',
                        }}>
                            {loadingProgress}%
                        </Typography>
                    </Box>
                </Box>
                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        mt: 4,
                        fontFamily: theme.typography.fontFamily,
                    }}
                >
                    Loading Flow...
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        maxWidth: 300,
                        textAlign: 'center',
                        mt: 1
                    }}
                >
                    Preparing your learning experience...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    bgcolor: theme.palette.background.default,
                    position: 'relative',
                    px: 3,
                    gap: 2,
                }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <Box
                            sx={{
                                p: 4,
                                bgcolor: theme.palette.background.paper,
                                borderRadius: 3,
                                boxShadow: theme.shadows[2],
                                border: `1px solid ${theme.palette.divider}`,
                                textAlign: 'center',
                                maxWidth: 500,
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                    letterSpacing: '-0.01em',
                                    mb: 2,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        display: 'block',
                                        width: '40px',
                                        height: '2px',
                                        background: theme.palette.primary.main,
                                        margin: '10px auto 0',
                                        borderRadius: '1px',
                                    }
                                }}
                            >
                                {error}
                            </Typography>

                            <Typography
                                variant="body1"
                                gutterBottom
                                sx={{
                                    color: theme.palette.text.secondary,
                                    mb: 3
                                }}
                            >
                                This flow either doesn't exist or you don't have permission to view it.
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    p: 2,
                                    borderRadius: '8px',
                                    mb: 3,
                                    fontFamily: 'monospace'
                                }}
                            >
                                Flow ID: {publicId}
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleBackToDashboard}
                                sx={{
                                    mt: 2,
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </Box>
                    </motion.div>
                </Box>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Box sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                position: 'relative',
                pt: '20px',
                pb: '40px',
            }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <motion.div variants={itemVariants}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBackToDashboard}
                                color="primary"
                                sx={{ mb: 2 }}
                            >
                                Back to Dashboard
                            </Button>
                        </motion.div>

                        <Box sx={{
                            p: 3,
                            borderRadius: '16px',
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            mb: 4,
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3,
                            boxShadow: theme.shadows[3],
                        }}>
                            {flowData.thumbnail_url && (
                                <Box sx={{
                                    width: { xs: '100%', md: '280px' },
                                    position: 'relative',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    zIndex: 1,
                                    border: `1px solid ${theme.palette.divider}`,
                                    boxShadow: theme.shadows[2],
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        paddingTop: '56.25%',
                                    }
                                }}>
                                    <Box
                                        component="img"
                                        src={normalizeThumbnailUrl(flowData.thumbnail_url)}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                        alt={`Thumbnail for ${flowData.name}`}
                                    />
                                </Box>
                            )}

                            <Box sx={{
                                flex: 1,
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <motion.div variants={itemVariants}>
                                    <Typography
                                        variant="h3"
                                        component="h1"
                                        sx={{
                                            fontWeight: 500,
                                            color: theme.palette.text.primary,
                                            mb: 1.5,
                                            letterSpacing: '-0.02em',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                display: 'block',
                                                width: '80px',
                                                height: '2px',
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                                                margin: '15px 0 0',
                                                borderRadius: '2px',
                                                opacity: 0.8,
                                            }
                                        }}
                                    >
                                        {flowData.name}
                                    </Typography>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            mb: 3,
                                            maxWidth: '800px',
                                            lineHeight: 1.6,
                                            fontSize: '1.05rem',
                                            position: 'relative',
                                            zIndex: 1,
                                            '& strong': {
                                                fontWeight: 600,
                                                color: theme.palette.text.primary,
                                                position: 'relative',
                                                display: 'inline-block',
                                            }
                                        }}
                                    >
                                        {flowData.description ? (
                                            <span dangerouslySetInnerHTML={{
                                                __html: flowData.description
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            }} />
                                        ) : (
                                            "Explore this interactive AI-powered learning flow. Navigate through bridges at your own pace and engage with immersive content."
                                        )}
                                    </Typography>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        alignItems: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}>
                                        <Chip
                                            icon={<AutoStoriesIcon sx={{ color: theme.palette.primary.main }} />}
                                            label={`${flowData.modules?.length || 0} Bridges`}
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.text.primary,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                fontWeight: 500,
                                                '& .MuiChip-icon': {
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        />

                                        <Chip
                                            icon={<TimerIcon sx={{ color: theme.palette.primary.main }} />}
                                            label="Self-paced learning"
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.text.primary,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                fontWeight: 500,
                                                '& .MuiChip-icon': {
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        />

                                        <Chip
                                            icon={<VerifiedIcon sx={{ color: theme.palette.primary.main }} />}
                                            label="AI-powered"
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.text.primary,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                fontWeight: 500,
                                                '& .MuiChip-icon': {
                                                    color: theme.palette.primary.main
                                                }
                                            }}
                                        />

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            ml: { xs: 0, md: 'auto' },
                                            mt: { xs: 1, md: 0 },
                                            position: 'relative',
                                            pr: 2,
                                        }}>
                                            <Avatar
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    bgcolor: theme.palette.neutral.light,
                                                    border: `1px solid ${theme.palette.divider}`
                                                }}
                                            >
                                                <PersonIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                            </Avatar>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    fontStyle: 'italic',
                                                }}
                                            >
                                                Created by {flowData.author || "DotBridge"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Box>
                        </Box>
                    </Box>

                    <motion.div variants={itemVariants}>
                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                color: theme.palette.text.primary,
                                mb: 3,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <AutoStoriesIcon sx={{ color: theme.palette.primary.main }} />
                            Flow Bridges
                        </Typography>
                    </motion.div>

                    {flowData.modules && flowData.modules.length > 0 ? (
                        <motion.div variants={itemVariants}>
                            <Box sx={{
                                '& .swiper': {
                                    padding: '40px 0',
                                    overflow: 'visible',
                                },
                                '& .swiper-slide': {
                                    width: { xs: '300px', sm: '400px' },
                                    transform: 'scale(0.9)',
                                    transition: 'all 0.3s ease',
                                    opacity: 0.7,
                                    '&.swiper-slide-active': {
                                        transform: 'scale(1)',
                                        opacity: 1,
                                    }
                                },
                                '& .swiper-button-next, & .swiper-button-prev': {
                                    color: theme.palette.primary.main,
                                    '&:after': {
                                    }
                                },
                                '& .swiper-pagination-bullet': {
                                    backgroundColor: theme.palette.primary.main,
                                    opacity: 0.7,
                                    '&.swiper-pagination-bullet-active': {
                                        opacity: 1,
                                        transform: 'scale(1.2)',
                                    }
                                }
                            }}>
                                <Swiper
                                    modules={[EffectCoverflow, Navigation, Pagination]}
                                    effect="coverflow"
                                    grabCursor={true}
                                    centeredSlides={true}
                                    slidesPerView={'auto'}
                                    coverflowEffect={{
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 200,
                                        modifier: 2.5,
                                        slideShadows: false
                                    }}
                                    navigation
                                    pagination={{ clickable: true }}
                                    initialSlide={0}
                                    slideToClickedSlide={true}
                                    onSlideChange={(swiper) => setActiveBridgeIndex(swiper.activeIndex)}
                                >
                                    {flowData.modules.map((bridge, index) => (
                                        <SwiperSlide key={bridge.id} style={{ width: isSmallScreen ? 300 : 400 }}>
                                            <Card sx={{
                                                height: '100%',
                                                bgcolor: theme.palette.background.paper,
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                transition: 'all 0.3s ease-in-out',
                                                border: `1px solid ${theme.palette.divider}`,
                                                boxShadow: theme.shadows[3],
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: theme.shadows[5],
                                                    borderColor: theme.palette.primary.main,
                                                },
                                            }}>
                                                <Box sx={{ position: 'relative', height: '250px' }}>
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            left: 12,
                                                            zIndex: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            borderRadius: '10px',
                                                            padding: '6px 12px',
                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                transform: 'scale(1.05)',
                                                            }
                                                        }}
                                                    >
                                                        <AutoStoriesIcon sx={{
                                                            fontSize: '0.9rem',
                                                            color: theme.palette.primary.main,
                                                        }} />
                                                        <Typography variant="caption" sx={{
                                                            color: theme.palette.primary.main,
                                                            fontWeight: 'medium',
                                                            fontSize: '0.75rem',
                                                            letterSpacing: '0.03em',
                                                        }}>
                                                            {`Bridge ${index + 1}`}
                                                        </Typography>
                                                    </Box>

                                                    <IconButton
                                                        onClick={() => toggleBridgeBookmark(bridge.id)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            zIndex: 3,
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            opacity: 0.7,
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                borderColor: alpha(theme.palette.primary.main, 0.4),
                                                                opacity: 1,
                                                                transform: 'scale(1.1)',
                                                            },
                                                        }}
                                                    >
                                                        {bookmarkedBridges.includes(bridge.id) ? (
                                                            <BookmarkIcon sx={{
                                                                fontSize: '1rem',
                                                                color: theme.palette.primary.main,
                                                            }} />
                                                        ) : (
                                                            <BookmarkBorderIcon sx={{
                                                                fontSize: '1rem',
                                                                color: theme.palette.text.secondary,
                                                            }} />
                                                        )}
                                                    </IconButton>

                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            height: '100%',
                                                            background: bridge.thumbnail_url
                                                                ? 'none'
                                                                : `linear-gradient(135deg, ${theme.palette.neutral.light} 0%, ${theme.palette.background.paper} 100%)`,
                                                        }}
                                                    >
                                                        {bridge.thumbnail_url && (
                                                            <>
                                                                <Box
                                                                    component="img"
                                                                    src={normalizeThumbnailUrl(getBridgeThumbnail(bridge))}
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                        objectPosition: 'center',
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        zIndex: 0,
                                                                    }}
                                                                    alt={`Thumbnail for ${getBridgeName(bridge)}`}
                                                                    onError={(e) => {
                                                                        console.error(`Thumbnail failed to load:`, e.target.src, `for bridge ${bridge.id} with brdge_id ${bridge.brdge_id}`);
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.parentElement) {
                                                                            e.target.parentElement.style.background = `linear-gradient(135deg, ${theme.palette.neutral.light} 0%, ${theme.palette.background.paper} 100%)`;
                                                                        }
                                                                    }}
                                                                />
                                                                <Box
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                                                                        zIndex: 1,
                                                                    }}
                                                                />
                                                            </>
                                                        )}

                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                zIndex: 10,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <IconButton
                                                                onClick={() => handleBridgeClick(bridge.brdge.public_id, bridge.brdge_id)}
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                                                                    border: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.25),
                                                                        transform: 'scale(1.1)',
                                                                        border: `2px solid ${alpha(theme.palette.primary.main, 0.7)}`,
                                                                        '& .play-icon': { transform: 'scale(1.1)' }
                                                                    },
                                                                }}
                                                            >
                                                                <PlayArrowIcon
                                                                    className="play-icon"
                                                                    sx={{
                                                                        fontSize: 40,
                                                                        color: theme.palette.primary.main,
                                                                        transition: 'all 0.3s ease',
                                                                    }}
                                                                />
                                                            </IconButton>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: theme.palette.text.primary,
                                                                    letterSpacing: '0.05em',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Start Learning
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <CardContent sx={{
                                                    p: 3,
                                                    height: 'calc(100% - 250px)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                }}>
                                                    <Typography variant="h5" gutterBottom sx={{
                                                        color: theme.palette.text.primary,
                                                        fontWeight: 600,
                                                        fontSize: '1.25rem'
                                                    }}>
                                                        {getBridgeName(bridge)}
                                                    </Typography>

                                                    <Typography variant="body2" sx={{
                                                        color: theme.palette.text.secondary,
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.6,
                                                        mb: 'auto',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {getBridgeDescription(bridge)}
                                                    </Typography>

                                                    <Button
                                                        variant="contained"
                                                        startIcon={<PlayArrowIcon />}
                                                        onClick={() => handleBridgeClick(bridge.brdge.public_id, bridge.brdge_id)}
                                                        fullWidth
                                                        sx={{
                                                            mt: 3,
                                                            backgroundColor: theme.palette.primary.main,
                                                            boxShadow: theme.shadows[2],
                                                            fontWeight: 'medium',
                                                            letterSpacing: '0.01em',
                                                            height: '40px',
                                                            borderRadius: '10px',
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.primary.dark,
                                                                boxShadow: theme.shadows[3],
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}
                                                    >
                                                        Start Bridge
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Box>
                        </motion.div>
                    ) : (
                        <Box sx={{
                            p: 6,
                            textAlign: 'center',
                            bgcolor: 'rgba(0, 229, 255, 0.03)',
                            borderRadius: '16px',
                            border: '1px solid rgba(0, 229, 255, 0.1)',
                        }}>
                            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                No bridges available in this flow.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={handleBackToDashboard}
                                sx={{
                                    color: '#00E5FF',
                                    borderColor: 'rgba(0, 229, 255, 0.3)',
                                    '&:hover': {
                                        borderColor: '#00E5FF',
                                        bgcolor: 'rgba(0, 229, 255, 0.08)'
                                    }
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </Box>
                    )}

                    {flowData.modules && flowData.modules.length > 0 && (
                        <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Box
                                sx={{
                                    mt: 5,
                                    position: 'relative',
                                }}
                            >
                            </Box>

                            <Box sx={{
                                mt: 5,
                                p: 3,
                                borderRadius: '16px',
                                bgcolor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: theme.shadows[1],
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                                gap: { xs: 2, md: 4 },
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <Typography variant="h6" sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 600,
                                    fontStyle: 'normal',
                                    minWidth: '140px',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    Your Progress
                                </Typography>

                                <Box sx={{
                                    flex: 1,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    {flowData.modules.map((_, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                bgcolor: index === activeBridgeIndex
                                                    ? theme.palette.primary.main
                                                    : alpha(theme.palette.divider, 0.9),
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: index === activeBridgeIndex
                                                        ? theme.palette.primary.main
                                                        : theme.palette.divider,
                                                    transform: 'scale(1.2)',
                                                }
                                            }}
                                            onClick={() => setActiveBridgeIndex(index)}
                                        />
                                    ))}
                                </Box>

                                <Typography variant="body2" sx={{
                                    color: theme.palette.text.secondary,
                                    textAlign: { xs: 'center', md: 'right' },
                                    minWidth: '140px',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    Bridge {activeBridgeIndex + 1} of {flowData.modules.length}
                                </Typography>
                            </Box>
                        </motion.div>
                    )}

                    <motion.div
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Box sx={{
                            mt: 8,
                            mb: 5,
                            position: 'relative',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        </Box>

                        <Box sx={{
                            mt: 5,
                            p: 3,
                            borderRadius: '16px',
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2],
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={7}>
                                    <Typography variant="h5" sx={{
                                        color: theme.palette.text.primary,
                                        fontWeight: 600,
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <VerifiedIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                        </Box>
                                        Learning with AI
                                    </Typography>

                                    <Typography variant="body1" sx={{
                                        color: theme.palette.text.secondary,
                                        mb: 2,
                                        lineHeight: 1.6,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        This flow uses advanced AI technology to create an interactive learning experience. Each bridge adapts to your pace and provides personalized responses to your questions.
                                    </Typography>

                                    <Typography variant="body1" sx={{
                                        color: theme.palette.text.secondary,
                                        lineHeight: 1.6,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        Complete all bridges to master the flow material and gain valuable knowledge. You can revisit any bridge at any time to reinforce your learning.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Box sx={{
                                        p: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: '12px',
                                        bgcolor: theme.palette.neutral.light,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                        boxShadow: theme.shadows[1]
                                    }}>
                                        <Typography variant="h6" sx={{
                                            color: theme.palette.text.primary,
                                            fontWeight: 600,
                                            textAlign: 'center',
                                            mb: 2
                                        }}>
                                            Start Your Learning Journey
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PlayArrowIcon />}
                                            onClick={() => {
                                                if (flowData.modules && flowData.modules.length > 0) {
                                                    const activeBridgeData = flowData.modules[activeBridgeIndex];
                                                    const isBridgePublic = activeBridgeData?.is_public || false;

                                                    if (!isEnrolled && !isBridgePublic) {
                                                        setBridgeAccessDialogOpen(true);
                                                        return;
                                                    }

                                                    if (activeBridgeData && activeBridgeData.brdge_id) {
                                                        const publicId = activeBridgeData.brdge?.public_id || activeBridgeData.public_id;
                                                        handleBridgeClick(publicId, activeBridgeData.brdge_id);
                                                    }
                                                }
                                            }}
                                            disabled={!flowData.modules || flowData.modules.length === 0}
                                            sx={{
                                                backgroundColor: theme.palette.primary.main,
                                                boxShadow: theme.shadows[2],
                                                py: 1.5,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    boxShadow: theme.shadows[3],
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            Start Selected Bridge
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </motion.div>

                    <Box sx={{
                        mt: 8,
                        p: 4,
                        borderRadius: '16px',
                        bgcolor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 3,
                        position: 'relative',
                        boxShadow: theme.shadows[2],
                        overflow: 'hidden',
                    }}>
                        {!isEnrolled ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                zIndex: 1,
                                textAlign: 'center',
                                width: '100%',
                                maxWidth: '500px'
                            }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        fontFamily: theme.typography.fontFamily,
                                        mb: 1,
                                        fontStyle: 'normal',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: -8,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '40%',
                                            height: '1px',
                                            background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}70, transparent)`,
                                        }
                                    }}
                                >
                                    Join This Flow
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        mb: 2,
                                        '& strong': {
                                            fontWeight: 600,
                                            fontFamily: theme.typography.fontFamily,
                                            color: theme.palette.primary.main,
                                            fontStyle: 'normal'
                                        }
                                    }}
                                >
                                    Enrolling gives you <strong>full access</strong> to all flow materials and interactive AI bridges.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={enrollButtonLoading}
                                    onClick={handleEnrollClick}
                                    sx={{
                                        fontWeight: 'bold',
                                        px: 5,
                                        py: 1.8,
                                        borderRadius: '8px',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        boxShadow: theme.shadows[2],
                                        fontSize: '1.1rem',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[4],
                                        },
                                    }}
                                >
                                    {enrollButtonLoading ? <CircularProgress size={24} color="inherit" /> : 'Enroll Now'}
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: 1, width: '100%', maxWidth: '500px' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        py: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: '50%',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 1,
                                        boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    }}>
                                        <VerifiedIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="h5" sx={{
                                        fontFamily: theme.typography.fontFamily,
                                        color: theme.palette.text.primary,
                                        fontWeight: 'bold'
                                    }}>
                                        You're Enrolled
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
                                    You have full access to all flow materials
                                </Typography>
                                <Button
                                    variant="text"
                                    size="medium"
                                    disabled={unenrollButtonLoading}
                                    onClick={handleUnenrollClick}
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        borderRadius: '6px',
                                        border: `1px solid ${theme.palette.divider}`,
                                        px: 3,
                                        py: 1,
                                        '&:hover': {
                                            color: theme.palette.error.main,
                                            backgroundColor: `${theme.palette.error.main}08`,
                                            borderColor: `${theme.palette.error.main}30`
                                        }
                                    }}
                                >
                                    {unenrollButtonLoading ? <CircularProgress size={20} color="inherit" /> : 'Unenroll from Flow'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Container>
            </Box>

            <Dialog
                open={bridgeAccessDialogOpen}
                onClose={() => setBridgeAccessDialogOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '12px',
                        boxShadow: theme.shadows[4],
                        position: 'relative',
                        overflow: 'hidden',
                        '& > *': {
                            position: 'relative',
                            zIndex: 1
                        }
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontFamily: theme.typography.fontFamily,
                    py: 2.5,
                    fontWeight: 600,
                    position: 'relative',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: alpha(theme.palette.primary.main, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                        }}>
                            <Lock size={16} color={theme.palette.primary.main} />
                        </Box>
                        <Typography sx={{
                            fontFamily: theme.typography.fontFamily,
                            fontWeight: 600,
                        }}>
                            Enrollment Required
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    py: 3
                }}>
                    <DialogContentText sx={{ color: theme.palette.text.secondary, my: 2, fontSize: '1rem', lineHeight: 1.6 }}>
                        You need to enroll in this flow before accessing its bridges. Enrollment gives you full access to all flow materials.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    bgcolor: theme.palette.background.paper,
                    p: 2.5,
                    borderTop: `1px solid ${theme.palette.divider}50`,
                    justifyContent: 'space-between'
                }}>
                    <Button
                        onClick={() => setBridgeAccessDialogOpen(false)}
                        color="secondary"
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: `${theme.palette.divider}30`
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setBridgeAccessDialogOpen(false);
                            handleEnrollClick();
                        }}
                        variant="contained"
                        color="primary"
                        sx={{
                            px: 3,
                            boxShadow: theme.shadows[1],
                            '&:hover': {
                                boxShadow: theme.shadows[2]
                            }
                        }}
                    >
                        Enroll Now
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={unenrollDialogOpen}
                onClose={() => setUnenrollDialogOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '12px',
                        boxShadow: theme.shadows[4],
                        position: 'relative',
                        overflow: 'hidden',
                        '& > *': {
                            position: 'relative',
                            zIndex: 1
                        }
                    }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontFamily: theme.typography.fontFamily,
                    py: 2.5,
                    fontWeight: 600,
                    position: 'relative',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: alpha(theme.palette.error.main, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <AlertTriangle size={16} color={theme.palette.error.main} />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontStyle: 'normal'
                            }}
                        >
                            Confirm Unenrollment
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    py: 3
                }}>
                    <DialogContentText sx={{ color: theme.palette.text.secondary, my: 2, fontSize: '1rem', lineHeight: 1.6 }}>
                        Are you sure you want to unenroll from <strong>{flowData?.name}</strong>?
                    </DialogContentText>
                    <DialogContentText sx={{
                        color: theme.palette.text.secondary,
                        backgroundColor: theme.palette.background.paper,
                        p: 2,
                        borderRadius: '8px',
                        border: `1px solid ${theme.palette.divider}50`,
                        fontSize: '0.9rem'
                    }}>
                        You can always re-enroll later, but your progress in the flow may be reset.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{
                    bgcolor: theme.palette.background.paper,
                    p: 2.5,
                    borderTop: `1px solid ${theme.palette.divider}50`,
                    justifyContent: 'space-between'
                }}>
                    <Button
                        onClick={() => setUnenrollDialogOpen(false)}
                        color="secondary"
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                                backgroundColor: `${theme.palette.divider}30`
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmUnenroll}
                        variant="contained"
                        color="error"
                        disabled={unenrollButtonLoading}
                        sx={{
                            px: 3,
                            backgroundColor: `${theme.palette.error.main}90`,
                            '&:hover': {
                                backgroundColor: theme.palette.error.main,
                            }
                        }}
                    >
                        {unenrollButtonLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirm Unenroll'}
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
}

export default ViewCoursePage;