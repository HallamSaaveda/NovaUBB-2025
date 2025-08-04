import jwt from "jsonwebtoken"
import { AppDataSource } from "../config/configDB.js"
import User from "../models/user.model.js"
import { handleErrorClient } from "../handlers/responseHandlers.js"

// ✅ Solo una clave secreta
const JWT_SECRET = process.env.ACCESS_JWT_SECRET || "your-secret-key"

export async function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return handleErrorClient(res, 401, "Token de acceso requerido")
    }

    // ✅ Verificar con la misma clave secreta
    const decoded = jwt.verify(token, JWT_SECRET)
    const userRepository = AppDataSource.getRepository(User)

    const user = await userRepository.findOne({
      where: { id: decoded.id },
    })

    if (!user) {
      return handleErrorClient(res, 401, "Usuario no válido")
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return handleErrorClient(res, 401, "Token expirado")
    }
    return handleErrorClient(res, 403, "Token inválido")
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET)
      const userRepository = AppDataSource.getRepository(User)

      const user = await userRepository.findOne({
        where: { id: decoded.id },
      })

      if (user) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Si hay error en el token opcional, continúa sin usuario
    next()
  }
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return handleErrorClient(res, 401, "Autenticación requerida")
    }

    if (!roles.includes(req.user.role)) {
      return handleErrorClient(res, 403, "No tienes permisos para esta acción")
    }

    next()
  }
}
