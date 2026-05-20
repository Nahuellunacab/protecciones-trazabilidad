import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        primary: {
            main: "#00695C"
        },

        secondary: {
            main: "#004D40"
        },

        background: {
            default: "#F4F6F8",
            paper: "#FFFFFF"
        }
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

export default theme;