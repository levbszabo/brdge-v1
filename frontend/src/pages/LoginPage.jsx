import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { setAuthToken } from '../utils/auth';
import { LockOpen } from '@mui/icons-material';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
                window.location.href = '/brdges';
                navigate('/brdges');
            } else {
                throw new Error('No access token received');
            }
        } catch (error) {
            console.error('Error during login:', error.response || error);
            alert('An error occurred during login. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: { xs: -8, sm: -4 }, // Adjust top margin for mobile and desktop
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography
                        variant={isMobile ? "h4" : "h3"}
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            mb: 2
                        }}
                    >
                        Login to Brdge AI
                    </Typography>
                </motion.div>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, md: 4 },
                        width: '100%',
                        borderRadius: '16px',
                        background: '#ffffff',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.dark,
                                    },
                                },
                            }}
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.dark,
                                    },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            size="large"
                            startIcon={<LockOpen />}
                            sx={{
                                mt: 3,
                                mb: 2,
                                borderRadius: '50px',
                                background: 'linear-gradient(45deg, #00B4DB 30%, #0083B0 90%)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 20px rgba(0, 180, 219, 0.4)',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
                <Box mt={2}>
                    <Typography variant="body1" align="center">
                        Don't have an account? <Link to="/signup" style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Sign up</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default LoginPage;
