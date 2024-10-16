import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

function WaitlistPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Submitted email:', email);
        // You would typically send this to your backend or a service like Mailchimp
    };

    const benefits = [
        "Early access to Brdge AI's cutting-edge features",
        "Exclusive onboarding and personalized support",
        "Opportunity to shape the future of AI-powered presentations",
        "Special pricing for early adopters",
    ];

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box textAlign="center" mb={6}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Join the Brdge AI Waitlist
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Be among the first to revolutionize your knowledge sharing with AI-powered presentations.
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
                <Typography variant="h6" gutterBottom>
                    Why Join Our Waitlist?
                </Typography>
                <List>
                    {benefits.map((benefit, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <CheckCircleOutline color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={benefit} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
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
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Join Waitlist
                </Button>
            </Box>

            <Box mt={4} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                    By joining our waitlist, you'll be the first to know when Brdge AI launches.
                    We're excited to have you on board as we transform the way knowledge is shared and consumed.
                </Typography>
            </Box>
        </Container>
    );
}

export default WaitlistPage;
