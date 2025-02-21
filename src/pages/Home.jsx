import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Modal, Card, CardContent } from '@mui/material';
import LoginComponent from '../components/LoginComponent';
import background from '../assets/images/programmers.jpg';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import HomeEvents from '../components/HomeEvents';
import Footer from '../components/Footer'

function Home() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState('');

  const handleOpenLogin = (type) => {
    setLoginType(type);
    setLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setLoginOpen(false);
    setLoginType('');
  };

  return (
    <>
      <Box
        sx={{
          height: '65vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
        }}
      >
        <Header handleCloseLogin={handleCloseLogin} handleOpenLogin={handleOpenLogin} />
        <HeroSection />
      </Box>

      <HomeEvents />

      <Footer />

      <Modal
        open={isLoginOpen}
        onClose={handleCloseLogin}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoginComponent type={loginType} setLoginOpen={setLoginOpen} setLoginType={setLoginType} />
      </Modal>
    </>
  );
}

export default Home;