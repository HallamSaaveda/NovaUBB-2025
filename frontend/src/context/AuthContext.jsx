import { createContext, useContext, useState, useEffect } from "react"
import authService from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  // Estados de autenticación
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Estados de alertas
  const [alerts, setAlerts] = useState([])

  // Función para mostrar alertas
  const showAlert = (message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random()
    const alert = { id, message, type }

    setAlerts((prev) => [...prev, alert])

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    }, duration)

    return id
  }

  // Función para remover alertas
  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    } finally {
      setLoading(false)
    }
  }

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)

      const userData = authService.getCurrentUser()
      setUser(userData)

      showAlert("Login exitoso", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)

      showAlert("Registro exitoso. Revisa tu correo para obtener tu contraseña temporal.", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      showAlert("Sesión cerrada exitosamente", "success")
    } catch (error) {
      showAlert("Error al cerrar sesión", "error")
    }
  }

  const value = {
    // Auth
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    // Alerts
    alerts,
    showAlert,
    removeAlert,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
