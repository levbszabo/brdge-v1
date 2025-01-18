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
} from '@mui/material';
import { Search, Plus, Lock, Globe, User, MessageSquare, LineChart, ChevronDown, Copy, Check, Trash2 } from 'lucide-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { api } from '../api';
import { getAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';
import BrdgeList from '../components/BrdgeList';
import EmptyBrdgeState from '../components/EmptyBrdgeState';
import UsageIndicator from '../components/UsageIndicator';

// Unified theme colors
const theme = {
    colors: {
        primary: '#4F9CF9',
        background: '#0B0F1B',
        backgroundLight: '#101727',
        surface: 'rgba(255, 255, 255, 0.04)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: {
            primary: '#FFFFFF',
            secondary: 'rgba(255, 255, 255, 0.7)'
        }
    },
    transitions: {
        default: 'all 0.2s ease-in-out'
    }
};

// Unified styles
const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.backgroundLight} 100%)`,
        py: 8
    },
    header: {
        color: theme.colors.text.primary,
        mb: 4,
        fontWeight: 600,
        textAlign: 'center',
        position: 'relative'
    },
    controlsContainer: {
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        gap: 2
    },
    searchField: {
        width: { xs: '100%', md: '300px' },
        '& .MuiOutlinedInput-root': {
            color: theme.colors.text.primary,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 2,
            transition: theme.transitions.default,
            '& fieldset': {
                borderColor: theme.colors.border
            },
            '&:hover fieldset': {
                borderColor: theme.colors.primary
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.colors.primary
            }
        }
    },
    usageContainer: {
        display: 'flex',
        gap: 3,
        p: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 2,
        border: `1px solid ${theme.colors.border}`
    },
    actionButton: {
        textTransform: 'none',
        borderRadius: 2,
        py: 1.5,
        px: 3,
        backgroundColor: 'rgba(34, 211, 238, 0.15)',
        backdropFilter: 'blur(8px)',
        color: '#22D3EE',
        border: '1px solid rgba(34, 211, 238, 0.3)',
        boxShadow: `
            0 0 10px rgba(34, 211, 238, 0.2),
            inset 0 0 20px rgba(34, 211, 238, 0.05)
        `,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(34, 211, 238, 0.25)',
            color: '#22D3EE',
            boxShadow: `
                0 0 20px rgba(34, 211, 238, 0.3),
                0 0 40px rgba(34, 211, 238, 0.1),
                inset 0 0 20px rgba(34, 211, 238, 0.1)
            `,
            border: '1px solid rgba(34, 211, 238, 0.5)',
        },
        '&:active': {
            backgroundColor: 'rgba(34, 211, 238, 0.2)',
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)',
        }
    },
    listContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 3,
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden'
    },
    dialog: {
        '& .MuiDialog-paper': {
            backgroundColor: theme.colors.backgroundLight,
            borderRadius: 3,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text.primary
        }
    },
    shareDialog: {
        '& .MuiDialog-paper': {
            backgroundColor: theme.colors.backgroundLight,
            borderRadius: 3,
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text.primary,
            minWidth: '400px',
        }
    },
    shareLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        mt: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }
    },
    linkInput: {
        flex: 1,
        color: theme.colors.text.primary,
        fontSize: '0.875rem',
        '& input': {
            padding: 0,
        }
    },
    copyButton: {
        color: theme.colors.text.secondary,
        p: 1,
        borderRadius: 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
            color: '#22D3EE',
        }
    },
    toggleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 3,
        p: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    toggleInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
    }
};

function BrdgeListPage() {
    const [brdges, setBrdges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [brdgeToDelete, setBrdgeToDelete] = useState(null);
    const [brdgeToShare, setBrdgeToShare] = useState(null);
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

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchBrdges();
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
                return 300;
            case 'standard':
                return 120;
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
            setError('Failed to fetch Brdges');
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

    const handleView = (brdge) => {
        navigate(`/viewBrdge/${brdge.id}`);
    };

    const handleEdit = (brdge) => {
        navigate(`/edit/${brdge.id}`);
    };

    const handleShareToggle = async () => {
        try {
            const response = await api.post(`/brdges/${brdgeToShare.id}/toggle_shareable`);
            // Update the local state with the new shareable status
            setBrdgeToShare(prev => ({ ...prev, shareable: response.data.shareable }));
            // Update the brdges list with the new status
            setBrdges(brdges.map(b =>
                b.id === brdgeToShare.id
                    ? { ...b, shareable: response.data.shareable }
                    : b
            ));
            showSnackbar(
                `Brdge is now ${response.data.shareable ? 'public' : 'private'}`,
                'success'
            );
        } catch (error) {
            showSnackbar('Failed to update sharing settings', 'error');
        }
    };

    const handleShare = (brdge) => {
        setBrdgeToShare(brdge);
        setShareDialogOpen(true);
    };

    const handleCloseShare = () => {
        setShareDialogOpen(false);
        setBrdgeToShare(null);
        setLinkCopied(false);
    };

    const handleDelete = (brdge) => {
        setBrdgeToDelete(brdge);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/brdges/${brdgeToDelete.id}`);
            setBrdges(brdges.filter((b) => b.id !== brdgeToDelete.id));
            showSnackbar('Brdge deleted successfully', 'success');
            setDeleteDialogOpen(false);
            fetchStats(); // Refresh stats after deletion
        } catch (error) {
            showSnackbar('Failed to delete Brdge', 'error');
        }
    };

    const isOverLimit = () => {
        if (!userStats) return false;

        // Check if either brdges or minutes are over limit
        const isBrdgesOverLimit = userStats.brdges_limit !== 'Unlimited' &&
            parseInt(userStats.brdges_created) >= parseInt(userStats.brdges_limit);

        const isMinutesOverLimit = parseInt(userStats.minutes_used) >= parseInt(userStats.minutes_limit);

        return isBrdgesOverLimit || isMinutesOverLimit;
    };

    const canCreateBrdge = () => {
        // Check if we have valid stats
        if (!userStats) return false;

        // If on pro plan or unlimited limit, always return true
        if (userStats.brdges_limit === 'Unlimited') return true;

        // For standard plan (20 brdges) or free plan (2 brdges)
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
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Users</Typography>
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
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Avg. Interactions/User</Typography>
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
                                        {userData.isAnonymous ? 'Anonymous User' : `User ${userId}`}
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

        const handleExpandClick = () => {
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
        const shareableUrl = `${window.location.origin}/viewBrdge/${brdgeToShare?.id}`;
        navigator.clipboard.writeText(shareableUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress sx={{ color: theme.colors.primary }} />
            </Box>
        );
    }

    return (
        <Box sx={styles.pageContainer}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={styles.header}>
                    Your Brdges
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 2,
                        mb: 4,
                        pb: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #22D3EE, transparent)',
                            boxShadow: '0 0 10px rgba(34,211,238,0.3)'
                        }
                    }}
                >
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' }, position: 'relative' }}>
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                left: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'rgba(255,255,255,0.5)'
                            }}
                        />
                        <InputBase
                            placeholder="Search brdges..."
                            value={searchTerm}
                            onChange={handleSearch}
                            sx={{
                                width: '100%',
                                pl: 5,
                                pr: 2,
                                py: 1,
                                borderRadius: '50px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                },
                                '&:focus-within': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(34,211,238,0.3)',
                                    boxShadow: '0 0 15px rgba(34,211,238,0.15)'
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: { xs: '1 1 100%', sm: '0 1 auto' },
                        height: '40px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        px: 2
                    }}>
                        <UsageIndicator
                            title="Brdges"
                            current={userStats.brdges_created}
                            limit={userStats.brdges_limit}
                        />
                        <Divider orientation="vertical" flexItem sx={{
                            borderColor: 'rgba(255,255,255,0.1)',
                            height: '20px',
                            my: 'auto'
                        }} />
                        <UsageIndicator
                            title="Minutes"
                            current={userStats.minutes_used}
                            limit={userStats.minutes_limit}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => isOverLimit() ? navigate('/profile') : navigate('/create')}
                        sx={{
                            ml: { xs: 0, sm: 'auto' },
                            width: { xs: '100%', sm: 'auto' },
                            bgcolor: 'rgba(34,211,238,0.1)',
                            color: '#22D3EE',
                            borderRadius: '50px',
                            px: 3,
                            py: 1,
                            height: '40px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            border: '1px solid rgba(34,211,238,0.2)',
                            backdropFilter: 'blur(10px)',
                            textTransform: 'none',
                            boxShadow: '0 0 20px rgba(34,211,238,0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: 'rgba(34,211,238,0.15)',
                                boxShadow: '0 0 30px rgba(34,211,238,0.2)'
                            }
                        }}
                    >
                        {isOverLimit() ? 'Upgrade Plan' : 'Create New Brdge'}
                    </Button>
                </Box>

                <Box>
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
                            />
                        </Box>
                    )}
                </Box>

                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
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
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 75, 75, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(255, 75, 75, 0.2)'
                        }}>
                            <Trash2 size={18} color="#FF4B4B" />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{
                                color: '#FF4B4B',
                                fontWeight: 600,
                                fontSize: '1.1rem'
                            }}>
                                Delete Brdge
                            </Typography>
                            <Typography variant="caption" sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                display: 'block',
                                mt: 0.5
                            }}>
                                {brdgeToDelete?.name}
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
                            p: 2,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 75, 75, 0.05)',
                            border: '1px solid rgba(255, 75, 75, 0.1)'
                        }}>
                            <Box sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 75, 75, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                mt: 0.5
                            }}>
                                <Typography sx={{
                                    color: '#FF4B4B',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}>!</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" sx={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 500,
                                    mb: 1
                                }}>
                                    Are you sure you want to delete this Brdge?
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '0.875rem'
                                }}>
                                    This action cannot be undone. All associated data, including conversations and analytics, will be permanently removed.
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '16px 24px',
                        gap: 2,
                        backgroundColor: 'rgba(17, 25, 40, 0.98)'
                    }}>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
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
                            onClick={confirmDelete}
                            sx={{
                                backgroundColor: 'rgba(255, 75, 75, 0.1)',
                                color: '#FF4B4B',
                                borderRadius: '8px',
                                px: 3,
                                border: '1px solid rgba(255, 75, 75, 0.2)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 75, 75, 0.15)',
                                    border: '1px solid rgba(255, 75, 75, 0.3)',
                                    boxShadow: '0 0 20px rgba(255, 75, 75, 0.2)'
                                }
                            }}
                        >
                            Delete Brdge
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={shareDialogOpen}
                    onClose={handleCloseShare}
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: 'rgba(17, 25, 40, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            color: 'white',
                            minWidth: '400px',
                            boxShadow: '0 0 40px rgba(0,0,0,0.5)'
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
                        <Typography variant="h6">Share Brdge</Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                px: 2,
                                py: 0.75,
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {brdgeToShare?.name}
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ padding: '24px' }}>
                        <Box sx={{ mt: 1 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                mb: 3
                            }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{
                                        color: brdgeToShare?.shareable ? '#22D3EE' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        {brdgeToShare?.shareable ? (
                                            <Globe size={18} style={{
                                                filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.4))'
                                            }} />
                                        ) : (
                                            <Lock size={18} />
                                        )}
                                        {brdgeToShare?.shareable ? 'Public access' : 'Private access'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
                                        {brdgeToShare?.shareable
                                            ? 'Anyone with the link can view this Brdge'
                                            : 'Only you can view this Brdge'}
                                    </Typography>
                                </Box>
                                <Switch
                                    checked={brdgeToShare?.shareable || false}
                                    onChange={handleShareToggle}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#22D3EE',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: 'rgba(34, 211, 238, 0.3)',
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 2,
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)'
                                }
                            }}>
                                <InputBase
                                    value={brdgeToShare ? `${window.location.origin}/viewBrdge/${brdgeToShare.id}` : ''}
                                    readOnly
                                    fullWidth
                                    sx={{
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        '& input': {
                                            padding: '0'
                                        }
                                    }}
                                />
                                <IconButton
                                    onClick={handleCopyLink}
                                    size="small"
                                    sx={{
                                        color: linkCopied ? '#22D3EE' : 'rgba(255, 255, 255, 0.7)',
                                        backgroundColor: linkCopied ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: linkCopied ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                                </IconButton>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '16px 24px',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant="caption" sx={{
                            color: linkCopied ? '#22D3EE' : 'rgba(255, 255, 255, 0.5)',
                            transition: 'all 0.2s ease'
                        }}>
                            {linkCopied ? 'Link copied!' : 'Click the copy button to copy the link'}
                        </Typography>
                        <Button
                            onClick={handleCloseShare}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={linkCopied}
                    autoHideDuration={2000}
                    onClose={() => setLinkCopied(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" sx={{ backgroundColor: '#22D3EE', color: 'white' }}>
                        Link copied to clipboard
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}

export default BrdgeListPage;
