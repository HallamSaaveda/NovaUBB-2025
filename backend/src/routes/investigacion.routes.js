import { Router } from "express"
import { authenticateJWT } from "../middlewares/authentication.middleware.js"
import { upload, handleFileSizeLimit } from "../middlewares/uploadArchive.middleware.js"
import {
  createInvestigacion,
  getInvestigaciones,
  getInvestigacion,
  updateInvestigacion,
  deleteInvestigacion,
  downloadArchivoInvestigacion,
} from "../controllers/investigacion.controller.js"

const router = Router()

router.use(authenticateJWT)

// Rutas simplificadas
router.post("/", upload.single("archivo"), handleFileSizeLimit, createInvestigacion)
router.get("/", getInvestigaciones)
router.get("/:id", getInvestigacion)
router.get("/:id/download", downloadArchivoInvestigacion) // ✅ Nueva ruta
router.patch("/:id", updateInvestigacion)
router.delete("/:id", deleteInvestigacion)

export default router
