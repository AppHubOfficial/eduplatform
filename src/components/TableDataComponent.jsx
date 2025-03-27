import React, { useEffect, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function TableDataComponent({ usersData }) {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    //console.log(usersData)

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
        
        if (el.ripetizioni !== undefined && el.ripetizioni !== null) {
            el.ripetizioni = el.ripetizioni ? "Sì" : "No";
        }
    });
    

    const columns = [
        { field: 'nome', headerName: 'Nome', width: 130 },
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

    return (
        <>
            <Box>
                {!usersData ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper sx={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={usersData}
                            columns={columns}
                            getRowId={(row) => row.email}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 20, 50]}
                            checkboxSelection
                            sx={{ border: 0 }}
                        />
                    </Paper>
                )}
            </Box>
        </>
    );
}

export default TableDataComponent;
