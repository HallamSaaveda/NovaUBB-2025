import { Router } from "express"
import { authenticateJWT } from "../middlewares/authentication.middleware.js"
import { verifyRole } from "../middlewares/authorization.middleware.js"
import { upload, handleFileSizeLimit } from "../middlewares/uploadArchive.middleware.js"
import {
  createProyectoTitulo,
  getProyectosTitulo,
  getProyectoTitulo,
  updateProyectoTitulo,
  deleteProyectoTitulo,
  downloadArchivoProyectoTitulo,
} from "../controllers/proyectoTitulo.controller.js"

const router = Router()

router.use(authenticateJWT)
// Solo profesores, admin y superadmin pueden crear proyectos
router.post("/", verifyRole(["profesor", "admin", "superadmin"]), upload.single("archivo"), handleFileSizeLimit, createProyectoTitulo)
// Todos los usuarios autenticados pueden ver proyectos (incluyendo alumnos)
router.get("/", getProyectosTitulo)
// Todos los usuarios autenticados pueden ver proyectos individuales (incluyendo alumnos)
router.get("/:id", getProyectoTitulo)
// Todos los usuarios autenticados pueden descargar archivos (incluyendo alumnos)
router.get("/:id/download", downloadArchivoProyectoTitulo)
// Solo profesores, admin y superadmin pueden actualizar proyectos
router.patch("/:id",verifyRole(["profesor", "admin", "superadmin"]),updateProyectoTitulo)
// Solo profesores, admin y superadmin pueden eliminar proyectos
router.delete("/:id", verifyRole(["profesor", "admin", "superadmin"]),deleteProyectoTitulo)
export default router
