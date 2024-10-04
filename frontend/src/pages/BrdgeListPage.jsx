// src/pages/BrdgeListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    TextField,
    InputAdornment,
    Button,        // {{ edit_1 }} Import Button
    Box,           // {{ edit_1 }} Import Box for layout
    Typography,   // {{ edit_1 }} Import Typography for label
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { BACKEND_URL } from '../config';

function BrdgeListPage() {
    const [brdges, setBrdges] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Add search term state
    const navigate = useNavigate();

    useEffect(() => {
        const getBrdges = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/brdges`);
                const brdges = await response.json();
                setBrdges(brdges);
            } catch (error) {
                console.error('Error fetching brdges:', error);
            }
        };
        getBrdges();
    }, []);

    const filteredBrdges = brdges.filter((brdge) =>
        brdge.name.toLowerCase().includes(searchTerm.toLowerCase())
    ); // Filter brdges based on search term

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                {/* Header with "Brdges" Title and "Create New Brdge" Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Brdges
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/create')}
                        sx={{
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        Create New Brdge
                    </Button>
                </Box>

                {/* Search Bar */}
                <TextField
                    variant="outlined"
                    placeholder="Search Brdges"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                {filteredBrdges.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" align="center">
                        No brdges found. Click the "Create New Brdge" button above to get started.
                    </Typography>
                ) : (
                    <List>
                        {filteredBrdges.map((brdge) => (
                            <React.Fragment key={brdge.id}>
                                <ListItem
                                    component="div"
                                    onClick={() => navigate(`/viewBrdge/${brdge.id}`)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                            cursor: 'pointer',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={brdge.name}
                                        secondary={
                                            <>
                                                Presentation: {brdge.presentation_filename} <br />
                                                Audio: {brdge.audio_filename || 'N/A'}
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => navigate(`/edit/${brdge.id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="view"
                                            onClick={() => navigate(`/viewBrdge/${brdge.id}`)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </main>

            {/* Removed the Floating Action Button (FAB) */}
        </div>
    );
}

export default BrdgeListPage;