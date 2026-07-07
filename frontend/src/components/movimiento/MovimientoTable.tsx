import { useNavigate } from "react-router-dom";

import type {
    Movimiento
} from "../../types/Movimiento";

import {

    Chip,
    IconButton,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography

} from "@mui/material";

import HistoryIcon
from "@mui/icons-material/History";

import EmptyState
from "../common/EmptyState";

interface Props {

    movimientos: Movimiento[];

    cargando?: boolean;
}

function MovimientoTable({
    movimientos,
    cargando = false
}: Props) {

    const navigate = useNavigate();

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

                        <TableCell align="center">
                            <strong>Acciones</strong>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {
                        cargando && (

                            Array.from(
                                { length: 5 }
                            ).map(
                                (_, indice) => (

                                    <TableRow
                                        key={
                                            `skeleton-${indice}`
                                        }
                                    >

                                        {
                                            Array.from(
                                                { length: 10 }
                                            ).map(
                                                (_, columna) => (

                                                    <TableCell
                                                        key={columna}
                                                    >

                                                        <Skeleton
                                                            variant="text"
                                                        />

                                                    </TableCell>
                                                )
                                            )
                                        }

                                    </TableRow>
                                )
                            )
                        )
                    }

                    {
                        !cargando
                        &&
                        movimientosOrdenados.length === 0 && (

                            <TableRow>

                                <TableCell colSpan={10}>

                                    <EmptyState
                                        titulo="No se encontraron movimientos"
                                        subtitulo="Probá ajustar el período seleccionado."
                                    />

                                </TableCell>

                            </TableRow>
                        )
                    }

                    {
                        !cargando
                        &&
                        movimientosOrdenados.map(
                            (movimiento) => (

                            <TableRow
                                key={movimiento.id}
                                hover
                            >

                                <TableCell>

                                    <Typography
                                        sx={{ fontWeight: 600 }}
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

                                <TableCell align="center">

                                    <Tooltip title="Ver detalle del relé">

                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                                navigate(
                                                    `/reles/${movimiento.releId}`
                                                )
                                            }
                                        >

                                            <HistoryIcon fontSize="small" />

                                        </IconButton>

                                    </Tooltip>

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