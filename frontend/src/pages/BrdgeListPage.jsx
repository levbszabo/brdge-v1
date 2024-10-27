// src/pages/BrdgeListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, List, ListItem, ListItemText,
    CircularProgress, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Box, TextField, Tooltip, Paper, InputAdornment,
    useTheme, Autocomplete, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { getAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';

function BrdgeListPage() {
    const [brdges, setBrdges] = useState([]);
    const [filteredBrdges, setFilteredBrdges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [brdgeToDelete, setBrdgeToDelete] = useState(null);
    const [brdgeToShare, setBrdgeToShare] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();

    useEffect(() => {
        fetchBrdges();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearching(true);
            const filtered = brdges.filter(brdge =>
                brdge.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBrdges(filtered);
            setSearching(false);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, brdges]);

    const fetchBrdges = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                navigate('/login');
                return;
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await api.get('/brdges');
            setBrdges(response.data.brdges || []);
            setFilteredBrdges(response.data.brdges || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brdges:', error.response || error);
            setError('Failed to fetch Brdges. Please try again later.');
            setLoading(false);
        }
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
        } catch (error) {
            console.error('Error deleting brdge:', error);
            showSnackbar('An error occurred while deleting the brdge. Please try again.', 'error');
        }
    };

    const handleShare = (brdge) => {
        setBrdgeToShare(brdge);
        setShareDialogOpen(true);
    };

    const confirmShare = async () => {
        try {
            const response = await api.post(`/brdges/${brdgeToShare.id}/toggle_shareable`);
            const updatedBrdge = { ...brdgeToShare, shareable: response.data.shareable };
            setBrdges(brdges.map(b => b.id === updatedBrdge.id ? updatedBrdge : b));
            showSnackbar(`Brdge is now ${response.data.shareable ? 'shareable' : 'private'}`, 'success');
            setShareDialogOpen(false);
        } catch (error) {
            console.error('Error toggling brdge shareability:', error);
            showSnackbar('An error occurred. Please try again.', 'error');
        }
    };

    const copyShareableLink = (brdge) => {
        const link = `${window.location.origin}/b/${brdge.public_id}`;
        navigator.clipboard.writeText(link);
        showSnackbar('Shareable link copied to clipboard!', 'success');
    };

    const handleCreateNewBrdge = () => {
        navigate('/create', { state: { redirectToEdit: true } });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
            <Box sx={{ my: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2" component="h1" align="center" sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 4,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        lineHeight: 1.2
                    }}>
                        Your Brdges
                    </Typography>
                </motion.div>
                <Paper elevation={3} sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: '16px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                }}>
                    <Autocomplete
                        freeSolo
                        options={brdges.map((option) => option.name)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                variant="outlined"
                                placeholder="Search your Brdges"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <React.Fragment>
                                            {searching ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                        onInputChange={(event, newInputValue) => {
                            setSearchTerm(newInputValue);
                        }}
                        sx={{ maxWidth: '600px', mx: 'auto', display: 'block' }}
                    />
                </Paper>

                {/* Move the Create New Brdge button here */}
                <Box textAlign="center" mb={4}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateNewBrdge}
                            startIcon={<AddIcon />}
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1.1rem',
                                borderRadius: '25px',
                                background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #0058cc, #00a3cc)',
                                },
                            }}
                        >
                            Create New Brdge
                        </Button>
                    </motion.div>
                </Box>

                {filteredBrdges.length === 0 ? (
                    <Box textAlign="center" mt={4}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            No Brdges found. Create your first Brdge!
                        </Typography>
                    </Box>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Grid container spacing={3}>
                            {filteredBrdges.map((brdge) => (
                                <Grid item xs={12} sm={6} md={4} key={brdge.id}>
                                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                p: 3,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                borderRadius: '16px',
                                                transition: 'all 0.3s ease-in-out',
                                                '&:hover': {
                                                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                                                },
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    component={Link}
                                                    to={`/viewBrdge/${brdge.id}`}
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: theme.palette.primary.main,
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            textDecoration: 'underline',
                                                        },
                                                    }}
                                                >
                                                    {brdge.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                <Tooltip title="Edit Brdge">
                                                    <IconButton onClick={() => navigate(`/edit/${brdge.id}`)} sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={brdge.shareable ? "Shareable" : "Make Shareable"}>
                                                    <IconButton onClick={() => handleShare(brdge)} sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                                                        <ShareIcon color={brdge.shareable ? 'primary' : 'inherit'} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Brdge">
                                                    <IconButton onClick={() => handleDelete(brdge)} sx={{ '&:hover': { color: theme.palette.error.main } }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                )}
            </Box>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this brdge? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
                <DialogTitle>Toggle Shareability</DialogTitle>
                <DialogContent>
                    {brdgeToShare && (
                        <>
                            <Typography>
                                Do you want to make "{brdgeToShare.name}" {brdgeToShare.shareable ? "private" : "shareable"}?
                            </Typography>
                            {brdgeToShare.shareable && (
                                <Button
                                    onClick={() => copyShareableLink(brdgeToShare)}
                                    sx={{ mt: 2 }}
                                >
                                    Copy Shareable Link
                                </Button>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmShare} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default BrdgeListPage;
