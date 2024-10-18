// src/pages/BrdgeListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Button, List, ListItem, ListItemText,
    CircularProgress, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Box, TextField, Tooltip, Paper, InputAdornment,
    useTheme, Autocomplete
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
        <Container maxWidth="md">
            <Box sx={{ my: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 4, fontSize: "2rem" }}>
                        Your Brdges
                    </Typography>
                </motion.div>
                <Paper elevation={3} sx={{
                    p: 2,
                    mb: 4,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    '&:focus-within': {
                        borderColor: "#0072ff",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                    }
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
                        sx={{ maxWidth: '400px', mx: 'auto', display: 'block' }}
                    />
                </Paper>
                {filteredBrdges.length === 0 ? (
                    <Box textAlign="center" mt={4}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Brdges found. Create your first Brdge!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/create"
                            startIcon={<AddIcon />}
                            sx={{ mt: 2 }}
                        >
                            Create New Brdge
                        </Button>
                    </Box>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <List>
                            {filteredBrdges.map((brdge) => (
                                <Paper
                                    elevation={2}
                                    sx={{
                                        mb: 2,
                                        overflow: 'hidden',
                                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                        }
                                    }}
                                    key={brdge.id}
                                >
                                    <ListItem
                                        component={Link}
                                        to={`/viewBrdge/${brdge.id}`}
                                        sx={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 400,
                                                        '&:hover': {
                                                            color: theme.palette.primary.main,
                                                            textDecoration: 'underline',
                                                        }
                                                    }}
                                                >
                                                    {brdge.name}
                                                </Typography>
                                            }
                                        />
                                        <Tooltip title="Edit Brdge">
                                            <IconButton onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                navigate(`/edit/${brdge.id}`);
                                            }} sx={{ '&:hover': { transform: 'scale(1.1)' } }}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={brdge.shareable ? "Shareable" : "Make Shareable"}>
                                            <IconButton onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleShare(brdge);
                                            }} sx={{ '&:hover': { transform: 'scale(1.1)' } }}>
                                                <ShareIcon color={brdge.shareable ? 'primary' : 'inherit'} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Brdge">
                                            <IconButton onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDelete(brdge);
                                            }} sx={{ '&:hover': { transform: 'scale(1.1)' } }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItem>
                                </Paper>
                            ))}
                        </List>
                        <Box textAlign="center" mt={4}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="/create"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        fontSize: '1.1rem',
                                        borderRadius: '25px',
                                        background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                                        '&:hover': {
                                            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                                            background: 'linear-gradient(90deg, #0058cc, #00a3cc)',
                                        },
                                    }}
                                >
                                    Create New Brdge
                                </Button>
                            </motion.div>
                        </Box>
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
