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
import { getAuthToken } from '../utils/auth';
import { api } from '../api';
import { AuthContext } from '../App';
import { useSnackbar } from '../utils/snackbar';

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
    const [courseData, setCourseData] = useState(null);
    const [activeModule, setActiveModule] = useState(0);
    const [bookmarkedModules, setBookmarkedModules] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const { showSnackbar } = useSnackbar();

    // Course data states
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollButtonLoading, setEnrollButtonLoading] = useState(false);
    const [unenrollButtonLoading, setUnenrollButtonLoading] = useState(false);

    // Dialog states
    const [unenrollDialogOpen, setUnenrollDialogOpen] = useState(false);
    const [moduleAccessDialogOpen, setModuleAccessDialogOpen] = useState(false);

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
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                console.log(`Fetching course with public ID: ${publicId}`);

                // Make sure we're using the correct API endpoint
                const response = await api.get(`/courses/public/${publicId}`);
                console.log('Course data received:', response.data);

                // Sort the modules by position
                if (response.data.modules) {
                    response.data.modules.sort((a, b) => a.position - b.position);
                }

                setCourseData(response.data);

                // Check if user is already enrolled (from API response)
                if (response.data.user_enrolled) {
                    setIsEnrolled(true);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching course data:', error);
                const errorMsg = error.response?.data?.error || 'Course not found or not accessible';
                setError(errorMsg);
                setLoading(false);
            }
        };

        if (publicId) {
            fetchCourseData();
        }
    }, [publicId, token]);

    useEffect(() => {
        if (courseData && courseData.modules) {
            console.log('Course modules:', courseData.modules);
            // Enhanced debug logging for description fields
            if (courseData.modules.length > 0) {
                const firstModule = courseData.modules[0];
                console.log('Module description:', firstModule.description);
                console.log('Module has brdge?', !!firstModule.brdge);
                if (firstModule.brdge) {
                    console.log('Brdge description:', firstModule.brdge.description);
                }
            }
        }
    }, [courseData]);

    useEffect(() => {
        if (courseData && courseData.modules) {
            console.log('Course modules:', courseData.modules);
            // Enhanced debug logging for thumbnails
            if (courseData.modules.length > 0) {
                courseData.modules.forEach(module => {
                    console.log(`Module ${module.id} thumbnail_url:`, module.thumbnail_url);
                    if (module.thumbnail_url) {
                        console.log(`Module ${module.id} normalized thumbnail:`, normalizeThumbnailUrl(module.thumbnail_url));
                    }
                });
            }
        }
    }, [courseData]);

    useEffect(() => {
        if (courseData && courseData.modules && courseData.modules.length > 0) {
            console.log('Course has thumbnails?', !!courseData.thumbnail_url);
            console.log('All modules:', courseData.modules);

            // Deep inspection of first module to see structure
            const firstModule = courseData.modules[0];
            console.log('First module detailed inspection:', {
                id: firstModule.id,
                direct_thumbnail: firstModule.thumbnail_url,
                brdge_id: firstModule.brdge_id,
                has_brdge_obj: !!firstModule.brdge,
                brdge_thumbnail: firstModule.brdge?.thumbnail_url,
                full_module: firstModule
            });
        }
    }, [courseData]);

    useEffect(() => {
        // Force a direct approach to loading thumbnails
        if (courseData && courseData.modules && courseData.modules.length > 0) {
            console.log('DEBUGGING MODULE STRUCTURE:');
            courseData.modules.forEach((module, index) => {
                console.log(`Module ${index}`, {
                    id: module.id,
                    name: module.name || module.brdge?.name,
                    has_thumbnail: !!module.thumbnail_url,
                    thumbnail_url: module.thumbnail_url,
                    has_brdge: !!module.brdge
                });

                // Force a direct update to the course data
                if (!module.thumbnail_url && module.brdge?.thumbnail_url) {
                    // The module itself doesn't have thumbnail_url but its brdge does
                    console.log(`Module ${index} has thumbnail in brdge but not directly`);
                }
            });

            // DIRECT APPROACH: Force copy the thumbnails from the brdge to the module
            setCourseData(prevCourse => {
                if (!prevCourse || !prevCourse.modules) return prevCourse;

                const updatedModules = prevCourse.modules.map(module => {
                    // If module has no thumbnail but its brdge does, copy it up
                    if (!module.thumbnail_url && module.brdge?.thumbnail_url) {
                        console.log(`Copying thumbnail from brdge to module ${module.id}`);
                        return {
                            ...module,
                            thumbnail_url: module.brdge.thumbnail_url
                        };
                    }
                    return module;
                });

                return {
                    ...prevCourse,
                    modules: updatedModules
                };
            });
        }
    }, [courseData?.id]);

    const handleStartModule = (moduleId, publicId) => {
        if (!isEnrolled) {
            setModuleAccessDialogOpen(true);
            return;
        }

        // Always use the viewBridge route
        if (moduleId) {
            const shortPublicId = typeof publicId === 'string' ?
                publicId.substring(0, 6) : publicId;
            navigate(`/viewBridge/${moduleId}-${shortPublicId}`);
        }
    };

    const toggleBookmark = (moduleId) => {
        setBookmarkedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleBackToDashboard = () => {
        navigate('/');
    };

    // Add this helper function at the top of your component (after state declarations)
    const normalizeThumbnailUrl = (url) => {
        if (!url) return null;

        // If it's already an absolute URL, return it as is
        if (url.startsWith('http')) return url;

        // If it's a relative URL, prepend the API base URL
        if (url.startsWith('/api')) {
            // Use the same base URL as your API calls
            return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${url}`;
        }

        return url;
    };

    // Replace the existing getModuleThumbnail function with this improved version
    const getModuleThumbnail = (module) => {
        // First check if the module has a direct thumbnail URL
        if (module && module.thumbnail_url) {
            return normalizeThumbnailUrl(module.thumbnail_url);
        }

        // If not, check the brdge object for thumbnail
        if (module && module.brdge && module.brdge.thumbnail_url) {
            return normalizeThumbnailUrl(module.brdge.thumbnail_url);
        }

        // Fallback to null if no thumbnail is available
        return null;
    };

    // Add this direct debugging useEffect to track the exact rendering process
    useEffect(() => {
        if (courseData?.modules?.length > 0) {
            // Dump the first module entirely to see what's there
            console.log('DETAILED MODULE STRUCTURE:', JSON.stringify(courseData.modules[0], null, 2));

            // Log just the thumbnail URLs for debugging
            const thumbnailUrls = courseData.modules
                .map(m => ({ id: m.id, thumb: m.thumbnail_url }))
                .filter(m => m.thumb);
            console.log('Modules with thumbnails:', thumbnailUrls);
        }
    }, [courseData]);

    // Replace the getModuleDescription function with this simplified version
    const getModuleDescription = (module) => {
        // Direct description from module itself
        if (module.description && module.description.trim() !== '') {
            return module.description;
        }

        // Fallback to brdge description if it exists
        if (module.brdge?.description && module.brdge.description.trim() !== '') {
            return module.brdge.description;
        }

        // Final fallback
        return "Explore this interactive module to enhance your understanding and skills in this subject area.";
    };

    // Add this helper function to safely access nested properties
    const getNestedProperty = (obj, path) => {
        if (!obj || !path) return undefined;
        return path.split('.').reduce((acc, part) =>
            acc && typeof acc === 'object' ? acc[part] : undefined,
            obj);
    };

    // Add this helper function for more robust module name display
    const getModuleName = (module) => {
        return module.name ||
            module.brdge?.name ||
            `Module ${module.position || 'Unknown'}`;
    };

    const handleEnrollClick = async () => {
        if (!isAuthenticated) {
            // Store the current URL in session storage to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/signup');
            return;
        }

        if (!courseData) return;

        setEnrollButtonLoading(true);
        try {
            // Make sure we're using the correct API endpoint
            await api.post(`/courses/${courseData.id}/enroll`);
            setIsEnrolled(true);
            showSnackbar('Successfully enrolled in the course!', 'success');
        } catch (error) {
            console.error('Error enrolling in course:', error);
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
            await api.post(`/courses/${courseData.id}/unenroll`);
            setIsEnrolled(false);
            showSnackbar('Successfully unenrolled from the course', 'success');
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            showSnackbar('Failed to unenroll. Please try again.', 'error');
        } finally {
            setUnenrollButtonLoading(false);
            setUnenrollDialogOpen(false);
        }
    };

    const handleModuleClick = (modulePublicId, moduleId) => {
        if (!isEnrolled) {
            setModuleAccessDialogOpen(true);
            return;
        }

        // Always use the viewBridge route with the correct format
        if (moduleId) {
            const shortPublicId = typeof modulePublicId === 'string' ?
                modulePublicId.substring(0, 6) : modulePublicId;
            navigate(`/viewBridge/${moduleId}-${shortPublicId}`);
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
                bgcolor: '#0a0a14',
                background: 'radial-gradient(circle at 50% 50%, rgba(10, 10, 20, 0.8) 0%, rgba(5, 5, 15, 1) 100%)',
            }}>
                <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                    <CircularProgress
                        variant="determinate"
                        value={loadingProgress}
                        size={120}
                        thickness={2}
                        sx={{
                            color: '#00E5FF',
                            opacity: 0.7
                        }}
                    />
                    <CircularProgress
                        size={120}
                        thickness={3}
                        sx={{
                            color: '#00BCD4',
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
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            textShadow: '0 0 10px rgba(0, 229, 255, 0.7)'
                        }}>
                            {loadingProgress}%
                        </Typography>
                    </Box>
                </Box>
                <Typography
                    variant="h5"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                        mt: 4,
                        fontFamily: 'Satoshi, sans-serif',
                        letterSpacing: '0.02em',
                        textShadow: '0 0 10px rgba(0, 229, 255, 0.4)'
                    }}
                >
                    Loading Course
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontFamily: 'Satoshi, sans-serif',
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
                    bgcolor: '#0a0a14',
                    background: 'radial-gradient(circle at 50% 50%, rgba(10, 10, 20, 0.8) 0%, rgba(5, 5, 15, 1) 100%)',
                    px: 3,
                    gap: 2
                }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <Box
                            sx={{
                                p: 4,
                                bgcolor: 'rgba(25, 25, 35, 0.5)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: 3,
                                boxShadow: '0 0 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                                border: '1px solid rgba(80, 80, 120, 0.15)',
                                textAlign: 'center',
                                maxWidth: 500
                            }}
                        >
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    color: 'white',
                                    textShadow: '0 0 10px rgba(244, 67, 54, 0.3)',
                                    fontWeight: 600,
                                    fontFamily: 'Satoshi, sans-serif',
                                    letterSpacing: '-0.01em',
                                    mb: 2
                                }}
                            >
                                {error}
                            </Typography>

                            <Typography
                                variant="body1"
                                gutterBottom
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontFamily: 'Satoshi, sans-serif',
                                    mb: 3
                                }}
                            >
                                This course either doesn't exist or you don't have permission to view it.
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    p: 2,
                                    borderRadius: '8px',
                                    mb: 3,
                                    fontFamily: 'monospace'
                                }}
                            >
                                Course ID: {publicId}
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={handleBackToDashboard}
                                sx={{
                                    mt: 2,
                                    fontFamily: 'Satoshi, sans-serif',
                                    background: 'linear-gradient(to right, #0097A7, #00BCD4)',
                                    boxShadow: '0 4px 10px rgba(0, 229, 255, 0.3)',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    '&:hover': {
                                        boxShadow: '0 6px 15px rgba(0, 229, 255, 0.4)',
                                        transform: 'translateY(-2px)',
                                        background: 'linear-gradient(to right, #00ACC1, #00BCD4)'
                                    },
                                    transition: 'all 0.3s ease'
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
                bgcolor: '#0a0a14',
                color: 'text.primary',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 200, 255, 0.08) 0%, rgba(0, 0, 0, 0) 80%)',
                pt: '20px',
                pb: '40px',
            }}>
                <Container maxWidth="lg">
                    {/* Back button and header */}
                    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <motion.div variants={itemVariants}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBackToDashboard}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    textTransform: 'none',
                                    mb: 2,
                                    '&:hover': {
                                        color: '#00E5FF',
                                        backgroundColor: 'rgba(0, 229, 255, 0.05)'
                                    }
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </motion.div>

                        <Box sx={{
                            p: 3,
                            borderRadius: '20px',
                            bgcolor: 'rgba(0, 229, 255, 0.03)',
                            border: '1px solid rgba(0, 229, 255, 0.1)',
                            mb: 4,
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 3,
                        }}>
                            {/* Course Thumbnail */}
                            {courseData.thumbnail_url && (
                                <Box sx={{
                                    width: { xs: '100%', md: '280px' },
                                    position: 'relative',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    // Create perfect 16:9 aspect ratio using padding trick
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        paddingTop: '56.25%', // 9:16 aspect ratio (9/16 = 0.5625)
                                    }
                                }}>
                                    <Box
                                        component="img"
                                        src={normalizeThumbnailUrl(courseData.thumbnail_url)}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center',
                                        }}
                                        alt={`Thumbnail for ${courseData.name}`}
                                    />
                                </Box>
                            )}

                            {/* Course Details - adjusted width based on thumbnail presence */}
                            <Box sx={{
                                flex: 1,
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {/* Decorative elements */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: -30,
                                    right: -30,
                                    width: 150,
                                    height: 150,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
                                    opacity: 0.5,
                                    zIndex: 0
                                }} />

                                <motion.div variants={itemVariants}>
                                    <Typography variant="h3" component="h1" sx={{
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        mb: 2,
                                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                                        textShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        {courseData.name}
                                    </Typography>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Typography variant="body1" sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        mb: 3,
                                        maxWidth: '800px',
                                        lineHeight: 1.6,
                                        fontSize: '1.05rem',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        {courseData.description || "Explore this interactive AI-powered learning course. Navigate through modules at your own pace and engage with immersive content."}
                                    </Typography>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        alignItems: 'center',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        <Chip
                                            icon={<AutoStoriesIcon sx={{ color: '#00E5FF !important' }} />}
                                            label={`${courseData.modules?.length || 0} Modules`}
                                            sx={{
                                                bgcolor: 'rgba(0, 229, 255, 0.08)',
                                                color: '#00E5FF',
                                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                                '& .MuiChip-icon': {
                                                    color: '#00E5FF'
                                                }
                                            }}
                                        />

                                        <Chip
                                            icon={<TimerIcon sx={{ color: '#00E5FF !important' }} />}
                                            label="Self-paced learning"
                                            sx={{
                                                bgcolor: 'rgba(0, 229, 255, 0.08)',
                                                color: '#00E5FF',
                                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                                '& .MuiChip-icon': {
                                                    color: '#00E5FF'
                                                }
                                            }}
                                        />

                                        <Chip
                                            icon={<VerifiedIcon sx={{ color: '#00E5FF !important' }} />}
                                            label="AI-powered"
                                            sx={{
                                                bgcolor: 'rgba(0, 229, 255, 0.08)',
                                                color: '#00E5FF',
                                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                                '& .MuiChip-icon': {
                                                    color: '#00E5FF'
                                                }
                                            }}
                                        />

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            ml: { xs: 0, md: 'auto' },
                                            mt: { xs: 1, md: 0 }
                                        }}>
                                            <Avatar
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    bgcolor: 'rgba(0, 229, 255, 0.2)',
                                                    border: '1px solid rgba(0, 229, 255, 0.3)'
                                                }}
                                            >
                                                <PersonIcon sx={{ fontSize: 18, color: '#00E5FF' }} />
                                            </Avatar>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                Created by {courseData.author || "Brdge AI Instructor"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Box>
                        </Box>
                    </Box>

                    {/* Course modules section */}
                    <motion.div variants={itemVariants}>
                        <Typography variant="h4" component="h2" sx={{
                            color: '#FFFFFF',
                            mb: 3,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textShadow: '0 0 10px rgba(0, 229, 255, 0.2)'
                        }}>
                            <AutoStoriesIcon sx={{ color: '#00E5FF', filter: 'drop-shadow(0 0 5px rgba(0, 229, 255, 0.7))' }} />
                            Course Modules
                        </Typography>
                    </motion.div>

                    {courseData.modules && courseData.modules.length > 0 ? (
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
                                    color: '#00E5FF',
                                    '&:after': {
                                        fontSize: '1.5rem',
                                        textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
                                    }
                                },
                                '& .swiper-pagination-bullet': {
                                    backgroundColor: '#00E5FF',
                                    opacity: 0.7,
                                    '&.swiper-pagination-bullet-active': {
                                        opacity: 1,
                                        transform: 'scale(1.2)',
                                        boxShadow: '0 0 10px rgba(0, 229, 255, 0.7)'
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
                                    onSlideChange={(swiper) => setActiveModule(swiper.activeIndex)}
                                >
                                    {courseData.modules.map((module, index) => (
                                        <SwiperSlide key={module.id} style={{ width: isSmallScreen ? 300 : 400 }}>
                                            <Card sx={{
                                                height: '100%',
                                                bgcolor: 'rgba(20, 20, 35, 0.85)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                transition: 'all 0.3s ease-in-out',
                                                border: '1px solid rgba(0, 229, 255, 0.1)',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: `
                                                        0 0 20px rgba(0, 229, 255, 0.2),
                                                        0 0 40px rgba(0, 229, 255, 0.1),
                                                        0 0 60px rgba(0, 229, 255, 0.05)
                                                    `,
                                                    '& .module-overlay': {
                                                        opacity: 1,
                                                    }
                                                },
                                            }}>
                                                <Box sx={{ position: 'relative', height: '250px' }}>
                                                    {/* Module Label */}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            left: 12,
                                                            zIndex: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            bgcolor: 'rgba(0, 229, 255, 0.15)',
                                                            backdropFilter: 'blur(8px)',
                                                            borderRadius: '10px',
                                                            padding: '6px 12px',
                                                            border: '1px solid rgba(0, 229, 255, 0.3)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 229, 255, 0.25)',
                                                                transform: 'scale(1.05)',
                                                            }
                                                        }}
                                                    >
                                                        <AutoStoriesIcon sx={{
                                                            fontSize: '0.9rem',
                                                            color: '#00E5FF',
                                                            filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.5))'
                                                        }} />
                                                        <Typography variant="caption" sx={{
                                                            color: '#00E5FF',
                                                            fontWeight: 'medium',
                                                            fontSize: '0.75rem',
                                                            letterSpacing: '0.03em',
                                                            textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
                                                        }}>
                                                            {`Module ${index + 1}`}
                                                        </Typography>
                                                    </Box>

                                                    {/* Bookmark Button */}
                                                    <IconButton
                                                        onClick={() => toggleBookmark(module.id)}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            zIndex: 3,
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                                                            backdropFilter: 'blur(8px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            opacity: 0.7,
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0, 229, 255, 0.1)',
                                                                borderColor: 'rgba(0, 229, 255, 0.3)',
                                                                opacity: 1,
                                                                transform: 'scale(1.1)',
                                                            },
                                                        }}
                                                    >
                                                        {bookmarkedModules.includes(module.id) ? (
                                                            <BookmarkIcon sx={{
                                                                fontSize: '1rem',
                                                                color: '#00E5FF',
                                                                filter: 'drop-shadow(0 0 5px rgba(0, 229, 255, 0.5))'
                                                            }} />
                                                        ) : (
                                                            <BookmarkBorderIcon sx={{
                                                                fontSize: '1rem',
                                                                color: 'rgba(255, 255, 255, 0.8)',
                                                            }} />
                                                        )}
                                                    </IconButton>

                                                    {/* Module background with thumbnail overlay handling */}
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            height: '100%',
                                                            background: module.thumbnail_url
                                                                ? 'none'
                                                                : `linear-gradient(135deg, rgba(0, 21, 36, 0.95) 0%, rgba(0, 151, 167, 0.9) 100%)`,
                                                        }}
                                                    >
                                                        {/* Display thumbnail directly if available */}
                                                        {module.thumbnail_url && (
                                                            <>
                                                                <Box
                                                                    component="img"
                                                                    src={normalizeThumbnailUrl(getModuleThumbnail(module))}
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
                                                                    alt={`Thumbnail for ${getModuleName(module)}`}
                                                                    onLoad={() => console.log(`Successfully loaded thumbnail for module ${module.id}:`, getModuleThumbnail(module))}
                                                                    onError={(e) => {
                                                                        // Log the exact URL that failed to load
                                                                        console.error(`Thumbnail failed to load:`, e.target.src, `for module ${module.id} with brdge_id ${module.brdge_id}`);

                                                                        // Set a fallback gradient background
                                                                        e.target.style.display = 'none';
                                                                        if (e.target.parentElement) {
                                                                            e.target.parentElement.style.background = 'linear-gradient(135deg, rgba(0, 21, 36, 0.95) 0%, rgba(0, 151, 167, 0.9) 100%)';
                                                                        }
                                                                    }}
                                                                />

                                                                {/* Simple overlay for better text contrast */}
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

                                                        {/* Play button and other content with higher z-index */}
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                zIndex: 10, // Much higher zIndex to ensure visibility
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <IconButton
                                                                onClick={() => handleModuleClick(module.brdge.public_id, module.brdge_id)}
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    bgcolor: 'rgba(0, 229, 255, 0.1)',
                                                                    backdropFilter: 'blur(8px)',
                                                                    border: '2px solid rgba(0, 229, 255, 0.3)',
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(0, 229, 255, 0.2)',
                                                                        transform: 'scale(1.1)',
                                                                        border: '2px solid rgba(0, 229, 255, 0.5)',
                                                                        '& .play-icon': {
                                                                            transform: 'scale(1.1)',
                                                                        }
                                                                    },
                                                                    '&::before': {
                                                                        content: '""',
                                                                        position: 'absolute',
                                                                        top: -4,
                                                                        left: -4,
                                                                        right: -4,
                                                                        bottom: -4,
                                                                        border: '2px solid rgba(0, 229, 255, 0.2)',
                                                                        borderRadius: '50%',
                                                                        animation: 'pulseRing 2s infinite',
                                                                    }
                                                                }}
                                                            >
                                                                <PlayArrowIcon
                                                                    className="play-icon"
                                                                    sx={{
                                                                        fontSize: 40,
                                                                        color: '#00E5FF',
                                                                        filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.5))',
                                                                        transition: 'all 0.3s ease',
                                                                    }}
                                                                />
                                                            </IconButton>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                                    textShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
                                                                    letterSpacing: '0.05em',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                Start Learning
                                                            </Typography>
                                                        </Box>

                                                        {/* Decorative elements - ensure they're above the image */}
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                bottom: 20,
                                                                left: 20,
                                                                right: 20,
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                opacity: 0.5,
                                                                zIndex: 2,
                                                            }}
                                                        >
                                                            {[...Array(3)].map((_, i) => (
                                                                <Box
                                                                    key={i}
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 2,
                                                                        bgcolor: '#00E5FF',
                                                                        borderRadius: '2px',
                                                                        opacity: 0.6 - (i * 0.2),
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <CardContent sx={{
                                                    p: 3,
                                                    height: 'calc(100% - 250px)',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <Typography variant="h5" gutterBottom sx={{
                                                        color: '#FFFFFF',
                                                        fontWeight: 600,
                                                        fontSize: '1.25rem'
                                                    }}>
                                                        {getModuleName(module)}
                                                    </Typography>

                                                    <Typography variant="body2" sx={{
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.6,
                                                        mb: 'auto',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {getModuleDescription(module)}
                                                    </Typography>

                                                    <Button
                                                        variant="contained"
                                                        startIcon={<PlayArrowIcon />}
                                                        onClick={() => handleModuleClick(module.brdge.public_id, module.brdge_id)}
                                                        fullWidth
                                                        sx={{
                                                            mt: 3,
                                                            backgroundImage: 'linear-gradient(45deg, #0097A7 30%, #00BCD4 90%)',
                                                            boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
                                                            fontWeight: 'medium',
                                                            letterSpacing: '0.01em',
                                                            height: '40px',
                                                            borderRadius: '10px',
                                                            '&:hover': {
                                                                boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}
                                                    >
                                                        Start Module
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
                                No modules available in this course.
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

                    {/* Progress Indicator */}
                    {courseData.modules && courseData.modules.length > 0 && (
                        <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Box sx={{
                                mt: 5,
                                p: 3,
                                borderRadius: '16px',
                                bgcolor: 'rgba(0, 229, 255, 0.03)',
                                border: '1px solid rgba(0, 229, 255, 0.1)',
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                                gap: { xs: 2, md: 4 }
                            }}>
                                <Typography variant="h6" sx={{
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    minWidth: '140px'
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
                                    justifyContent: 'center'
                                }}>
                                    {courseData.modules.map((_, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                bgcolor: index === activeModule
                                                    ? '#00E5FF'
                                                    : 'rgba(255, 255, 255, 0.2)',
                                                boxShadow: index === activeModule
                                                    ? '0 0 10px rgba(0, 229, 255, 0.7)'
                                                    : 'none',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'scale(1.2)',
                                                }
                                            }}
                                            onClick={() => setActiveModule(index)}
                                        />
                                    ))}
                                </Box>

                                <Typography variant="body2" sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    textAlign: { xs: 'center', md: 'right' },
                                    minWidth: '140px'
                                }}>
                                    Module {activeModule + 1} of {courseData.modules.length}
                                </Typography>
                            </Box>
                        </motion.div>
                    )}

                    {/* Course completion info */}
                    <motion.div
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Paper sx={{
                            mt: 5,
                            p: 3,
                            borderRadius: '16px',
                            bgcolor: 'rgba(0, 10, 30, 0.6)',
                            border: '1px solid rgba(0, 229, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={7}>
                                    <Typography variant="h5" sx={{
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <VerifiedIcon sx={{ color: '#00E5FF' }} />
                                        Learning with AI
                                    </Typography>

                                    <Typography variant="body1" sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        mb: 2,
                                        lineHeight: 1.6
                                    }}>
                                        This course uses advanced AI technology to create an interactive learning experience. Each module adapts to your pace and provides personalized responses to your questions.
                                    </Typography>

                                    <Typography variant="body1" sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        lineHeight: 1.6
                                    }}>
                                        Complete all modules to master the course material and gain valuable knowledge. You can revisit any module at any time to reinforce your learning.
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Box sx={{
                                        p: 2,
                                        border: '1px solid rgba(0, 229, 255, 0.1)',
                                        borderRadius: '12px',
                                        bgcolor: 'rgba(0, 229, 255, 0.02)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}>
                                        <Typography variant="h6" sx={{
                                            color: '#FFFFFF',
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
                                                if (!isEnrolled) {
                                                    setModuleAccessDialogOpen(true);
                                                    return;
                                                }

                                                if (courseData.modules && courseData.modules.length > 0) {
                                                    const activeModuleData = courseData.modules[activeModule];
                                                    if (activeModuleData && activeModuleData.brdge_id) {
                                                        const publicId = activeModuleData.brdge?.public_id || activeModuleData.public_id;
                                                        const shortPublicId = typeof publicId === 'string' ?
                                                            publicId.substring(0, 6) : publicId;
                                                        navigate(`/viewBridge/${activeModuleData.brdge_id}-${shortPublicId}`);
                                                    }
                                                }
                                            }}
                                            disabled={!courseData.modules || courseData.modules.length === 0}
                                            sx={{
                                                background: 'linear-gradient(45deg, #0097A7 30%, #00BCD4 90%)',
                                                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)',
                                                py: 1.5,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    boxShadow: '0 6px 20px rgba(0, 229, 255, 0.4)',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            Start Selected Module
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </motion.div>

                    {/* Enrollment Button */}
                    <Box sx={{
                        mt: 5,
                        p: 3,
                        borderRadius: '16px',
                        bgcolor: 'rgba(0, 229, 255, 0.03)',
                        border: '1px solid rgba(0, 229, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        {!isEnrolled ? (
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={enrollButtonLoading}
                                onClick={handleEnrollClick}
                                sx={{
                                    fontWeight: 'bold',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '8px'
                                }}
                            >
                                {enrollButtonLoading ? <CircularProgress size={24} color="inherit" /> : 'Enroll Now'}
                            </Button>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        backgroundColor: theme.palette.success.light,
                                        color: theme.palette.success.contrastText,
                                        padding: '10px 24px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 1
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        ✓ Enrolled
                                    </Typography>
                                </Paper>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="medium"
                                    disabled={unenrollButtonLoading}
                                    onClick={handleUnenrollClick}
                                    sx={{
                                        borderRadius: '8px',
                                        borderColor: 'rgba(244, 67, 54, 0.5)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                            borderColor: '#f44336'
                                        }
                                    }}
                                >
                                    {unenrollButtonLoading ? <CircularProgress size={20} color="inherit" /> : 'Unenroll from Course'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Add this unenroll confirmation dialog at the end of your component before the closing tag */}
            <Dialog
                open={unenrollDialogOpen}
                onClose={() => setUnenrollDialogOpen(false)}
            >
                <DialogTitle sx={{
                    bgcolor: 'rgba(0, 10, 30, 0.9)',
                    color: 'white'
                }}>
                    Confirm Unenrollment
                </DialogTitle>
                <DialogContent sx={{ bgcolor: 'rgba(0, 10, 30, 0.9)', color: 'white' }}>
                    <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Are you sure you want to unenroll from this course? You can always re-enroll later.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ bgcolor: 'rgba(0, 10, 30, 0.9)', p: 2 }}>
                    <Button
                        onClick={() => setUnenrollDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmUnenroll}
                        variant="contained"
                        color="error"
                        disabled={unenrollButtonLoading}
                    >
                        {unenrollButtonLoading ? <CircularProgress size={20} color="inherit" /> : 'Unenroll'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Module Access Dialog - shown when user tries to access a module without enrolling */}
            <Dialog
                open={moduleAccessDialogOpen}
                onClose={() => setModuleAccessDialogOpen(false)}
            >
                <DialogTitle sx={{
                    bgcolor: 'rgba(0, 10, 30, 0.9)',
                    color: 'white'
                }}>
                    Enrollment Required
                </DialogTitle>
                <DialogContent sx={{ bgcolor: 'rgba(0, 10, 30, 0.9)', color: 'white' }}>
                    <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        You need to enroll in this course before accessing its modules. Enrollment gives you full access to all course materials.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ bgcolor: 'rgba(0, 10, 30, 0.9)', p: 2 }}>
                    <Button
                        onClick={() => setModuleAccessDialogOpen(false)}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setModuleAccessDialogOpen(false);
                            handleEnrollClick();
                        }}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #0097A7 30%, #00BCD4 90%)',
                            boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)',
                        }}
                    >
                        Enroll Now
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
}

export default ViewCoursePage;