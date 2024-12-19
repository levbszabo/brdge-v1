import React from 'react';
import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';

function UsageIndicator({ title, current, limit, showExcess = false }) {
    const isUnlimited = limit === 'Unlimited';
    const currentValue = parseInt(current);
    const limitValue = isUnlimited ? Infinity : parseInt(limit);
    const isOverLimit = currentValue > limitValue;
    const percentage = isUnlimited ? 0 : Math.min((currentValue / limitValue) * 100, 100);

    const getProgressColor = () => {
        if (isOverLimit) return 'error.main';
        if (percentage > 90) return 'warning.main';
        return 'linear-gradient(90deg, #007AFF, #00B4DB)';
    };

    return (
        <Box sx={{
            background: 'rgba(2, 6, 23, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            minWidth: '200px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Tooltip title={isOverLimit ? "Exceeding limit" : ""} arrow>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isOverLimit ? 'error.main' : 'white',
                            fontWeight: isOverLimit ? 'bold' : 'normal'
                        }}
                    >
                        {current} / {isUnlimited ? '∞' : limit}
                    </Typography>
                </Tooltip>
                <Typography
                    variant="body2"
                    sx={{
                        color: isOverLimit ? 'error.main' : 'rgba(255, 255, 255, 0.5)'
                    }}
                >
                    {isUnlimited ? 'Unlimited' : `${Math.round(percentage)}%`}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiLinearProgress-bar': {
                        background: getProgressColor()
                    }
                }}
            />
        </Box>
    );
}

export default UsageIndicator; 