import {
    Button,
    IconButton,
    Stack
} from "@mui/material";

import PhotoCameraIcon
from "@mui/icons-material/PhotoCamera";

const ACCEPT_PDF_O_FOTO =
    "application/pdf,image/png,image/jpeg,image/jpg,image/webp";

interface Props {

    label: string;

    labelSeleccionado: string;

    value: File | null;

    onChange: (archivo: File | null) => void;

    disabled?: boolean;

    height?: number;
}

// Botón "Subir PDF" + botón compacto de cámara, para reemplazar el patrón
// repetido de Button+input file en los formularios de Remito/Orden de
// Provisión. El botón de cámara usa capture="environment" para que en
// celular abra la cámara directo en vez del selector de archivos genérico;
// en desktop el atributo se ignora sin romper nada.
function SelectorArchivoAdjunto({
    label,
    labelSeleccionado,
    value,
    onChange,
    disabled,
    height
}: Props) {

    return (

        <Stack
            direction="row"
            spacing={1}
        >

            <Button
                variant="outlined"
                component="label"
                fullWidth
                disabled={disabled}
                sx={height ? { height } : undefined}
            >

                {
                    value
                        ? labelSeleccionado
                        : label
                }

                <input
                    hidden
                    type="file"
                    accept={ACCEPT_PDF_O_FOTO}
                    onChange={(e) =>
                        onChange(
                            e.target.files?.[0]
                            ?? null
                        )
                    }
                />

            </Button>

            <IconButton
                component="label"
                color="primary"
                disabled={disabled}
                title="Tomar foto"
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    width: height ?? 40,
                    height: height ?? 40,
                    flexShrink: 0
                }}
            >

                <PhotoCameraIcon />

                <input
                    hidden
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) =>
                        onChange(
                            e.target.files?.[0]
                            ?? null
                        )
                    }
                />

            </IconButton>

        </Stack>
    );
}

export default SelectorArchivoAdjunto;
