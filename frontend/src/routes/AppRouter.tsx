import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import MainLayout
from "../layouts/MainLayout";

import HomePage
from "../pages/HomePage";

import RelePage
from "../pages/RelePage";

import MovimientoPage
from "../pages/MovimientoPage";

import MarcaPage
from "../pages/admin/MarcaPage";

import ModeloPage
from "../pages/admin/ModeloPage";

import DestinoPage
from "../pages/admin/DestinoPage";

import PosicionPage
from "../pages/admin/PosicionPage";

import ProvinciaPage
from "../pages/admin/ProvinciaPage";

import LocalidadPage
from "../pages/admin/LocalidadPage";

import ProveedorPage
from "../pages/admin/ProveedorPage";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<MainLayout />}
                >

                    <Route
                        index
                        element={<HomePage />}
                    />

                    <Route
                        path="reles"
                        element={<RelePage />}
                    />

                    <Route
                        path="movimientos"
                        element={<MovimientoPage />}
                    />

                    <Route
                        path="admin/marcas"
                        element={<MarcaPage />}
                    />

                    <Route
                        path="admin/modelos"
                        element={<ModeloPage />}
                    />

                    <Route
                        path="admin/destinos"
                        element={<DestinoPage />}
                    />

                    <Route
                        path="admin/posiciones"
                        element={<PosicionPage />}
                    />

                    <Route
                        path="admin/provincias"
                        element={<ProvinciaPage />}
                    />

                    <Route
                        path="admin/localidades"
                        element={<LocalidadPage />}
                    />

                    <Route
                        path="admin/proveedores"
                        element={<ProveedorPage />}
                    />

                </Route>

                

            </Routes>

        </BrowserRouter>
    );
}

export default AppRouter;