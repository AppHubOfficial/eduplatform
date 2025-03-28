import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, Typography, Modal, Card, CardContent } from '@mui/material';


function HeroSection() {
    return (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backdropFilter: 'brightness(0.8)',
            padding: '20px',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, marginTop: '-160px' }}>
            Benvenuto su EduPlatform
          </Typography>
            {/*<Typography variant="h6">
            Il miglior portale per rimanere aggiornato sugli eventi e attività scolastiche
          </Typography>*/}
        </Box>
    )
}

export default HeroSection;
