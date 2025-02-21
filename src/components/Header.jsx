import React, { useState } from "react";
import { AppBar, Toolbar, Button, Box, Typography, Modal, Card, CardContent } from '@mui/material';


function Header({handleOpenLogin, handleCloseLogin}) {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#333333' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
              EduPlatform
            </Typography>

            <Box>
              <Button
                variant="outlined"
                onClick={() => handleOpenLogin('signin')}
                sx={{ marginRight: 2, borderColor: '#bbb', color: '#f4f4f4' }}
              >
                Registrati
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleOpenLogin('login')}
                sx={{ borderColor: '#bbb', color: '#f4f4f4' }}
              >
                Accedi
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
    )
}

export default Header;