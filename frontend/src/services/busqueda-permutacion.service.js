import axiosInstance from "./root.service.js"

export const busquedaPermutacionService = {
  async buscarPermutacion(data) {
    try {
      const response = await axiosInstance.post("/buscar-permutacion", data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.details || "Error al buscar permutación")
    }
  }
} 