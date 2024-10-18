// CreateBrdgePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useSnackbar } from '../utils/snackbar';

function CreateBrdgePage() {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (id) {
            fetchBrdgeData();
        }
    }, [id]);

    const fetchBrdgeData = async () => {
        try {
            const response = await api.get(`/brdges/${id}`);
            setName(response.data.name);
        } catch (error) {
            console.error('Error fetching brdge data:', error);
            setError('Failed to fetch brdge data. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        if (file) {
            formData.append('presentation', file);
        }

        try {
            if (id) {
                await api.put(`/brdges/${id}`, formData);
                showSnackbar('Brdge updated successfully', 'success');
                navigate(`/edit/${id}`);
            } else {
                const response = await api.post('/brdges', formData);
                showSnackbar('Brdge created successfully', 'success');
                navigate(`/edit/${response.data.brdge.id}`);
            }
        } catch (error) {
            console.error('Error creating/updating brdge:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2" component="h1" align="center" sx={{ mb: 6, fontWeight: 700 }}>
                        {id ? 'Edit Brdge' : 'Create New Brdge'}
                    </Typography>
                </motion.div>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Brdge Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ mb: 3 }}>
                            <input
                                accept=".pdf,.ppt,.pptx"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                                    {file ? file.name : 'Upload Presentation'}
                                </Button>
                            </label>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loading ? <CircularProgress size={24} /> : (id ? 'Update Brdge' : 'Create Brdge')}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default CreateBrdgePage;
