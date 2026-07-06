import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";

import type { ReactNode } from "react";

import type { Usuario } from "../types/Usuario";
import type { LoginRequest } from "../types/auth/LoginRequest";

import { login as loginRequest } from "../services/authService";

import {
    guardarSesion,
    limpiarSesion,
    obtenerToken,
    obtenerUsuarioGuardado
} from "../utils/authStorage";

interface AuthContextValue {

    token: string | null;

    usuario: Usuario | null;

    isAdmin: boolean;

    canWrite: boolean;

    login: (data: LoginRequest) => Promise<void>;

    logout: () => void;
}

const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined
    );

export function AuthProvider(
    { children }: { children: ReactNode }
) {

    const [token, setToken] =
        useState<string | null>(
            obtenerToken()
        );

    const [usuario, setUsuario] =
        useState<Usuario | null>(
            obtenerUsuarioGuardado()
        );

    const login = async (
        data: LoginRequest
    ) => {

        const response =
            await loginRequest(data);

        const usuarioLogueado: Usuario = {

            id: response.id,
            nombre: response.nombre,
            apellido: response.apellido,
            email: response.email,
            rol: response.rol,
            activo: true,
            numeroSobre: response.numeroSobre
        };

        guardarSesion(
            response.token,
            usuarioLogueado
        );

        setToken(response.token);
        setUsuario(usuarioLogueado);
    };

    const logout = () => {

        limpiarSesion();

        setToken(null);
        setUsuario(null);
    };

    const value = useMemo(
        () => ({

            token,
            usuario,
            isAdmin: usuario?.rol === "ADMIN",
            canWrite: usuario?.rol === "ADMIN" || usuario?.rol === "OPERADOR",
            login,
            logout
        }),
        [token, usuario]
    );

    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth debe usarse dentro de AuthProvider"
        );
    }

    return context;
}
