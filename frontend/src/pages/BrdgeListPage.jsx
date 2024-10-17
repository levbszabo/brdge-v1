// src/pages/BrdgeListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import api from '../api';
import { getAuthToken, setAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';

function BrdgeListPage() {
    const [brdges, setBrdges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [brdgeToDelete, setBrdgeToDelete] = useState(null);
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
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
                setLoading(false);
            } catch (error) {
                console.error('Error fetching brdges:', error.response || error);
                if (error.response && error.response.status === 401) {
                    setAuthToken(null);
                    navigate('/login');
                } else {
                    setError('Failed to fetch Brdges. Please try again later.');
                }
                setLoading(false);
            }
        };

        fetchBrdges();
    }, [navigate]);

    const handleDelete = (brdge) => {
        setBrdgeToDelete(brdge);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/brdges/${brdgeToDelete.id}`);
            setBrdges(brdges.filter((b) => b.id !== brdgeToDelete.id));
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting brdge:', error);
            alert('An error occurred while deleting the brdge. Please try again.');
        }
    };

    const handleShare = async (brdge) => {
        try {
            if (!brdge.public_id) {
                const response = await api.post(`/brdges/${brdge.id}/deploy`);
                brdge.public_id = response.data.public_id;
            }
            const link = `${window.location.origin}/b/${brdge.public_id}`;
            navigator.clipboard.writeText(link);
            showSnackbar('Shareable link copied to clipboard!', 'success');
        } catch (error) {
            console.error('Error sharing Brdge:', error);
            showSnackbar('Error generating shareable link.', 'error');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                Your Brdges
            </Typography>
            {brdges.length === 0 ? (
                <Typography>You haven't created any Brdges yet.</Typography>
            ) : (
                <List>
                    {brdges.map((brdge) => (
                        <ListItem
                            key={brdge.id}
                            sx={{
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    backgroundColor: 'grey.100',
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Link
                                        to={`/viewBrdge/${brdge.id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {brdge.name}
                                    </Link>
                                }
                                sx={{ flexGrow: 1 }}
                            />
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit/${brdge.id}`);
                            }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                handleShare(brdge);
                            }}>
                                <ShareIcon color={brdge.shareable ? 'primary' : 'inherit'} />
                            </IconButton>
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(brdge);
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            )}
            <Button variant="contained" color="primary" component={Link} to="/create" sx={{ mt: 3 }}>
                Create New Brdge
            </Button>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this brdge?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default BrdgeListPage;
