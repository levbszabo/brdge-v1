import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * DotBridgeTypography component.
 *
 * This component wraps the Material UI Typography component, ensuring consistency
 * with the DotBridge design system defined in dotbridgeTheme.js.
 *
 * It maps standard HTML elements or semantic meanings to the theme's typography variants.
 * Use the `variant` prop to select the style (e.g., "h1", "body1", "caption").
 * The component automatically uses the correct font family (serif for h1/h2, sans-serif otherwise)
 * based on the theme configuration.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to display.
 * @param {string} [props.variant="body1"] - The typography variant to use (maps to theme styles).
 * @param {string} [props.component] - The HTML element to render (e.g., 'h1', 'p', 'span'). Optional, MUI often infers this from variant.
 * @param {string} [props.color] - Text color, can use theme palette keys (e.g., 'primary.main', 'text.secondary').
 * @param {object} [props.sx] - Allows for custom styling via the sx prop.
 * // ...other standard MuiTypography props
 */
const DotBridgeTypography = React.forwardRef((
    { variant = 'body1', component, color, sx, ...otherProps },
    ref
) => {

    // Determine the appropriate component mapping if not explicitly provided
    // This helps with semantic HTML
    let defaultComponent = 'p';
    if (variant.startsWith('h') && variant.length === 2) {
        defaultComponent = variant; // h1, h2, h3, etc.
    } else if (variant.includes('subtitle')) {
        defaultComponent = 'h6'; // Subtitles often map semantically to h6
    } else if (variant === 'button' || variant === 'caption' || variant === 'overline') {
        defaultComponent = 'span';
    }

    const renderComponent = component || defaultComponent;

    return (
        <MuiTypography
            ref={ref}
            variant={variant} // Use the variant name directly, theme handles the style
            component={renderComponent}
            color={color} // Pass color prop directly, theme handles palette keys
            sx={sx}
            {...otherProps}
        />
    );
});

DotBridgeTypography.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.string,
    component: PropTypes.elementType,
    color: PropTypes.string,
    sx: PropTypes.object,
};

DotBridgeTypography.displayName = 'DotBridgeTypography';

export default DotBridgeTypography; 