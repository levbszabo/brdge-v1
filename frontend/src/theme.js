import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3', // Light blue
            light: '#64b5f6',
            dark: '#1976d2',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#0d47a1', // Darker blue for contrast
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
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
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
});

export default theme;
