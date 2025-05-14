import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    Divider,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    Chip,
    Switch,
    InputBase,
    Snackbar,
    Alert,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Collapse,
    FormControlLabel,
    LinearProgress,
    Paper,
    useTheme
} from '@mui/material';
import dotbridgeTheme from '../dotbridgeTheme';
import {
    Search, Plus, Lock, Globe, User, MessageSquare, LineChart, ChevronDown, Copy, Check, Trash2, BookOpen, GraduationCap, ChevronUp, Share, Edit, ChevronRight, ChevronLeft, ExternalLink, LogOut, Zap,
    HelpCircle, // Icon for Quiz
    MessageCircle, // Icon for Discussion/Guided Convo
    Clock, // Icon for timestamp
    AlertCircle // Icon for interruption
} from 'lucide-react';
import { api } from '../api';
import { getAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';
import BrdgeList from '../components/BrdgeList';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const createStyles = (theme) => ({
    pageContainer: {
        background: theme.palette.background.default,
        py: 4,
        px: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'visible',
        minHeight: 'calc(100vh - 64px)',
    },
    header: {
        color: theme.palette.text.primary,
        mb: 4,
        fontWeight: 600,
        textAlign: 'center',
        fontFamily: theme.typography.h4.fontFamily,
    },
    sectionHeader: {
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        fontWeight: 600,
        mb: 3,
        fontFamily: theme.typography.h5.fontFamily,
    },
    ctaBlock: {
        display: 'flex',
        gap: 2,
        mb: 4,
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
    },
    courseCard: {
        p: 3,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        mb: 2,
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: theme.shadows[1],
        '&:hover': {
            boxShadow: theme.shadows[3],
            borderColor: theme.palette.primary.light,
            transform: 'translateY(-2px)',
        },
    },
    bridgeUsageBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.75rem',
        py: 0.5,
        px: 1,
        borderRadius: theme.shape.borderRadius / 1.5,
        backgroundColor: theme.palette.primary.main + '1A',
        color: theme.palette.primary.dark,
        ml: 1,
    },
    marketplaceSection: {
        py: 5,
        px: { xs: 2, md: 4 },
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: theme.palette.neutral.light,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        mt: 4,
        position: 'relative',
    },
    marketplaceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        pb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    marketplaceGrid: {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
    },
    marketplaceCard: {
        p: 0,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: theme.shadows[3],
            borderColor: theme.palette.primary.light,
        },
    },
    bulkActionsBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1.5,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.neutral.light,
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
    },
    actionButton: {
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        fontWeight: 600,
    },
    statsCard: {
        p: 2,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
            borderColor: theme.palette.primary.light,
            boxShadow: theme.shadows[2],
        }
    },
    sectionContainer: {
        mb: 5,
        p: { xs: 2, sm: 3 },
        borderRadius: theme.shape.borderRadius * 1.5,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        position: 'relative',
    },
    listContainer: {
        p: { xs: 1, sm: 2 },
    },
});

const createSidebarStyles = (theme) => ({
    sidebar: {
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: 280,
        backgroundColor: theme.palette.background.paper + 'E6',
        backdropFilter: 'blur(10px)',
        borderLeft: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1250,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: theme.shadows[3],
        transform: 'translateX(100%)',
        pt: '64px',
    },
    toggleButton: {
        position: 'fixed',
        right: 15,
        top: 80,
        width: 36,
        height: 36,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease',
        zIndex: 1200,
        boxShadow: theme.shadows[2],
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            transform: 'scale(1.1)',
            borderColor: theme.palette.primary.light,
        }
    },
    content: {
        padding: theme.spacing(3),
        overflowY: 'auto',
        height: '100%',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
            background: theme.palette.neutral.mid,
            borderRadius: '3px',
            '&:hover': {
                background: theme.palette.neutral.dark,
            }
        }
    }
});

// --- Enhanced InfoSidebar Component ---
const InfoSidebar = ({ isOpen, onToggle, userStats, courses, navigate, theme }) => {
    const styles = createSidebarStyles(theme);
    const totalCourses = courses?.length || 0;
    const totalBridges = userStats?.brdges_created || 0;

    return (
        <>
            {/* Toggle Button */}
            <Box
                onClick={onToggle}
                sx={{
                    ...styles.toggleButton,
                    right: isOpen ? 295 : 15, // Adjust position based on sidebar width + padding
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', // Rotate arrow
                }}
                aria-label={isOpen ? "Close Info Panel" : "Open Info Panel"}
            >
                {/* Use ChevronRight consistently, rely on rotation */}
                <ChevronRight size={20} color={theme.palette.primary.main} />
            </Box>

            {/* Sidebar Panel */}
            <Box sx={{ ...styles.sidebar, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
                <Box sx={styles.content}>
                    {/* Welcome Section */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 1 }}>
                            🚀 Welcome to DotBridge!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            Your hub for creating interactive AI experiences from your video content. Let's get started!
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Key Sections Explained */}
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Dashboard Overview
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* My Flows */}
                        <Box>
                            <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BookOpen size={16} color={theme.palette.secondary.main} /> My Flows ({totalCourses})
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5 }}>
                                Organize your interactive 'Bridges' into logical sequences or learning paths. Think of them as chapters or topics.
                            </Typography>
                        </Box>
                        {/* My Bridges */}
                        <Box>
                            <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Zap size={16} color={theme.palette.secondary.main} /> My Bridges ({totalBridges} / {userStats?.brdges_limit ?? 'N/A'})
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5 }}>
                                These are your individual AI agents created from videos. Drag them into 'Flows' above!
                            </Typography>
                        </Box>
                        {/* Marketplace */}
                        <Box>
                            <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Globe size={16} color={theme.palette.secondary.main} /> Marketplace
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5 }}>
                                Discover pre-built Flows and Bridge templates shared by the community (coming soon!).
                            </Typography>
                        </Box>
                        {/* Stats */}
                        <Box>
                            <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LineChart size={16} color={theme.palette.secondary.main} /> Usage Stats
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5 }}>
                                Keep track of your created Bridges and AI interaction minutes used against your plan limits.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Quick Actions */}
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Plus size={16} />}
                            onClick={() => navigate('/create')}
                            size="small"
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Create New Bridge
                        </Button>
                        {/* Add "Create Flow" button later if needed */}
                    </Box>

                </Box> {/* End Content */}
            </Box> {/* End Sidebar Panel */}
        </>
    );
};
// --- End Enhanced InfoSidebar Component ---

const DraggableBridgeItem = ({ bridge, index, courseId, handleEdit, handleView, handleRemoveBridgeFromCourse, moveBridge, theme }) => {
    const ref = React.useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'BRIDGE',
        item: { index, id: bridge.id, courseId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'BRIDGE',
        hover: (item, monitor) => {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex || item.courseId !== courseId) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveBridge(dragIndex, hoverIndex, item.courseId);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <Box
            ref={ref}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                py: 1,
                px: 1.5,
                borderRadius: theme.shape.borderRadius / 1.5,
                backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
                opacity: isDragging ? 0.6 : 1,
                border: `1px solid ${isDragging ? theme.palette.primary.light : 'transparent'}`,
                cursor: 'move',
                '&:hover': { backgroundColor: theme.palette.action.hover }
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: theme.palette.text.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Zap size={16} color={theme.palette.text.secondary} />
                {index + 1}. {bridge.name}
                {bridge.shareable ? (
                    <Tooltip title="Public Bridge">
                        <Box sx={{ display: 'inline-flex' }}>
                            <Globe size={14} color={theme.palette.success.main} />
                        </Box>
                    </Tooltip>
                ) : (
                    <Tooltip title="Private Bridge">
                        <Box sx={{ display: 'inline-flex' }}>
                            <Lock size={14} color={theme.palette.text.disabled} />
                        </Box>
                    </Tooltip>
                )}
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View Bridge">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleView(null, { id: bridge.brdge_id || bridge.id, public_id: bridge.public_id });
                        }}
                        sx={{
                            color: theme.palette.text.secondary, padding: '4px',
                            '&:hover': { color: theme.palette.primary.main, backgroundColor: theme.palette.action.hover }
                        }}
                    >
                        <ExternalLink size={16} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Bridge">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(null, { id: bridge.brdge_id || bridge.id, public_id: bridge.public_id });
                        }}
                        sx={{
                            color: theme.palette.text.secondary, padding: '4px',
                            '&:hover': { color: theme.palette.primary.main, backgroundColor: theme.palette.action.hover }
                        }}
                    >
                        <Edit size={16} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Remove from Flow">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBridgeFromCourse(courseId, bridge.id);
                        }}
                        sx={{
                            color: theme.palette.text.secondary, padding: '4px',
                            '&:hover': { color: theme.palette.error.main, backgroundColor: theme.palette.error.main + '1A' }
                        }}
                    >
                        <Trash2 size={16} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

