import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Animation keyframes for enhanced effects
const shine = keyframes`
    0% {
        transform: translateX(-100%) rotate(35deg);
    }
    100% {
        transform: translateX(100%) rotate(35deg);
    }
`;

const float = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-4px);
    }
`;

const glow = keyframes`
    0%, 100% {
        box-shadow: 0 0 20px rgba(0, 102, 255, 0.1);
    }
    50% {
        box-shadow: 0 0 30px rgba(0, 102, 255, 0.2);
    }
`;

// Enhanced Card with modern styling and premium effects
const StyledCard = styled(MuiCard, {
    shouldForwardProp: (prop) => !['interactive', 'featured', 'glass', 'floating', 'glowEffect', 'variant'].includes(prop),
})(({ theme, interactive, featured, glass, floating, glowEffect, variant = 'default' }) => {

    // Base styling for different variants
    const getVariantStyles = () => {
        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: theme.palette.background.elevated,
                    borderColor: theme.palette.grey[100],
                    boxShadow: theme.shadows[2],
                };
            case 'glass':
                return {
                    backgroundColor: theme.palette.background.glass,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                };
            case 'premium':
                return {
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.primary.light,
                    borderWidth: '1.5px',
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}20 100%)`,
                };
            default:
                return {
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.grey[200],
                };
        }
    };

    return {
        borderRadius: theme.shape.borderRadiusLarge,
        border: `1px solid`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        ...getVariantStyles(),

        // Base animations
        ...(floating && {
            animation: `${float} 3s ease-in-out infinite`,
        }),

        ...(glowEffect && {
            animation: `${glow} 2s ease-in-out infinite`,
        }),

        // Interactive effects
        ...(interactive && {
            cursor: 'pointer',
            '&:hover': {
                transform: 'translateY(-8px) scale(1.01)',
                boxShadow: variant === 'glass'
                    ? '0 20px 60px rgba(0, 0, 0, 0.15)'
                    : theme.shadows[6],
                borderColor: variant === 'premium'
                    ? theme.palette.primary.main
                    : theme.palette.grey[300],
                '&::before': {
                    opacity: 1,
                    transform: 'translateX(100%) rotate(35deg)',
                },
                '&::after': {
                    opacity: 0.1,
                },
            },
            '&:active': {
                transform: 'translateY(-4px) scale(0.99)',
                boxShadow: theme.shadows[3],
                transition: 'all 0.1s ease',
            },
        }),

        // Featured styling with enhanced effects
        ...(featured && {
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.lighter}15 100%)`,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                backgroundSize: '200% 100%',
                animation: `${shine} 2s linear infinite`,
            },
        }),

        // Glass morphism effects
        ...(glass && {
            backgroundColor: theme.palette.background.glass,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }),

        // Shine effect overlay
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
            )`,
            transition: 'all 0.6s ease',
            opacity: 0,
            transform: 'translateX(-100%) rotate(35deg)',
            pointerEvents: 'none',
            zIndex: 1,
        },

        // Subtle background glow
        '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(
                circle at 50% 50%,
                ${theme.palette.primary.main}05 0%,
                transparent 50%
            )`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 0,
        },

        // Content positioning
        '& > *': {
            position: 'relative',
            zIndex: 2,
        },

        // Enhanced focus state
        '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
            borderColor: theme.palette.primary.main,
        },

        // Responsive optimizations
        [theme.breakpoints.down('sm')]: {
            borderRadius: theme.shape.borderRadius,
            '&:hover': interactive ? {
                transform: 'translateY(-4px)',
            } : {},
        },
    };
});

/**
 * Enhanced DotBridgeCard component.
 *
 * Premium Card component with modern styling, interactive effects, and glass morphism support.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - Content of the card.
 * @param {object} [props.sx] - Custom styling via the sx prop.
 * @param {number} [props.elevation] - Override theme default shadow elevation.
 * @param {boolean} [props.square=false] - Square corners.
 * @param {string} [props.variant="default"] - Card variant ('default', 'elevated', 'glass', 'premium').
 * @param {boolean} [props.interactive=false] - Enable interactive hover effects.
 * @param {boolean} [props.featured=false] - Apply featured styling with accent border.
 * @param {boolean} [props.glass=false] - Apply glass morphism effects.
 * @param {boolean} [props.floating=false] - Add subtle floating animation.
 * @param {boolean} [props.glowEffect=false] - Add subtle glow animation.
 * @param {Function} [props.onClick] - Click handler for interactive cards.
 * @param {Function} [props.onHover] - Hover handler.
 */
const DotBridgeCard = React.forwardRef((
    {
        children,
        sx,
        interactive = false,
        featured = false,
        glass = false,
        floating = false,
        glowEffect = false,
        variant = 'default',
        onClick,
        onHover,
        ...otherProps
    },
    ref
) => {
    // Auto-enable interactive mode if onClick is provided
    const isInteractive = interactive || !!onClick;

    const handleMouseEnter = (event) => {
        if (onHover) {
            onHover(event);
        }
    };

    const handleClick = (event) => {
        if (onClick) {
            // Add haptic feedback for mobile devices
            if ('vibrate' in navigator) {
                navigator.vibrate(10);
            }
            onClick(event);
        }
    };

    return (
        <StyledCard
            ref={ref}
            sx={sx}
            interactive={isInteractive}
            featured={featured}
            glass={glass}
            floating={floating}
            glowEffect={glowEffect}
            variant={variant}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            tabIndex={isInteractive ? 0 : undefined}
            role={isInteractive ? 'button' : undefined}
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
    variant: PropTypes.oneOf(['default', 'elevated', 'glass', 'premium']),
    interactive: PropTypes.bool,
    featured: PropTypes.bool,
    glass: PropTypes.bool,
    floating: PropTypes.bool,
    glowEffect: PropTypes.bool,
    onClick: PropTypes.func,
    onHover: PropTypes.func,
};

DotBridgeCard.displayName = 'DotBridgeCard';

// Export enhanced CardContent with better padding
const EnhancedCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(3),
    '&:last-child': {
        paddingBottom: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        '&:last-child': {
            paddingBottom: theme.spacing(2),
        },
    },
}));

// Export enhanced CardHeader with better typography
const EnhancedCardHeader = styled(CardHeader)(({ theme }) => ({
    padding: theme.spacing(3, 3, 2),
    '& .MuiCardHeader-title': {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
    },
    '& .MuiCardHeader-subheader': {
        fontSize: '0.9375rem',
        lineHeight: 1.5,
        marginTop: theme.spacing(0.5),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2, 2, 1),
        '& .MuiCardHeader-title': {
            fontSize: '1.125rem',
        },
    },
}));

// Export enhanced CardActions with better spacing
const EnhancedCardActions = styled(CardActions)(({ theme }) => ({
    padding: theme.spacing(2, 3, 3),
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 2, 2),
    },
}));

// Export Composition Components
export { EnhancedCardContent as CardContent, EnhancedCardHeader as CardHeader, EnhancedCardActions as CardActions };
export default DotBridgeCard; 