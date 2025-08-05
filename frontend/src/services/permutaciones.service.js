import axiosInstance from "./root.service.js"

export const permutacionesService = {
  async generarPermutaciones(data) {
    try {
      const response = await axiosInstance.post("/permutaciones", data)
      return response.data
    } catch (error) {
        console.error("Error en generarPermutaciones:", error.response?.data || error.message);
      throw new Error(error.response?.data?.details || "Error al generar permutaciones")
    }
  }
} 