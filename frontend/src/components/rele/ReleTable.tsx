import type { Rele } from "../../types/Rele";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

interface Props {
    reles: Rele[];
}

function ReleTable({ reles }: Props) {

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Número Serie</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Modelo</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Marca</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {reles.map((rele) => (

                        <TableRow key={rele.id}>

                            <TableCell>
                                {rele.id}
                            </TableCell>

                            <TableCell>
                                {rele.numeroSerie}
                            </TableCell>

                            <TableCell>
                                {rele.modelo}
                            </TableCell>

                            <TableCell>
                                {rele.marca}
                            </TableCell>

                        </TableRow>
                    ))}

                    {reles.length === 0 && (

                        <TableRow>

                            <TableCell
                                colSpan={4}
                                align="center"
                            >

                                <Typography>
                                    No hay relés cargados
                                </Typography>

                            </TableCell>

                        </TableRow>
                    )}

                </TableBody>

            </Table>

        </TableContainer>
    );
}

export default ReleTable;