export function handleError(error, context) {
  console.error(`Error in ${context}:`, error)

  if (error.code === "ECONNREFUSED") {
    console.error("Database connection refused")
  } else if (error.code === "23505") {
    console.error("Duplicate key error")
  } else if (error.name === "ValidationError") {
    console.error("Validation error:", error.message)
  }

  return error
}
