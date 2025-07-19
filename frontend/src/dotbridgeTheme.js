import { createTheme } from '@mui/material/styles';

// Academic Typography - Research-grade font stack
const fontFamilyHeading = '"Merriweather", "Georgia", "Times New Roman", serif';
const fontFamilyBody = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontFamilyMono = '"IBM Plex Mono", "Monaco", "Consolas", monospace';

// Academic Color Palette with modern enhancements
const palette = {
    // Primary academic colors with subtle gradients
    primary: {
        main: '#1a1a2e',        // Deep academic navy
        light: '#4b5563',       // Muted blue-gray
        lighter: '#f8fafc',     // Subtle background tint
        lightest: '#fdfdfd',    // Off-white background
        dark: '#0f172a',        // Very deep navy
        darker: '#020617',      // Near black
        contrastText: '#ffffff',
        shadow: 'rgba(26, 26, 46, 0.08)',
        // Add gradient for modern touch
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f172a 100%)',
        lightGradient: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
    },

    // Academic text hierarchy
    text: {
        primary: '#1a1a2e',     // Deep navy for main text
        secondary: '#4b5563',   // Muted gray for secondary text
        disabled: '#9ca3af',    // Light gray for disabled
        hint: '#6b7280',        // Subtle hint text
    },

    // Clean academic grays with glassmorphism support
    grey: {
        50: '#fdfdfd',          // Off-white
        100: '#f8fafc',         // Very light gray
        200: '#e5e7eb',         // Light border gray
        300: '#d1d5db',         // Medium border
        400: '#9ca3af',         // Mid gray
        500: '#6b7280',         // True mid
        600: '#4b5563',         // Dark gray
        700: '#374151',         // Darker
        800: '#1f2937',         // Very dark
        900: '#111827',         // Near black
        // Glassmorphism variants
        glass: 'rgba(248, 250, 252, 0.8)',
        glassHover: 'rgba(248, 250, 252, 0.9)',
        glassBorder: 'rgba(229, 231, 235, 0.3)',
    },

    // Academic backgrounds with glassmorphism
    background: {
        default: '#fdfdfd',     // Off-white for academic feel
        paper: '#ffffff',       // Pure white for cards/papers
        subtle: '#f8fafc',      // Very subtle tint
        section: '#fafafc',     // Alternate section background
        glass: 'rgba(255, 255, 255, 0.85)',    // Glassmorphism
        glassStrong: 'rgba(255, 255, 255, 0.95)', // Stronger glass
    },

    // Muted feedback colors - professional and understated
    success: {
        main: '#065f46',        // Dark forest green
        light: '#ecfdf5',       // Very light green
        contrastText: '#ffffff',
        gradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    },
    error: {
        main: '#7f1d1d',        // Dark burgundy
        light: '#fef2f2',       // Very light red
        contrastText: '#ffffff',
        gradient: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
    },
    warning: {
        main: '#92400e',        // Dark amber
        light: '#fffbeb',       // Very light yellow
        contrastText: '#ffffff',
        gradient: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
    },
    info: {
        main: '#1e3a8a',        // Academic blue
        light: '#eff6ff',       // Very light blue
        contrastText: '#ffffff',
        gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    },

    // Academic secondary
    secondary: {
        main: '#4b5563',        // Muted blue-gray
        light: '#9ca3af',
        dark: '#374151',
        contrastText: '#ffffff',
        gradient: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
    },

    // Clean dividers
    divider: '#e5e7eb',
};

