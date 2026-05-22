import type { Rele }
from "../../types/Rele";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Stack
} from "@mui/material";

interface Props {

    reles: Rele[];
}

function ReleTable({
    reles
}: Props) {

    const obtenerGarantia = (
        rele: Rele
    ) => {

        if (
            !rele.garantiaMeses
        ) {

            return "Sin garantía";
        }

        return `
            ${rele.garantiaMeses}
            meses
        `;
    };

    return (

        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 3
            }}
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <strong>Serie</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Marca</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Modelo</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Tensión</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Tipo</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Garantía</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Remito</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        reles.map((rele) => (

                            <TableRow
                                key={rele.id}
                                hover
                            >

                                <TableCell>
                                    {rele.numeroSerie}
                                </TableCell>

                                <TableCell>
                                    {rele.marca}
                                </TableCell>

                                <TableCell>
                                    {rele.modelo}
                                </TableCell>

                                <TableCell>
                                    {rele.tension || "-"}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={
                                            rele.tipo || "-"
                                        }
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </TableCell>

                                <TableCell>
                                    {
                                        obtenerGarantia(
                                            rele
                                        )
                                    }
                                </TableCell>

                                <TableCell>

                                    {
                                        rele.remito
                                            ? (
                                                <Stack>
                                                    {
                                                        rele.remito
                                                    }
                                                </Stack>
                                            )
                                            : "-"
                                    }

                                </TableCell>

                            </TableRow>
                        ))
                    }

                    {
                        reles.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                    align="center"
                                >

                                    <Typography
                                        sx={{
                                            py: 3
                                        }}
                                    >
                                        No hay relés cargados
                                    </Typography>

                                </TableCell>

                            </TableRow>
                        )
                    }

                </TableBody>

            </Table>

        </TableContainer>
    );
}

export default ReleTable;