import { Router } from "express"
import { authenticateJWT } from "../middlewares/authentication.middleware.js"
import { verifyRole } from "../middlewares/authorization.middleware.js"
import { getAllUsers, getUsers, getUser, updateUser, deleteUser } from "../controllers/user.controller.js"

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticateJWT)

// Rutas de usuarios
router.get("/all", verifyRole(["admin", "superadmin"]), getAllUsers) // ✅ Nueva ruta
router.get("/", verifyRole(["admin", "superadmin"]), getUsers) // GET /api/users
router.get("/detail", getUser) // GET /api/users/detail?id=1 o ?email=user@example.com
router.patch("/detail", updateUser) // PATCH /api/users/detail?id=1
router.delete("/detail", verifyRole(["admin", "superadmin"]), deleteUser) // DELETE /api/users/detail?id=1

export default router
