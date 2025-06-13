import { createTheme } from '@mui/material/styles';

// 1. Enhanced Font Declarations - Using a more sophisticated font stack
const fontFamilyBody = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontFamilyHeading = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontFamilyMono = '"Fira Code", "Monaco", "Consolas", monospace';

// 2. Enhanced Color Palette - More sophisticated and modern
const palette = {
    // Enhanced Ink & Text with better contrast
    ink: '#0A0D1C',
    inkLight: '#3A4553',
    inkFaded: '#7B8794',
    text: {
        primary: '#1A202C',
        secondary: '#64748B',
        disabled: '#CBD5E1',
    },

    // Clean Azure Blue Brand Colors - Minimalist and Professional
    primary: {
        main: '#0066FF', // Pure Azure Blue
        light: '#3385FF', // Lighter azure
        lighter: '#E6F0FF', // Very light blue for backgrounds
        lightest: '#F0F7FF', // Ultra light blue
        dark: '#0052CC', // Darker azure
        darker: '#003D99', // Even darker
        contrastText: '#FFFFFF',
        // Remove gradients for cleaner look
        shadow: 'rgba(0, 102, 255, 0.15)',
    },

    // Enhanced Neutrals with cleaner grays
    grey: {
        25: '#FCFCFD',   // Ultra light
        50: '#F8FAFC',   // Almost white
        100: '#F1F5F9',  // Light gray
        200: '#E2E8F0',  // Border gray
        300: '#CBD5E1',  // Light mid gray
        400: '#94A3B8',  // Mid gray
        500: '#64748B',  // True mid gray
        600: '#475569',  // Dark gray
        700: '#334155',  // Darker gray
        800: '#1E293B',  // Very dark
        900: '#0F172A',  // Near black
        950: '#020617',  // Ultra dark
    },
    neutral: {
        lightest: '#FCFCFD',
        light: '#F8FAFC',
        mid: '#CBD5E1',
        dark: '#475569',
    },

    // Clean Backgrounds - Pure whites
    background: {
        default: '#FFFFFF',
        paper: '#FFFFFF',
        subtle: '#F8FAFC',
        elevated: '#FFFFFF',
        glass: 'rgba(255, 255, 255, 0.95)',
    },

    // Clean Feedback Colors - Muted for professional look
    success: {
        main: '#10B981',
        light: '#D1FAE5',
        lighter: '#ECFDF5',
        dark: '#059669',
        darker: '#047857',
        contrastText: '#FFFFFF',
        shadow: 'rgba(16, 185, 129, 0.15)',
    },
    error: {
        main: '#EF4444',
        light: '#FEE2E2',
        lighter: '#FEF2F2',
        dark: '#DC2626',
        darker: '#B91C1C',
        contrastText: '#FFFFFF',
        shadow: 'rgba(239, 68, 68, 0.15)',
    },
    warning: {
        main: '#F59E0B',
        light: '#FEF3C7',
        lighter: '#FFFBEB',
        dark: '#D97706',
        darker: '#B45309',
        contrastText: '#FFFFFF',
        shadow: 'rgba(245, 158, 11, 0.15)',
    },
    info: {
        main: '#3B82F6',
        light: '#DBEAFE',
        lighter: '#EFF6FF',
        dark: '#2563EB',
        darker: '#1D4ED8',
        contrastText: '#FFFFFF',
        shadow: 'rgba(59, 130, 246, 0.15)',
    },

    // Clean Secondary
    secondary: {
        main: '#64748B',
        light: '#94A3B8',
        lighter: '#F1F5F9',
        dark: '#475569',
        darker: '#334155',
        contrastText: '#FFFFFF',
    },

    // Clean Divider
    divider: '#E2E8F0',
};

