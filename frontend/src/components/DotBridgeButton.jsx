import React from 'react';
import { Button as MuiButton, CircularProgress, styled } from '@mui/material';

// Enhanced button with hover animations and modern styling
const StyledButton = styled(MuiButton)(({ theme, variant }) => ({
    // Add subtle animation
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',

    // Enhanced hover effects based on variant
    ...(variant === 'contained' && {
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
        },
        '&:hover::before': {
            opacity: 1,
        },
    }),
}));

/**
 * DotBridgeButton component.
 *
 * This component wraps the Material UI Button, ensuring consistency with the
 * DotBridge design system defined in dotbridgeTheme.js.
 *
 * It passes down all standard MUI Button props.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {string} [props.variant="contained"] - The variant to use (e.g., 'contained', 'outlined', 'text').
 * @param {string} [props.color="primary"] - The color of the button (e.g., 'primary', 'secondary'). Uses theme colors.
 * @param {string} [props.size="medium"] - The size of the button ('small', 'medium', 'large').
 * @param {boolean} [props.loading=false] - If true, shows a loading spinner instead of the children.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled.
 * @param {React.ReactNode} [props.startIcon] - Element placed before the children.
 * @param {React.ReactNode} [props.endIcon] - Element placed after the children.
 * @param {object} [props.sx] - Allows for custom styling via the sx prop.
 * @param {func} [props.onClick] - Function to call when the button is clicked.
 * // ...other standard MuiButton props
 */
const DotBridgeButton = React.forwardRef((
    { children, loading = false, disabled = false, variant = 'contained', color = 'primary', size = 'medium', startIcon, endIcon, ...otherProps },
    ref
) => {

    const isDisabled = loading || disabled;

    const loadingIconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

    return (
        <StyledButton
            ref={ref}
            variant={variant}
            color={color}
            size={size}
            disabled={isDisabled}
            startIcon={loading ? <CircularProgress size={loadingIconSize} color="inherit" thickness={2.5} /> : startIcon}
            endIcon={loading ? undefined : endIcon} // Don't show endIcon when loading
            disableRipple={false}
            {...otherProps}
        >
            {/* Don't render children when loading to prevent layout shifts */}
            {!loading && children}
        </StyledButton>
    );
});

DotBridgeButton.displayName = 'DotBridgeButton';

export default DotBridgeButton; 