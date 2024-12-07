import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';

function PolicyPage() {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'relative',
            pt: 12,
            pb: 8,
            color: 'white',
            overflow: 'hidden',
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
                animation: 'float 20s infinite alternate',
                zIndex: 0
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
                animation: 'float 25s infinite alternate-reverse',
                zIndex: 0
            }
        }}>
            {/* Geometric Shapes */}
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

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h2"
                        sx={{
                            textAlign: 'center',
                            mb: 6,
                            background: 'linear-gradient(90deg, #00ffcc, #00B4DB)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700
                        }}
                    >
                        Privacy Policy
                    </Typography>

                    <Paper sx={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        p: 4,
                        color: 'white',
                        '& h3': {
                            color: '#00ffcc',
                            mb: 2,
                            mt: 4,
                            fontWeight: 600
                        },
                        '& p': {
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 2,
                            lineHeight: 1.7,
                            fontSize: '1rem'
                        }
                    }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.9)' }}>
                            Last updated: March 14, 2024
                        </Typography>

                        <Typography variant="body1" paragraph>
                            At Brdge AI, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
                        </Typography>

                        <Typography variant="h3">Information We Collect</Typography>
                        <Typography variant="body1" paragraph>
                            • Account information (email, name)<br />
                            • Usage data and analytics<br />
                            • Presentation content and metadata<br />
                            • Payment information (processed securely via Stripe)
                        </Typography>

                        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                        <Typography variant="h3">How We Use Your Data</Typography>
                        <Typography variant="body1" paragraph>
                            • Providing and improving our services<br />
                            • Processing payments and managing subscriptions<br />
                            • Sending important updates and notifications<br />
                            • Analyzing usage patterns to enhance user experience
                        </Typography>

                        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                        <Typography variant="h3">Data Protection</Typography>
                        <Typography variant="body1" paragraph>
                            We implement industry-standard security measures to protect your data. Your content is encrypted and stored securely.
                        </Typography>

                        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                        <Typography variant="h3">Your Rights</Typography>
                        <Typography variant="body1" paragraph>
                            You have the right to:<br />
                            • Access your personal data<br />
                            • Request data deletion<br />
                            • Opt out of marketing communications<br />
                            • Export your data
                        </Typography>

                        <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(0, 255, 204, 0.05)', borderRadius: 2 }}>
                            <Typography variant="body1" sx={{ color: '#00ffcc' }}>
                                For any privacy-related questions, please contact us at levente@journeymanai.io
                            </Typography>
                        </Box>
                    </Paper>
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
                `}
            </style>
        </Box>
    );
}

export default PolicyPage;
