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
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
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
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${theme.textures.darkParchment})`,
                        backgroundSize: 'cover',
                        opacity: 0.1,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }
                }}>
                    <Box sx={{ position: 'relative', width: 120, height: 120, zIndex: 1 }}>
                        <CircularProgress
                            variant="determinate"
                            value={75}
                            size={120}
                            thickness={2}
                            sx={{
                                color: theme.palette.secondary.main,
                            }}
                        />
                        <CircularProgress
                            size={120}
                            thickness={3}
                            sx={{
                                color: theme.palette.secondary.light,
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
                                75%
                            </Typography>
                        </Box>
                    </Box>
                    <Typography
                        variant="h5"
                        sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 500,
                            mt: 4,
                            fontFamily: theme.typography.headingFontFamily,
                        }}
                    >
                        Loading Course Editor
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
                        Preparing your workspace with all modules and editor tools...
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
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${theme.textures.darkParchment})`,
                        backgroundSize: 'cover',
                        opacity: 0.1,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }
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
                                    fontFamily: theme.typography.headingFontFamily,
                                    letterSpacing: '-0.01em',
                                    mb: 2,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        display: 'block',
                                        width: '40px',
                                        height: '2px',
                                        background: theme.palette.secondary.main,
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
                                You do not have permission to edit this course
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
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${theme.textures.darkParchment})`,
                    backgroundSize: 'cover',
                    opacity: 0.1,
                    pointerEvents: 'none',
                    zIndex: 0,
                    mixBlendMode: 'multiply'
                }
            }}>
                {/* Tabs Navigation - Modified to connect with header */}
                <Box sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: '0 0 16px 16px',
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    borderTop: 'none', // Remove top border to connect with header
                    position: 'relative',
                    zIndex: 1,
                    mb: 4,
                    mt: 0, // Ensure no margin top
                    boxShadow: theme.shadows[1]
                }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: theme.palette.secondary.main,
                                height: 2,
                            },
                            '& .MuiTab-root': {
                                color: theme.palette.text.secondary,
                                minHeight: '56px',
                                transition: 'all 0.3s ease',
                                fontSize: '0.9rem',
                                letterSpacing: '0.03em',
                                fontWeight: 500,
                                '&.Mui-selected': {
                                    color: theme.palette.secondary.main,
                                    fontWeight: 600,
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                                    color: theme.palette.text.primary,
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
                <Box sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
                    {/* Content Tab */}
                    {activeTab === 0 && (
                        <>
                            {/* Course Header */}
                            <Box sx={{
                                mb: 3,
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 3,
                                bgcolor: theme.palette.background.paper,
                                borderRadius: '16px',
                                p: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: `url(${theme.textures.crumbledParchment})`,
                                    backgroundSize: 'cover',
                                    opacity: 0.05,
                                    mixBlendMode: 'multiply',
                                    borderRadius: '16px',
                                    zIndex: 0,
                                }
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
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    border: courseThumbPreview ? 'none' : `1px dashed ${theme.palette.divider}`,
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        paddingTop: '56.25%',
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
                                                    color="secondary"
                                                    startIcon={<AddPhotoAlternateIcon />}
                                                    sx={{
                                                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                                                        backdropFilter: 'blur(4px)',
                                                        fontWeight: 500,
                                                        borderRadius: '50px',
                                                        px: 2,
                                                        py: 1,
                                                        '&:hover': {
                                                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                                                        }
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
                                            color="secondary"
                                            startIcon={<AddPhotoAlternateIcon />}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                flexDirection: 'column',
                                                gap: 1,
                                                padding: 2,
                                                border: 'none',
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.06)',
                                                }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                                Add Course Thumbnail
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
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
                                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                                            zIndex: 5,
                                            backdropFilter: 'blur(4px)'
                                        }}>
                                            <CircularProgress size={40} sx={{ color: theme.palette.secondary.main }} />
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
                                                    fontFamily: theme.typography.headingFontFamily,
                                                    color: theme.palette.text.primary,
                                                    '&::before': { display: 'none' },
                                                    '&::after': { display: 'none' },
                                                    '& input::placeholder': {
                                                        color: theme.palette.text.disabled,
                                                        opacity: 1
                                                    }
                                                }
                                            }}
                                            sx={{ flex: 1 }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveCourse}
                                            color="primary"
                                            sx={{
                                                borderRadius: '50px',
                                                px: 3,
                                                py: 1,
                                                fontWeight: 500,
                                                boxShadow: theme.shadows[2],
                                                '&:hover': {
                                                    boxShadow: theme.shadows[4],
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.2s ease',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                // Add Neo-Scholar decorative underline effect on hover
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: '15%',
                                                    right: '15%',
                                                    height: '2px',
                                                    background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}80, transparent)`,
                                                    opacity: 0,
                                                    transition: 'opacity 0.3s ease'
                                                },
                                                '&:hover::after': {
                                                    opacity: 1
                                                }
                                            }}
                                        >
                                            Save
                                        </Button>
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
                                                color: theme.palette.text.secondary,
                                                fontSize: '0.95rem',
                                                lineHeight: '1.5',
                                                letterSpacing: '0.01em',
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: theme.palette.text.disabled,
                                                opacity: 1
                                            },
                                            '& .MuiInput-underline:before': {
                                                borderBottomColor: `${theme.palette.divider}`
                                            },
                                            '& .MuiInput-underline:hover:before': {
                                                borderBottomColor: theme.palette.secondary.main
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
                                            borderRadius: '8px',
                                            px: 2.5,
                                            py: 1,
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            color: theme.palette.primary.contrastText,
                                            textTransform: 'none',
                                            backgroundColor: theme.palette.primary.main,
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                backgroundColor: theme.palette.primary.dark,
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                                            },
                                            // Add decorative line that animates on hover
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: '15%',
                                                right: '15%',
                                                height: '2px',
                                                background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}70, transparent)`,
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease'
                                            },
                                            '&:hover::after': {
                                                opacity: 1
                                            }
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
                                                            bgcolor: theme.palette.background.paper,
                                                            borderRadius: '20px',
                                                            overflow: 'hidden',
                                                            position: 'relative',
                                                            transition: 'all 0.3s ease-in-out',
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            '&:hover': {
                                                                transform: 'translateY(-8px)',
                                                                boxShadow: theme.shadows[8],
                                                                '& .module-image': {
                                                                    transform: 'scale(1.05)',
                                                                },
                                                                '& .module-overlay': {
                                                                    opacity: 1,
                                                                },
                                                                // Add decorative corners on hover
                                                                '& .corner-tl, & .corner-br': {
                                                                    opacity: 0.8
                                                                }
                                                            },
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                inset: 0,
                                                                backgroundImage: `url(${theme.textures.lightMarble})`,
                                                                backgroundSize: 'cover',
                                                                opacity: 0.05,
                                                                mixBlendMode: 'multiply',
                                                                zIndex: 0,
                                                            },
                                                            // Add decorative corner elements
                                                            '& .corner-tl': {
                                                                position: 'absolute',
                                                                top: 10,
                                                                left: 10,
                                                                width: '20px',
                                                                height: '20px',
                                                                borderTop: `1px solid ${theme.palette.secondary.main}50`,
                                                                borderLeft: `1px solid ${theme.palette.secondary.main}50`,
                                                                opacity: 0.4,
                                                                transition: 'opacity 0.3s ease',
                                                                zIndex: 5
                                                            },
                                                            '& .corner-br': {
                                                                position: 'absolute',
                                                                bottom: 10,
                                                                right: 10,
                                                                width: '20px',
                                                                height: '20px',
                                                                borderBottom: `1px solid ${theme.palette.secondary.main}50`,
                                                                borderRight: `1px solid ${theme.palette.secondary.main}50`,
                                                                opacity: 0.4,
                                                                transition: 'opacity 0.3s ease',
                                                                zIndex: 5
                                                            }
                                                        }}>
                                                            <Box className="corner-tl" />
                                                            <Box className="corner-br" />
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
                                                                        bgcolor: `${theme.palette.secondary.main}15`,
                                                                        borderRadius: '10px',
                                                                        padding: '6px 12px',
                                                                        border: `1px solid ${theme.palette.secondary.main}30`,
                                                                        transition: 'all 0.3s ease',
                                                                        '&:hover': {
                                                                            bgcolor: `${theme.palette.secondary.main}25`,
                                                                            transform: 'scale(1.05)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <AutoStoriesIcon sx={{
                                                                        fontSize: '0.9rem',
                                                                        color: theme.palette.secondary.main,
                                                                    }} />
                                                                    <Typography variant="caption" sx={{
                                                                        color: theme.palette.secondary.main,
                                                                        fontWeight: 'medium',
                                                                        fontSize: '0.75rem',
                                                                        letterSpacing: '0.03em',
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
                                                                        ${theme.palette.background.paper} 0%,
                                                                        ${theme.palette.parchment.dark} 100%)`, // Replace cyan gradient with parchment
                                                                        '&::before': (!moduleThumbPreviews[module.id] && !module.thumbnail_url) ? {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            right: 0,
                                                                            bottom: 0,
                                                                            background: `radial-gradient(circle at 50% 50%,
                                                                            ${theme.palette.secondary.main}15 0%,
                                                                            ${theme.palette.secondary.main}05 25%,
                                                                            transparent 50%)`, // Replace cyan with sepia
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
                                                                                bgcolor: `${theme.palette.secondary.main}10`, // Replace cyan with sepia
                                                                                backdropFilter: 'blur(8px)',
                                                                                border: `2px solid ${theme.palette.secondary.main}30`, // Sepia border
                                                                                transition: 'all 0.3s ease',
                                                                                '&:hover': {
                                                                                    bgcolor: `${theme.palette.secondary.main}20`, // More opaque sepia on hover
                                                                                    transform: 'scale(1.1)',
                                                                                    border: `2px solid ${theme.palette.secondary.main}50`, // More opaque sepia border
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
                                                                                    border: `2px solid ${theme.palette.secondary.main}20`, // Sepia pulsing border
                                                                                    borderRadius: '50%',
                                                                                    animation: 'pulseRing 2s infinite',
                                                                                }
                                                                            }}
                                                                        >
                                                                            <PlayArrowIcon
                                                                                className="play-icon"
                                                                                sx={{
                                                                                    fontSize: 40,
                                                                                    color: theme.palette.secondary.main, // Sepia icon instead of cyan
                                                                                    filter: `drop-shadow(0 0 8px ${theme.palette.secondary.main}50)`, // Sepia glow
                                                                                    transition: 'all 0.3s ease',
                                                                                }}
                                                                            />
                                                                        </IconButton>
                                                                        <Typography
                                                                            variant="caption"
                                                                            sx={{
                                                                                color: theme.palette.parchment.light,
                                                                                // Replace cyan glow with sepia
                                                                                textShadow: `0 0 10px ${theme.palette.secondary.main}50`,
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
                                                                                    // Replace cyan with sepia 
                                                                                    bgcolor: theme.palette.secondary.main,
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
                                                                            // Change from hardcoded cyan to theme colors
                                                                            color: theme.palette.text.primary,
                                                                            '&::before': { display: 'none' },
                                                                            '&::after': { display: 'none' },
                                                                            '&::placeholder': {
                                                                                color: theme.palette.text.disabled,
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
                                                                    backgroundColor: `rgba(0, 0, 0, 0.05)`, // Subtle dark background
                                                                    border: `1px solid ${theme.palette.secondary.main}10`, // Sepia border instead of cyan
                                                                    transition: 'box-shadow 0.3s ease',
                                                                    '&:hover': {
                                                                        boxShadow: `0 0 10px ${theme.palette.secondary.main}10`, // Sepia glow instead of cyan
                                                                    }
                                                                }}>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        mb: 1.5,
                                                                        position: 'relative',
                                                                        pl: 1,
                                                                        // Add light sepia left border for scholarly appearance
                                                                        '&::before': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: '10%',
                                                                            bottom: '10%',
                                                                            left: 0,
                                                                            width: '2px',
                                                                            background: `linear-gradient(to bottom, transparent, ${theme.palette.secondary.main}40, transparent)`,
                                                                            borderRadius: '1px'
                                                                        }
                                                                    }}>
                                                                        <LockIcon sx={{
                                                                            fontSize: 18,
                                                                            color: theme.palette.secondary.main,
                                                                            opacity: 0.9
                                                                        }} />
                                                                        <Typography variant="subtitle2" sx={{
                                                                            color: theme.palette.text.primary,
                                                                            fontWeight: '500',
                                                                            fontFamily: theme.typography.headingFontFamily,
                                                                            fontSize: '0.95rem',
                                                                            fontStyle: 'italic'
                                                                        }}>
                                                                            Content Access Control
                                                                        </Typography>
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
                                                                                label: 'Public',
                                                                                description: 'Anyone can access, even without enrollment'
                                                                            },
                                                                            {
                                                                                level: 'enrolled',
                                                                                icon: <PersonIcon sx={{ fontSize: 18 }} />,
                                                                                label: 'Enrolled',
                                                                                description: 'Only enrolled users can access'
                                                                            },
                                                                            {
                                                                                level: 'premium',
                                                                                icon: <WorkspacePremiumIcon sx={{ fontSize: 18 }} />,
                                                                                label: 'Premium',
                                                                                description: 'Requires premium enrollment access'
                                                                            }
                                                                        ].map(({ level, icon, label, description }) => (
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
                                                                                                `${theme.palette.secondary.main}15` : 'transparent',
                                                                                            color: (module.access_level || 'enrolled') === level ?
                                                                                                theme.palette.secondary.main : theme.palette.text.secondary,
                                                                                            borderColor: (module.access_level || 'enrolled') === level ?
                                                                                                theme.palette.secondary.main : theme.palette.divider,
                                                                                            borderWidth: '1px',
                                                                                            padding: '8px 10px',
                                                                                            borderRadius: '8px',
                                                                                            fontSize: '0.85rem',
                                                                                            fontWeight: (module.access_level || 'enrolled') === level ? '600' : '400',
                                                                                            boxShadow: 'none',
                                                                                            transition: 'all 0.2s ease',
                                                                                            '&:hover': {
                                                                                                backgroundColor: (module.access_level || 'enrolled') === level ?
                                                                                                    `${theme.palette.secondary.main}25` : `${theme.palette.secondary.main}08`,
                                                                                                borderColor: theme.palette.secondary.main,
                                                                                                transform: 'translateY(-1px)',
                                                                                            },
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
                                                                        // Replace hard-coded white/gray with theme colors
                                                                        color: theme.palette.text.secondary,
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
                                                                                // Replace hard-coded cyan with theme colors
                                                                                color: theme.palette.text.primary,
                                                                                fontSize: '0.85rem',
                                                                                lineHeight: '1.5',
                                                                            },
                                                                            '& .MuiInputBase-input::placeholder': {
                                                                                color: theme.palette.text.disabled,
                                                                                opacity: 1
                                                                            },
                                                                            '& .MuiInput-underline:before': {
                                                                                borderBottomColor: theme.palette.divider
                                                                            },
                                                                            '& .MuiInput-underline:hover:before': {
                                                                                borderBottomColor: theme.palette.secondary.main
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
                                                                                // Replace cyan with sepia
                                                                                color: theme.palette.secondary.main
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
                                                                                // Use theme warning color instead of hardcoded amber
                                                                                color: theme.palette.warning.main
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
                                                                        backgroundColor: theme.palette.primary.main, // Ink background instead of cyan gradient
                                                                        boxShadow: `0 0 10px ${theme.palette.primary.main}30`, // Ink shadow
                                                                        fontWeight: 'medium',
                                                                        letterSpacing: '0.01em',
                                                                        height: '40px',
                                                                        fontSize: '0.85rem',
                                                                        borderRadius: '10px',
                                                                        '&:hover': {
                                                                            backgroundColor: theme.palette.primary.dark, // Darker ink on hover
                                                                            boxShadow: `0 0 15px ${theme.palette.primary.main}50`, // Stronger ink shadow
                                                                            transform: 'translateY(-2px)'
                                                                        },
                                                                        '&.Mui-disabled': {
                                                                            background: `${theme.palette.primary.main}30` // Transparent ink for disabled
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
                                            // Replace cyan background/border with theme colors
                                            bgcolor: `${theme.palette.background.paper}`,
                                            borderRadius: '16px',
                                            border: `1px solid ${theme.palette.divider}`,
                                        }}>
                                            <Typography sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                                No modules added to this course yet.
                                            </Typography>
                                            <Button
                                                startIcon={<AddIcon />}
                                                onClick={handleOpenAddModuleDialog}
                                                sx={{
                                                    background: theme.palette.primary.main, // Changed from cyan gradient to ink color
                                                    borderRadius: '10px',
                                                    px: 2.5,
                                                    py: 1,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 500,
                                                    color: theme.palette.primary.contrastText, // Parchment text color
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        background: theme.palette.primary.dark, // Darker ink on hover
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 4px 12px ${theme.palette.primary.main}40`, // Ink shadow instead of cyan
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
                            <Typography
                                variant="h6"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontFamily: theme.typography.headingFontFamily,
                                    mb: 3,
                                    position: 'relative',
                                    zIndex: 1,
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -8,
                                        left: 0,
                                        width: 40,
                                        height: 2,
                                        backgroundColor: theme.palette.secondary.main,
                                        borderRadius: 1
                                    }
                                }}
                            >
                                Course Settings
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isShareable}
                                        onChange={handleToggleShareable}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: theme.palette.secondary.main,
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: theme.palette.secondary.light,
                                            },
                                        }}
                                    />
                                }
                                label="Public Access"
                                sx={{
                                    '& .MuiFormControlLabel-label': {
                                        color: theme.palette.text.primary,
                                    }
                                }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<ShareIcon />}
                                onClick={handleOpenShareDialog}
                                color="secondary"
                                sx={{ mt: 2 }}
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
                            <Box sx={{
                                bgcolor: theme.palette.background.paper,
                                borderRadius: '16px',
                                p: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: `url(${theme.textures.oldMap})`,
                                    backgroundSize: 'cover',
                                    opacity: 0.03,
                                    mixBlendMode: 'multiply',
                                    borderRadius: '16px',
                                    zIndex: 0,
                                }
                            }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: theme.palette.text.primary,
                                        fontFamily: theme.typography.headingFontFamily,
                                        mb: 3,
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    Student Enrollments ({enrollments.length})
                                </Typography>

                                {/* Premium Access Info Box */}
                                <Paper sx={{
                                    p: 2,
                                    mb: 3,
                                    bgcolor: theme.palette.parchment.dark,
                                    border: `1px dashed ${theme.palette.secondary.main}40`,
                                    borderRadius: '12px',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <Typography variant="subtitle2" sx={{
                                        color: theme.palette.secondary.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 1,
                                        fontFamily: theme.typography.headingFontFamily
                                    }}>
                                        <WorkspacePremiumIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                        Premium Access Management
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        Toggle premium access for enrolled students to allow them to view modules marked as "Premium" in your course.
                                        This works with the module access controls in the Content tab.
                                    </Typography>
                                </Paper>

                                {/* Enrollment Table - Restyled as a classroom roster */}
                                {loadingEnrollments ? (
                                    <CircularProgress sx={{ color: theme.palette.secondary.main }} />
                                ) : enrollments.length === 0 ? (
                                    <Typography variant="body1" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                                        No students enrolled yet.
                                    </Typography>
                                ) : (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundImage: `url(${theme.textures.crumbledParchment})`,
                                                backgroundSize: 'cover',
                                                opacity: 0.1,
                                                borderRadius: '12px',
                                                zIndex: 0,
                                            }
                                        }}
                                    >
                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                mt: 2,
                                                borderRadius: '12px',
                                                border: `1px solid ${theme.palette.divider}`,
                                                background: 'transparent',
                                                position: 'relative',
                                                zIndex: 1,
                                                overflow: 'hidden',
                                                boxShadow: 'none',
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
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{
                                                        '& th': {
                                                            bgcolor: theme.palette.parchment.dark,
                                                            color: theme.palette.text.primary,
                                                            fontWeight: 'bold',
                                                            fontFamily: theme.typography.headingFontFamily,
                                                            borderBottom: `2px solid ${theme.palette.secondary.main}`,
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
                                                                    <WorkspacePremiumIcon sx={{ color: theme.palette.secondary.main }} />
                                                                </Box>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {enrollments.map((enrollment) => (
                                                        <TableRow key={enrollment.id} sx={{
                                                            bgcolor: theme.palette.background.paper,
                                                            '&:hover': { bgcolor: theme.palette.parchment.light },
                                                            transition: 'background-color 0.2s',
                                                            '&:last-child td': {
                                                                borderBottom: 0
                                                            }
                                                        }}>
                                                            <TableCell sx={{ color: theme.palette.text.primary }}>
                                                                {enrollment.user?.email || 'Unknown'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Tooltip title={new Date(enrollment.enrolled_at).toLocaleString()}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.primary }}>
                                                                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                                                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                                                    </Box>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell sx={{ color: theme.palette.text.primary }}>
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
                                                                                bgcolor: `${theme.palette.parchment.light}80`,
                                                                                '& .MuiLinearProgress-bar': {
                                                                                    bgcolor: theme.palette.secondary.main,
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
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
                                                                            ? `${theme.palette.secondary.main}15`
                                                                            : theme.palette.parchment.light,
                                                                        color: enrollment.status === 'active'
                                                                            ? theme.palette.secondary.main
                                                                            : theme.palette.text.secondary,
                                                                        borderRadius: '4px',
                                                                        fontWeight: 500,
                                                                        fontSize: '0.75rem',
                                                                        border: enrollment.status === 'active'
                                                                            ? `1px solid ${theme.palette.secondary.main}30`
                                                                            : `1px solid ${theme.palette.divider}`
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Tooltip title={enrollment.has_premium_access ? "Revoke Premium Access" : "Grant Premium Access"}>
                                                                    <IconButton
                                                                        onClick={() => handleTogglePremiumAccess(enrollment.id)}
                                                                        size="small"
                                                                        sx={{
                                                                            color: enrollment.has_premium_access ? theme.palette.secondary.main : theme.palette.text.disabled,
                                                                            bgcolor: enrollment.has_premium_access ? `${theme.palette.secondary.main}15` : 'transparent',
                                                                            border: enrollment.has_premium_access ? `1px solid ${theme.palette.secondary.main}30` : `1px solid ${theme.palette.divider}`,
                                                                            transition: 'all 0.2s',
                                                                            '&:hover': {
                                                                                bgcolor: enrollment.has_premium_access ? `${theme.palette.secondary.main}25` : `${theme.palette.secondary.main}05`,
                                                                                border: enrollment.has_premium_access ? `1px solid ${theme.palette.secondary.main}50` : `1px solid ${theme.palette.secondary.main}10`,
                                                                            }
                                                                        }}
                                                                    >
                                                                        <WorkspacePremiumIcon sx={{
                                                                            fontSize: '1.2rem',
                                                                        }} />
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

                                {/* Premium Module Count Information */}
                                {enrollments.length > 0 && (
                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Paper sx={{
                                            p: 2,
                                            bgcolor: theme.palette.parchment.dark,
                                            border: `1px solid ${theme.palette.secondary.main}30`,
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                    Premium Students:
                                                </Typography>
                                                <Typography variant="h6" sx={{
                                                    color: theme.palette.secondary.main,
                                                    fontWeight: 'bold',
                                                    fontFamily: theme.typography.headingFontFamily
                                                }}>
                                                    {enrollments.filter(e => e.has_premium_access).length} / {enrollments.length}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                    Premium Modules:
                                                </Typography>
                                                <Typography variant="h6" sx={{
                                                    color: theme.palette.secondary.main,
                                                    fontWeight: 'bold',
                                                    fontFamily: theme.typography.headingFontFamily
                                                }}>
                                                    {course?.modules?.filter(m => m.access_level === 'premium').length || 0} / {course?.modules?.length || 0}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Share Dialog */}
                <Dialog
                    open={shareDialogOpen}
                    onClose={handleCloseShareDialog}
                    PaperProps={{
                        sx: {
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            borderRadius: 2,
                            boxShadow: theme.shadows[5],
                            border: `1px solid ${theme.palette.divider}`,
                            minWidth: { xs: '90%', sm: 400 },
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${theme.textures.darkParchment})`,
                                backgroundSize: 'cover',
                                opacity: 0.05,
                                mixBlendMode: 'multiply',
                                borderRadius: 'inherit',
                                zIndex: 0,
                            }
                        }
                    }}
                >
                    <DialogTitle sx={{
                        bgcolor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontFamily: theme.typography.headingFontFamily,
                        py: 2.5,
                        fontWeight: 600,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '10%',
                            right: '10%',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}50, transparent)`,
                        }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: `${theme.palette.secondary.main}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -2,
                                    left: -2,
                                    right: -2,
                                    bottom: -2,
                                    borderRadius: '50%',
                                    border: `1px solid ${theme.palette.secondary.main}30`,
                                    opacity: 0.7
                                }
                            }}>
                                <ShareIcon sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
                            </Box>
                            <Typography sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                fontWeight: 600,
                            }}>
                                Share Course
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, mt: 1, position: 'relative', zIndex: 1 }}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            sx={{
                                color: theme.palette.text.secondary,
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
                                    checked={isShareable || false}
                                    onChange={handleToggleShareable}
                                    color="secondary"
                                    disabled={savingShareStatus}
                                />
                            }
                            label={
                                <Typography sx={{
                                    color: theme.palette.text.primary,
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
                                    color: theme.palette.text.primary
                                }
                            }}
                        />

                        {isShareable && (
                            <Box sx={{ mt: 3 }}>
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        mb: 1
                                    }}
                                >
                                    Share this link:
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={`${window.location.origin}/c/${course?.public_id}`}
                                    InputProps={{
                                        readOnly: true,
                                        sx: {
                                            color: theme.palette.text.primary,
                                            bgcolor: theme.palette.background.default,
                                            '& .MuiInputBase-input': {
                                                color: theme.palette.text.primary,
                                            }
                                        },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleCopyLink}
                                                    edge="end"
                                                    sx={{ color: linkCopied ? theme.palette.success.main : theme.palette.secondary.main }}
                                                >
                                                    {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: `${theme.palette.secondary.main}50` },
                                            '&:hover fieldset': { borderColor: theme.palette.secondary.main },
                                        }
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        mt: 1,
                                        color: linkCopied ? theme.palette.success.main : theme.palette.text.disabled,
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    {linkCopied ? '✓ Link copied to clipboard!' : 'Click the copy icon to copy the link'}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: `${theme.palette.secondary.main}08`,
                            borderRadius: '8px',
                            border: `1px solid ${theme.palette.secondary.main}15`
                        }}>
                            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                <strong>Course:</strong> {course?.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mt: 1 }}>
                                When shared, others can view this course. Individual module access is controlled in the Content tab.
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AutoStoriesIcon sx={{ color: theme.palette.secondary.main, fontSize: 16 }} />
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                    {course?.modules?.length || 0} module(s) in this course
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, position: 'relative', zIndex: 1 }}>
                        <Button
                            onClick={handleCloseShareDialog}
                            variant="outlined"
                            sx={{
                                color: theme.palette.secondary.main,
                                borderColor: `${theme.palette.secondary.main}50`,
                                '&:hover': {
                                    borderColor: theme.palette.secondary.main,
                                    backgroundColor: `${theme.palette.secondary.main}10`
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
                            bgcolor: theme.palette.background.paper, // Warm parchment background
                            color: theme.palette.text.primary, // Ink text
                            borderRadius: '16px',
                            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.2)',
                            border: `1px solid ${theme.palette.secondary.main}30`,
                            position: 'relative',
                            maxWidth: 'sm',
                            width: '100%',
                            overflow: 'hidden',
                            // Add parchment texture overlay
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${theme.textures.crumbledParchment})`,
                                backgroundSize: 'cover',
                                opacity: 0.06,
                                mixBlendMode: 'multiply',
                                zIndex: 0,
                            },
                            // Add decorative corner effect
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: -5,
                                left: -5,
                                width: 40,
                                height: 40,
                                backgroundImage: `url(${theme.textures.stampLogo})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                opacity: 0.08,
                                transform: 'rotate(-15deg)',
                                zIndex: 0,
                            }
                        }
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        bgcolor: theme.palette.parchment.dark, // Slightly darker parchment for header
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontFamily: theme.typography.headingFontFamily,
                        fontWeight: 'bold',
                        letterSpacing: '0.02em',
                        position: 'relative',
                        zIndex: 1,
                        pb: 2.5,
                        // Add decorative underline
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 12,
                            left: 24,
                            right: 24,
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}70, transparent)`,
                        }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                        }}>
                            {/* Small decorative quill icon */}
                            <Box
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    width: 24,
                                    height: 24,
                                    bgcolor: `${theme.palette.secondary.main}15`,
                                    borderRadius: '50%',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%) rotate(-45deg)',
                                        width: '70%',
                                        height: '2px',
                                        background: theme.palette.secondary.main,
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '30%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '2px',
                                        height: '40%',
                                        background: theme.palette.secondary.main,
                                    }
                                }}
                            />
                            Add Module to Course
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{
                        p: 3,
                        mt: 1,
                        bgcolor: theme.palette.background.paper,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Typography variant="body1" gutterBottom sx={{
                            color: theme.palette.text.primary,
                            mb: 2,
                            fontFamily: theme.typography.fontFamily,
                            position: 'relative',
                            pl: 1,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: -4,
                                top: 8,
                                bottom: 8,
                                width: 3,
                                borderRadius: 4,
                                bgcolor: theme.palette.secondary.main,
                                opacity: 0.6,
                            }
                        }}>
                            Select module to put in course:
                        </Typography>

                        <Box sx={{
                            width: '100%',
                            maxHeight: 300,
                            overflow: 'auto',
                            mt: 2,
                            borderRadius: '8px',
                            border: `1px solid ${theme.palette.divider}`,
                            position: 'relative',
                            // Add subtle texture
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${theme.textures.lightMarble})`,
                                backgroundSize: 'cover',
                                opacity: 0.02,
                                mixBlendMode: 'multiply',
                                zIndex: 0,
                                pointerEvents: 'none',
                            },
                            // Custom scrollbar
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: theme.palette.parchment.light,
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: `${theme.palette.secondary.main}40`,
                                borderRadius: '4px',
                                border: `2px solid ${theme.palette.parchment.light}`,
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: `${theme.palette.secondary.main}70`,
                            }
                        }}>
                            <List sx={{
                                width: '100%',
                                padding: 0,
                                position: 'relative',
                                zIndex: 1,
                                '& .MuiListItem-root': {
                                    borderBottom: `1px solid ${theme.palette.divider}30`,
                                    transition: 'all 0.2s ease',
                                }
                            }}>
                                {availableBrdges.map((brdge) => (
                                    <ListItem
                                        key={brdge.id}
                                        button
                                        selected={selectedBrdgeId === brdge.id}
                                        onClick={() => setSelectedBrdgeId(brdge.id)}
                                        sx={{
                                            color: theme.palette.text.primary,
                                            py: 1.5,
                                            px: 2,
                                            position: 'relative',
                                            zIndex: 1,
                                            bgcolor: selectedBrdgeId === brdge.id
                                                ? `${theme.palette.secondary.main}08`
                                                : 'transparent',
                                            '&.Mui-selected': {
                                                bgcolor: `${theme.palette.secondary.main}15`,
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: 4,
                                                    borderRadius: '0 2px 2px 0',
                                                    bgcolor: theme.palette.secondary.main,
                                                },
                                                '&:hover': {
                                                    bgcolor: `${theme.palette.secondary.main}20`,
                                                }
                                            },
                                            '&:hover': {
                                                bgcolor: theme.palette.parchment.light,
                                            },
                                            // Decorative ink spot on selected item
                                            '&::after': selectedBrdgeId === brdge.id ? {
                                                content: '""',
                                                position: 'absolute',
                                                right: 16,
                                                bottom: 8,
                                                width: 10,
                                                height: 6,
                                                borderRadius: '50%',
                                                background: `radial-gradient(ellipse at center, ${theme.palette.secondary.main}90 0%, ${theme.palette.secondary.main}20 70%, transparent 100%)`,
                                                opacity: 0.6,
                                                transform: 'rotate(-15deg)',
                                            } : {}
                                        }}
                                    >
                                        <ListItemText
                                            primary={brdge.name}
                                            primaryTypographyProps={{
                                                sx: {
                                                    fontWeight: selectedBrdgeId === brdge.id ? 600 : 400,
                                                    color: selectedBrdgeId === brdge.id
                                                        ? theme.palette.secondary.main
                                                        : theme.palette.text.primary,
                                                    fontFamily: selectedBrdgeId === brdge.id
                                                        ? theme.typography.headingFontFamily
                                                        : theme.typography.fontFamily,
                                                }
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        {availableBrdges.length === 0 && (
                            <Box sx={{
                                mt: 2,
                                p: 3,
                                textAlign: 'center',
                                bgcolor: `${theme.palette.parchment.light}50`,
                                borderRadius: '8px',
                                border: `1px dashed ${theme.palette.divider}`,
                            }}>
                                <Typography sx={{
                                    color: theme.palette.text.secondary,
                                    fontStyle: 'italic'
                                }}>
                                    You don't have any available modules to add. Create a new module first.
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{
                        px: 3,
                        pb: 3,
                        pt: 2,
                        bgcolor: theme.palette.background.paper,
                        borderTop: `1px solid ${theme.palette.divider}10`,
                        position: 'relative',
                        zIndex: 1,
                        justifyContent: 'space-between',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '10%',
                            right: '10%',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
                        }
                    }}>
                        <Button
                            onClick={handleCloseAddModuleDialog}
                            variant="outlined"
                            color="secondary"
                            sx={{
                                color: theme.palette.text.secondary,
                                borderColor: `${theme.palette.divider}`,
                                '&:hover': {
                                    borderColor: theme.palette.secondary.main,
                                    color: theme.palette.secondary.main,
                                    bgcolor: `${theme.palette.secondary.main}08`,
                                },
                                fontWeight: 500,
                                px: 3,
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddModule}
                            disabled={!selectedBrdgeId}
                            variant="contained"
                            color="primary"
                            endIcon={<PlayArrowIcon fontSize="small" />}
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    bgcolor: theme.palette.primary.dark,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 8px ${theme.palette.primary.main}40`,
                                },
                                '&.Mui-disabled': {
                                    bgcolor: `${theme.palette.primary.main}40`,
                                    color: `${theme.palette.primary.contrastText}70`,
                                },
                                fontWeight: 600,
                                px: 3,
                                boxShadow: `0 2px 6px ${theme.palette.primary.main}30`,
                                transition: 'all 0.2s ease',
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
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            borderRadius: '12px',
                            boxShadow: theme.shadows[4],
                            border: `1px solid ${theme.palette.divider}`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${theme.textures.darkParchment})`,
                                backgroundSize: 'cover',
                                opacity: 0.1,
                                mixBlendMode: 'multiply',
                                zIndex: 0,
                            },
                            '& > *': {
                                position: 'relative',
                                zIndex: 1
                            }
                        }
                    }}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle sx={{
                        bgcolor: theme.palette.background.default,
                        color: theme.palette.error.main,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontFamily: theme.typography.headingFontFamily,
                        py: 2.5,
                        fontWeight: 600,
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '10%',
                            right: '10%',
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${theme.palette.error.main}50, transparent)`,
                        }
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: `${theme.palette.error.main}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: -2,
                                    left: -2,
                                    right: -2,
                                    bottom: -2,
                                    borderRadius: '50%',
                                    border: `1px solid ${theme.palette.error.main}30`,
                                    opacity: 0.7
                                }
                            }}>
                                <DeleteIcon sx={{ fontSize: 18, color: theme.palette.error.main }} />
                            </Box>
                            <Typography sx={{
                                fontFamily: theme.typography.headingFontFamily,
                                fontWeight: 600,
                            }}>
                                Remove Module
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, mt: 1 }}>
                        <Typography sx={{
                            fontFamily: theme.typography.fontFamily,
                            color: theme.palette.text.primary,
                            lineHeight: 1.6
                        }}>
                            Are you sure you want to remove this module from the course?
                            This won't delete the Brdge itself.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                        <Button
                            onClick={handleCancelDeleteModule}
                            variant="outlined"
                            sx={{
                                fontFamily: theme.typography.fontFamily,
                                color: theme.palette.text.secondary,
                                borderColor: theme.palette.divider,
                                '&:hover': {
                                    borderColor: theme.palette.secondary.main,
                                    backgroundColor: `${theme.palette.secondary.main}08`
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDeleteModule}
                            color="error"
                            variant="contained"
                            sx={{
                                fontFamily: theme.typography.fontFamily,
                                boxShadow: theme.shadows[2],
                                '&:hover': {
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add a scholarly divider between sections */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    sx={{
                        width: '100%',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        my: 4,
                        position: 'relative',
                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            top: '50%',
                            height: '1px',
                            width: '35%',
                            background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}40, transparent)`
                        },
                        '&::before': {
                            left: 0
                        },
                        '&::after': {
                            right: 0
                        }
                    }}
                >
                    <Box
                        component="img"
                        src={theme.textures.stampLogo}
                        alt=""
                        sx={{
                            width: '32px',
                            height: '32px',
                            opacity: 0.15,
                            filter: 'grayscale(0.5)'
                        }}
                    />
                </Box>
            </Box>
        </motion.div>
    );
}

export default EditCoursePage; 