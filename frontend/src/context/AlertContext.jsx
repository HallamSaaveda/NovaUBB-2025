import { createContext, useContext } from "react"
import { useAlert as useAlertHook } from "../hooks/useAlert"

const AlertContext = createContext()

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}

export const AlertProvider = ({ children }) => {
  const alert = useAlertHook()
  return <AlertContext.Provider value={alert}>{children}</AlertContext.Provider>
}
