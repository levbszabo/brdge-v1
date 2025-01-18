import { Box, Typography } from '@mui/material';

const UsageIndicator = ({ title, current, limit }) => {
    const isUnlimited = limit === 'Unlimited';
    const percentage = isUnlimited ? 0 : (current / limit) * 100;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1
        }}>
            <Typography
                variant="body2"
                sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    minWidth: '50px'
                }}
            >
                {title}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
            >
                {current}
                <Typography
                    component="span"
                    sx={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.875rem',
                        fontWeight: 400
                    }}
                >
                    / {limit}
                </Typography>
            </Typography>
        </Box>
    );
};

export default UsageIndicator; 