// Academic Typography System - Research paper inspired
const typography = {
    fontFamily: fontFamilyBody,

    // Main title - like a research paper title
    h1: {
        fontFamily: fontFamilyHeading,
        fontWeight: 300,        // Light weight for elegance
        fontSize: '3rem',       // Substantial but not overwhelming
        lineHeight: 1.2,        // Tight for academic feel
        letterSpacing: '-0.02em',
        color: palette.text.primary,
        textRendering: 'optimizeLegibility',
        '@media (max-width: 768px)': {
            fontSize: '2.5rem',
            lineHeight: 1.25,
        },
        '@media (max-width: 640px)': {
            fontSize: '2rem',
            lineHeight: 1.3,
        }
    },

    // Section headers - like research paper sections
    h2: {
        fontFamily: fontFamilyHeading,
        fontWeight: 400,        // Regular weight
        fontSize: '2.25rem',    // Clear hierarchy
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        color: palette.text.primary,
        textRendering: 'optimizeLegibility',
        marginBottom: '1.5rem',
        '@media (max-width: 768px)': {
            fontSize: '2rem',
            lineHeight: 1.35,
        },
        '@media (max-width: 640px)': {
            fontSize: '1.75rem',
        }
    },

    // Subsection headers
    h3: {
        fontFamily: fontFamilyHeading,
        fontWeight: 400,
        fontSize: '1.75rem',
        lineHeight: 1.4,
        letterSpacing: '0',
        color: palette.text.primary,
        marginBottom: '1rem',
        '@media (max-width: 768px)': {
            fontSize: '1.5rem',
        }
    },

    h4: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,        // Semi-bold for clarity
        fontSize: '1.375rem',
        lineHeight: 1.45,
        color: palette.text.primary,
        '@media (max-width: 768px)': {
            fontSize: '1.25rem',
        }
    },

    h5: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.5,
        color: palette.text.primary,
    },

    h6: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: palette.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },

    // Subtitle for abstract/lead text
    subtitle1: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '1.25rem',
        lineHeight: 1.7,        // Generous line height for readability
        letterSpacing: '0',
        color: palette.text.secondary,
        fontStyle: 'italic',    // Academic abstract style
        '@media (max-width: 768px)': {
            fontSize: '1.125rem',
        }
    },

    subtitle2: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.6,
        color: palette.text.secondary,
    },

    // Body text - academic readability
    body1: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.7,        // Academic line height
        letterSpacing: '0',
        color: palette.text.primary,
    },

    body2: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.65,
        color: palette.text.secondary,
    },

    // Button text - clean and minimal
    button: {
        fontFamily: fontFamilyBody,
        fontWeight: 500,
        fontSize: '0.875rem',
        textTransform: 'none',
        letterSpacing: '0.01em',
        lineHeight: 1.5,
    },

    caption: {
        fontFamily: fontFamilyBody,
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.6,
        letterSpacing: '0.02em',
        color: palette.text.secondary,
    },

    overline: {
        fontFamily: fontFamilyBody,
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        lineHeight: 1.5,
        color: palette.text.secondary,
    },

    // Monospace for code/technical terms
    mono: {
        fontFamily: fontFamilyMono,
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.6,
        letterSpacing: '0',
    }
};

// Minimal academic shape
const shape = {
    borderRadius: 2,        // Very subtle radius
    borderRadiusSmall: 1,
    borderRadiusLarge: 4,
    borderRadiusXLarge: 6,
};

// Enhanced shadows with glassmorphism support
const shadows = [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.03)',     // Barely visible
    '0 1px 3px rgba(0, 0, 0, 0.05)',     // Very subtle
    '0 2px 4px rgba(0, 0, 0, 0.06)',     // Subtle
    '0 3px 6px rgba(0, 0, 0, 0.07)',     // Light
    '0 4px 8px rgba(0, 0, 0, 0.08)',     // Medium
    '0 6px 12px rgba(0, 0, 0, 0.1)',     // Pronounced
    '0 8px 16px rgba(0, 0, 0, 0.12)',    // Strong
    // Glassmorphism shadows
    '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.02)', // Glass effect
    '0 16px 64px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.04)',  // Strong glass
    // Fill the rest with subtle variations
    ...Array(15).fill('0 8px 16px rgba(0, 0, 0, 0.12)'),
];

