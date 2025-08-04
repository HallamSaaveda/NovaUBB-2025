import {
  uploadArchivoPersonalService,
  getArchivosPersonalesService,
  getArchivoPersonalService,
  updateArchivoPersonalService,
  deleteArchivoPersonalService,
  downloadArchivoPersonalService,
  getCarpetasProfesorService,
} from "../services/archivo-personal.service.js"
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js"
import { archivoPersonalValidation } from "../validations/archivo-personal.validation.js"

export async function uploadArchivoPersonal(req, res) {
  try {
    console.log("=== DEBUG CONTROLLER ===")
    console.log("1. User role:", req.user.role)
    console.log("2. User ID:", req.user.id)
    console.log("3. File received:", req.file ? "YES" : "NO")
    console.log("4. Body received:", req.body)

    // Solo profesores y superadmin
    if (req.user.role !== "profesor" && req.user.role !== "superadmin") {
      return handleErrorClient(res, 403, "Solo profesores pueden subir archivos personales")
    }

    if (!req.file) {
      return handleErrorClient(res, 400, "No se ha subido ningún archivo")
    }

    console.log("5. File details:", {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    })

    const { error } = archivoPersonalValidation.validate(req.body)
    if (error) {
      return handleErrorClient(res, 400, error.message)
    }

    // ✅ Pasar los parámetros en el orden correcto
    const [archivo, errorArchivo] = await uploadArchivoPersonalService(req.file, req.body, req.user.id)

    if (errorArchivo) {
      return handleErrorServer(res, 500, errorArchivo)
    }

    handleSuccess(res, 201, "Archivo personal subido exitosamente", archivo)
  } catch (error) {
    console.error("❌ Error in controller:", error)
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function getArchivosPersonales(req, res) {
  try {
    if (req.user.role !== "profesor" && req.user.role !== "superadmin") {
      return handleErrorClient(res, 403, "Solo profesores pueden acceder a archivos personales")
    }

    const [archivos, errorArchivos] = await getArchivosPersonalesService(req.query, req.user.id)

    if (errorArchivos) {
      return handleErrorServer(res, 500, errorArchivos)
    }

    handleSuccess(res, 200, "Archivos personales obtenidos exitosamente", archivos)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function getArchivoPersonal(req, res) {
  try {
    if (req.user.role !== "profesor" && req.user.role !== "superadmin") {
      return handleErrorClient(res, 403, "Solo profesores pueden acceder a archivos personales")
    }

    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await getArchivoPersonalService(id, req.user.id)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    handleSuccess(res, 200, "Archivo personal obtenido exitosamente", archivo)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function updateArchivoPersonal(req, res) {
  try {
    if (req.user.role !== "profesor" && req.user.role !== "superadmin") {
      return handleErrorClient(res, 403, "Solo profesores pueden modificar archivos personales")
    }

    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await updateArchivoPersonalService(id, req.body, req.user.id)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    handleSuccess(res, 200, "Archivo personal actualizado exitosamente", archivo)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function deleteArchivoPersonal(req, res) {
  try {
    if (req.user.role !== "profesor" && req.user.role !== "superadmin") {
      return handleErrorClient(res, 403, "Solo profesores pueden eliminar archivos personales")
    }

    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await deleteArchivoPersonalService(id, req.user.id)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    handleSuccess(res, 200, "Archivo personal eliminado exitosamente", archivo)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function downloadArchivoPersonal(req, res) {
  try {
    if (req.user.role !== "profesor" && req.user.role !== "superadmin") {
      return handleErrorClient(res, 403, "Solo profesores pueden descargar archivos personales")
    }

    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await downloadArchivoPersonalService(id, req.user.id)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    res.download(archivo.ruta, archivo.nombreOriginal)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function getCarpetasProfesor(req, res) {
  try {
    if (req.user.role !== "profesor" && req.user.role !== "superadmin") {
      return handleErrorClient(res, 403, "Solo profesores pueden ver carpetas personales")
    }

    const [carpetas, errorCarpetas] = await getCarpetasProfesorService(req.user.id)

    if (errorCarpetas) {
      return handleErrorServer(res, 500, errorCarpetas)
    }

    handleSuccess(res, 200, "Carpetas obtenidas exitosamente", carpetas)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}
