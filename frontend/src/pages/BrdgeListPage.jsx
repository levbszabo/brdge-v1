// src/pages/BrdgeListPage.jsx
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Search, Plus, Lock, Globe, User, MessageSquare, LineChart, ChevronDown, Copy, Check, Trash2, BookOpen, GraduationCap, ChevronUp, Share, Edit, ChevronRight, ChevronLeft } from 'lucide-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { api } from '../api';
import { getAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';
import BrdgeList from '../components/BrdgeList';
import EmptyBrdgeState from '../components/EmptyBrdgeState';
import UsageIndicator from '../components/UsageIndicator';
import CourseList from '../components/CourseList';

// Unified theme colors
const theme = {
    colors: {
        primary: '#4F9CF9',
        primaryGlow: 'rgba(34, 211, 238, 0.8)',
        background: '#0B0F1B',
        backgroundLight: '#101727',
        backgroundDarker: '#090D16',
        surface: 'rgba(255, 255, 255, 0.04)',
        border: 'rgba(255, 255, 255, 0.1)',
        borderGlow: 'rgba(34, 211, 238, 0.3)',
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)',
            glow: '#22D3EE'
        }
    },
    transitions: {
        default: 'all 0.2s ease-in-out'
    },
    shadows: {
        glow: '0 0 15px rgba(34, 211, 238, 0.3)',
        strongGlow: '0 0 20px rgba(34, 211, 238, 0.5)'
    }
};

