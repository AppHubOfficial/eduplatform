import React, { useEffect, useState } from 'react';
import { Box, Paper, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function TableCorsi({ tableData, rowIdField }) {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const moduli = ['m1', 'm2', 'm3', 'g1', 'g2', 'g3', 'attivita_pomeriggio'];
    const corsi = [
        "Assente (tutta la mattina)",
        "Assente",
        "Calcio (tutta la mattina)",
        "Calcio (Non torneo)",
        "Basket",
        "Pallavolo",
        "Ping Pong",
        "Cucina con Casalegno",
        "Make-up",
        "Croce Rossa",
        "Forze dell'Ordine",
        "Protezione Civile",
        "Programmazione",
        "Cinema",
        "Anime",
        "Ballo",
        "Ludoteca",
        "Aula di Studio",
        "Pittura",
        "Ora d'aria"
    ];

    const createMatrix = (tableData, moduli, corsi) => {
        const matrix = {};

        moduli.forEach(modulo => {
            matrix[modulo] = {};
            corsi.forEach(corso => {
                matrix[modulo][corso] = "-";
            });
        });

        tableData.forEach(student => {
            moduli.forEach(modulo => {
                const corso = student[modulo];
                if (corso) {
                    matrix[modulo][corso] += `${student["nome"]}${student["cognome"]} - `;
                }
            });
        });

        return matrix;
    };

    const createMatrixNum = (tableData, moduli, corsi) => {
        const matrixNum = {};

        moduli.forEach(modulo => {
            matrixNum[modulo] = {};
            corsi.forEach(corso => {
                matrixNum[modulo][corso] = 0;
            });
        });

        tableData.forEach(student => {
            moduli.forEach(modulo => {
                const corso = student[modulo];
                if (corso) {
                    matrixNum[modulo][corso] += 1;
                }
            });
        });

        return matrixNum;
    };

    const matrix = createMatrix(tableData, moduli, corsi);
    const matrixNum = createMatrixNum(tableData, moduli, corsi);

    const exportToExcel = () => {
        const formattedData = moduli.map(modulo => {
            const row = { Modulo: modulo.toUpperCase() };
    
            corsi.forEach(corso => {
                row[corso] = matrix[modulo][corso] || 0;
            });
    
            return row;
        });
    
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Modulo-Corso");
    
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(data, 'tabella_modulo_corso.xlsx');
    };

    return (
        <>

            <TableContainer component={Paper} sx={{ marginTop: '50px' }}>
                <Typography variant="h6" sx={{ padding: 2 }}>Tabella modulo/corso studenti</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Modulo</strong></TableCell>
                            {corsi.map(corso => (
                                <TableCell key={corso} align="center"><strong>{corso}</strong></TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moduli.map(modulo => (
                            <TableRow key={modulo}>
                                <TableCell>{modulo.toUpperCase()}</TableCell>
                                {corsi.map(corso => (
                                    <TableCell key={corso} align="center"
                                        sx={{
                                            width: '100px !important',
                                            height: '50px',
                                            padding: '8px',
                                            minWidth: '100px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <p style={{width: "300px", overflow: "auto"}}>{matrix[modulo][corso] || "-"}</p>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <IconButton
                    onClick={exportToExcel}
                    sx={{ marginTop: '0px' }}
                    aria-label="Scarica Excel"
                >
                    <DownloadIcon fontSize="large" />
                </IconButton>
            </TableContainer>


            <TableContainer component={Paper} sx={{ marginTop: '50px' }}>
                <Typography variant="h6" sx={{ padding: 2 }}>Tabella modulo/corso numeri</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Modulo</strong></TableCell>
                            {corsi.map(corso => (
                                <TableCell key={corso} align="center"><strong>{corso}</strong></TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moduli.map(modulo => (
                            <TableRow key={modulo}>
                                <TableCell>{modulo.toUpperCase()}</TableCell>
                                {corsi.map(corso => (
                                    <TableCell key={corso} align="center">
                                        {matrixNum[modulo][corso] || 0}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>



        </>

    );
}

export default TableCorsi;
