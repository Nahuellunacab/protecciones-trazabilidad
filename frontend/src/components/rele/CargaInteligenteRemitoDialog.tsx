import { useState } from "react";

import type { ReactNode } from "react";

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import CheckCircleIcon
from "@mui/icons-material/CheckCircle";

import WarningAmberIcon
from "@mui/icons-material/WarningAmber";

import ErrorOutlineIcon
from "@mui/icons-material/ErrorOutlineOutlined";

import InfoOutlinedIcon
from "@mui/icons-material/InfoOutlined";

import type {
    RemitoAnalisisIA,
    RemitoDatosExtraidos,
    ValidacionItem
} from "../../types/RemitoAnalisisIA";

import type { Marca } from "../../types/Marca";

import type { ProveedorRequest } from "../../types/ProveedorRequest";

import { crearMarca } from "../../services/marcaService";

import { crearModelo } from "../../services/modeloService";

import { crearProveedor } from "../../services/proveedorService";

import { revalidarAnalisisRemito } from "../../services/remitoService";

import MarcaForm from "../admin/marca/MarcaForm";

import ModeloForm from "../admin/modelo/ModeloForm";

import ProveedorForm from "../admin/proveedor/ProveedorForm";

interface Props {

    open: boolean;

    analisis: RemitoAnalisisIA | null;

    creando: boolean;

    marcas: Marca[];

    onClose: () => void;

    onConfirmar: () => void;

    onAnalisisActualizado: (nuevo: RemitoAnalisisIA) => void;

    onCatalogosActualizados: () => void;
}

type CreacionActiva =
    | { tipo: "marca"; nombreSugerido: string }
    | { tipo: "modelo"; nombreSugerido: string; marcaId: number | null }
    | { tipo: "proveedor"; nombreSugerido: string };

function iconoSeveridad(
    severidad: ValidacionItem["severidad"]
) {

    switch (severidad) {

        case "OK":
            return (
                <CheckCircleIcon
                    color="success"
                    sx={{ fontSize: 16 }}
                />
            );

        case "ADVERTENCIA":
            return (
                <WarningAmberIcon
                    color="warning"
                    sx={{ fontSize: 16 }}
                />
            );

        default:
            return (
                <ErrorOutlineIcon
                    color="error"
                    sx={{ fontSize: 16 }}
                />
            );
    }
}

function armarDatosParaRevalidar(
    analisis: RemitoAnalisisIA
): RemitoDatosExtraidos {

    return {

        numeroRemito: analisis.numeroRemito,

        fecha: analisis.fecha,

        proveedor: analisis.proveedor,

        ordenProvision: analisis.ordenProvision,

        reles: analisis.reles.map((rele) => ({

            marca: rele.marca,

            modelo: rele.modelo,

            codigoConfiguracion: rele.codigoConfiguracion,

            numeroSerie: rele.numeroSerie
        }))
    };
}

// Estadistica tipo "stat tile": un numero + etiqueta, con color de estado
// (reservado: neutral/success/warning/error) siempre acompañado de icono y
// texto, nunca solo color. El valor nunca lleva el color de estado (solo el
// icono), para que el numero siga siendo legible como texto.
function StatTile({
    icono,
    etiqueta,
    valor
}: {
    icono: ReactNode;
    etiqueta: string;
    valor: number;
}) {

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flex: "1 1 160px",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 1.25
            }}
        >

            {icono}

            <Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", lineHeight: 1.2 }}
                >
                    {etiqueta}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, lineHeight: 1.2 }}
                >
                    {valor}
                </Typography>

            </Box>

        </Box>
    );
}