function DotBrdgeListPage() {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [bridges, setBridges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [marketplaceCourses, setMarketplaceCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteCourseDialogOpen, setDeleteCourseDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareCourseDialogOpen, setShareCourseDialogOpen] = useState(false);
    const [bridgeToDelete, setBridgeToDelete] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [bridgeToShare, setBridgeToShare] = useState(null);
    const [courseToShare, setCourseToShare] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('updated_at');
    const [orderDirection, setOrderDirection] = useState('desc');
    const [userStats, setUserStats] = useState({
        brdges_created: 0,
        brdges_limit: '1',
        minutes_used: 0,
        minutes_limit: 30
    });
    const [linkCopied, setLinkCopied] = useState(false);
    const [selectedBridges, setSelectedBridges] = useState([]);
    const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
    const [marketplaceExpanded, setMarketplaceExpanded] = useState(true);
    const [bridgeSelectionDialogOpen, setBridgeSelectionDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [bridgeSearchTerm, setBridgeSearchTerm] = useState('');
    const [draggedBridgeId, setDraggedBridgeId] = useState(null);
    const [dropTargetCourseId, setDropTargetCourseId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editedCourseName, setEditedCourseName] = useState('');
    const [savingState, setSavingState] = useState(false);
    const [courseLinkCopied, setCourseLinkCopied] = useState(false);
    const [unenrollDialogOpen, setUnenrollDialogOpen] = useState(false);
    const [courseToUnenroll, setCourseToUnenroll] = useState(null);
    const [enrolledCoursesExpanded, setEnrolledCoursesExpanded] = useState(true);
    const [yourCoursesExpanded, setYourCoursesExpanded] = useState(true);
    const [yourBridgesExpanded, setYourBridgesExpanded] = useState(true);
    const [expandedLogs, setExpandedLogs] = useState({});
    const [conversationLogs, setConversationLogs] = useState({});
    const [loadingLogs, setLoadingLogs] = useState({});

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getAuthToken();
                if (!token) {
                    navigate('/login');
                    return;
                }
                await Promise.all([
                    fetchBridges(),
                    fetchCourses(),
                    fetchMarketplaceCourses(),
                    fetchEnrolledCourses(),
                    fetchStats()
                ]);
            } catch (err) {
                console.error("Error loading page data:", err);
                setError("Failed to load data. Please try again later.");
                showSnackbar("Error loading data", "error");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [navigate]);

    const getBridgeLimit = (accountType) => {
        // Accept both 'premium' and 'pro' for the highest tier
        switch (accountType?.toLowerCase()) {
            case 'premium':
            case 'pro': return 'Unlimited'; // Added 'pro'
            case 'standard': return 10;
            default: return 1;
        }
    };

    const getMinutesLimit = (accountType) => {
        // Accept both 'premium' and 'pro' for the highest tier
        switch (accountType?.toLowerCase()) {
            case 'premium':
            case 'pro': return 1000; // Added 'pro'
            case 'standard': return 300;
            default: return 30;
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/user/stats');
            const accountType = response.data.account_type || 'free';
            setUserStats({
                ...response.data,
                brdges_limit: getBridgeLimit(accountType),
                minutes_limit: getMinutesLimit(accountType)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showSnackbar('Failed to fetch your courses', 'error');
            throw error;
        }
    };

    const fetchBridges = async () => {
        try {
            const response = await api.get('/brdges');
            setBridges(response.data.brdges || []);
        } catch (error) {
            console.error('Error fetching bridges:', error);
            setError('Failed to fetch Bridges');
            showSnackbar('Failed to fetch your Bridges', 'error');
            throw error;
        }
    };

    const fetchMarketplaceCourses = async () => {
        try {
            const response = await api.get('/courses/marketplace');
            setMarketplaceCourses(response.data.courses || []);
        } catch (error) {
            console.error('Error fetching marketplace courses:', error);
            showSnackbar('Failed to fetch marketplace courses', 'error');
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await api.get('/courses/enrolled');
            setEnrolledCourses(response.data.enrolled_courses || []);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            showSnackbar('Failed to fetch enrolled courses', 'error');
        }
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        const newDirection = isAsc ? 'desc' : 'asc';
        setOrderDirection(newDirection);
        setOrderBy(property);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredBridges = React.useMemo(() => {
        if (!bridges) return [];
        return bridges.filter(bridge =>
            bridge.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [bridges, searchTerm]);

    const sortedBridges = React.useMemo(() => {
        if (!filteredBridges) return [];

        const sortableItems = [...filteredBridges];

        sortableItems.sort((a, b) => {
            let compareA = a[orderBy];
            let compareB = b[orderBy];

            if (orderBy === 'name') {
                compareA = compareA?.toLowerCase() || '';
                compareB = compareB?.toLowerCase() || '';
            } else if (orderBy === 'status') {
                compareA = a.shareable ? 1 : 0;
                compareB = b.shareable ? 1 : 0;
            } else if (orderBy === 'created_at' || orderBy === 'updated_at') {
                compareA = new Date(compareA || 0);
                compareB = new Date(compareB || 0);
            }

            if (compareA < compareB) {
                return orderDirection === 'asc' ? -1 : 1;
            }
            if (compareA > compareB) {
                return orderDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sortableItems;
    }, [filteredBridges, orderBy, orderDirection]);

    const handleView = (e, bridge) => {
        if (e) e.stopPropagation();
        const publicIdShort = bridge.public_id?.substring(0, 6) || '';

        // Always use the viewBridge path with ID-UID format
        navigate(`/viewBridge/${bridge.id || bridge.brdge_id}-${publicIdShort}`);
    };

    const handleEdit = (e, bridge) => {
        if (e) e.stopPropagation();
        const publicIdShort = bridge.public_id?.substring(0, 6) || '';
        navigate(`/edit/${bridge.id}${publicIdShort ? `-${publicIdShort}` : ''}`);
    };

    const handleShare = (e, bridge) => {
        if (e) e.stopPropagation();
        setBridgeToShare(bridge);
        setShareDialogOpen(true);
    };

    const handleCloseShare = () => {
        setShareDialogOpen(false);
        setBridgeToShare(null);
        setLinkCopied(false);
    };

    const handleDelete = (e, bridge) => {
        if (e) e.stopPropagation();
        setBridgeToDelete(bridge);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!bridgeToDelete) return;
        setSavingState(true);
        try {
            await api.delete(`/brdges/${bridgeToDelete.id}`);
            setBridges(prevBridges => prevBridges.filter((b) => b.id !== bridgeToDelete.id));
            showSnackbar('Bridge deleted successfully', 'success');
            setDeleteDialogOpen(false);
            setBridgeToDelete(null);
            fetchStats();
        } catch (error) {
            showSnackbar('Failed to delete Bridge', 'error');
            console.error("Delete bridge error:", error);
        } finally {
            setSavingState(false);
        }
    };

    const isOverLimit = () => {
        if (!userStats) return false;

        // Only check for bridges being over limit since that's what matters for "Upgrade Plan" button
        const isBridgesOverLimit =
            userStats.brdges_limit !== 'Unlimited' &&
            parseInt(userStats.brdges_created || 0) > parseInt(userStats.brdges_limit || 0);

        return isBridgesOverLimit;
    };

    const getLimitExceededType = () => {
        if (!userStats) return '';
        if (userStats.brdges_limit !== 'Unlimited' && parseInt(userStats.brdges_created || 0) >= parseInt(userStats.brdges_limit || 0)) {
            return 'Bridge';
        }
        if (parseInt(userStats.minutes_used || 0) >= parseInt(userStats.minutes_limit || 0)) {
            return 'AI interaction minutes';
        }
        return '';
    };

    const canCreateBridge = () => {
        if (!userStats) return false;
        if (userStats.brdges_limit === 'Unlimited') return true;

        const currentLimit = parseInt(userStats.brdges_limit || 0);
        const currentCount = parseInt(userStats.brdges_created || 0);
        const underBridgeLimit = currentCount < currentLimit;
        return underBridgeLimit;
    };

    const handleCopyLink = () => {
        if (!bridgeToShare) return;
        const id = bridgeToShare.id || bridgeToShare.brdge_id;
        const publicIdShort = bridgeToShare.public_id?.substring(0, 6) || '';
        const shareableUrl = `${window.location.origin}/viewBridge/${id}-${publicIdShort}`;

        navigator.clipboard.writeText(shareableUrl).then(() => {
            setLinkCopied(true);
            showSnackbar('Bridge link copied!', 'success');
            setTimeout(() => setLinkCopied(false), 2500);
        }).catch(err => {
            showSnackbar('Failed to copy link', 'error');
            console.error('Copy link error:', err);
        });
    };

    const handleShareToggle = async () => {
        if (!bridgeToShare) return;
        setSavingState(true);
        try {
            const response = await api.post(`/brdges/${bridgeToShare.id}/toggle_shareable`);
            const newShareableStatus = response.data.shareable;

            setBridges(prevBridges => prevBridges.map(b =>
                b.id === bridgeToShare.id ? { ...b, shareable: newShareableStatus } : b
            ));
            setBridgeToShare(prev => ({ ...prev, shareable: newShareableStatus }));

            showSnackbar(
                `Bridge is now ${newShareableStatus ? 'public' : 'private'}`,
                'success'
            );

            if (newShareableStatus && !bridgeToShare.shareable) {
                setTimeout(handleCopyLink, 300);
            }
        } catch (error) {
            console.error('Error toggling Bridge share status:', error);
            showSnackbar('Failed to update sharing settings', 'error');
        } finally {
            setSavingState(false);
        }
    };

    const handleCreateClick = () => {
        if (isOverLimit()) {
            const limitType = getLimitExceededType();
            showSnackbar(
                `You've reached your ${limitType} limit. Upgrade your plan for more!`,
                'warning'
            );
            navigate('/profile');
        } else {
            navigate('/create');
        }
    };

    const handleCreateCourse = async () => {
        setSavingState(true);
        try {
            const response = await api.post('/courses', {
                name: "New Flow",
                description: "Add Bridges to organize them."
            });
            setCourses([...courses, response.data.course]);
            showSnackbar('Flow created. Add Bridges to it!', 'success');
            setTimeout(() => {
                document.getElementById(`course-${response.data.course.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        } catch (error) {
            console.error('Error creating flow:', error);
            showSnackbar('Failed to create flow', 'error');
        } finally {
            setSavingState(false);
        }
    };

    const handleEditCourse = (course) => {
        navigate(`/edit-course/${course.id}-${course.public_id?.substring(0, 6) || ''}`);
    };

    const handleViewCourse = (course) => {
        navigate(`/c/${course.public_id}`);
    };

    const handleShareCourse = (course) => {
        setCourseToShare(course);
        setShareCourseDialogOpen(true);
    };

    const handleCloseCourseShare = () => {
        setShareCourseDialogOpen(false);
        setCourseToShare(null);
        setCourseLinkCopied(false);
    };

    const handleDeleteCourse = (course) => {
        setCourseToDelete(course);
        setDeleteCourseDialogOpen(true);
    };

    const confirmDeleteCourse = async () => {
        if (!courseToDelete) return;
        setSavingState(true);
        try {
            await api.delete(`/courses/${courseToDelete.id}`);
            setCourses(prevCourses => prevCourses.filter(c => c.id !== courseToDelete.id));
            setDeleteCourseDialogOpen(false);
            setCourseToDelete(null);
            showSnackbar('Flow deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting flow:', error);
            showSnackbar('Failed to delete flow', 'error');
        } finally {
            setSavingState(false);
        }
    };

    const handleCopyCourseLink = () => {
        if (!courseToShare) return;
        const shareableUrl = `${window.location.origin}/c/${courseToShare.public_id}`;
        navigator.clipboard.writeText(shareableUrl).then(() => {
            setCourseLinkCopied(true);
            showSnackbar('Flow link copied!', 'success');
            setTimeout(() => setCourseLinkCopied(false), 2500);
        }).catch(err => {
            showSnackbar('Failed to copy link', 'error');
            console.error('Copy flow link error:', err);
        });
    };

    const handleCourseShareToggle = async () => {
        if (!courseToShare) return;
        setSavingState(true);
        try {
            const response = await api.post(`/courses/${courseToShare.id}/toggle_shareable`);
            const newShareableStatus = response.data.shareable;

            setCourses(prevCourses => prevCourses.map(c =>
                c.id === courseToShare.id ? { ...c, shareable: newShareableStatus } : c
            ));
            setCourseToShare(prev => ({ ...prev, shareable: newShareableStatus }));

            showSnackbar(
                `Flow is now ${newShareableStatus ? 'public' : 'private'}`,
                'success'
            );

            if (newShareableStatus && !courseToShare.shareable) {
                setTimeout(handleCopyCourseLink, 300);
            }
        } catch (error) {
            console.error('Error toggling flow share status:', error);
            showSnackbar('Failed to update flow sharing settings', 'error');
        } finally {
            setSavingState(false);
        }
    };

    const handleAddBridgeToCourse = async (courseId, bridgeId) => {
        setSavingState(true);
        try {
            const response = await api.post(`/courses/${courseId}/modules`, { brdge_id: bridgeId });

            setCourses(prevCourses => {
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        const bridge = bridges.find(b => b.id === bridgeId);
                        if (bridge) {
                            const newCourseModule = {
                                id: response.data.course_module.id,
                                brdge_id: bridge.id,
                                name: bridge.name,
                                position: response.data.course_module.position,
                                shareable: bridge.shareable,
                                public_id: bridge.public_id,
                            };
                            const existingModules = course.modules || [];
                            if (!existingModules.some(m => m.id === newCourseModule.id)) {
                                return {
                                    ...course,
                                    modules: [...existingModules, newCourseModule].sort((a, b) => a.position - b.position)
                                };
                            }
                        }
                    }
                    return course;
                });
            });
            showSnackbar('Bridge added to flow', 'success');
        } catch (error) {
            console.error('Error adding Bridge to flow:', error);
            if (error.response && error.response.status === 409) {
                showSnackbar('Bridge is already in this flow.', 'info');
            } else {
                showSnackbar('Failed to add Bridge to flow', 'error');
            }
        } finally {
            setSavingState(false);
        }
    };

    const handleRemoveBridgeFromCourse = async (courseId, moduleId) => {
        setSavingState(true);
        try {
            await api.delete(`/courses/${courseId}/modules/${moduleId}`);

            setCourses(prevCourses => {
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        return {
                            ...course,
                            modules: (course.modules || []).filter(module => module.id !== moduleId)
                        };
                    }
                    return course;
                });
            });
            showSnackbar('Bridge removed from course', 'success');
        } catch (error) {
            console.error('Error removing Bridge from course:', error);
            showSnackbar('Failed to remove Bridge from course', 'error');
        } finally {
            setSavingState(false);
        }
    };

    const handleReorderBridges = async (courseId, moduleOrder) => {
        setSavingState(true);
        try {
            await api.put(`/courses/${courseId}/modules/reorder`, { modules: moduleOrder });

            showSnackbar('Bridges reordered successfully', 'success');

        } catch (error) {
            console.error('Error reordering Bridges:', error);
            showSnackbar('Failed to reorder Bridges', 'error');
        } finally {
            setSavingState(false);
        }
    };

    const moveBridge = (dragIndex, hoverIndex, courseId) => {
        const course = courses.find(c => c.id === courseId);
        if (!course || !course.modules) return;

        const updatedModules = [...course.modules];
        const [draggedItem] = updatedModules.splice(dragIndex, 1);
        updatedModules.splice(hoverIndex, 0, draggedItem);

        const moduleOrder = updatedModules.map((module, index) => ({
            id: module.id,
            position: index + 1
        }));

        setCourses(prevCourses => {
            return prevCourses.map(c => {
                if (c.id === courseId) {
                    return {
                        ...c,
                        modules: updatedModules.map((m, index) => ({ ...m, position: index + 1 }))
                    };
                }
                return c;
            });
        });

        handleReorderBridges(courseId, moduleOrder);
    };

    const handleBridgeSelect = (bridgeId) => {
        setSelectedBridges(prev =>
            prev.includes(bridgeId)
                ? prev.filter(id => id !== bridgeId)
                : [...prev, bridgeId]
        );
    };

    const handleBatchDelete = () => {
        if (selectedBridges.length > 0) {
            setBatchDeleteDialogOpen(true);
        } else {
            showSnackbar('Select Bridges to delete first.', 'info');
        }
    };

    const confirmBatchDelete = async () => {
        if (selectedBridges.length === 0) return;
        setSavingState(true);
        try {
            await Promise.all(
                selectedBridges.map(bridgeId => api.delete(`/brdges/${bridgeId}`))
            );

            setBridges(prev => prev.filter(b => !selectedBridges.includes(b.id)));
            showSnackbar(`${selectedBridges.length} Bridge${selectedBridges.length !== 1 ? 's' : ''} deleted`, 'success');
            setSelectedBridges([]);
            setBatchDeleteDialogOpen(false);
            fetchStats();
        } catch (error) {
            showSnackbar('Failed to delete some Bridges', 'error');
            console.error("Batch delete error:", error);
        } finally {
            setSavingState(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedBridges.length === filteredBridges.length) {
            setSelectedBridges([]);
        } else {
            setSelectedBridges(filteredBridges.map(b => b.id));
        }
    };

    const clearSelection = () => {
        setSelectedBridges([]);
    };

    const handleOpenBridgeSelection = (course) => {
        setSelectedCourse(course);
        setBridgeSelectionDialogOpen(true);
        setBridgeSearchTerm('');
    };

    const handleAddSelectedBridges = () => {
        setBridgeSelectionDialogOpen(false);
    };

    const filteredBridgesForSelection = React.useMemo(() => {
        if (!bridges || !selectedCourse) return [];
        return bridges.filter(bridge => {
            const alreadyInCourse = selectedCourse?.modules?.some(
                module => module.brdge_id === bridge.id
            );
            return !alreadyInCourse &&
                bridge.name.toLowerCase().includes(bridgeSearchTerm.toLowerCase());
        });
    }, [bridges, selectedCourse, bridgeSearchTerm]);

    const handleBridgeDragStart = (e, bridgeId) => {
        setDraggedBridgeId(bridgeId);
        e.dataTransfer.setData('bridgeId', bridgeId);
        if (e.target.style) e.target.style.opacity = '0.5';
    };

    const handleBridgeDragEnd = (e) => {
        setDraggedBridgeId(null);
        setDropTargetCourseId(null);
        if (e.target.style) e.target.style.opacity = '1';
    };

    const handleDragOverCourse = (e, courseId) => {
        e.preventDefault();
        setDropTargetCourseId(courseId);
    };

    const handleDropOnCourse = (e, courseId) => {
        e.preventDefault();
        const bridgeId = e.dataTransfer.getData('bridgeId') || draggedBridgeId;
        if (bridgeId) {
            const course = courses.find(c => c.id === courseId);
            const alreadyInCourse = course?.modules?.some(m => m.brdge_id === bridgeId);
            if (!alreadyInCourse) {
                handleAddBridgeToCourse(courseId, bridgeId);
            } else {
                showSnackbar('Bridge is already in this course.', 'info');
            }
        }
        setDraggedBridgeId(null);
        setDropTargetCourseId(null);
    };

    const handleStartEditingCourse = (e, course) => {
        e.stopPropagation();
        setEditingCourseId(course.id);
        setEditedCourseName(course.name);
    };

    const handleCourseNameChange = (e) => {
        setEditedCourseName(e.target.value);
    };

    const handleSaveCourseName = async (e, courseId) => {
        if (e) e.preventDefault();
        if (!editedCourseName.trim()) {
            showSnackbar('Course name cannot be empty', 'warning');
            return;
        }
        setSavingState(true);
        try {
            await api.put(`/courses/${courseId}`, { name: editedCourseName });
            setCourses(prevCourses => prevCourses.map(course =>
                course.id === courseId ? { ...course, name: editedCourseName } : course
            ));
            setEditingCourseId(null);
            setEditedCourseName('');
            showSnackbar('Course name updated', 'success');
        } catch (error) {
            console.error('Error updating course name:', error);
            showSnackbar('Failed to update course name', 'error');
        } finally {
            setSavingState(false);
        }
    };

    const handleCancelEditingCourse = () => {
        setEditingCourseId(null);
        setEditedCourseName('');
    };

    const handleUnenrollClick = (course) => {
        setCourseToUnenroll(course);
        setUnenrollDialogOpen(true);
    };

    const confirmUnenroll = async () => {
        if (!courseToUnenroll) return;
        setSavingState(true);
        try {
            await api.post(`/courses/${courseToUnenroll.id}/unenroll`);
            setEnrolledCourses(prev => prev.filter(c => c.id !== courseToUnenroll.id));
            setUnenrollDialogOpen(false);
            setCourseToUnenroll(null);
            showSnackbar('Successfully unenrolled from course', 'success');
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            showSnackbar('Failed to unenroll from course', 'error');
        } finally {
            setSavingState(false);
        }
    };

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

    const fetchBridgeConversationLogs = async (bridgeId) => {
        if (conversationLogs[bridgeId]) {
            setLoadingLogs(prev => ({ ...prev, [bridgeId]: false }));
            return;
        }
        setLoadingLogs(prev => ({ ...prev, [bridgeId]: true }));
        try {
            const response = await api.get(`/brdges/${bridgeId}/conversation-logs`);
            const logs = response.data.conversations || [];
            const groupedLogs = {};

            logs.forEach(log => {
                let displayIdentifier = 'Unknown User';
                let userIdKey = 'unknown_user';

                if (log.viewer_user_id) {
                    displayIdentifier = `User #${log.viewer_user_id}`;
                    userIdKey = `user_${log.viewer_user_id}`;
                } else if (log.anonymous_id) {
                    displayIdentifier = `Anon ${log.anonymous_id.substring(0, 6)}...`;
                    userIdKey = `anon_${log.anonymous_id}`;
                }

                if (!groupedLogs[userIdKey]) {
                    groupedLogs[userIdKey] = {
                        userId: log.viewer_user_id || null,
                        anonymousId: log.anonymous_id || null,
                        displayId: displayIdentifier,
                        messages: [],
                        totalDurationSeconds: 0,
                        totalMessages: 0,
                        userMessageCount: 0,
                        agentMessageCount: 0,
                        firstActivity: log.timestamp,
                        lastActivity: log.timestamp
                    };
                }
                const session = groupedLogs[userIdKey];
                session.messages.push(log);
                if (log.role === 'agent' && log.duration_seconds) {
                    session.totalDurationSeconds += log.duration_seconds;
                }
                session.totalMessages++;
                if (log.role === 'user') session.userMessageCount++; else session.agentMessageCount++;
                const currentTimestamp = new Date(log.timestamp);
                if (currentTimestamp < new Date(session.firstActivity)) session.firstActivity = log.timestamp;
                if (currentTimestamp > new Date(session.lastActivity)) session.lastActivity = log.timestamp;
            });

            const userSessions = Object.values(groupedLogs).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
            setConversationLogs(prev => ({ ...prev, [bridgeId]: userSessions }));

        } catch (error) {
            console.error(`Error fetching logs for bridge ${bridgeId}:`, error);
            showSnackbar('Failed to fetch conversation data', 'error');
        } finally {
            setTimeout(() => setLoadingLogs(prev => ({ ...prev, [bridgeId]: false })), 100);
        }
    };

    const toggleLogExpansion = (bridgeId) => {
        const isExpanded = expandedLogs[bridgeId];
        setExpandedLogs(prev => ({
            ...prev,
            [bridgeId]: !isExpanded
        }));

        // Fetch logs only if expanding and not already loading or loaded
        if (!isExpanded && !loadingLogs[bridgeId] && !conversationLogs[bridgeId]) {
            fetchBridgeConversationLogs(bridgeId);
        }
    };

    // --- Updated ChatHistoryDisplay Component ---
    const ChatHistoryDisplay = ({ messages = [], theme, filterText = "" }) => {
        const filteredMessages = messages.filter(msg =>
            msg.message.toLowerCase().includes(filterText.toLowerCase())
        );

        if (!filteredMessages || filteredMessages.length === 0) {
            return <Typography sx={{ p: 2, fontStyle: 'italic', color: 'text.disabled', textAlign: 'center' }}>
                {filterText ? 'No messages match your filter.' : 'No messages in this session.'}
            </Typography>;
        }

        // Helper to get engagement icon
        const getEngagementIcon = (log) => {
            // Assumes log.engagement_type might exist
            switch (log.engagement_type) {
                case 'quiz': return <HelpCircle size={14} style={{ marginLeft: '4px', color: theme.palette.info.main }} />;
                case 'discussion':
                case 'guided_conversation': return <MessageCircle size={14} style={{ marginLeft: '4px', color: theme.palette.info.main }} />;
                default: return null;
            }
        };


        return (
            <Box sx={{ maxHeight: '350px', overflowY: 'auto', p: 2, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
                {filteredMessages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    const engagementIcon = !isUser ? getEngagementIcon(msg) : null;
                    const tooltipTitle = msg.engagement_id ? `Engagement ID: ${msg.engagement_id}` : (msg.context_used ? `Context: ${msg.context_used}` : '');

                    return (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: isUser ? 'flex-end' : 'flex-start',
                                mb: 1.5,
                            }}
                        >
                            <Tooltip title={tooltipTitle} placement={isUser ? "left" : "right"} arrow disableHoverListener={!tooltipTitle}>
                                <Box
                                    sx={{
                                        maxWidth: '80%',
                                        p: 1.5,
                                        borderRadius: 2,
                                        // **** Use a lighter blue for user, keep agent light grey ****
                                        bgcolor: isUser ? theme.palette.primary.light + '30' : theme.palette.neutral.light, // Adding opacity too
                                        // **** Revert user text color to contrast with light blue ****
                                        color: isUser ? theme.palette.primary.dark : theme.palette.text.primary, // Use dark text on light blue
                                        boxShadow: theme.shadows[1],
                                        position: 'relative',
                                        border: `1px solid ${isUser ? theme.palette.primary.light : theme.palette.divider}`, // Add light border to user bubble too
                                    }}
                                >
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                                        {msg.message}
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1, opacity: 0.8,
                                        // **** Adjust user timestamp color for light blue bg ****
                                        color: isUser ? theme.palette.primary.dark : 'inherit' // Dark text for timestamp too
                                    }}>
                                        {/* Video Timestamp (conditional) */}
                                        {msg.video_timestamp && (
                                            <Typography variant="caption" sx={{ mr: 0.5, fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center' }}>
                                                <Clock size={12} style={{ marginRight: '3px' }} /> {msg.video_timestamp}
                                            </Typography>
                                        )}
                                        {/* Wall Clock Time */}
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </Typography>
                                        {/* Agent Duration */}
                                        {msg.role === 'agent' && msg.duration_seconds > 0 && (
                                            <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                                                ({msg.duration_seconds.toFixed(1)}s)
                                            </Typography>
                                        )}
                                        {/* Interruption Indicator */}
                                        {msg.was_interrupted && (
                                            <Tooltip title="Interrupted">
                                                {/* Adjust interrupt icon color for user messages */}
                                                <AlertCircle size={14} style={{ marginLeft: '4px', color: isUser ? theme.palette.warning.dark : theme.palette.warning.main }} />
                                            </Tooltip>
                                        )}
                                        {/* Engagement Indicator */}
                                        {engagementIcon}
                                    </Box>
                                </Box>
                            </Tooltip>
                        </Box>
                    );
                })}
            </Box>
        );
    };
    // --- End ChatHistoryDisplay Component ---

    // --- Modify BridgeAnalytics Component ---
    const BridgeAnalytics = ({ bridgeId, theme }) => {
        const isLoading = loadingLogs[bridgeId];
        const sessions = conversationLogs[bridgeId] || [];
        const [expandedSessionId, setExpandedSessionId] = useState(null);
        const [filterText, setFilterText] = useState(""); // State for filtering

        const handleSessionToggle = (sessionId) => {
            setExpandedSessionId(prevId => (prevId === sessionId ? null : sessionId));
        };

        if (isLoading) {
            return (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <CircularProgress size={24} sx={{ color: theme.palette.primary.main, my: 1 }} />
                    <Typography variant="caption" display="block" color="text.secondary">Loading conversation data...</Typography>
                </Box>
            );
        }
        if (!isLoading && sessions.length === 0) {
            return (
                <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary', bgcolor: 'neutral.light', borderRadius: 1, m: 1 }}>
                    <MessageSquare size={20} style={{ marginBottom: '8px', color: theme.palette.text.disabled }} />
                    <Typography variant="body2">No conversation data available for this Bridge yet.</Typography>
                </Box>
            );
        }

        const totalSessions = sessions.length;
        const totalMessages = sessions.reduce((sum, s) => sum + s.totalMessages, 0);
        const totalAgentMessages = sessions.reduce((sum, s) => sum + s.agentMessageCount, 0);
        const totalDurationMinutes = sessions.reduce((sum, s) => sum + s.totalDurationSeconds, 0) / 60;

        // Calculate Session Duration (first to last message)
        const calculateSessionDuration = (sessionMessages) => {
            if (!sessionMessages || sessionMessages.length < 2) return 'N/A';
            const firstMsgTime = new Date(sessionMessages[0].timestamp);
            const lastMsgTime = new Date(sessionMessages[sessionMessages.length - 1].timestamp);
            const durationMs = lastMsgTime - firstMsgTime;
            const durationMinutes = durationMs / (1000 * 60);
            if (durationMinutes < 1) return '< 1 min';
            return `${Math.round(durationMinutes)} min`;
        };

        return (
            <Box sx={{ p: 1.5, borderTop: `1px solid ${theme.palette.divider}`, mt: 1, bgcolor: theme.palette.background.default }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LineChart size={18} /> Session Analytics
                </Typography>

                {/* Aggregate Stats */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {/* ... (Stat cards remain the same) ... */}
                    <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', bgcolor: 'neutral.lightest' }}>
                            <Typography variant="caption" color="text.secondary" display="block">Total Sessions</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalSessions}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', bgcolor: 'neutral.lightest' }}>
                            <Typography variant="caption" color="text.secondary" display="block">Total Messages</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalMessages}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', bgcolor: 'neutral.lightest' }}>
                            <Typography variant="caption" color="text.secondary" display="block">Agent Messages</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalAgentMessages}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', bgcolor: 'neutral.lightest' }}>
                            <Typography variant="caption" color="text.secondary" display="block">Talk Time</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalDurationMinutes.toFixed(1)} <small>min</small></Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Session Table */}
                <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.neutral.light }}>
                                <TableCell sx={{ fontWeight: 500 }}>User</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 500 }}>Messages (Agent/User)</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 500 }}>Talk Time</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 500 }}>Last Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sessions.map((session, index) => {
                                const sessionId = session.userId || session.anonymousId || index;
                                const isSessionExpanded = expandedSessionId === sessionId;
                                return (
                                    <React.Fragment key={sessionId}>
                                        {/* Clickable User Session Row */}
                                        <TableRow
                                            hover
                                            onClick={() => handleSessionToggle(sessionId)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:last-child td, &:last-child th': { border: isSessionExpanded ? 0 : undefined },
                                                bgcolor: isSessionExpanded ? theme.palette.action.selected : 'inherit', // Highlight expanded row header
                                            }}
                                        >
                                            <TableCell sx={{ py: 0.5 }}>
                                                <Chip
                                                    icon={<User size={14} style={{ marginLeft: '4px' }} />}
                                                    label={session.displayId}
                                                    size="small"
                                                    variant={isSessionExpanded ? "filled" : "outlined"} // Change chip style on expand
                                                    color={isSessionExpanded ? "primary" : "default"}
                                                    sx={{ bgcolor: isSessionExpanded ? undefined : 'background.paper' }}
                                                />
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 0.5 }}>
                                                <Tooltip title={`Agent: ${session.agentMessageCount}, User: ${session.userMessageCount}`}>
                                                    <span>{session.totalMessages}</span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 0.5 }}>
                                                {(session.totalDurationSeconds / 60).toFixed(1)} min
                                            </TableCell>
                                            <TableCell align="right" sx={{ py: 0.5 }}>
                                                {new Date(session.lastActivity).toLocaleDateString()} {new Date(session.lastActivity).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                            </TableCell>
                                        </TableRow>
                                        {/* Collapsible Row for Chat History */}
                                        <TableRow>
                                            <TableCell style={{ padding: 0, borderBottom: 'none' }} colSpan={4}>
                                                <Collapse in={isSessionExpanded} timeout="auto" unmountOnExit sx={{ bgcolor: 'background.paper' }}>
                                                    {/* Filter Input */}
                                                    <Box sx={{ p: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            variant="outlined"
                                                            placeholder="Filter messages..."
                                                            value={filterText}
                                                            onChange={(e) => setFilterText(e.target.value)}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Search size={16} color={theme.palette.text.secondary} />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    </Box>
                                                    <ChatHistoryDisplay
                                                        messages={session.messages}
                                                        theme={theme}
                                                        filterText={filterText} // Pass filter text
                                                    />
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };
    // --- End BridgeAnalytics Component Modification ---

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={styles.pageContainer}>
                <Container maxWidth="xl">
                    <Typography variant="h4" sx={styles.header}>
                        Your DotBridge Hub
                    </Typography>

                    <Box sx={{ mb: 4, pb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Tooltip title="Flows group your Bridges for structured delivery.">
                                    <Box sx={styles.statsCard}>
                                        <Box sx={{
                                            height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            bgcolor: theme.palette.primary.main + '1A', borderRadius: '50%',
                                        }}>
                                            <BookOpen size={20} color={theme.palette.primary.main} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Flows Created</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                                {courses.length}
                                                <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>total</Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Tooltip title="Interactive video agents you've created.">
                                    <Box sx={styles.statsCard}>
                                        <Box sx={{
                                            height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            bgcolor: theme.palette.primary.main + '1A', borderRadius: '50%',
                                        }}>
                                            <Zap size={20} color={theme.palette.primary.main} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Bridges Created</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                                {userStats.brdges_created}
                                                <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
                                                    {userStats.brdges_limit === 'Unlimited' ? '/ ∞' : `/ ${userStats.brdges_limit}`}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Tooltip title="AI interaction minutes used across your Bridges.">
                                    <Box sx={styles.statsCard}>
                                        <Box sx={{
                                            height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            bgcolor: theme.palette.primary.main + '1A', borderRadius: '50%',
                                        }}>
                                            <MessageSquare size={20} color={theme.palette.primary.main} />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">AI Minutes Used</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                                {userStats.minutes_used}
                                                <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>/ {userStats.minutes_limit}</Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            </Grid>
                        </Grid>

                        {isOverLimit() && (
                            <Alert severity="warning" sx={{ mt: 2 }} action={
                                <Button color="inherit" size="small" onClick={() => navigate('/profile')}>Upgrade</Button>
                            }>
                                You've reached your {getLimitExceededType()} limit. Upgrade your plan for more.
                            </Alert>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search Bridges & Flows..."
                            value={searchTerm}
                            onChange={handleSearch}
                            variant="outlined"
                            size="small"
                            sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 300 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} color={theme.palette.text.secondary} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Button
                                variant="contained"
                                startIcon={<Plus size={18} />}
                                onClick={handleCreateClick}
                                disabled={!canCreateBridge() || savingState}
                                sx={styles.actionButton}
                            >
                                {isOverLimit() ? 'Upgrade Plan' : 'Create Bridge'}
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<BookOpen size={18} />}
                                onClick={handleCreateCourse}
                                disabled={savingState}
                                sx={styles.actionButton}
                            >
                                New Flow
                            </Button>
                        </Box>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box sx={styles.sectionContainer}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5" sx={styles.sectionHeader}>
                                        <BookOpen size={22} style={{ color: theme.palette.primary.main }} />
                                        Enrolled Flows
                                    </Typography>
                                    <IconButton onClick={() => setEnrolledCoursesExpanded(!enrolledCoursesExpanded)} size="small">
                                        {enrolledCoursesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </IconButton>
                                </Box>
                                <Collapse in={enrolledCoursesExpanded} timeout="auto" unmountOnExit>
                                    {enrolledCourses.length === 0 ? (
                                        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'neutral.light', borderRadius: 1 }}>
                                            <Typography color="text.secondary" sx={{ mb: 2 }}>You haven't enrolled in any flows yet.</Typography>
                                            <Button variant="outlined" onClick={() => navigate('/marketplace')}>Browse Marketplace</Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {enrolledCourses.map(course => (
                                                <Box key={course.id} sx={{ ...styles.courseCard, p: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                        <Box>
                                                            <Typography variant="h6" sx={{ fontWeight: 500 }}>{course.name}</Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, mb: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={course.enrollment?.progress || 0}
                                                                    sx={{ flexGrow: 1, height: 6, borderRadius: 1 }}
                                                                    color="primary"
                                                                />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {Math.round(course.enrollment?.progress || 0)}%
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="caption" color="text.disabled">
                                                                By: {course.created_by || 'Unknown Creator'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            <Tooltip title="View Flow">
                                                                <IconButton size="small" onClick={() => navigate(`/c/${course.public_id}`)} sx={{ '&:hover': { color: 'primary.main' } }}>
                                                                    <ExternalLink size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Unenroll">
                                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleUnenrollClick(course); }} sx={{ '&:hover': { color: 'error.main' } }}>
                                                                    <LogOut size={18} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                    {course.modules && course.modules.length > 0 && (
                                                        <Box sx={{ pl: 1, mt: 1, borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
                                                            {[...course.modules]
                                                                .sort((a, b) => a.position - b.position)
                                                                .slice(0, 3)
                                                                .map((module) => (
                                                                    <Typography
                                                                        key={module.id}
                                                                        variant="body2"
                                                                        onClick={() => navigate(`/viewBridge/${module.brdge_id}-${module.public_id?.substring(0, 6) || ''}`)}
                                                                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                                                    >
                                                                        <Zap size={14} color="text.secondary" />
                                                                        {module.name}
                                                                    </Typography>
                                                                ))}
                                                            {course.modules.length > 3 && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5 }}>
                                                                    ...and {course.modules.length - 3} more
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Collapse>
                            </Box>

                            <Box sx={styles.sectionContainer}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5" sx={styles.sectionHeader}>
                                        <BookOpen size={22} style={{ color: theme.palette.primary.main }} />
                                        My Flows
                                    </Typography>
                                    <IconButton onClick={() => setYourCoursesExpanded(!yourCoursesExpanded)} size="small">
                                        {yourCoursesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </IconButton>
                                </Box>
                                <Collapse in={yourCoursesExpanded} timeout="auto" unmountOnExit>
                                    {courses.length === 0 ? (
                                        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'neutral.light', borderRadius: 1 }}>
                                            <Typography color="text.secondary" sx={{ mb: 2 }}>You haven't created any flows yet.</Typography>
                                            <Button variant="outlined" onClick={handleCreateCourse}>Create First Flow</Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {courses.map(course => (
                                                <Box
                                                    key={course.id}
                                                    id={`course-${course.id}`}
                                                    sx={{
                                                        ...styles.courseCard,
                                                        p: 2,
                                                        borderColor: dropTargetCourseId === course.id ? theme.palette.primary.main : theme.palette.divider,
                                                        borderWidth: dropTargetCourseId === course.id ? '2px' : '1px',
                                                        boxShadow: dropTargetCourseId === course.id ? theme.shadows[3] : theme.shadows[1],
                                                    }}
                                                    onDragOver={(e) => handleDragOverCourse(e, course.id)}
                                                    onDrop={(e) => handleDropOnCourse(e, course.id)}
                                                    onDragLeave={() => setDropTargetCourseId(null)}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                                                            {editingCourseId === course.id ? (
                                                                <Box component="form" onSubmit={(e) => handleSaveCourseName(e, course.id)} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <TextField
                                                                        value={editedCourseName}
                                                                        onChange={handleCourseNameChange}
                                                                        autoFocus
                                                                        size="small"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        sx={{ '.MuiInputBase-root': { bgcolor: 'background.default' } }}
                                                                    />
                                                                    <IconButton type="submit" size="small" sx={{ color: 'success.main' }}><Check size={16} /></IconButton>
                                                                    <IconButton onClick={handleCancelEditingCourse} size="small" sx={{ color: 'text.disabled' }}><Trash2 size={16} /></IconButton>
                                                                </Box>
                                                            ) : (
                                                                <Typography
                                                                    variant="h6"
                                                                    onClick={(e) => handleStartEditingCourse(e, course)}
                                                                    sx={{ fontWeight: 500, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                                                >
                                                                    {course.name}
                                                                </Typography>
                                                            )}
                                                            <Typography variant="caption" color="text.disabled">
                                                                {course.modules?.length || 0} bridge{course.modules?.length !== 1 ? 's' : ''} | Last updated: {new Date(course.updated_at || Date.now()).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                                            <Tooltip title="View Flow">
                                                                <IconButton size="small" onClick={() => handleViewCourse(course)} sx={{ '&:hover': { color: 'primary.main' } }}><ExternalLink size={16} /></IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit Flow Details">
                                                                <IconButton size="small" onClick={() => handleEditCourse(course)} sx={{ '&:hover': { color: 'primary.main' } }}><Edit size={16} /></IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={course.shareable ? "Public Flow - Manage Sharing" : "Private Flow - Manage Sharing"}>
                                                                <IconButton size="small" onClick={() => handleShareCourse(course)} sx={{ color: course.shareable ? 'success.main' : 'text.disabled', '&:hover': { color: 'primary.main' } }}>
                                                                    {course.shareable ? <Globe size={16} /> : <Lock size={16} />}
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Flow">
                                                                <IconButton size="small" onClick={() => handleDeleteCourse(course)} sx={{ '&:hover': { color: 'error.main' } }}><Trash2 size={16} /></IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        mb: 1.5, mt: 1, borderTop: `1px solid ${theme.palette.divider}`, pt: 1.5
                                                    }}>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Zap size={16} /> Bridges in Flow
                                                        </Typography>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<Plus size={14} />}
                                                            onClick={() => handleOpenBridgeSelection(course)}
                                                            sx={{ py: 0.5, px: 1, fontSize: '0.75rem' }}
                                                        >
                                                            Add Bridge
                                                        </Button>
                                                    </Box>

                                                    {course.modules && course.modules.length > 0 ? (
                                                        <Box sx={{ pl: 0 }}>
                                                            {course.modules.map((module, index) => (
                                                                <DraggableBridgeItem
                                                                    key={module.id}
                                                                    bridge={module}
                                                                    index={index}
                                                                    courseId={course.id}
                                                                    handleEdit={handleEdit}
                                                                    handleView={handleView}
                                                                    handleRemoveBridgeFromCourse={handleRemoveBridgeFromCourse}
                                                                    moveBridge={moveBridge}
                                                                    theme={theme}
                                                                />
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'neutral.light', borderRadius: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                No Bridges added yet. Drag Bridges here or click "Add Bridge".
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Collapse>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={styles.sectionContainer}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5" sx={styles.sectionHeader}>
                                        <Zap size={22} style={{ color: theme.palette.primary.main }} />
                                        My Bridges
                                    </Typography>
                                    <IconButton onClick={() => setYourBridgesExpanded(!yourBridgesExpanded)} size="small">
                                        {yourBridgesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </IconButton>
                                </Box>
                                <Collapse in={yourBridgesExpanded} timeout="auto" unmountOnExit>
                                    {bridges.length === 0 ? (
                                        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'neutral.light', borderRadius: 1 }}>
                                            <Zap size={32} color="primary.light" style={{ marginBottom: '16px' }} />
                                            <Typography variant="h6" sx={{ mb: 1 }}>Create Your First Bridge</Typography>
                                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                                Turn videos into interactive AI agents that sell, teach, or onboard.
                                            </Typography>
                                            <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleCreateClick} disabled={!canCreateBridge()}>
                                                Create Bridge
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={styles.listContainer}>
                                            <BrdgeList
                                                brdges={sortedBridges}
                                                onView={handleView}
                                                onEdit={handleEdit}
                                                onShare={handleShare}
                                                onDelete={handleDelete}
                                                orderBy={orderBy}
                                                orderDirection={orderDirection}
                                                onSort={handleSort}
                                                selectedModules={selectedBridges}
                                                onModuleSelect={handleBridgeSelect}
                                                onSelectAll={handleSelectAll}
                                                draggable={true}
                                                onDragStart={handleBridgeDragStart}
                                                onDragEnd={handleBridgeDragEnd}
                                                selectedBridges={selectedBridges}
                                                onBridgeSelect={handleBridgeSelect}
                                                selectedItemsCount={selectedBridges.length}
                                                onBatchDelete={handleBatchDelete}
                                                onClearSelection={clearSelection}
                                                expandedLogs={expandedLogs}
                                                loadingLogs={loadingLogs}
                                                conversationLogs={conversationLogs}
                                                toggleLogExpansion={toggleLogExpansion}
                                                BridgeAnalyticsComponent={BridgeAnalytics}
                                                theme={theme}
                                            />
                                            {selectedBridges.length > 0 && (
                                                <Box sx={styles.bulkActionsBar}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {selectedBridges.length} Bridge{selectedBridges.length !== 1 ? 's' : ''} selected
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button size="small" onClick={clearSelection}>Clear</Button>
                                                        <Button size="small" color="error" onClick={handleBatchDelete} startIcon={<Trash2 size={14} />}>
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Collapse>
                            </Box>
                        </Grid>
                    </Grid>

                </Container>
            </Box>

            <InfoSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                userStats={userStats}
                courses={courses}
                navigate={navigate}
                theme={theme}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${theme.palette.divider}`, minWidth: 360 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Trash2 size={20} color={theme.palette.error.main} />
                    Delete Bridge
                </DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to permanently delete the Bridge: <strong>"{bridgeToDelete?.name}"</strong>?</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone. All associated data, including AI interactions and analytics, will be lost.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained" disabled={savingState}>
                        Delete Bridge
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteCourseDialogOpen}
                onClose={() => setDeleteCourseDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${theme.palette.divider}`, minWidth: 360 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Trash2 size={20} color={theme.palette.error.main} />
                    Delete Course
                </DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the flow: <strong>"{courseToDelete?.name}"</strong>?</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This will remove the flow structure. Your Bridges within this flow will **not** be deleted and remain in your library.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteCourseDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteCourse} color="error" variant="contained" disabled={savingState}>
                        Delete Course
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={shareDialogOpen} onClose={handleCloseShare} PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${theme.palette.divider}`, minWidth: 400 } }}>
                <DialogTitle>Share Bridge</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {bridgeToShare?.shareable ? "This Bridge is public. Anyone with the link can view it." : "This Bridge is private. Only you can access it."}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={bridgeToShare?.shareable || false} onChange={handleShareToggle} color="primary" disabled={savingState} />}
                        label="Make Publicly Accessible"
                        sx={{ mt: 1, mb: 2 }}
                    />
                    {bridgeToShare?.shareable && (
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Share this link:</Typography>
                            <TextField
                                fullWidth
                                value={bridgeToShare.public_id ? `${window.location.origin}/b/${bridgeToShare.public_id}` : `${window.location.origin}/viewBridge/${bridgeToShare?.id}-${bridgeToShare?.public_id?.substring(0, 6) || ''}`}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title={linkCopied ? "Copied!" : "Copy Link"}>
                                                <IconButton onClick={handleCopyLink} edge="end" color={linkCopied ? 'success' : 'primary'}>
                                                    {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    )
                                }}
                                size="small"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseShare}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={shareCourseDialogOpen} onClose={handleCloseCourseShare} PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${theme.palette.divider}`, minWidth: 400 } }}>
                <DialogTitle>Share Flow</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {courseToShare?.shareable ? "This Flow is public. Anyone with the link can view it." : "This Flow is private."}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={courseToShare?.shareable || false} onChange={handleCourseShareToggle} color="primary" disabled={savingState} />}
                        label="Make Publicly Accessible"
                        sx={{ mt: 1, mb: 2 }}
                    />
                    {courseToShare?.shareable && (
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>Share this link:</Typography>
                            <TextField
                                fullWidth
                                value={`${window.location.origin}/c/${courseToShare?.public_id}`}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title={courseLinkCopied ? "Copied!" : "Copy Link"}>
                                                <IconButton onClick={handleCopyCourseLink} edge="end" color={courseLinkCopied ? 'success' : 'primary'}>
                                                    {courseLinkCopied ? <Check size={18} /> : <Copy size={18} />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    )
                                }}
                                size="small"
                            />
                        </Box>
                    )}
                    <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                        Note: Individual bridge visibility within a public flow is managed separately.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseCourseShare}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={batchDeleteDialogOpen} onClose={() => setBatchDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${theme.palette.divider}`, minWidth: 360 } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Trash2 size={20} color={theme.palette.error.main} />
                    Delete Multiple Bridges
                </DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to permanently delete the selected <strong>{selectedBridges.length} Bridge{selectedBridges.length !== 1 ? 's' : ''}</strong>?</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setBatchDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmBatchDelete} color="error" variant="contained" disabled={savingState}>
                        Delete {selectedBridges.length} Bridge{selectedBridges.length !== 1 ? 's' : ''}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={bridgeSelectionDialogOpen} onClose={() => setBridgeSelectionDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${theme.palette.divider}` } }}>
                <DialogTitle>Add Bridge to "{selectedCourse?.name}"</DialogTitle>
                <DialogContent sx={{ pt: '0 !important' }}>
                    <TextField
                        placeholder="Search your Bridges..."
                        value={bridgeSearchTerm}
                        onChange={(e) => setBridgeSearchTerm(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} color={theme.palette.text.secondary} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 0.5 }}>
                        {filteredBridgesForSelection.length > 0 ? (
                            filteredBridgesForSelection.map((bridge) => (
                                <Box
                                    key={bridge.id}
                                    sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        p: 1, mb: 1, borderRadius: 1, cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                    onClick={() => {
                                        handleAddBridgeToCourse(selectedCourse.id, bridge.id);
                                        setBridgeSelectionDialogOpen(false);
                                    }}
                                >
                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {bridge.shareable ? <Globe size={14} color="success.main" /> : <Lock size={14} color="text.disabled" />}
                                        {bridge.name}
                                    </Typography>
                                    <Button size="small" variant="outlined" startIcon={<Plus size={14} />} sx={{ py: 0.5, px: 1, fontSize: '0.75rem' }}>Add</Button>
                                </Box>
                            ))
                        ) : (
                            <Typography align="center" color="text.secondary" sx={{ p: 3 }}>
                                {bridgeSearchTerm ? 'No matching Bridges found.' : 'All your Bridges are already in this course or you have no other Bridges.'}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setBridgeSelectionDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={unenrollDialogOpen} onClose={() => setUnenrollDialogOpen(false)} PaperProps={{ sx: { borderRadius: 2, border: `1px solid ${theme.palette.divider}`, minWidth: 360 } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LogOut size={20} color={theme.palette.warning.main} />
                    Unenroll from Flow
                </DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to unenroll from <strong>"{courseToUnenroll?.name}"</strong>?</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Your progress will be lost, but you can re-enroll later.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setUnenrollDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmUnenroll} color="warning" variant="contained" disabled={savingState}>
                        Unenroll
                    </Button>
                </DialogActions>
            </Dialog>

        </DndProvider>
    );
}

export default DotBrdgeListPage; 