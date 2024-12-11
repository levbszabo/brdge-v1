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

        if (file && file.size > 10 * 1024 * 1024) {  // 10MB in bytes
            setError('File size exceeds 10MB limit. Please choose a smaller file.');
            setLoading(false);
            return;
        }

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
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '15%',
                width: '400px',
                height: '400px',
                border: '1px solid rgba(255,255,255,0.1)',
                transform: 'rotate(45deg)',
                animation: 'rotate 30s linear infinite',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -1,
                    padding: '1px',
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                }
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '300px',
                height: '300px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                animation: 'rotateReverse 25s linear infinite',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -1,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2))',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                }
            }} />
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ my: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h2" component="h1" align="center" sx={{
                            mb: 6,
                            fontWeight: 700,
                            color: 'white',
                            textShadow: '0 0 40px rgba(255, 255, 255, 0.25)',
                            textTransform: 'capitalize',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '4px',
                                background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
                                borderRadius: '2px'
                            }
                        }}>
                            {id ? 'Edit Brdge' : 'Create New Brdge'}
                        </Typography>
                    </motion.div>
                    <Paper elevation={3} sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
                        }
                    }}>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Brdge Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
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
                                        '&.Mui-focused': {
                                            color: '#4F9CF9',
                                        },
                                    },
                                }}
                            />
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <input
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'rgba(255,255,255,0.5)',
                                            borderWidth: '2px',
                                            padding: '12px 28px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: '#4F9CF9',
                                                bgcolor: 'rgba(79, 156, 249, 0.1)',
                                                borderWidth: '2px',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 15px rgba(79, 156, 249, 0.2)'
                                            }
                                        }}
                                    >
                                        {file ? file.name : 'Select PDF File'}
                                    </Button>
                                </label>

                                <Box sx={{
                                    mt: 3,
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(79, 156, 249, 0.05)',
                                    border: '1px solid rgba(79, 156, 249, 0.1)'
                                }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.9rem',
                                            fontWeight: 500,
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <span style={{ opacity: 0.9 }}>📄</span>
                                        Upload your document (max 20MB)
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: 4,
                                        mb: 2,
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.85rem',
                                    }}>
                                        <span>📊 Presentations</span>
                                        <span>📝 Documents</span>
                                        <span>📚 Research</span>
                                        <span>📖 Guides</span>
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            fontSize: '0.8rem',
                                            textAlign: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <span style={{ color: '#4F9CF9' }}>✨</span>
                                        Save your document as PDF for the best AI experience
                                    </Typography>
                                </Box>
                            </Box>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        borderRadius: '50px',
                                        background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
                                        fontWeight: '600',
                                        letterSpacing: '0.02em',
                                        textTransform: 'none',
                                        transition: 'all 0.3s ease-in-out',
                                        boxShadow: '0 4px 15px rgba(79, 156, 249, 0.2)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #00B4DB, #4F9CF9)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(79, 156, 249, 0.4)',
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : (id ? 'Update Brdge' : 'Create Brdge')}
                                </Button>
                            </motion.div>
                        </form>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}

export default CreateBrdgePage;
