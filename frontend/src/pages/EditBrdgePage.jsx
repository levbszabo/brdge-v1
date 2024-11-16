import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import AgentsPlayground from '../components/AgentsPlayground';

function EditBrdgePage() {
    const { id } = useParams();

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Brdge
                </Typography>
                <Box
                    sx={{
                        height: 'calc(100vh - 200px)',
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        overflow: 'hidden'
                    }}
                >
                    <AgentsPlayground brdgeId={id} />
                </Box>
            </Box>
        </Container>
    );
}

export default EditBrdgePage;