// Enhanced components with glassmorphism and modern touches
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
                fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1', // Enhanced typography
                '& ::selection': {
                    backgroundColor: palette.primary.lighter,
                    color: palette.primary.main,
                },
            },
            // Academic link styling
            a: {
                color: palette.primary.main,
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.2s ease',
                '&:hover': {
                    borderBottomColor: palette.primary.main,
                },
            },
        },
    },

    // Enhanced academic buttons with gradients
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius,
                padding: '12px 24px',
                fontWeight: 500,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'none',
                boxShadow: 'none',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                position: 'relative',
                overflow: 'hidden',
                '&:active': {
                    transform: 'scale(0.98)',
                },
                // Enhanced hover animations
                '&:hover': {
                    transform: 'translateY(-1px)',
                },
            },
            containedPrimary: {
                background: palette.primary.gradient,
                color: palette.primary.contrastText,
                border: 'none',
                '&:hover': {
                    background: `linear-gradient(135deg, ${palette.primary.dark} 0%, ${palette.primary.darker} 100%)`,
                    boxShadow: shadows[8],
                    transform: 'translateY(-2px)',
                },
                '&:active': {
                    transform: 'translateY(-1px) scale(0.98)',
                },
            },
            outlinedPrimary: {
                borderColor: palette.primary.main,
                borderWidth: '1px',
                color: palette.primary.main,
                backgroundColor: 'transparent',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                    backgroundColor: palette.primary.lighter,
                    borderColor: palette.primary.dark,
                    backdropFilter: 'blur(12px)',
                    boxShadow: shadows[2],
                },
            },
            textPrimary: {
                color: palette.primary.main,
                '&:hover': {
                    backgroundColor: palette.primary.lighter,
                    backdropFilter: 'blur(8px)',
                },
            },
            sizeLarge: {
                padding: '16px 32px',
                fontSize: '1rem',
                borderRadius: shape.borderRadiusLarge,
                '@media (max-width: 640px)': {
                    padding: '14px 28px',
                    fontSize: '0.9375rem',
                },
            },
        },
    },

    // Enhanced academic cards with glassmorphism
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadiusLarge,
                border: `1px solid ${palette.grey.glassBorder}`,
                boxShadow: 'none',
                backgroundColor: palette.background.glass,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                    backgroundColor: palette.background.glassStrong,
                    boxShadow: shadows[8],
                    borderColor: palette.grey[300],
                    transform: 'translateY(-2px)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                },
                // Subtle shine effect on hover
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.6s ease',
                    pointerEvents: 'none',
                    opacity: 0,
                },
                '&:hover::before': {
                    left: '100%',
                    opacity: 1,
                },
            }
        }
    },

    // Enhanced containers for mobile
    MuiContainer: {
        styleOverrides: {
            root: {
                paddingLeft: 16,
                paddingRight: 16,
                '@media (min-width: 480px)': {
                    paddingLeft: 20,
                    paddingRight: 20,
                },
                '@media (min-width: 640px)': {
                    paddingLeft: 32,
                    paddingRight: 32,
                },
                '@media (min-width: 768px)': {
                    paddingLeft: 40,
                    paddingRight: 40,
                },
                '@media (min-width: 1024px)': {
                    paddingLeft: 48,
                    paddingRight: 48,
                },
            }
        }
    },

    // Clean dividers
    MuiDivider: {
        styleOverrides: {
            root: {
                borderColor: palette.divider,
            }
        }
    },

    // Enhanced form inputs with glassmorphism
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: shape.borderRadius,
                    backgroundColor: palette.background.glass,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                        borderColor: palette.grey.glassBorder,
                        borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                        borderColor: palette.grey[400],
                    },
                    '&.Mui-focused': {
                        backgroundColor: palette.background.glassStrong,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        '& fieldset': {
                            borderColor: palette.primary.main,
                            borderWidth: '1px',
                        },
                    },
                },
            },
        }
    },

    // Enhanced chips with subtle glassmorphism
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: shape.borderRadius,
                fontWeight: 400,
                fontSize: '0.8125rem',
                height: '28px',
                fontFamily: fontFamilyBody,
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-1px)',
                },
            },
            outlined: {
                borderColor: palette.grey[300],
                color: palette.text.secondary,
                backgroundColor: palette.background.glass,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                '&:hover': {
                    backgroundColor: palette.background.glassStrong,
                    borderColor: palette.grey[400],
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                },
            },
        }
    },

    // Enhanced app bar with better glassmorphism
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: palette.background.glass,
                color: palette.text.primary,
                boxShadow: 'none',
                borderBottom: `1px solid ${palette.grey.glassBorder}`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                transition: 'all 0.3s ease',
                // Better mobile styling
                '@media (max-width: 768px)': {
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(253, 253, 253, 0.95)',
                },
            },
        }
    },

    // Enhanced Paper component
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: 'none',
                borderRadius: shape.borderRadiusLarge,
                transition: 'all 0.2s ease',
            },
            elevation0: {
                boxShadow: 'none',
                border: `1px solid ${palette.grey[200]}`,
                backgroundColor: palette.background.glass,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            },
            elevation1: {
                boxShadow: shadows[1],
                border: 'none',
                backgroundColor: palette.background.glass,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            },
            elevation2: {
                boxShadow: shadows[8],
                border: 'none',
                backgroundColor: palette.background.glassStrong,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
            },
        }
    },

    // Enhanced Typography for better mobile rendering
    MuiTypography: {
        styleOverrides: {
            h1: {
                '@media (max-width: 480px)': {
                    fontSize: '1.875rem',
                    lineHeight: 1.2,
                },
            },
            h2: {
                '@media (max-width: 480px)': {
                    fontSize: '1.625rem',
                    lineHeight: 1.25,
                },
            },
            h3: {
                '@media (max-width: 480px)': {
                    fontSize: '1.375rem',
                    lineHeight: 1.3,
                },
            },
            body1: {
                '@media (max-width: 480px)': {
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                },
            },
            subtitle1: {
                '@media (max-width: 480px)': {
                    fontSize: '1rem',
                    lineHeight: 1.6,
                },
            },
        }
    },
};

// Create the academic theme
const dotbridgeTheme = createTheme({
    palette: palette,
    typography: typography,
    shape: shape,
    shadows: shadows,
    spacing: 8,
    components: components,
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        },
    },
    transitions: {
        easing: {
            easeInOutCubic: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
        },
    },
});

export default dotbridgeTheme; 