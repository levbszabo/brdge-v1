import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    InputAdornment,
    IconButton,
    Divider,
    Link
} from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { setAuthToken } from '../utils/auth';
import { LockOpen, Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../App';
import { GoogleLogin } from '@react-oauth/google';
import { useSnackbar } from '../utils/snackbar';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setIsAuthenticated } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
                setIsAuthenticated(true);
                showSnackbar('Login successful!', 'success');
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl || '/home', { replace: true });
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMsg = error.response?.data?.message || 'Invalid email or password';
            setError(errorMsg);
            showSnackbar(errorMsg, 'error');
        }
    };

    const handleGoogleSuccess = async (response) => {
        setError('');
        try {
            const result = await api.post('/auth/google', {
                credential: response.credential
            });

            if (result.data.access_token) {
                setAuthToken(result.data.access_token);
                setIsAuthenticated(true);
                showSnackbar('Successfully logged in with Google', 'success');
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl || '/home', { replace: true });
            }
        } catch (error) {
            console.error('Google Login error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to login with Google';
            setError(errorMsg);
            showSnackbar(errorMsg, 'error');
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign In failed');
        const errorMsg = 'Google Sign In failed. Please try again.';
        setError(errorMsg);
        showSnackbar(errorMsg, 'error');
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 128px)',
                py: { xs: 4, sm: 6, md: 8 },
                position: 'relative',
                zIndex: 1,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ width: '100%' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: { xs: 3, sm: 4 },
                        bgcolor: theme.palette.background.paper,
                        borderRadius: theme.shape.borderRadius * 1.5,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[3],
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        align="center"
                        sx={{
                            mb: 2,
                            fontFamily: theme.typography.h1.fontFamily,
                            fontWeight: '600',
                            fontSize: { xs: '2.2rem', sm: '2.5rem' },
                            color: theme.palette.text.primary,
                            lineHeight: 1.2,
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            mb: 4,
                            fontFamily: theme.typography.body1.fontFamily,
                            color: theme.palette.text.secondary,
                            maxWidth: '300px',
                            mx: 'auto',
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                            lineHeight: 1.6,
                        }}
                    >
                        Sign in to continue to Brdge AI
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOpen sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            sx={{ color: theme.palette.text.secondary }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {error && (
                            <Typography
                                color="error"
                                variant="body2"
                                sx={{ mt: 1, mb: 1, textAlign: 'center' }}
                            >
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Sign In
                        </Button>

                        <Divider sx={{ my: 3, color: theme.palette.text.disabled, fontFamily: theme.typography.caption.fontFamily }}>OR</Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                shape="rectangular"
                                width={isMobile ? "280px" : "320px"}
                            />
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                component={RouterLink}
                                to="/signup"
                                variant="body2"
                                sx={{ color: theme.palette.secondary.main }}
                            >
                                Don't have an account? Sign Up
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default LoginPage;
