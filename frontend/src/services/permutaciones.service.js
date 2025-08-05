import axiosInstance from "./root.service.js"

export const permutacionesService = {
  async generarPermutaciones(data) {
    try {
      const response = await axiosInstance.post("/permutaciones", data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al generar permutaciones")
    }
  }
} 