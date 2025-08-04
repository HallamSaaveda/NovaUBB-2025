import { Router } from "express"
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import investigacionRoutes from "./investigacion.routes.js"
import archivoPersonalRoutes from "./archivo-personal.routes.js" //

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/investigaciones", investigacionRoutes)
router.use("/personal", archivoPersonalRoutes) //

export default router
