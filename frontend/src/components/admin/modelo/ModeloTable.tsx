import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Stack,
    Chip
} from "@mui/material";

import type { Modelo }
from "../../../types/Modelo";

interface Props {

    modelos: Modelo[];

    onEditar: (
        modelo: Modelo
    ) => void;

    onEliminar: (
        id: number
    ) => void;
}

function ModeloTable({
    modelos,
    onEditar,
    onEliminar
}: Props) {

    const obtenerTension = (
        modelo: Modelo
    ) => {

        if (
            !modelo.tensionDesde &&
            !modelo.tensionHasta
        ) {

            return "-";
        }

        return `
            ${modelo.tensionDesde}
            -
            ${modelo.tensionHasta}
            ${modelo.tipoTension}
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
                            <strong>Modelo</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Tensión</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Tipo</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Marca</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Función</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Activos</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Baja</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Total</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Acciones</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        modelos.map((modelo) => (

                            <TableRow
                                key={modelo.id}
                                hover
                                sx={{

                                    backgroundColor:
                                        modelo.cantidadRelesActivos === 0
                                            ? "#f5f5f5"
                                            : "inherit",

                                    opacity:
                                        modelo.cantidadRelesActivos === 0
                                            ? 0.8
                                            : 1
                                }}
                            >

                                <TableCell>
                                    {modelo.nombre}
                                </TableCell>

                                <TableCell>
                                    {obtenerTension(modelo)}
                                </TableCell>

                                <TableCell>
                                    {modelo.tipoTension}
                                </TableCell>

                                <TableCell>
                                    {modelo.marca}
                                </TableCell>

                                <TableCell>
                                    {modelo.tipo}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            modelo.cantidadRelesActivos
                                        }
                                        color="success"
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            modelo.cantidadRelesBaja
                                        }
                                        color="error"
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            modelo.cantidadTotalReles
                                        }
                                        color="primary"
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >

                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() =>
                                                onEditar(modelo)
                                            }
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            onClick={() =>
                                                onEliminar(
                                                    modelo.id
                                                )
                                            }
                                        >
                                            Eliminar
                                        </Button>

                                    </Stack>

                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>

        </TableContainer>
    );
}

export default ModeloTable;