import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { setAuthToken } from '../utils/auth';
import { LockOpen, Email } from '@mui/icons-material';
import { AuthContext } from '../App';
import { GoogleLogin } from '@react-oauth/google';
import { useSnackbar } from '../utils/snackbar';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setIsAuthenticated } = useContext(AuthContext);
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
                setIsAuthenticated(true);
                navigate('/brdges');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid email or password');
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            console.log('Google response:', response);
            const result = await api.post('/auth/google', {
                credential: response.credential
            });
            console.log('Backend response:', result);

            if (result.data.access_token) {
                localStorage.setItem('token', result.data.access_token);
                setIsAuthenticated(true);

                navigate('/brdges', { replace: true });

                showSnackbar('Successfully logged in with Google', 'success');
            }
        } catch (error) {
            console.error('Login error:', error);
            showSnackbar('Failed to login with Google', 'error');
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign In failed');
        setError('Google Sign In failed. Please try again.');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
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
            {/* Updated geometric shapes */}
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
            <Box sx={{
                position: 'absolute',
                top: '40%',
                right: '20%',
                width: '200px',
                height: '200px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                animation: 'float 15s ease-in-out infinite alternate',
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

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography
                            variant={isMobile ? "h3" : "h2"}
                            component="h1"
                            align="center"
                            sx={{
                                mb: { xs: 3, md: 4 },
                                fontWeight: '600',
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                color: 'white',
                                textTransform: 'none',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.1,
                                position: 'relative',
                                textShadow: '0 0 40px rgba(255, 255, 255, 0.25)',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-16px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '80px',
                                    height: '4px',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    borderRadius: '2px',
                                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
                                }
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{
                                mb: 6,
                                color: 'rgba(255, 255, 255, 0.8)',
                                maxWidth: '300px',
                                mx: 'auto',
                                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                                fontWeight: '400',
                                letterSpacing: '0.01em',
                                lineHeight: 1.6
                            }}
                        >
                            Sign in to continue to Brdge AI
                        </Typography>

                        {/* Login form box with enhanced styling */}
                        <Box sx={{
                            width: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            p: 4,
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
                            {error && (
                                <Typography
                                    color="error"
                                    sx={{
                                        mb: 2,
                                        textAlign: 'center',
                                        color: '#ff6b6b'
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}

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
                                    onError={handleGoogleError}
                                    useOneTap={false}
                                    theme="filled_blue"
                                    size="large"
                                    text="signin_with"
                                    shape="rectangular"
                                    width={isMobile ? "250" : "300"}
                                />
                            </Box>

                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3
                            }}>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                                <Typography sx={{ px: 2, color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                                    or continue with email
                                </Typography>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                            </Box>

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <Email sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.6)' }} />,
                                    }}
                                    sx={{
                                        mb: 2,
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
                                <TextField
                                    label="Password"
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <LockOpen sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.6)' }} />,
                                    }}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#4F9CF9',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 255, 0.6)',
                                        },
                                    }}
                                />
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            borderRadius: '50px',
                                            background: 'linear-gradient(45deg, #4F9CF9, #00B4DB)',
                                            fontSize: '1rem',
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
                                        Sign In
                                    </Button>
                                </motion.div>
                            </form>
                        </Box>

                        <Box mt={3}>
                            <Typography variant="body1" align="center" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    style={{
                                        color: '#4F9CF9',
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </motion.div>
            </Container>

            <style>
                {`
                    @keyframes float {
                        0% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                        100% { transform: translateY(0px) rotate(0deg); }
                    }
                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotateReverse {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                `}
            </style>
        </Box>
    );
}

export default LoginPage;
