const API_URL = "http://localhost:3000/api"

class InvestigacionService {
  async getInvestigaciones(params = {}) {
    try {
      const token = localStorage.getItem("token")
      const queryParams = new URLSearchParams(params).toString()
      const url = `${API_URL}/investigaciones${queryParams ? `?${queryParams}` : ""}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener investigaciones")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async getInvestigacion(id) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/investigaciones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener investigación")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async createInvestigacion(investigacionData, file) {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      formData.append("titulo", investigacionData.titulo)
      formData.append("autor", investigacionData.autor)
      if (investigacionData.coAutor) formData.append("coAutor", investigacionData.coAutor)
      formData.append("anio", investigacionData.anio)
      formData.append("descripcion", investigacionData.descripcion)

      if (file) {
        formData.append("archivo", file)
      }

      const response = await fetch(`${API_URL}/investigaciones`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al crear investigación")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async updateInvestigacion(id, updateData) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/investigaciones/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar investigación")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async deleteInvestigacion(id) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/investigaciones/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar investigación")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async downloadArchivo(id, fileName) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/investigaciones/${id}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al descargar archivo")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  // ✅ Nueva función para obtener PDF como blob para react-pdf
  async getPdfBlob(id) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/investigaciones/${id}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al obtener PDF")
      }

      const blob = await response.blob()
      return blob
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  // ✅ Función mejorada para obtener URL del PDF
  getPdfViewUrl(id) {
    const token = localStorage.getItem("token")
    // Crear una función que devuelva una promesa con el blob
    return this.getPdfBlob(id).then((blob) => {
      return URL.createObjectURL(blob)
    })
  }
}

export default new InvestigacionService()
