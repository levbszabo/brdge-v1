import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';
import { setAuthToken } from '../utils/auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.access_token) {
                setAuthToken(response.data.access_token);
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
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Login to Brdge AI
                    </Typography>
                </motion.div>
                <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
                <Box mt={2}>
                    <Typography variant="body2" align="center">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default LoginPage;
