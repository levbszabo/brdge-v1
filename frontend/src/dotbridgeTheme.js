import { createTheme } from '@mui/material/styles';

// 1. Font Declarations (Import desired fonts in your main index.css or App.jsx)
// Using Inter for both body and headings for a clean, modern SaaS look
const fontFamilyBody = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontFamilyHeading = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// 2. Enhanced Color Palette based on redesign
const palette = {
    // Ink & Text - Refined for better contrast
    ink: '#0A0D1C', // Darker ink for better contrast
    inkLight: '#4A5568', // Refined gray
    inkFaded: '#8892A0', // Softer gray
    text: {
        primary: '#0A0D1C', // Darker for better readability
        secondary: '#64748B', // Slightly darker secondary text
        disabled: '#CBD5E0', // Light gray
    },

    // Brand Accent (Azure) - Enhanced with redesign colors
    primary: {
        main: '#0066FF', // Bright Azure (from redesign)
        light: '#3384FF', // Lighter shade
        lighter: '#E6F0FF', // Very light blue for backgrounds
        dark: '#0052CC', // Darker shade
        darker: '#003D7A', // Even darker
        contrastText: '#FFFFFF',
    },

    // Neutrals - Refined for modern SaaS aesthetic
    grey: { // Keep the grey object for MUI compatibility
        50: '#F7FAFC',   // Whisper gray
        100: '#F1F5F9',  // Light gray
        200: '#E2E8F0',  // Border gray
        300: '#CBD5E0',  // Light mid gray
        400: '#A0AEB9',  // Mid gray
        500: '#64748B',  // True mid gray
        600: '#475569',  // Dark gray
        700: '#334155',  // Darker gray
        800: '#1E293B',  // Very dark
        900: '#0F172A',  // Near black
    },
    neutral: { // Explicit neutral names from redesign
        light: '#F7FAFC',
        mid: '#CBD5E0',
        dark: '#4A5568',
    },

    // Backgrounds - Clean and modern
    background: {
        default: '#FFFFFF', // Pure White
        paper: '#FFFFFF', // Pure White
        subtle: '#FAFBFC', // Very subtle gray for sections
    },

    // Feedback Colors - Refined for consistency
    success: { main: '#00C781', light: '#E6FFFA', contrastText: '#FFFFFF' },
    error: { main: '#FF3B30', light: '#FFE5E5', contrastText: '#FFFFFF' },
    warning: { main: '#FF9500', light: '#FFF4E5', contrastText: '#FFFFFF' },
    info: { main: '#0066FF', light: '#E6F0FF', contrastText: '#FFFFFF' },

    // Secondary - Using refined gray
    secondary: {
        main: '#64748B',
        light: '#94A3B8',
        dark: '#475569',
        contrastText: '#FFFFFF',
    },

    // Divider Color
    divider: '#E2E8F0', // Clean border color
};

// 3. Typography System - Modern SaaS design from redesign
const typography = {
    fontFamily: fontFamilyBody,
    h1: {
        fontFamily: fontFamilyHeading,
        fontWeight: 700, // Bolder for impact
        fontSize: '4rem', // 64px on desktop (slightly smaller for elegance)
        lineHeight: 1.1,
        letterSpacing: '-0.04em', // Tighter for modern look
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '2.75rem', // 44px on mobile
        }
    },
    h2: {
        fontFamily: fontFamilyHeading,
        fontWeight: 600,
        fontSize: '2.5rem', // 40px
        lineHeight: 1.2,
        letterSpacing: '-0.03em',
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1.875rem', // 30px on mobile
        }
    },
    h3: {
        fontFamily: fontFamilyHeading,
        fontWeight: 600,
        fontSize: '1.875rem', // 30px
        lineHeight: 1.3,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1.5rem', // 24px on mobile
        }
    },
    h4: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.375rem', // 22px
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
        color: palette.text.primary,
    },
    h5: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1.125rem', // 18px
        lineHeight: 1.5,
        letterSpacing: '-0.005em',
        color: palette.text.primary,
    },
    h6: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1rem', // 16px
        lineHeight: 1.5,
        letterSpacing: 0,
        color: palette.text.primary,
    },
    subtitle1: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1.125rem', // 18px
        lineHeight: 1.6,
        letterSpacing: 0,
        color: palette.text.primary,
    },
    subtitle2: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1rem', // 16px
        lineHeight: 1.6,
        letterSpacing: 0,
        color: palette.text.secondary,
    },
    body1: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '1rem', // 16px (cleaner)
        lineHeight: 1.65,
        letterSpacing: 0,
        color: palette.text.primary,
    },
    body2: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.875rem', // 14px
        lineHeight: 1.6,
        letterSpacing: 0,
        color: palette.text.secondary,
    },
    button: {
        fontFamily: fontFamilyBody,
        fontWeight: 500, // Slightly lighter for elegance
        fontSize: '0.875rem', // 14px
        textTransform: 'none',
        letterSpacing: '0.01em',
    },
    caption: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.75rem', // 12px
        lineHeight: 1.5,
        letterSpacing: '0.01em',
        color: palette.text.secondary,
    },
    overline: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '0.75rem', // 12px
        textTransform: 'uppercase',
        letterSpacing: '0.08em', // Slightly tighter
        lineHeight: 1.5,
        color: palette.text.secondary,
    }
};

