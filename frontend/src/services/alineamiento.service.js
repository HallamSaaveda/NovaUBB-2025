import axiosInstance from "./root.service.js"

export const alineamientoService = {
  async ejecutarAlineamiento(data) {
    try {
      const response = await axiosInstance.post("/alineamiento", data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al ejecutar el alineamiento")
    }
  }
} 