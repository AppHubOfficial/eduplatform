import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, TextField, Slider, FormControl, MenuItem, InputLabel, Select, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';

function SearchComponent({ handleChangeRoles, handleSearchInput, handleChangeDistance, valueDistance }) {
    const [value, setValue] = useState([0, 100]);

    return (
        <>
            <Box className="searchContainer" sx={{ padding: 3 }}>
                <Typography style={{ marginBottom: '50px' }} variant="h5" component="h1" gutterBottom>
                    Ricerca
                </Typography>
                <TextField
                    style={{ maxWidth: '450px', marginBottom: '50px' }}
                    fullWidth
                    label="Cerca"
                    variant="outlined"
                    onChange={handleSearchInput}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Grid container spacing={6} style={{ marginLeft: '20px' }}>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Cerca per distanza</Typography>
                        <Slider
                            value={valueDistance}
                            onChange={(e, newValue) => handleChangeDistance(newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                            disableSwap
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Ruolo</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                onChange={handleChangeRoles}
                                label="Ruolo"
                            >
                                <MenuItem value="all">Tutti</MenuItem>
                                <MenuItem value="insegnante">Insegnante</MenuItem>
                                <MenuItem value="studente">Studente</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default SearchComponent;
