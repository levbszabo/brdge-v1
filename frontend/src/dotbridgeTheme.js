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
        fontSize: '4.2rem', // Increased size for more impact
        lineHeight: 1.1, // Tighter line height for headlines
        letterSpacing: '-0.025em', // Slightly tighter tracking
        color: palette.text.primary,
    },
    h2: {
        fontFamily: fontFamilyHeading,
        fontWeight: 500,
        fontSize: '2.8rem', // Increased from 2.4rem
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
    },
    h3: {
        fontFamily: fontFamilyHeading,
        fontWeight: 500,
        fontSize: '2.1rem', // Increased from 1.9rem
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
    },
    h4: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.6rem', // Increased from 1.5rem
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        color: palette.text.primary,
    },
    h5: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
        letterSpacing: 0,
        color: palette.text.primary,
    },
    h6: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.0rem',
        lineHeight: 1.4,
        letterSpacing: 0,
        color: palette.text.primary,
    },
    subtitle1: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1.0rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em', // Added slight tracking
        color: palette.text.primary,
    },
    subtitle2: {
        fontFamily: fontFamilyBody,
        fontWeight: 500, // Increased from 400 for better hierarchy
        fontSize: '0.875rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em', // Added slight tracking
        color: palette.text.secondary,
    },
    body1: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '1.0rem',
        lineHeight: 1.75, // Increased line height for better readability
        letterSpacing: '0.01em', // Added slight tracking
        color: palette.text.primary,
    },
    body2: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.7, // Increased line height
        letterSpacing: '0.01em', // Added slight tracking
        color: palette.text.secondary,
    },
    button: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '0.9rem',
        textTransform: 'none',
        letterSpacing: '0.02em', // Increased tracking for buttons
    },
    caption: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.4,
        letterSpacing: '0.03em',
        color: palette.text.secondary,
    },
    overline: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.07em', // Increased tracking for that premium look
        lineHeight: 1.4,
        color: palette.text.secondary,
    },
    // Custom variants (keep or remove?)
    landingH1: {
        fontFamily: fontFamilyHeading,
        fontWeight: 500,
        fontSize: '4.5rem', // Increased size for hero text
        lineHeight: 1.1,
        letterSpacing: '-0.025em',
        color: palette.text.primary,
    }
};

// 4. Shape (Border Radius)
const shape = {
    borderRadius: 4, // Reduced from 8 for a more subtle, professional curve
};

// 5. Shadows (Minimal Set)
const shadows = [
    'none',
    '0 4px 12px rgba(16, 16, 23, 0.04)', // Lighter base shadow
    '0 6px 18px rgba(16, 16, 23, 0.06)', // Medium shadow
    '0 10px 24px rgba(16, 16, 23, 0.08)', // Stronger elevation
    '0 12px 32px rgba(16, 16, 23, 0.1)', // Prominent shadow (e.g., dropdowns, tooltips)
    // Add more if needed, up to 24
    'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', // Fill array to 25 elements
];