// 3. Enhanced Typography System with better hierarchy and spacing
const typography = {
    fontFamily: fontFamilyBody,
    h1: {
        fontFamily: fontFamilyHeading,
        fontWeight: 800, // Increased weight for more impact
        fontSize: '4rem', // Larger for hero impact
        lineHeight: 1.05, // Tighter line height
        letterSpacing: '-0.05em', // More dramatic negative spacing
        color: palette.text.primary,
        textRendering: 'optimizeLegibility',
        '@media (max-width: 768px)': {
            fontSize: '3.5rem',
            lineHeight: 1.1,
        },
        '@media (max-width: 640px)': {
            fontSize: '3rem',
            lineHeight: 1.15,
        }
    },
    h2: {
        fontFamily: fontFamilyHeading,
        fontWeight: 700, // Increased weight
        fontSize: '2.75rem', // Larger
        lineHeight: 1.15,
        letterSpacing: '-0.04em',
        color: palette.text.primary,
        textRendering: 'optimizeLegibility',
        '@media (max-width: 768px)': {
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        '@media (max-width: 640px)': {
            fontSize: '2.25rem',
        }
    },
    h3: {
        fontFamily: fontFamilyHeading,
        fontWeight: 650, // Custom weight
        fontSize: '2rem',
        lineHeight: 1.25,
        letterSpacing: '-0.03em',
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1.75rem',
        }
    },
    h4: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.35,
        letterSpacing: '-0.02em',
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1.375rem',
        }
    },
    h5: {
        fontFamily: fontFamilyBody,
        fontWeight: 550, // Custom weight
        fontSize: '1.25rem',
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1.125rem',
        }
    },
    h6: {
        fontFamily: fontFamilyBody,
        fontWeight: 550,
        fontSize: '1.125rem',
        lineHeight: 1.45,
        letterSpacing: '-0.005em',
        color: palette.text.primary,
    },
    subtitle1: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.5,
        letterSpacing: 0,
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1.125rem',
        }
    },
    subtitle2: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1.125rem',
        lineHeight: 1.5,
        letterSpacing: 0,
        color: palette.text.secondary,
        '@media (max-width: 768px)': {
            fontSize: '1rem',
        }
    },
    body1: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '1.0625rem', // Slightly larger for better readability
        lineHeight: 1.65,
        letterSpacing: 0,
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1rem',
        }
    },
    body2: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.9375rem',
        lineHeight: 1.6,
        letterSpacing: 0,
        color: palette.text.secondary,
        '@media (max-width: 768px)': {
            fontSize: '0.875rem',
        }
    },
    button: {
        fontFamily: fontFamilyBody,
        fontWeight: 550, // Custom weight for buttons
        fontSize: '0.9375rem',
        textTransform: 'none',
        letterSpacing: '0.005em',
        lineHeight: 1.5,
        '@media (max-width: 768px)': {
            fontSize: '1rem',
        }
    },
    caption: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.8125rem',
        lineHeight: 1.5,
        letterSpacing: '0.01em',
        color: palette.text.secondary,
    },
    overline: {
        fontFamily: fontFamilyBody,
        fontWeight: 650, // Stronger for labels
        fontSize: '0.8125rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        lineHeight: 1.5,
        color: palette.text.secondary,
    },
    // Add monospace variant
    mono: {
        fontFamily: fontFamilyMono,
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: 0,
    }
};

// 4. Enhanced Shape with more subtle radius values
const shape = {
    borderRadius: 4, // Subtle base radius
    borderRadiusSmall: 3,
    borderRadiusLarge: 6,
    borderRadiusXLarge: 8,
};

// 5. Enhanced Shadows with more depth and sophistication
const shadows = [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)', // xs - subtle
    '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)', // sm - layered
    '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)', // md - layered
    '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)', // lg - layered
    '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)', // xl - layered
    '0 25px 50px rgba(0, 0, 0, 0.12)', // 2xl - dramatic
    '0 35px 60px rgba(0, 0, 0, 0.15)', // 3xl - very dramatic
    // Clean shadows for interactive elements
    '0 4px 20px rgba(0, 102, 255, 0.15)', // primary shadow
    '0 4px 20px rgba(16, 185, 129, 0.15)', // success shadow
    // Fill the rest
    ...Array(14).fill('0 35px 60px rgba(0, 0, 0, 0.15)'),
];

