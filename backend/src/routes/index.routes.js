import { Router } from "express"
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import investigacionRoutes from "./investigacion.routes.js"
import archivoPersonalRoutes from "./archivo-personal.routes.js" //
import permutacionesRoutes from "./permutaciones.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/investigaciones", investigacionRoutes)
router.use("/personal", archivoPersonalRoutes) //
router.use("/permutaciones", permutacionesRoutes)

export default router
