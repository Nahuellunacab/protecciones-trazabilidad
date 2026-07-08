import { useState } from "react";

import { useNavigate } from "react-router-dom";

import type { NavigateFunction } from "react-router-dom";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import {
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Alert
} from "@mui/material";

import SmartToyIcon
from "@mui/icons-material/SmartToy";

import SendIcon
from "@mui/icons-material/Send";

import PersonIcon
from "@mui/icons-material/Person";

import { consultarCopiloto }
from "../../services/copilotoService";

import { buscarRelePorSerie }
from "../../services/releService";

import type { CopilotoAccion }
from "../../types/Copiloto";

interface EntradaHistorial {

    id: number;

    autor: "usuario" | "copiloto";

    texto: string;
}

// Mapea cada modulo soportado a su ruta real (ver routes/AppRouter.tsx).
// "ADMINISTRACION" no tiene una pagina propia (es un submenu con varias
// subpaginas en MainLayout.tsx): se elige la primera como destino
// razonable, igual que hace el propio menu de navegacion.
const RUTA_POR_MODULO: Record<string, string> = {

    DASHBOARD: "/",

    RELES: "/reles",

    MOVIMIENTOS: "/movimientos",

    ADMINISTRACION: "/admin/marcas"
};

// Ejecuta una accion de navegacion/filtrado ya validada por el backend
// (whitelist en CopilotoIAService) y devuelve una descripcion corta para
// mostrar en el historial de la conversacion. El Copiloto SOLO navega y
// filtra: no hay, ni puede haber, un caso aca que elimine, de de baja,
// modifique movimientos o cree reles.
async function ejecutarAccion(
    accion: CopilotoAccion,
    navigate: NavigateFunction
): Promise<string> {

    switch (accion.accion) {

        case "FILTRAR_RELES": {

            const params =
                new URLSearchParams();

            // marca/modelo/proveedor comparten el mismo mecanismo de
            // busqueda libre (texto) en RelePage; si el copiloto manda
            // mas de uno a la vez, se prioriza marca > modelo > proveedor
            // en vez de concatenarlos (romperia la busqueda por substring).
            const textoValor =
                accion.marca
                ?? accion.modelo
                ?? accion.proveedor;

            if (textoValor) {

                params.set("texto", textoValor);
            }

            if (accion.estado) {

                params.set("estadoNombre", accion.estado);
            }

            if (accion.destino) {

                params.set("destino", accion.destino);
            }

            navigate(`/reles?${params.toString()}`);

            const criterios =
                [
                    accion.marca,
                    accion.modelo,
                    accion.estado,
                    accion.proveedor,
                    accion.destino
                ]
                    .filter(Boolean)
                    .join(", ");

            return `🔎 Filtrando relés por ${criterios || "el criterio solicitado"}.`;
        }

        case "ABRIR_RELE": {

            if (!accion.serie) {

                return "No se especificó un número de serie para abrir.";
            }

            try {

                const rele =
                    await buscarRelePorSerie(
                        accion.serie
                    );

                navigate(`/reles/${rele.id}`);

                return `📂 Abriendo el relé ${accion.serie}.`;

            } catch {

                return `No encontré ningún relé con la serie "${accion.serie}".`;
            }
        }

        case "IR_A_MODULO": {

            const ruta =
                accion.modulo
                    ? RUTA_POR_MODULO[accion.modulo]
                    : undefined;

            if (!ruta) {

                return "No pude identificar el módulo solicitado.";
            }

            navigate(ruta);

            return `➡️ Yendo al módulo ${accion.modulo}.`;
        }

        default:

            return "No reconocí esa acción.";
    }
}

