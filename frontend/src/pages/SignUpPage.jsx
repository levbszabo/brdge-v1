import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { api } from '../api';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/register', { email, password });
            if (response.status === 201) {
                setSuccess('User registered successfully. You can now log in.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                throw new Error('Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Sign Up for Brdge AI Beta
                    </Typography>
                </motion.div>
                <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
                    Join our exclusive beta program and experience the future of knowledge sharing. Limited-time free access during the Beta period!
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSignUp}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 3, mb: 2 }}>
                            Join Beta Program
                        </Button>
                    </Box>
                </Paper>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    By signing up, you'll get early access to Brdge AI and help shape its future. Your feedback is invaluable!
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Log in</Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default SignUpPage;
