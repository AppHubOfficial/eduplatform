import { useState, useEffect } from "react";
import {
    TextField,
    MenuItem,
    FormControlLabel,
    radio,
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
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import backgroundCogestione from '../assets/images/sport.jpg';

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
        "1AE", "1AI", "1AM", "1AS", "1BI", "1BMT",
        "2AET", "2AI", "2AM", "2AS",
        "3AET", "3AI", "3AM", "3AS", "3BI",
        "4AE", "4AI", "4AM", "4AS",
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
        pomeriggio: "",
        mangioScuola: "",
    });

    const [disabledFields, setDisabledFields] = useState({
        m1Disabled: false,
        m2Disabled: false,
        m3Disabled: false,
        g1Disabled: false,
        g2Disabled: false,
        g3Disabled: false,
        pomeriggioDisabled: false,
    });

    ///////////////// FORM FIELDS /////////////////

    const formFields = [
        { label: 'Nome', name: 'nome', type: 'input', required: true },
        { label: 'Cognome', name: 'cognome', type: 'input', required: true },
        { label: 'Classe *', name: 'classe', type: 'selectClasse', required: true },

        { label: 'Mercoledì mattina', type: 'label' },
        { label: 'Modulo 1 | 8:10 - 9:52', name: 'm1', ora: 'm1', type: 'selectAttivita', required: true },
        { label: 'Modulo 2 | 10:02 - 11:40', name: 'm2', ora: 'm2', type: 'selectAttivita', required: true },
        { label: 'Modulo 3 | 11:50 - 13:34', name: 'm3', ora: 'm3', type: 'selectAttivita', required: true },

        { label: 'Giovedì mattina', type: 'label' },
        { label: 'Modulo 1 | 8:10 - 9:52', name: 'g1', ora: 'g1', type: 'selectAttivita', required: true },
        { label: 'Modulo 2 | 10:02 - 11:40', name: 'g2', ora: 'g2', type: 'selectAttivita', required: true },
        { label: 'Modulo 3 | 11:50 - 13:34', name: 'g3', ora: 'g3', type: 'selectAttivita', required: true },

        { label: `${["3", "4", "5"].includes(formData.classe.charAt(0)) ? "Giovedì" : "Mercoledì"} pomeriggio`, type: 'label' },
        { label: 'Modulo Pomeriggio', name: 'pomeriggio', ora: 'pomeriggio', type: 'selectAttivita', required: true },

        { label: 'Mangio a scuola (1€):', name: 'mangioScuola', type: 'radio', required: true },
    ];


    const selectFields = [
        { name: "assente", label: "Assente (tutta la mattina)", descr: "Non sarò presente.", ora: ["m1", "m2", "m3", "g1", "g2", "g3"] },
        { name: "assente", label: "Assente", descr: "Non sarò presente.", ora: ["pomeriggio"] },
        { name: "calcio_tutta_la_mattina", label: "Calcio (tutta la mattina)", descr: "Partita di calcio all'aperto. Le squadre verranno formate in anticipo.", ora: ["m1", "m2", "m3", "g1", "g2", "g3"] },
        { name: "calcio_non_torneo", label: "Calcio (Non torneo)", descr: "Partita di calcio amatoriale senza torneo, squadre organizzate prima.", ora: ["pomeriggio"] },
        { name: "basket", label: "Basket", descr: "Partita di basket all'aperto con squadre organizzate prima dell'evento.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "pallavolo", label: "Pallavolo", descr: "Gioco di pallavolo all'aperto con squadre predefinite.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "ping_pong", label: "Ping Pong", descr: "Torneo di ping pong in aula attrezzata.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "cucina", label: "Cucina", descr: "Affiancamento al professor Casalegno nella preparazione della pasta per gli studenti.", ora: ["g3", "pomeriggio"] },
        { name: "cucina_etnica", label: "Cucina Etnica (1€ ad assaggio)", descr: "Fiera gastronomica con piatti da tutto il mondo preparati da famiglie e docenti.", ora: ["g2"] },
        { name: "make_up", label: "Make-up", descr: "Sessione di confronto sulle tecniche di trucco tra studenti e studentesse.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "croce_rossa", label: "Croce Rossa", descr: "Due corsi della Croce Rossa: malattie sessualmente trasmissibili e rischi della guida irresponsabile.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "forze_dell_ordine", label: "Forze dell'Ordine", descr: "Incontro informativo sulle carriere nelle forze dell'ordine.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "protezione_civile", label: "Protezione Civile", descr: "Dimostrazioni della Protezione Civile sui rischi della zona.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "programmazione", label: "Programmazione", descr: "Lezione su linguaggi di programmazione extra rispetto al programma ministeriale.", ora: ["g1", "g2", "g3", "pomeriggio"] },
        { name: "cinema", label: "Cinema", descr: "Visione di un'opera di cinema con successiva riflessione critica.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "anime", label: "Anime", descr: "Visione di un anime con successiva riflessione critica.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "ballo", label: "Ballo", descr: "Lezioni di ballo moderno all'aperto con vari generi musicali.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "ludoteca", label: "Ludoteca", descr: "Sessione di gioco da tavolo con esperti della ludoteca di Castelnuovo Don Bosco.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "aula_di_studio", label: "Aula di Studio", descr: "Spazio dedicato allo studio o al riposo, disponibile solo per due moduli.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "pittura", label: "Pittura", descr: "Ritinteggiatura dell'aula LCF il 23/04/2025 e dell'aula 7 il 24/04/2025.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
        { name: "ora_d_aria", label: "Ora d'aria", descr: "Momento di relax all'aperto.", ora: ["m1", "m2", "m3", "g1", "g2", "g3", "pomeriggio"] },
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


        // const cogestioneExData = await fetchData('getDataCogestione');
        // if (!cogestioneExData) {
        //     setErrorMessage("Impossibile ottenere i dati utente.");
        //     setIsLoading(false);
        //     return;
        // }

        if (formData['mangioScuola'] === "" || formData['mangioScuola'] === undefined) {
            setIsLoading(false);
            setErrorMessage('Campo Mangio scuola non compilato');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/users/saveDataCogestione`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
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

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage: `url(${backgroundCogestione})`,
                    height: '45vh',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
            >
                <Box sx={{ ...styleModal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isLoading ? (
                        <CircularProgress style={{ width: '30px', height: '30px' }} />
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
                    width: '80%',
                    maxWidth: 400,
                    mx: 'auto',
                    mt: { xs: '-43vh', sm: '-40vh' },
                    mb: 10,
                    p: 3,
                    boxShadow: '0px 7px 14px rgba(0, 0, 0, 0.1)',
                    padding: '65px 30px 30px 30px',
                    backgroundColor: 'white',
                    color: '#3e3e3e',
                    borderRadius: '8px'
                }}
            >
                <Typography variant="h5" align="center" sx={{ fontWeight: "bold", marginTop: "-20px", marginBottom: "30px" }}>
                    Prenotazione COGESTIONE
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    {formFields
                        .map((field, index) => {

                            switch (field.type) {
                                case 'selectClasse':
                                    return (
                                        <FormControl fullWidth margin="normal" key={`field.name_${index}`}>
                                            <InputLabel>{field.label}</InputLabel>
                                            <Select
                                                value={formData.classe}
                                                name="classe"
                                                onChange={handleChange}
                                                label="Classe"
                                                required
                                            >
                                                {classi.map((classeVal, index) => (
                                                    <MenuItem key={index} value={classeVal}>
                                                        {classeVal}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    );

                                case 'selectAttivita':
                                    return (
                                        <FormControl fullWidth margin="normal" key={`formcontrol-${index}`}>

                                            <InputLabel id={`act-${index}`}>{field.label}</InputLabel>
                                            <Select
                                                labelId={`act-${index}`}
                                                key={`${field.name}_${field.label}`}
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
                                                    .map((selectField, i) => (
                                                        <MenuItem
                                                            key={`${field.name}_${selectField.label}`}
                                                            value={selectField.label}
                                                            disabled={
                                                                (selectField.label === "Ora d'aria" && disableOraDAria) ||
                                                                (!formData.classe.startsWith("5") && selectField.label === "Aula di Studio" && disableStudio)
                                                            }
                                                        >
                                                            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                                                <span>{selectField.label}</span>
                                                                {openSelect && (
                                                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handlePopoverOpen(e, selectField.descr); }}>
                                                                        <ArrowDropDownIcon fontSize="small" />
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
                                        <InputLabel key={`label-${index}`}>{field.label}</InputLabel>
                                    );

                                case 'radio':
                                    return (

                                        <FormControl fullWidth margin="normal" key={`formcontrol-${index}`}>
                                            <Box display="flex" alignItems="center" gap={3}>
                                                <Typography variant="body1" sx={{ mr: 1 }}>
                                                    {field.label}
                                                </Typography>

                                                <RadioGroup
                                                    row
                                                    name={field.name}
                                                    value={formData[field.name] ?? ""}
                                                    onChange={handleChange}
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
                                            margin="normal"
                                        />

                                    );
                            }
                        })}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" type="submit">
                            Invia
                        </Button>
                    </Box>
                </Box>



                <Popover
                    id={popoverId}
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography sx={{ p: 2 }}>{popoverContent}</Typography>
                </Popover>
            </Box>


        </>

    );
}
