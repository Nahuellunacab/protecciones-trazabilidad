import {
  describe,
  it,
  expect,
  beforeEach
} from "vitest";

import {
  guardarSesion,
  obtenerToken,
  obtenerUsuarioGuardado,
  limpiarSesion
} from "./authStorage";

import type { Usuario } from "../types/Usuario";

const USUARIO: Usuario = {
  id: 1,
  nombre: "Ana",
  apellido: "Perez",
  email: "ana@epec.com",
  numeroSobre: "1234",
  rol: "OPERADOR",
  activo: true
};

describe("authStorage", () => {

  beforeEach(() => {

    localStorage.clear();
  });

  it("no devuelve token ni usuario cuando no hay sesión guardada", () => {

    expect(obtenerToken()).toBeNull();
    expect(obtenerUsuarioGuardado()).toBeNull();
  });

  it("guarda y recupera el token y el usuario de la sesión", () => {

    guardarSesion("token-de-prueba", USUARIO);

    expect(obtenerToken()).toBe("token-de-prueba");
    expect(obtenerUsuarioGuardado()).toEqual(USUARIO);
  });

  it("limpiarSesion borra tanto el token como el usuario", () => {

    guardarSesion("token-de-prueba", USUARIO);

    limpiarSesion();

    expect(obtenerToken()).toBeNull();
    expect(obtenerUsuarioGuardado()).toBeNull();
  });

  it("devuelve null si el usuario guardado no es un JSON válido", () => {

    localStorage.setItem(
      "protecciones-auth-usuario",
      "esto-no-es-json"
    );

    expect(obtenerUsuarioGuardado()).toBeNull();
  });
});
