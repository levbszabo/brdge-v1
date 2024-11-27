import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import AgentsPlayground from '../components/AgentsPlayground';

function EditBrdgePage() {
    const { id } = useParams();

    return (
        <Box sx={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden'  // Prevent any scrolling at container level
        }}>
            <AgentsPlayground brdgeId={id} agentType="edit" />
        </Box>
    );
}

export default EditBrdgePage;