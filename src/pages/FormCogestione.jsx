import { useState } from "react";
import { TextField, MenuItem, FormControlLabel, Checkbox, Button, FormControl, InputLabel, Select, Typography, Box, Modal, CircularProgress } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import backgroundCogestione from '../assets/images/sport.jpg';

const classi = ["1", "2", "3", "4", "5"];
const attivitaMattina = ["Sport", "Laboratorio", "Musica", "Ora d'aria"];
const attivitaPomeriggio = ["Teatro", "Coding", "Pittura", "Ora d'aria"];

const apiUrl = process.env.REACT_APP_API_URL;

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -100%)',
    width: 240,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function PrenotazioneCogestione() {
    const [classe, setClasse] = useState("");
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [mangioScuola, setMangioScuola] = useState(false);
    const [attivita, setAttivita] = useState({ mattina: ["", "", ""], pomeriggio: "" });
    const [oraDAriaCount, setOraDAriaCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            nome,
            cognome,
            classe,
            attivitaMattina: attivita.mattina,
            attivitaPomeriggio: attivita.pomeriggio,
            mangioScuola,
        };

        console.log("Dati inviati:", formData);
        setErrorMessage("")
        setOpen(true);
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/api/users/save_data_cogestione`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("SUCCESS")
                setIsLoading(false);
            } else {
                console.log(data.error);
                setErrorMessage(data.error || 'Problema di rete');
            }
        } catch (error) {
            console.error('Errore di rete:', error);
            setErrorMessage("Errore di rete")
        } finally {
            setIsLoading(false);
        }
    };


    const handleAttivitaChange = (type, index, value) => {
        let newAttivita = { ...attivita };
        if (type === "mattina") {
            newAttivita.mattina[index] = value;
        } else {
            newAttivita.pomeriggio = value;
        }
        setAttivita(newAttivita);
        setOraDAriaCount([...newAttivita.mattina, newAttivita.pomeriggio].filter(a => a === "Ora d'aria").length);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundImage: `url(${backgroundCogestione})`,
                height: '45vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
            >
                <Box sx={{ ...styleModal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isLoading ? (
                        <CircularProgress
                            style={{
                                width: '30px',
                                height: '30px',
                            }}
                        />
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: errorMessage ? "#CC0000" : "#006200" }}>
                            {errorMessage ? <CloseIcon /> : <CheckIcon fontSize="large" />}
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                {errorMessage || "Il form è stato inviato"}
                            </Typography>
                        </Box>
                    )}
                </Box>

            </Modal>

            <Box
                sx={{
                    maxWidth: 400,
                    mx: "auto",
                    mt: 15,
                    mb: 15,
                    p: 3,
                    boxShadow: '0px 7px 14px rgba(0, 0, 0, 0.1)',
                    padding: '65px 30px 30px 30px',
                    backgroundColor: 'white',
                    marginBottom: '20px',
                    marginTop: "50px !important",
                    color: '#3e3e3e',
                }}
                component="form"
                onSubmit={handleSubmit}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        marginTop: '-30px',
                        marginBottom: '20px',
                    }}
                >
                    Prenotazione cogestione
                </Typography>

                <TextField fullWidth required label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} margin="normal" />
                <TextField fullWidth required label="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} margin="normal" />
                <FormControl fullWidth required margin="normal">
                    <InputLabel id="classe">Classe</InputLabel>
                    <Select
                        labelId="classe"
                        id="classe"
                        label="Classe"
                        value={classe}
                        onChange={(e) => setClasse(e.target.value)}>
                        {classi.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>

                <Typography variant="h6" sx={{ mt: 2 }}> Mattina </Typography>
                {[0, 1, 2].map(i => (
                    <FormControl fullWidth required margin="normal" key={i}>
                        <InputLabel id={`modulo-label-${i}`}>Modulo {i + 1}</InputLabel>
                        <Select
                            labelId={`modulo-label-${i}`}
                            id={`modulo-label-${i}`}
                            label={`Modulo ${i + 1}`}
                            value={attivita.mattina[i]}
                            onChange={(e) => handleAttivitaChange("mattina", i, e.target.value)}>
                            {attivitaMattina.map(a => <MenuItem key={a} value={a} disabled={a === "Ora d'aria" && oraDAriaCount >= 1}>{a}</MenuItem>)}
                        </Select>
                    </FormControl>
                ))}

                {(classe === "1" || classe === "2") && (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}> Mercoledì Pomeriggio </Typography>
                        <FormControl fullWidth required margin="normal">
                            <InputLabel id="mercolediPome">Modulo Pomeriggio</InputLabel>
                            <Select
                                labelId="mercolediPome"
                                id="mercolediPome"
                                label="Modulo Pomeriggio"
                                value={attivita.pomeriggio}
                                onChange={(e) => handleAttivitaChange("pomeriggio", 0, e.target.value)}>
                                {attivitaPomeriggio.map(a => <MenuItem key={a} value={a} disabled={a === "Ora d'aria" && oraDAriaCount >= 1}>{a}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControlLabel control={<Checkbox checked={mangioScuola} onChange={() => setMangioScuola(!mangioScuola)} />} label="Mangio a scuola (1€)" />
                    </>
                )}

                {(classe === "3" || classe === "4" || classe === "5") && (
                    <>
                        <Typography variant="h6" sx={{ mt: 2 }}> Giovedì Pomeriggio </Typography>
                        <FormControl fullWidth required margin="normal">
                            <InputLabel id="giovediPome">Modulo Pomeriggio</InputLabel>
                            <Select
                                labelId="giovediPome"
                                id="giovediPome"
                                label="Modulo Pomeriggio"
                                value={attivita.pomeriggio}
                                onChange={(e) => handleAttivitaChange("pomeriggio", 0, e.target.value)}>
                                {attivitaPomeriggio.map(a => <MenuItem key={a} value={a} disabled={a === "Ora d'aria" && oraDAriaCount >= 1}>{a}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControlLabel control={<Checkbox checked={mangioScuola} onChange={() => setMangioScuola(!mangioScuola)} />} label="Mangio a scuola (1€)" />
                    </>
                )}

                <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">Prenota</Button>



            </Box>

        </Box>
    )
}
