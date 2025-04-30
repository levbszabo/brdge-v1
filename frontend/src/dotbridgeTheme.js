import { createTheme } from '@mui/material/styles';

// 1. Font Declarations (Import desired fonts in your main index.css or App.jsx)
// Assuming 'Inter' for body/ui and 'Canela Text' for headings are loaded globally
const fontFamilyBody = '"Inter", "Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontFamilyHeading = '"Canela Text", "Tiempos Headline", Georgia, serif';

// 2. Refined Palette
const palette = {
    // Ink & Text
    ink: '#101017', // Updated Ink Black
    inkLight: '#3A3A42', // Derived darker grey
    inkFaded: '#8E8E93', // Dark Gray (Neutral)
    text: {
        primary: '#101017', // Ink Black
        secondary: '#8E8E93', // Dark Gray
        disabled: '#BDBDC2', // Derived lighter grey
    },

    // Brand Accent (Azure)
    primary: {
        main: '#007AFF', // Bright Azure
        light: '#4DA1FF', // Lighter shade for hover/accents
        dark: '#005BC7', // Darker shade for active/hover
        contrastText: '#FFFFFF',
    },

    // Neutrals (Simplified Scale)
    grey: { // Keep the grey object for MUI compatibility, but map to new values
        100: '#F5F5F7', // Light gray
        200: '#EAEAEF', // Lighter mid-tone
        300: '#E0E0E0', // Mid gray (borders)
        400: '#C7C7CC', // Darker mid-tone
        500: '#ADB5BD', // Existing mid - map to 600?
        600: '#8E8E93', // Dark gray (secondary text)
        700: '#636366', // Darker Text/Icons
        800: '#3A3A42', // Darker Ink
        900: '#101017', // Ink Black
    },
    neutral: { // Explicit neutral names
        light: '#F5F5F7',
        mid: '#E0E0E0',
        dark: '#8E8E93',
    },

    // Backgrounds
    background: {
        default: '#FFFFFF', // Pure White
        paper: '#FFFFFF', // Pure White
    },

    // Feedback Colors
    success: { main: '#34C759', contrastText: '#FFFFFF' },
    error: { main: '#FF3B30', contrastText: '#FFFFFF' },
    warning: { main: '#FF9500', contrastText: '#FFFFFF' }, // Added standard warning
    info: { main: '#0A84FF', contrastText: '#FFFFFF' }, // Link Blue

    // Secondary (Using Dark Ink for subtle contrast)
    secondary: {
        main: '#3A3A42', // Darker Ink
        light: '#636366',
        dark: '#101017',
        contrastText: '#FFFFFF',
    },

    // Divider Color
    divider: '#E0E0E0', // Mid gray
};

// 3. Typography System (Modular Scale & Refined Settings)
const typography = {
    fontFamily: fontFamilyBody, // Default body font
    h1: {
        fontFamily: fontFamilyHeading,
        fontWeight: 500, // Keep weight or adjust as needed
        fontSize: '3.8rem', // ~61px
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
    },
    h2: {
        fontFamily: fontFamilyHeading,
        fontWeight: 500,
        fontSize: '2.4rem', // ~39px
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
    },
    h3: {
        fontFamily: fontFamilyHeading, // Use Heading font for H3 too? Or Body-Bold? Let's try Heading.
        fontWeight: 500,
        fontSize: '1.9rem', // ~31px
        lineHeight: 1.3,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
    },
    h4: {
        fontFamily: fontFamilyBody, // Back to body for smaller headings
        fontWeight: 600,
        fontSize: '1.5rem', // ~25px
        lineHeight: 1.35,
        letterSpacing: '-0.01em', // Less tightening
        color: palette.text.primary,
    },
    h5: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.25rem', // 20px
        lineHeight: 1.4,
        letterSpacing: 0,
        color: palette.text.primary,
    },
    h6: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.0rem', // 16px
        lineHeight: 1.4,
        letterSpacing: 0,
        color: palette.text.primary,
    },
    subtitle1: {
        fontFamily: fontFamilyBody,
        fontWeight: 500, // Medium weight
        fontSize: '1.0rem',
        lineHeight: 1.5,
        letterSpacing: 0,
        color: palette.text.primary, // Use primary text for subtitles? Or secondary? Let's try primary.
    },
    subtitle2: {
        fontFamily: fontFamilyBody,
        fontWeight: 400, // Regular weight
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: 0,
        color: palette.text.secondary, // Secondary text for smaller subtitle
    },
    body1: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '1.0rem', // 16px
        lineHeight: 1.6, // Increased line height
        letterSpacing: 0,
        color: palette.text.primary,
    },
    body2: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.875rem', // 14px
        lineHeight: 1.5,
        letterSpacing: 0,
        color: palette.text.secondary,
    },
    button: {
        fontFamily: fontFamilyBody,
        fontWeight: 600, // Bold
        fontSize: '0.9rem',
        textTransform: 'none', // Keep as is
        letterSpacing: '0.01em', // Subtle spacing
        // Default line height is usually fine for buttons
    },
    caption: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.75rem', // 12px
        lineHeight: 1.4,
        letterSpacing: '0.03em', // Wider spacing
        color: palette.text.secondary,
    },
    overline: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '0.7rem', // Slightly smaller
        textTransform: 'uppercase',
        letterSpacing: '0.05em', // Keep spacing
        lineHeight: 1.4,
        color: palette.text.secondary, // Use secondary text
    },
    // Custom variants (keep or remove?)
    landingH1: { // This should likely be removed, use theme h1/h2
        fontFamily: fontFamilyHeading,
        fontWeight: 500,
        fontSize: '4.0rem', // Match designer H1?
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
    }
};

