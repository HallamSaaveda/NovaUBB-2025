"use client"

// ✅ Hook de auth sin dependencia circular
import { useState, useEffect } from "react"
import authService from "../services/authService"

export const useAuth = (showAlert) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)

      const userData = authService.getCurrentUser()
      setUser(userData)

      if (showAlert) {
        showAlert("Login exitoso", "success")
      }
      return { success: true, data: response.data }
    } catch (error) {
      if (showAlert) {
        showAlert(error.message, "error")
      }
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)

      if (showAlert) {
        showAlert("Registro exitoso. Revisa tu correo para obtener tu contraseña temporal.", "success")
      }
      return { success: true, data: response.data }
    } catch (error) {
      if (showAlert) {
        showAlert(error.message, "error")
      }
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      if (showAlert) {
        showAlert("Sesión cerrada exitosamente", "success")
      }
    } catch (error) {
      if (showAlert) {
        showAlert("Error al cerrar sesión", "error")
      }
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
