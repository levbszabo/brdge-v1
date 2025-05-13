import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayCircle from './PlayCircle';
import { useTheme } from '@mui/material/styles';

const JourneyStep = ({ title, subtitle, videoUrl, alignment, isLast }) => {
    const theme = useTheme();
    const isLeftAligned = alignment === 'left';

    const handlePlayClick = () => {
        // Placeholder for video play logic
        console.log(`Playing video for ${title}: ${videoUrl}`);
        // In a real app, this would open a modal with a video player
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isLeftAligned ? 'row' : 'row-reverse',
                alignItems: 'center',
                mb: 4, // Margin bottom for spacing between steps
                position: 'relative',
                width: '100%',
                minHeight: 120, // Minimum height for the step content
                paddingX: { xs: 1, md: 2 },
            }}
        >
            {/* PlayCircle and Connector Area */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isLeftAligned ? 'flex-start' : 'flex-end',
                    // Adjust width to allow connector to be centered with the icon
                    width: { xs: 70, md: 80 },
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1, // Ensure play circle is above connector lines
                }}
            >
                <PlayCircle onClick={handlePlayClick} />
            </Box>

            {/* Text Content Area */}
            <Box
                sx={{
                    textAlign: isLeftAligned ? 'left' : 'right',
                    flexGrow: 1,
                    px: { xs: 2, md: 3 }, // Padding between icon and text
                    [isLeftAligned ? 'marginLeft' : 'marginRight']: { xs: '8px', md: '16px' }, // Space between icon and text box
                }}
            >
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {title}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                    {subtitle}
                </Typography>
            </Box>

            {/* Connector Line (Simplified) - More complex styling in later phases */}
            {!isLast && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: { xs: 60, md: 68 }, // Start below the play circle center
                        bottom: -32, // Extend down to the margin bottom of the parent
                        width: '4px',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '2px',
                        left: isLeftAligned ? { xs: 28 + 4, md: 32 + 4 } : `calc(100% - ${theme.spacing(isLeftAligned ? 0 : (28 + 4) / 8)}px)`, // Approximating alignment for right side
                        // For right aligned, this needs to be calc(100% - playCircleWidth/2 - lineWidth/2)
                        // For left aligned, this is playCircleWidth/2 - lineWidth/2
                        // Values based on PlayCircle width 56/64 and its padding
                        transform: isLeftAligned ? 'translateX(calc(50% - 2px))' : 'translateX(calc(-50% + 2px))', // Center the line with the icon
                        // This simplified connector is a vertical line directly under the icon.
                        // The curved connectors require more complex CSS or SVG as per the 10-phase plan.
                        display: { xs: 'block', md: 'block' }, // visible on all screens for now, phase 7 handles mobile changes
                        zIndex: 0, // Behind step content
                        ...(isLeftAligned
                            ? { left: { xs: (56 / 2) - 2 + 8, md: (64 / 2) - 2 + 16 } } // Adjust based on paddingX of parent + icon width
                            : { right: { xs: (56 / 2) - 2 + 8, md: (64 / 2) - 2 + 16 } } // For right side
                        )
                    }}
                />
            )}
        </Box>
    );
};

export default JourneyStep; 