import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Paper, useTheme, useMediaQuery, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { PersonAdd, Email, LockOpen } from '@mui/icons-material';
import { AuthContext } from '../App';
import { GoogleLogin } from '@react-oauth/google';
import { setAuthToken } from '../utils/auth';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        setPasswordError('');

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
            console.error('Registration error:', err.message);
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            console.log('Received Google sign-in response');

            if (!credentialResponse.credential) {
                setError('No credentials received from Google');
                return;
            }

            const response = await api.post('/auth/google', {
                credential: credentialResponse.credential
            });

            console.log('Google authentication completed:', response.status === 200 ? 'success' : 'failed');

            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
                setIsAuthenticated(true);
                setSuccess('Successfully signed up with Google!');
                setTimeout(() => {
                    navigate('/brdges');
                }, 1000);
            } else {
                throw new Error('No access token received');
            }
        } catch (error) {
            console.error('Google sign-up error:', error.message);
            setError(error.response?.data?.error || 'Failed to login with Google');
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
                    <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', maxWidth: '90%' }}>
                        Try Brdge AI and see how easy it is to create interactive presentations.
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{success}</Alert>}

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
                                console.error('Google Sign In failed');
                                setError('Google Sign In failed. Please try again.');
                            }}
                            useOneTap={false}
                            theme="outline"
                            size="large"
                            text="signup_with"
                            shape="rectangular"
                            width="300"
                            cookiePolicy={'single_host_origin'}
                        />
                    </Box>

                    {error && error.includes('cookies') && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
                            Tip: To enable cookies in Chrome, go to Settings → Privacy and Security → Cookies and other site data
                        </Typography>
                    )}

                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Divider sx={{ flex: 1 }} />
                        <Typography sx={{ px: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
                            or sign up with email
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
                        <form onSubmit={handleSignUp}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <Email sx={{ mr: 1, color: theme.palette.primary.main }} />,
                                }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                margin="normal"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (confirmPassword && e.target.value !== confirmPassword) {
                                        setPasswordError('Passwords do not match');
                                    } else {
                                        setPasswordError('');
                                    }
                                }}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <LockOpen sx={{ mr: 1, color: theme.palette.primary.main }} />,
                                }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                required
                                margin="normal"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (password !== e.target.value) {
                                        setPasswordError('Passwords do not match');
                                    } else {
                                        setPasswordError('');
                                    }
                                }}
                                error={!!passwordError}
                                helperText={passwordError}
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
                                    startIcon={<PersonAdd />}
                                    disabled={!!passwordError}
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
                                    Get Started Free
                                </Button>
                            </motion.div>
                        </form>
                    </Paper>

                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
                        By signing up, you'll get instant access to Brdge AI's powerful features.
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                color: theme.palette.primary.main,
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Log in
                        </Link>
                    </Typography>
                </Box>
            </motion.div>
        </Container>
    );
}

export default SignUpPage;
