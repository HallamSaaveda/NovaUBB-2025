// ✅ Service para autenticación
const API_URL = "http://localhost:3000/api"

class AuthService {
  // Login
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error en el login")
      }

      // Guardar token
      if (data.data?.token) {
        localStorage.setItem("token", data.data.token)
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  // Register
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error en el registro")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  // Logout
  async logout() {
    try {
      const token = this.getToken()

      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Error en logout:", error)
    } finally {
      localStorage.removeItem("token")
    }
  }

  // Obtener token
  getToken() {
    return localStorage.getItem("token")
  }

  // Verificar si está autenticado
  isAuthenticated() {
    const token = this.getToken()
    if (!token) return false

    try {
      // Decodificar JWT básico (sin verificar firma)
      const payload = JSON.parse(atob(token.split(".")[1]))
      const now = Date.now() / 1000

      return payload.exp > now
    } catch (error) {
      return false
    }
  }

  // Obtener datos del usuario del token
  getCurrentUser() {
    const token = this.getToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      }
    } catch (error) {
      return null
    }
  }
}

export default new AuthService()
