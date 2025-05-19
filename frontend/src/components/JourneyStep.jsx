import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayCircle from './PlayCircle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const JourneyStep = ({ title, subtitle, videoUrl, alignment, isLast, isComingSoonProp }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isLeftAligned = alignment === 'left';
    const [showComingSoon, setShowComingSoon] = useState(false);

    const handlePlayClick = () => {
        if (isComingSoonProp) {
            setShowComingSoon(true);
            setTimeout(() => {
                setShowComingSoon(false);
            }, 2000);
        } else if (videoUrl && videoUrl.startsWith('http')) {
            window.open(videoUrl, '_blank', 'noopener,noreferrer');
        } else {
            console.log(`Action for ${title}: ${videoUrl || 'No URL / Coming Soon'}`);
        }
    };

    const iconContainerBaseWidth = 80;
    const actualPlayCircleDiameter = isMobile ? 56 : 64;
    const currentIconContainerWidthPx = isMobile ? (iconContainerBaseWidth - 10) : iconContainerBaseWidth;
    const playCircleCenterY = actualPlayCircleDiameter / 2;
    const stepHorizontalPaddingValue = isMobile ? parseInt(theme.spacing(1)) : parseInt(theme.spacing(2));
    const playCircleLineStartX = stepHorizontalPaddingValue + (currentIconContainerWidthPx / 2);

    const lineWidth = 4;
    const curveRadius = 24;
    const verticalStemHeight = isMobile ? 70 : 90; // Adjusted mobile stem slightly for S-curve

    // Dynamic width for the horizontal bar using calc()
    // It spans 100% of JourneyStep width, minus the space for two icon center offsets from edges, minus two curve radii.
    const horizontalBarWidthCalcString = `calc(100% - ${2 * playCircleLineStartX + 2 * curveRadius}px)`;

    const connectorColor = theme.palette.primary.main;

    const commonConnectorPartStyles = {
        position: 'absolute',
        zIndex: 0,
    };

    // Elbow 1 (from current PlayCircle)
    const elbow1BaseSx = {
        ...commonConnectorPartStyles,
        top: `${playCircleCenterY}px`,
        height: `${verticalStemHeight + curveRadius}px`,
        width: `${curveRadius}px`,
        borderBottom: `${lineWidth}px solid ${connectorColor}`,
    };
    const elbow1LeftSx = { ...elbow1BaseSx, left: `${playCircleLineStartX}px`, borderLeft: `${lineWidth}px solid ${connectorColor}`, borderBottomLeftRadius: `${curveRadius}px` };
    const elbow1RightSx = { ...elbow1BaseSx, right: `${playCircleLineStartX}px`, borderRight: `${lineWidth}px solid ${connectorColor}`, borderBottomRightRadius: `${curveRadius}px` };

    // Horizontal Bar
    const horizontalBarBaseSx = {
        ...commonConnectorPartStyles,
        top: `${playCircleCenterY + verticalStemHeight + curveRadius - lineWidth}px`,
        height: `${lineWidth}px`,
        width: horizontalBarWidthCalcString,
        backgroundColor: connectorColor,
    };
    const horizontalBarLeftSx = { ...horizontalBarBaseSx, left: `${playCircleLineStartX + curveRadius}px` };
    const horizontalBarRightSx = { ...horizontalBarBaseSx, right: `${playCircleLineStartX + curveRadius}px` };

    // Elbow 2 (to next implied PlayCircle position)
    const elbow2BaseSx = {
        ...commonConnectorPartStyles,
        top: `${playCircleCenterY + verticalStemHeight + curveRadius - lineWidth}px`,
        height: `${verticalStemHeight + curveRadius}px`,
        width: `${curveRadius}px`,
        borderTop: `${lineWidth}px solid ${connectorColor}`,
    };
    // If current step is left-aligned, Elbow 2 is on the right, turning right.
    const elbow2FromLeftSx = {
        ...elbow2BaseSx,
        left: `calc(${playCircleLineStartX + curveRadius}px + ${horizontalBarWidthCalcString})`,
        borderRight: `${lineWidth}px solid ${connectorColor}`,
        borderTopRightRadius: `${curveRadius}px`,
    };
    // If current step is right-aligned, Elbow 2 is on the left, turning left.
    const elbow2FromRightSx = {
        ...elbow2BaseSx,
        right: `calc(${playCircleLineStartX + curveRadius}px + ${horizontalBarWidthCalcString})`,
        borderLeft: `${lineWidth}px solid ${connectorColor}`,
        borderTopLeftRadius: `${curveRadius}px`,
    };

    return (
        <Box // This is the main JourneyStep Box, its width is 100% of its parent in DotBridgeBuyerJourneyDemoPage
            sx={{
                display: 'flex',
                flexDirection: isLeftAligned ? 'row' : 'row-reverse',
                alignItems: 'center',
                mb: theme.spacing(isMobile ? 4 : 4), // Unified margin for now
                position: 'relative',
                width: '100%',
                minHeight: isMobile ? 110 : 120, // Adjusted minHeight slightly for mobile S-curve
            }}
        >
            {/* PlayCircle Area (Icon Container) */}
            <Box
                sx={{
                    width: `${currentIconContainerWidthPx}px`,
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: isLeftAligned ? 'flex-start' : 'flex-end',
                    position: 'relative',
                    zIndex: 1,
                    paddingLeft: isLeftAligned ? { xs: theme.spacing(1), sm: theme.spacing(2) } : 0,
                    paddingRight: !isLeftAligned ? { xs: theme.spacing(1), sm: theme.spacing(2) } : 0,
                }}
            >
                <PlayCircle onClick={handlePlayClick} />
                {showComingSoon && (
                    <Typography
                        variant="caption"
                        sx={{
                            position: 'absolute',
                            bottom: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: theme.palette.grey[700],
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            zIndex: 2,
                        }}
                    >
                        Coming Soon
                    </Typography>
                )}
            </Box>

            {/* Text Content Area */}
            <Box
                sx={{
                    textAlign: isLeftAligned ? 'left' : 'right',
                    flexGrow: 1,
                    px: { xs: 1.5, sm: 2, md: 3 },
                }}
            >
                <Typography variant={isMobile ? "h6" : "h5"} component="h3" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
                    {subtitle}
                </Typography>
            </Box>

            {/* Connectors - Always rendered now */}
            {!isLast && (
                <React.Fragment>
                    {isLeftAligned ? (
                        <>
                            <Box sx={elbow1LeftSx} />
                            <Box sx={horizontalBarLeftSx} />
                            <Box sx={elbow2FromLeftSx} />
                        </>
                    ) : (
                        <>
                            <Box sx={elbow1RightSx} />
                            <Box sx={horizontalBarRightSx} />
                            <Box sx={elbow2FromRightSx} />
                        </>
                    )}
                </React.Fragment>
            )}
        </Box>
    );
};

export default JourneyStep; 