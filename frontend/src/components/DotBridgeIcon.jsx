import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { styled, keyframes } from '@mui/material/styles';
import * as LucideIcons from 'lucide-react';

// Animation keyframes for enhanced effects
const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const pulse = keyframes`
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.05);
    }
`;

const bounce = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-4px);
    }
`;

const shimmer = keyframes`
    0% {
        background-position: -200% center;
    }
    100% {
        background-position: 200% center;
    }
`;

// Enhanced wrapper for icons with additional styling capabilities
const IconWrapper = styled('span', {
    shouldForwardProp: (prop) => !['iconSize', 'iconColor', 'gradient', 'animated', 'interactive', 'variant'].includes(prop),
})(({ theme, iconSize, iconColor, gradient, animated, interactive, variant = 'default' }) => {

    // Get variant-specific styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'contained':
                return {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: iconSize * 2,
                    height: iconSize * 2,
                    borderRadius: theme.shape.borderRadius,
                    backgroundColor: theme.palette.primary.lighter,
                    color: theme.palette.primary.main,
                };
            case 'outlined':
                return {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: iconSize * 2,
                    height: iconSize * 2,
                    borderRadius: theme.shape.borderRadius,
                    border: `2px solid ${theme.palette.primary.light}`,
                    color: theme.palette.primary.main,
                };
            case 'circular':
                return {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: iconSize * 2,
                    height: iconSize * 2,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    boxShadow: `0 4px 12px ${theme.palette.primary.shadow}`,
                };
            default:
                return {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                };
        }
    };

    return {
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        ...getVariantStyles(),

        // Apply gradient if specified
        ...(gradient && {
            '& svg': {
                fill: 'url(#iconGradient)',
                color: 'transparent',
            },
        }),

        // Animation effects
        ...(animated === 'spin' && {
            animation: `${spin} 1s linear infinite`,
        }),
        ...(animated === 'pulse' && {
            animation: `${pulse} 2s ease-in-out infinite`,
        }),
        ...(animated === 'bounce' && {
            animation: `${bounce} 1s ease-in-out infinite`,
        }),

        // Interactive effects
        ...(interactive && {
            cursor: 'pointer',
            '&:hover': {
                transform: variant === 'default' ? 'scale(1.1)' : 'scale(1.05) translateY(-2px)',
                filter: 'brightness(1.1)',
                ...(variant !== 'default' && {
                    boxShadow: `0 8px 20px ${theme.palette.primary.shadow}`,
                }),
            },
            '&:active': {
                transform: variant === 'default' ? 'scale(0.95)' : 'scale(0.98)',
                transition: 'all 0.1s ease',
            },
        }),

        // Responsive sizing
        [theme.breakpoints.down('sm')]: {
            ...(variant !== 'default' && {
                width: iconSize * 1.8,
                height: iconSize * 1.8,
            }),
        },
    };
});

/**
 * Enhanced DotBridgeIcon component.
 *
 * Renders a Lucide icon with advanced styling capabilities including gradients,
 * animations, and different variants.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.name - The name of the Lucide icon (case-sensitive).
 * @param {number} [props.size=20] - The size of the icon in pixels.
 * @param {string} [props.color] - The color of the icon. Can use theme palette keys or CSS colors.
 * @param {string} [props.variant="default"] - Icon variant ('default', 'contained', 'outlined', 'circular').
 * @param {boolean|string} [props.gradient=false] - Apply gradient effect. Can be boolean or custom gradient.
 * @param {string} [props.animated] - Animation type ('spin', 'pulse', 'bounce').
 * @param {boolean} [props.interactive=false] - Enable interactive hover effects.
 * @param {object} [props.sx] - Custom styling via the sx prop.
 * @param {object} [props.style] - Standard React style object.
 * @param {Function} [props.onClick] - Click handler.
 */
const DotBridgeIcon = React.forwardRef((
    {
        name,
        size = 20,
        color,
        variant = 'default',
        gradient = false,
        animated,
        interactive = false,
        sx,
        style,
        onClick,
        ...otherProps
    },
    ref
) => {
    const theme = useTheme();

    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
        console.warn(`DotBridgeIcon: Icon "${name}" not found in lucide-react.`);
        const FallbackIcon = LucideIcons['HelpCircle'];
        return (
            <IconWrapper
                ref={ref}
                iconSize={size}
                variant={variant}
                interactive={interactive || !!onClick}
                onClick={onClick}
                style={style}
                sx={sx}
            >
                <FallbackIcon size={size} color={theme.palette.text.disabled} {...otherProps} />
            </IconWrapper>
        );
    }

    // Resolve theme colors
    let iconColor = color;
    if (color && color.includes('.')) {
        const [paletteKey, shadeKey] = color.split('.');
        if (theme.palette[paletteKey] && theme.palette[paletteKey][shadeKey]) {
            iconColor = theme.palette[paletteKey][shadeKey];
        }
    } else if (color && theme.palette[color]) {
        if (theme.palette[color].main) {
            iconColor = theme.palette[color].main;
        }
    }

    // Auto-enable interactive mode if onClick is provided
    const isInteractive = interactive || !!onClick;

    const handleClick = (event) => {
        if (onClick) {
            // Add haptic feedback for mobile devices
            if ('vibrate' in navigator) {
                navigator.vibrate(5);
            }
            onClick(event);
        }
    };

    // Create gradient definition if needed
    const gradientId = `iconGradient-${name}-${Math.random().toString(36).substr(2, 9)}`;
    const gradientColors = typeof gradient === 'string'
        ? gradient
        : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;

    const gradientDef = gradient && (
        <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.palette.primary.main} />
                <stop offset="100%" stopColor={theme.palette.primary.dark} />
            </linearGradient>
        </defs>
    );

    // Combine styles
    const combinedStyle = { ...style };
    if (sx) {
        Object.assign(combinedStyle, sx);
    }

    return (
        <IconWrapper
            ref={ref}
            iconSize={size}
            iconColor={iconColor}
            gradient={gradient}
            animated={animated}
            interactive={isInteractive}
            variant={variant}
            onClick={handleClick}
            style={combinedStyle}
            tabIndex={isInteractive ? 0 : undefined}
            role={isInteractive ? 'button' : undefined}
            aria-label={isInteractive ? `${name} icon button` : undefined}
        >
            {gradient ? (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={theme.palette.primary.main} />
                            <stop offset="100%" stopColor={theme.palette.primary.dark} />
                        </linearGradient>
                    </defs>
                    <IconComponent
                        size={size}
                        fill={`url(#${gradientId})`}
                        stroke={`url(#${gradientId})`}
                        {...otherProps}
                    />
                </svg>
            ) : (
                <IconComponent
                    size={size}
                    color={iconColor || 'currentColor'}
                    {...otherProps}
                />
            )}
        </IconWrapper>
    );
});

DotBridgeIcon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'contained', 'outlined', 'circular']),
    gradient: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    animated: PropTypes.oneOf(['spin', 'pulse', 'bounce']),
    interactive: PropTypes.bool,
    sx: PropTypes.object,
    style: PropTypes.object,
    onClick: PropTypes.func,
};

DotBridgeIcon.displayName = 'DotBridgeIcon';

export default DotBridgeIcon; 