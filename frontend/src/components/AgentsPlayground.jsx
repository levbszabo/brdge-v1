import React from 'react';
import { Box } from '@mui/material';

function AgentsPlayground() {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                '& > iframe': {
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }
            }}
        >
            <iframe
                src="http://localhost:3001"
                title="Agents Playground"
                allow="camera; microphone; display-capture; fullscreen"
            />
        </Box>
    );
}

export default AgentsPlayground; 