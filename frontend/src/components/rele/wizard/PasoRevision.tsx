import { useState } from "react";

import {
    Alert,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import DeleteIcon
from "@mui/icons-material/Delete";

import CheckCircleIcon
from "@mui/icons-material/CheckCircle";

import AddIcon
from "@mui/icons-material/Add";

import type { Marca } from "../../../types/Marca";
import type { Modelo } from "../../../types/Modelo";
import type { Destino } from "../../../types/Destino";
import type { Posicion } from "../../../types/Posicion";
import type { PosicionRequest } from "../../../types/PosicionRequest";
import type { Estado } from "../../../types/Estado";
import type { Remito } from "../../../types/Remito";
import type { OrdenProvision } from "../../../types/OrdenProvision";
import type { DatosReleManual } from "./PasoCargaManual";

const OPCION_NUEVA_POSICION = "__nueva__";

interface Props {

    lote: DatosReleManual[];
    onQuitar: (indice: number) => void;
    onCambiarPosicion: (indice: number, posicionId: number) => void;

    marcas: Marca[];
    modelos: Modelo[];

    destinoSeleccionado: Destino | null;
    posicionInicialId: number | undefined;
    posiciones: Posicion[];
    onCrearPosicion: (data: PosicionRequest) => Promise<Posicion | null>;

    estadoInicialId: number | undefined;
    estadosIniciales: Estado[];

    cargarGarantia: boolean;
    garantiaMeses: number | null;
    usarFechaActual: boolean;
    inicioGarantia: string | null;

    remitoId: number | null;
    remitosDisponibles: Remito[];
    ordenProvisionId: number | null;
    opDisponibles: OrdenProvision[];

    confirmando: boolean;
    error: string;
    onConfirmar: () => void;
}

function PasoRevision({
    lote,
    onQuitar,
    onCambiarPosicion,
    marcas,
    modelos,
    destinoSeleccionado,
    posicionInicialId,
    posiciones,
    onCrearPosicion,
    estadoInicialId,
    estadosIniciales,
    cargarGarantia,
    garantiaMeses,
    usarFechaActual,
    inicioGarantia,
    remitoId,
    remitosDisponibles,
    ordenProvisionId,
    opDisponibles,
    confirmando,
    error,
    onConfirmar
}: Props) {

    // Índice del relé para el que se abrió "+ Nueva posición..." desde su
    // fila; null cuando el diálogo está cerrado. Se necesita para saber a
    // qué relé asignarle la posición recién creada (no al lote entero).
    const [indiceNuevaPosicion, setIndiceNuevaPosicion] =
        useState<number | null>(null);

    const [nuevaPosicionNombre, setNuevaPosicionNombre] = useState("");
    const [creandoPosicion, setCreandoPosicion] = useState(false);
    const [errorPosicion, setErrorPosicion] = useState("");

    const cerrarDialogoPosicion = () => {

        setIndiceNuevaPosicion(null);
        setNuevaPosicionNombre("");
        setErrorPosicion("");
    };

    const handleSeleccionarPosicion = (
        indice: number,
        valor: string
    ) => {

        if (valor === OPCION_NUEVA_POSICION) {

            setIndiceNuevaPosicion(indice);

            return;
        }

        onCambiarPosicion(indice, Number(valor));
    };

    const handleCrearPosicion = async () => {

        if (!destinoSeleccionado || indiceNuevaPosicion === null) return;

        setCreandoPosicion(true);
        setErrorPosicion("");

        try {

            const creada = await onCrearPosicion({
                nombre: nuevaPosicionNombre.trim(),
                destinoId: destinoSeleccionado.id
            });

            if (creada) {
                onCambiarPosicion(indiceNuevaPosicion, creada.id);
            }

            cerrarDialogoPosicion();

        } catch {

            setErrorPosicion(
                "No se pudo crear la posición. Intente nuevamente."
            );

        } finally {

            setCreandoPosicion(false);
        }
    };

    const nombreModelo = (modeloId: number) =>
        modelos.find((m) => m.id === modeloId)?.nombre
        ?? "Modelo eliminado";

    const nombreMarca = (modeloId: number) => {

        const modelo = modelos.find((m) => m.id === modeloId);

        return marcas.find((m) => m.id === modelo?.marcaId)?.nombre
            ?? "-";
    };

    const nombrePosicion =
        posiciones.find((p) => p.id === posicionInicialId)?.nombre
        ?? "-";

    const nombreEstadoInicial =
        estadosIniciales.find((e) => e.id === estadoInicialId)?.nombre
        ?? "-";

    const remitoAsociado =
        remitosDisponibles.find((r) => r.id === remitoId);

    const opAsociada =
        opDisponibles.find((op) => op.id === ordenProvisionId);

    return (

        <Stack spacing={3}>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Configuración aplicada a todo el lote
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ flexWrap: "wrap" }}
                >

                    <Chip
                        label={
                            `Destino: ${destinoSeleccionado?.nombre ?? "-"}`
                        }
                        variant="outlined"
                    />

                    <Chip
                        label={`Posición por defecto: ${nombrePosicion}`}
                        variant="outlined"
                    />

                    <Chip
                        label={`Estado inicial: ${nombreEstadoInicial}`}
                        color="primary"
                        variant="outlined"
                    />

                    <Chip
                        label={
                            cargarGarantia
                                ? `Garantía: ${garantiaMeses ?? "-"} meses (${usarFechaActual ? "desde hoy" : `desde ${inicioGarantia}`})`
                                : "Sin garantía"
                        }
                        variant="outlined"
                    />

                    <Chip
                        label={
                            remitoAsociado
                                ? `Remito: ${remitoAsociado.numeroRemito}`
                                : opAsociada
                                    ? `OP: ${opAsociada.numero}`
                                    : "Sin documentación"
                        }
                        variant="outlined"
                    />

                </Stack>

            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Relés a crear ({lote.length})
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Todos comparten el destino de arriba, pero cada uno puede
                    ir a una posición distinta dentro de ese destino — revisá
                    la columna "Posición" antes de confirmar.
                </Typography>

                {
                    lote.length === 0
                        ? (
                            <Alert severity="warning">
                                No hay relés cargados. Volvé al paso anterior
                                para agregar al menos uno.
                            </Alert>
                        )
                        : (
                            <Table size="small">

                                <TableHead>

                                    <TableRow>
                                        <TableCell>Marca</TableCell>
                                        <TableCell>Modelo</TableCell>
                                        <TableCell>Número de serie</TableCell>
                                        <TableCell>Cód. Configuración</TableCell>
                                        <TableCell>Order Code</TableCell>
                                        <TableCell>Posición</TableCell>
                                        <TableCell align="right">Quitar</TableCell>
                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {
                                        lote.map((rele, indice) => (

                                            <TableRow key={`${rele.numeroSerie}-${indice}`}>

                                                <TableCell>
                                                    {nombreMarca(rele.modeloId)}
                                                </TableCell>

                                                <TableCell>
                                                    {nombreModelo(rele.modeloId)}
                                                </TableCell>

                                                <TableCell>
                                                    <Typography sx={{ fontWeight: 600 }}>
                                                        {rele.numeroSerie}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {rele.codigoConfiguracion || "-"}
                                                </TableCell>

                                                <TableCell>
                                                    {rele.orderCode || "-"}
                                                </TableCell>

                                                <TableCell sx={{ minWidth: 180 }}>

                                                    <TextField
                                                        select
                                                        size="small"
                                                        fullWidth
                                                        disabled={confirmando}
                                                        value={
                                                            rele.posicionId
                                                            ?? posicionInicialId
                                                            ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            handleSeleccionarPosicion(
                                                                indice,
                                                                e.target.value
                                                            )
                                                        }
                                                    >

                                                        {
                                                            posiciones.map((posicion) => (

                                                                <MenuItem
                                                                    key={posicion.id}
                                                                    value={posicion.id}
                                                                >
                                                                    {posicion.nombre}
                                                                </MenuItem>
                                                            ))
                                                        }

                                                        <MenuItem value={OPCION_NUEVA_POSICION}>
                                                            <AddIcon
                                                                fontSize="small"
                                                                sx={{ mr: 0.5 }}
                                                            />
                                                            Nueva posición...
                                                        </MenuItem>

                                                    </TextField>

                                                </TableCell>

                                                <TableCell align="right">

                                                    <Tooltip title="Quitar de la carga">

                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            disabled={confirmando}
                                                            onClick={() => onQuitar(indice)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>

                                                    </Tooltip>

                                                </TableCell>

                                            </TableRow>
                                        ))
                                    }

                                </TableBody>

                            </Table>
                        )
                }

            </Paper>

            <Alert severity="info">
                Revisá bien el destino y la posición: una vez confirmada la
                carga, no se pueden corregir desde acá — hay que registrar
                un movimiento nuevo para cada relé.
            </Alert>

            {
                error && (
                    <Alert severity="error">{error}</Alert>
                )
            }

            <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircleIcon />}
                disabled={lote.length === 0 || confirmando}
                onClick={onConfirmar}
            >
                {
                    confirmando
                        ? "Creando relés..."
                        : `Confirmar carga de ${lote.length} relé(s)`
                }
            </Button>

            <Dialog
                open={indiceNuevaPosicion !== null}
                onClose={cerrarDialogoPosicion}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>
                    Nueva posición
                    {
                        destinoSeleccionado
                            ? ` en ${destinoSeleccionado.nombre}`
                            : ""
                    }
                </DialogTitle>

                <DialogContent>

                    <Stack spacing={2} sx={{ mt: 1 }}>

                        <TextField
                            label="Nombre"
                            fullWidth
                            value={nuevaPosicionNombre}
                            onChange={(e) =>
                                setNuevaPosicionNombre(e.target.value)
                            }
                        />

                        {
                            errorPosicion && (
                                <Alert severity="error">{errorPosicion}</Alert>
                            )
                        }

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button onClick={cerrarDialogoPosicion}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        disabled={
                            creandoPosicion || !nuevaPosicionNombre.trim()
                        }
                        onClick={handleCrearPosicion}
                    >
                        {creandoPosicion ? "Creando..." : "Crear"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Stack>
    );
}

export default PasoRevision;
