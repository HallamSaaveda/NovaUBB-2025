import {
  uploadArchivosService,
  getArchivosService,
  getArchivoService,
  updateArchivoService,
  deleteArchivoService,
  downloadArchivoService,
} from "../services/archivo.service.js"
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js"
import { archivoBodyValidation, archivoQueryValidation } from "../validations/archivo.validation.js"

export async function uploadArchivo(req, res) {
  try {
    if (!req.file && !req.files) {
      return handleErrorClient(res, 400, "No se ha subido ningún archivo")
    }

    // Validar datos del cuerpo
    const { error } = archivoBodyValidation.validate(req.body)
    if (error) {
      return handleErrorClient(res, 400, error.message)
    }

    const files = req.files || [req.file]
    const archivoData = {
      carpeta: req.body.carpeta,
      categoria: req.body.categoria,
      esPublico: req.body.esPublico === "true",
      descripcion: req.body.descripcion,
      cursoId: req.body.cursoId ? Number.parseInt(req.body.cursoId) : null,
      investigacionId: req.body.investigacionId ? Number.parseInt(req.body.investigacionId) : null,
    }

    const [archivos, errorArchivos] = await uploadArchivosService(files, archivoData, req.user.id)

    if (errorArchivos) {
      return handleErrorServer(res, 500, errorArchivos)
    }

    handleSuccess(res, 201, "Archivo(s) subido(s) exitosamente", archivos)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function getArchivos(req, res) {
  try {
    const { error } = archivoQueryValidation.validate(req.query)
    if (error) {
      return handleErrorClient(res, 400, error.message)
    }

    const [archivos, errorArchivos] = await getArchivosService(req.query, req.user.id, req.user.role)

    if (errorArchivos) {
      return handleErrorServer(res, 500, errorArchivos)
    }

    handleSuccess(res, 200, "Archivos obtenidos exitosamente", archivos)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function getArchivo(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await getArchivoService(id, req.user.id, req.user.role)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    handleSuccess(res, 200, "Archivo obtenido exitosamente", archivo)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function updateArchivo(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await updateArchivoService(id, req.body, req.user.id, req.user.role)

    if (errorArchivo) {
      return handleErrorClient(res, 403, errorArchivo)
    }

    handleSuccess(res, 200, "Archivo actualizado exitosamente", archivo)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function deleteArchivo(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await deleteArchivoService(id, req.user.id, req.user.role)

    if (errorArchivo) {
      return handleErrorClient(res, 403, errorArchivo)
    }

    handleSuccess(res, 200, "Archivo eliminado exitosamente", archivo)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function downloadArchivo(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de archivo inválido")
    }

    const [archivo, errorArchivo] = await downloadArchivoService(id, req.user.id, req.user.role)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    res.download(archivo.ruta, archivo.nombreOriginal)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}
