import { useState, useEffect } from "react";
import {
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Button,
    FormControl,
    InputLabel,
    Select,
    Typography,
    Box,
    Modal,
    CircularProgress,
    Popover,
    IconButton
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import backgroundCogestione from '../assets/images/sport.jpg';

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
        mangioScuola: false,
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
        { label: 'Modulo 1', name: 'm1', ora: 'merc_mattina', type: 'selectAttivita', required: true },
        { label: 'Modulo 2', name: 'm2', ora: 'merc_mattina', type: 'selectAttivita', required: true },
        { label: 'Modulo 3', name: 'm3', ora: 'merc_mattina', type: 'selectAttivita', required: true },

        { label: 'Giovedì mattina', type: 'label' },
        { label: 'Modulo 1', name: 'g1', ora: 'giov_mattina', type: 'selectAttivita', required: true },
        { label: 'Modulo 2', name: 'g2', ora: 'giov_mattina', type: 'selectAttivita', required: true },
        { label: 'Modulo 3', name: 'g3', ora: 'giov_mattina', type: 'selectAttivita', required: true },

        { label: `${["3", "4", "5"].includes(formData.classe.charAt(0)) ? "Giovedì" : "Mercoledì"} pomeriggio`, type: 'label' },
        { label: 'Modulo Pomeriggio', name: 'pomeriggio', ora: 'pomeriggio', type: 'selectAttivita', required: true },

        { label: 'Mangio a scuola (1€)', name: 'mangio_scuola', type: 'checkbox', required: false },
    ];



    const selectFields = [
        { name: "calcio_tutta_la_mattina", label: "Calcio (tutta la mattina)", descr: "Partita di calcio all'aperto. Le squadre verranno formate in anticipo.", ora: ["merc_mattina", "giov_mattina"] },
        { name: "calcio_non_torneo", label: "Calcio (Non torneo)", descr: "Partita di calcio amatoriale senza torneo, squadre organizzate prima.", ora: ["pomeriggio"] },
        { name: "basket", label: "Basket", descr: "Partita di basket all'aperto con squadre organizzate prima dell'evento.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "pallavolo", label: "Pallavolo", descr: "Gioco di pallavolo all'aperto con squadre predefinite.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ping_pong", label: "Ping Pong", descr: "Torneo di ping pong in aula attrezzata.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "cucina", label: "Cucina", descr: "Affiancamento al professor Casalegno nella preparazione della pasta per gli studenti.", ora: ["merc_mattina"] },
        { name: "cucina_etnica", label: "Cucina Etnica (1€ ad assaggio)", descr: "Fiera gastronomica con piatti da tutto il mondo preparati da famiglie e docenti.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "make_up", label: "Make-up", descr: "Sessione di confronto sulle tecniche di trucco tra studenti e studentesse.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "croce_rossa", label: "Croce Rossa", descr: "Due corsi della Croce Rossa: malattie sessualmente trasmissibili e rischi della guida irresponsabile.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "forze_dell_ordine", label: "Forze dell'Ordine", descr: "Incontro informativo sulle carriere nelle forze dell'ordine.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "protezione_civile", label: "Protezione Civile", descr: "Dimostrazioni della Protezione Civile sui rischi della zona.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "programmazione", label: "Programmazione", descr: "Lezione su linguaggi di programmazione extra rispetto al programma ministeriale.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "cinema_anime", label: "Cinema/Anime", descr: "Visione di un'opera di cinema o anime con successiva riflessione critica.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ballo", label: "Ballo", descr: "Lezioni di ballo moderno all'aperto con vari generi musicali.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ludoteca", label: "Ludoteca", descr: "Sessione di gioco da tavolo con esperti della ludoteca di Castelnuovo Don Bosco.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "aula_di_studio", label: "Aula di Studio", descr: "Spazio dedicato allo studio o al riposo, disponibile solo per due moduli.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "pittura", label: "Pittura", descr: "Ritinteggiatura dell'aula LCF il 23/04/2025 e dell'aula 7 il 24/04/2025.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },
        { name: "ora_d_aria", label: "Ora d'aria", descr: "Momento di relax all'aperto.", ora: ["merc_mattina", "giov_mattina", "pomeriggio"] },

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

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
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

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    useEffect(() => {
        setDisableOraDAria(Object.values(formData).includes("Ora d'aria"));
    }, [formData]);

    //////////// handleSubmit ////////////
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Dati inviati:", formData);
        setErrorMessage("");
        setOpen(true);
        setIsLoading(true);

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
                    mt: { xs: '-35vh', sm: '-40vh' },
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
                                                            disabled={selectField.label === "Ora d'aria" && disableOraDAria}
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

                                case 'checkbox':
                                    return (
                                        <FormControlLabel
                                            key={`checkbox-${index}`}
                                            control={<Checkbox checked={formData.mangioScuola} name="mangioScuola" onChange={handleChange} />}
                                            label="Mangio a scuola (2€)"
                                        />
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
