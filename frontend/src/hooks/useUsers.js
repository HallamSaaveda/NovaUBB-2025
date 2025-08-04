"use client"

// ✅ Hook para gestión de usuarios
import { useState } from "react"
import userService from "../services/userService"
import { useAuth } from "../context/AuthContext"

export const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const { showAlert } = useAuth()

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true)
      const response = await userService.getAllUsers(params)

      // ✅ Debug: Ver la respuesta completa
      console.log("Respuesta del servidor:", response)
      console.log("Usuarios recibidos:", response.data?.users)

      setUsers(response.data.users || [])
      setPagination(response.data.pagination)
      return { success: true, data: response.data }
    } catch (error) {
      console.error("Error fetching users:", error)
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId, userData) => {
    try {
      setLoading(true)
      const response = await userService.updateUser(userId, userData)

      // Actualizar usuario en la lista local
      setUsers((prev) => prev.map((user) => (user.id === userId ? response.data : user)))

      showAlert("Usuario actualizado exitosamente", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (userId) => {
    try {
      setLoading(true)
      await userService.deleteUser(userId)

      // Remover usuario de la lista local
      setUsers((prev) => prev.filter((user) => user.id !== userId))

      showAlert("Usuario eliminado exitosamente", "success")
      return { success: true }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (userId, newPassword) => {
    try {
      setLoading(true)
      await userService.changePassword(userId, newPassword)

      showAlert("Contraseña cambiada exitosamente", "success")
      return { success: true }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    users,
    loading,
    pagination,
    fetchUsers,
    updateUser,
    deleteUser,
    changePassword,
  }
}
