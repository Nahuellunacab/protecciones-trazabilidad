import { useMemo, useState } from "react";

import {
    ThemeProvider,
    CssBaseline
} from "@mui/material";

import App from "./App.tsx";

import getTheme from "./theme/theme.ts";

import { ColorModeContext } from "./theme/ColorModeContext.tsx";

const STORAGE_KEY = "protecciones-color-mode";

function obtenerModoInicial(): "light" | "dark" {

    const guardado =
        localStorage.getItem(STORAGE_KEY);

    if (guardado === "light" || guardado === "dark") {

        return guardado;
    }

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";
}

function Root() {

    const [mode, setMode] =
        useState<"light" | "dark">(
            obtenerModoInicial()
        );

    const colorMode = useMemo(
        () => ({

            mode,

            toggleColorMode: () => {

                setMode((prev) => {

                    const nuevoModo =
                        prev === "light"
                            ? "dark"
                            : "light";

                    localStorage.setItem(
                        STORAGE_KEY,
                        nuevoModo
                    );

                    return nuevoModo;
                });
            }
        }),
        [mode]
    );

    const theme = useMemo(
        () => getTheme(mode),
        [mode]
    );

    return (

        <ColorModeContext.Provider value={colorMode}>

            <ThemeProvider theme={theme}>

                <CssBaseline />

                <App />

            </ThemeProvider>

        </ColorModeContext.Provider>
    );
}

export default Root;
