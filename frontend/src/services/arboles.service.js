import axiosInstance from "./root.service.js"

export const arbolesService = {
  async generarArboles(data) {
    try {
      const response = await axiosInstance.post("/arboles", data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al generar árboles")
    }
  }
} 