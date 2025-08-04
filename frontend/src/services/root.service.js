import axios from "axios"

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api"

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Interceptor para agregar el token a las requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor para manejar respuestas y errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró, limpiar localStorage y redirigir
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("usuario")
      window.location.href = "/auth"
    }
    return Promise.reject(error)
  },
)

export default instance
