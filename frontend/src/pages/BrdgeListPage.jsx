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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box>
                <Box sx={{
                    position: 'fixed',
                    bottom: { xs: 16, sm: 24 },
                    right: { xs: 16, sm: 24 },
                    left: 'auto',
                    top: 'auto',
                    zIndex: 1000,
                    display: { xs: 'none', sm: 'flex' },
                    justifyContent: 'flex-end',
                }}>
                    <UsageIndicator stats={userStats} />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Your Brdges
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        mb: 3,
                        mt: 4
                    }}>
                        <TextField
                            fullWidth
                            placeholder="Search Brdges"
                            variant="outlined"
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ maxWidth: { sm: 400 } }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/create')}
                            disabled={!canCreateBrdge()}
                            sx={{
                                minWidth: { xs: '100%', sm: 'auto' },
                                background: canCreateBrdge() ? 'linear-gradient(90deg, #2196F3, #00BCD4)' : undefined,
                                '&:hover': {
                                    background: canCreateBrdge() ? 'linear-gradient(90deg, #1976D2, #0097A7)' : undefined,
                                }
                            }}
                        >
                            Create New
                        </Button>
                    </Box>

                    <Box sx={{ pb: { xs: 12, sm: 0 } }}>
                        {filteredBrdges.length === 0 ? (
                            <EmptyBrdgeState
                                onCreateClick={() => navigate('/create')}
                                canCreate={canCreateBrdge()}
                            />
                        ) : (
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
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Dialogs */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
        </Container>
    );
}

export default BrdgeListPage;
