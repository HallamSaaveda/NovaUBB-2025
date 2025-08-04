import { useState, useCallback } from "react"

export const useAlert = () => {
  const [alerts, setAlerts] = useState([])

  const showAlert = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random()
    const alert = { id, message, type }

    setAlerts((prev) => [...prev, alert])

    // Auto-remove después del tiempo especificado
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    }, duration)

    return id
  }, [])

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  return {
    alerts,
    showAlert,
    removeAlert,
    clearAlerts,
  }
}