// 6. Components Overrides (Refined Styles)
const components = {
    // Apply baseline styles globally
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: palette.background.default, // Ensure body bg is set
                scrollBehavior: 'smooth', // Enable smooth scrolling globally
            },
            // Basic link styling (can be overridden by MuiLink)
            a: {
                color: palette.info.main, // Use Link Blue
                textDecoration: 'none',
                transition: 'color 0.2s ease, text-decoration 0.2s ease',
                '&:hover': {
                    color: palette.primary.dark,
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
                fontWeight: 600,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden', // For potential ripple effects
                '&:active': {
                    transform: 'translateY(1px)', // Subtle press effect
                }
            },
            containedPrimary: {
                backgroundColor: palette.primary.main,
                color: palette.primary.contrastText,
                boxShadow: shadows[1],
                '&:hover': {
                    backgroundColor: palette.primary.dark,
                    boxShadow: shadows[2],
                    transform: 'translateY(-2px)', // More pronounced lift effect
                },
                '&:active': {
                    boxShadow: shadows[1],
                    transform: 'translateY(1px)',
                },
            },
            outlinedPrimary: {
                borderColor: palette.primary.main,
                borderWidth: '1.5px', // Slightly thicker border
                color: palette.primary.main,
                '&:hover': {
                    backgroundColor: `${palette.primary.main}0D`, // 5% opacity for subtle hover
                    borderColor: palette.primary.dark,
                    borderWidth: '1.5px',
                    color: palette.primary.dark,
                    transform: 'translateY(-1px)',
                },
            },
            textPrimary: {
                color: palette.primary.main,
                position: 'relative',
                '&:hover': {
                    backgroundColor: `${palette.primary.main}0D`, // 5% opacity
                    transform: 'translateY(-1px)',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '2px',
                    left: '24px',
                    right: '24px',
                    height: '1px',
                    backgroundColor: 'currentColor',
                    transformOrigin: 'center',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                    transform: 'scaleX(1)',
                }
            },
            // Size variants
            sizeLarge: {
                padding: '12px 28px',
                fontSize: '1rem',
            },
            sizeSmall: {
                padding: '6px 16px',
                fontSize: '0.8rem',
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius,
                border: `1px solid ${palette.divider}`,
                boxShadow: 'none', // Default to no shadow
                backgroundColor: palette.background.paper,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                '&:hover': {
                    boxShadow: shadows[1], // Add shadow on hover
                    borderColor: palette.grey[200], // Lighten border on hover
                }
            }
        }
    },
    MuiContainer: {
        styleOverrides: {
            root: {
                paddingLeft: { xs: 20, sm: 32 }, // More breathing room on mobile
                paddingRight: { xs: 20, sm: 32 },
            }
        }
    },
    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: palette.grey[200],
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: shape.borderRadius,
                    backgroundColor: palette.background.paper,
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '& fieldset': {
                        borderColor: palette.neutral.mid,
                        borderWidth: '1px',
                        transition: 'border-color 0.2s ease-in-out',
                    },
                    '&:hover fieldset': {
                        borderColor: palette.neutral.dark,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: palette.primary.main,
                        borderWidth: '1px',
                        boxShadow: `0 0 0 3px ${palette.primary.main}20`, // 12% opacity focus ring
                    },
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
                        color: palette.primary.main,
                    },
                    '&.Mui-disabled': {
                        color: palette.text.disabled,
                    }
                },
                '& .MuiInputBase-input': {
                    padding: '14px 16px', // Slightly more padding
                    '&.Mui-disabled': {
                        color: palette.text.disabled,
                        WebkitTextFillColor: palette.text.disabled,
                        opacity: 1,
                    },
                },
            },
        }
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: palette.info.main,
                textDecoration: 'none',
                fontWeight: 500,
                position: 'relative',
                transition: 'color 0.2s ease',
                '&:hover': {
                    color: palette.primary.dark,
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                    textDecorationThickness: '1px',
                },
            },
        },
    },
    MuiAccordion: {
        styleOverrides: {
            root: {
                boxShadow: 'none',
                border: `1px solid ${palette.divider}`,
                borderRadius: `${shape.borderRadius}px !important`,
                backgroundColor: palette.background.paper,
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                    margin: '0 0 16px 0', // Prevent margin collapse issues
                    boxShadow: shadows[1], // Add shadow when expanded
                },
                '&:hover': {
                    borderColor: palette.grey[300],
                }
            },
            rounded: {
                '&:first-of-type': {
                    borderTopLeftRadius: shape.borderRadius,
                    borderTopRightRadius: shape.borderRadius,
                },
                '&:last-of-type': {
                    borderBottomLeftRadius: shape.borderRadius,
                    borderBottomRightRadius: shape.borderRadius,
                }
            },
        }
    },
    MuiAccordionSummary: {
        styleOverrides: {
            root: {
                padding: '0 24px',
                minHeight: '64px',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                    backgroundColor: palette.grey[50],
                },
                '& .MuiAccordionSummary-content': {
                    margin: '16px 0',
                },
                '&.Mui-expanded': {
                    minHeight: '64px',
                    backgroundColor: palette.grey[50],
                }
            },
        }
    },
    MuiAccordionDetails: {
        styleOverrides: {
            root: {
                padding: '0 24px 24px 24px',
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none', // Remove default background image gradient
            },
            elevation1: {
                boxShadow: shadows[1],
            },
            elevation2: {
                boxShadow: shadows[2],
            },
            elevation3: {
                boxShadow: shadows[3],
            },
            elevation4: {
                boxShadow: shadows[4],
            },
        }
    },
    // Add overrides for other components as needed
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