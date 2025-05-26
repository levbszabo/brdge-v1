import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Enhanced TextField with premium styling
const StyledTextField = styled(MuiTextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius * 0.75,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.2s ease',
        fontSize: '0.9375rem',
        '& fieldset': {
            borderColor: theme.palette.grey[300],
            borderWidth: '1px',
            transition: 'all 0.2s ease',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.grey[400],
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
        },
        '&.Mui-focused': {
            boxShadow: `0 0 0 4px ${theme.palette.primary.main}15`,
        },
        '&.Mui-error fieldset': {
            borderColor: theme.palette.error.main,
            borderWidth: '1px',
        },
        '&.Mui-error.Mui-focused': {
            boxShadow: `0 0 0 4px ${theme.palette.error.main}15`,
        },
        '&.Mui-disabled': {
            backgroundColor: theme.palette.grey[50],
            '& fieldset': {
                borderColor: theme.palette.grey[200],
            },
        },
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
        fontWeight: 400,
        '&.Mui-focused': {
            color: theme.palette.primary.main,
            fontWeight: 500,
        },
        '&.Mui-error': {
            color: theme.palette.error.main,
        },
    },
    '& .MuiInputBase-input': {
        padding: '12px 14px',
        fontSize: '0.9375rem',
        lineHeight: 1.5,
        fontWeight: 400,
        '&::placeholder': {
            color: theme.palette.text.disabled,
            opacity: 1,
        },
    },
    '& .MuiFormHelperText-root': {
        marginTop: '4px',
        fontSize: '0.75rem',
        '&.Mui-error': {
            color: theme.palette.error.main,
        },
    },
}));

/**
 * TextField component with enhanced styling
 */
const TextField = React.forwardRef((props, ref) => {
    return (
        <StyledTextField
            ref={ref}
            variant="outlined"
            {...props}
        />
    );
});

TextField.displayName = 'TextField';

export default TextField; 