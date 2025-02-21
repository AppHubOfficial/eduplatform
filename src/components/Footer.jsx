import React from "react";
import { Box, Typography } from '@mui/material';


function Footer() {
    return (
        <Box sx={{
            backgroundColor: '#333',
            color: '#fff',
            textAlign: 'center',
            padding: '20px',
        }}>
            <Typography variant="body2">© 2025 EduPlatform - Tutti i diritti riservati</Typography>
            <Typography variant="body2">IIS Andriano - Castelnuovo Don Bosco</Typography>
        </Box>
    )
}

export default Footer;