import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import api from '../api';
import { setAuthToken } from '../utils/auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Attempting login with:', { email, password });
        try {
            const response = await api.post('/login', { email, password });
            console.log('Login response:', response.data);
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
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
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
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>
            </form>
        </Container>
    );
}

export default LoginPage;
