import axiosInstance from "./root.service.js"

export const predecirEstructuraService = {
  async ejecutarAlineamiento(data) {
    try {
      const response = await axiosInstance.post("/prediccion-estructura", data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.details || "Error al ejecutar el alineamiento")
    }
  }
} 