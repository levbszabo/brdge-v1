import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

function UsageIndicator({ stats }) {
    const limit = stats.brdges_limit;
    const used = stats.brdges_created;
    const percentage = limit === 'Unlimited' ? 0 : (used / limit) * 100;

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
                Bridge Usage
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    {used} / {limit === 'Unlimited' ? '∞' : limit}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {limit === 'Unlimited' ? 'Unlimited' : `${Math.round(percentage)}%`}
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
                        background: 'linear-gradient(90deg, #007AFF, #00B4DB)'
                    }
                }}
            />
        </Box>
    );
}

export default UsageIndicator; 