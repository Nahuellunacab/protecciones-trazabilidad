import { Navigate, useLocation } from "react-router-dom";

import type { ReactNode } from "react";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute(
    { children, soloAdmin }: { children: ReactNode; soloAdmin?: boolean }
) {

    const { token, isAdmin } =
        useAuth();

    const location =
        useLocation();

    if (!token) {

        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (soloAdmin && !isAdmin) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <>{children}</>;
}

export default ProtectedRoute;
