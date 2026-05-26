// ReleTable.tsx

import { useState } from "react";

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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";

interface Props {

    reles: Rele[];

    onEditar: (
        rele: Rele
    ) => void;

    onDarDeBaja: (
        id: number,
        motivo: string
    ) => Promise<void>;
}

function ReleTable({
    reles,
    onEditar,
    onDarDeBaja
}: Props) {

    const [
        releSeleccionado,
        setReleSeleccionado
    ] = useState<Rele | null>(null);

    const [
        motivo,
        setMotivo
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        filtro,
        setFiltro
    ] = useState<
        "ACTIVOS"
        |
        "INACTIVOS"
        |
        "TODOS"
    >("ACTIVOS");

    const relesFiltrados =
        reles.filter((rele) => {

            if (filtro === "ACTIVOS") {
                return rele.activo;
            }

            if (filtro === "INACTIVOS") {
                return !rele.activo;
            }

            return true;
        });

    const handleConfirmarBaja =
    async () => {

        if (
            !releSeleccionado
            ||
            !motivo.trim()
        ) {
            return;
        }

        try {

            setLoading(true);

            await onDarDeBaja(
                releSeleccionado.id,
                motivo
            );

            setReleSeleccionado(null);

            setMotivo("");

        } catch (error) {

            console.error(error);

            alert(
                "Error al dar de baja el relé"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <>

            <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2 }}
            >

                <ToggleButtonGroup
                    exclusive
                    value={filtro}
                    onChange={(_, value) => {

                        if (value) {
                            setFiltro(value);
                        }
                    }}
                >

                    <ToggleButton value="ACTIVOS">
                        Activos
                    </ToggleButton>

                    <ToggleButton value="INACTIVOS">
                        Inactivos
                    </ToggleButton>

                    <ToggleButton value="TODOS">
                        Todos
                    </ToggleButton>

                </ToggleButtonGroup>

            </Stack>

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
                                <strong>Estado</strong>
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

                        {relesFiltrados.map((rele) => (

                            <TableRow
                                key={rele.id}
                                sx={{
                                    backgroundColor:
                                        rele.activo
                                            ? "inherit"
                                            : "#f5f5f5",

                                    opacity:
                                        rele.activo
                                            ? 1
                                            : 0.7
                                }}
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
                                        rele.activo ? (

                                            <Chip
                                                label="ACTIVO"
                                                color="success"
                                                size="small"
                                            />

                                        ) : (

                                            <Chip
                                                label="BAJA"
                                                color="error"
                                                size="small"
                                            />
                                        )
                                    }

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

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >

                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() =>
                                                onEditar(rele)
                                            }
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                            disabled={!rele.activo}
                                            onClick={() =>
                                                setReleSeleccionado(rele)
                                            }
                                        >
                                            {
                                                rele.activo
                                                    ? "Dar de baja"
                                                    : "Inactivo"
                                            }
                                        </Button>

                                    </Stack>

                                </TableCell>

                            </TableRow>
                        ))}

                        {relesFiltrados.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={9}
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

            <Dialog
                open={
                    releSeleccionado !== null
                }
                onClose={() =>
                    setReleSeleccionado(null)
                }
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>
                    Dar de baja relé
                </DialogTitle>

                <DialogContent>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        label="Motivo de baja"
                        value={motivo}
                        onChange={(e) =>
                            setMotivo(
                                e.target.value
                            )
                        }
                    />

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setReleSeleccionado(null)
                        }
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        disabled={
                            loading
                            ||
                            !motivo.trim()
                        }
                        onClick={
                            handleConfirmarBaja
                        }
                    >
                        Confirmar baja
                    </Button>

                </DialogActions>

            </Dialog>

        </>
    );
}

export default ReleTable;