// 4. Shape (Border Radius)
const shape = {
    borderRadius: 8, // Reduced from 12 for more sophisticated look
};

// 5. Shadows - More refined and subtle
const shadows = [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)', // xs
    '0 2px 4px rgba(0, 0, 0, 0.05)', // sm
    '0 4px 8px rgba(0, 0, 0, 0.08)', // md
    '0 8px 16px rgba(0, 0, 0, 0.1)', // lg
    '0 12px 24px rgba(0, 0, 0, 0.12)', // xl
    '0 16px 32px rgba(0, 0, 0, 0.14)', // 2xl
    '0 24px 48px rgba(0, 0, 0, 0.16)', // 3xl
    // Fill the rest with gradual progression
    ...Array(16).fill('0 32px 64px rgba(0, 0, 0, 0.18)'),
];

// 6. Components Overrides (Refined Styles)
const components = {
    // Apply baseline styles globally
    MuiCssBaseline: {
        styleOverrides: {
            html: {
                scrollBehavior: 'smooth',
                fontSize: '16px',
                // Better font rendering
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
            },
            body: {
                backgroundColor: palette.background.default,
                scrollBehavior: 'smooth',
                // Add subtle selection color
                '& ::selection': {
                    backgroundColor: palette.primary.lighter,
                    color: palette.primary.dark,
                },
                // Improve readability
                textRendering: 'optimizeLegibility',
                // Remove default margins
                margin: 0,
                // Smooth scrolling on iOS
                WebkitOverflowScrolling: 'touch',
            },
            // Basic link styling
            a: {
                color: palette.primary.main,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': {
                    color: palette.primary.dark,
                },
            },
            // Improved focus styles
            '*:focus-visible': {
                outline: `2px solid ${palette.primary.main}`,
                outlineOffset: '2px',
            },
            // Remove default button styles
            'button, input, textarea': {
                fontFamily: 'inherit',
            },
            // Smooth transitions globally
            '*, *::before, *::after': {
                boxSizing: 'border-box',
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius,
                padding: '10px 20px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                textTransform: 'none',
                boxShadow: 'none',
                fontSize: '0.875rem',
                '&:active': {
                    transform: 'scale(0.98)',
                }
            },
            containedPrimary: {
                backgroundColor: palette.primary.main,
                color: palette.primary.contrastText,
                border: 'none',
                '&:hover': {
                    backgroundColor: palette.primary.dark,
                    boxShadow: shadows[2],
                    transform: 'translateY(-1px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: 'none',
                },
            },
            outlinedPrimary: {
                borderColor: palette.grey[300],
                borderWidth: '1px',
                color: palette.text.primary,
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: palette.grey[50],
                    borderColor: palette.grey[400],
                    borderWidth: '1px',
                },
            },
            textPrimary: {
                color: palette.text.primary,
                '&:hover': {
                    backgroundColor: palette.grey[50],
                },
            },
            // Size variants
            sizeLarge: {
                padding: '12px 24px',
                fontSize: '0.9375rem',
                borderRadius: shape.borderRadius,
            },
            sizeSmall: {
                padding: '6px 12px',
                fontSize: '0.8125rem',
                borderRadius: shape.borderRadius * 0.75,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius,
                border: `1px solid ${palette.grey[200]}`,
                boxShadow: 'none',
                backgroundColor: palette.background.paper,
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: shadows[2],
                    borderColor: palette.grey[300],
                }
            }
        }
    },
    MuiContainer: {
        styleOverrides: {
            root: {
                paddingLeft: 20,
                paddingRight: 20,
                '@media (min-width: 768px)': {
                    paddingLeft: 32,
                    paddingRight: 32,
                },
                '@media (min-width: 1024px)': {
                    paddingLeft: 40,
                    paddingRight: 40,
                }
            }
        }
    },
    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: palette.divider,
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: shape.borderRadius * 0.75,
                    backgroundColor: palette.background.paper,
                    transition: 'all 0.2s ease',
                    fontSize: '0.9375rem',
                    '& fieldset': {
                        borderColor: palette.grey[300],
                        borderWidth: '1px',
                        transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                        borderColor: palette.grey[400],
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: palette.primary.main,
                        borderWidth: '1px',
                    },
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 4px ${palette.primary.main}15`,
                    },
                    '&.Mui-disabled': {
                        backgroundColor: palette.grey[50],
                        '& fieldset': {
                            borderColor: palette.grey[200],
                        },
                    },
                },
                '& .MuiInputLabel-root': {
                    color: palette.text.secondary,
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    '&.Mui-focused': {
                        color: palette.primary.main,
                        fontWeight: 500,
                    },
                },
                '& .MuiInputBase-input': {
                    padding: '12px 14px',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    '&::placeholder': {
                        color: palette.text.disabled,
                        opacity: 1,
                    },
                },
                '& .MuiFormHelperText-root': {
                    marginTop: '4px',
                    fontSize: '0.75rem',
                },
            },
        }
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: palette.primary.main,
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease',
                '&:hover': {
                    color: palette.primary.dark,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    textDecorationThickness: '1px',
                },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
                borderRadius: shape.borderRadius,
            },
            elevation0: {
                boxShadow: 'none',
                border: `1px solid ${palette.grey[200]}`,
            },
            elevation1: {
                boxShadow: shadows[1],
                border: 'none',
            },
            elevation2: {
                boxShadow: shadows[2],
                border: 'none',
            },
            elevation3: {
                boxShadow: shadows[3],
                border: 'none',
            },
            elevation4: {
                boxShadow: shadows[4],
                border: 'none',
            },
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius * 0.5,
                fontWeight: 500,
                border: 'none',
                height: '28px',
                fontSize: '0.8125rem',
            },
            filled: {
                backgroundColor: palette.grey[100],
                color: palette.text.primary,
                '&:hover': {
                    backgroundColor: palette.grey[200],
                },
            },
            outlined: {
                borderColor: palette.grey[300],
                backgroundColor: palette.background.paper,
                '&:hover': {
                    backgroundColor: palette.grey[50],
                },
            },
        }
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: palette.grey[100],
                },
            },
        }
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: palette.background.paper,
                color: palette.text.primary,
                boxShadow: 'none',
                borderBottom: `1px solid ${palette.divider}`,
            },
        }
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRadius: 0,
                boxShadow: shadows[4],
            },
        }
    },
    // Add other components as needed
};

// 7. Spacing System - Consistent spacing scale
const spacing = 8; // Base spacing unit (8px)

// 8. Create the Theme
const dotbridgeTheme = createTheme({
    palette: palette,
    typography: typography,
    shape: shape,
    shadows: shadows,
    spacing: spacing,
    components: components,
    // Add custom breakpoints for better responsive control
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
});

// Apply responsive typography
dotbridgeTheme.typography.h1 = {
    ...dotbridgeTheme.typography.h1,
    [dotbridgeTheme.breakpoints.down('md')]: {
        fontSize: '3rem',
    },
    [dotbridgeTheme.breakpoints.down('sm')]: {
        fontSize: '2.5rem',
    },
};

dotbridgeTheme.typography.h2 = {
    ...dotbridgeTheme.typography.h2,
    [dotbridgeTheme.breakpoints.down('md')]: {
        fontSize: '2rem',
    },
    [dotbridgeTheme.breakpoints.down('sm')]: {
        fontSize: '1.75rem',
    },
};

dotbridgeTheme.typography.h3 = {
    ...dotbridgeTheme.typography.h3,
    [dotbridgeTheme.breakpoints.down('md')]: {
        fontSize: '1.5rem',
    },
    [dotbridgeTheme.breakpoints.down('sm')]: {
        fontSize: '1.25rem',
    },
};

export default dotbridgeTheme; 