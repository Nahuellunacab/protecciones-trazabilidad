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
    Chip,
    Typography
} from "@mui/material";

import type { Usuario }
from "../../../types/Usuario";

interface Props {

    usuarios: Usuario[];

    isAdmin: boolean;

    onEditar: (
        usuario: Usuario
    ) => void;
}

function UsuarioTable({
    usuarios,
    isAdmin,
    onEditar
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
                            <strong>Email</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Nº de Sobre</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Rol</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Estado</strong>
                        </TableCell>

                        <TableCell>
                            <strong>Acciones</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        usuarios.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                >

                                    <Typography
                                        align="center"
                                    >
                                        No hay usuarios registrados
                                    </Typography>

                                </TableCell>

                            </TableRow>
                        )
                    }

                    {
                        usuarios.map((usuario) => (

                            <TableRow
                                key={usuario.id}
                                hover
                            >

                                <TableCell>
                                    {usuario.id}
                                </TableCell>

                                <TableCell>
                                    {usuario.nombre} {usuario.apellido}
                                </TableCell>

                                <TableCell>
                                    {usuario.email}
                                </TableCell>

                                <TableCell>
                                    {usuario.numeroSobre}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={usuario.rol}
                                        color={
                                            usuario.rol === "ADMIN"
                                                ? "primary"
                                                : usuario.rol === "OPERADOR"
                                                    ? "info"
                                                    : "default"
                                        }
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            usuario.activo
                                                ? "ACTIVO"
                                                : "INACTIVO"
                                        }
                                        color={
                                            usuario.activo
                                                ? "success"
                                                : "error"
                                        }
                                        size="small"
                                        variant="outlined"
                                    />

                                </TableCell>

                                <TableCell>

                                    {isAdmin && (

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                        >

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() =>
                                                    onEditar(usuario)
                                                }
                                            >
                                                Editar
                                            </Button>

                                        </Stack>
                                    )}

                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>

        </TableContainer>
    );
}

export default UsuarioTable;
