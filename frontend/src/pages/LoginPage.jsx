import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, useTheme, useMediaQuery, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { setAuthToken } from '../utils/auth';
import { LockOpen, Email } from '@mui/icons-material';
import { AuthContext } from '../App';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
                setIsAuthenticated(true);
                navigate('/brdges');
            } else {
                throw new Error('No access token received');
            }
        } catch (error) {
            console.error('Error during login:', error.response || error);
            alert('An error occurred during login. Please try again.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await api.post('/auth/google', { token: credentialResponse.credential });
            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
                setIsAuthenticated(true);
                navigate('/brdges');
            } else {
                throw new Error('No access token received');
            }
        } catch (error) {
            console.error('Error during Google login:', error);
            alert('An error occurred during Google login. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4
        }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%' }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <Typography
                        variant={isMobile ? "h4" : "h3"}
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #00B4DB 30%, #0083B0 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        sx={{
                            color: theme.palette.text.secondary,
                            mb: 4
                        }}
                    >
                        Sign in to continue to Brdge AI
                    </Typography>

                    <Box sx={{
                        width: '100%',
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        '& > div': {
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }
                    }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log('Login Failed');
                                alert('Google login failed. Please try again.');
                            }}
                            size="large"
                            text="continue_with"
                            shape="rectangular"
                            useOneTap
                        />
                    </Box>

                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Divider sx={{ flex: 1 }} />
                        <Typography sx={{ px: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                            or continue with email
                        </Typography>
                        <Divider sx={{ flex: 1 }} />
                    </Box>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            width: '100%',
                            borderRadius: '16px',
                            background: '#ffffff',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                                InputProps={{
                                    startAdornment: <Email sx={{ mr: 1, color: theme.palette.primary.main }} />,
                                }}
                                sx={{ mb: 2 }}
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
                                InputProps={{
                                    startAdornment: <LockOpen sx={{ mr: 1, color: theme.palette.primary.main }} />,
                                }}
                                sx={{ mb: 3 }}
                            />
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    sx={{
                                        py: 1.5,
                                        borderRadius: '50px',
                                        background: 'linear-gradient(45deg, #00B4DB 30%, #0083B0 90%)',
                                        boxShadow: '0 3px 15px rgba(0, 180, 219, 0.2)',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px rgba(0, 180, 219, 0.4)',
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                            </motion.div>
                        </form>
                    </Paper>

                    <Box mt={3}>
                        <Typography variant="body1" align="center" color="text.secondary">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                style={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default LoginPage;
