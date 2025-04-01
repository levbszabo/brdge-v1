import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Alert,
    useTheme,
    useMediaQuery,
    InputAdornment,
    IconButton,
    Divider,
    Link
} from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { Email, LockOpen, PersonAdd, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../App';
import { GoogleLogin } from '@react-oauth/google';
import { setAuthToken } from '../utils/auth';
import { useSnackbar } from '../utils/snackbar';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setIsAuthenticated } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            showSnackbar('Passwords do not match', 'error');
            return;
        }

        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            showSnackbar('Password must be at least 8 characters long', 'error');
            return;
        }

        try {
            const response = await api.post('/register', { email, password });

            if (response.data && response.data.access_token) {
                setAuthToken(response.data.access_token);
                setIsAuthenticated(true);
                showSnackbar('Account created successfully!', 'success');
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl || '/home', { replace: true });
            } else {
                console.error('No access token in response:', response);
                const errorMsg = 'Registration successful but auto-login failed. Please try logging in.';
                setError(errorMsg);
                showSnackbar(errorMsg, 'warning');
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration error:', err);
            const errorMsg = err.response?.data?.error || 'An error occurred during registration';
            setError(errorMsg);
            showSnackbar(errorMsg, 'error');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setPasswordError('');
        setSuccess('');

        try {
            if (!credentialResponse.credential) {
                throw new Error('No credentials received from Google');
            }

            const response = await api.post('/auth/google', {
                credential: credentialResponse.credential
            });

            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
                setIsAuthenticated(true);
                showSnackbar('Successfully signed up with Google!', 'success');
                const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectUrl || '/home', { replace: true });
            } else {
                throw new Error('No access token received from server after Google Auth');
            }
        } catch (error) {
            console.error('Google sign-up error:', error.message);
            const errorMsg = error.response?.data?.error || 'Failed to sign up with Google';
            setError(errorMsg);
            showSnackbar(errorMsg, 'error');
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign Up failed');
        const errorMsg = 'Google Sign Up failed. Please try again.';
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
                        Create Account
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
                        Join Brdge AI and start creating.
                    </Typography>

                    <Box component="form" onSubmit={handleSignUp} sx={{ width: '100%', mt: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            label="Password (min 8 characters)"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError === 'Password must be at least 8 characters long' ? passwordError : ''}
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
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!passwordError && passwordError === 'Passwords do not match'}
                            helperText={passwordError === 'Passwords do not match' ? passwordError : ''}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOpen sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownConfirmPassword}
                                            edge="end"
                                            sx={{ color: theme.palette.text.secondary }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            startIcon={<PersonAdd />}
                        >
                            Sign Up
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
                                to="/login"
                                variant="body2"
                                sx={{ color: theme.palette.secondary.main }}
                            >
                                Already have an account? Sign In
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </motion.div>
        </Container>
    );
}

export default SignUpPage;
