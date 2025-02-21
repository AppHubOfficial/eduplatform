import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function PrivacyPolicyDialog({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Informativa sulla Privacy</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" gutterBottom>
                    La presente informativa descrive le modalità di raccolta, utilizzo e protezione dei dati personali degli utenti. Utilizziamo i tuoi dati per migliorare l’esperienza e garantire la sicurezza e l’efficacia del servizio.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Raccolta dei dati personali:</strong> Durante la registrazione, raccogliamo informazioni quali nome, cognome, email, numero di telefono e altre informazioni necessarie per identificare l’utente e fornire il servizio richiesto. Tali dati vengono trattati in conformità con la normativa vigente e non saranno utilizzati per finalità differenti da quelle dichiarate senza il consenso dell’utente.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Utilizzo dei dati:</strong> I dati raccolti sono utilizzati per comunicare con gli utenti, fornire supporto, migliorare il servizio e mantenere un ambiente sicuro. 
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Condivisione dei dati:</strong> Non condividiamo i dati personali con terze parti, ad eccezione dei casi richiesti dalla legge o necessari per la fornitura del servizio, e solo in conformità con le leggi sulla protezione dei dati.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Sicurezza:</strong> Adottiamo misure di sicurezza avanzate per proteggere i dati degli utenti da accessi non autorizzati e da possibili violazioni. Tuttavia, nessun sistema è totalmente sicuro; invitiamo quindi gli utenti a proteggere le proprie informazioni e le proprie credenziali.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Diritti degli utenti:</strong> Gli utenti hanno il diritto di accedere ai propri dati, richiederne la modifica o la cancellazione.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Chiudi
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PrivacyPolicyDialog;
