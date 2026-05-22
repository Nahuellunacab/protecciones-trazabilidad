// ReleTable.tsx

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
    Stack,
    Button
} from "@mui/material";

interface Props {

    reles: Rele[];

    onEditar: (
        rele: Rele
    ) => void;
}

function ReleTable({
    reles,
    onEditar
}: Props) {

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

                        <TableCell>
                            <strong>Acciones</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {reles.map((rele) => (

                        <TableRow key={rele.id}>

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

                                <Stack
                                    direction="row"
                                    spacing={1}
                                >

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

                                </Stack>

                            </TableCell>

                            <TableCell>

                                {
                                    rele.remitoId
                                        ? rele.remitoId
                                        : "-"
                                }

                            </TableCell>

                            <TableCell>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                        onEditar(rele)
                                    }
                                >
                                    Editar
                                </Button>

                            </TableCell>

                        </TableRow>
                    ))}

                    {reles.length === 0 && (

                        <TableRow>

                            <TableCell
                                colSpan={8}
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