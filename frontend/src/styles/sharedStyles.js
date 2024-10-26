import { styled } from '@mui/material/styles';
import { Typography, Button, Paper } from '@mui/material';

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
    borderRadius: '12px',
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
