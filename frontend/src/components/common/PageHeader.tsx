import {
    Box,
    Typography
} from "@mui/material";

interface Props {

    title: string;

    subtitle?: string;
}

function PageHeader({
    title,
    subtitle
}: Props) {

    return (

        <Box sx={{ mb: 4 }}>

            <Typography
                variant="h4"
                sx={{ fontWeight: 'bold' }}
                gutterBottom
            >
                {title}
            </Typography>

            {subtitle && (

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    {subtitle}
                </Typography>

            )}

        </Box>
    );
}

export default PageHeader;