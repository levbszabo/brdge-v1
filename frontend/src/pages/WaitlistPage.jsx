import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';

function WaitlistPage() {
    const [email, setEmail] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the email to your backend
        console.log('Email submitted:', email);
        setOpenSnackbar(true);
        setEmail('');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 8, textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2" component="h1" gutterBottom>
                        Join the Waitlist
                    </Typography>
                    <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4 }}>
                        Be the first to experience Brdge AI and transform your knowledge sharing.
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ py: 1.5, px: 4 }}
                        >
                            Join Waitlist
                        </Button>
                    </form>
                </motion.div>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message="Thank you for joining our waitlist!"
            />
        </Container>
    );
}

export default WaitlistPage;