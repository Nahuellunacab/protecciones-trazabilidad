import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import RelePage from "../pages/RelePage";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<MainLayout />}>

                    <Route
                        index
                        element={<HomePage />}
                    />

                    <Route
                        path="reles"
                        element={<RelePage />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRouter;