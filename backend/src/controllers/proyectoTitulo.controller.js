import {
  createProyectoTituloService,
  getProyectosTituloService,
  getProyectoTituloService,
  updateProyectoTituloService,
  deleteProyectoTituloService,
  downloadArchivoProyectoTituloService,
} from "../services/proyectoTitulo.service.js"
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js"
import { proyectoTituloValidation, updateProyectoTituloValidation } from "../validations/proyectoTitulo.validation.js"

export async function createProyectoTitulo(req, res) {
  try {
    // Solo profesores, admin y superadmin pueden crear proyectos de título
    if (!["profesor", "admin", "superadmin"].includes(req.user.role)) {
      return handleErrorClient(res, 403, "Solo profesores y administradores pueden crear proyectos de título")
    }

    const proyectoData = { ...req.body }
    if (proyectoData.anio && typeof proyectoData.anio === "string") {
      proyectoData.anio = Number.parseInt(proyectoData.anio)
    }

    const { error } = proyectoTituloValidation.validate(proyectoData)
    if (error) {
      return handleErrorClient(res, 400, error.message)
    }

    const [proyecto, errorProyecto] = await createProyectoTituloService(
      proyectoData,
      req.file,
      req.user.id,
    )

    if (errorProyecto) {
      return handleErrorServer(res, 500, errorProyecto)
    }

    handleSuccess(res, 201, "Proyecto de título creado exitosamente", proyecto)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

// Todos los usuarios autenticados pueden ver proyectos de título (incluyendo alumnos)
export async function getProyectosTitulo(req, res) {
  try {
    const [proyectos, errorProyectos] = await getProyectosTituloService(
      req.query,
      req.user.id,
      req.user.role,
    )

    if (errorProyectos) {
      return handleErrorServer(res, 500, errorProyectos)
    }

    handleSuccess(res, 200, "Proyectos de título obtenidos exitosamente", proyectos)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

// Todos los usuarios autenticados pueden ver proyectos individuales (incluyendo alumnos)
export async function getProyectoTitulo(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de proyecto inválido")
    }

    const [proyecto, errorProyecto] = await getProyectoTituloService(id, req.user.id, req.user.role)

    if (errorProyecto) {
      return handleErrorClient(res, 404, errorProyecto)
    }

    handleSuccess(res, 200, "Proyecto de título obtenido exitosamente", proyecto)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function updateProyectoTitulo(req, res) {
  try {
    // Solo profesores, admin y superadmin pueden actualizar proyectos
    if (!["profesor", "admin", "superadmin"].includes(req.user.role)) {
      return handleErrorClient(res, 403, "Solo profesores y administradores pueden actualizar proyectos de título")
    }

    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de proyecto inválido")
    }

    if (req.body.anio && typeof req.body.anio === "string") {
      req.body.anio = Number.parseInt(req.body.anio)
    }

    const { error } = updateProyectoTituloValidation.validate(req.body)
    if (error) {
      return handleErrorClient(res, 400, error.message)
    }

    const [proyecto, errorProyecto] = await updateProyectoTituloService(
      id,
      req.body,
      req.user.id,
      req.user.role,
    )

    if (errorProyecto) {
      return handleErrorClient(res, 403, errorProyecto)
    }

    handleSuccess(res, 200, "Proyecto de título actualizado exitosamente", proyecto)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function deleteProyectoTitulo(req, res) {
  try {
    // Solo profesores, admin y superadmin pueden eliminar proyectos
    if (!["profesor", "admin", "superadmin"].includes(req.user.role)) {
      return handleErrorClient(res, 403, "Solo profesores y administradores pueden eliminar proyectos de título")
    }

    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de proyecto inválido")
    }

    const [proyecto, errorProyecto] = await deleteProyectoTituloService(id, req.user.id, req.user.role)

    if (errorProyecto) {
      return handleErrorClient(res, 403, errorProyecto)
    }

    handleSuccess(res, 200, "Proyecto de título eliminado exitosamente", proyecto)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

// Función para descargar archivo de proyecto - acceso público para usuarios autenticados
export async function downloadArchivoProyectoTitulo(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de proyecto inválido")
    }

    const [archivo, errorArchivo] = await downloadArchivoProyectoTituloService(id, req.user.id, req.user.role)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    res.download(archivo.ruta, archivo.nombreOriginal)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}
