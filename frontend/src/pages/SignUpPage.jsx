import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Paper, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { PersonAdd } from '@mui/icons-material';
import { AuthContext } from '../App';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/register', { email, password });
            if (response.status === 201) {
                setSuccess('User registered successfully. You can now log in.');
                setIsAuthenticated(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                throw new Error('Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
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
                            mb: 1
                        }}
                    >
                        Sign Up Free
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        sx={{
                            color: theme.palette.text.secondary,
                            mb: 2
                        }}
                    >
                        No Credit Card Needed
                    </Typography>
                </motion.div>
                <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', maxWidth: '90%' }}>
                    Try Brdge AI and see how easy it is to create interactive presentations.
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{success}</Alert>}
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, md: 4 },
                        width: '100%',
                        borderRadius: '16px',
                        background: '#ffffff',
                    }}
                >
                    <Box component="form" onSubmit={handleSignUp}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            startIcon={<PersonAdd />}
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
                            Get Started
                        </Button>
                    </Box>
                </Paper>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                    By signing up, you'll get instant access to Brdge AI's powerful features.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Log in</Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default SignUpPage;
