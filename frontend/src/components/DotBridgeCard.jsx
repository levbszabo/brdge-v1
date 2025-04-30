import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * DotBridgeCard component.
 *
 * A styled wrapper around Material UI Card components, using the defaults
 * defined in the dotbridgeTheme (background.paper, standard border radius, border, shadow).
 *
 * Use CardHeader, CardContent, CardActions as children for structured content.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - Content of the card, typically CardHeader, CardContent, CardActions.
 * @param {object} [props.sx] - Allows for custom styling via the sx prop.
 * @param {number} [props.elevation] - Override theme default shadow elevation (0-24).
 * @param {boolean} [props.square=false] - If true, card will have square corners.
 * @param {string} [props.variant="elevation"] - Card variant ('elevation' or 'outlined').
 * // ...other standard MuiCard props
 */
const DotBridgeCard = React.forwardRef((
    { children, sx, ...otherProps },
    ref
) => {
    // The main styling (bg, border, shadow, radius) is handled by
    // the MuiCard component override in dotbridgeTheme.js.
    // We just pass the props through.
    return (
        <MuiCard
            ref={ref}
            sx={sx}
            {...otherProps}
        >
            {/*
             It's generally recommended to use CardContent, CardHeader, CardActions
             as direct children for proper padding and structure, but passing
             children directly is also supported.
             Example:
             <DotBridgeCard>
                <CardHeader title="Card Title" />
                <CardContent>
                    <p>Card body content...</p>
                </CardContent>
                <CardActions>
                    <DotBridgeButton size="small">Action</DotBridgeButton>
                </CardActions>
             </DotBridgeCard>
            */}
            {children}
        </MuiCard>
    );
});

DotBridgeCard.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object,
    elevation: PropTypes.number,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(['elevation', 'outlined']),
};

DotBridgeCard.displayName = 'DotBridgeCard';

// Export Composition Components for convenience
export { CardContent, CardHeader, CardActions };
export default DotBridgeCard; 