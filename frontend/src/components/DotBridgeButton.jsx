import React from 'react';
import { Button as MuiButton, CircularProgress, styled } from '@mui/material';

// Example of potentially styling the button further if theme overrides aren't enough,
// or for specific DotBridge variants. For now, we rely mostly on theme overrides.
// const StyledButton = styled(MuiButton)(({ theme, ownerState }) => ({
//     // Example: Add custom transition
//     transition: theme.transitions.create([
//         'background-color', 'box-shadow', 'border-color', 'color'], {
//         duration: theme.transitions.duration.short,
//     }),
//     // Add other custom styles based on props like ownerState.variant, ownerState.color
// }));

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
        <MuiButton
            ref={ref}
            variant={variant}
            color={color}
            size={size}
            disabled={isDisabled}
            startIcon={loading ? <CircularProgress size={loadingIconSize} color="inherit" /> : startIcon}
            endIcon={loading ? undefined : endIcon} // Don't show endIcon when loading
            {...otherProps}
        >
            {/* Don't render children when loading to prevent layout shifts */}
            {!loading && children}
        </MuiButton>
    );
});

DotBridgeButton.displayName = 'DotBridgeButton';

export default DotBridgeButton; 