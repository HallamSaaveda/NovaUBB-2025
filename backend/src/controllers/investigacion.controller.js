import {
  createInvestigacionService,
  getInvestigacionesService,
  getInvestigacionService,
  updateInvestigacionService,
  deleteInvestigacionService,
  downloadArchivoInvestigacionService,
} from "../services/investigacion.service.js"
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js"
import { investigacionValidation } from "../validations/investigacion.validation.js"

export async function createInvestigacion(req, res) {
  try {
    // Solo profesores, admin y superadmin pueden crear investigaciones
    if (!["profesor", "admin", "superadmin"].includes(req.user.role)) {
      return handleErrorClient(res, 403, "Solo profesores y administradores pueden crear investigaciones")
    }

    const investigacionData = { ...req.body }
    if (investigacionData.anio && typeof investigacionData.anio === "string") {
      investigacionData.anio = Number.parseInt(investigacionData.anio)
    }

    const { error } = investigacionValidation.validate(investigacionData)
    if (error) {
      return handleErrorClient(res, 400, error.message)
    }

    const [investigacion, errorInvestigacion] = await createInvestigacionService(
      investigacionData,
      req.file,
      req.user.id,
    )

    if (errorInvestigacion) {
      return handleErrorServer(res, 500, errorInvestigacion)
    }

    handleSuccess(res, 201, "Investigación creada exitosamente", investigacion)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

// Función para descargar archivo de investigación - acceso público
export async function downloadArchivoInvestigacion(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de investigación inválido")
    }

    const [archivo, errorArchivo] = await downloadArchivoInvestigacionService(id, req.user.id, req.user.role)

    if (errorArchivo) {
      return handleErrorClient(res, 404, errorArchivo)
    }

    res.download(archivo.ruta, archivo.nombreOriginal)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

// Todos los usuarios autenticados pueden ver investigaciones
export async function getInvestigaciones(req, res) {
  try {
    const [investigaciones, errorInvestigaciones] = await getInvestigacionesService(
      req.query,
      req.user.id,
      req.user.role,
    )

    if (errorInvestigaciones) {
      return handleErrorServer(res, 500, errorInvestigaciones)
    }

    handleSuccess(res, 200, "Investigaciones obtenidas exitosamente", investigaciones)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

// Todos los usuarios autenticados pueden ver investigaciones individuales
export async function getInvestigacion(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de investigación inválido")
    }

    const [investigacion, errorInvestigacion] = await getInvestigacionService(id, req.user.id, req.user.role)

    if (errorInvestigacion) {
      return handleErrorClient(res, 404, errorInvestigacion)
    }

    handleSuccess(res, 200, "Investigación obtenida exitosamente", investigacion)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function updateInvestigacion(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de investigación inválido")
    }

    if (req.body.anio && typeof req.body.anio === "string") {
      req.body.anio = Number.parseInt(req.body.anio)
    }

    const [investigacion, errorInvestigacion] = await updateInvestigacionService(
      id,
      req.body,
      req.user.id,
      req.user.role,
    )

    if (errorInvestigacion) {
      return handleErrorClient(res, 403, errorInvestigacion)
    }

    handleSuccess(res, 200, "Investigación actualizada exitosamente", investigacion)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}

export async function deleteInvestigacion(req, res) {
  try {
    const { id } = req.params

    if (!id || isNaN(Number.parseInt(id))) {
      return handleErrorClient(res, 400, "ID de investigación inválido")
    }

    const [investigacion, errorInvestigacion] = await deleteInvestigacionService(id, req.user.id, req.user.role)

    if (errorInvestigacion) {
      return handleErrorClient(res, 403, errorInvestigacion)
    }

    handleSuccess(res, 200, "Investigación eliminada exitosamente", investigacion)
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message)
  }
}