function CargaInteligenteRemitoDialog({
    open,
    analisis,
    creando,
    marcas,
    onClose,
    onConfirmar,
    onAnalisisActualizado,
    onCatalogosActualizados
}: Props) {

    const [creacionActiva, setCreacionActiva] =
        useState<CreacionActiva | null>(null);

    const [revalidando, setRevalidando] =
        useState(false);

    const [errorAccion, setErrorAccion] =
        useState("");

    if (!analisis) {

        return null;
    }

    const revalidar = async (
        analisisActual: RemitoAnalisisIA
    ) => {

        setRevalidando(true);

        setErrorAccion("");

        try {

            const datos =
                armarDatosParaRevalidar(analisisActual);

            const nuevo =
                await revalidarAnalisisRemito(datos);

            onAnalisisActualizado(nuevo);

        } catch (err: any) {

            setErrorAccion(

                err?.response?.data?.message

                ||

                "Error al revalidar el análisis"
            );

        } finally {

            setRevalidando(false);
        }
    };

    const handleCrearMarca = async (
        nombre: string
    ) => {

        await crearMarca({ nombre });

        onCatalogosActualizados();

        setCreacionActiva(null);

        await revalidar(analisis);
    };

    const handleCrearModelo = async (
        data: { nombre: string; marcaId: number }
    ) => {

        await crearModelo(data);

        onCatalogosActualizados();

        setCreacionActiva(null);

        await revalidar(analisis);
    };

    const handleCrearProveedor = async (
        data: ProveedorRequest
    ) => {

        await crearProveedor(data);

        onCatalogosActualizados();

        setCreacionActiva(null);

        await revalidar(analisis);
    };

    return (

        <>

            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
            >

                <DialogTitle>
                    Relés detectados en el remito
                </DialogTitle>

                <DialogContent>

                    {
                        revalidando && (

                            <LinearProgress sx={{ mb: 2 }} />
                        )
                    }

                    {
                        errorAccion && (

                            <Alert
                                severity="error"
                                sx={{ mb: 2 }}
                                onClose={() => setErrorAccion("")}
                            >
                                {errorAccion}
                            </Alert>
                        )
                    }

                    <Stack
                        spacing={1}
                        sx={{ mb: 2 }}
                    >

                        {
                            analisis.numeroRemito && (

                                <Typography variant="body2">
                                    Remito detectado:
                                    {" "}
                                    {analisis.numeroRemito}
                                </Typography>
                            )
                        }

                        <Alert
                            severity={
                                analisis.proveedor
                                    ? (
                                        analisis.proveedorEncontrado
                                            ? "success"
                                            : "warning"
                                    )
                                    : "info"
                            }
                            action={
                                analisis.proveedor
                                &&
                                !analisis.proveedorEncontrado ? (

                                    <Button
                                        color="inherit"
                                        size="small"
                                        onClick={() =>
                                            setCreacionActiva({
                                                tipo: "proveedor",
                                                nombreSugerido:
                                                    analisis.proveedor ?? ""
                                            })
                                        }
                                    >
                                        Crear proveedor
                                    </Button>

                                ) : undefined
                            }
                        >

                            {
                                analisis.proveedor
                                    ? (
                                        analisis.proveedorEncontrado
                                            ? `Proveedor encontrado: ${analisis.proveedor}`
                                            : `Proveedor "${analisis.proveedor}" no está registrado.`
                                    )
                                    : "No se detectó proveedor en el documento."
                            }

                        </Alert>

                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1.5}
                        useFlexGap
                        sx={{ flexWrap: "wrap", mb: 2 }}
                    >

                        <StatTile
                            icono={
                                <CheckCircleIcon
                                    color={
                                        analisis.reles.length > 0
                                            ? "success"
                                            : "disabled"
                                    }
                                />
                            }
                            etiqueta="Relés detectados"
                            valor={analisis.reles.length}
                        />

                        <StatTile
                            icono={
                                <InfoOutlinedIcon color="info" />
                            }
                            etiqueta="Accesorios ignorados"
                            valor={analisis.cantidadAccesoriosIgnorados}
                        />

                        <StatTile
                            icono={
                                <WarningAmberIcon
                                    color={
                                        analisis.cantidadModelosNuevos > 0
                                            ? "warning"
                                            : "disabled"
                                    }
                                />
                            }
                            etiqueta="Modelos nuevos"
                            valor={analisis.cantidadModelosNuevos}
                        />

                        <StatTile
                            icono={
                                <ErrorOutlineIcon
                                    color={
                                        analisis.cantidadConError > 0
                                            ? "error"
                                            : "disabled"
                                    }
                                />
                            }
                            etiqueta="Errores"
                            valor={analisis.cantidadConError}
                        />

                    </Stack>

                    {
                        analisis.accesoriosIgnorados.length > 0 && (

                            <Box
                                sx={{
                                    mb: 2,
                                    p: 1.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    maxHeight: 120,
                                    overflowY: "auto"
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mb: 0.5 }}
                                >
                                    Productos detectados que no son relés (no se importan):
                                </Typography>

                                <Typography variant="body2">
                                    {
                                        analisis.accesoriosIgnorados.join(" · ")
                                    }
                                </Typography>

                            </Box>
                        )
                    }

                    <Table size="small">

                        <TableHead>

                            <TableRow>

                                <TableCell>Serie</TableCell>

                                <TableCell>Modelo</TableCell>

                                <TableCell>Marca</TableCell>

                                <TableCell>Cód. Configuración</TableCell>

                                <TableCell>Estado</TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {
                                analisis.reles.map(
                                    (rele, index) => (

                                        <TableRow key={index}>

                                            <TableCell>
                                                {rele.numeroSerie ?? "—"}
                                            </TableCell>

                                            <TableCell>
                                                {rele.modelo ?? "—"}
                                            </TableCell>

                                            <TableCell>
                                                {rele.marca ?? "—"}
                                            </TableCell>

                                            <TableCell>
                                                <Tooltip title={rele.codigoConfiguracion ?? ""}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: 180,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {rele.codigoConfiguracion ?? "—"}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell>

                                                <Stack spacing={0.5}>

                                                    {
                                                        rele.validaciones.map(
                                                            (validacion, i) => (

                                                                <Box
                                                                    key={i}
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 0.5
                                                                    }}
                                                                >

                                                                    {
                                                                        iconoSeveridad(
                                                                            validacion.severidad
                                                                        )
                                                                    }

                                                                    <Typography
                                                                        variant="caption"
                                                                    >
                                                                        {validacion.mensaje}
                                                                    </Typography>

                                                                </Box>
                                                            )
                                                        )
                                                    }

                                                    {
                                                        (!rele.marcaId || !rele.modeloId) && (

                                                            <Stack
                                                                direction="row"
                                                                spacing={1}
                                                                sx={{ mt: 0.5 }}
                                                            >

                                                                {
                                                                    !rele.marcaId && (

                                                                        <Button
                                                                            size="small"
                                                                            onClick={() =>
                                                                                setCreacionActiva({
                                                                                    tipo: "marca",
                                                                                    nombreSugerido:
                                                                                        rele.marca ?? ""
                                                                                })
                                                                            }
                                                                        >
                                                                            Crear marca
                                                                        </Button>
                                                                    )
                                                                }

                                                                {
                                                                    !rele.modeloId && (

                                                                        <Button
                                                                            size="small"
                                                                            onClick={() =>
                                                                                setCreacionActiva({
                                                                                    tipo: "modelo",
                                                                                    nombreSugerido:
                                                                                        rele.modelo ?? "",
                                                                                    marcaId:
                                                                                        rele.marcaId
                                                                                })
                                                                            }
                                                                        >
                                                                            Crear modelo
                                                                        </Button>
                                                                    )
                                                                }

                                                            </Stack>
                                                        )
                                                    }

                                                </Stack>

                                            </TableCell>

                                        </TableRow>
                                    )
                                )
                            }

                        </TableBody>

                    </Table>

                    {
                        analisis.reles.length === 0 && (

                            <Alert
                                severity="warning"
                                sx={{ mt: 2 }}
                            >
                                No se detectó ningún relé en el documento.
                            </Alert>
                        )
                    }

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={onClose}
                        color="inherit"
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        disabled={
                            !analisis.todosValidos
                            ||
                            creando
                            ||
                            revalidando
                            ||
                            analisis.reles.length === 0
                        }
                        onClick={onConfirmar}
                    >

                        {
                            creando
                                ? "Creando..."
                                : "Crear todos los relés"
                        }

                    </Button>

                </DialogActions>

            </Dialog>

            <Dialog
                open={creacionActiva?.tipo === "marca"}
                onClose={() => setCreacionActiva(null)}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>Crear marca</DialogTitle>

                <DialogContent>

                    {
                        creacionActiva?.tipo === "marca" && (

                            <MarcaForm
                                nombreSugerido={creacionActiva.nombreSugerido}
                                onSubmit={handleCrearMarca}
                                cancelarEdicion={() => setCreacionActiva(null)}
                            />
                        )
                    }

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setCreacionActiva(null)}>
                        Cerrar
                    </Button>

                </DialogActions>

            </Dialog>

            <Dialog
                open={creacionActiva?.tipo === "modelo"}
                onClose={() => setCreacionActiva(null)}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>Crear modelo</DialogTitle>

                <DialogContent>

                    {
                        creacionActiva?.tipo === "modelo" && (

                            <ModeloForm
                                marcas={marcas}
                                nombreSugerido={creacionActiva.nombreSugerido}
                                marcaPreseleccionada={
                                    creacionActiva.marcaId ?? undefined
                                }
                                bloquearMarca={
                                    Boolean(creacionActiva.marcaId)
                                }
                                onSubmit={handleCrearModelo}
                                cancelarEdicion={() => setCreacionActiva(null)}
                            />
                        )
                    }

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setCreacionActiva(null)}>
                        Cerrar
                    </Button>

                </DialogActions>

            </Dialog>

            <Dialog
                open={creacionActiva?.tipo === "proveedor"}
                onClose={() => setCreacionActiva(null)}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle>Crear proveedor</DialogTitle>

                <DialogContent>

                    {
                        creacionActiva?.tipo === "proveedor" && (

                            <ProveedorForm
                                nombreSugerido={creacionActiva.nombreSugerido}
                                onSubmit={handleCrearProveedor}
                                cancelarEdicion={() => setCreacionActiva(null)}
                            />
                        )
                    }

                </DialogContent>

                <DialogActions>

                    <Button onClick={() => setCreacionActiva(null)}>
                        Cerrar
                    </Button>

                </DialogActions>

            </Dialog>

        </>
    );
}

export default CargaInteligenteRemitoDialog;
