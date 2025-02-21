import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography, Modal, Card, CardContent } from '@mui/material';

import StrumentiSportivi from '../assets/images/strumenti-sportivi.jpg';

function HomeEvents() {

    const navigate = useNavigate();

    const events = [
        { title: "Cogestione", description: "Descrizione", date: "25/04/2025", image: StrumentiSportivi, goto: "cogestione" },
    ];

    return (
        <Box
            sx={{
                position: 'relative',
                top: '-220px',
                backgroundColor: '#e8e8e8',
                padding: '40px',
                borderRadius: '10px',
                width: '80%',
                margin: '0 auto',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                textAlign: 'center',
                height: '45vh',
                maxWidth: '900px'
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                Prossimi Eventi
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>

                {events.map((event, index) => (
                    <Card
                        sx={{
                            transition: "0.3s",
                            boxShadow: 3,
                            "&:hover": {
                                boxShadow: 10,
                                transform: "scale(1.03)"
                            },
                            maxWidth: 600,
                            minWidth: 300,
                            width: events.length === 1 ? '70%' : '40%',
                            height: '290px',
                            marginTop: '40px',
                            cursor: 'pointer'
                        }}
                        key={index}
                    >
                        <CardContent onClick={() => navigate(event.goto)}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {event.title}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {event.description}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">{event.date}</Typography>
                            <img src={event.image} style={{ marginLeft: "-17px", marginTop: "10px" }}></img>
                        </CardContent>
                    </Card>
                ))}

            </Box>
        </Box>
    )
}

export default HomeEvents;