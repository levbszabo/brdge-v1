import { createTheme } from '@mui/material/styles';
import darkParchmentTexture from './assets/textures/dark-parchment.png'; // Assuming path
import lightMarbleTexture from './assets/textures/light_marble.jpg';
import grainyMarbleTexture from './assets/textures/grainy-marble.jpg'; // Corrected import name
import crumbledParchmentTexture from './assets/textures/crumbled_parchment.jpg'; // Corrected import name
import oldMapTexture from './assets/textures/old_map.jpg';
import stampLogoTexture from './assets/brdge-stamp-logo.png'; // Assuming path

// Import Ivy assets (adjust paths as necessary)
import ivyVertical from './assets/ivy/ivy_straight_solid.svg';
import ivyHorizontal from './assets/ivy_horizontal.svg'; // Check if this path is correct
import ivyCorner from './assets/ivy/ivy_corner_solid.svg';

// Neo-Scholar Color Palette
const colors = {
    parchment: '#F5EFE0',
    parchmentDark: '#E8E0CC',
    parchmentLight: '#FAF7ED',
    ink: '#0A1933',
    inkLight: '#1E2A42',
    inkFaded: '#4A5366',
    sepia: '#9C7C38',
    sepiaLight: '#B89F63',
    sepiaFaded: '#D6C7A1',
    accent: '#00BFA0', // Minimal use
    accentLight: '#6CDECB',
    mapBorder: '#B8A182',
    // Add other colors if needed (error, warning, etc.)
    error: '#B71C1C', // Example desaturated red
    warning: '#E65100', // Example desaturated orange
};

// Neo-Scholar Typography
const fontFamily = 'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const headingFontFamily = '"Canela Text", "Tiempos Headline", Georgia, serif';

// Button Styles (Adapted from LandingPage.jsx)
const createButtonStyles = (variant) => {
    const baseStyles = {
        borderRadius: '4px',
        fontWeight: 600,
        fontFamily: fontFamily,
        letterSpacing: '0.02em',
        textTransform: 'none',
        transition: 'all 0.2s ease-out',
        padding: '10px 24px', // Adjust padding as needed for global use
        minHeight: '44px', // Standard min height
        lineHeight: 1.5,
        '&:active': {
            transform: 'scale(0.98)',
        },
    };

    if (variant === 'primary' || variant === 'contained') {
        return {
            ...baseStyles,
            backgroundColor: colors.ink,
            color: colors.parchmentLight,
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            '&:hover': {
                backgroundColor: colors.inkLight,
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
            },
            '&.Mui-disabled': {
                backgroundColor: colors.inkFaded,
                color: colors.parchment,
                opacity: 0.7
            }
        };
    } else { // Secondary or Outlined
        return {
            ...baseStyles,
            borderColor: colors.sepia,
            borderWidth: '1px',
            borderStyle: 'solid',
            backgroundColor: 'rgba(245, 239, 224, 0.5)', // Semi-transparent parchment
            color: colors.inkLight,
            '&:hover': {
                borderColor: colors.ink,
                backgroundColor: 'rgba(245, 239, 224, 0.8)',
                transform: 'translateY(-2px)',
                boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            },
            '&.Mui-disabled': {
                borderColor: colors.sepiaFaded,
                color: colors.inkFaded,
                backgroundColor: 'transparent',
                opacity: 0.7
            }
        };
    }
};

