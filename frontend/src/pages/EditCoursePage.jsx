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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { api } from '../api';
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
import { Copy, Check } from 'lucide-react';

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

    // If it's a relative URL starting with /api
    if (url.startsWith('/api')) {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

        // Remove the duplicate /api if the base URL already ends with /api
        if (baseUrl.endsWith('/api')) {
            // Remove the leading /api from the url
            const cleanUrl = url.replace(/^\/api/, '');
            return `${baseUrl}${cleanUrl}`;
        }

        // Otherwise just append as normal
        return `${baseUrl}${url}`;
    }

    return url;
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

    // Add these state variables for the share dialog
    const [linkCopied, setLinkCopied] = useState(false);
    const [savingShareStatus, setSavingShareStatus] = useState(false);

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

    // Remove the old implementation and keep only the new one
    const handleToggleShareable = async () => {
        if (!course) return;

        try {
            setSavingShareStatus(true);
            const response = await api.post(`/courses/${id}/toggle_shareable`);
            const newShareableStatus = response.data.shareable;

            setCourse(prevCourse => ({
                ...prevCourse,
                shareable: newShareableStatus
            }));

            setIsShareable(newShareableStatus);
            showSnackbar(`Course is now ${newShareableStatus ? 'public' : 'private'}`, 'success');

            // If now shareable and wasn't before, automatically copy the link to encourage sharing
            if (newShareableStatus && !isShareable) {
                setTimeout(() => {
                    handleCopyLink();
                }, 300);
            }
        } catch (error) {
            console.error('Error toggling share status:', error);
            showSnackbar('Failed to update sharing settings', 'error');
        } finally {
            setSavingShareStatus(false);
        }
    };

    // Add this handler for opening the share dialog
    const handleOpenShareDialog = () => {
        setShareDialogOpen(true);
    };

    // Add this handler for closing the share dialog
    const handleCloseShareDialog = () => {
        setShareDialogOpen(false);
        setLinkCopied(false);
    };

    // Add this handler for copying the shareable link
    const handleCopyLink = () => {
        const shareableLink = `${window.location.origin}/c/${course.public_id}`;
        navigator.clipboard.writeText(shareableLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
        showSnackbar('Link copied to clipboard!', 'success');
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

    // Update loading state
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
                    bgcolor: theme.palette.background.default,
                    position: 'relative',
                }}>
                    {/* Simplified Loading Indicator */}
                    <CircularProgress size={60} sx={{ color: theme.palette.primary.main, mb: 3 }} />
                    <Typography
                        variant="h5"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 500,
                            fontFamily: theme.typography.fontFamily,
                        }}
                    >
                        Loading Course Editor...
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
                        Preparing your workspace...
                    </Typography>
                </Box>
            </motion.div>
        );
    }

    // Update error state
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
                            component={Paper}
                            elevation={2}
                            sx={{
                                p: 4,
                                borderRadius: theme.shape.borderRadius,
                                border: `1px solid ${theme.palette.divider}`,
                                textAlign: 'center',
                                maxWidth: 500,
                                position: 'relative',
                                zIndex: 1,
                                bgcolor: theme.palette.background.paper
                            }}
                        >
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    color: theme.palette.error.main,
                                    fontWeight: 600,
                                    fontFamily: theme.typography.fontFamily,
                                    mb: 2,
                                }}
                            >
                                Error Accessing Course
                            </Typography>

                            <Typography
                                variant="body1"
                                gutterBottom
                                sx={{
                                    color: theme.palette.text.secondary,
                                    mb: 3
                                }}
                            >
                                {error}
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/home')}
                                sx={{ mt: 2 }}
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
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                position: 'relative',
                pt: 0,
            }}>
                {/* Tabs Navigation - Modified to connect with header */}
                <Box sx={{
                    bgcolor: theme.palette.background.paper, // Theme paper background
                    borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider
                    position: 'sticky', // Make tabs sticky? Optional.
                    top: 0, // Adjust if you have an AppBar
                    zIndex: theme.zIndex.appBar - 1, // Ensure it's below AppBar if sticky
                    mb: 4,
                    boxShadow: theme.shadows[1] // Subtle shadow
                }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: theme.palette.primary.main, // Theme primary color
                                height: 2,
                            },
                            '& .MuiTab-root': {
                                color: theme.palette.text.secondary, // Theme secondary text
                                // minHeight: '56px', // Adjust height if needed
                                transition: 'all 0.3s ease',
                                fontSize: theme.typography.button.fontSize, // Use theme button font size
                                letterSpacing: theme.typography.button.letterSpacing, // Use theme button letter spacing
                                fontWeight: theme.typography.button.fontWeight, // Use theme button weight
                                textTransform: theme.typography.button.textTransform, // Use theme button transform
                                '&.Mui-selected': {
                                    color: theme.palette.primary.main, // Theme primary color
                                    fontWeight: 600, // Slightly bolder selected tab
                                },
                                '&:hover': {
                                    bgcolor: theme.palette.action.hover, // Theme hover background
                                    color: theme.palette.text.primary, // Theme primary text on hover
                                },
                                '& .MuiSvgIcon-root': {
                                    // Adjust icon styles if needed
                                    fontSize: '1.2rem',
                                    mb: { xs: 0, sm: 0.5 }, // Only add margin bottom on larger screens if label is below
                                    mr: { xs: 0.5, sm: 0 }, // Add margin right on smaller screens if side-by-side
                                }
                            },
                        }}
                        variant={isSmallScreen ? "fullWidth" : "standard"} // Adjust based on screen size
                        centered={!isSmallScreen}
                    >
                        <Tab
                            icon={<DescriptionIcon />}
                            label="Content"
                        // Remove fixed height sx={{ minHeight: '64px' }}
                        />
                        <Tab
                            icon={<SettingsIcon />}
                            label="Settings"
                        // Remove fixed height sx={{ minHeight: '64px' }}
                        />
                        <Tab
                            icon={<GroupIcon />}
                            label="Enrollment"
                        // Remove fixed height sx={{ minHeight: '64px' }}
                        />
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                <Box sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
                    {/* Content Tab */}
                    {activeTab === 0 && (
                        <>
                            {/* Course Header - REMOVE TEXTURE */}
                            <Box
                                component={Paper}
                                elevation={1}
                                sx={{
                                    mb: 3,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    gap: 3,
                                    p: 3,
                                    borderRadius: theme.shape.borderRadius,
                                    position: 'relative', // Keep for potential absolute children like overlays
                                }}
                            >
                                {/* Thumbnail upload section */}
                                <Box sx={{
                                    width: { xs: '100%', md: '280px' },
                                    aspectRatio: '16 / 9', // Maintain aspect ratio
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: theme.shape.borderRadius, // Theme radius
                                    overflow: 'hidden',
                                    backgroundColor: theme.palette.neutral.light, // Neutral background
                                    border: `1px dashed ${theme.palette.divider}`, // Theme divider, dashed for placeholder
                                }}>
                                    {courseThumbPreview ? (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0, left: 0, width: '100%', height: '100%',
                                            '&:hover .overlay': { opacity: 1 }
                                        }}>
                                            <Box
                                                component="img"
                                                src={normalizeThumbnailUrl(courseThumbPreview)}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                alt="Course thumbnail"
                                            />
                                            <Box
                                                className="overlay"
                                                sx={{
                                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                    bgcolor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: 0, transition: 'opacity 0.3s ease'
                                                }}
                                            >
                                                <Button
                                                    component="label"
                                                    variant="contained" // Use secondary or adjust as needed
                                                    color="secondary"
                                                    startIcon={<AddPhotoAlternateIcon />}
                                                    size="small"
                                                >
                                                    Change
                                                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleCourseThumbUpload} />
                                                </Button>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Button
                                            component="label"
                                            variant="outlined" // Use primary color
                                            color="primary"
                                            startIcon={<AddPhotoAlternateIcon />}
                                            sx={{
                                                width: 'auto', // Fit content
                                                height: 'auto', // Fit content
                                                flexDirection: 'column',
                                                gap: 1,
                                                borderStyle: 'dashed', // Keep dash for placeholder visual
                                                borderColor: theme.palette.divider,
                                                color: theme.palette.text.secondary,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.hover,
                                                    borderColor: theme.palette.primary.main,
                                                    color: theme.palette.primary.main,
                                                }
                                            }}
                                        >
                                            <Typography variant="button">Add Thumbnail</Typography>
                                            <Typography variant="caption">16:9 Recommended</Typography>
                                            <VisuallyHiddenInput type="file" accept="image/*" onChange={handleCourseThumbUpload} />
                                        </Button>
                                    )}
                                    {uploadingCourseThumb && (
                                        <Box sx={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            bgcolor: 'rgba(255, 255, 255, 0.7)', // Light overlay
                                            zIndex: 5,
                                        }}>
                                            <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
                                        </Box>
                                    )}
                                </Box>

                                {/* Course details */}
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <TextField
                                            value={courseTitle}
                                            onChange={(e) => setCourseTitle(e.target.value)}
                                            variant="outlined" // Use outlined variant from theme
                                            placeholder="Enter Course Title"
                                            fullWidth
                                            sx={{
                                                flex: 1,
                                                '& .MuiInputBase-input': { // Style input itself if needed
                                                    fontSize: '1.5rem', // Adjust size as needed
                                                    fontWeight: '600',
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveCourse}
                                            color="primary"
                                            disabled={savingCourse} // Disable while saving
                                            sx={{ mt: 1 }} // Align with TextField baseline
                                        // Remove decorative hover effects
                                        >
                                            {savingCourse ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                                        </Button>
                                    </Box>

                                    <TextField
                                        multiline
                                        rows={3}
                                        value={courseDescription}
                                        onChange={(e) => setCourseDescription(e.target.value)}
                                        placeholder="Add a compelling course description..."
                                        fullWidth
                                        variant="outlined" // Use outlined variant from theme
                                    // Use default theme styles
                                    />
                                </Box>
                            </Box>

                            {/* Modules Section */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between', // Space between title and button
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h5" sx={{ fontWeight: 500 }}>Modules</Typography>
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={handleOpenAddModuleDialog}
                                        variant="contained" // Use contained style
                                        color="primary" // Theme primary color
                                    // Remove decorative hover effects
                                    >
                                        Add Module
                                    </Button>
                                </Box>

                                {/* Swiper - REMOVE TEXTURES from CARDS */}
                                <Box sx={{
                                    '& .swiper': { /* ... */ },
                                    '& .swiper-slide': { /* ... */ },
                                    // ... other swiper styles
                                    '& .swiper': {
                                        padding: '20px 0', // Adjust padding
                                        overflow: 'visible',
                                    },
                                    '& .swiper-slide': {
                                        width: { xs: '90%', sm: '350px', md: '400px' }, // Responsive width
                                        opacity: 0.8, // Slightly transparent non-active slides
                                        transform: 'scale(0.95)',
                                        transition: 'opacity 0.4s ease, transform 0.4s ease',
                                        '&.swiper-slide-active': {
                                            opacity: 1,
                                            transform: 'scale(1)',
                                        }
                                    },
                                    // Style navigation buttons if needed
                                    '& .swiper-button-prev, & .swiper-button-next': {
                                        color: theme.palette.primary.main, // Use theme color
                                        '&::after': {
                                            fontSize: '2rem', // Adjust size
                                        },
                                    },
                                    // Style pagination bullets if needed
                                    '& .swiper-pagination-bullet': {
                                        backgroundColor: theme.palette.primary.light,
                                    },
                                    '& .swiper-pagination-bullet-active': {
                                        backgroundColor: theme.palette.primary.main,
                                    },
                                }}>
                                    {course && course.modules && course.modules.length > 0 ? (
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
                                                    <SwiperSlide key={module.id}>
                                                        <Card sx={{
                                                            height: '100%',
                                                            overflow: 'hidden',
                                                            position: 'relative',
                                                            transition: 'all 0.3s ease-in-out',
                                                            // Removed ::before with texture
                                                            // Removed decorative corners (.corner-tl, .corner-br)
                                                        }}>
                                                            {/* ... CardMedia/Box for thumbnail ... */}
                                                            <Box sx={{ position: 'relative', height: '200px' /* Adjust height */ }}>
                                                                {/* Module Label - Simplified */}
                                                                <Chip
                                                                    icon={<AutoStoriesIcon fontSize="small" />}
                                                                    label={`Module ${module.position}`}
                                                                    size="small"
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 12,
                                                                        left: 12,
                                                                        zIndex: 2,
                                                                        bgcolor: 'rgba(255, 255, 255, 0.8)', // Light background for visibility
                                                                        color: theme.palette.text.primary,
                                                                        backdropFilter: 'blur(4px)', // Optional blur
                                                                    }}
                                                                />

                                                                {/* Delete Button - Standard IconButton */}
                                                                <IconButton
                                                                    onClick={() => handleDeleteModuleClick(module.id)}
                                                                    size="small"
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 8,
                                                                        right: 8,
                                                                        zIndex: 3,
                                                                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                                                                        color: 'white',
                                                                        '&:hover': {
                                                                            bgcolor: theme.palette.error.dark,
                                                                        },
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>

                                                                {/* Thumbnail upload button - Standard IconButton */}
                                                                <IconButton
                                                                    component="label"
                                                                    size="small"
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 8,
                                                                        right: 44, // Position next to delete
                                                                        zIndex: 3,
                                                                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                                                                        color: 'white',
                                                                        '&:hover': {
                                                                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <ImageIcon fontSize="small" />
                                                                    <VisuallyHiddenInput
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleModuleThumbUpload(e, module.id, module.brdge_id)}
                                                                    />
                                                                </IconButton>

                                                                {/* Module Thumbnail Area - Simplified */}
                                                                <Box
                                                                    sx={{
                                                                        position: 'relative',
                                                                        height: '100%',
                                                                        bgcolor: theme.palette.neutral.light, // Neutral background if no image
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        overflow: 'hidden',
                                                                        // Removed ::before and ::after with gradients/textures
                                                                    }}
                                                                >
                                                                    {/* Show thumbnail if available */}
                                                                    {(moduleThumbPreviews[module.id] || module.thumbnail_url) && (
                                                                        <Box
                                                                            component="img"
                                                                            src={moduleThumbPreviews[module.id] || normalizeThumbnailUrl(module.thumbnail_url)}
                                                                            sx={{
                                                                                width: '100%', height: '100%', objectFit: 'cover',
                                                                                position: 'absolute', top: 0, left: 0, zIndex: 0,
                                                                            }}
                                                                            alt={`Thumbnail for ${module.brdge?.name || "module"}`}
                                                                        />
                                                                    )}

                                                                    {/* Overlay for contrast when thumbnail exists */}
                                                                    {(moduleThumbPreviews[module.id] || module.thumbnail_url) && (
                                                                        <Box sx={{
                                                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)', // Subtle gradient
                                                                            zIndex: 1,
                                                                        }} />
                                                                    )}

                                                                    {/* Loading indicator */}
                                                                    {uploadingModuleThumb[module.id] && (
                                                                        <Box sx={{
                                                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                            bgcolor: 'rgba(255, 255, 255, 0.7)', zIndex: 5
                                                                        }}>
                                                                            <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
                                                                        </Box>
                                                                    )}

                                                                    {/* Play Button - Centered, simple */}
                                                                    <IconButton
                                                                        onClick={() => handleViewModule(module.brdge_id, module.brdge?.public_id?.substring(0, 6))}
                                                                        sx={{
                                                                            position: 'absolute', // Keep absolute positioning
                                                                            top: '50%', left: '50%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            zIndex: 2, // Above overlay
                                                                            width: 64, height: 64,
                                                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                                            color: 'white',
                                                                            transition: 'transform 0.2s ease, background-color 0.2s ease',
                                                                            '&:hover': {
                                                                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                                                transform: 'translate(-50%, -50%) scale(1.1)',
                                                                            },
                                                                            // Removed pulsing animation ::before
                                                                        }}
                                                                    >
                                                                        <PlayArrowIcon sx={{ fontSize: 40 }} />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>

                                                            {/* CardContent */}
                                                            <CardContent sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                flexGrow: 1,
                                                            }}>
                                                                {/* ... TextField for title ... */}
                                                                <TextField
                                                                    value={module.brdge?.name || ''}
                                                                    onChange={(e) => handleModuleNameChange(module.id, e.target.value)}
                                                                    variant="outlined" // Use standard variant
                                                                    size="small"
                                                                    fullWidth
                                                                    placeholder="Module Title"
                                                                    sx={{ mb: 2 }} // Add margin bottom
                                                                />


                                                                {/* ... Access Level Control ... */}
                                                                <Box sx={{
                                                                    mt: 1, mb: 2, p: 1.5, borderRadius: theme.shape.borderRadius,
                                                                    bgcolor: theme.palette.action.selected, // Use theme subtle background
                                                                    border: `1px solid ${theme.palette.divider}`,
                                                                    // Remove hover glow
                                                                }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                                                        <LockIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: '500' }}>
                                                                            Content Access
                                                                        </Typography>
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                                                                        {[
                                                                            { level: 'public', icon: <PublicIcon sx={{ fontSize: 18 }} />, label: 'Public', description: 'Anyone can access' },
                                                                            { level: 'enrolled', icon: <PersonIcon sx={{ fontSize: 18 }} />, label: 'Enrolled', description: 'Only enrolled users' },
                                                                            { level: 'premium', icon: <WorkspacePremiumIcon sx={{ fontSize: 18 }} />, label: 'Premium', description: 'Requires premium access' }
                                                                        ].map(({ level, icon, label, description }) => (
                                                                            <Tooltip title={description} arrow placement="top" key={level}>
                                                                                <Button
                                                                                    variant={(module.access_level || 'enrolled') === level ? "contained" : "outlined"}
                                                                                    onClick={() => handleAccessLevelChange(module.id, level)}
                                                                                    startIcon={icon}
                                                                                    size="small" // Smaller buttons
                                                                                    fullWidth
                                                                                    sx={{
                                                                                        textTransform: 'none',
                                                                                        // Use default theme colors for contained/outlined
                                                                                    }}
                                                                                >
                                                                                    {label}
                                                                                </Button>
                                                                            </Tooltip>
                                                                        ))}
                                                                    </Box>
                                                                    {/* Optional caption - simpler */}
                                                                    {/* <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: theme.palette.text.secondary }}>
                                                                            Current: {(module.access_level || 'enrolled')}
                                                                        </Typography> */}
                                                                </Box>

                                                                {/* ... TextField for description ... */}
                                                                <Box sx={{ position: 'relative', width: '100%', flexGrow: 1 /* Allow description to take space */ }}>
                                                                    <TextField
                                                                        value={
                                                                            pendingDescriptions[module.id] !== undefined
                                                                                ? pendingDescriptions[module.id]
                                                                                : (module.description || module.brdge?.description || '')
                                                                        }
                                                                        onChange={(e) => handleModuleDescriptionChange(module.id, e.target.value)}
                                                                        multiline
                                                                        minRows={2} // Min rows
                                                                        fullWidth
                                                                        variant="outlined" // Standard variant
                                                                        size="small"
                                                                        placeholder="Add a description..."
                                                                        sx={{ mt: 1.5, flexGrow: 1 }}
                                                                    />
                                                                    {/* Saving/Pending indicators */}
                                                                    {(isSavingDescriptions[module.id] || pendingDescriptions[module.id] !== undefined) && (
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                right: 8,
                                                                                bottom: 8,
                                                                                color: isSavingDescriptions[module.id] ? theme.palette.info.main : theme.palette.warning.main,
                                                                                bgcolor: theme.palette.background.paper, // Ensure visibility over textfield border
                                                                                px: 0.5,
                                                                                borderRadius: '4px'
                                                                            }}
                                                                        >
                                                                            {isSavingDescriptions[module.id] ? "Saving..." : "Pending..."}
                                                                        </Typography>
                                                                    )}
                                                                </Box>


                                                                {/* ... Edit Module Button ... */}
                                                                <Button
                                                                    variant="contained" // Standard contained button
                                                                    startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
                                                                    onClick={() => handleEditModule(module.brdge_id, module.brdge?.public_id?.substring(0, 6))}
                                                                    fullWidth
                                                                    sx={{ mt: 2 }} // Margin top
                                                                // Use default theme styles
                                                                >
                                                                    Edit Module
                                                                </Button>

                                                            </CardContent>
                                                        </Card>
                                                    </SwiperSlide>

                                                ))}
                                        </Swiper>
                                    ) : (
                                        <Paper // Use Paper for the empty state
                                            variant="outlined" // Outlined variant for subtle container
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                bgcolor: theme.palette.background.default, // Default background
                                            }}
                                        >
                                            <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                No modules added to this course yet.
                                            </Typography>
                                            <Button
                                                startIcon={<AddIcon />}
                                                onClick={handleOpenAddModuleDialog}
                                                variant="contained" // Standard contained button
                                                color="primary"
                                            >
                                                Add Your First Module
                                            </Button>
                                        </Paper>

                                    )}
                                </Box>
                            </Box>
                        </>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 1 && (
                        <Paper // Use Paper component for settings container
                            elevation={1}
                            sx={{
                                p: 3,
                                borderRadius: theme.shape.borderRadius,
                                // Remove blur/border overrides
                            }}
                        >
                            <Typography
                                variant="h6" // Use standard typography
                                sx={{
                                    mb: 3,
                                    // Remove decorative underline
                                }}
                            >
                                Course Settings
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isShareable}
                                        onChange={handleToggleShareable}
                                        color="primary" // Use primary color for switch
                                        disabled={savingShareStatus}
                                    />
                                }
                                label="Public Access"
                                sx={{ mb: 2 }} // Add margin
                            />
                            {savingShareStatus && <CircularProgress size={20} sx={{ ml: 1 }} />} {/* Indicate saving */}

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {isShareable ? "Anyone with the link can view this course." : "Only you and enrolled users (based on module settings) can access this course."}
                            </Typography>

                            <Button
                                variant="outlined" // Standard outlined button
                                startIcon={<ShareIcon />}
                                onClick={handleOpenShareDialog}
                                color="primary" // Use primary color
                            // Use default theme styles
                            >
                                Sharing Options
                            </Button>
                        </Paper>

                    )}

                    {/* Enrollment Tab - REMOVE TEXTURE */}
                    {activeTab === 2 && (
                        <Paper
                            elevation={1}
                            sx={{
                                p: 3,
                                borderRadius: theme.shape.borderRadius,
                            }}
                        >
                            <Box sx={{
                                position: 'relative',
                                // Removed ::before with oldMap texture
                            }}>
                                {/* ... Typography for Title ... */}
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 3, position: 'relative', zIndex: 1 }}
                                >
                                    Student Enrollments ({enrollments.length})
                                </Typography>

                                {/* ... Premium Access Info Box ... */}
                                <Paper sx={{
                                    p: 2, mb: 3,
                                    bgcolor: theme.palette.action.hover, // Use subtle theme background
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: theme.shape.borderRadius,
                                    position: 'relative', // Keep for zIndex
                                    zIndex: 1
                                }}>
                                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <WorkspacePremiumIcon sx={{ mr: 1, fontSize: '1.2rem', color: theme.palette.primary.main }} />
                                        Premium Access Management
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        Toggle premium access for students to view modules marked "Premium" (controlled in the Content tab).
                                    </Typography>
                                </Paper>


                                {/* Enrollment Table - REMOVE TEXTURE */}
                                {loadingEnrollments ? (
                                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                                ) : enrollments.length === 0 ? (
                                    // ... No students message ...
                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                                        No students enrolled yet. Share your course to get started!
                                    </Typography>
                                ) : (
                                    <Box sx={{
                                        position: 'relative',
                                        // Removed ::before with crumbledParchment texture
                                    }}>
                                        <TableContainer
                                            component={Paper}
                                            variant="outlined"
                                            sx={{
                                                mt: 2,
                                                borderRadius: theme.shape.borderRadius,
                                                background: 'transparent', // Ensure table bg doesn't hide parent
                                                position: 'relative',
                                                zIndex: 1,
                                                overflow: 'hidden', // Keep for rounded corners
                                                boxShadow: 'none',
                                                // ... table/cell styles ...
                                                '& .MuiTable-root': {
                                                    borderCollapse: 'separate',
                                                    borderSpacing: '0',
                                                },
                                                '& .MuiTableCell-root': {
                                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                                    color: theme.palette.text.primary,
                                                    position: 'relative',
                                                }

                                            }}
                                        >
                                            {/* ... Table Head/Body ... */}
                                            <Table stickyHeader> {/* Make header sticky if table is long */}
                                                <TableHead>
                                                    <TableRow sx={{
                                                        '& th': { // Style header cells
                                                            bgcolor: theme.palette.grey[200], // Light grey background for header
                                                            fontWeight: 'bold',
                                                        }
                                                    }}>
                                                        <TableCell>Student</TableCell>
                                                        <TableCell>Enrolled</TableCell>
                                                        {/* <TableCell>Last Access</TableCell> */}
                                                        <TableCell>Progress</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell align="center">
                                                            <Tooltip title="Premium Access" arrow>
                                                                <WorkspacePremiumIcon sx={{ color: theme.palette.primary.main }} />
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {enrollments.map((enrollment) => (
                                                        <TableRow key={enrollment.id} sx={{
                                                            '&:hover': { bgcolor: theme.palette.action.hover }, // Theme hover
                                                            // Use default theme styles
                                                            '&:last-child td': {
                                                                borderBottom: 0
                                                            }

                                                        }}>
                                                            <TableCell sx={{ color: theme.palette.text.primary }}>
                                                                {enrollment.user?.email || 'Unknown'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip title={new Date(enrollment.enrolled_at).toLocaleString()}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.secondary }}>
                                                                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                                                                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                                                    </Box>
                                                                </Tooltip>
                                                            </TableCell>
                                                            {/* <TableCell sx={{ color: theme.palette.text.primary }}>
                                                                {enrollment.last_accessed_at
                                                                    ? new Date(enrollment.last_accessed_at).toLocaleDateString()
                                                                    : 'Never'}
                                                                    </TableCell> */}
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Box sx={{ width: '60%', mr: 1 }}>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={enrollment.progress || 0}
                                                                            sx={{
                                                                                height: 6, // Slightly thinner
                                                                                borderRadius: theme.shape.borderRadius,
                                                                                bgcolor: theme.palette.grey[300], // Neutral background
                                                                                '& .MuiLinearProgress-bar': {
                                                                                    bgcolor: theme.palette.primary.main, // Theme primary color
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                                        {Math.round(enrollment.progress || 0)}%
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                                                    size="small"
                                                                    color={enrollment.status === 'active' ? 'success' : 'default'} // Use theme colors
                                                                    variant="outlined" // Use outlined chip style
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Tooltip title={enrollment.has_premium_access ? "Revoke Premium Access" : "Grant Premium Access"}>
                                                                    <IconButton
                                                                        onClick={() => handleTogglePremiumAccess(enrollment.id)}
                                                                        size="small"
                                                                        sx={{
                                                                            color: enrollment.has_premium_access ? theme.palette.primary.main : theme.palette.action.disabled,
                                                                            // Use default IconButton styles
                                                                        }}
                                                                        disabled={savingCourse} // Disable while saving
                                                                    >
                                                                        <WorkspacePremiumIcon sx={{ fontSize: '1.2rem' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                        </TableContainer>
                                    </Box>
                                )}

                                {/* ... Premium Module Count ... */}
                                {enrollments.length > 0 && course?.modules && course.modules.length > 0 && (
                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 3 }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                    Premium Students:
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                                    {enrollments.filter(e => e.has_premium_access).length} / {enrollments.length}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                    Premium Modules:
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                                                    {course.modules.filter(m => m.access_level === 'premium').length} / {course.modules.length}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                )}

                            </Box>
                        </Paper>
                    )}
                </Box>

                {/* Share Dialog - REMOVE TEXTURE */}
                <Dialog
                    open={shareDialogOpen}
                    onClose={handleCloseShareDialog}
                    PaperProps={{
                        sx: {
                            borderRadius: theme.shape.borderRadius,
                            minWidth: { xs: '90%', sm: 450 },
                            position: 'relative', // Keep for potential absolute children
                            // Removed ::before with darkParchment texture
                        }
                    }}
                >
                    {/* ... DialogTitle ... */}
                    <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <ShareIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Sharing Options
                            </Typography>
                        </Box>
                    </DialogTitle>

                    {/* ... DialogContent ... */}
                    <DialogContent sx={{ p: 3, mt: 2, position: 'relative', zIndex: 1 }}>
                        <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                            {isShareable ?
                                "This course is public. Anyone with the link can view the content (respecting individual module access levels)." :
                                "This course is private. Only you can access the edit page. Enrolled users can view content based on module access levels."}
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isShareable || false}
                                    onChange={handleToggleShareable}
                                    color="primary" // Use primary color
                                    disabled={savingShareStatus}
                                />
                            }
                            label={
                                <Typography sx={{ fontWeight: 500 }}>
                                    Make Course Public
                                </Typography>
                            }
                            sx={{ my: 1.5, display: 'block' }}
                        />
                        {savingShareStatus && <CircularProgress size={20} sx={{ ml: 1 }} />}

                        {isShareable && course?.public_id && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" gutterBottom sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                                    Public link:
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={`${window.location.origin}/c/${course.public_id}`}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title={linkCopied ? "Copied!" : "Copy Link"} arrow>
                                                    <IconButton
                                                        onClick={handleCopyLink}
                                                        edge="end"
                                                        color={linkCopied ? "success" : "primary"} // Use theme colors
                                                    >
                                                        {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        )
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        )}

                        <Paper variant="outlined" sx={{ mt: 3, p: 2, bgcolor: theme.palette.action.hover }}>
                            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
                                Course: {course?.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 1 }}>
                                Module access (Public, Enrolled, Premium) is controlled individually in the 'Content' tab.
                            </Typography>
                        </Paper>
                    </DialogContent>

                    {/* ... DialogActions ... */}
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleCloseShareDialog} color="primary" /* Use default theme style */ >
                            Close
                        </Button>
                    </DialogActions>

                </Dialog>

                {/* Add Module Dialog - REMOVE TEXTURE */}
                <Dialog
                    open={addModuleDialogOpen}
                    onClose={handleCloseAddModuleDialog}
                    PaperProps={{
                        sx: {
                            borderRadius: theme.shape.borderRadius,
                            maxWidth: 'sm',
                            width: '100%',
                            overflow: 'hidden', // Keep for consistency
                            position: 'relative', // Keep for potential absolute children
                            // Removed ::before with crumbledParchment texture
                            // Removed ::after with stampLogo texture
                        }
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    {/* ... DialogTitle ... */}
                    <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {/* Use a standard icon */}
                            <AddIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Add Module to Course
                            </Typography>
                        </Box>
                    </DialogTitle>

                    {/* ... DialogContent ... */}
                    <DialogContent sx={{
                        p: 3,
                        mt: 2, // Adjusted margin
                        bgcolor: theme.palette.background.paper, // Ensure background consistency
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Typography variant="body1" gutterBottom sx={{
                            mb: 2,
                            // Removed decorative line ::before
                        }}>
                            Select an existing module to add:
                        </Typography>

                        <Box sx={{
                            width: '100%',
                            maxHeight: 300,
                            overflow: 'auto',
                            mt: 1,
                            borderRadius: theme.shape.borderRadius,
                            border: `1px solid ${theme.palette.divider}`,
                            position: 'relative',
                            // Removed ::before with lightMarble texture
                            // Removed custom scrollbar styles
                        }}>
                            <List sx={{ width: '100%', padding: 0 }}>
                                {availableBrdges.length > 0 ? availableBrdges.map((brdge) => (
                                    <ListItem
                                        key={brdge.id}
                                        button // Make it behave like a button
                                        selected={selectedBrdgeId === brdge.id}
                                        onClick={() => setSelectedBrdgeId(brdge.id)}
                                        sx={{
                                            borderBottom: `1px solid ${theme.palette.divider}`, // Divider between items
                                            '&:last-child': { borderBottom: 'none' }, // Remove last border
                                            '&.Mui-selected': { // Theme selected style
                                                bgcolor: theme.palette.action.selected,
                                                '&::before': { display: 'none' }, // Ensure no leftover pseudo elements
                                                '&:hover': {
                                                    bgcolor: theme.palette.action.hover,
                                                }
                                            },
                                            '&:hover': { // Theme hover style
                                                bgcolor: theme.palette.action.hover,
                                            },
                                            // Removed ::after ink spot
                                        }}
                                    >
                                        <ListItemText
                                            primary={brdge.name}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontWeight: selectedBrdgeId === brdge.id ? 600 : 400,
                                                    color: selectedBrdgeId === brdge.id ? theme.palette.primary.main : theme.palette.text.primary,
                                                }
                                            }}
                                        />
                                    </ListItem>
                                )) : (
                                    <ListItem sx={{ justifyContent: 'center', py: 3 }}>
                                        <Typography color="text.secondary">
                                            No available modules found. Create a new Brdge first.
                                        </Typography>
                                    </ListItem>
                                )}
                            </List>

                        </Box>

                        {/* ... Empty state message ... */}
                    </DialogContent>

                    {/* ... DialogActions ... */}
                    <DialogActions sx={{
                        px: 3,
                        pb: 2, // Adjusted padding
                        pt: 2, // Adjusted padding
                        bgcolor: theme.palette.background.paper, // Ensure consistent background
                        borderTop: `1px solid ${theme.palette.divider}`, // Standard divider
                        position: 'relative',
                        zIndex: 1,
                        justifyContent: 'space-between', // Keep layout
                        // Removed decorative line ::before
                    }}>
                        <Button
                            onClick={handleCloseAddModuleDialog}
                            color="secondary" // Use theme secondary color
                            sx={{ /* Default button styles */ }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddModule}
                            disabled={!selectedBrdgeId}
                            variant="contained"
                            color="primary"
                            endIcon={<AddIcon />}
                            sx={{ /* Default button styles */ }}
                        >
                            Add Selected Module
                        </Button>
                    </DialogActions>

                </Dialog>

                {/* Delete Confirmation Dialog - REMOVE TEXTURE */}
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={handleCancelDeleteModule}
                    PaperProps={{
                        sx: {
                            borderRadius: theme.shape.borderRadius,
                            position: 'relative', // Keep for potential absolute children
                            overflow: 'hidden', // Keep for consistency
                            // Removed ::before with darkParchment texture
                            '& > *': { // Ensure direct children are above pseudo elements if any remained
                                position: 'relative',
                                zIndex: 1
                            }
                        }
                    }}
                    maxWidth="xs"
                    fullWidth
                >
                    {/* ... DialogTitle ... */}
                    <DialogTitle sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        // Removed decorative line ::after
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <DeleteIcon sx={{ color: theme.palette.error.main }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Remove Module?
                            </Typography>
                        </Box>
                    </DialogTitle>

                    {/* ... DialogContent ... */}
                    <DialogContent sx={{ p: 3, mt: 1 }}>
                        <Typography>
                            Are you sure you want to remove this module from the course? This action cannot be undone, but the Brdge content itself will not be deleted.
                        </Typography>
                    </DialogContent>

                    {/* ... DialogActions ... */}
                    <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                        <Button
                            onClick={handleCancelDeleteModule}
                            color="secondary" // Theme secondary color
                            sx={{ /* Default button styles */ }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDeleteModule}
                            color="error"
                            variant="contained"
                            sx={{ /* Default button styles */ }}
                        >
                            Remove
                        </Button>
                    </DialogActions>

                </Dialog>

                {/* Remove scholarly divider */}

            </Box>
        </motion.div>
    );
}

export default EditCoursePage; 