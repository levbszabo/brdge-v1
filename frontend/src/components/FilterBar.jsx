import React from 'react';
import { Paper, Grid, TextField, FormControl, Select, MenuItem, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const FilterBar = ({
    sortBy,
    filterBy,
    onSortChange,
    onFilterChange,
    onSearch,
    onCreateClick,
    canCreate
}) => {
    return (
        <Paper sx={{ p: 2, mb: 3, borderRadius: '16px' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search Brdges"
                        onChange={(e) => onSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                            sx: { borderRadius: '50px' }
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            value={sortBy}
                            onChange={onSortChange}
                            displayEmpty
                            sx={{ borderRadius: '50px' }}
                        >
                            <MenuItem value="">Sort By</MenuItem>
                            <MenuItem value="date">Date Created</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="status">Status</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={3}>
                    <FormControl fullWidth>
                        <Select
                            value={filterBy}
                            onChange={onFilterChange}
                            displayEmpty
                            sx={{ borderRadius: '50px' }}
                        >
                            <MenuItem value="">All Brdges</MenuItem>
                            <MenuItem value="public">Public Only</MenuItem>
                            <MenuItem value="private">Private Only</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={onCreateClick}
                        startIcon={<AddIcon />}
                        disabled={!canCreate}
                        sx={{
                            borderRadius: '50px',
                            background: canCreate ? 'linear-gradient(90deg, #0072ff, #00c6ff)' : undefined,
                            '&:hover': {
                                background: canCreate ? 'linear-gradient(90deg, #0058cc, #00a3cc)' : undefined,
                            }
                        }}
                    >
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default FilterBar; 