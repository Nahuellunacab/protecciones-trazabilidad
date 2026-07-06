import { createTheme, type PaletteMode } from "@mui/material/styles";

const getTheme = (mode: PaletteMode) =>
    createTheme({

        palette: {

            mode,

            primary: {
                main: "#00695C"
            },

            secondary: {
                main: "#004D40"
            },

            ...(mode === "light"
                ? {
                    background: {
                        default: "#F4F6F8",
                        paper: "#FFFFFF"
                    }
                }
                : {
                    background: {
                        default: "#121212",
                        paper: "#1E1E1E"
                    }
                })
        },

        typography: {

            fontFamily:
                "'Roboto', 'Helvetica', 'Arial', sans-serif",

            h4: {
                fontWeight: 700
            },

            h5: {
                fontWeight: 600
            },

            h6: {
                fontWeight: 600
            }
        },

        shape: {
            borderRadius: 10
        },

        components: {

            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow:
                            "0px 2px 8px rgba(0,0,0,0.15)"
                    }
                }
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 12
                    }
                }
            }
        }
    });

export default getTheme;
