import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const demoData = [
    { id: 1, title: 'Employee Onboarding', description: 'Interactive AI-powered onboarding presentation' },
    { id: 2, title: 'Product Manual', description: 'Dynamic product manual with voice walkthrough' },
    { id: 3, title: 'Company Policies', description: 'AI-enhanced presentation of company policies' },
];

function DemoPage() {
    return (
        <Container maxWidth="lg" sx={{ my: 8 }}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold' }}>
                    Brdge AI Demo Gallery
                </Typography>
            </motion.div>
            <Box sx={{ mb: 4 }}>
                <Typography variant="body1" align="center" sx={{ maxWidth: '800px', mx: 'auto' }}>
                    Experience the power of Brdge AI through our interactive demos. See how our platform transforms static content into engaging, AI-powered presentations.
                </Typography>
            </Box>
            <Grid container spacing={4}>
                {demoData.map((demo) => (
                    <Grid item xs={12} sm={6} md={4} key={demo.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: demo.id * 0.1 }}
                        >
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {demo.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {demo.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" component={Link} to="/signup">
                                        Try This Demo
                                    </Button>
                                </CardActions>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default DemoPage;