// 4. Shape (Border Radius)
const shape = {
    borderRadius: 6, // Further reduced border radius for a sleeker SaaS feel
};

// 5. Shadows (Minimal Set)
const shadows = [
    'none',
    '0 4px 12px rgba(16, 16, 23, 0.05)', // Base subtle shadow (using Ink #101017 base)
    '0 6px 16px rgba(16, 16, 23, 0.07)', // Slightly stronger for hover/emphasis
    '0 8px 24px rgba(16, 16, 23, 0.09)', // Stronger elevation
    // Add more if needed, up to 24
    'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', // Fill array to 25 elements
];

// 6. Components Overrides (Refined Styles)
const components = {
    // Apply baseline styles globally
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: palette.background.default, // Ensure body bg is set
            },
            // Smooth scroll behavior
            '@ RscrollBehavior': 'smooth',
            // Basic link styling (can be overridden by MuiLink)
            a: {
                color: palette.info.main, // Use Link Blue
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius, // Use theme radius
                padding: '10px 24px', // Adjust padding for new aesthetic
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out', // Added transform transition
                '&:active': {
                    transform: 'translateY(1px)', // Subtle press effect
                }
            },
            containedPrimary: {
                backgroundColor: palette.primary.main,
                color: palette.primary.contrastText,
                boxShadow: shadows[1], // Use subtle shadow
                '&:hover': {
                    backgroundColor: palette.primary.dark, // Darken on hover
                    boxShadow: shadows[2], // Increase shadow on hover
                    transform: 'translateY(-1px)', // Lift effect
                },
            },
            outlinedPrimary: {
                borderColor: palette.primary.main,
                color: palette.primary.main,
                '&:hover': {
                    backgroundColor: `${palette.primary.main}1A`, // ~10% opacity primary color
                    borderColor: palette.primary.dark,
                    color: palette.primary.dark, // Darken text on hover too
                },
            },
            textPrimary: {
                color: palette.primary.main,
                '&:hover': {
                    backgroundColor: `${palette.primary.main}1A`, // ~10% opacity primary color
                },
            },
            // Add overrides for Secondary, sizes etc. if needed
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius,
                border: `1px solid ${palette.divider}`, // Use new divider color
                boxShadow: shadows[1], // Use base subtle shadow
                backgroundColor: palette.background.paper,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    // Add subtle hover effect if desired (e.g., lift or scale)
                    // transform: 'scale(1.01)', // Example: slight scale
                    // boxShadow: shadows[2], // Example: increase shadow
                }
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: shape.borderRadius,
                    backgroundColor: palette.background.paper, // Ensure background for contrast
                    '& fieldset': {
                        borderColor: palette.neutral.mid, // Use mid neutral for border
                        transition: 'border-color 0.2s ease-in-out',
                    },
                    '&:hover fieldset': {
                        borderColor: palette.neutral.dark, // Use dark neutral on hover
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: palette.primary.main,
                        borderWidth: '1px', // Ensure focus doesn't double border width visually if thicker
                        // Optional focus ring using box-shadow (more modern)
                        boxShadow: `0 0 0 2px ${palette.primary.main}40`, // ~25% opacity focus ring
                    },
                    // Style disabled state
                    '&.Mui-disabled': {
                        backgroundColor: palette.neutral.light,
                        '& fieldset': {
                            borderColor: palette.neutral.mid,
                        },
                    },
                },
                '& .MuiInputLabel-root': {
                    color: palette.text.secondary,
                    '&.Mui-focused': {
                        color: palette.primary.main, // Label turns accent color when focused
                    },
                    '&.Mui-disabled': {
                        color: palette.text.disabled,
                    }
                },
                '& .MuiInputBase-input': {
                    // Style disabled input text
                    '&.Mui-disabled': {
                        color: palette.text.disabled,
                        WebkitTextFillColor: palette.text.disabled, // for Chrome/Safari
                        opacity: 1, // Prevent browser default opacity
                    },
                },
            },
        }
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: palette.info.main, // Link Blue
                textDecoration: 'none',
                fontWeight: 500, // Slightly bolder links
                '&:hover': {
                    textDecoration: 'underline',
                    textDecorationThickness: '1px', // Thinner underline?
                    color: palette.primary.dark, // Darken link on hover
                },
            },
        },
    },
    MuiAccordion: {
        styleOverrides: {
            root: {
                boxShadow: 'none',
                border: `1px solid ${palette.divider}`,
                borderRadius: `${shape.borderRadius}px !important`, // Use theme radius
                backgroundColor: palette.background.paper,
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                    margin: '0 0 8px 0', // Prevent margin collapse issues sometimes
                }
            },
            summary: {
                padding: '0 24px', // Consistent padding
                minHeight: '64px', // Define min height for consistency
                '& .MuiAccordionSummary-content': {
                    margin: '16px 0 !important' // Adjust vertical margin
                },
                '&.Mui-expanded': {
                    minHeight: '64px',
                }
            },
            details: {
                padding: '0 24px 24px 24px', // Consistent padding
            }
        }
    },
    // Add overrides for other components (AppBar, Dialog, Table, etc.) as needed
};

// 7. Create the Theme
const dotbridgeTheme = createTheme({
    palette: palette,
    typography: typography,
    shape: shape,
    shadows: shadows,
    components: components,
});

export default dotbridgeTheme; 