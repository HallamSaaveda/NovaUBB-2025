// ✅ Service para gestión de usuarios
const API_URL = "http://localhost:3000/api"

class UserService {
  async getAllUsers(params = {}) {
    try {
      const token = localStorage.getItem("token")
      const queryParams = new URLSearchParams(params).toString()
      const url = `${API_URL}/users/all${queryParams ? `?${queryParams}` : ""}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener usuarios")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async updateUser(userId, userData) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/users/detail?id=${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar usuario")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async deleteUser(userId) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/users/detail?id=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar usuario")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async changePassword(userId, newPassword) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/users/detail?id=${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar contraseña")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }
}

export default new UserService()