const theme = createTheme({
    palette: {
        primary: {
            main: colors.ink, // Use ink as primary
            light: colors.inkLight,
            contrastText: colors.parchmentLight,
        },
        secondary: {
            main: colors.sepia, // Use sepia as secondary
            light: colors.sepiaLight,
            contrastText: colors.ink,
        },
        error: {
            main: colors.error,
        },
        warning: {
            main: colors.warning,
        },
        text: {
            primary: colors.ink,
            secondary: colors.inkFaded,
        },
        background: {
            default: colors.parchmentDark, // Darker Parchment
            paper: colors.parchment,      // Warmer Parchment
        },
        divider: `${colors.sepia}40`, // Sepia with transparency
        parchment: {
            light: colors.parchmentLight,
            main: colors.parchment,
            dark: colors.parchmentDark,
        },
        sepia: {
            faded: colors.sepiaFaded,
            light: colors.sepiaLight,
            main: colors.sepia,
        },
    },
    typography: {
        fontFamily: fontFamily,
        h1: { fontFamily: headingFontFamily, fontWeight: 500, color: colors.ink },
        h2: { fontFamily: headingFontFamily, fontWeight: 500, color: colors.ink },
        h3: { fontFamily: headingFontFamily, fontWeight: 500, color: colors.ink },
        h4: { fontFamily: headingFontFamily, fontWeight: 600, color: colors.ink }, // Slightly heavier for clarity
        h5: { fontFamily: headingFontFamily, fontWeight: 600, color: colors.sepia }, // Use sepia for h5 accents
        h6: { fontFamily: headingFontFamily, fontWeight: 600, color: colors.sepiaLight },// Lighter sepia for h6
        body1: { fontFamily: fontFamily, fontWeight: 400, color: colors.inkLight, lineHeight: 1.6 },
        body2: { fontFamily: fontFamily, fontWeight: 300, color: colors.inkFaded, lineHeight: 1.6 },
        button: {
            fontFamily: fontFamily,
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.02em',
        },
        caption: {
            fontFamily: fontFamily,
            fontWeight: 300,
            color: colors.inkFaded,
            fontSize: '0.8rem'
        },
        headingFontFamily: '"Canela Text", serif', // Add heading font
    },
    textures: { // Update texture paths
        darkParchment: darkParchmentTexture,
        lightMarble: lightMarbleTexture,
        grainyMarble: grainyMarbleTexture,
        crumbledParchment: crumbledParchmentTexture,
        oldMap: oldMapTexture,
        stampLogo: stampLogoTexture,
        // Add Ivy textures
        ivyVertical: ivyVertical,
        ivyHorizontal: ivyHorizontal,
        ivyCorner: ivyCorner,
    },
    components: {
        // Default component overrides
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    boxShadow: 'none', // Remove MUI default shadows initially
                    '&:hover': {
                        boxShadow: 'none', // Manage shadows in specific styles
                    }
                },
                containedPrimary: createButtonStyles('primary'),
                outlinedPrimary: createButtonStyles('secondary'), // Map primary outlined to secondary style
                containedSecondary: createButtonStyles('secondary'), // Map secondary contained to secondary style
                outlinedSecondary: {
                    ...createButtonStyles('secondary'),
                    borderColor: colors.sepiaLight, // Lighter border for secondary outlined
                    color: colors.sepia,
                    '&:hover': {
                        borderColor: colors.sepia,
                        backgroundColor: 'rgba(245, 239, 224, 0.6)',
                    }
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default gradient
                    backgroundColor: colors.parchment, // Base paper color
                    border: `1px solid ${colors.sepia}30`, // Subtle sepia border
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)', // Neo-Scholar subtle shadow
                },
                elevation0: { // Explicitly style elevation 0 if needed
                    border: `1px solid ${colors.sepia}30`,
                    boxShadow: 'none',
                },
                elevation1: { // Same as root for consistency unless specified
                    backgroundColor: colors.parchment,
                    border: `1px solid ${colors.sepia}30`,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                },
                // Add other elevations if you use them differently
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: `${colors.parchmentLight}80`, // Slightly transparent light parchment
                        borderRadius: '6px',
                        '& fieldset': {
                            borderColor: `${colors.sepia}50`, // Sepia border
                        },
                        '&:hover fieldset': {
                            borderColor: `${colors.sepia}80`, // Darker sepia on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.sepia, // Strong sepia on focus
                            borderWidth: '1px',
                        },
                        '& input': {
                            color: colors.ink, // Ink text color
                        },
                        '& textarea': {
                            color: colors.ink, // Ink text color for multiline
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: colors.inkLight,
                        '&.Mui-focused': {
                            color: colors.sepia, // Sepia label on focus
                        },
                    },
                    '& .MuiFormHelperText-root': {
                        color: colors.inkFaded, // Faded ink for helper text
                    }
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: colors.ink,
                    '&::placeholder': {
                        color: colors.inkFaded,
                        opacity: 1,
                    }
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: colors.sepia,
                    textDecorationColor: `${colors.sepia}60`,
                    '&:hover': {
                        color: colors.ink,
                        textDecorationColor: colors.inkLight,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.parchmentDark, // Dark parchment for AppBar
                    backgroundImage: 'none',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    color: colors.ink,
                    borderBottom: `1px solid ${colors.sepia}40`
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: colors.parchmentDark,
                    color: colors.ink,
                    border: `1px solid ${colors.sepia}50`,
                    fontSize: '0.85rem',
                    fontFamily: fontFamily,
                },
                arrow: {
                    color: colors.parchmentDark,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: { // Apply paper styles to dialog background
                    backgroundColor: colors.parchment,
                    border: `1px solid ${colors.sepia}50`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    backgroundImage: 'none',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: `${colors.sepia}40` // Use theme divider color
                }
            }
        }
        // Add other component overrides as needed (e.g., MuiTable, MuiAccordion)
    },
});

export default theme;

// Example mixin function in theme.js or styles utility
export const createParchmentContainerStyles = (theme) => ({
    position: 'relative',
    background: theme.palette.parchment.main, // Use defined theme color
    borderRadius: '16px', // Match sectionContainer rounding
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${theme.textures.darkParchment})`, // Use defined texture
        backgroundSize: 'cover',
        opacity: 0.15,
        mixBlendMode: 'multiply',
        borderRadius: '16px', // Match container rounding
        zIndex: 0,
    },
    border: `1px solid ${theme.palette.sepia.main}40`, // Use defined theme color
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    '& > *': {
        position: 'relative',
        zIndex: 1,
    },
    // ... other shared styles
});

// Usage in a component:
// import { useTheme } from '@mui/material/styles';
// import { createParchmentContainerStyles } from '../theme'; // Adjust path
// const theme = useTheme();
// const styles = createParchmentContainerStyles(theme);
// <Box sx={styles}>...</Box>
