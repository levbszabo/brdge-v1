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
    LinearProgress,
    Divider,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import { api } from '../api';
import { getAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';
import BrdgeList from '../components/BrdgeList';
import EmptyBrdgeState from '../components/EmptyBrdgeState';
import UsageIndicator from '../components/UsageIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TimelineIcon from '@mui/icons-material/Timeline';

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

    const handleShare = (brdge) => {
        setBrdgeToShare(brdge);
        setShareDialogOpen(true);
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

    const confirmShare = async () => {
        try {
            const response = await api.post(`/brdges/${brdgeToShare.id}/toggle_shareable`);
            const updatedBrdges = brdges.map(b =>
                b.id === brdgeToShare.id
                    ? { ...b, shareable: response.data.shareable }
                    : b
            );
            setBrdges(updatedBrdges);
            showSnackbar(`Brdge is now ${response.data.shareable ? 'public' : 'private'}`, 'success');
            setShareDialogOpen(false);
        } catch (error) {
            showSnackbar('Failed to update sharing settings', 'error');
        }
    };

    const canCreateBrdge = () => {
        // Check if we have valid stats
        if (!userStats) return false;

        // Log current stats for debugging
        console.log('Current stats:', {
            created: userStats.brdges_created,
            limit: userStats.brdges_limit,
            accountType: userStats.account_type
        });

        // If on pro plan or unlimited limit, always return true
        if (userStats.brdges_limit === 'Unlimited') return true;

        // For standard plan (20 brdges) or free plan (2 brdges)
        const currentLimit = parseInt(userStats.brdges_limit);
        const currentCount = parseInt(userStats.brdges_created);

        return currentCount < currentLimit;
    };

    const fetchConversationData = async (brdgeId) => {
        setLoadingConversations(true);
        try {
            const response = await api.get(`/brdges/${brdgeId}/viewer-conversations`);
            const conversations = response.data.conversations || [];

            // Process conversations to group by user and calculate metrics
            const processedData = conversations.reduce((acc, conv) => {
                const userId = conv.user_id || conv.anonymous_id;
                if (!acc[userId]) {
                    acc[userId] = {
                        messages: [],
                        totalInteractions: 0,
                        uniqueSlides: new Set(),
                        firstInteraction: new Date(conv.timestamp),
                        lastInteraction: new Date(conv.timestamp),
                        isAnonymous: !conv.user_id
                    };
                }

                acc[userId].messages.push(conv);
                acc[userId].totalInteractions++;
                acc[userId].uniqueSlides.add(conv.slide_number);
                acc[userId].lastInteraction = new Date(Math.max(
                    acc[userId].lastInteraction,
                    new Date(conv.timestamp)
                ));

                return acc;
            }, {});

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

    const ConversationMetrics = ({ brdgeId, expanded }) => {
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
                            <PersonOutlineIcon color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Users</Typography>
                                <Typography variant="h6">{totalUsers}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatBubbleOutlineIcon color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Total Interactions</Typography>
                                <Typography variant="h6">{totalInteractions}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimelineIcon color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">Avg. Interactions/User</Typography>
                                <Typography variant="h6">{averageInteractionsPerUser}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const UserConversationList = ({ brdgeId, data }) => {
        const [expandedUser, setExpandedUser] = useState(null);

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
                            mb: 1
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonOutlineIcon fontSize="small" />
                                        {userData.isAnonymous ? 'Anonymous User' : `User ${userId}`}
                                        {userData.isAnonymous && (
                                            <Chip
                                                label="Anonymous"
                                                size="small"
                                                variant="outlined"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Last active: {new Date(userData.lastInteraction).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Tooltip title="Total Interactions">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <ChatBubbleOutlineIcon fontSize="small" />
                                            <Typography>{userData.totalInteractions}</Typography>
                                        </Box>
                                    </Tooltip>
                                    <Tooltip title="Unique Slides Viewed">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <TimelineIcon fontSize="small" />
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
                                bgcolor: 'rgba(0, 0, 0, 0.02)',
                                borderRadius: 1
                            }}>
                                {userData.messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 1,
                                            p: 1,
                                            borderLeft: '2px solid',
                                            borderColor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                                            bgcolor: 'background.paper',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {new Date(message.timestamp).toLocaleString()} - Slide {message.slide_number}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            pt: { xs: '80px', md: 12 },
            pb: { xs: 4, md: 6 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '5%',
                left: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(79, 156, 249, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 20s infinite alternate',
                zIndex: 0,
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '5%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0, 180, 219, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 25s infinite alternate-reverse',
                zIndex: 0,
            }
        }}>
            <Container maxWidth="lg" sx={{
                px: { xs: 0, md: 2 }
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        align="center"
                        sx={{
                            mt: { xs: 4, md: 0 },
                            mb: { xs: 2, md: 4 },
                            fontWeight: '600',
                            fontSize: { xs: '1.75rem', md: '4.5rem' },
                            color: 'white',
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            position: 'relative',
                            textShadow: '0 0 40px rgba(255, 255, 255, 0.25)',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '3px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: '2px',
                                boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
                            }
                        }}
                    >
                        Your Brdges
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        mb: { xs: 2, sm: 6 },
                        mt: { xs: 3, sm: 8 },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', sm: 'center' },
                        position: 'relative',
                        zIndex: 2,
                    }}>
                        <TextField
                            placeholder="Search Brdges"
                            variant="outlined"
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                maxWidth: { sm: 300 },
                                width: { xs: '100%', sm: 'auto' },
                                mb: { xs: 2, sm: 0 },
                                '& .MuiOutlinedInput-root': {
                                    height: { xs: '45px', sm: 'auto' },
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        transition: 'all 0.2s ease-in-out',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(79, 156, 249, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4F9CF9',
                                        borderWidth: '1px',
                                        boxShadow: '0 0 10px rgba(79, 156, 249, 0.2)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.6)',
                                },
                                '& input::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    opacity: 1,
                                }
                            }}
                        />

                        <Box sx={{
                            display: 'flex',
                            gap: 3,
                            px: 3,
                            py: 2,
                            background: 'rgba(2, 6, 23, 0.5)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            minWidth: { xs: '100%', sm: '280px' },
                        }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 0.5
                                }}>
                                    <Typography variant="caption" sx={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                    }}>
                                        Bridges
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'white',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                    }}>
                                        {userStats.brdges_created}/{userStats.brdges_limit === 'Unlimited' ? '∞' : userStats.brdges_limit}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={userStats.brdges_limit === 'Unlimited' ? 0 : (userStats.brdges_created / parseInt(userStats.brdges_limit)) * 100}
                                    sx={{
                                        height: 2,
                                        borderRadius: 1.5,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        '& .MuiLinearProgress-bar': {
                                            background: 'linear-gradient(90deg, #007AFF, #00B4DB)',
                                            borderRadius: 1.5
                                        }
                                    }}
                                />
                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 0.5
                                }}>
                                    <Typography variant="caption" sx={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                    }}>
                                        Minutes
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: 'white',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                    }}>
                                        {userStats.minutes_used || 0}/{userStats.minutes_limit || 30}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={((userStats.minutes_used || 0) / (userStats.minutes_limit || 30)) * 100}
                                    sx={{
                                        height: 2,
                                        borderRadius: 1.5,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        '& .MuiLinearProgress-bar': {
                                            background: 'linear-gradient(90deg, #007AFF, #00B4DB)',
                                            borderRadius: 1.5
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ position: 'relative', zIndex: 2 }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/create')}
                                disabled={!canCreateBrdge()}
                                sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    mt: { xs: 2, sm: 0 },
                                    py: { xs: 1.2, sm: 1.5 },
                                    borderRadius: '50px',
                                    background: canCreateBrdge()
                                        ? 'linear-gradient(45deg, #4F9CF9, #00B4DB)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    letterSpacing: '0.02em',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(79, 156, 249, 0.2)',
                                    position: 'relative',
                                    zIndex: 2,
                                    '&:hover': {
                                        background: canCreateBrdge()
                                            ? 'linear-gradient(45deg, #00B4DB, #4F9CF9)'
                                            : 'rgba(255, 255, 255, 0.15)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(79, 156, 249, 0.4)',
                                    },
                                }}
                            >
                                Create New Brdge
                            </Button>
                        </motion.div>
                    </Box>

                    <Box sx={{
                        pb: { xs: 8, sm: 0 },
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {filteredBrdges.length === 0 ? (
                            <EmptyBrdgeState
                                onCreateClick={() => navigate('/create')}
                                canCreate={canCreateBrdge()}
                            />
                        ) : (
                            <Box sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                overflow: 'hidden'
                            }}>
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
                                    expandedBrdge={expandedBrdge}
                                    setExpandedBrdge={setExpandedBrdge}
                                    conversationData={conversationData}
                                    loadingConversations={loadingConversations}
                                    onExpandBrdge={(brdgeId) => {
                                        if (!conversationData[brdgeId]) {
                                            fetchConversationData(brdgeId);
                                        }
                                        setExpandedBrdge(expandedBrdge === brdgeId ? null : brdgeId);
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                </motion.div>
            </Container>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    }
                }}
            >
                <DialogTitle>Delete Brdge</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this Brdge? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
                <DialogTitle>Share Brdge</DialogTitle>
                <DialogContent>
                    Do you want to make this Brdge {brdgeToShare?.shareable ? 'private' : 'public'}?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmShare} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>

            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                `}
            </style>
        </Box>
    );
}

export default BrdgeListPage;
