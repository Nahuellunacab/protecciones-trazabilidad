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
    Typography
} from "@mui/material";

import type { Marca }
from "../../../types/Marca";

interface Props {

    marcas: Marca[];

    onEditar: (
        marca: Marca
    ) => void;

    onEliminar: (
        id: number
    ) => void;
}

function MarcaTable({
    marcas,
    onEditar,
    onEliminar
}: Props) {

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
                            <strong>ID</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Nombre</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Acciones</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        marcas.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={3}
                                >

                                    <Typography
                                        align="center"
                                    >
                                        No hay marcas registradas
                                    </Typography>

                                </TableCell>

                            </TableRow>
                        )
                    }

                    {
                        marcas.map((marca) => (

                            <TableRow
                                key={marca.id}
                                hover
                            >

                                <TableCell>
                                    {marca.id}
                                </TableCell>

                                <TableCell>
                                    {marca.nombre}
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
                                                onEditar(marca)
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
                                                    marca.id
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

export default MarcaTable;