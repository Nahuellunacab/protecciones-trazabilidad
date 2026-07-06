import type { ReactNode } from "react";

import {
    Box,
    Typography
} from "@mui/material";

import InboxIcon
from "@mui/icons-material/Inbox";

interface Props {

    titulo: string;

    subtitulo?: string;

    icono?: ReactNode;
}

function EmptyState({
    titulo,
    subtitulo,
    icono
}: Props) {

    return (

        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                color: "text.secondary"
            }}
        >

            {
                icono ?? (

                    <InboxIcon
                        sx={{
                            fontSize: 48,
                            mb: 1,
                            opacity: 0.5
                        }}
                    />
                )
            }

            <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600 }}
            >

                {titulo}

            </Typography>

            {
                subtitulo && (

                    <Typography variant="body2">

                        {subtitulo}

                    </Typography>
                )
            }

        </Box>
    );
}

export default EmptyState;
