import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import AgentsPlayground from '../components/AgentsPlayground';

function ViewBrdgePage() {
    const { id, publicId } = useParams();
    const brdgeId = id || publicId;

    if (!brdgeId) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">No Brdge ID provided</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#121212' // Match Playground's dark theme
        }}>
            <Box sx={{
                flexGrow: 1,
                position: 'relative',
                '& > *': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            }}>
                <AgentsPlayground brdgeId={brdgeId} />
            </Box>
        </Box>
    );
}

export default ViewBrdgePage;
