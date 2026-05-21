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

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRouter;