import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0041C2',  // Dark Blue
            light: '#00B4DB', // Bright Cyan
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#E7F6FB',  // Soft Light Blue
            contrastText: '#000000'
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff'
        }
    },
    typography: {
        // Default body font
        fontFamily: 'Satoshi, sans-serif',

        // Header styles
        h1: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase'
        },
        h2: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase'
        },
        h3: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 700
        },
        h4: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 700
        },
        h5: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 700
        },
        h6: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 600
        },
        body1: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 400
        },
        body2: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 300
        },
        button: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 500,
            textTransform: 'none'
        }
    }
});

export default theme;
