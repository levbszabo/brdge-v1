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
                            <UsageIndicator
                                title="Bridges"
                                current={userStats.brdges_created}
                                limit={userStats.brdges_limit}
                                showExcess={true}
                            />

                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                            <UsageIndicator
                                title="Minutes"
                                current={userStats.minutes_used || 0}
                                limit={userStats.minutes_limit || 30}
                                showExcess={true}
                            />
                        </Box>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '280px', margin: '0 auto' }}
                        >
                            {isOverLimit() ? (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/profile')}
                                    startIcon={<AddIcon />}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        bgcolor: '#4F9CF9',
                                        color: 'white',
                                        px: 3,
                                        py: 1,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        '&:hover': {
                                            bgcolor: '#4589E1'
                                        }
                                    }}
                                >
                                    Upgrade Now
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/create')}
                                    startIcon={<AddIcon />}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        bgcolor: '#4F9CF9',
                                        color: 'white',
                                        px: 3,
                                        py: 1,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        '&:hover': {
                                            bgcolor: '#4589E1'
                                        }
                                    }}
                                >
                                    Create New Brdge
                                </Button>
                            )}
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
