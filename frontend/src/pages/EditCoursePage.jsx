import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, CircularProgress, Button, TextField,
    IconButton, InputAdornment, Tooltip, Fade, Zoom,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Card, CardContent, CardMedia, FormControlLabel, Switch,
    Divider, List, ListItem, ListItemText, Alert, Collapse, Chip,
    Paper, Avatar, Badge, Skeleton, useTheme, useMediaQuery, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { api } from '../api';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import debounce from 'lodash/debounce';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageIcon from '@mui/icons-material/Image';
import { styled } from '@mui/material/styles';
import { useSnackbar } from '../utils/snackbar';
import InfoIcon from '@mui/icons-material/Info';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

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

// Create styled components for the file input
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

// Add this helper function to normalize thumbnail URLs
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

// Add this before your return statement in EditCoursePage
const glowingBorderKeyframes = {
    '@keyframes glowingBorder': {
        '0%': {
            opacity: 0.5,
        },
        '100%': {
            opacity: 1,
        },
    },
};

function EditCoursePage() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { showSnackbar } = useSnackbar();

    const params = useParams();
    // Handle combined ID-UID format from the URL
    const [id, uidFromUrl] = params.id ? params.id.split('-') : [null, null];
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [isShareable, setIsShareable] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [addModuleDialogOpen, setAddModuleDialogOpen] = useState(false);
    const [availableBrdges, setAvailableBrdges] = useState([]);
    const [selectedBrdgeId, setSelectedBrdgeId] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    // New states for improved UI
    const [savingCourse, setSavingCourse] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    // Add new state for active tab
    const [activeTab, setActiveTab] = useState(0);

    // Add this state to track pending changes
    const [pendingDescriptions, setPendingDescriptions] = useState({});
    const [isSavingDescriptions, setIsSavingDescriptions] = useState({});

    // Add these states after your existing state declarations
    const [courseThumbPreview, setCourseThumbPreview] = useState(null);
    const [uploadingCourseThumb, setUploadingCourseThumb] = useState(false);
    const [moduleThumbPreviews, setModuleThumbPreviews] = useState({});
    const [uploadingModuleThumb, setUploadingModuleThumb] = useState({});

    // Add state for enrollments
    const [enrollments, setEnrollments] = useState([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(false);

    // Create a debounced save function
    const debouncedSaveDescription = useCallback(
        debounce(async (moduleId, description) => {
            try {
                setIsSavingDescriptions(prev => ({ ...prev, [moduleId]: true }));

                await api.put(`/courses/${id}/modules/${moduleId}`, {
                    description: description
                });

                // Update course state once the save is complete
                setCourse(prevCourse => ({
                    ...prevCourse,
                    modules: prevCourse.modules.map(mod =>
                        mod.id === moduleId ? { ...mod, description } : mod
                    )
                }));

                // Clear pending status
                setPendingDescriptions(prev => {
                    const newPending = { ...prev };
                    delete newPending[moduleId];
                    return newPending;
                });
            } catch (error) {
                console.error('Error saving module description:', error);
            } finally {
                setIsSavingDescriptions(prev => {
                    const newSaving = { ...prev };
                    delete newSaving[moduleId];
                    return newSaving;
                });
            }
        }, 800),
        [id, setCourse]
    );

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                if (!id) {
                    navigate('/');
                    return;
                }

                const response = await api.get(`/courses/${id}`);
                const courseData = response.data.course;

                // If we have a UID from the URL, verify it matches
                if (uidFromUrl && courseData.public_id) {
                    const publicIdPrefix = courseData.public_id.substring(0, 6);
                    if (uidFromUrl !== publicIdPrefix) {
                        console.error('Invalid Course URL');
                        navigate('/');
                        return;
                    }
                }

                console.log("Course data loaded:", courseData);

                // Sort modules by position before setting state
                if (courseData.modules && courseData.modules.length > 0) {
                    courseData.modules.sort((a, b) => a.position - b.position);
                    console.log("Sorted modules by position:", courseData.modules.map(m => m.position));
                }

                setCourse(courseData);
                setCourseTitle(courseData.name);
                setCourseDescription(courseData.description || '');
                setIsShareable(courseData.shareable);

                // Set thumbnail preview if it exists in course data - normalize URL here
                if (courseData.thumbnail_url) {
                    const normalizedUrl = normalizeThumbnailUrl(courseData.thumbnail_url);
                    console.log("Setting course thumbnail to:", normalizedUrl);
                    setCourseThumbPreview(normalizedUrl);
                }

                setLoading(false);
            } catch (error) {
                console.error('Authorization check failed:', error);
                setError('You do not have permission to edit this course');
                setLoading(false);
            }
        };

        checkAuthorization();
    }, [id, uidFromUrl, navigate]);

    // Update the useEffect that loads module thumbnails
    useEffect(() => {
        if (course) {
            // Load course thumbnail if it exists and not already set
            if (course.thumbnail_url && !courseThumbPreview) {
                const normalizedUrl = normalizeThumbnailUrl(course.thumbnail_url);
                console.log("Setting course thumbnail from useEffect:", normalizedUrl);
                setCourseThumbPreview(normalizedUrl);
            }

            // Initialize module thumbnail previews
            if (course.modules) {
                const initialPreviews = {};
                course.modules.forEach(module => {
                    if (module.thumbnail_url) {
                        console.log(`Module ${module.id} original thumbnail:`, module.thumbnail_url);
                        const normalizedUrl = normalizeThumbnailUrl(module.thumbnail_url);
                        console.log(`Module ${module.id} normalized URL:`, normalizedUrl);
                        initialPreviews[module.id] = normalizedUrl;
                    }
                });
                setModuleThumbPreviews(initialPreviews);
            }
        }
    }, [course, courseThumbPreview]);

    const fetchAvailableBrdges = async () => {
        try {
            const response = await api.get('/brdges');
            console.log("Available brdges:", response.data);

            // Check if response.data is an array or has a brdges property
            const brdges = Array.isArray(response.data) ? response.data : response.data.brdges || [];

            // Only filter if course and course.modules exist
            if (course && course.modules) {
                const existingBrdgeIds = course.modules.map(module => module.brdge_id);
                console.log("Existing brdge IDs:", existingBrdgeIds);
                const filteredBrdges = brdges.filter(brdge => !existingBrdgeIds.includes(brdge.id));
                setAvailableBrdges(filteredBrdges);
            } else {
                // If no course/modules, show all brdges
                setAvailableBrdges(brdges);
            }

            console.log("Filtered available brdges:", availableBrdges);
        } catch (error) {
            console.error('Error fetching available brdges:', error);
        }
    };

    const handleSaveCourse = async () => {
        try {
            setSavingCourse(true);
            const updatedCourse = {
                name: courseTitle,
                description: courseDescription,
                shareable: isShareable
            };

            await api.put(`/courses/${id}`, updatedCourse);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving course:', error);
            setError('Failed to save course');
        } finally {
            setSavingCourse(false);
        }
    };

    const handleToggleShareable = async () => {
        try {
            setSavingCourse(true);
            await api.post(`/courses/${id}/toggle_shareable`);
            setIsShareable(!isShareable);
            setTimeout(() => setSaveSuccess(true), 3000);
        } catch (error) {
            console.error('Error toggling shareable status:', error);
        } finally {
            setSavingCourse(false);
        }
    };

    const handleOpenShareDialog = () => {
        setShareDialogOpen(true);
    };

    const handleCloseShareDialog = () => {
        setShareDialogOpen(false);
        setCopiedLink(false);
    };

    const handleCopyLink = () => {
        const shareableLink = `${window.location.origin}/c/${course.public_id}`;
        navigator.clipboard.writeText(shareableLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
    };

    const handleOpenAddModuleDialog = () => {
        fetchAvailableBrdges();
        setAddModuleDialogOpen(true);
    };

    const handleCloseAddModuleDialog = () => {
        setAddModuleDialogOpen(false);
        setSelectedBrdgeId(null);
    };

    const handleAddModule = async () => {
        if (!selectedBrdgeId) return;

        try {
            // Calculate the next position based on existing modules
            const nextPosition = course && course.modules ? course.modules.length + 1 : 1;

            await api.post(`/courses/${id}/modules`, {
                brdge_id: selectedBrdgeId,
                position: nextPosition // Explicitly set the position
            });

            // Refresh course data
            const response = await api.get(`/courses/${id}`);

            // Sort the modules by position
            const courseData = response.data.course;
            if (courseData.modules) {
                courseData.modules.sort((a, b) => a.position - b.position);
            }

            setCourse(courseData);
            showSnackbar('Module added successfully', 'success');
            handleCloseAddModuleDialog();
        } catch (error) {
            console.error('Error adding module:', error);
            showSnackbar('Failed to add module', 'error');
        }
    };

    const handleDeleteModuleClick = (moduleId) => {
        setModuleToDelete(moduleId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDeleteModule = async () => {
        if (!moduleToDelete) return;

        try {
            await api.delete(`/courses/${id}/modules/${moduleToDelete}`);

            // Refresh course data
            const response = await api.get(`/courses/${id}`);
            setCourse(response.data);

            setDeleteConfirmOpen(false);
            setModuleToDelete(null);
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    const handleCancelDeleteModule = () => {
        setDeleteConfirmOpen(false);
        setModuleToDelete(null);
    };

    const handleModuleNameChange = async (moduleId, newName) => {
        try {
            setSavingCourse(true);
            await api.put(`/courses/${id}/modules/${moduleId}`, {
                name: newName
            });
            // Update local state
            setCourse(prevCourse => ({
                ...prevCourse,
                modules: prevCourse.modules.map(mod =>
                    mod.id === moduleId ? { ...mod, brdge: { ...mod.brdge, name: newName } } : mod
                )
            }));
        } catch (error) {
            console.error('Error updating module name:', error);
        } finally {
            setSavingCourse(false);
        }
    };

    const handleModuleDescriptionChange = (moduleId, newDescription) => {
        // Immediately update UI for responsive feel
        setPendingDescriptions(prev => ({
            ...prev,
            [moduleId]: newDescription
        }));

        // Update local state for display purposes
        setCourse(prevCourse => ({
            ...prevCourse,
            modules: prevCourse.modules.map(mod =>
                mod.id === moduleId ? { ...mod, description: newDescription } : mod
            )
        }));

        // Trigger the debounced save
        debouncedSaveDescription(moduleId, newDescription);
    };

    // Navigate to view or edit Bridge
    const handleViewModule = (moduleId, publicIdPrefix) => {
        if (!moduleId || !publicIdPrefix) return;
        navigate(`/viewBridge/${moduleId}-${publicIdPrefix}`);
    };

    const handleEditModule = (moduleId, publicIdPrefix) => {
        if (!moduleId || !publicIdPrefix) return;
        navigate(`/editBridge/${moduleId}-${publicIdPrefix}`);
    };

    // Handler for course thumbnail upload
    const handleCourseThumbUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setCourseThumbPreview(previewUrl);

        // Upload file to S3
        setUploadingCourseThumb(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(`/courses/${id}/upload-thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update course state with new thumbnail URL
            setCourse(prevCourse => ({
                ...prevCourse,
                thumbnail_url: response.data.thumbnail_url
            }));

            console.log('Thumbnail uploaded successfully:', response.data.thumbnail_url);
        } catch (error) {
            console.error('Error uploading course thumbnail:', error);
        } finally {
            setUploadingCourseThumb(false);
        }
    };

    // Handler for module thumbnail upload
    const handleModuleThumbUpload = async (event, moduleId, brdgeId) => {
        const file = event.target.files[0];
        if (!file) return;

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setModuleThumbPreviews(prev => ({
            ...prev,
            [moduleId]: previewUrl
        }));

        // Set uploading state for this module
        setUploadingModuleThumb(prev => ({
            ...prev,
            [moduleId]: true
        }));

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'module_thumbnail');
            formData.append('brdge_id', brdgeId);

            const response = await api.post(`/courses/${id}/modules/${moduleId}/upload-thumbnail`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update module thumbnail in state
            setCourse(prevCourse => ({
                ...prevCourse,
                modules: prevCourse.modules.map(mod =>
                    mod.id === moduleId
                        ? { ...mod, thumbnail_url: response.data.thumbnail_url }
                        : mod
                )
            }));

            // Update preview with the actual URL
            setModuleThumbPreviews(prev => ({
                ...prev,
                [moduleId]: response.data.thumbnail_url
            }));

            console.log('Module thumbnail uploaded successfully:', response.data.thumbnail_url);
            console.log('Normalized URL:', normalizeThumbnailUrl(response.data.thumbnail_url));
        } catch (error) {
            console.error('Error uploading module thumbnail:', error);
        } finally {
            setUploadingModuleThumb(prev => {
                const newState = { ...prev };
                delete newState[moduleId];
                return newState;
            });
        }
    };

    // Add a function to fetch enrollments
    const fetchEnrollments = async () => {
        if (!id) return;

        setLoadingEnrollments(true);
        try {
            const response = await api.get(`/courses/${id}/enrollments`);
            setEnrollments(response.data.enrollments || []);
        } catch (error) {
            console.error("Error fetching enrollments:", error);
            // Optional: Show an error message to the user
        } finally {
            setLoadingEnrollments(false);
        }
    };

    // Add this to useEffect to fetch enrollments when the page loads
    useEffect(() => {
        // ... existing fetch logic ...

        // Also fetch enrollments
        fetchEnrollments();
    }, [id]);

    // Add this function to your EditCoursePage component
    const handleAccessLevelChange = async (moduleId, accessLevel) => {
        try {
            setSavingCourse(true);
            const response = await api.put(`/courses/${id}/modules/${moduleId}/permissions`, {
                access_level: accessLevel
            });

            // Update with value from response for consistency
            const updatedAccessLevel = response.data.permission.access_level;

            // Update course state with new access level
            setCourse(prevCourse => ({
                ...prevCourse,
                modules: prevCourse.modules.map(mod =>
                    mod.id === moduleId ? { ...mod, access_level: updatedAccessLevel } : mod
                )
            }));

            showSnackbar(`Module access set to ${updatedAccessLevel}`, 'success');
        } catch (error) {
            console.error('Error changing access level:', error);
            showSnackbar('Failed to update access level', 'error');
        } finally {
            setSavingCourse(false);
        }
    };

    // Add your glowing border animation effect here
    useEffect(() => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            @keyframes glowingBorder {
                0% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Add this function to the EditCoursePage component
    const handleTogglePremiumAccess = async (enrollmentId) => {
        try {
            setSavingCourse(true);
            const response = await api.post(`/courses/${id}/enrollments/${enrollmentId}/toggle-premium`);

            // Update the enrollment in our local state
            setEnrollments(prevEnrollments =>
                prevEnrollments.map(enrollment =>
                    enrollment.id === enrollmentId
                        ? { ...enrollment, has_premium_access: response.data.enrollment.has_premium_access }
                        : enrollment
                )
            );

            showSnackbar(`Premium access ${response.data.enrollment.has_premium_access ? 'granted' : 'revoked'}`, 'success');
        } catch (error) {
            console.error('Error toggling premium access:', error);
            showSnackbar('Failed to update premium access', 'error');
        } finally {
            setSavingCourse(false);
        }
    };

    // Add or update the moveModule function (which gets called after drag & drop operations)
    const moveModule = async (dragIndex, hoverIndex) => {
        // Create a new array of modules
        const updatedModules = [...course.modules];

        // Remove the dragged module from its position
        const draggedModule = updatedModules[dragIndex];
        updatedModules.splice(dragIndex, 1);

        // Insert it at the new position
        updatedModules.splice(hoverIndex, 0, draggedModule);

        // Update the position values for all modules
        const reorderedModules = updatedModules.map((module, index) => ({
            ...module,
            position: index + 1  // Position is 1-based in most DB schemas
        }));

        // Update the course state immediately for a responsive UI
        setCourse(prevCourse => ({
            ...prevCourse,
            modules: reorderedModules
        }));

        // Send the updated positions to the backend
        try {
            setSavingCourse(true);
            const positions = reorderedModules.map(module => ({
                id: module.id,
                position: module.position
            }));

            await api.put(`/courses/${id}/modules/reorder`, { positions });
            showSnackbar('Module order updated successfully', 'success');
        } catch (error) {
            console.error('Error updating module order:', error);
            showSnackbar('Failed to update module order', 'error');

            // If the update fails, fetch the latest data from the server
            const response = await api.get(`/courses/${id}`);
            setCourse(response.data.course);
        } finally {
            setSavingCourse(false);
        }
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
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
                            value={75} // or use a state for progress animation
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
                                75%
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
                        Loading Course Editor
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
                        Preparing your workspace with all modules and editor tools...
                    </Typography>
                </Box>
            </motion.div>
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
                            <motion.div
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'rgba(244, 67, 54, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 3,
                                    mx: 'auto'
                                }}>
                                    <CloseIcon sx={{ fontSize: 40, color: '#f44336' }} />
                                </Box>
                            </motion.div>

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
                                Access Denied
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
                                {error}
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() => navigate('/')}
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
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: '#0a0a14',
                color: 'text.primary',
                backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 200, 255, 0.08) 0%, rgba(0, 0, 0, 0) 80%)',
                pt: '64px',
            }}>
                {/* Tabs Navigation */}
                <Box sx={{
                    mb: 4,
                    bgcolor: 'rgba(0, 229, 255, 0.03)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 229, 255, 0.1)',
                }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#00E5FF',
                                height: 2,
                                borderRadius: '2px',
                                boxShadow: '0 0 8px rgba(0, 229, 255, 0.4)',
                            },
                            '& .MuiTab-root': {
                                color: 'rgba(255, 255, 255, 0.6)',
                                minHeight: '56px',
                                transition: 'all 0.3s ease',
                                fontSize: '0.9rem',
                                letterSpacing: '0.03em',
                                '&.Mui-selected': {
                                    color: '#00E5FF',
                                    '& .MuiSvgIcon-root': {
                                        filter: 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.5))',
                                    }
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(0, 229, 255, 0.05)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                },
                                '& .MuiSvgIcon-root': {
                                    transition: 'all 0.3s ease',
                                    fontSize: '1.2rem',
                                    mb: 0.5,
                                }
                            },
                        }}
                    >
                        <Tab
                            icon={<DescriptionIcon />}
                            label="Content"
                            sx={{ minHeight: '64px' }}
                        />
                        <Tab
                            icon={<SettingsIcon />}
                            label="Settings"
                            sx={{ minHeight: '64px' }}
                        />
                        <Tab
                            icon={<GroupIcon />}
                            label="Enrollment"
                            sx={{ minHeight: '64px' }}
                        />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {/* Content Tab */}
                    {activeTab === 0 && (
                        <>
                            {/* Course Header */}
                            <Box sx={{
                                mb: 3,
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 3,
                                bgcolor: 'rgba(0, 229, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '16px',
                                p: 3,
                                border: '1px solid rgba(0, 229, 255, 0.1)',
                            }}>
                                {/* Thumbnail upload section */}
                                <Box sx={{
                                    width: { xs: '100%', md: '280px' },
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    border: '1px dashed rgba(0, 229, 255, 0.3)',
                                    // 16:9 aspect ratio container
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        paddingTop: '56.25%', // 16:9 aspect ratio
                                        width: '100%',
                                    }
                                }}>
                                    {courseThumbPreview ? (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            '&:hover .overlay': {
                                                opacity: 1
                                            }
                                        }}>
                                            <Box
                                                component="img"
                                                src={normalizeThumbnailUrl(courseThumbPreview)}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    objectPosition: 'center',
                                                }}
                                                alt="Course thumbnail"
                                            />
                                            <Box
                                                className="overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                }}
                                            >
                                                <Button
                                                    component="label"
                                                    variant="contained"
                                                    startIcon={<AddPhotoAlternateIcon />}
                                                    sx={{
                                                        bgcolor: 'rgba(0, 229, 255, 0.2)',
                                                        '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.3)' }
                                                    }}
                                                >
                                                    Change
                                                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleCourseThumbUpload} />
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<AddPhotoAlternateIcon />}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                color: '#00E5FF',
                                                borderColor: 'rgba(0, 229, 255, 0.3)',
                                                '&:hover': {
                                                    borderColor: '#00E5FF',
                                                    bgcolor: 'rgba(0, 229, 255, 0.05)'
                                                },
                                                flexDirection: 'column',
                                                gap: 1,
                                                padding: 2,
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Add Course Thumbnail
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                Recommended: 16:9 ratio
                                            </Typography>
                                            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleCourseThumbUpload} />
                                        </Button>
                                    )}
                                    {uploadingCourseThumb && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                                            zIndex: 5
                                        }}>
                                            <CircularProgress size={40} sx={{ color: '#00E5FF' }} />
                                        </Box>
                                    )}
                                </Box>

                                {/* Course details */}
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            value={courseTitle}
                                            onChange={(e) => setCourseTitle(e.target.value)}
                                            variant="standard"
                                            placeholder="Enter Course Title"
                                            InputProps={{
                                                sx: {
                                                    fontSize: '1.75rem',
                                                    fontWeight: '600',
                                                    color: '#E0F7FA',
                                                    '&::before': { display: 'none' },
                                                    '&::after': { display: 'none' },
                                                    '& input::placeholder': {
                                                        color: 'rgba(224, 247, 250, 0.3)',
                                                        opacity: 1
                                                    }
                                                }
                                            }}
                                            sx={{ flex: 1 }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                onClick={handleSaveCourse}
                                                sx={{
                                                    background: 'rgba(0, 229, 255, 0.1)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(0, 229, 255, 0.2)',
                                                    borderRadius: '8px',
                                                    px: 2,
                                                    py: 0.75,
                                                    fontSize: '0.85rem',
                                                    fontWeight: 500,
                                                    color: '#00E5FF',
                                                    textTransform: 'none',
                                                    height: '36px',
                                                    '&:hover': {
                                                        background: 'rgba(0, 229, 255, 0.2)',
                                                        borderColor: '#00E5FF',
                                                    }
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Box>

                                    <TextField
                                        multiline
                                        rows={3}
                                        value={courseDescription}
                                        onChange={(e) => setCourseDescription(e.target.value)}
                                        placeholder="Add a compelling course description..."
                                        fullWidth
                                        variant="standard"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                color: 'rgba(224, 247, 250, 0.8)',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.5',
                                                letterSpacing: '0.01em',
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: 'rgba(224, 247, 250, 0.3)',
                                                opacity: 1
                                            },
                                            '& .MuiInput-underline:before': {
                                                borderBottomColor: 'rgba(0, 229, 255, 0.15)'
                                            },
                                            '& .MuiInput-underline:hover:before': {
                                                borderBottomColor: 'rgba(0, 229, 255, 0.3)'
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Modules Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={handleOpenAddModuleDialog}
                                        sx={{
                                            background: 'linear-gradient(135deg, #00E5FF 0%, #0097A7 100%)',
                                            borderRadius: '10px',
                                            px: 2.5,
                                            py: 1,
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            color: '#fff',
                                            textTransform: 'none',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #00E5FF 20%, #0097A7 120%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0, 151, 167, 0.3)',
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Add Module
                                    </Button>
                                </Box>

                                {/* Updated Swiper styling */}
                                <Box sx={{
                                    '& .swiper': {
                                        padding: '40px 0',
                                        overflow: 'visible',
                                    },
                                    '& .swiper-slide': {
                                        width: '400px',
                                        transform: 'scale(0.9)',
                                        transition: 'all 0.3s ease',
                                        opacity: 0.7,
                                        '&.swiper-slide-active': {
                                            transform: 'scale(1)',
                                            opacity: 1,
                                        }
                                    }
                                }}>
                                    {course && course.modules ? (
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
                                        >
                                            {/* Ensure modules are displayed in position order */}
                                            {course.modules
                                                .sort((a, b) => a.position - b.position) // Sort by position again to be safe
                                                .map((module, index) => (
                                                    <SwiperSlide key={module.id} style={{ width: 400 }}>
                                                        <Card sx={{
                                                            height: '100%',
                                                            bgcolor: 'rgba(20, 20, 35, 0.7)',
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
                                                                '& .module-image': {
                                                                    transform: 'scale(1.05)',
                                                                },
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
                                                                        {`Module ${module.position}`}
                                                                    </Typography>
                                                                </Box>

                                                                {/* Delete Button - Subtle but accessible */}
                                                                <IconButton
                                                                    onClick={() => handleDeleteModuleClick(module.id)}
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
                                                                        opacity: 0.6,
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(255, 75, 75, 0.2)',
                                                                            borderColor: 'rgba(255, 75, 75, 0.3)',
                                                                            opacity: 1,
                                                                            transform: 'scale(1.05)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <DeleteIcon sx={{
                                                                        fontSize: '0.9rem',
                                                                        color: 'rgba(255, 255, 255, 0.8)',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            color: '#FF4B4B',
                                                                        }
                                                                    }} />
                                                                </IconButton>

                                                                {/* Thumbnail upload button */}
                                                                <IconButton
                                                                    component="label"
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 12,
                                                                        right: 56, // Position it next to the delete button
                                                                        zIndex: 3,
                                                                        width: 32,
                                                                        height: 32,
                                                                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                                                                        backdropFilter: 'blur(8px)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                        opacity: 0.6,
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(0, 229, 255, 0.2)',
                                                                            borderColor: 'rgba(0, 229, 255, 0.3)',
                                                                            opacity: 1,
                                                                            transform: 'scale(1.05)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <ImageIcon sx={{
                                                                        fontSize: '0.9rem',
                                                                        color: 'rgba(255, 255, 255, 0.8)',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            color: '#00E5FF',
                                                                        }
                                                                    }} />
                                                                    <VisuallyHiddenInput
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleModuleThumbUpload(e, module.id, module.brdge_id)}
                                                                    />
                                                                </IconButton>

                                                                {/* Replace the module background Box with this */}
                                                                <Box
                                                                    sx={{
                                                                        position: 'relative',
                                                                        height: '100%',
                                                                        background: moduleThumbPreviews[module.id] || module.thumbnail_url
                                                                            ? 'none'  // No background when we have a thumbnail
                                                                            : `linear-gradient(135deg, 
                                                                        rgba(0, 21, 36, 0.95) 0%,
                                                                        rgba(0, 151, 167, 0.9) 100%)`,
                                                                        '&::before': (!moduleThumbPreviews[module.id] && !module.thumbnail_url) ? {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            bottom: 0,
                                                                            background: `radial-gradient(circle at 50% 50%,
                                                                            rgba(0, 229, 255, 0.15) 0%,
                                                                            rgba(0, 229, 255, 0.05) 25%,
                                                                            transparent 50%)`,
                                                                            opacity: 0.5,
                                                                            transition: 'all 0.3s ease',
                                                                        } : {},
                                                                        '&::after': (!moduleThumbPreviews[module.id] && !module.thumbnail_url) ? {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            bottom: 0,
                                                                            opacity: 0.05,
                                                                            mixBlendMode: 'overlay',
                                                                        } : {}
                                                                    }}
                                                                >
                                                                    {/* Show thumbnail if available */}
                                                                    {(moduleThumbPreviews[module.id] || module.thumbnail_url) && (
                                                                        <Box
                                                                            component="img"
                                                                            src={moduleThumbPreviews[module.id] || normalizeThumbnailUrl(module.thumbnail_url)}
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
                                                                            alt={`Thumbnail for ${module.brdge?.name || "module"}`}
                                                                        />
                                                                    )}

                                                                    {/* Add overlay for better text readability */}
                                                                    {moduleThumbPreviews[module.id] && (
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
                                                                    )}

                                                                    {/* Show loading indicator when uploading */}
                                                                    {uploadingModuleThumb[module.id] && (
                                                                        <Box sx={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            bottom: 0,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                                            zIndex: 5
                                                                        }}>
                                                                            <CircularProgress size={40} sx={{ color: '#00E5FF' }} />
                                                                        </Box>
                                                                    )}

                                                                    {/* Animated Play Button */}
                                                                    <Box
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '50%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            zIndex: 2,
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            alignItems: 'center',
                                                                            gap: 2,
                                                                        }}
                                                                    >
                                                                        <IconButton
                                                                            onClick={() => handleViewModule(module.brdge_id, module.brdge?.public_id?.substring(0, 6))}
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
                                                                            Click to View
                                                                        </Typography>
                                                                    </Box>

                                                                    {/* Decorative Elements */}
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
                                                                <TextField
                                                                    value={module.brdge?.name || ''}
                                                                    onChange={(e) => handleModuleNameChange(module.id, e.target.value)}
                                                                    variant="standard"
                                                                    fullWidth
                                                                    placeholder="Module Title"
                                                                    InputProps={{
                                                                        sx: {
                                                                            fontSize: '1.1rem',
                                                                            fontWeight: '600',
                                                                            color: '#E0F7FA',
                                                                            '&::before': { display: 'none' },
                                                                            '&::after': { display: 'none' },
                                                                            '&::placeholder': {
                                                                                color: 'rgba(224, 247, 250, 0.3)',
                                                                                opacity: 1
                                                                            }
                                                                        }
                                                                    }}
                                                                />

                                                                {/* Improved Access Level Control with Tooltips */}
                                                                <Box sx={{
                                                                    mt: 2,
                                                                    mb: 2,
                                                                    position: 'relative',
                                                                    p: 2,
                                                                    borderRadius: '12px',
                                                                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                                                                    border: '1px solid rgba(34, 211, 238, 0.1)',
                                                                    transition: 'box-shadow 0.3s ease',
                                                                    '&:hover': {
                                                                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.1)',
                                                                    }
                                                                }}>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        mb: 1.5
                                                                    }}>
                                                                        <LockIcon sx={{ fontSize: 18, color: '#00E5FF' }} />
                                                                        <Typography variant="subtitle2" sx={{
                                                                            color: 'rgba(255, 255, 255, 0.9)',
                                                                            fontWeight: '500'
                                                                        }}>
                                                                            Content Access Control
                                                                        </Typography>
                                                                        <Tooltip
                                                                            title={
                                                                                <Box sx={{ p: 1 }}>
                                                                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>Access Level Settings:</Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>• <b>Public</b>: Anyone can access, even without enrollment</Typography>
                                                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>• <b>Enrolled</b>: Only enrolled users can access</Typography>
                                                                                    <Typography variant="body2">• <b>Premium</b>: Requires premium enrollment access</Typography>
                                                                                </Box>
                                                                            }
                                                                            arrow
                                                                            placement="top"
                                                                        >
                                                                            <IconButton
                                                                                size="small"
                                                                                sx={{
                                                                                    ml: 0.5,
                                                                                    width: 18,
                                                                                    height: 18,
                                                                                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                                                                    '&:hover': {
                                                                                        backgroundColor: 'rgba(34, 211, 238, 0.2)'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <InfoIcon sx={{ fontSize: 14, color: '#00E5FF' }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>

                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        gap: 1.5,
                                                                        justifyContent: 'space-between'
                                                                    }}>
                                                                        {[
                                                                            {
                                                                                level: 'public',
                                                                                icon: <PublicIcon sx={{ fontSize: 18 }} />,
                                                                                color: '#4CAF50',
                                                                                label: 'Public',
                                                                                description: 'Anyone can access, even without enrollment'
                                                                            },
                                                                            {
                                                                                level: 'enrolled',
                                                                                icon: <PersonIcon sx={{ fontSize: 18 }} />,
                                                                                color: '#2196F3',
                                                                                label: 'Enrolled',
                                                                                description: 'Only enrolled users can access'
                                                                            },
                                                                            {
                                                                                level: 'premium',
                                                                                icon: <WorkspacePremiumIcon sx={{ fontSize: 18 }} />,
                                                                                color: '#9C27B0',
                                                                                label: 'Premium',
                                                                                description: 'Requires premium enrollment access'
                                                                            }
                                                                        ].map(({ level, icon, color, label, description }) => (
                                                                            <motion.div
                                                                                key={level}
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                style={{ flex: 1 }}
                                                                            >
                                                                                <Tooltip title={description} arrow placement="top">
                                                                                    <Button
                                                                                        variant={(module.access_level || 'enrolled') === level ? "contained" : "outlined"}
                                                                                        onClick={() => handleAccessLevelChange(module.id, level)}
                                                                                        startIcon={icon}
                                                                                        fullWidth
                                                                                        sx={{
                                                                                            textTransform: 'none',
                                                                                            backgroundColor: (module.access_level || 'enrolled') === level ?
                                                                                                `${color}22` : 'transparent',
                                                                                            color: (module.access_level || 'enrolled') === level ?
                                                                                                color : 'rgba(255, 255, 255, 0.6)',
                                                                                            borderColor: color,
                                                                                            borderWidth: (module.access_level || 'enrolled') === level ? '2px' : '1px',
                                                                                            padding: '8px 10px',
                                                                                            borderRadius: '10px',
                                                                                            fontSize: '0.8rem',
                                                                                            fontWeight: (module.access_level || 'enrolled') === level ? '600' : '400',
                                                                                            boxShadow: (module.access_level || 'enrolled') === level ?
                                                                                                `0 0 15px ${color}66, 0 0 5px ${color}33 inset` : 'none',
                                                                                            transform: (module.access_level || 'enrolled') === level ? 'scale(1.05)' : 'scale(1)',
                                                                                            zIndex: (module.access_level || 'enrolled') === level ? 2 : 1,
                                                                                            position: 'relative',
                                                                                            '&::after': (module.access_level || 'enrolled') === level ? {
                                                                                                content: '""',
                                                                                                position: 'absolute',
                                                                                                top: -1,
                                                                                                left: -1,
                                                                                                right: -1,
                                                                                                bottom: -1,
                                                                                                borderRadius: '12px',
                                                                                                background: `linear-gradient(45deg, ${color}00, ${color}55, ${color}00)`,
                                                                                                animation: 'glowingBorder 1.5s ease-in-out infinite alternate',
                                                                                                zIndex: -1,
                                                                                            } : {},
                                                                                            '&:hover': {
                                                                                                backgroundColor: (module.access_level || 'enrolled') === level ?
                                                                                                    `${color}33` : `${color}15`,
                                                                                                borderColor: color,
                                                                                                boxShadow: (module.access_level || 'enrolled') === level ?
                                                                                                    `0 0 20px ${color}99, 0 0 10px ${color}33 inset` : `0 0 5px ${color}33`,
                                                                                            },
                                                                                            '&.Mui-disabled': {
                                                                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                                                                                color: 'rgba(255, 255, 255, 0.3)',
                                                                                            },
                                                                                            transition: 'all 0.2s ease',
                                                                                        }}
                                                                                    >
                                                                                        {label}
                                                                                    </Button>
                                                                                </Tooltip>
                                                                            </motion.div>
                                                                        ))}
                                                                    </Box>

                                                                    <Typography variant="caption" sx={{
                                                                        display: 'block',
                                                                        mt: 1.5,
                                                                        textAlign: 'center',
                                                                        color: 'rgba(255, 255, 255, 0.5)',
                                                                        fontStyle: 'italic'
                                                                    }}>
                                                                        {(module.access_level || 'enrolled') === 'public' ?
                                                                            'This module is accessible to everyone' :
                                                                            (module.access_level || 'enrolled') === 'enrolled' ?
                                                                                'Students must enroll in the course to access' :
                                                                                'Students need premium access to view this content'}
                                                                    </Typography>
                                                                </Box>

                                                                <Box sx={{ position: 'relative', width: '100%' }}>
                                                                    <TextField
                                                                        value={
                                                                            // Show the pending description if available, otherwise show saved description
                                                                            pendingDescriptions[module.id] !== undefined
                                                                                ? pendingDescriptions[module.id]
                                                                                : (module.description || module.brdge?.description || '')
                                                                        }
                                                                        onChange={(e) => handleModuleDescriptionChange(module.id, e.target.value)}
                                                                        multiline
                                                                        rows={2}
                                                                        fullWidth
                                                                        variant="standard"
                                                                        placeholder="Add a description..."
                                                                        sx={{
                                                                            mt: 1.5,
                                                                            flex: 1,
                                                                            '& .MuiInputBase-input': {
                                                                                color: 'rgba(224, 247, 250, 0.7)',
                                                                                fontSize: '0.85rem',
                                                                                lineHeight: '1.5',
                                                                            },
                                                                            '& .MuiInputBase-input::placeholder': {
                                                                                color: 'rgba(224, 247, 250, 0.3)',
                                                                                opacity: 1
                                                                            },
                                                                            '& .MuiInput-underline:before': {
                                                                                borderBottomColor: 'rgba(255, 255, 255, 0.1)'
                                                                            },
                                                                            '& .MuiInput-underline:hover:before': {
                                                                                borderBottomColor: 'rgba(255, 255, 255, 0.2)'
                                                                            }
                                                                        }}
                                                                    />
                                                                    {/* Show saving indicator */}
                                                                    {isSavingDescriptions[module.id] && (
                                                                        <Box
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                right: 2,
                                                                                bottom: 2,
                                                                                fontSize: '0.7rem',
                                                                                color: 'rgba(0, 229, 255, 0.7)'
                                                                            }}
                                                                        >
                                                                            Saving...
                                                                        </Box>
                                                                    )}
                                                                    {/* Show pending indicator */}
                                                                    {pendingDescriptions[module.id] !== undefined && !isSavingDescriptions[module.id] && (
                                                                        <Box
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                right: 2,
                                                                                bottom: 2,
                                                                                fontSize: '0.7rem',
                                                                                color: 'rgba(255, 193, 7, 0.7)'
                                                                            }}
                                                                        >
                                                                            Pending...
                                                                        </Box>
                                                                    )}
                                                                </Box>

                                                                <Button
                                                                    variant="contained"
                                                                    startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
                                                                    onClick={() => handleEditModule(module.brdge_id, module.brdge?.public_id?.substring(0, 6))}
                                                                    fullWidth
                                                                    sx={{
                                                                        mt: 2,
                                                                        backgroundImage: 'linear-gradient(45deg, #0097A7 30%, #00BCD4 90%)',
                                                                        boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
                                                                        fontWeight: 'medium',
                                                                        letterSpacing: '0.01em',
                                                                        height: '40px',
                                                                        fontSize: '0.85rem',
                                                                        borderRadius: '10px',
                                                                        '&:hover': {
                                                                            boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
                                                                            transform: 'translateY(-2px)'
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            background: 'rgba(0, 151, 167, 0.3)'
                                                                        }
                                                                    }}
                                                                >
                                                                    Edit Module
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </SwiperSlide>
                                                ))}
                                        </Swiper>
                                    ) : (
                                        <Box sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            bgcolor: 'rgba(0, 229, 255, 0.03)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(0, 229, 255, 0.1)',
                                        }}>
                                            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                                No modules added to this course yet.
                                            </Typography>
                                            <Button
                                                startIcon={<AddIcon />}
                                                onClick={handleOpenAddModuleDialog}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #00E5FF 0%, #0097A7 100%)',
                                                    borderRadius: '12px',
                                                    px: 3,
                                                    py: 1.5,
                                                    fontSize: '0.95rem',
                                                    fontWeight: 500,
                                                    color: '#fff',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #00E5FF 20%, #0097A7 120%)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                Add Your First Module
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 1 && (
                        <Box sx={{
                            bgcolor: 'rgba(0, 229, 255, 0.03)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            p: 3,
                            border: '1px solid rgba(0, 229, 255, 0.1)',
                        }}>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                                Course Settings
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isShareable}
                                        onChange={handleToggleShareable}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#00E5FF',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#00BCD4',
                                            },
                                        }}
                                    />
                                }
                                label="Public Access"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        color: 'rgba(255, 255, 255, 0.9)',
                                    }
                                }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<ShareIcon />}
                                onClick={handleOpenShareDialog}
                                sx={{
                                    mt: 2,
                                    color: '#00E5FF',
                                    borderColor: '#00BCD4',
                                    '&:hover': {
                                        borderColor: '#00E5FF',
                                        backgroundColor: 'rgba(0, 229, 255, 0.08)'
                                    }
                                }}
                            >
                                Share Course
                            </Button>
                        </Box>
                    )}

                    {/* Enrollment Tab */}
                    {activeTab === 2 && (
                        <Box sx={{
                            bgcolor: 'rgba(0, 229, 255, 0.03)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            p: 3,
                            border: '1px solid rgba(0, 229, 255, 0.1)',
                        }}>
                            <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                                Student Enrollments ({enrollments.length})
                            </Typography>

                            {/* Premium Access Info Box */}
                            <Paper sx={{
                                p: 2,
                                mb: 3,
                                bgcolor: 'rgba(0, 229, 255, 0.05)',
                                border: '1px dashed rgba(0, 229, 255, 0.2)',
                                borderRadius: '12px'
                            }}>
                                <Typography variant="subtitle2" sx={{ color: '#00E5FF', display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <WorkspacePremiumIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                    Premium Access Management
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Toggle premium access for enrolled students to allow them to view modules marked as "Premium" in your course.
                                    This works with the module access controls in the Content tab.
                                </Typography>
                            </Paper>

                            {loadingEnrollments ? (
                                <CircularProgress />
                            ) : enrollments.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                                    No students enrolled yet.
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} sx={{
                                    mt: 2,
                                    borderRadius: '12px',
                                    '& .MuiTable-root': {
                                        borderCollapse: 'separate',
                                        borderSpacing: '0 4px',
                                    },
                                    '& .MuiTableCell-root': {
                                        borderBottom: 'none',
                                        color: 'rgba(255, 255, 255, 0.9)', // Add explicit text color for all cells
                                    },
                                    bgcolor: 'rgba(0, 0, 0, 0.25)',
                                }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{
                                                '& th': {
                                                    bgcolor: 'rgba(0, 229, 255, 0.08)',
                                                    color: 'rgba(255, 255, 255, 0.9)',
                                                    fontWeight: 'bold',
                                                }
                                            }}>
                                                <TableCell>Student Email</TableCell>
                                                <TableCell>Enrollment Date</TableCell>
                                                <TableCell>Last Access</TableCell>
                                                <TableCell>Progress</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Premium Access" arrow>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <WorkspacePremiumIcon sx={{ color: '#9C27B0' }} />
                                                        </Box>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {enrollments.map((enrollment) => (
                                                <TableRow key={enrollment.id} sx={{
                                                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                                                    '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.05)' },
                                                    transition: 'background-color 0.2s',
                                                    borderRadius: '8px',
                                                    '& td:first-of-type': { borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' },
                                                    '& td:last-of-type': { borderTopRightRadius: '8px', borderBottomRightRadius: '8px' },
                                                }}>
                                                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {enrollment.user?.email || 'Unknown'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip title={new Date(enrollment.enrolled_at).toLocaleString()}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.9)' }}>
                                                                <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                                                                {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                        {enrollment.last_accessed_at
                                                            ? new Date(enrollment.last_accessed_at).toLocaleDateString()
                                                            : 'Never'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box sx={{ width: '60%', mr: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={enrollment.progress || 0}
                                                                    sx={{
                                                                        height: 8,
                                                                        borderRadius: 4,
                                                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                                        '& .MuiLinearProgress-bar': {
                                                                            bgcolor: '#00E5FF',
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                                {Math.round(enrollment.progress || 0)}%
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: enrollment.status === 'active'
                                                                    ? 'rgba(76, 175, 80, 0.15)'
                                                                    : 'rgba(255, 255, 255, 0.05)',
                                                                color: enrollment.status === 'active'
                                                                    ? '#4CAF50'
                                                                    : 'rgba(255, 255, 255, 0.6)',
                                                                borderRadius: '4px',
                                                                fontWeight: 500,
                                                                fontSize: '0.75rem',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title={enrollment.has_premium_access ? "Revoke Premium Access" : "Grant Premium Access"}>
                                                            <IconButton
                                                                onClick={() => handleTogglePremiumAccess(enrollment.id)}
                                                                size="small"
                                                                sx={{
                                                                    color: enrollment.has_premium_access ? '#9C27B0' : 'rgba(255, 255, 255, 0.3)',
                                                                    bgcolor: enrollment.has_premium_access ? 'rgba(156, 39, 176, 0.15)' : 'transparent',
                                                                    border: enrollment.has_premium_access ? '1px solid rgba(156, 39, 176, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                                                    transition: 'all 0.2s',
                                                                    '&:hover': {
                                                                        bgcolor: enrollment.has_premium_access ? 'rgba(156, 39, 176, 0.25)' : 'rgba(156, 39, 176, 0.05)',
                                                                        border: enrollment.has_premium_access ? '1px solid rgba(156, 39, 176, 0.5)' : '1px solid rgba(156, 39, 176, 0.1)',
                                                                    }
                                                                }}
                                                            >
                                                                <WorkspacePremiumIcon sx={{
                                                                    fontSize: '1.2rem',
                                                                    filter: enrollment.has_premium_access ? 'drop-shadow(0 0 3px rgba(156, 39, 176, 0.6))' : 'none'
                                                                }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Premium Module Count Information */}
                            {enrollments.length > 0 && (
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Paper sx={{
                                        p: 2,
                                        bgcolor: 'rgba(156, 39, 176, 0.05)',
                                        border: '1px solid rgba(156, 39, 176, 0.2)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                Premium Students:
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                                                {enrollments.filter(e => e.has_premium_access).length} / {enrollments.length}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                Premium Modules:
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                                                {course?.modules?.filter(m => m.access_level === 'premium').length || 0} / {course?.modules?.length || 0}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Share Dialog */}
                <Dialog
                    open={shareDialogOpen}
                    onClose={handleCloseShareDialog}
                    PaperProps={{
                        sx: {
                            bgcolor: 'rgba(20, 20, 35, 0.95)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(0, 229, 255, 0.2)',
                            minWidth: { xs: '90%', sm: 400 },
                        }
                    }}
                >
                    <DialogTitle sx={{
                        bgcolor: 'rgba(0, 188, 212, 0.15)',
                        color: '#fff',
                        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                        backdropFilter: 'blur(5px)',
                        fontFamily: 'Satoshi, sans-serif',
                        fontWeight: 'bold',
                        letterSpacing: '0.02em',
                        fontSize: '1.5rem'
                    }}>
                        Share Course
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, mt: 1 }}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1rem',
                                lineHeight: 1.6,
                                mb: 3
                            }}
                        >
                            {isShareable ?
                                "This course is currently public. Anyone with the link can view it." :
                                "This course is currently private. Only you can access it."}
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isShareable}
                                    onChange={handleToggleShareable}
                                    color="primary"
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#00E5FF',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#00BCD4',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }}>
                                    Public Course
                                </Typography>
                            }
                            sx={{
                                my: 1.5,
                                display: 'block',
                                '& .MuiFormControlLabel-label': {
                                    color: '#fff'
                                }
                            }}
                        />

                        {isShareable && (
                            <Box sx={{ mt: 3 }}>
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        mb: 1
                                    }}
                                >
                                    Share this link:
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={`${window.location.origin}/c/${course.public_id}`}
                                    InputProps={{
                                        readOnly: true,
                                        sx: {
                                            color: '#fff',
                                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                                            '& .MuiInputBase-input': {
                                                color: '#fff',
                                            }
                                        }
                                    }}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#00BCD4' },
                                            '&:hover fieldset': { borderColor: '#00E5FF' },
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleCopyLink}
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        backgroundImage: 'linear-gradient(45deg, #0097A7 30%, #00BCD4 90%)',
                                        color: '#fff',
                                        fontWeight: 500,
                                        '&:hover': {
                                            backgroundImage: 'linear-gradient(45deg, #00ACC1 30%, #00E5FF 90%)',
                                        }
                                    }}
                                >
                                    {copiedLink ? 'Copied!' : 'Copy Link'}
                                </Button>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            onClick={handleCloseShareDialog}
                            variant="outlined"
                            sx={{
                                color: '#00E5FF',
                                borderColor: '#00BCD4',
                                '&:hover': {
                                    borderColor: '#00E5FF',
                                    backgroundColor: 'rgba(0, 229, 255, 0.08)'
                                }
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Module Dialog */}
                <Dialog
                    open={addModuleDialogOpen}
                    onClose={handleCloseAddModuleDialog}
                    PaperProps={{
                        sx: {
                            bgcolor: 'rgba(20, 20, 35, 0.95)',
                            backdropFilter: 'blur(10px)',
                            color: '#fff',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(0, 229, 255, 0.2)'
                        }
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        bgcolor: 'rgba(0, 188, 212, 0.15)',
                        color: '#fff',
                        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                        backdropFilter: 'blur(5px)',
                        fontFamily: 'Satoshi, sans-serif',
                        fontWeight: 'bold',
                        letterSpacing: '0.02em'
                    }}>
                        Add Module to Course
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, mt: 1 }}>
                        <Typography variant="body1" gutterBottom sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            mb: 2
                        }}>
                            Select a Brdge to add as a module to this course:
                        </Typography>

                        {availableBrdges.length > 0 ? (
                            <List sx={{
                                width: '100%',
                                maxHeight: 300,
                                overflow: 'auto',
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: 1,
                                mt: 2,
                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                backdropFilter: 'blur(5px)'
                            }}>
                                {availableBrdges.map((brdge) => (
                                    <ListItem
                                        key={brdge.id}
                                        button
                                        selected={selectedBrdgeId === brdge.id}
                                        onClick={() => setSelectedBrdgeId(brdge.id)}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            '&.Mui-selected': {
                                                bgcolor: 'rgba(0, 229, 255, 0.15)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0, 229, 255, 0.2)',
                                                }
                                            },
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            }
                                        }}
                                    >
                                        <ListItemText primary={brdge.name} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{
                                p: 3,
                                mt: 2,
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: 1,
                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                textAlign: 'center'
                            }}>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    You don't have any available Brdges to add. Create a new Brdge first.
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            onClick={handleCloseAddModuleDialog}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                    color: '#fff',
                                    bgcolor: 'rgba(255, 255, 255, 0.05)'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddModule}
                            disabled={!selectedBrdgeId}
                            sx={{
                                bgcolor: 'rgba(0, 229, 255, 0.1)',
                                color: '#00E5FF',
                                border: '1px solid rgba(0, 229, 255, 0.2)',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 229, 255, 0.2)',
                                    borderColor: '#00E5FF'
                                },
                                '&.Mui-disabled': {
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Add Module
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={handleCancelDeleteModule}
                    PaperProps={{
                        sx: {
                            bgcolor: 'rgba(20, 20, 35, 0.85)',
                            backdropFilter: 'blur(10px)',
                            color: 'text.primary',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 0, 0, 0.2)'
                        }
                    }}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle sx={{
                        bgcolor: 'rgba(211, 47, 47, 0.5)',
                        color: 'error.contrastText',
                        borderBottom: '1px solid rgba(255, 0, 0, 0.2)',
                        backdropFilter: 'blur(5px)',
                        fontFamily: 'Satoshi, sans-serif',
                        fontWeight: 'bold',
                        letterSpacing: '0.02em'
                    }}>
                        Remove Module
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, mt: 1 }}>
                        <Typography sx={{ fontFamily: 'Satoshi, sans-serif' }}>
                            Are you sure you want to remove this module from the course?
                            This won't delete the Brdge itself.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleCancelDeleteModule} variant="outlined" sx={{
                            fontFamily: 'Satoshi, sans-serif',
                            borderColor: '#00BCD4',
                            color: '#80DEEA',
                            '&:hover': {
                                borderColor: '#00E5FF',
                                backgroundColor: 'rgba(0, 229, 255, 0.08)'
                            }
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDeleteModule}
                            color="error"
                            variant="contained"
                            sx={{
                                fontFamily: 'Satoshi, sans-serif',
                                backgroundImage: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                                boxShadow: '0 4px 10px rgba(211, 47, 47, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 6px 15px rgba(211, 47, 47, 0.4)'
                                }
                            }}
                        >
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </motion.div>
    );
}

export default EditCoursePage; 