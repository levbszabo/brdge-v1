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
        brdges_limit: '2'
    });

    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchBrdges();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/user/stats');
            setUserStats(response.data);
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
        if (userStats.brdges_limit === 'Unlimited') return true;
        return userStats.brdges_created < parseInt(userStats.brdges_limit);
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
            pt: 12, // Account for header
            pb: 6,
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
                animation: 'float 20s infinite alternate'
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
                animation: 'float 25s infinite alternate-reverse'
            }
        }}>
            <Container maxWidth="lg">
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
                            mb: { xs: 3, md: 4 },
                            fontWeight: '600',
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                            color: 'white',
                            textTransform: 'none',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            position: 'relative',
                            textShadow: '0 0 40px rgba(255, 255, 255, 0.25)',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '80px',
                                height: '4px',
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
                        mb: 6,
                        mt: 8,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TextField
                            fullWidth
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
                                maxWidth: { sm: 400 },
                                '& .MuiOutlinedInput-root': {
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
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/create')}
                                disabled={!canCreateBrdge()}
                                sx={{
                                    minWidth: { xs: '100%', sm: 'auto' },
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: '50px',
                                    background: canCreateBrdge()
                                        ? 'linear-gradient(45deg, #4F9CF9, #00B4DB)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    letterSpacing: '0.02em',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(79, 156, 249, 0.2)',
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
                        pb: { xs: 12, sm: 0 },
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
                                />
                            </Box>
                        )}
                    </Box>
                </motion.div>
            </Container>

            {/* Usage Indicator */}
            <Box sx={{
                position: 'fixed',
                bottom: { xs: 16, sm: 24 },
                right: { xs: 16, sm: 24 },
                zIndex: 1000
            }}>
                <UsageIndicator stats={userStats} />
            </Box>

            {/* Dialogs with updated styling */}
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
