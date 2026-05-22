import type { Rele } from "../../types/Rele";

import {
    Chip,
    Paper,
    Stack,
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

                    {reles.map((rele) => (

                        <TableRow key={rele.id} hover>

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
                                    rele.estadoGarantia === "VIGENTE" && (

                                        <Chip
                                            label={
                                                `${rele.mesesRestantesGarantia} meses restantes`
                                            }
                                            color="success"
                                            size="small"
                                        />
                                    )
                                }

                                {
                                    rele.estadoGarantia === "POR VENCER" && (

                                        <Chip
                                            label={
                                                `${rele.mesesRestantesGarantia} meses restantes`
                                            }
                                            color="warning"
                                            size="small"
                                        />
                                    )
                                }

                                {
                                    rele.estadoGarantia === "VENCIDA" && (

                                        <Chip
                                            label="Garantía vencida"
                                            color="error"
                                            size="small"
                                        />
                                    )
                                }

                                {
                                    rele.estadoGarantia === "Sin garantía" && (

                                        <Chip
                                            label="Sin garantía"
                                            size="small"
                                        />
                                    )
                                }

                            </TableCell>

                            <TableCell>

                                {
                                    rele.remitoId
                                            ? (
                                                <Stack>
                                                    {rele.remitoId}
                                                </Stack>
                                            )
                                            : "-"
                                }

                            </TableCell>

                        </TableRow>
                    ))}

                    {reles.length === 0 && (

                        <TableRow>

                            <TableCell
                                colSpan={7}
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