import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0A2647', // Premium navy color
            light: '#1E3A5F',
            dark: '#051C3B',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#3498db', // A brighter blue for accents
            light: '#5DADE2',
            dark: '#2874A6',
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
});

export default theme;
