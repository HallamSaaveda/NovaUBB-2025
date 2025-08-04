import { Router } from "express"
import { authenticateJWT } from "../middlewares/authentication.middleware.js"
import { upload, handleFileSizeLimit } from "../middlewares/uploadArchive.middleware.js"
import {
  uploadArchivoPersonal,
  getArchivosPersonales,
  getArchivoPersonal,
  updateArchivoPersonal,
  deleteArchivoPersonal,
  downloadArchivoPersonal,
  getCarpetasProfesor,
} from "../controllers/archivo-personal.controller.js"

const router = Router()

router.use(authenticateJWT)

// Rutas del área personal
router.post("/", upload.single("archivo"), handleFileSizeLimit, uploadArchivoPersonal)
router.get("/", getArchivosPersonales) // ?carpeta=Documentos&esFavorito=true&tags=importante
router.get("/carpetas", getCarpetasProfesor) // Obtener lista de carpetas
router.get("/:id", getArchivoPersonal)
router.get("/:id/download", downloadArchivoPersonal)
router.patch("/:id", updateArchivoPersonal)
router.delete("/:id", deleteArchivoPersonal)

export default router
