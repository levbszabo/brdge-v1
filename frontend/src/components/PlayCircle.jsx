import React from 'react';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTheme } from '@mui/material/styles';

const PlayCircle = ({ onClick }) => {
    const theme = useTheme();

    return (
        <Box
            onClick={onClick}
            sx={{
                width: { xs: 56, md: 64 }, // Responsive size
                height: { xs: 56, md: 64 },
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: theme.shadows[2], // Using a subtle shadow from the theme
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.08)',
                    boxShadow: theme.shadows[4], // A slightly stronger shadow on hover
                    backgroundColor: theme.palette.primary.dark,
                },
            }}
        >
            <PlayArrowIcon sx={{ color: theme.palette.primary.contrastText, fontSize: { xs: 30, md: 40 } }} />
        </Box>
    );
};

export default PlayCircle; 