import { styled } from '@mui/material/styles';
import { Typography, Button, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';

export const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
    textAlign: 'center',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    color: theme.palette.text.primary,
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

export const PrimaryButton = styled(Button)(({ theme }) => ({
    borderRadius: '50px',
    padding: '0.75rem 2rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

export const StandardPageHeader = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(6),
    [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(8),
    },
}));

export const StandardPageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
}));

export const StandardPageSubtitle = styled(Typography)(({ theme }) => ({
    maxWidth: '750px',
    margin: '0 auto',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1.5),
}));

// New animated page header components that match Pricing/Contact pages style
export const MotionPageHeader = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
    >
        {children}
    </motion.div>
);

export const AnimatedPageTitle = ({ children, ...props }) => (
    <Typography
        variant="h2"
        component="h1"
        sx={{
            mb: 2,
            color: 'text.primary',
            fontWeight: 500,
            fontSize: { xs: '2rem', sm: '2.3rem', md: '2.6rem' },
            fontFamily: '"Canela Text", "Tiempos Headline", Georgia, serif'
        }}
        {...props}
    >
        {children}
    </Typography>
);

export const AnimatedPageSubtitle = ({ children, ...props }) => (
    <Typography
        variant="h5"
        sx={{
            color: 'text.secondary',
            maxWidth: '750px',
            mx: 'auto',
            mb: { xs: 4, md: 6 },
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
            lineHeight: 1.6
        }}
        {...props}
    >
        {children}
    </Typography>
);
