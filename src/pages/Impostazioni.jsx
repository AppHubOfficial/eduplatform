import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Impostazioni() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '93vh',
        gap: 3,
        padding: '20px',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Impostazioni...
      </Typography>
    </Box>
  );
}

export default Impostazioni;
