import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import * as LucideIcons from 'lucide-react';

/**
 * DotBridgeIcon component.
 *
 * Renders a Lucide icon (https://lucide.dev/) with standardized sizing and color options
 * based on the DotBridge theme.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.name - The name of the Lucide icon (e.g., 'Check', 'ArrowRight'). Case-sensitive.
 * @param {number} [props.size=20] - The size of the icon in pixels.
 * @param {string} [props.color] - The color of the icon. Can use theme palette keys (e.g., 'primary.main', 'text.secondary') or standard CSS colors.
 * @param {object} [props.sx] - Allows for custom styling via the sx prop.
 * @param {object} [props.style] - Allows for standard React style object.
 * // ...other props passed directly to the Lucide icon component
 */
const DotBridgeIcon = React.forwardRef((
    { name, size = 20, color, sx, style, ...otherProps },
    ref
) => {
    const theme = useTheme();

    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
        console.warn(`DotBridgeIcon: Icon "${name}" not found in lucide-react.`);
        // Optionally return a default fallback icon or null
        const FallbackIcon = LucideIcons['HelpCircle']; // Example fallback
        return <FallbackIcon ref={ref} size={size} color={theme.palette.text.disabled} {...otherProps} />;
    }

    // Resolve theme colors
    let iconColor = color;
    if (color && color.includes('.')) {
        const [paletteKey, shadeKey] = color.split('.');
        if (theme.palette[paletteKey] && theme.palette[paletteKey][shadeKey]) {
            iconColor = theme.palette[paletteKey][shadeKey];
        }
    } else if (color && theme.palette[color]) {
        // Handle direct palette keys like 'primary' or 'secondary' -> use main shade
        if (theme.palette[color].main) {
            iconColor = theme.palette[color].main;
        }
    }

    // Combine sx and style props if necessary
    const combinedStyle = { ...style };
    if (sx) {
        // Basic sx handling - more complex sx props might need full MUI processing
        Object.assign(combinedStyle, sx);
    }

    return (
        <IconComponent
            ref={ref}
            size={size}
            color={iconColor || 'currentColor'} // Default to inherit color
            style={combinedStyle}
            {...otherProps}
        />
    );
});

DotBridgeIcon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    sx: PropTypes.object,
    style: PropTypes.object,
};

DotBridgeIcon.displayName = 'DotBridgeIcon';

export default DotBridgeIcon; 