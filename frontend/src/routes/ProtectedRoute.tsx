import { Navigate, useLocation } from "react-router-dom";

import type { ReactNode } from "react";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute(
    { children }: { children: ReactNode }
) {

    const { token } =
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

    return <>{children}</>;
}

export default ProtectedRoute;
