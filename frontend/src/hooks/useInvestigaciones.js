import { useState } from "react"
import investigacionService from "../services/investigacionService"
import { useAuth } from "../context/AuthContext"

export const useInvestigaciones = () => {
  const [investigaciones, setInvestigaciones] = useState([])
  const [loading, setLoading] = useState(false)
  const { showAlert } = useAuth()

  const fetchInvestigaciones = async (filters = {}) => {
    try {
      setLoading(true)
      const response = await investigacionService.getInvestigaciones(filters)
      setInvestigaciones(response.data || [])
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const getInvestigacion = async (id) => {
    try {
      setLoading(true)
      const response = await investigacionService.getInvestigacion(id)
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const createInvestigacion = async (investigacionData, file) => {
    try {
      setLoading(true)
      const response = await investigacionService.createInvestigacion(investigacionData, file)

      setInvestigaciones((prev) => [response.data, ...prev])
      showAlert("Investigación creada exitosamente", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateInvestigacion = async (id, updateData) => {
    try {
      setLoading(true)
      const response = await investigacionService.updateInvestigacion(id, updateData)

      setInvestigaciones((prev) => prev.map((inv) => (inv.id === id ? response.data : inv)))
      showAlert("Investigación actualizada exitosamente", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteInvestigacion = async (id) => {
    try {
      setLoading(true)
      await investigacionService.deleteInvestigacion(id)

      setInvestigaciones((prev) => prev.filter((inv) => inv.id !== id))
      showAlert("Investigación eliminada exitosamente", "success")
      return { success: true }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const downloadArchivo = async (id, fileName) => {
    try {
      await investigacionService.downloadArchivo(id, fileName)
      showAlert("Archivo descargado exitosamente", "success")
      return { success: true }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    }
  }

  return {
    investigaciones,
    loading,
    fetchInvestigaciones,
    getInvestigacion,
    createInvestigacion,
    updateInvestigacion,
    deleteInvestigacion,
    downloadArchivo,
  }
}
