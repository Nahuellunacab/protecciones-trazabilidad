import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container
} from "@mui/material";

import {
    Link,
    Outlet
} from "react-router-dom";

function MainLayout() {

    return (

        <div>

            <AppBar position="static">

                <Toolbar>

                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1 }}
                    >
                        Protecciones
                    </Typography>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                    >
                        Inicio
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/reles"
                    >
                        Relés
                    </Button>

                </Toolbar>

            </AppBar>

            <Container sx={{ mt: 4 }}>

                <Outlet />

            </Container>

        </div>
    );
}

export default MainLayout;