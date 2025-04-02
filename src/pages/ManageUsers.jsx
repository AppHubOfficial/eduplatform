import React, { useState, useEffect } from 'react';
import { Button, Box, Alert, CircularProgress, Grid, Typography, Slider, FormControl, MenuItem, InputLabel, Select, TextField, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';

import SearchComponent from '../components/SearchComponent';
import TableDataComponent from '../components/TableDataComponent';
import DrawerMenu from '../components/DrawerMenu';
import DashboardLayout from '../components/DashboardLayout';

import fetchData from '../scripts/fetchData';


import '../assets/styles/Profilo.css';

const apiUrl = process.env.REACT_APP_API_URL;

function ManageUsers() {

    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState("");
    const [open, setOpen] = useState(false);
    const [textSearchInput, setTextSearchInput] = useState("");
    const [valueDistance, setValueDistance] = useState([0, 100]);
    const [usersData, setUsersData] = useState(null);
    const [tempUsersData, setTempUsersData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageErrorLoading, setMessageErrorLoading] = useState("");
    const [errorTimeout, setErrorTimeout] = useState(false);
    const TIMEOUT = 6000;

    const columnsTable = [
        { field: 'nome', headerName: 'Nome', width: 130 },
        { field: 'cognome', headerName: 'Cognome', width: 130 },
        { field: 'email', headerName: 'Email', width: 230 },
        { field: 'tel', headerName: 'Telefono', width: 130 },
        { field: 'role', headerName: 'Ruolo', width: 130 },
        { field: 'university', headerName: 'Università', width: 130 },
        { field: 'distance', headerName: 'Distanza', width: 130 },
        { field: 'activities', headerName: 'Attività', width: 130 },
        { field: 'work', headerName: 'Luogo di lavoro', width: 150 },
        { field: 'faculty', headerName: 'Facoltà', width: 130 },
        { field: 'ripetizioni', headerName: 'Ripetizioni', width: 130 },
        { field: 'note', headerName: 'Note', width: 150 },
        {
            field: 'created_at',
            headerName: 'Creato il giorno',
            width: 160,
            valueGetter: (value) => {
                if (!value) {
                    return value;
                }
                return formatDate(value);
            },
        },
    ];

    function formatDate(dateString) {
        const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
        const match = dateString.match(regex);

        if (!match) return null;

        const [, year, month, day, hour, minute] = match;
        return `${day}/${month}/${year}, ${hour}:${minute}`;
    };



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
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (!profileData || profileData[0]?.role !== "insegnante") return;

        const fetchAllData = async () => {
            try {
                setLoading(true);
                const data = await fetchData('getUsersData');
                if (!data) {
                    navigate('/');
                } else {
                    data.forEach((el) => {
                        el.ripetizioni = el.ripetizioni ? "Si" : "No"
                    })
                    setUsersData(data);
                    setTempUsersData(data);
                }
            } catch (err) {
                setLoading(false);
                setError('Errore nel caricamento dei dati degli utenti.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [profileData])

    const handleChangeRoles = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleChangeDistance = (newValue) => {
        setValueDistance(newValue);
    };

    const handleSearchInput = (event) => {
        setTextSearchInput(event.target.value);
    }

    useEffect(() => {
        let filteredUsersData = tempUsersData || [];

        if (textSearchInput.trim().toLowerCase() !== "") {
            filteredUsersData = filteredUsersData.filter(user => {
                return (
                    user.nome.toLowerCase().includes(textSearchInput) ||
                    user.email.toLowerCase().includes(textSearchInput) ||
                    user.tel.toLowerCase().includes(textSearchInput)
                );
            });
        }

        if (selectedRole && selectedRole !== "all") {
            filteredUsersData = filteredUsersData.filter(user => {
                return user.role.includes(selectedRole);
            });
        }

        if (valueDistance) {
            filteredUsersData = filteredUsersData.filter(user => {
                return user.distance >= valueDistance[0] && user.distance <= valueDistance[1];
            });
        }

        setUsersData(filteredUsersData);

    }, [selectedRole, textSearchInput, valueDistance, tempUsersData]);

    usersData?.forEach((el) => {
        if (typeof el.activities === 'string') {
            try {
                el.activities = JSON.parse(el.activities);
            } catch (error) {
                //console.error("Errore nel parsing di activities:", error);
            }
        }

        if (Array.isArray(el.activities)) {
            el.activities = el.activities.join(', ');
        }

    });

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
                {profileData && profileData[0].role === "insegnante" && (
                    <Box>
                        <SearchComponent>

                            <>

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

                                <Grid container spacing={3} style={{ marginLeft: '0px' }}>

                                    <Grid item xs={12} sm={6} style={{ maxWidth: '230px' }}>
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
                            </>



                        </SearchComponent>

                        <TableDataComponent tableData={usersData} columns={columnsTable} rowIdField="email" />
                    </Box>
                )}
            </DashboardLayout>


        </Box>
    );
}

export default ManageUsers;
