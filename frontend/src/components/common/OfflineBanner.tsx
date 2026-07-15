import {
    Alert,
    Box
} from "@mui/material";

import WifiOffIcon
from "@mui/icons-material/WifiOff";

import { useOnlineStatus }
from "../../hooks/useOnlineStatus";

function OfflineBanner() {

    const enLinea = useOnlineStatus();

    if (enLinea) {

        return null;
    }

    return (

        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: (theme) => theme.zIndex.drawer + 10
            }}
        >

            <Alert
                severity="warning"
                icon={<WifiOffIcon fontSize="inherit" />}
                sx={{
                    borderRadius: 0,
                    justifyContent: "center",
                    "& .MuiAlert-message": {
                        textAlign: "center",
                        width: "100%"
                    }
                }}
            >
                Sin conexión a internet. Los cambios no se van a guardar
                hasta que vuelva la conexión — no cierres esta pantalla.
            </Alert>

        </Box>
    );
}

export default OfflineBanner;
