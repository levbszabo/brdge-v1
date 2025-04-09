import { cyan } from '@mui/material/colors';

// Define the colors as constants first
export const THEME_COLORS = {
    cyan: cyan[500], // Use MUI's cyan color directly
    green: "#22c55e",
    amber: "#f59e0b",
    blue: "#3b82f6",
    violet: "#7c3aed",
    rose: "#e11d48",
    pink: "#ec4899",
    teal: "#14b8a6"
};

// Default color
export const DEFAULT_COLOR = THEME_COLORS.cyan;
export const defaultColor = DEFAULT_COLOR;

export const getThemeColor = (colorName) => {
    return THEME_COLORS[colorName] || DEFAULT_COLOR;
};

// Create the MUI theme configuration
export const muiTheme = {
    palette: {
        primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#0d47a1',
            light: '#5472d3',
            dark: '#002171',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F9F9F9',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
        cyan: {
            main: cyan[500],
            light: cyan[300],
            dark: cyan[700],
            contrastText: '#fff',
        },
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
};

export default {
    colors: THEME_COLORS,
    defaultColor: DEFAULT_COLOR,
    getColor: getThemeColor,
    muiTheme
}; 