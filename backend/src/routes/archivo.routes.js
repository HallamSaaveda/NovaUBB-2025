import { Router } from "express"
import { authenticateJWT } from "../middlewares/authentication.middleware.js"
import { upload, handleFileSizeLimit } from "../middlewares/uploadArchive.middleware.js"
import {
  uploadArchivo,
  getArchivos,
  getArchivo,
  updateArchivo,
  deleteArchivo,
  downloadArchivo,
} from "../controllers/archivo.controller.js"

const router = Router()

// Todas las rutas requieren autenticación
router.use(authenticateJWT)

// Rutas de archivos
router.post(
  "/upload",
  upload.single("archivo"), // o upload.array("archivos", 5) para múltiples
  handleFileSizeLimit,
  uploadArchivo,
)

router.get("/", getArchivos) // GET /api/archivos?categoria=personal&cursoId=1
router.get("/:id", getArchivo) // GET /api/archivos/1
router.get("/:id/download", downloadArchivo) // GET /api/archivos/1/download
router.patch("/:id", updateArchivo) // PATCH /api/archivos/1
router.delete("/:id", deleteArchivo) // DELETE /api/archivos/1

export default router
