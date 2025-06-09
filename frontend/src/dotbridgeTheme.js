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
        primary: '#0A0D1C',
        secondary: '#5B6B7A',
        disabled: '#B8C5D1',
    },

    // Enhanced Brand Colors - More vibrant and sophisticated
    primary: {
        main: '#0066FF', // Bright Azure
        light: '#4D8CFF', // Lighter shade
        lighter: '#E8F2FF', // Very light blue for backgrounds
        dark: '#0052DD', // Darker shade
        darker: '#003DB8', // Even darker
        contrastText: '#FFFFFF',
        // Add gradient variants
        gradientStart: '#0066FF',
        gradientEnd: '#0052DD',
        shadow: 'rgba(0, 102, 255, 0.3)',
    },

    // Enhanced Neutrals with more sophisticated grays
    grey: {
        25: '#FCFCFD',   // Ultra light
        50: '#F9FAFB',   // Almost white
        100: '#F2F4F7',  // Light gray
        200: '#E4E7EC',  // Border gray
        300: '#D0D5DD',  // Light mid gray
        400: '#98A2B3',  // Mid gray
        500: '#667085',  // True mid gray
        600: '#475467',  // Dark gray
        700: '#344054',  // Darker gray
        800: '#1D2939',  // Very dark
        900: '#101828',  // Near black
        950: '#0C111D',  // Ultra dark
    },
    neutral: {
        lightest: '#FCFCFD',
        light: '#F9FAFB',
        mid: '#D0D5DD',
        dark: '#475467',
    },

    // Enhanced Backgrounds with subtle variations
    background: {
        default: '#FFFFFF',
        paper: '#FFFFFF',
        subtle: '#F9FAFB',
        elevated: '#FCFCFD',
        glass: 'rgba(255, 255, 255, 0.8)',
    },

    // Enhanced Feedback Colors
    success: {
        main: '#00D084',
        light: '#E7FDF4',
        lighter: '#F0FDF9',
        dark: '#00B872',
        darker: '#059669',
        contrastText: '#FFFFFF',
        shadow: 'rgba(0, 208, 132, 0.3)',
    },
    error: {
        main: '#FF4444',
        light: '#FEF2F2',
        lighter: '#FFF5F5',
        dark: '#E53E3E',
        darker: '#C53030',
        contrastText: '#FFFFFF',
        shadow: 'rgba(255, 68, 68, 0.3)',
    },
    warning: {
        main: '#FF9500',
        light: '#FFFBEB',
        lighter: '#FFFCF0',
        dark: '#F59E0B',
        darker: '#D97706',
        contrastText: '#FFFFFF',
        shadow: 'rgba(255, 149, 0, 0.3)',
    },
    info: {
        main: '#0EA5E9',
        light: '#F0F9FF',
        lighter: '#F7FBFF',
        dark: '#0284C7',
        darker: '#0369A1',
        contrastText: '#FFFFFF',
        shadow: 'rgba(14, 165, 233, 0.3)',
    },

    // Enhanced Secondary
    secondary: {
        main: '#667085',
        light: '#98A2B3',
        lighter: '#F2F4F7',
        dark: '#475467',
        darker: '#344054',
        contrastText: '#FFFFFF',
    },

    // Enhanced Divider
    divider: '#E4E7EC',
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
    '0 1px 2px rgba(16, 24, 40, 0.05)', // xs - subtle
    '0 1px 3px rgba(16, 24, 40, 0.1), 0 1px 2px rgba(16, 24, 40, 0.06)', // sm - layered
    '0 4px 8px rgba(16, 24, 40, 0.08), 0 2px 4px rgba(16, 24, 40, 0.03)', // md - layered
    '0 8px 16px rgba(16, 24, 40, 0.1), 0 4px 6px rgba(16, 24, 40, 0.05)', // lg - layered
    '0 12px 24px rgba(16, 24, 40, 0.12), 0 4px 8px rgba(16, 24, 40, 0.06)', // xl - layered
    '0 16px 32px rgba(16, 24, 40, 0.14), 0 6px 12px rgba(16, 24, 40, 0.08)', // 2xl - dramatic
    '0 24px 48px rgba(16, 24, 40, 0.16), 0 12px 24px rgba(16, 24, 40, 0.1)', // 3xl - very dramatic
    // Colored shadows for interactive elements
    '0 8px 24px rgba(0, 102, 255, 0.2), 0 4px 8px rgba(0, 102, 255, 0.1)', // primary shadow
    '0 8px 24px rgba(0, 208, 132, 0.2), 0 4px 8px rgba(0, 208, 132, 0.1)', // success shadow
    // Fill the rest
    ...Array(14).fill('0 32px 64px rgba(16, 24, 40, 0.18), 0 16px 32px rgba(16, 24, 40, 0.12)'),
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
                background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
                '&:hover': {
                    background: `linear-gradient(135deg, ${palette.primary.dark} 0%, ${palette.primary.darker} 100%)`,
                    boxShadow: `0 8px 24px ${palette.primary.shadow}`,
                    transform: 'translateY(-2px)',
                },
                '&:active': {
                    transform: 'translateY(-1px) scale(0.98)',
                    boxShadow: `0 4px 12px ${palette.primary.shadow}`,
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
                    '&::before': {
                        background: `linear-gradient(135deg, ${palette.primary.main}08 0%, ${palette.primary.light}08 100%)`,
                    },
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