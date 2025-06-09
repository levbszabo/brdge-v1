import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Animation keyframes for enhanced effects
const shimmer = keyframes`
    0% {
        background-position: -200% center;
    }
    100% {
        background-position: 200% center;
    }
`;

const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Enhanced Typography with sophisticated gradient effects and animations
const StyledTypography = styled(MuiTypography, {
    shouldForwardProp: (prop) => !['gradient', 'animated', 'shimmerEffect', 'highlightWords'].includes(prop),
})(({ theme, gradient, animated, shimmerEffect, highlightWords }) => ({
    // Base enhanced styling
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',

    // Apply gradient text effect if specified
    ...(gradient && {
        background: typeof gradient === 'string'
            ? gradient
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundSize: shimmerEffect ? '200% auto' : 'auto',
        ...(shimmerEffect && {
            animation: `${shimmer} 3s ease-in-out infinite`,
        }),
    }),

    // Fade in animation
    ...(animated && {
        animation: `${fadeInUp} 0.6s ease-out forwards`,
    }),

    // Enhanced letter spacing for better readability
    '&.MuiTypography-h1, &.MuiTypography-h2, &.MuiTypography-h3': {
        fontFeatureSettings: '"ss01" on, "cv01" on, "cv03" on',
    },

    // Better line height for readability
    '&.MuiTypography-body1, &.MuiTypography-body2': {
        fontFeatureSettings: '"kern" on, "liga" on, "clig" on, "calt" on',
    },

    // Enhanced selection styling
    '&::selection': {
        backgroundColor: theme.palette.primary.lighter,
        color: theme.palette.primary.darker,
        textShadow: 'none',
    },

    // Highlight specific words if specified
    ...(highlightWords && {
        '& .highlight': {
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'inherit',
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '0.1em',
                left: 0,
                right: 0,
                height: '0.1em',
                background: theme.palette.primary.main,
                opacity: 0.3,
                borderRadius: '1px',
            },
        },
    }),
}));

/**
 * Enhanced DotBridgeTypography component.
 *
 * This component wraps the Material UI Typography component with advanced styling capabilities
 * including gradient text, animations, and enhanced readability features.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to display.
 * @param {string} [props.variant="body1"] - The typography variant to use.
 * @param {string} [props.component] - The HTML element to render.
 * @param {string} [props.color] - Text color, can use theme palette keys.
 * @param {object} [props.sx] - Allows for custom styling via the sx prop.
 * @param {boolean|string} [props.gradient=false] - Apply gradient text effect. Can be boolean or custom gradient string.
 * @param {boolean} [props.animated=false] - Apply fade-in animation.
 * @param {boolean} [props.shimmerEffect=false] - Add shimmer animation to gradient text.
 * @param {Array} [props.highlightWords] - Array of words to highlight with gradient effect.
 * @param {boolean} [props.balanced=false] - Apply text balancing for better line breaks.
 * @param {string} [props.weight] - Font weight override (100-900 or named weights).
 */
const DotBridgeTypography = React.forwardRef((
    {
        variant = 'body1',
        component,
        color,
        sx,
        gradient = false,
        animated = false,
        shimmerEffect = false,
        highlightWords,
        balanced = false,
        weight,
        children,
        ...otherProps
    },
    ref
) => {
    // Determine the appropriate component mapping
    let defaultComponent = 'p';
    if (variant.startsWith('h') && variant.length === 2) {
        defaultComponent = variant;
    } else if (variant.includes('subtitle')) {
        defaultComponent = 'h6';
    } else if (variant === 'button' || variant === 'caption' || variant === 'overline') {
        defaultComponent = 'span';
    }

    const renderComponent = component || defaultComponent;

    // Process children to highlight specific words if specified
    const processedChildren = React.useMemo(() => {
        if (!highlightWords || !Array.isArray(highlightWords) || typeof children !== 'string') {
            return children;
        }

        let processedText = children;
        highlightWords.forEach(word => {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            processedText = processedText.replace(regex, '<span class="highlight">$1</span>');
        });

        return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
    }, [children, highlightWords]);

    // Enhanced sx styles
    const enhancedSx = React.useMemo(() => {
        const baseSx = { ...sx };

        // Add font weight override
        if (weight) {
            baseSx.fontWeight = weight;
        }

        // Add text balancing
        if (balanced && variant.startsWith('h')) {
            baseSx.textWrap = 'balance';
        }

        // Add responsive font scaling for better mobile experience
        if (variant === 'h1' || variant === 'h2') {
            baseSx.fontSize = {
                xs: baseSx.fontSize?.xs || 'inherit',
                sm: baseSx.fontSize?.sm || 'inherit',
                md: baseSx.fontSize?.md || 'inherit',
                ...baseSx.fontSize
            };
        }

        return baseSx;
    }, [sx, weight, balanced, variant]);

    return (
        <StyledTypography
            ref={ref}
            variant={variant}
            component={renderComponent}
            color={color}
            sx={enhancedSx}
            gradient={gradient}
            animated={animated}
            shimmerEffect={shimmerEffect}
            highlightWords={!!highlightWords}
            {...otherProps}
        >
            {processedChildren}
        </StyledTypography>
    );
});

DotBridgeTypography.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.string,
    component: PropTypes.elementType,
    color: PropTypes.string,
    sx: PropTypes.object,
    gradient: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    animated: PropTypes.bool,
    shimmerEffect: PropTypes.bool,
    highlightWords: PropTypes.arrayOf(PropTypes.string),
    balanced: PropTypes.bool,
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DotBridgeTypography.displayName = 'DotBridgeTypography';

export default DotBridgeTypography; 