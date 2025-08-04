const API_URL = "http://localhost:3000/api"

class PersonalFileService {
  async uploadFile(file, fileData) {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      formData.append("archivo", file)
      if (fileData.descripcion) formData.append("descripcion", fileData.descripcion)
      if (fileData.carpeta) formData.append("carpeta", fileData.carpeta)
      if (fileData.tags) formData.append("tags", fileData.tags)
      if (fileData.esFavorito) formData.append("esFavorito", fileData.esFavorito)

      const response = await fetch(`${API_URL}/personal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al subir archivo")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async getFiles(params = {}) {
    try {
      const token = localStorage.getItem("token")
      const queryParams = new URLSearchParams(params).toString()
      const url = `${API_URL}/personal${queryParams ? `?${queryParams}` : ""}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener archivos")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async getFolders() {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/personal/carpetas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener carpetas")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async updateFile(fileId, updateData) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/personal/${fileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar archivo")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  async deleteFile(fileId) {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/personal/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar archivo")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  }

  // ✅ Función corregida para descargar archivos
  async downloadFile(fileId, fileName) {
    try {
      const token = localStorage.getItem("token")

      console.log(`Descargando archivo ${fileId} con nombre ${fileName}`)

      const response = await fetch(`${API_URL}/personal/${fileId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al descargar archivo")
      }

      // Obtener el blob del archivo
      const blob = await response.blob()

      // Crear URL temporal para la descarga
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      // Limpiar
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error("Error en downloadFile:", error)
      throw new Error(error.message || "Error de conexión")
    }
  }
}

export default new PersonalFileService()
