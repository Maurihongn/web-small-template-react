import axios, { type InternalAxiosRequestConfig } from "axios";
// Importa tu store directamente. Al estar fuera de un componente React,
// usaremos .getState() para acceder a los datos.
// import { useAuthStore } from "@/zustand/authStore";
// Asegúrate de ajustar el path a tu store ^

// 1. Constantes
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// 2. Definición de instancias
export const api = axios.create({
  baseURL: BASE_URL + "/api",
  paramsSerializer: { indexes: null }, // Ojo: verifica si tu backend necesita esto así
  withCredentials: true,
});



// 3. Función auxiliar para inyectar token
// Tipamos 'config' para tener autocompletado y seguridad
const authInterceptor = (config: InternalAxiosRequestConfig) => {
  // 🧠 Tech Lead Tip: Intenta leer del Store primero (Memoria), es más rápido que localStorage (Disco/IO)
  // Pero mantenemos tu lógica de localStorage por seguridad si el store se limpia al recargar.
  const tokenStr = localStorage.getItem("auth");
  const token = tokenStr ? JSON.parse(tokenStr) : null;

  config.headers = config.headers || {};

  // Headers fijos
  config.headers["accept"] = "*/*";

  // Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Axios detecta FormData automáticamente y pone el Content-Type correcto.
  // Forzarlo manualmente a veces rompe el "boundary" del multipart.
  // Solo lo seteamos si NO es FormData.
  if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
};

// 4. REGISTRO DE INTERCEPTORES (Se ejecuta al importar el archivo)
// Ya no necesitas un componente <AxiosInterceptor />. Esto corre una sola vez.

api.interceptors.request.use(authInterceptor);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Manejo de 401
    if (error.response?.status === 401) {
      // Usamos getState() para ejecutar la acción fuera de React
      // useAuthStore.getState().logout();

      // Aquí iría tu lógica de Refresh Token si decides descomentarla
    }
    return Promise.reject(error);
  }
);
