"use client"

// ✅ Componente de alertas simple
import { useAuth } from "../context/AuthContext"

const Alert = ({ alert, onClose }) => {
  const getAlertClass = (type) => {
    switch (type) {
      case "success":
        return "alert-success"
      case "error":
        return "alert-error"
      case "warning":
        return "alert-warning"
      default:
        return "alert-info"
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✓"
      case "error":
        return "✕"
      case "warning":
        return "⚠"
      default:
        return "ℹ"
    }
  }

  return (
    <div className={`alert ${getAlertClass(alert.type)}`}>
      <span className="alert-icon">{getIcon(alert.type)}</span>
      <span className="alert-message">{alert.message}</span>
      <button className="alert-close" onClick={() => onClose(alert.id)}>
        ×
      </button>
    </div>
  )
}

const AlertContainer = () => {
  const { alerts, removeAlert } = useAuth()

  if (alerts.length === 0) return null

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} onClose={removeAlert} />
      ))}
    </div>
  )
}

export default AlertContainer
