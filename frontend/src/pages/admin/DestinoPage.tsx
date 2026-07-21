import {

    useEffect,
    useState

} from "react";

import {

    Alert,
    Box,
    Button,
    MenuItem,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography

} from "@mui/material";

import type {
    Destino
} from "../../types/Destino";

import type {
    DestinoRequest
} from "../../types/DestinoRequest";

import type {
    DestinoSimilar
} from "../../types/DestinoSimilar";

import type {
    Localidad
} from "../../types/Localidad";

import type {
    RegistroSimilar
} from "../../types/RegistroSimilar";

import {

    obtenerDestinos,
    crearDestino,
    actualizarDestino,
    eliminarDestino,
    buscarDestinosSimilares

} from "../../services/destinoService";

import {
    obtenerLocalidades
} from "../../services/localidadService";

import { extraerMensajeError }
from "../../utils/errorUtils";

import { useAuth } from "../../context/AuthContext";

import BuscadorTexto
from "../../components/common/BuscadorTexto";

import RegistrosSimilaresAlert
from "../../components/common/RegistrosSimilaresAlert";

import useDebouncedValue
from "../../hooks/useDebouncedValue";

// Debajo de esta cantidad de caracteres no vale la pena consultar
// /destinos/similares: da resultados ruidosos y consume llamadas de
// mas mientras el usuario recien empieza a escribir.
const LONGITUD_MINIMA_BUSQUEDA_SIMILARES = 3;

function mapDestinoSimilarARegistro(
    destino: DestinoSimilar
): RegistroSimilar {

    return {

        id: destino.id,

        nombre: destino.nombre,

        descripcion: `${destino.provincia} / ${destino.localidad}`,

        detalle:
            destino.cantidadReles === 1
                ? "1 relé asociado"
                : `${destino.cantidadReles} relés asociados`,

        similitud: destino.similitud
    };
}

