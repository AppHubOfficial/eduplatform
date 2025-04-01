import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, CircularProgress, Alert } from '@mui/material';

import DashboardLayout from '../components/DashboardLayout';
import HomeEvents from '../components/HomeEvents';

import fetchData from '../scripts/fetchData';

function Dashboard() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchData('getProfileData');
                if (!data) {
                    navigate('/');
                } else {
                    setProfileData(data);
                }
            } catch (err) {
                setError('Errore nel caricamento dei dati utente.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    if (loading) {
        return (
            <DashboardLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <Alert
                    className='info'
                    severity="error">{error},
                </Alert>
            </DashboardLayout>
        );
    }



    return (
        <Box>
            <DashboardLayout>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Benvenuto, <span style={{ fontWeight: 'bold', color: 'rgb(25, 118, 210)' }}>{profileData?.[0]?.nome}</span>!
                </Typography>
                <Typography>
                    Sei autenticato come <span style={{ fontWeight: 'bold', color: 'rgb(25, 118, 210)' }}>{profileData?.[0]?.role}</span>
                </Typography>

                <Divider sx={{ mt: 3 }} />
                <Box sx={{ mt: 20 }}>
                    <HomeEvents />
                </Box>
            </DashboardLayout>
        </Box>
    );
}

export default Dashboard;