// Card "Copiloto IA" del dashboard: reconoce automaticamente si el mensaje
// es una consulta sobre datos reales del sistema o un pedido de
// navegacion/filtrado, y en ese segundo caso ejecuta la accion en la
// interfaz (nunca una operacion de escritura: ver ejecutarAccion). El
// historial de conversacion es solo de la sesion actual (estado local, no
// se persiste). Cada mensaje es una llamada independiente a
// POST /api/copiloto/consultar.
function CopilotoIACard() {

    const navigate =
        useNavigate();

    const [mensaje, setMensaje] =
        useState("");

    const [historial, setHistorial] =
        useState<EntradaHistorial[]>([]);

    const [enviando, setEnviando] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleEnviar =
        async () => {

            const mensajeLimpio =
                mensaje.trim();

            if (!mensajeLimpio || enviando) {

                return;
            }

            setEnviando(true);

            setError("");

            setHistorial((prev) => [

                ...prev,

                {
                    id: Date.now(),
                    autor: "usuario",
                    texto: mensajeLimpio
                }
            ]);

            setMensaje("");

            try {

                const resultado =
                    await consultarCopiloto(
                        mensajeLimpio
                    );

                let textoRespuesta: string;

                if (
                    resultado.tipo === "ACCION"
                    &&
                    resultado.accion
                ) {

                    textoRespuesta =
                        await ejecutarAccion(
                            resultado.accion,
                            navigate
                        );

                } else {

                    textoRespuesta =
                        resultado.respuesta
                        ?? "No obtuve una respuesta.";
                }

                setHistorial((prev) => [

                    ...prev,

                    {
                        id: Date.now() + 1,
                        autor: "copiloto",
                        texto: textoRespuesta
                    }
                ]);

            } catch (err: any) {

                setError(

                    err?.response?.data?.message

                    ||

                    "No se pudo consultar al Copiloto. Intente nuevamente."
                );

            } finally {

                setEnviando(false);
            }
        };

    return (

        <Paper
            elevation={2}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: (theme) =>
                    theme.palette.mode === "dark"
                        ? "rgba(124, 214, 200, 0.25)"
                        : "rgba(0, 105, 92, 0.18)"
            }}
        >

            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderBottom: "1px solid",
                    borderColor: (theme) =>
                        theme.palette.mode === "dark"
                            ? "rgba(124, 214, 200, 0.18)"
                            : "rgba(0, 105, 92, 0.12)",
                    background: (theme) =>
                        theme.palette.mode === "dark"
                            ? "linear-gradient(135deg, rgba(0,105,92,0.20), rgba(0,105,92,0.04))"
                            : "linear-gradient(135deg, rgba(0,105,92,0.10), rgba(0,105,92,0.02))"
                }}
            >

                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        bgcolor: "primary.main",
                        color: "primary.contrastText"
                    }}
                >
                    <SmartToyIcon fontSize="small" />
                </Box>

                <Box>

                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, lineHeight: 1.2 }}
                    >
                        Copiloto IA
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                    >
                        Preguntá o pedile que navegue/filtre por vos
                    </Typography>

                </Box>

            </Box>

            <Box sx={{ p: 3 }}>

                {
                    error && (

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                            onClose={() => setError("")}
                        >
                            {error}
                        </Alert>
                    )
                }

                <Stack
                    direction="row"
                    spacing={1.5}
                >

                    <TextField
                        fullWidth
                        size="small"
                        placeholder='Ej: "mostrame los ABB" o "¿cuántos están en garantía?"'
                        value={mensaje}
                        disabled={enviando}
                        onChange={(e) =>
                            setMensaje(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                e.preventDefault();

                                handleEnviar();
                            }
                        }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleEnviar}
                        disabled={
                            enviando
                            ||
                            !mensaje.trim()
                        }
                        startIcon={
                            enviando ? (
                                <CircularProgress
                                    size={16}
                                    color="inherit"
                                />
                            ) : (
                                <SendIcon />
                            )
                        }
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Enviar
                    </Button>

                </Stack>

                {
                    historial.length === 0 ? (

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 2 }}
                        >
                            Ejemplos: "¿Qué proveedor tiene más relés?" ·
                            "Mostrame los ABB" · "Abrí el relé
                            &lt;número de serie&gt;" · "Andá al módulo
                            Movimientos"
                        </Typography>

                    ) : (

                        <Stack
                            spacing={1.5}
                            sx={{
                                mt: 3,
                                maxHeight: 460,
                                overflowY: "auto",
                                pr: 0.5
                            }}
                        >

                            {
                                historial.map((entrada) => (

                                    <Box
                                        key={entrada.id}
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                entrada.autor === "usuario"
                                                    ? "flex-end"
                                                    : "flex-start"
                                        }}
                                    >

                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 1.5,
                                                maxWidth: "85%",
                                                borderRadius: 2,
                                                bgcolor:
                                                    entrada.autor === "usuario"
                                                        ? (theme) =>
                                                            theme.palette.mode === "dark"
                                                                ? "rgba(0,105,92,0.20)"
                                                                : "rgba(0,105,92,0.08)"
                                                        : "background.default"
                                            }}
                                        >

                                            <Stack
                                                direction="row"
                                                spacing={0.75}
                                                sx={{
                                                    alignItems: "center",
                                                    mb: 0.5
                                                }}
                                            >

                                                {
                                                    entrada.autor === "usuario" ? (
                                                        <PersonIcon
                                                            sx={{ fontSize: 15 }}
                                                            color="action"
                                                        />
                                                    ) : (
                                                        <SmartToyIcon
                                                            sx={{ fontSize: 15 }}
                                                            color="primary"
                                                        />
                                                    )
                                                }

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    {
                                                        entrada.autor === "usuario"
                                                            ? "Vos"
                                                            : "Copiloto"
                                                    }
                                                </Typography>

                                            </Stack>

                                            <Box
                                                sx={{
                                                    fontSize: "0.875rem",
                                                    "& p": { m: 0, mb: 1 },
                                                    "& p:last-child": { mb: 0 },
                                                    "& ul, & ol": { pl: 3, mb: 1 },
                                                    "& li": { mb: 0.5 },
                                                    "& strong": { fontWeight: 700 },
                                                    "& table": {
                                                        borderCollapse: "collapse",
                                                        width: "100%",
                                                        my: 1
                                                    },
                                                    "& th, & td": {
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        px: 1,
                                                        py: 0.5,
                                                        fontSize: "0.8rem"
                                                    },
                                                    "& th": {
                                                        fontWeight: 700,
                                                        bgcolor: "action.hover"
                                                    }
                                                }}
                                            >
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {entrada.texto}
                                                </ReactMarkdown>
                                            </Box>

                                        </Paper>

                                    </Box>
                                ))
                            }

                        </Stack>
                    )
                }

            </Box>

        </Paper>
    );
}

export default CopilotoIACard;