// Unified styles with enhanced glowing elements
const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.backgroundLight} 100%)`,
        py: 4,
        boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.4)',
    },
    header: {
        color: theme.colors.text.primary,
        mb: 3,
        fontWeight: 600,
        textAlign: 'center',
        position: 'relative',
        textShadow: '0 0 10px rgba(34, 211, 238, 0.4)',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #22D3EE, transparent)',
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)'
        }
    },
    sectionHeader: {
        color: theme.colors.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        fontWeight: 600,
        mb: 2,
        textShadow: '0 0 8px rgba(34, 211, 238, 0.3)',
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            left: '-15px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '70%',
            background: 'linear-gradient(to bottom, transparent, #22D3EE, transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(34, 211, 238, 0.6)'
        }
    },
    ctaBlock: {
        display: 'flex',
        gap: 2,
        mb: 3,
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
    },
    courseCard: {
        p: 3,
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        mb: 2,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.3), transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(34, 211, 238, 0.15)',
            borderColor: 'rgba(34, 211, 238, 0.3)',
            transform: 'translateY(-2px)',
            '&::before': {
                opacity: 1
            }
        },
    },
    moduleUsageBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.7rem',
        py: 0.5,
        px: 1,
        borderRadius: '4px',
        backgroundColor: 'rgba(34, 211, 238, 0.15)',
        color: '#22D3EE',
        ml: 1,
    },
    tabContainer: {
        mb: 4,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    tab: {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#22D3EE',
        },
        textTransform: 'none',
        minWidth: 'auto',
        fontSize: '1rem',
        padding: '12px 16px',
    },
    tabPanel: {
        py: 3,
    },
    marketplaceSection: {
        py: 3,
        borderRadius: '16px',
        backgroundColor: theme.colors.backgroundDarker,
        border: '1px solid rgba(34, 211, 238, 0.15)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(34, 211, 238, 0.05)',
        mt: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, transparent 100%)',
            pointerEvents: 'none'
        }
    },
    marketplaceHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
    },
    marketplaceGrid: {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
    },
    marketplaceCard: {
        p: 3,
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderColor: 'rgba(34, 211, 238, 0.3)',
        },
    },
    bulkActionsBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: '8px',
        backgroundColor: 'rgba(34, 211, 238, 0.08)',
        mb: 2,
        boxShadow: '0 0 15px rgba(34, 211, 238, 0.1)',
    },
    actionButton: {
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        color: theme.colors.text.glow,
        borderRadius: '8px',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        boxShadow: '0 0 10px rgba(34, 211, 238, 0.1)',
        transition: 'all 0.2s ease',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'rgba(34, 211, 238, 0.15)',
            borderColor: 'rgba(34, 211, 238, 0.5)',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
            transform: 'translateY(-1px)'
        }
    },
    statsCard: {
        p: 2,
        borderRadius: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(34, 211, 238, 0.15)',
    },
    sectionContainer: {
        mb: 5,
        p: 3,
        borderRadius: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at top left, rgba(34, 211, 238, 0.03), transparent 70%)',
            pointerEvents: 'none'
        }
    },
};

// Add these new styles
const sidebarStyles = {
    sidebar: {
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: 320,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderLeft: '1px solid rgba(34, 211, 238, 0.15)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-5px 0 20px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)', // Start offscreen
        pt: '64px', // Account for header height
    },
    toggleButton: {
        position: 'absolute',
        left: -40,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px 0 0 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '1px solid rgba(34, 211, 238, 0.15)',
        borderRight: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
        }
    },
    content: {
        padding: 3,
        overflowY: 'auto',
        height: '100%',
        '&::-webkit-scrollbar': {
            width: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(34, 211, 238, 0.2)',
            borderRadius: '3px',
            '&:hover': {
                background: 'rgba(34, 211, 238, 0.3)',
            }
        }
    }
};

// Add this new component for the sidebar
const InfoSidebar = ({ isOpen, onToggle, userStats, courses, navigate }) => {
    return (
        <Box
            sx={{
                ...sidebarStyles.sidebar,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                backgroundColor: 'rgba(0, 11, 27, 0.95)', // Darker, more transparent background
            }}
        >
            <Box
                onClick={onToggle}
                sx={sidebarStyles.toggleButton}
            >
                {isOpen ? <ChevronRight size={20} color="#22D3EE" /> : <ChevronLeft size={20} color="#22D3EE" />}
            </Box>

            <Box sx={sidebarStyles.content}>
                {/* Welcome Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{
                        color: '#22D3EE',
                        fontWeight: 600,
                        mb: 2,
                        textShadow: '0 0 8px rgba(34, 211, 238, 0.4)'
                    }}>
                        Welcome to the Hub
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, lineHeight: 1.6 }}>
                        Your AI-powered education center for creating, managing, and sharing interactive learning materials.
                    </Typography>
                </Box>

                {/* Quick Tips Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        Quick Tips
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{
                            p: 2,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(34, 211, 238, 0.05)',
                            border: '1px solid rgba(34, 211, 238, 0.15)',
                        }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                💡 Create AI Modules
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Start by creating AI-powered learning modules with interactive content and chat capabilities.
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: 2,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(34, 211, 238, 0.05)',
                            border: '1px solid rgba(34, 211, 238, 0.15)',
                        }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                📚 Organize into Courses
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Group your modules into structured courses for better organization and learning flow.
                            </Typography>
                        </Box>
                        <Box sx={{
                            p: 2,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(34, 211, 238, 0.05)',
                            border: '1px solid rgba(34, 211, 238, 0.15)',
                        }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                                🔄 Drag & Drop
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Easily organize your content by dragging modules between courses.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

function BrdgeListPage() {
    const [brdges, setBrdges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteCourseDialogOpen, setDeleteCourseDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareCourseDialogOpen, setShareCourseDialogOpen] = useState(false);
    const [brdgeToDelete, setBrdgeToDelete] = useState(null);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [brdgeToShare, setBrdgeToShare] = useState(null);
    const [courseToShare, setCourseToShare] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('updated_at');
    const [orderDirection, setOrderDirection] = useState('desc');
    const [userStats, setUserStats] = useState({
        brdges_created: 0,
        brdges_limit: '2',
        minutes_used: 0,
        minutes_limit: 30
    });
    const [expandedBrdge, setExpandedBrdge] = useState(null);
    const [conversationData, setConversationData] = useState({});
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [order, setOrder] = useState('desc');
    const [selectedModules, setSelectedModules] = useState([]);
    const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('content');
    const [marketplaceExpanded, setMarketplaceExpanded] = useState(false);
    const [moduleSelectionDialogOpen, setModuleSelectionDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [moduleSearchTerm, setModuleSearchTerm] = useState('');
    const [draggedModuleId, setDraggedModuleId] = useState(null);
    const [dropTargetCourseId, setDropTargetCourseId] = useState(null);
    const [courseDialogOpen, setCourseDialogOpen] = useState(false);
    const [newCourseData, setNewCourseData] = useState({ name: '', description: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchBrdges();
        fetchCourses();
        fetchStats();
    }, []);

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

    const fetchStats = async () => {
        try {
            const response = await api.get('/user/stats');
            const accountType = response.data.account_type || 'free';
            setUserStats({
                ...response.data,
                brdges_limit: getBrdgeLimit(accountType),
                minutes_limit: getMinutesLimit(accountType)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await api.get('/courses');
            setCourses(response.data.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showSnackbar('Failed to fetch courses', 'error');
        }
    };

    const fetchBrdges = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await api.get('/brdges');
            setBrdges(response.data.brdges || []);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch AI Modules');
            setLoading(false);
        }
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        const sortedBrdges = [...brdges].sort((a, b) => {
            if (property === 'name') {
                return isAsc
                    ? b.name.localeCompare(a.name)
                    : a.name.localeCompare(b.name);
            }
            if (property === 'status') {
                return isAsc
                    ? (b.shareable ? 1 : -1) - (a.shareable ? 1 : -1)
                    : (a.shareable ? 1 : -1) - (b.shareable ? 1 : -1);
            }
            return isAsc
                ? new Date(b[property]) - new Date(a[property])
                : new Date(a[property]) - new Date(b[property]);
        });

        setBrdges(sortedBrdges);
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const filteredBrdges = brdges.filter(brdge =>
        brdge.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (e, brdge) => {
        if (e) e.stopPropagation();
        navigate(`/viewBridge/${brdge.id}-${brdge.public_id.substring(0, 6)}`);
    };

    const handleEdit = (e, brdge) => {
        if (e) e.stopPropagation();
        navigate(`/edit/${brdge.id}-${brdge.public_id.substring(0, 6)}`);
    };

    const handleShare = (e, brdge) => {
        if (e) e.stopPropagation();
        setBrdgeToShare(brdge);
        setShareDialogOpen(true);
    };

    const handleCloseShare = () => {
        setShareDialogOpen(false);
        setBrdgeToShare(null);
        setLinkCopied(false);
    };

    const handleDelete = (e, brdge) => {
        if (e) e.stopPropagation();
        setBrdgeToDelete(brdge);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/brdges/${brdgeToDelete.id}`);
            setBrdges(brdges.filter((b) => b.id !== brdgeToDelete.id));
            showSnackbar('AI Module deleted successfully', 'success');
            setDeleteDialogOpen(false);
            fetchStats(); // Refresh stats after deletion
        } catch (error) {
            showSnackbar('Failed to delete AI Module', 'error');
        }
    };

    const isOverLimit = () => {
        if (!userStats) return false;

        const isBrdgesOverLimit =
            userStats.brdges_limit !== 'Unlimited' &&
            parseInt(userStats.brdges_created) >= parseInt(userStats.brdges_limit);
        const isMinutesOverLimit = parseInt(userStats.minutes_used) >= parseInt(userStats.minutes_limit);

        return isBrdgesOverLimit || isMinutesOverLimit;
    };

    const canCreateBrdge = () => {
        // Check if we have valid stats
        if (!userStats) return false;

        // If on pro plan or unlimited limit, always return true
        if (userStats.brdges_limit === 'Unlimited') return true;

        // For standard plan (10 brdges) or free plan (1 brdge)
        const currentLimit = parseInt(userStats.brdges_limit);
        const currentCount = parseInt(userStats.brdges_created);

        // Check both brdges and minutes limits
        const underBrdgeLimit = currentCount < currentLimit;
        const underMinuteLimit = parseInt(userStats.minutes_used) < parseInt(userStats.minutes_limit);

        return underBrdgeLimit && underMinuteLimit;
    };

    const fetchConversationData = async (brdgeId) => {
        setLoadingConversations(true);
        try {
            const response = await api.get(`/brdges/${brdgeId}/viewer-conversations`);
            const conversations = response.data.conversations || [];
            const interaction_stats = response.data.interaction_stats;

            // Process conversations to group by user and calculate metrics
            const processedData = {
                conversations: conversations,
                interaction_stats: interaction_stats
            };

            setConversationData(prev => ({
                ...prev,
                [brdgeId]: processedData
            }));
        } catch (error) {
            console.error('Error fetching conversation data:', error);
            showSnackbar('Failed to load conversation data', 'error');
        } finally {
            setLoadingConversations(false);
        }
    };

    const ConversationMetrics = ({ brdgeId }) => {
        const data = conversationData[brdgeId] || {};
        const totalUsers = Object.keys(data).length;
        const totalInteractions = Object.values(data).reduce(
            (sum, user) => sum + user.totalInteractions,
            0
        );
        const averageInteractionsPerUser = totalUsers ? (totalInteractions / totalUsers).toFixed(1) : 0;

        return (
            <Box sx={{ p: 2, bgcolor: 'rgba(0, 41, 132, 0.1)', borderRadius: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <User size={18} className="text-cyan-400" />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Students</Typography>
                                <Typography variant="h6" sx={{ color: 'white' }}>{totalUsers}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MessageSquare size={18} className="text-cyan-400" />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Interactions</Typography>
                                <Typography variant="h6" sx={{ color: 'white' }}>{totalInteractions}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LineChart size={18} className="text-cyan-400" />
                            <Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Avg. Interactions/Student</Typography>
                                <Typography variant="h6" sx={{ color: 'white' }}>{averageInteractionsPerUser}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const UserConversationList = ({ brdgeId }) => {
        const [expandedUser, setExpandedUser] = useState(null);
        const data = conversationData[brdgeId] || {};
        const conversations = data.conversations || [];

        return (
            <Box sx={{ mt: 2 }}>
                {Object.entries(data).map(([userId, userData]) => (
                    <Accordion
                        key={userId}
                        expanded={expandedUser === userId}
                        onChange={() => setExpandedUser(expandedUser === userId ? null : userId)}
                        sx={{
                            bgcolor: 'rgba(0, 41, 132, 0.05)',
                            '&:before': { display: 'none' },
                            mb: 1,
                            color: 'white'
                        }}
                    >
                        <AccordionSummary expandIcon={<ChevronDown className="text-white" size={18} />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
                                        <User size={18} className="text-cyan-400" />
                                        {userData.isAnonymous ? 'Anonymous Student' : `Student ${userId}`}
                                        {userData.isAnonymous && (
                                            <Chip
                                                label="Anonymous"
                                                size="small"
                                                variant="outlined"
                                                sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        Last active: {new Date(userData.lastInteraction).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Tooltip title="Total Interactions">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
                                            <MessageSquare size={18} className="text-cyan-400" />
                                            <Typography>{userData.totalInteractions}</Typography>
                                        </Box>
                                    </Tooltip>
                                    <Tooltip title="Unique Slides Viewed">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
                                            <LineChart size={18} className="text-cyan-400" />
                                            <Typography>{userData.uniqueSlides.size}</Typography>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                p: 2,
                                bgcolor: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: 1,
                                color: 'white'
                            }}>
                                {userData.messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 1,
                                            p: 1,
                                            borderLeft: '2px solid',
                                            borderColor: message.role === 'user' ? '#4F9CF9' : 'rgba(255, 255, 255, 0.3)',
                                            bgcolor: 'rgba(0, 0, 0, 0.2)',
                                            borderRadius: '4px',
                                            color: 'white'
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} display="block">
                                            {new Date(message.timestamp).toLocaleString()} - Slide {message.slide_number}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5, color: 'white' }}>
                                            {message.message}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        );
    };

    const BrdgeItem = ({ brdge }) => {
        const [expanded, setExpanded] = useState(false);

        const handleExpandClick = (e) => {
            e.stopPropagation();
            setExpanded(!expanded);
        };

        return (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        backgroundColor: '#1A1A1A',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                            backgroundColor: '#333',
                        },
                    }}
                    onClick={handleExpandClick}
                >
                    <Typography variant="h6" color="white">
                        {brdge.name}
                    </Typography>
                    <ExpandMoreIcon
                        sx={{
                            color: 'white',
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                        }}
                    />
                </Box>
                {expanded && (
                    <Box sx={{ padding: '10px', backgroundColor: '#2A2A2A', borderRadius: '8px' }}>
                        {/* Metrics and session details go here */}
                        <Typography variant="body2" color="white">
                            Metrics and session details...
                        </Typography>
                    </Box>
                )}
            </>
        );
    };

    const handleCopyLink = () => {
        const shareableUrl = `${window.location.origin}/viewBridge/${brdgeToShare?.id}-${brdgeToShare?.public_id.substring(0, 6)}`;
        navigator.clipboard.writeText(shareableUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleShareToggle = async () => {
        if (!brdgeToShare) return;

        try {
            const response = await api.post(`/brdges/${brdgeToShare.id}/toggle_shareable`);
            const newShareableStatus = response.data.shareable;

            // Update states in a single batch
            setBrdges(prevBrdges => prevBrdges.map(b =>
                b.id === brdgeToShare.id ? { ...b, shareable: newShareableStatus } : b
            ));

            setBrdgeToShare(prev => ({
                ...prev,
                shareable: newShareableStatus
            }));

            showSnackbar(
                `AI Module is now ${newShareableStatus ? 'public' : 'private'}`,
                'success'
            );
        } catch (error) {
            console.error('Error toggling share status:', error);
            showSnackbar('Failed to update sharing settings', 'error');
        }
    };

    const handleCreateClick = () => {
        if (isOverLimit()) {
            // Check which limit is exceeded to customize the warning message
            const limitType =
                userStats.brdges_limit !== 'Unlimited' &&
                    parseInt(userStats.brdges_created) >= parseInt(userStats.brdges_limit)
                    ? 'AI Modules'
                    : 'AI interaction minutes';
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
        try {
            // Ensure there's at least a name
            if (!newCourseData.name.trim()) {
                showSnackbar('Course name is required', 'error');
                return;
            }

            const response = await api.post('/courses', newCourseData);

            // Add the new course to the courses state
            setCourses([...courses, response.data.course]);

            // Close the dialog and reset form
            setCourseDialogOpen(false);
            setNewCourseData({ name: '', description: '' });

            showSnackbar('Course created successfully', 'success');
        } catch (error) {
            console.error('Error creating course:', error);
            showSnackbar('Failed to create course', 'error');
        }
    };

    const handleEditCourse = (course) => {
        navigate(`/edit-course/${course.id}-${course.public_id.substring(0, 6)}`);
    };

    const handleViewCourse = (course) => {
        navigate(`/c/${course.public_id}`);
    };

    const handleShareCourse = (course) => {
        setCourseToShare(course);
        setShareCourseDialogOpen(true);
    };

    const handleDeleteCourse = (course) => {
        setCourseToDelete(course);
        setDeleteCourseDialogOpen(true);
    };

    const confirmDeleteCourse = async () => {
        try {
            await api.delete(`/courses/${courseToDelete.id}`);
            setCourses(courses.filter(c => c.id !== courseToDelete.id));
            showSnackbar('Course deleted successfully', 'success');
            setDeleteCourseDialogOpen(false);
        } catch (error) {
            console.error('Error deleting course:', error);
            showSnackbar('Failed to delete course', 'error');
        }
    };

    const handleAddModuleToCourse = async (courseId, brdgeId) => {
        try {
            const response = await api.post(`/courses/${courseId}/modules`, { brdge_id: brdgeId });

            // Update the courses state to include the new module
            setCourses(prevCourses => {
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        // Get the brdge details from the brdges array
                        const brdge = brdges.find(b => b.id === brdgeId);

                        if (brdge) {
                            // Create the module object to add to the course
                            const newModule = {
                                id: response.data.course_module.id,
                                brdge_id: brdge.id,
                                name: brdge.name,
                                position: response.data.course_module.position,
                                shareable: brdge.shareable,
                                public_id: brdge.public_id
                            };

                            // Add the new module to the course
                            return {
                                ...course,
                                modules: [...(course.modules || []), newModule]
                            };
                        }
                    }
                    return course;
                });
            });

            showSnackbar('Module added to course successfully', 'success');
        } catch (error) {
            console.error('Error adding module to course:', error);
            showSnackbar('Failed to add module to course', 'error');
        }
    };

    const handleRemoveModuleFromCourse = async (courseId, moduleId) => {
        try {
            await api.delete(`/courses/${courseId}/modules/${moduleId}`);

            // Update the courses state to remove the module
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

            showSnackbar('Module removed from course successfully', 'success');
        } catch (error) {
            console.error('Error removing module from course:', error);
            showSnackbar('Failed to remove module from course', 'error');
        }
    };

    const handleReorderModules = async (courseId, moduleOrder) => {
        try {
            await api.put(`/courses/${courseId}/modules/reorder`, { modules: moduleOrder });

            // Update the courses state with the new order
            setCourses(prevCourses => {
                return prevCourses.map(course => {
                    if (course.id === courseId) {
                        // Create a new modules array with updated positions
                        const updatedModules = [...course.modules];
                        moduleOrder.forEach(item => {
                            const index = updatedModules.findIndex(m => m.id === item.id);
                            if (index !== -1) {
                                updatedModules[index] = {
                                    ...updatedModules[index],
                                    position: item.position
                                };
                            }
                        });

                        // Sort the modules by position
                        updatedModules.sort((a, b) => a.position - b.position);

                        return {
                            ...course,
                            modules: updatedModules
                        };
                    }
                    return course;
                });
            });

            showSnackbar('Modules reordered successfully', 'success');
        } catch (error) {
            console.error('Error reordering modules:', error);
            showSnackbar('Failed to reorder modules', 'error');
        }
    };

    // Define table columns
    const columns = [
        {
            id: 'name',
            label: 'Name',
            sortable: true,
            width: '30%'
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            width: '15%'
        },
        {
            id: 'created_at',
            label: 'Created',
            sortable: true,
            width: '20%'
        },
        {
            id: 'updated_at',
            label: 'Last Updated',
            sortable: true,
            width: '20%'
        },
        {
            id: 'actions',
            label: 'Actions',
            sortable: false,
            width: '15%'
        }
    ];

    // Calculate sorted brdges
    const sortedBrdges = React.useMemo(() => {
        if (!filteredBrdges) return [];

        return [...filteredBrdges].sort((a, b) => {
            if (orderBy === 'name') {
                return order === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
            if (orderBy === 'status') {
                return order === 'asc'
                    ? (a.shareable ? 1 : -1) - (b.shareable ? 1 : -1)
                    : (b.shareable ? 1 : -1) - (a.shareable ? 1 : -1);
            }
            return order === 'asc'
                ? new Date(a[orderBy]) - new Date(b[orderBy])
                : new Date(b[orderBy]) - new Date(a[orderBy]);
        });
    }, [filteredBrdges, orderBy, order]);

    // Handle row click
    const handleRowClick = (brdge) => {
        navigate(`/edit/${brdge.id}`);
    };

    // Add function to handle module selection
    const handleModuleSelect = (moduleId) => {
        setSelectedModules(prev => {
            // If already selected, remove it
            if (prev.includes(moduleId)) {
                return prev.filter(id => id !== moduleId);
            }
            // Otherwise add it
            return [...prev, moduleId];
        });
    };

    // Add function to handle batch deletion
    const handleBatchDelete = () => {
        if (selectedModules.length > 0) {
            setBatchDeleteDialogOpen(true);
        }
    };

    // Add function to confirm and execute batch deletion
    const confirmBatchDelete = async () => {
        try {
            // Send delete requests for all selected modules
            await Promise.all(
                selectedModules.map(moduleId =>
                    api.delete(`/brdges/${moduleId}`)
                )
            );

            // Update the brdges state by filtering out deleted modules
            setBrdges(brdges.filter(b => !selectedModules.includes(b.id)));

            // Clear selection and close dialog
            setSelectedModules([]);
            setBatchDeleteDialogOpen(false);

            // Show success message
            showSnackbar(`${selectedModules.length} modules deleted successfully`, 'success');

            // Refresh stats after deletion
            fetchStats();
        } catch (error) {
            showSnackbar('Failed to delete some modules', 'error');
        }
    };

    // Add function to select all visible modules
    const handleSelectAll = () => {
        if (selectedModules.length === filteredBrdges.length) {
            // If all are selected, deselect all
            setSelectedModules([]);
        } else {
            // Otherwise select all visible modules
            setSelectedModules(filteredBrdges.map(b => b.id));
        }
    };

    // Add function to clear selection
    const clearSelection = () => {
        setSelectedModules([]);
    };

    const handleCloseCourseShare = () => {
        setShareCourseDialogOpen(false);
        setCourseToShare(null);
    };

    const handleCourseShareToggle = async () => {
        if (!courseToShare) return;

        try {
            await api.post(`/courses/${courseToShare.id}/toggle_shareable`);

            // Update local state
            setCourses(courses.map(course =>
                course.id === courseToShare.id
                    ? { ...course, shareable: !course.shareable }
                    : course
            ));

            // Also update the courseToShare state
            setCourseToShare({
                ...courseToShare,
                shareable: !courseToShare.shareable
            });

            showSnackbar(
                courseToShare.shareable
                    ? 'Course is now private'
                    : 'Course is now public and can be shared',
                'success'
            );
        } catch (error) {
            console.error('Error toggling course shareable status:', error);
            showSnackbar('Failed to update sharing settings', 'error');
        }
    };

    const handleCopyCourseLink = () => {
        const shareableLink = `${window.location.origin}/c/${courseToShare.public_id}`;
        navigator.clipboard.writeText(shareableLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
    };

    // Add this function to handle opening the module selection dialog
    const handleOpenModuleSelection = (course) => {
        setSelectedCourse(course);
        setModuleSelectionDialogOpen(true);
        setModuleSearchTerm('');
    };

    // Add this function to handle module dragging start
    const handleModuleDragStart = (e, moduleId) => {
        setDraggedModuleId(moduleId);
        e.dataTransfer.setData('moduleId', moduleId);
        // Make the drag image semi-transparent
        if (e.target.style) {
            e.target.style.opacity = '0.4';
        }
    };

    // Add this function to handle module dragging end
    const handleModuleDragEnd = (e) => {
        setDraggedModuleId(null);
        setDropTargetCourseId(null);
        // Reset opacity
        if (e.target.style) {
            e.target.style.opacity = '1';
        }
    };

    // Add this function to handle drag over a course
    const handleDragOver = (e, courseId) => {
        e.preventDefault();
        setDropTargetCourseId(courseId);
    };

    // Add this function to handle drop on a course
    const handleDrop = (e, courseId) => {
        e.preventDefault();
        const moduleId = e.dataTransfer.getData('moduleId') || draggedModuleId;
        if (moduleId) {
            handleAddModuleToCourse(courseId, moduleId);
        }
        setDraggedModuleId(null);
        setDropTargetCourseId(null);
    };

    // Add this function to handle adding modules from the selection dialog
    const handleAddSelectedModules = () => {
        // Here you would handle adding multiple selected modules to the course
        // For now, we'll leave this as is since we already have a working function for adding single modules
        setModuleSelectionDialogOpen(false);
    };

    // Add filter for module selection dialog
    const filteredModulesForSelection = brdges.filter(brdge => {
        // Filter out modules that are already in the course
        const alreadyInCourse = selectedCourse?.modules?.some(
            module => module.brdge_id === brdge.id
        );

        return !alreadyInCourse &&
            brdge.name.toLowerCase().includes(moduleSearchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress sx={{ color: theme.colors.primary }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            ...styles.pageContainer,
            display: 'flex',
            minHeight: '100vh',
        }}>
            <Box sx={{
                flex: 1,
                transition: 'margin 0.3s ease',
                mr: sidebarOpen ? '320px' : 0, // Add margin when sidebar is open
            }}>
                <Container maxWidth="lg" sx={{
                    py: 4,
                    px: 3,
                }}>
                    <Typography variant="h4" sx={styles.header}>
                        Learning Hub
                    </Typography>

                    {/* Platform Introduction & Analytics Section */}
                    <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>

                        {/* Usage Stats - Smaller, clearer cards with tooltips */}
                        <Typography variant="subtitle1" sx={{
                            mb: 2,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            {/* Course Stats Card */}
                            <Grid item xs={12} sm={4}>
                                <Tooltip title="Total number of courses you've created. Courses help you organize modules into structured learning paths.">
                                    <Box sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(34, 211, 238, 0.15)',
                                        p: 1.5,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        height: '100%',
                                        cursor: 'help'
                                    }}>
                                        <Box sx={{
                                            height: 38,
                                            width: 38,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.15)',
                                        }}>
                                            <BookOpen size={20} color="#22D3EE" />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                fontSize: '0.75rem'
                                            }}>
                                                Courses Created
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                mt: 0.5,
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                gap: 0.5
                                            }}>
                                                {courses.length}
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                    total
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            </Grid>

                            {/* AI Modules Stats Card */}
                            <Grid item xs={12} sm={4}>
                                <Tooltip title="Number of AI Modules you've created out of your plan limit. Modules are interactive learning components powered by AI.">
                                    <Box sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(34, 211, 238, 0.15)',
                                        p: 1.5,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        height: '100%',
                                        cursor: 'help'
                                    }}>
                                        <Box sx={{
                                            height: 38,
                                            width: 38,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.15)',
                                        }}>
                                            <GraduationCap size={20} color="#22D3EE" />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                fontSize: '0.75rem'
                                            }}>
                                                AI Modules
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                mt: 0.5,
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                gap: 0.5
                                            }}>
                                                {userStats.brdges_created}
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                    {userStats.brdges_limit === 'Unlimited' ?
                                                        '/ ∞' :
                                                        `/ ${userStats.brdges_limit}`}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            </Grid>

                            {/* AI Minutes Stats Card */}
                            <Grid item xs={12} sm={4}>
                                <Tooltip title="AI interaction minutes used out of your plan allocation. These minutes are consumed when users interact with your modules.">
                                    <Box sx={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(34, 211, 238, 0.15)',
                                        p: 1.5,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        height: '100%',
                                        cursor: 'help'
                                    }}>
                                        <Box sx={{
                                            height: 38,
                                            width: 38,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.15)',
                                        }}>
                                            <MessageSquare size={20} color="#22D3EE" />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                fontSize: '0.75rem'
                                            }}>
                                                AI Minutes
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                mt: 0.5,
                                                display: 'flex',
                                                alignItems: 'baseline',
                                                gap: 0.5
                                            }}>
                                                {userStats.minutes_used}
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                    / {userStats.minutes_limit}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Tooltip>
                            </Grid>
                        </Grid>

                        {/* Upgrade prompt if near limits */}
                        {(userStats.brdges_created > 0.7 * userStats.brdges_limit ||
                            userStats.minutes_used > 0.7 * userStats.minutes_limit) &&
                            userStats.brdges_limit !== 'Unlimited' && (
                                <Box sx={{
                                    mt: 1,
                                    p: 1.5,
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(34, 211, 238, 0.08)',
                                    border: '1px dashed rgba(34, 211, 238, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        You're approaching your plan limits. Upgrade to unlock more AI capabilities.
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => navigate('/profile')}
                                        sx={{
                                            color: '#22D3EE',
                                            borderColor: 'rgba(34, 211, 238, 0.3)',
                                            '&:hover': {
                                                borderColor: 'rgba(34, 211, 238, 0.6)',
                                                backgroundColor: 'rgba(34, 211, 238, 0.05)'
                                            }
                                        }}
                                    >
                                        Upgrade
                                    </Button>
                                </Box>
                            )}

                        {/* Enhanced Search Bar with glow */}
                        <Box sx={{ position: 'relative', mt: 3, mb: 3 }}>
                            <Search
                                size={20}
                                style={{
                                    position: 'absolute',
                                    left: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgba(34, 211, 238, 0.7)'
                                }}
                            />
                            <InputBase
                                placeholder="Search your modules and courses..."
                                value={searchTerm}
                                onChange={handleSearch}
                                sx={{
                                    width: '100%',
                                    pl: 5,
                                    pr: 2,
                                    py: 1.2,
                                    borderRadius: '50px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    color: 'white',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(34, 211, 238, 0.2)',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.1)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                        borderColor: 'rgba(34, 211, 238, 0.3)',
                                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.15)'
                                    },
                                    '&:focus-within': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        border: '1px solid rgba(34, 211, 238, 0.5)',
                                        boxShadow: '0 0 15px rgba(34, 211, 238, 0.25)'
                                    }
                                }}
                            />
                        </Box>

                        {/* CTA Block - Create Buttons */}
                        <Box sx={styles.ctaBlock}>
                            <Tooltip title="Create a new AI Module to share interactive content with your students">
                                <Button
                                    variant="contained"
                                    startIcon={<Plus size={20} />}
                                    onClick={handleCreateClick}
                                    sx={{
                                        ...styles.actionButton,
                                        backgroundColor: 'rgba(34, 211, 238, 0.15)',
                                        boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(34, 211, 238, 0.25)',
                                            boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    fullWidth
                                >
                                    {isOverLimit() ? 'Upgrade Plan' : 'Create New Module'}
                                </Button>
                            </Tooltip>
                            <Tooltip title="Create a new Course to organize your modules into a structured learning path">
                                <Button
                                    variant="contained"
                                    startIcon={<BookOpen size={20} />}
                                    onClick={() => setCourseDialogOpen(true)}
                                    sx={{
                                        ...styles.actionButton,
                                        backgroundColor: 'rgba(34, 211, 238, 0.15)',
                                        boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(34, 211, 238, 0.25)',
                                            boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    fullWidth
                                >
                                    Create New Course
                                </Button>
                            </Tooltip>
                        </Box>

                        {/* Visual divider with glow effect */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '50%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.7), transparent)',
                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
                        }} />
                    </Box>

                    {/* Main Content Area */}
                    <Box>
                        {/* Your Courses Section with enhanced visual separation */}
                        <Box sx={styles.sectionContainer}>
                            <Typography variant="h5" sx={styles.sectionHeader}>
                                <BookOpen size={24} style={{ color: '#22D3EE', filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.5))' }} />
                                Your Courses
                            </Typography>

                            {courses.length === 0 ? (
                                <Box sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    borderRadius: '12px',
                                    border: '1px dashed rgba(255, 255, 255, 0.2)'
                                }}>
                                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                        You haven't created any courses yet.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<BookOpen size={20} />}
                                        onClick={() => navigate('/create-course')}
                                        sx={styles.actionButton}
                                    >
                                        Create Your First Course
                                    </Button>
                                </Box>
                            ) : (
                                <Box>
                                    {courses.map(course => (
                                        <Box key={course.id}
                                            sx={{
                                                ...styles.courseCard,
                                                borderColor: dropTargetCourseId === course.id ? '#22D3EE' : 'rgba(255, 255, 255, 0.1)',
                                                boxShadow: dropTargetCourseId === course.id ? '0 0 20px rgba(34, 211, 238, 0.3)' : undefined,
                                            }}
                                            onDragOver={(e) => handleDragOver(e, course.id)}
                                            onDrop={(e) => handleDrop(e, course.id)}
                                            onDragLeave={() => setDropTargetCourseId(null)}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                                                        {course.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
                                                        {course.modules?.length || 0} modules | Last updated: {
                                                            course.updated_at ? new Date(course.updated_at).toLocaleDateString() : 'N/A'
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="View Course">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewCourse(course);
                                                            }}
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                '&:hover': { color: '#22D3EE', backgroundColor: 'rgba(34, 211, 238, 0.1)' }
                                                            }}
                                                        >
                                                            <BookOpen size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Course">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditCourse(course);
                                                            }}
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                '&:hover': { color: '#22D3EE', backgroundColor: 'rgba(34, 211, 238, 0.1)' }
                                                            }}
                                                        >
                                                            <Edit size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Share Course">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShareCourse(course);
                                                            }}
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                '&:hover': { color: '#22D3EE', backgroundColor: 'rgba(34, 211, 238, 0.1)' }
                                                            }}
                                                        >
                                                            <Share size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Course">
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteCourse(course);
                                                            }}
                                                            sx={{
                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                                '&:hover': { color: '#FF4B4B', backgroundColor: 'rgba(255, 75, 75, 0.1)' }
                                                            }}
                                                        >
                                                            <Trash2 size={18} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>

                                            {/* Module Management Section */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2,
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                                pb: 2
                                            }}>
                                                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <GraduationCap size={16} style={{ color: '#22D3EE' }} />
                                                    Modules in this Course
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Plus size={14} />}
                                                    onClick={() => handleOpenModuleSelection(course)}
                                                    sx={{
                                                        color: '#22D3EE',
                                                        borderColor: 'rgba(34, 211, 238, 0.3)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(34, 211, 238, 0.08)',
                                                            borderColor: 'rgba(34, 211, 238, 0.5)',
                                                        }
                                                    }}
                                                >
                                                    Add Module
                                                </Button>
                                            </Box>

                                            {/* Modules Used in Course */}
                                            {course.modules && course.modules.length > 0 ? (
                                                <Box sx={{ pl: 1 }}>
                                                    {course.modules.map((module, index) => (
                                                        <Box
                                                            key={module.id}
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                mb: 1,
                                                                py: 1,
                                                                px: 1,
                                                                borderRadius: '4px',
                                                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' }
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'rgba(255, 255, 255, 0.8)',
                                                                    display: 'flex',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                {index + 1}. {module.name}
                                                                {module.shareable ? (
                                                                    <Tooltip title="Public Module">
                                                                        <Box sx={{ display: 'inline-flex', ml: 1 }}>
                                                                            <Globe size={14} color="#22D3EE" />
                                                                        </Box>
                                                                    </Tooltip>
                                                                ) : (
                                                                    <Tooltip title="Private Module">
                                                                        <Box sx={{ display: 'inline-flex', ml: 1 }}>
                                                                            <Lock size={14} color="rgba(255, 255, 255, 0.5)" />
                                                                        </Box>
                                                                    </Tooltip>
                                                                )}
                                                            </Typography>

                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="View Module">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleView(null, { id: module.brdge_id, public_id: module.public_id })}
                                                                        sx={{
                                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                                            padding: '4px',
                                                                            '&:hover': { color: '#22D3EE', backgroundColor: 'rgba(34, 211, 238, 0.1)' }
                                                                        }}
                                                                    >
                                                                        <BookOpen size={16} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Edit Module">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleEdit(null, { id: module.brdge_id, public_id: module.public_id })}
                                                                        sx={{
                                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                                            padding: '4px',
                                                                            '&:hover': { color: '#22D3EE', backgroundColor: 'rgba(34, 211, 238, 0.1)' }
                                                                        }}
                                                                    >
                                                                        <Edit size={16} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Remove from Course">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleRemoveModuleFromCourse(course.id, module.id)}
                                                                        sx={{
                                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                                            padding: '4px',
                                                                            '&:hover': { color: '#FF4B4B', backgroundColor: 'rgba(255, 75, 75, 0.1)' }
                                                                        }}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Box sx={{
                                                    p: 3,
                                                    textAlign: 'center',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                    borderRadius: '8px',
                                                    border: '1px dashed rgba(255, 255, 255, 0.1)'
                                                }}>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1 }}>
                                                        No modules in this course yet
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block' }}>
                                                        Click "Add Module" or drag modules here
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {/* Your AI Modules Section with enhanced visual separation */}
                        <Box sx={styles.sectionContainer}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" sx={styles.sectionHeader}>
                                    <GraduationCap size={24} style={{ color: '#22D3EE', filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.5))' }} />
                                    Your AI Modules
                                </Typography>

                                <Button
                                    variant="contained"
                                    startIcon={<Plus size={20} />}
                                    onClick={handleCreateClick}
                                    sx={{
                                        ...styles.actionButton,
                                        height: '36px',
                                        px: 2
                                    }}
                                >
                                    New Module
                                </Button>
                            </Box>

                            {/* Add this block to render the actual modules */}
                            {filteredBrdges.length === 0 ? (
                                <EmptyBrdgeState
                                    onCreateClick={() => navigate('/create')}
                                    canCreate={canCreateBrdge()}
                                />
                            ) : (
                                <Box sx={styles.listContainer}>
                                    <BrdgeList
                                        brdges={filteredBrdges}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onShare={handleShare}
                                        onDelete={handleDelete}
                                        orderBy={orderBy}
                                        orderDirection={orderDirection}
                                        onSort={handleSort}
                                        stats={userStats}
                                        selectedModules={selectedModules}
                                        onModuleSelect={handleModuleSelect}
                                        onSelectAll={handleSelectAll}
                                        courses={courses}
                                        draggable={true}
                                        onDragStart={handleModuleDragStart}
                                        onDragEnd={handleModuleDragEnd}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Enhanced Marketplace Section - Collapsible with better visual treatment */}
                        <Box sx={styles.marketplaceSection}>
                            <Box sx={{
                                ...styles.marketplaceHeader,
                                p: 2,
                                px: 3,
                                borderBottom: '1px solid rgba(34, 211, 238, 0.2)'
                            }}>
                                <Typography variant="h5" sx={{
                                    ...styles.sectionHeader,
                                    '&::before': {
                                        display: 'none' // Remove the side indicator for marketplace
                                    }
                                }}>
                                    <BookOpen size={24} style={{ color: '#22D3EE', filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.5))' }} />
                                    AI Course Marketplace
                                </Typography>
                                <Button
                                    variant="text"
                                    onClick={() => setMarketplaceExpanded(!marketplaceExpanded)}
                                    endIcon={marketplaceExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    sx={{
                                        color: '#22D3EE',
                                        textTransform: 'none',
                                        backgroundColor: 'rgba(34, 211, 238, 0.05)',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(34, 211, 238, 0.2)',
                                        px: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)',
                                            border: '1px solid rgba(34, 211, 238, 0.3)',
                                        }
                                    }}
                                >
                                    {marketplaceExpanded ? 'Hide Marketplace' : 'Browse AI-Powered Courses & Templates'}
                                </Button>
                            </Box>

                            {/* Collapsible Marketplace Content */}
                            <Collapse in={marketplaceExpanded}>
                                <Box sx={{ px: 3, pt: 3 }}>
                                    <Typography variant="subtitle1" sx={{
                                        color: theme.colors.text.glow,
                                        mb: 2,
                                        textShadow: '0 0 5px rgba(34, 211, 238, 0.4)'
                                    }}>
                                        Popular Courses & Templates
                                    </Typography>

                                    {/* Enhanced Marketplace Grid with card visuals */}
                                    <Box sx={{
                                        ...styles.marketplaceGrid,
                                        gap: 3,
                                    }}>
                                        {courses.filter(course => course.shareable).map((course) => (
                                            <Box
                                                key={course.id}
                                                sx={{
                                                    ...styles.marketplaceCard,
                                                    p: 0,
                                                    borderRadius: '12px',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                                    border: '1px solid rgba(34, 211, 238, 0.2)',
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-5px)',
                                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(34, 211, 238, 0.2)',
                                                        borderColor: 'rgba(34, 211, 238, 0.4)',
                                                    }
                                                }}
                                                onClick={() => handleViewCourse(course)}
                                            >
                                                <Box sx={{
                                                    height: '120px',
                                                    backgroundImage: 'linear-gradient(135deg, rgba(0, 41, 132, 0.4) 0%, rgba(34, 211, 238, 0.1) 100%)',
                                                    borderBottom: '1px solid rgba(34, 211, 238, 0.15)',
                                                    mb: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        width: '150%',
                                                        height: '150%',
                                                        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        opacity: 0.5,
                                                        pointerEvents: 'none'
                                                    }
                                                }}>
                                                    <BookOpen size={36} color="#22D3EE" style={{
                                                        filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))'
                                                    }} />
                                                </Box>
                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="h6" sx={{
                                                        color: 'white',
                                                        mb: 1,
                                                        textShadow: '0 0 5px rgba(34, 211, 238, 0.3)'
                                                    }}>
                                                        {course.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                                        {course.modules?.length || 0} modules
                                                    </Typography>
                                                    <Typography variant="caption" sx={{
                                                        mt: 'auto',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'rgba(255, 255, 255, 0.5)'
                                                    }}>
                                                        <User size={14} style={{ marginRight: '4px', color: '#22D3EE' }} />
                                                        Created by: {course.created_by || 'Brdge AI Team'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}

                                        {/* If no public courses available */}
                                        {courses.filter(course => course.shareable).length === 0 && (
                                            <Box sx={{
                                                gridColumn: '1 / -1',
                                                p: 4,
                                                textAlign: 'center',
                                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                borderRadius: '12px',
                                                border: '1px dashed rgba(34, 211, 238, 0.2)'
                                            }}>
                                                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                                    No public courses available in the marketplace yet.
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Collapse>
                        </Box>
                    </Box>

                    {/* Add Batch Delete Confirmation Dialog */}
                    <Dialog
                        open={batchDeleteDialogOpen}
                        onClose={() => setBatchDeleteDialogOpen(false)}
                        sx={{
                            '& .MuiDialog-paper': {
                                backgroundColor: 'rgba(17, 25, 40, 0.95)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                color: 'white',
                                minWidth: '400px',
                                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                                overflow: 'hidden'
                            },
                            '& .MuiBackdrop-root': {
                                backdropFilter: 'blur(8px)'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '20px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            position: 'relative',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -1,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(255, 75, 75, 0.5), transparent)',
                                boxShadow: '0 0 10px rgba(255, 75, 75, 0.3)'
                            }
                        }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 75, 75, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 15px rgba(255, 75, 75, 0.2)'
                            }}>
                                <Trash2 size={20} color="#FF4B4B" />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{
                                    color: '#FF4B4B',
                                    fontWeight: 600,
                                    fontSize: '1.1rem'
                                }}>
                                    Delete Multiple Modules
                                </Typography>
                                <Typography variant="caption" sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    display: 'block',
                                    mt: 0.5
                                }}>
                                    {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
                                </Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent sx={{
                            padding: '24px',
                            backgroundColor: 'rgba(255, 75, 75, 0.02)'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 2,
                                p: 3,
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 75, 75, 0.05)',
                                border: '1px solid rgba(255, 75, 75, 0.1)'
                            }}>
                                <Box sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 75, 75, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    mt: 0.5
                                }}>
                                    <Typography sx={{
                                        color: '#FF4B4B',
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}>!</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" sx={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontWeight: 500,
                                        mb: 1
                                    }}>
                                        Are you sure you want to delete these modules?
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        mb: 1
                                    }}>
                                        This action cannot be undone. All selected modules will be permanently removed, including:
                                    </Typography>
                                    <Box component="ul" sx={{
                                        pl: 2,
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.875rem',
                                        '& li': { mb: 0.5 }
                                    }}>
                                        <li>All module content and structure</li>
                                        <li>Student interactions and analytics</li>
                                        <li>References in any courses using these modules</li>
                                    </Box>
                                    <Typography variant="body2" sx={{
                                        color: '#FF4B4B',
                                        fontWeight: 500,
                                        mt: 2
                                    }}>
                                        Modules used in courses will be removed from those courses.
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '16px 24px',
                            gap: 2,
                            justifyContent: 'space-between',
                            backgroundColor: 'rgba(17, 25, 40, 0.98)'
                        }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                Selected: {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    onClick={() => setBatchDeleteDialogOpen(false)}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        px: 3,
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmBatchDelete}
                                    sx={{
                                        backgroundColor: 'rgba(255, 75, 75, 0.15)',
                                        color: '#FF4B4B',
                                        borderRadius: '8px',
                                        px: 3,
                                        fontWeight: 600,
                                        border: '1px solid rgba(255, 75, 75, 0.3)',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 75, 75, 0.25)',
                                            borderColor: 'rgba(255, 75, 75, 0.5)',
                                            boxShadow: '0 0 20px rgba(255, 75, 75, 0.3)'
                                        }
                                    }}
                                >
                                    Delete {selectedModules.length} Module{selectedModules.length !== 1 ? 's' : ''}
                                </Button>
                            </Box>
                        </DialogActions>
                    </Dialog>

                    {/* Module Selection Dialog */}
                    <Dialog
                        open={moduleSelectionDialogOpen}
                        onClose={() => setModuleSelectionDialogOpen(false)}
                        maxWidth="md"
                        fullWidth
                        sx={{
                            '& .MuiDialog-paper': {
                                backgroundColor: 'rgba(17, 25, 40, 0.95)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                color: 'white',
                                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '20px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <GraduationCap size={24} color="#22D3EE" />
                                <Typography variant="h6">
                                    Add Modules to Course
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                p: 1,
                                px: 2,
                                borderRadius: '4px'
                            }}>
                                {selectedCourse?.name}
                            </Typography>
                        </DialogTitle>
                        <DialogContent sx={{ padding: '24px' }}>
                            {/* Search Bar */}
                            <Box sx={{ position: 'relative', mb: 3 }}>
                                <Search
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: 10,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'rgba(255,255,255,0.5)'
                                    }}
                                />
                                <InputBase
                                    placeholder="Search modules to add..."
                                    value={moduleSearchTerm}
                                    onChange={(e) => setModuleSearchTerm(e.target.value)}
                                    sx={{
                                        width: '100%',
                                        pl: 4,
                                        pr: 2,
                                        py: 1,
                                        borderRadius: '4px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.07)',
                                            border: '1px solid rgba(255,255,255,0.15)'
                                        },
                                        '&:focus-within': {
                                            backgroundColor: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(34,211,238,0.3)',
                                        }
                                    }}
                                />
                            </Box>

                            {/* Modules List */}
                            <Box sx={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                pr: 1,
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.25)',
                                    }
                                }
                            }}>
                                {filteredModulesForSelection.length > 0 ? (
                                    filteredModulesForSelection.map((module) => (
                                        <Box
                                            key={module.id}
                                            sx={{
                                                p: 2,
                                                mb: 1,
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                                }
                                            }}
                                            onClick={() => {
                                                handleAddModuleToCourse(selectedCourse.id, module.id);
                                                setModuleSelectionDialogOpen(false);
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle2" sx={{
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    {module.name}
                                                    {module.shareable ? (
                                                        <Globe size={14} color="#22D3EE" />
                                                    ) : (
                                                        <Lock size={14} color="rgba(255, 255, 255, 0.5)" />
                                                    )}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                    Created: {new Date(module.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                                                    color: '#22D3EE',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(34, 211, 238, 0.2)'
                                                    }
                                                }}
                                            >
                                                <Plus size={18} />
                                            </IconButton>
                                        </Box>
                                    ))
                                ) : (
                                    <Box sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: '8px',
                                        border: '1px dashed rgba(255, 255, 255, 0.2)'
                                    }}>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                            {moduleSearchTerm ?
                                                'No matching modules found.' :
                                                'No available modules to add.'
                                            }
                                        </Typography>
                                        {moduleSearchTerm && (
                                            <Button
                                                variant="text"
                                                sx={{
                                                    color: '#22D3EE',
                                                    mt: 1,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(34, 211, 238, 0.08)'
                                                    }
                                                }}
                                                onClick={() => setModuleSearchTerm('')}
                                            >
                                                Clear Search
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '16px 24px',
                        }}>
                            <Button
                                onClick={() => setModuleSelectionDialogOpen(false)}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>

            <InfoSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                userStats={userStats}
                courses={courses}
                navigate={navigate}
            />
        </Box>
    );
}

export default BrdgeListPage;
