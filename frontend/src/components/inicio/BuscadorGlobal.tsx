import {
    Paper,
    InputBase,
    IconButton
} from "@mui/material";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";

import type { Destino } from "../../types/Destino";

interface Props {

    destinos: Destino[];
}

function BuscadorGlobal({ destinos }: Props) {

    const navigate = useNavigate();

    const [valor, setValor] = useState("");

    const buscar = () => {

        const texto = valor.trim();

        if (!texto) return;

        const destinoEncontrado = destinos.find(
            (destino) =>
                destino.nombre.toLowerCase() === texto.toLowerCase()
        );

        if (destinoEncontrado) {

            navigate(
                `/reles?destino=${encodeURIComponent(destinoEncontrado.nombre)}`
            );

            return;
        }

        navigate(`/reles?texto=${encodeURIComponent(texto)}`);
    };

    return (

        <Paper
            id="buscador-global"
            elevation={3}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 3,
                py: 1.5,
                borderRadius: 4,
                border: 1,
                borderColor: "divider"
            }}
        >

            <SearchIcon color="primary" />

            <InputBase
                id="buscador-global-input"
                fullWidth
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        buscar();
                    }
                }}
                placeholder="Buscar por serie, código de configuración, modelo, marca o estación transformadora..."
                sx={{
                    fontSize: "1.05rem",
                    color: "text.primary"
                }}
            />

            <IconButton
                onClick={buscar}
                sx={{
                    color: "primary.contrastText",
                    backgroundColor: "primary.main",
                    "&:hover": {
                        backgroundColor: "primary.dark"
                    }
                }}
            >

                <SearchIcon />

            </IconButton>

        </Paper>
    );
}

export default BuscadorGlobal;
