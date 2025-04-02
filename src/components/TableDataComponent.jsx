import React, { useEffect, useState } from 'react';
import { Box, Paper, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { DataGrid } from '@mui/x-data-grid';

function TableDataComponent({ tableData, columns, rowIdField }) {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const exportToExcel = () => {
        const formattedData = tableData.map(row => {
            const formattedRow = {};
            columns.forEach(col => {
                let value = row[col.field];
    
                if (Array.isArray(value)) {
                    value = value.join(", ");
                } else if (typeof value === "object" && value !== null) {
                    value = JSON.stringify(value);
                }
                
                formattedRow[col.headerName] = value || "";
            });
            return formattedRow;
        });
    
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dati");
    
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'tabella_dati.xlsx');
    };
    
    
    return (
        <>
            <Box>
                <Paper sx={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={tableData}
                        columns={columns}
                        getRowId={(row) => row[rowIdField]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 20, 50]}
                        sx={{ border: 0 }}
                        disableRowSelectionOnClick
                    />
                    <IconButton
                    onClick={exportToExcel}
                    sx={{ marginTop: '-65px' }}
                    aria-label="Scarica Excel"
                >
                    <DownloadIcon fontSize="large" />
                </IconButton>
                </Paper>
            </Box>
        </>
    );
}

export default TableDataComponent;
