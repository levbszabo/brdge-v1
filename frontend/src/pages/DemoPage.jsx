import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../config';

const demoData = [
    { id: 1, title: 'Employee Onboarding', description: 'Interactive AI-powered onboarding presentation' },
    { id: 2, title: 'Product Manual', description: 'Dynamic product manual with voice walkthrough' },
    { id: 3, title: 'Company Policies', description: 'AI-enhanced presentation of company policies' },
];

function DemoPage() {
    return (
        <Container maxWidth="lg" sx={{ my: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
                Brdge AI Demo Gallery
            </Typography>
            <Grid container spacing={4}>
                {demoData.map((demo) => (
                    <Grid item xs={12} sm={6} md={4} key={demo.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {demo.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {demo.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" component={Link} to="/signup">
                                    Sign Up to Chat with this Brdge
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default DemoPage;