import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const PremiumBadge = ({ size = 'medium', showTooltip = true }) => {
    const sizeMap = {
        small: {
            iconSize: '0.9rem',
            padding: '3px 6px',
            fontSize: '0.6rem',
        },
        medium: {
            iconSize: '1.2rem',
            padding: '4px 8px',
            fontSize: '0.75rem',
        },
        large: {
            iconSize: '1.4rem',
            padding: '5px 10px',
            fontSize: '0.85rem',
        }
    };

    const styles = sizeMap[size] || sizeMap.medium;

    const badge = (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(156, 39, 176, 0.15)',
                border: '1px solid rgba(156, 39, 176, 0.3)',
                borderRadius: '4px',
                padding: styles.padding,
                color: '#9C27B0',
            }}
        >
            <WorkspacePremiumIcon
                sx={{
                    fontSize: styles.iconSize,
                    filter: 'drop-shadow(0 0 3px rgba(156, 39, 176, 0.6))'
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 'bold',
                    fontSize: styles.fontSize,
                }}
            >
                PREMIUM
            </Typography>
        </Box>
    );

    if (showTooltip) {
        return (
            <Tooltip title="This content requires premium access" arrow>
                {badge}
            </Tooltip>
        );
    }

    return badge;
};

export default PremiumBadge; 