export const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha"

  try {
    const date = new Date(dateString)

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "Fecha inválida"
    }

    // Formatear la fecha en español
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Error en fecha"
  }
}

export const formatDateTime = (dateString) => {
  if (!dateString) return "Sin fecha"

  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return "Fecha inválida"
    }

    return date.toLocaleString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting datetime:", error)
    return "Error en fecha"
  }
}
