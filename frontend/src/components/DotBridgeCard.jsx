import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Enhanced Card with modern hover effects and animations
const StyledCard = styled(MuiCard)(({ theme, interactive, featured }) => ({
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[200]}`,
    boxShadow: 'none',
    position: 'relative',
    overflow: 'hidden',

    ...(interactive && {
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[2],
            borderColor: theme.palette.grey[300],
        },
        '&:active': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[1],
        },
    }),

    ...(featured && {
        borderColor: theme.palette.primary.main,
        borderWidth: '1px',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        },
    }),
}));

/**
 * DotBridgeCard component.
 *
 * Enhanced Card component with modern styling, hover effects, and featured state.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - Content of the card, typically CardHeader, CardContent, CardActions.
 * @param {object} [props.sx] - Allows for custom styling via the sx prop.
 * @param {number} [props.elevation] - Override theme default shadow elevation (0-24).
 * @param {boolean} [props.square=false] - If true, card will have square corners.
 * @param {string} [props.variant="elevation"] - Card variant ('elevation' or 'outlined').
 * @param {boolean} [props.interactive=false] - Enable interactive hover effects.
 * @param {boolean} [props.featured=false] - Apply featured styling with accent border.
 * // ...other standard MuiCard props
 */
const DotBridgeCard = React.forwardRef((
    { children, sx, interactive = false, featured = false, ...otherProps },
    ref
) => {
    return (
        <StyledCard
            ref={ref}
            sx={sx}
            interactive={interactive}
            featured={featured}
            {...otherProps}
        >
            {children}
        </StyledCard>
    );
});

DotBridgeCard.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object,
    elevation: PropTypes.number,
    square: PropTypes.bool,
    variant: PropTypes.oneOf(['elevation', 'outlined']),
    interactive: PropTypes.bool,
    featured: PropTypes.bool,
};

DotBridgeCard.displayName = 'DotBridgeCard';

// Export Composition Components for convenience
export { CardContent, CardHeader, CardActions };
export default DotBridgeCard; 