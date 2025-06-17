import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import DotBridgeButton from '../DotBridgeButton';
import DotBridgeTypography from '../DotBridgeTypography';
import { useFunnel } from '../../contexts/FunnelContext';

const IntroBlock = ({ headline, subtext, ctaText }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setCurrentStep } = useFunnel();

    const handleCTAClick = () => {
        setCurrentStep(prev => prev + 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <Box sx={{
                textAlign: 'center',
                py: { xs: 6, sm: 8, md: 10 },
                px: { xs: 2, sm: 3, md: 4 },
                maxWidth: '1200px',
                mx: 'auto'
            }}>
                <DotBridgeTypography
                    variant="h1"
                    sx={{
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                        fontWeight: 800,
                        lineHeight: { xs: 1.2, md: 1.1 },
                        letterSpacing: '-0.02em',
                        background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {headline}
                </DotBridgeTypography>

                <DotBridgeTypography
                    variant="h5"
                    sx={{
                        mb: { xs: 4, sm: 5 },
                        color: theme.palette.text.secondary,
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.6,
                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                        fontWeight: 400
                    }}
                >
                    {subtext}
                </DotBridgeTypography>

                <DotBridgeButton
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    endIcon={<ArrowRight size={isMobile ? 18 : 20} />}
                    onClick={handleCTAClick}
                    sx={{
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.5, sm: 1.75 },
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: '0 10px 30px rgba(0, 102, 255, 0.3)',
                        borderRadius: 2,
                        position: 'relative',
                        '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 15px 40px rgba(0, 102, 255, 0.4)'
                        }
                    }}
                >
                    {ctaText}
                </DotBridgeButton>
            </Box>
        </motion.div>
    );
};

export default IntroBlock; 