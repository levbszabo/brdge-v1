import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AgentConnector from '../components/AgentConnector';
import { api } from '../api';

function EditBrdgePage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await api.get(`/brdge/${id}/check-auth`);
                setIsAuthorized(true);
            } catch (error) {
                console.error('Authorization check failed:', error);
                navigate('/');
            }
        };

        checkAuthorization();
    }, [id, navigate]);

    // Only render the main content if authorized
    if (!isAuthorized) {
        return null; // Or a loading spinner
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            background: 'linear-gradient(135deg, #000B1F 0%, #001E3C 50%, #0041C2 100%)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '5%',
                left: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(79, 156, 249, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 20s infinite alternate',
                zIndex: 0
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '5%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(0, 180, 219, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 25s infinite alternate-reverse',
                zIndex: 0
            }
        }}>
            <Box sx={{
                height: '64px',
                flexShrink: 0
            }} />

            <Box sx={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
            }}>
                <AgentConnector brdgeId={id} agentType="edit" />
            </Box>
        </Box>
    );
}

export default EditBrdgePage;