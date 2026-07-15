import {
    TextField,
    InputAdornment
} from "@mui/material";

import SearchIcon
from "@mui/icons-material/Search";

interface Props {

    value: string;

    onChange: (
        value: string
    ) => void;

    label: string;

    placeholder?: string;

    fullWidth?: boolean;
}

function BuscadorTexto({
    value,
    onChange,
    label,
    placeholder,
    fullWidth = true
}: Props) {

    return (

        <TextField
            fullWidth={fullWidth}
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={(e) =>
                onChange(
                    e.target.value
                )
            }
            slotProps={{
                input: {
                    startAdornment: (

                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    )
                }
            }}
        />
    );
}

export default BuscadorTexto;
