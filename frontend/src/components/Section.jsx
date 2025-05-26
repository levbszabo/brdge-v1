import React from 'react';
import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Section = ({
    children,
    variant = 'default',
    fullWidth = false,
    sx = {},
    containerProps = {},
    ...props
}) => {
    const theme = useTheme();

    const variantStyles = {
        default: {
            py: { xs: 8, sm: 10, md: 12 },
            px: { xs: 2.5, sm: 4, md: 5 },
            bgcolor: theme.palette.background.default,
        },
        light: {
            py: { xs: 8, sm: 10, md: 12 },
            px: { xs: 2.5, sm: 4, md: 5 },
            bgcolor: theme.palette.background.subtle,
        },
        dark: {
            py: { xs: 8, sm: 10, md: 12 },
            px: { xs: 2.5, sm: 4, md: 5 },
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        hero: {
            pt: { xs: 10, sm: 12, md: 16 },
            pb: { xs: 10, sm: 12, md: 16 },
            px: { xs: 2.5, sm: 4, md: 5 },
            bgcolor: theme.palette.background.default,
        },
        compact: {
            py: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2.5, sm: 4, md: 5 },
            bgcolor: theme.palette.background.default,
        }
    };

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                overflow: 'hidden',
                ...variantStyles[variant],
                ...sx
            }}
            {...props}
        >
            {fullWidth ? (
                children
            ) : (
                <Container
                    maxWidth="xl"
                    {...containerProps}
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        ...containerProps.sx
                    }}
                >
                    {children}
                </Container>
            )}
        </Box>
    );
};

export default Section; 