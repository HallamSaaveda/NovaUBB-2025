import { useState } from "react"
import proyectoTituloService from "../services/proyectoTituloService"
import { useAuth } from "../context/AuthContext"

export const useProyectosTitulo = () => {
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(false)
  const { showAlert } = useAuth()

  const fetchProyectosTitulo = async (filters = {}) => {
    try {
      setLoading(true)
      const response = await proyectoTituloService.getProyectosTitulo(filters)
      setProyectos(response.data || [])
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const getProyectoTitulo = async (id) => {
    try {
      setLoading(true)
      const response = await proyectoTituloService.getProyectoTitulo(id)
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const createProyectoTitulo = async (proyectoData, file) => {
    try {
      setLoading(true)
      const response = await proyectoTituloService.createProyectoTitulo(proyectoData, file)

      setProyectos((prev) => [response.data, ...prev])
      showAlert("Proyecto de título creado exitosamente", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateProyectoTitulo = async (id, updateData) => {
    try {
      setLoading(true)
      const response = await proyectoTituloService.updateProyectoTitulo(id, updateData)

      setProyectos((prev) => prev.map((proyecto) => (proyecto.id === id ? response.data : proyecto)))
      showAlert("Proyecto de título actualizado exitosamente", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteProyectoTitulo = async (id) => {
    try {
      setLoading(true)
      await proyectoTituloService.deleteProyectoTitulo(id)

      setProyectos((prev) => prev.filter((proyecto) => proyecto.id !== id))
      showAlert("Proyecto de título eliminado exitosamente", "success")
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
      await proyectoTituloService.downloadArchivo(id, fileName)
      showAlert("Archivo descargado exitosamente", "success")
      return { success: true }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    }
  }

  return {
    proyectos,
    loading,
    fetchProyectosTitulo,
    getProyectoTitulo,
    createProyectoTitulo,
    updateProyectoTitulo,
    deleteProyectoTitulo,
    downloadArchivo,
  }
}
