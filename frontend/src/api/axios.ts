import axios, { AxiosError } from "axios";

import {
  limpiarSesion,
  obtenerToken
} from "../utils/authStorage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

apiClient.interceptors.request.use((config) => {

  if (!navigator.onLine) {

    return Promise.reject(
      new AxiosError(
        "Sin conexión a internet",
        "ERR_OFFLINE",
        config,
        undefined,
        {
          data: {
            message:
              "Sin conexión a internet. No se pudo completar la operación — revisá tu conexión y volvé a intentarlo."
          },
          status: 0,
          statusText: "Offline",
          headers: {},
          config
        } as never
      )
    );
  }

  const token = obtenerToken();

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {

      limpiarSesion();

      if (window.location.pathname !== "/login") {

        window.location.href = "/login";
      }
    }

    if (!error.response && error.code !== "ERR_OFFLINE") {

      // La request salió a la red pero no volvió respuesta (se cortó la
      // conexión a mitad de camino): se le da el mismo mensaje claro que
      // al bloqueo preventivo de arriba, en vez del error genérico de axios.
      error.response = {
        data: {
          message:
            "Se perdió la conexión a internet antes de recibir respuesta del servidor. Verificá si la operación se guardó antes de reintentar."
        },
        status: 0,
        statusText: "Network Error",
        headers: {},
        config: error.config
      };
    }

    return Promise.reject(error);
  }
);

export default apiClient;
