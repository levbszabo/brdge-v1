import React from 'react';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system'; // Import keyframes

// Define the pulse animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 3px rgba(255, 215, 0, 0.3), 0 0 5px rgba(255, 215, 0, 0.2);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.5), 0 0 12px rgba(255, 215, 0, 0.4);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 3px rgba(255, 215, 0, 0.3), 0 0 5px rgba(255, 215, 0, 0.2);
  }
`;

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
                // Initial golden glow and apply pulsing animation
                boxShadow: '0 0 3px rgba(255, 215, 0, 0.3), 0 0 5px rgba(255, 215, 0, 0.2)', // Softer initial glow
                animation: `${pulse} 2.5s infinite ease-in-out`,
                transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out, background-color 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.08)',
                    backgroundColor: theme.palette.primary.dark,
                    // Enhanced glow effect on hover (can keep or adjust)
                    // Keep the animation running, but perhaps intensify the glow or change its character on hover
                    boxShadow: `
                        ${theme.shadows[3]}, 
                        0 0 15px rgba(255, 180, 0, 0.5), 
                        0 0 10px rgba(255, 180, 0, 0.6)
                    `,
                    animation: 'none', // Optionally pause or alter pulse on hover
                },
            }}
        >
            <PlayArrowIcon sx={{ color: theme.palette.primary.contrastText, fontSize: { xs: 30, md: 40 } }} />
        </Box>
    );
};

export default PlayCircle; 