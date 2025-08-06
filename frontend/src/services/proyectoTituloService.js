const API_URL = "http://localhost:3000/api"

class ProyectoTituloService {
  async getProyectosTitulo(params = {}) {
    try {
      const token = localStorage.getItem("token")
      const queryParams = new URLSearchParams(params).toString()
      const url = `${API_URL}/proyectos-titulo${queryParams ? `?${queryParams}` : ""}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener proyectos de título")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async getProyectoTitulo(id) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/proyectos-titulo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener proyecto de título")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async createProyectoTitulo(proyectoData, file) {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      formData.append("titulo", proyectoData.titulo)
      formData.append("estudiante1", proyectoData.estudiante1)
      if (proyectoData.estudiante2) formData.append("estudiante2", proyectoData.estudiante2)
      formData.append("nivelAcademico", proyectoData.nivelAcademico)
      formData.append("profesorGuia", proyectoData.profesorGuia)
      if (proyectoData.profesorCoGuia) formData.append("profesorCoGuia", proyectoData.profesorCoGuia)
      formData.append("carrera", proyectoData.carrera)
      formData.append("anio", proyectoData.anio)
      formData.append("semestre", proyectoData.semestre)
      formData.append("resumen", proyectoData.resumen)
      if (proyectoData.palabrasClave) formData.append("palabrasClave", proyectoData.palabrasClave)

      if (file) {
        formData.append("archivo", file)
      }

      const response = await fetch(`${API_URL}/proyectos-titulo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al crear proyecto de título")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async updateProyectoTitulo(id, updateData) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/proyectos-titulo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar proyecto de título")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async deleteProyectoTitulo(id) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/proyectos-titulo/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar proyecto de título")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async downloadArchivo(id, fileName) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/proyectos-titulo/${id}/download`, {
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

  // Función para obtener PDF como blob para react-pdf
  async getPdfBlob(id) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/proyectos-titulo/${id}/download`, {
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

  // Función para obtener URL del PDF para visualización
  getPdfViewUrl(id) {
    const token = localStorage.getItem("token")
    return this.getPdfBlob(id).then((blob) => {
      return URL.createObjectURL(blob)
    })
  }
}

export default new ProyectoTituloService()
