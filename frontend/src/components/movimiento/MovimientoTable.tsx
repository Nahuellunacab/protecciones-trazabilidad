import type {
    Movimiento
} from "../../types/Movimiento";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

interface Props {

    movimientos: Movimiento[];
}

function MovimientoTable({
    movimientos
}: Props) {

    return (

        <TableContainer
            component={Paper}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            Relé
                        </TableCell>

                        <TableCell>
                            Estado
                        </TableCell>

                        <TableCell>
                            Posición
                        </TableCell>

                        <TableCell>
                            Fecha
                        </TableCell>

                        <TableCell>
                            Notas
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {movimientos.map(
                        (movimiento) => (

                        <TableRow
                            key={movimiento.id}
                        >

                            <TableCell>
                                {movimiento.rele}
                            </TableCell>

                            <TableCell>
                                {movimiento.estado}
                            </TableCell>

                            <TableCell>
                                {movimiento.posicion}
                            </TableCell>

                            <TableCell>
                                {
                                    movimiento
                                    .fechaMovimiento
                                }
                            </TableCell>

                            <TableCell>
                                {movimiento.notas}
                            </TableCell>

                        </TableRow>
                    ))}

                </TableBody>

            </Table>

        </TableContainer>
    );
}

export default MovimientoTable;