// 6. Enhanced Components with premium styling
const components = {
    MuiCssBaseline: {
        styleOverrides: {
            html: {
                scrollBehavior: 'smooth',
                fontSize: '16px',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
            },
            body: {
                backgroundColor: palette.background.default,
                scrollBehavior: 'smooth',
                '& ::selection': {
                    backgroundColor: palette.primary.lighter,
                    color: palette.primary.darker,
                },
                textRendering: 'optimizeLegibility',
                margin: 0,
                WebkitOverflowScrolling: 'touch',
                // Enhanced font feature settings
                fontFeatureSettings: '"rlig" 1, "calt" 1, "ss01" 1',
            },
            a: {
                color: palette.primary.main,
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    color: palette.primary.dark,
                },
            },
            '*:focus-visible': {
                outline: `2px solid ${palette.primary.main}`,
                outlineOffset: '2px',
                borderRadius: '4px',
            },
            'button, input, textarea': {
                fontFamily: 'inherit',
            },
            '*, *::before, *::after': {
                boxSizing: 'border-box',
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius,
                padding: '11px 20px',
                fontWeight: 550,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                boxShadow: 'none',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                position: 'relative',
                overflow: 'hidden',
                '&:active': {
                    transform: 'scale(0.98)',
                },
                // Add subtle ripple effect
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'transparent',
                    transition: 'background 0.2s ease',
                    borderRadius: 'inherit',
                },
            },
            containedPrimary: {
                backgroundColor: palette.primary.main,
                color: palette.primary.contrastText,
                border: 'none',
                '&:hover': {
                    backgroundColor: palette.primary.dark,
                    boxShadow: `0 4px 20px ${palette.primary.shadow}`,
                    transform: 'translateY(-2px)',
                },
                '&:active': {
                    transform: 'translateY(-1px) scale(0.98)',
                    boxShadow: `0 2px 10px ${palette.primary.shadow}`,
                },
            },
            outlinedPrimary: {
                borderColor: palette.grey[300],
                borderWidth: '1.5px',
                color: palette.text.primary,
                backgroundColor: 'transparent',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                    backgroundColor: palette.grey[50],
                    borderColor: palette.grey[400],
                    borderWidth: '1.5px',
                    transform: 'translateY(-1px)',
                    boxShadow: shadows[2],
                },
            },
            textPrimary: {
                color: palette.text.primary,
                '&:hover': {
                    backgroundColor: palette.grey[50],
                },
            },
            sizeLarge: {
                padding: '14px 28px',
                fontSize: '1rem',
                borderRadius: shape.borderRadiusLarge,
                fontWeight: 550,
            },
            sizeSmall: {
                padding: '6px 16px',
                fontSize: '0.875rem',
                borderRadius: shape.borderRadiusSmall,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadiusLarge,
                border: `1px solid ${palette.grey[200]}`,
                boxShadow: 'none',
                backgroundColor: palette.background.paper,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                // Add subtle backdrop filter for glass effect
                backdropFilter: 'blur(1px)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: shadows[4],
                    borderColor: palette.grey[300],
                    '&::before': {
                        opacity: 1,
                    },
                },
                // Subtle shine effect
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${palette.background.glass}, transparent)`,
                    transition: 'all 0.6s ease',
                    opacity: 0,
                    pointerEvents: 'none',
                },
            }
        }
    },
    MuiContainer: {
        styleOverrides: {
            root: {
                paddingLeft: 16,
                paddingRight: 16,
                '@media (min-width: 640px)': {
                    paddingLeft: 24,
                    paddingRight: 24,
                },
                '@media (min-width: 768px)': {
                    paddingLeft: 32,
                    paddingRight: 32,
                },
                '@media (min-width: 1024px)': {
                    paddingLeft: 40,
                    paddingRight: 40,
                },
                '@media (min-width: 1280px)': {
                    paddingLeft: 48,
                    paddingRight: 48,
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
                    borderRadius: shape.borderRadius,
                    backgroundColor: palette.background.paper,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '0.9375rem',
                    '& fieldset': {
                        borderColor: palette.grey[300],
                        borderWidth: '1.5px',
                        transition: 'all 0.2s ease',
                    },
                    '&:hover fieldset': {
                        borderColor: palette.grey[400],
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: palette.primary.main,
                        borderWidth: '2px',
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
                    fontWeight: 500,
                    '&.Mui-focused': {
                        color: palette.primary.main,
                        fontWeight: 550,
                    },
                },
                '& .MuiInputBase-input': {
                    padding: '12px 16px',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    '&::placeholder': {
                        color: palette.text.disabled,
                        opacity: 1,
                    },
                },
                '& .MuiFormHelperText-root': {
                    marginTop: '6px',
                    fontSize: '0.8125rem',
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
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    color: palette.primary.dark,
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    textDecorationThickness: '2px',
                },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
                borderRadius: shape.borderRadiusLarge,
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
                borderRadius: shape.borderRadius,
                fontWeight: 550,
                border: 'none',
                height: '32px',
                fontSize: '0.875rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-1px)',
                },
            },
            filled: {
                backgroundColor: palette.grey[100],
                color: palette.text.primary,
                '&:hover': {
                    backgroundColor: palette.grey[200],
                    boxShadow: shadows[1],
                },
            },
            outlined: {
                borderColor: palette.grey[300],
                backgroundColor: palette.background.paper,
                '&:hover': {
                    backgroundColor: palette.grey[50],
                    borderColor: palette.grey[400],
                },
            },
        }
    },
    MuiIconButton: {
        styleOverrides: {
            root: {
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    backgroundColor: palette.grey[100],
                    transform: 'translateY(-1px)',
                },
            },
        }
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: palette.background.glass,
                color: palette.text.primary,
                boxShadow: 'none',
                borderBottom: `1px solid ${palette.divider}`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            },
        }
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRadius: 0,
                boxShadow: shadows[6],
                backdropFilter: 'blur(12px)',
                backgroundColor: palette.background.glass,
            },
        }
    },
};

// 7. Enhanced Spacing System
const spacing = 8;

// 8. Create the Enhanced Theme
const dotbridgeTheme = createTheme({
    palette: palette,
    typography: typography,
    shape: shape,
    shadows: shadows,
    spacing: spacing,
    components: components,
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536, // Add extra large breakpoint
        },
    },
    // Add custom easing functions
    transitions: {
        easing: {
            // Custom easing curves for premium feel
            easeInOutCubic: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
            easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
        },
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
        },
    },
});

// Apply enhanced responsive typography
dotbridgeTheme.typography.h1 = {
    ...dotbridgeTheme.typography.h1,
    [dotbridgeTheme.breakpoints.down('md')]: {
        fontSize: '3.5rem',
        lineHeight: 1.1,
        letterSpacing: '-0.04em',
    },
    [dotbridgeTheme.breakpoints.down('sm')]: {
        fontSize: '3rem',
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
    },
};

dotbridgeTheme.typography.h2 = {
    ...dotbridgeTheme.typography.h2,
    [dotbridgeTheme.breakpoints.down('md')]: {
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.03em',
    },
    [dotbridgeTheme.breakpoints.down('sm')]: {
        fontSize: '2.25rem',
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
    },
};

dotbridgeTheme.typography.h3 = {
    ...dotbridgeTheme.typography.h3,
    [dotbridgeTheme.breakpoints.down('md')]: {
        fontSize: '1.75rem',
        lineHeight: 1.3,
    },
    [dotbridgeTheme.breakpoints.down('sm')]: {
        fontSize: '1.5rem',
        lineHeight: 1.35,
    },
};

export default dotbridgeTheme; 