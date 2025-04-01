import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, TextField, Slider, FormControl, MenuItem, InputLabel, Select, InputAdornment, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';

function SearchComponent({ handleChangeRoles, handleSearchInput, handleChangeDistance, valueDistance, children }) {
    const [value, setValue] = useState([0, 100]);

    return (
        <>
            <Box className="searchContainer" sx={{ padding: 3, backgroundColor: "white", borderRadius: "6px", marginBottom: "5px" }}>
                <Typography style={{ marginBottom: '50px' }} variant="h5" component="h1" gutterBottom>
                    Ricerca
                </Typography>

                {children}

            </Box>
        </>
    );
}

export default SearchComponent;
