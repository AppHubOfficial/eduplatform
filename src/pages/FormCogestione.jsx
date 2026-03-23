import { useState, useEffect } from "react";
import {
    TextField,
    MenuItem,
    FormControlLabel,
    Button,
    FormControl,
    InputLabel,
    Select,
    Typography,
    Modal,
    CircularProgress,
    Popover,
    IconButton,
    FormLabel,
    Radio,
    RadioGroup,
    Box,
    Paper,
    Stack,
    Tooltip,
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import backgroundCogestione from '../assets/images/sport.jpg';

import { selectFields } from "../assets/corsi_cogestione";

import fetchData from '../scripts/fetchData';

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

    const [disableOraDAria, setDisableOraDAria] = useState(false);
    const [disableStudio, setDisableStudio] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState("");
    const [openSelect, setOpenSelect] = useState(false);
    const openPopover = Boolean(anchorEl);
    const popoverId = openPopover ? 'simple-popover' : undefined;

    const classi = [
        "1AEM", "1AI", "1AM", "1AS", "1AT", "1BI",
        "2AET", "2AI", "2AM", "2AS", "2BI",
        "3AET", "3AI", "3AM", "3AS",
        "4AE", "4AI", "4AM", "4AS", "4BI",
        "5AEM", "5AI", "5AS"
    ];

    const [formData, setFormData] = useState({
        classe: "",
        nome: "",
        cognome: "",
        m1: "",
        m2: "",
        m3: "",
        g1: "",
        g2: "",
        g3: "",
        mangioScuola: "",
        cucinaEtnica: "",
    });

    const [disabledFields, setDisabledFields] = useState({
        m1Disabled: false,
        m2Disabled: false,
        m3Disabled: false,
        g1Disabled: false,
        g2Disabled: false,
        g3Disabled: false,
    });





    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //       CORSI SPOSTATI IN src > assets > corsi_cogestione.js
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////







    ///////////////// FORM FIELDS /////////////////
    const formFields = [
        { label: 'Nome', name: 'nome', type: 'input', required: true },
        { label: 'Cognome', name: 'cognome', type: 'input', required: true },
        { label: 'Classe *', name: 'classe', type: 'selectClasse', required: true },

        { label: 'Giovedì 9:', type: 'label' },
        { label: 'Modulo 1 | 8:10 - 9:52', name: 'm1', ora: 'm1', type: 'selectAttivita', required: true },
        { label: 'Modulo 2 | 10:02 - 11:40', name: 'm2', ora: 'm2', type: 'selectAttivita', required: true },
        { label: 'Modulo 3 | 11:50 - 13:34', name: 'm3', ora: 'm3', type: 'selectAttivita', required: true },

        { label: 'Venerdì 10:', type: 'label' },
        { label: 'Modulo 1 | 8:10 - 9:52', name: 'g1', ora: 'g1', type: 'selectAttivita', required: true },
        { label: 'Modulo 2 | 10:02 - 11:40', name: 'g2', ora: 'g2', type: 'selectAttivita', required: true },
        { label: 'Modulo 3 | 11:50 - 13:34', name: 'g3', ora: 'g3', type: 'selectAttivita', required: true },

        //{ label: `${["3", "4", "5"].includes(formData.classe.charAt(0)) ? "Giovedì" : "Venerdì"} pomeriggio`, type: 'label' },
        { label: 'Giovedì mangio a scuola (2€):', name: 'mangioScuola', type: 'radio', required: true },
        { label: 'Cucina etnica Venerdì 10:02-11:40 (1€ ad assaggio):', name: 'cucinaEtnica', type: 'radio', required: true },
    ];

    //////////////////////////////////////////

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePopoverOpen = (event, content) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopoverContent("");
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        //console.log("Evento per", name, "->", { type, value });

        if (type === "radio") {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "true" ? true : value === "false" ? false : value,
            }));
            return;
        }

        if (value === "Calcio (tutta la mattina)") {
            if (["m1", "m2", "m3"].includes(name)) {
                setFormData((prev) => ({
                    ...prev,
                    m1: "Calcio (tutta la mattina)",
                    m2: "Calcio (tutta la mattina)",
                    m3: "Calcio (tutta la mattina)",
                }));
                setDisabledFields((prev) => ({
                    ...prev,
                    m2Disabled: true,
                    m3Disabled: true
                }))
                return;
            } else if (["g1", "g2", "g3"].includes(name)) {
                setFormData((prev) => ({
                    ...prev,
                    g1: "Calcio (tutta la mattina)",
                    g2: "Calcio (tutta la mattina)",
                    g3: "Calcio (tutta la mattina)",
                }));
                setDisabledFields((prev) => ({
                    ...prev,
                    g2Disabled: true,
                    g3Disabled: true
                }))
                return;
            }
        } else {

            if ((disabledFields.m2Disabled == true) && name.startsWith("m")) {
                setDisabledFields((prev) => ({
                    ...prev,
                    m2Disabled: false,
                    m3Disabled: false,
                }))
                setFormData((prev) => ({
                    ...prev,
                    m2: "",
                    m3: "",
                }))
            }


            if (disabledFields.g2Disabled == true && name.startsWith("g")) {
                setDisabledFields((prev) => ({
                    ...prev,
                    g2Disabled: false,
                    g3Disabled: false,
                }))
                setFormData((prev) => ({
                    ...prev,
                    g2: "",
                    g3: "",
                }))
            }

        }


        if (value === "Assente (tutta la mattina)") {
            if (["m1", "m2", "m3"].includes(name)) {
                setFormData((prev) => ({
                    ...prev,
                    m1: "Assente (tutta la mattina)",
                    m2: "Assente (tutta la mattina)",
                    m3: "Assente (tutta la mattina)",
                }));
                setDisabledFields((prev) => ({
                    ...prev,
                    m2Disabled: true,
                    m3Disabled: true
                }))
                return;
            } else if (["g1", "g2", "g3"].includes(name)) {
                setFormData((prev) => ({
                    ...prev,
                    g1: "Assente (tutta la mattina)",
                    g2: "Assente (tutta la mattina)",
                    g3: "Assente (tutta la mattina)",
                }));
                setDisabledFields((prev) => ({
                    ...prev,
                    g2Disabled: true,
                    g3Disabled: true
                }))
                return;
            }
        } else {

            if ((disabledFields.m2Disabled == true) && name.startsWith("m")) {
                setDisabledFields((prev) => ({
                    ...prev,
                    m2Disabled: false,
                    m3Disabled: false,
                }))
                setFormData((prev) => ({
                    ...prev,
                    m2: "",
                    m3: "",
                }))
            }


            if (disabledFields.g2Disabled == true && name.startsWith("g")) {
                setDisabledFields((prev) => ({
                    ...prev,
                    g2Disabled: false,
                    g3Disabled: false,
                }))
                setFormData((prev) => ({
                    ...prev,
                    g2: "",
                    g3: "",
                }))
            }

        }

        if (value === "Lavori Socialmente Utili (Tutti i giorni)") {
            if (["m1", "m2", "m3", "g1", "g2", "g3"].includes(name)) {
                console.log("Attivata selezione Lavori Socialmente Utili per", name);
                setFormData((prev) => ({
                    ...prev,
                    m1: "Lavori Socialmente Utili (Tutti i giorni)",
                    m2: "Lavori Socialmente Utili (Tutti i giorni)",
                    m3: "Lavori Socialmente Utili (Tutti i giorni)",
                    g1: "Lavori Socialmente Utili (Tutti i giorni)",
                    g2: "Lavori Socialmente Utili (Tutti i giorni)",
                    g3: "Lavori Socialmente Utili (Tutti i giorni)",
                }));
                setDisabledFields((prev) => ({
                    ...prev,
                    m2Disabled: true,
                    m3Disabled: true,
                    g1Disabled: true,
                    g2Disabled: true,
                    g3Disabled: true,
                }))
                return;
            }
        } else {

            if ((disabledFields.m2Disabled == true) && (name.startsWith("m") || name.startsWith("g"))) {
                setDisabledFields((prev) => ({
                    ...prev,
                    m2Disabled: false,
                    m3Disabled: false,
                    g1Disabled: false,
                    g2Disabled: false,
                    g3Disabled: false,

                }))
                setFormData((prev) => ({
                    ...prev,
                    m2: "",
                    m3: "",
                    g1: "",
                    g2: "",
                    g3: "",
                }))
            }

        }



        const parsedValue = value === "true" ? true : value === "false" ? false : value;

        setFormData((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));

    };

    useEffect(() => {
        setDisableOraDAria(Object.values(formData).includes("Ora d'aria"));
        setDisableStudio(Object.values(formData).includes("Aula di Studio"));
    }, [formData]);



    //////////// handleSubmit ////////////
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Dati inviati:", formData);
        setErrorMessage("");
        setOpen(true);
        setIsLoading(true);

        try {
            const cogestioneExData = await fetchData('getDataCogestione');
            if (!cogestioneExData) {
                setErrorMessage("Impossibile ottenere i dati utente.");
                return;
            }

            const exists = cogestioneExData.some(
                (el) => el.nome === formData.nome && el.cognome === formData.cognome
            );
            if (exists) {
                setErrorMessage("Utente già registrato con questi dati.");
                return;
            }

            if (formData.mangioScuola === "" || formData.mangioScuola === undefined) {
                setErrorMessage('Campo Mangio scuola non compilato');
                return;
            }

            const moduli = ['m1', 'm2', 'm3', 'g1', 'g2', 'g3'];

            const countStudio = moduli.reduce((acc, key) => {
                if (formData[key] === 'Aula di Studio') acc += 1;
                return acc;
            }, 0);

            if (!formData.classe.startsWith("5") && countStudio > 1) {
                setErrorMessage('Non puoi selezionare Aula studio più di una volta');
                return;
            }

            const response = await fetch(`${apiUrl}/api/users/saveDataCogestione`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage("");
            } else {
                console.log(data.error);
                setErrorMessage(data.error || 'Problema di rete');
            }
        } catch (error) {
            console.error('Errore di rete:', error);
            setErrorMessage("Errore di rete");
        } finally {
            setIsLoading(false);
        }
    };
    ////////////////////////////////////



    return (
        <>
            {/* Sfondo Superiore */}
            <Box
                sx={{
                    width: '100%',
                    height: { xs: '35vh', md: '45vh' },
                    backgroundImage: `url(${backgroundCogestione})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            />

            {/* Modal di Conferma/Errore */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
            >
                <Box
                    sx={{
                        ...styleModal,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        p: 4,
                        outline: 'none'
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={40} />
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: errorMessage ? "error.main" : "success.main" }}>
                            {errorMessage ? <CloseIcon fontSize="large" /> : <CheckIcon fontSize="large" />}
                            <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="medium">
                                {errorMessage || "Il form è stato inviato con successo!"}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* Contenitore Principale del Form */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    minHeight: '100vh',
                    pt: { xs: '5vh', md: '5vh' }, // Spinge la card in basso sovrapponendosi allo sfondo
                    pb: 10,
                    px: 2,
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        width: '100%',
                        maxWidth: 450,
                        p: { xs: 4, md: 5 },
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                    }}
                >
                    <Typography variant="h5" align="center" color="black" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
                        Prenotazione COGESTIONE
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Stack gestisce automaticamente la spaziatura verticale tra i campi */}
                        <Stack spacing={3}>
                            {formFields.map((field, index) => {
                                switch (field.type) {
                                    case 'selectClasse':
                                        return (
                                            <FormControl fullWidth key={`field.name_${index}`}>
                                                <InputLabel>{field.label}</InputLabel>
                                                <Select
                                                    value={formData.classe || ""}
                                                    name="classe"
                                                    onChange={handleChange}
                                                    label="Classe"
                                                    required
                                                >
                                                    {classi.map((classeVal, idx) => (
                                                        <MenuItem key={idx} value={classeVal}>
                                                            {classeVal}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        );

                                    case 'selectAttivita':
                                        return (
                                            <FormControl fullWidth key={`formcontrol-${index}`}>
                                                <InputLabel id={`act-${index}`}>{field.label}</InputLabel>
                                                <Select
                                                    labelId={`act-${index}`}
                                                    name={field.name}
                                                    id={`act-${index}`}
                                                    label={field.label}
                                                    value={formData[field.name] || ""}
                                                    onChange={handleChange}
                                                    onOpen={() => setOpenSelect(true)}
                                                    onClose={() => setOpenSelect(false)}
                                                    disabled={disabledFields[field.name + "Disabled"]}
                                                    required
                                                >
                                                    {selectFields
                                                        .filter((sel) => sel.ora.includes(field.ora))
                                                        .map((selectField) => (
                                                            <MenuItem
                                                                key={`${field.name}_${selectField.label}`}
                                                                value={selectField.label}
                                                            >
                                                                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                                    <Typography>{selectField.label}</Typography>
                                                                    {openSelect && selectField.descr && (
                                                                        <IconButton
                                                                            size="small"
                                                                            color="info"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handlePopoverOpen(e, selectField.descr);
                                                                            }}
                                                                        >
                                                                            {/* InfoIcon è molto più intuitiva di ArrowDropDown per una descrizione */}
                                                                            <InfoOutlinedIcon fontSize="small" />
                                                                        </IconButton>
                                                                    )}
                                                                </Box>
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormControl>
                                        );

                                    case 'label':
                                        return (
                                            <Typography key={`label-${index}`} variant="subtitle1" fontWeight="medium" sx={{ mt: 1 }}>
                                                {field.label}
                                            </Typography>
                                        );

                                    case 'radio':
                                        return (
                                            <FormControl fullWidth key={`formcontrol-${index}`}>
                                                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                                                    <Typography variant="body1" sx={{ mr: 2, mb: { xs: 1, sm: 0 }, flex: 1 }}>
                                                        {field.label}
                                                    </Typography>
                                                    <RadioGroup
                                                        row
                                                        name={field.name}
                                                        value={formData[field.name] ?? ""}
                                                        onChange={handleChange}
                                                        sx={{ flexWrap: 'nowrap' }}
                                                        required
                                                    >
                                                        <FormControlLabel value="true" control={<Radio />} label="Sì" />
                                                        <FormControlLabel value="false" control={<Radio />} label="No" />
                                                    </RadioGroup>
                                                </Box>
                                            </FormControl>
                                        );

                                    default:
                                        return (
                                            <TextField
                                                key={`input-${index}`}
                                                value={formData[field.name] || ""}
                                                onChange={handleChange}
                                                label={field.label}
                                                name={field.name}
                                                variant="outlined"
                                                fullWidth
                                                required
                                            />
                                        );
                                }
                            })}
                        </Stack>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                size="large"
                                disabled={isLoading}
                                sx={{ px: 5, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                            >
                                Invia Prenotazione
                            </Button>
                        </Box>
                    </Box>

                    {/* Popover Informativo */}
                    <Popover
                        id={popoverId}
                        open={openPopover}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        PaperProps={{
                            sx: { p: 2, maxWidth: 300, borderRadius: 2, boxShadow: 3 }
                        }}
                    >
                        <Typography variant="body2">{popoverContent}</Typography>
                    </Popover>
                </Paper>
            </Box>
        </>
    );
}