function DestinoPage() {

    const { canWrite } = useAuth();

    const [destinos, setDestinos] =
        useState<Destino[]>([]);

    const [localidades, setLocalidades] =
        useState<Localidad[]>([]);

    const [texto, setTexto] =
        useState("");

    const [nombre, setNombre] =
        useState("");

    const [localidadId, setLocalidadId] =
        useState("");

    const [editandoId, setEditandoId] =
        useState<number | null>(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [similares, setSimilares] =
        useState<DestinoSimilar[]>([]);

    // Nombre que el usuario ya "resolvió" (usó un existente o eligió
    // crear igualmente) para no volver a mostrarle la misma alerta
    // mientras no cambie el texto del campo.
    const [nombreConfirmado, setNombreConfirmado] =
        useState("");

    const nombreDebounced =
        useDebouncedValue(nombre, 400);

    async function cargarDatos() {

        try {

            const [
                destinosData,
                localidadesData
            ] = await Promise.all([

                obtenerDestinos(),

                obtenerLocalidades()
            ]);

            setDestinos(
                destinosData
            );

            setLocalidades(
                localidadesData
            );

        } catch (err) {

            setErrorMessage(
                extraerMensajeError(
                    err,
                    "No se pudieron cargar los destinos. Intente nuevamente."
                )
            );
        }
    }

    useEffect(() => {

        cargarDatos();

    }, []);

    // Solo advierte durante el alta (no al editar, donde el destino se
    // compararía contra sí mismo). Se apaga si el usuario ya resolvió
    // este mismo texto (usó un existente o eligió "crear igualmente").
    useEffect(() => {

        const nombreTrim =
            nombreDebounced.trim();

        if (
            editandoId
            || nombreTrim.length < LONGITUD_MINIMA_BUSQUEDA_SIMILARES
            || nombreTrim.toLowerCase()
                === nombreConfirmado.trim().toLowerCase()
        ) {

            setSimilares([]);

            return;
        }

        let vigente = true;

        buscarDestinosSimilares(nombreTrim)
            .then((resultado) => {

                if (vigente) {

                    setSimilares(resultado);
                }
            })
            .catch(() => {

                if (vigente) {

                    setSimilares([]);
                }
            });

        return () => {

            vigente = false;
        };

    }, [nombreDebounced, editandoId, nombreConfirmado]);

    function handleUsarSimilar(
        registro: RegistroSimilar
    ) {

        const destino =
            similares.find(
                (item) => item.id === registro.id
            );

        if (!destino) {

            return;
        }

        setNombre(destino.nombre);

        setLocalidadId(
            String(destino.localidadId)
        );

        setNombreConfirmado(destino.nombre);

        setSimilares([]);
    }

    function handleCrearIgualmente() {

        setNombreConfirmado(nombre);

        setSimilares([]);
    }

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setErrorMessage("");

        try {

            const data:
            DestinoRequest = {

                nombre,

                localidadId:
                    Number(localidadId)
            };

            if (editandoId) {

                await actualizarDestino(

                    editandoId,
                    data
                );

            } else {

                await crearDestino(
                    data
                );
            }

            limpiarFormulario();

            cargarDatos();

        } catch (error) {

            setErrorMessage(
                extraerMensajeError(
                    error,
                    "Ocurrió un error"
                )
            );
        }
    }

    async function handleEliminar(
        id: number
    ) {

        setErrorMessage("");

        try {

            await eliminarDestino(id);

            cargarDatos();

        } catch (error) {

            setErrorMessage(
                extraerMensajeError(
                    error,
                    "Ocurrió un error"
                )
            );
        }
    }

    function handleEditar(
        destino: Destino
    ) {

        setEditandoId(
            destino.id
        );

        setNombre(
            destino.nombre
        );
    }

    function limpiarFormulario() {

        setNombre("");

        setLocalidadId("");

        setEditandoId(null);

        setNombreConfirmado("");

        setSimilares([]);
    }

    const destinosFiltrados =

        destinos.filter((destino) => {

            const textoLower =
                texto.toLowerCase();

            return (

                destino.nombre
                    .toLowerCase()
                    .includes(textoLower)

                || destino.localidad
                    .toLowerCase()
                    .includes(textoLower)

                || destino.provincia
                    .toLowerCase()
                    .includes(textoLower)
            );
        });

    return (

        <Box>

            <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 2 }}
            >
                Destinos Operativos
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 5 }}
            >
                Gestión de destinos y
                ubicaciones operativas
                utilizadas en movimientos
                y trazabilidad.
            </Typography>

            {canWrite && (

                <Paper
                    sx={{
                        p: 3,
                        mb: 4
                    }}
                >

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: "flex",
                            gap: 2
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Nombre"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(
                                    e.target.value
                                )
                            }
                        />

                        <TextField
                            select
                            fullWidth
                            label="Localidad"
                            value={localidadId}
                            onChange={(e) =>
                                setLocalidadId(
                                    e.target.value
                                )
                            }
                        >

                            {localidades.map(
                                (localidad) => (

                                    <MenuItem
                                        key={
                                            localidad.id
                                        }
                                        value={
                                            localidad.id
                                        }
                                    >

                                        {localidad.nombre}
                                        {" - "}
                                        {localidad.provincia}

                                    </MenuItem>
                                )
                            )}

                        </TextField>

                        <Button
                            type="submit"
                            variant="contained"
                        >

                            {editandoId
                                ? "GUARDAR"
                                : "CREAR"}

                        </Button>

                    </Box>

                    <RegistrosSimilaresAlert
                        registros={similares.map(
                            mapDestinoSimilarARegistro
                        )}
                        etiquetaEntidad="destinos"
                        onSeleccionar={handleUsarSimilar}
                        onCrearIgualmente={handleCrearIgualmente}
                    />

                </Paper>
            )}

            <Paper
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <BuscadorTexto
                    label="Buscar destino"
                    value={texto}
                    onChange={setTexto}
                />

            </Paper>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Nombre
                            </TableCell>

                            <TableCell>
                                Localidad
                            </TableCell>

                            <TableCell>
                                Provincia
                            </TableCell>

                            <TableCell align="right">
                                Acciones
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {destinosFiltrados.map(
                            (destino) => (

                                <TableRow
                                    key={
                                        destino.id
                                    }
                                >

                                    <TableCell>
                                        {destino.id}
                                    </TableCell>

                                    <TableCell>
                                        {destino.nombre}
                                    </TableCell>

                                    <TableCell>
                                        {destino.localidad}
                                    </TableCell>

                                    <TableCell>
                                        {destino.provincia}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                    >

                                        {canWrite && (
                                            <>

                                                <Button
                                                    size="small"
                                                    onClick={() =>
                                                        handleEditar(
                                                            destino
                                                        )
                                                    }
                                                >
                                                    EDITAR
                                                </Button>

                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        handleEliminar(
                                                            destino.id
                                                        )
                                                    }
                                                >
                                                    ELIMINAR
                                                </Button>

                                            </>
                                        )}

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            <Snackbar
                open={
                    !!errorMessage
                }
                autoHideDuration={4000}
                onClose={() =>
                    setErrorMessage("")
                }
            >

                <Alert severity="error">

                    {errorMessage}

                </Alert>

            </Snackbar>

        </Box>
    );
}

export default DestinoPage;