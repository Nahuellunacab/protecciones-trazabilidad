import type {
    Movimiento
} from "../../types/Movimiento";

import {

    Chip,
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

    movimientos: Movimiento[];
}

function MovimientoTable({
    movimientos
}: Props) {

    const movimientosOrdenados =
        [...movimientos].sort(

            (a, b) =>

                new Date(
                    b.fechaMovimiento
                ).getTime()

                -

                new Date(
                    a.fechaMovimiento
                ).getTime()
        );

    const formatearFecha = (
        fecha: string
    ) => {

        return new Date(fecha)
            .toLocaleString(
                "es-AR",
                {

                    day: "2-digit",

                    month: "2-digit",

                    year: "numeric",

                    hour: "2-digit",

                    minute: "2-digit"
                }
            );
    };

    const obtenerColorEstado = (
        estado: string
    ) => {

        const valor =
            estado.toLowerCase();

        if (
            valor.includes("disponible")
        ) {
            return "success";
        }

        if (
            valor.includes("instalado")
        ) {
            return "primary";
        }

        if (
            valor.includes("repar")
        ) {
            return "warning";
        }

        if (
            valor.includes("baja")
        ) {
            return "error";
        }

        return "default";
    };

    return (

        <TableContainer
            component={Paper}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Relé</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Marca</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Modelo</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Estado</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Destino</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Posición</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Responsable</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Fecha</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Notas</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        movimientosOrdenados.map(
                            (movimiento) => (

                            <TableRow
                                key={movimiento.id}
                                hover
                            >

                                <TableCell>

                                    <Typography
                                        fontWeight={600}
                                    >

                                        {
                                            movimiento.rele
                                        }

                                    </Typography>

                                </TableCell>

                                <TableCell>
                                    {movimiento.marca}
                                </TableCell>

                                <TableCell>
                                    {movimiento.modelo}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            movimiento.estado
                                        }
                                        color={
                                            obtenerColorEstado(
                                                movimiento.estado
                                            ) as any
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>
                                    {
                                        movimiento.destino
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        movimiento.posicion
                                    }
                                </TableCell>

                                <TableCell>
                                    {
                                        movimiento.responsable
                                    }
                                </TableCell>

                                <TableCell>

                                    {
                                        formatearFecha(
                                            movimiento.fechaMovimiento
                                        )
                                    }

                                </TableCell>

                                <TableCell
                                    sx={{
                                        maxWidth: 300
                                    }}
                                >

                                    {
                                        movimiento.notas
                                            || "-"
                                    }

                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>

        </TableContainer>
    );
}

export default MovimientoTable;