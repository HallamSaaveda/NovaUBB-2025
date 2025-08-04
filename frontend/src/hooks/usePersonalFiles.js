"use client"

import { useState } from "react"
import personalFileService from "../services/personalFileService"
import { useAuth } from "../context/AuthContext"

export const usePersonalFiles = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const { showAlert } = useAuth()

  const fetchFiles = async (filters = {}) => {
    try {
      setLoading(true)
      const response = await personalFileService.getFiles(filters)
      setFiles(response.data || [])
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file, fileData) => {
    try {
      setLoading(true)
      const response = await personalFileService.uploadFile(file, fileData)

      setFiles((prev) => [response.data, ...prev])

      showAlert("Archivo subido exitosamente", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateFile = async (fileId, updateData) => {
    try {
      setLoading(true)
      const response = await personalFileService.updateFile(fileId, updateData)

      setFiles((prev) => prev.map((file) => (file.id === fileId ? response.data : file)))

      showAlert("Archivo actualizado exitosamente", "success")
      return { success: true, data: response.data }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteFile = async (fileId) => {
    try {
      setLoading(true)
      await personalFileService.deleteFile(fileId)

      setFiles((prev) => prev.filter((file) => file.id !== fileId))

      showAlert("Archivo eliminado exitosamente", "success")
      return { success: true }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Nueva función de descarga que usa el servicio corregido
  const downloadFile = async (fileId, fileName) => {
    try {
      setLoading(true)
      await personalFileService.downloadFile(fileId, fileName)
      showAlert("Archivo descargado exitosamente", "success")
      return { success: true }
    } catch (error) {
      showAlert(error.message, "error")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    files,
    loading,
    fetchFiles,
    uploadFile,
    updateFile,
    deleteFile,
    downloadFile,
  }
}
