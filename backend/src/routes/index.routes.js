import { Router } from "express"
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import investigacionRoutes from "./investigacion.routes.js"
import archivoPersonalRoutes from "./archivo-personal.routes.js" //
import permutacionesRoutes from "./permutaciones.routes.js"
import secuenciaAlineamiento from "./aligment.routes.js"
import buscarPermutacion from "./searchPermutation.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/investigaciones", investigacionRoutes)
router.use("/personal", archivoPersonalRoutes) //
router.use("/permutaciones", permutacionesRoutes)
router.use("/alineamiento", secuenciaAlineamiento)
router.use("/buscar-permutacion", buscarPermutacion)

export default router
