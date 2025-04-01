import React, { useEffect, useState } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function TableDataComponent({ tableData, columns, rowIdField }) {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    //console.log(tableData)

    tableData?.forEach((el) => {
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

    return (
        <>
            <Box>
                {!tableData ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper sx={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={tableData}
                            columns={columns}
                            getRowId={(row) => row[rowIdField]}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            pageSizeOptions={[10, 20, 50]}
                            sx={{ border: 0 }}
                        />
                    </Paper>
                )}
            </Box>
        </>
    );
}

export default TableDataComponent;
