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

import ReleDetailPage
from "../pages/ReleDetailPage";

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

import RemitoPage
from "../pages/admin/RemitoPage";

import OrdenProvisionPage
from "../pages/admin/OrdenProvisionPage";

import UsuarioPage
from "../pages/admin/UsuarioPage";

import LoginPage
from "../pages/LoginPage";

import ProtectedRoute
from "./ProtectedRoute";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
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
                        path="reles/:id"
                        element={<ReleDetailPage />}
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

                    <Route
                        path="admin/remitos"
                        element={<RemitoPage />}
                    />

                    <Route
                        path="admin/ordenes-provision"
                        element={<OrdenProvisionPage />}
                    />

                    <Route
                        path="admin/usuarios"
                        element={
                            <ProtectedRoute soloAdmin>
                                <UsuarioPage />
                            </ProtectedRoute>
                        }
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRouter;