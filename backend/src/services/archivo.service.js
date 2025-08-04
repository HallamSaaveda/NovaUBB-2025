import Archivo from "../models/archivo.model.js"
import { AppDataSource } from "../config/configDB.js"
import { handleError } from "../handlers/errorHandler.js"
import fs from "fs"

export async function uploadArchivosService(files, archivoData, userId) {
  try {
    const archivoRepository = AppDataSource.getRepository(Archivo)
    const archivos = []

    // Manejar tanto archivo único como múltiples archivos
    const fileArray = Array.isArray(files) ? files : [files]

    for (const file of fileArray) {
      const archivo = archivoRepository.create({
        nombre: file.filename,
        nombreOriginal: file.originalname,
        ruta: file.path,
        tamaño: file.size,
        tipo: file.mimetype,
        carpeta: archivoData.carpeta || "General",
        categoria: archivoData.categoria || "personal",
        esPublico: archivoData.esPublico || false,
        descripcion: archivoData.descripcion || null,
        version: archivoData.version || null,
        autor: archivoData.autor || null,
        tags: archivoData.tags || null,
        usuarioId: userId,
        cursoId: archivoData.cursoId || null,
        investigacionId: archivoData.investigacionId || null,
      })

      const savedArchivo = await archivoRepository.save(archivo)
      archivos.push(savedArchivo)
    }

    return [archivos, null]
  } catch (error) {
    console.error("Error uploading files:", error)
    handleError(error, "archivo.service -> uploadArchivosService")
    return [null, "Error al subir archivos"]
  }
}

export async function getArchivosService(filters = {}, userId, userRole) {
  try {
    const archivoRepository = AppDataSource.getRepository(Archivo)
    const whereClause = {}

    // Filtros básicos
    if (filters.categoria) whereClause.categoria = filters.categoria
    if (filters.cursoId) whereClause.cursoId = filters.cursoId
    if (filters.investigacionId) whereClause.investigacionId = filters.investigacionId
    if (filters.carpeta) whereClause.carpeta = filters.carpeta

    // Control de acceso por rol
    if (userRole === "alumno") {
      // Alumnos solo ven archivos públicos o sus propios archivos
      whereClause.esPublico = true
    }

    const archivos = await archivoRepository.find({
      where: whereClause,
      relations: ["usuario"], // Solo incluir relaciones que existen
      order: { createAt: "DESC" },
    })

    return [archivos, null]
  } catch (error) {
    console.error("Error getting files:", error)
    return [null, "Error al obtener archivos"]
  }
}

export async function getArchivoService(id, userId, userRole) {
  try {
    const archivoRepository = AppDataSource.getRepository(Archivo)

    const archivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["usuario"],
    })

    if (!archivo) {
      return [null, "Archivo no encontrado"]
    }

    // Verificar permisos de acceso
    if (userRole === "alumno" && !archivo.esPublico && archivo.usuarioId !== userId) {
      return [null, "No tienes permisos para acceder a este archivo"]
    }

    return [archivo, null]
  } catch (error) {
    console.error("Error getting file:", error)
    return [null, "Error al obtener archivo"]
  }
}

export async function updateArchivoService(id, updateData, userId, userRole) {
  try {
    const archivoRepository = AppDataSource.getRepository(Archivo)

    const archivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!archivo) {
      return [null, "Archivo no encontrado"]
    }

    // Verificar permisos
    if (userRole !== "admin" && userRole !== "superadmin" && archivo.usuarioId !== userId) {
      return [null, "No tienes permisos para actualizar este archivo"]
    }

    // Actualizar solo campos permitidos
    const allowedFields = [
      "carpeta",
      "categoria",
      "esPublico",
      "descripcion",
      "cursoId",
      "investigacionId",
      "version",
      "autor",
      "tags",
    ]
    const filteredData = {}

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    }

    await archivoRepository.update(id, filteredData)
    const updatedArchivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["usuario"],
    })

    return [updatedArchivo, null]
  } catch (error) {
    console.error("Error updating file:", error)
    return [null, "Error al actualizar archivo"]
  }
}

export async function deleteArchivoService(id, userId, userRole) {
  try {
    const archivoRepository = AppDataSource.getRepository(Archivo)

    const archivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!archivo) {
      return [null, "Archivo no encontrado"]
    }

    // Verificar permisos
    if (userRole !== "admin" && userRole !== "superadmin" && archivo.usuarioId !== userId) {
      return [null, "No tienes permisos para eliminar este archivo"]
    }

    // Eliminar archivo físico
    if (fs.existsSync(archivo.ruta)) {
      fs.unlinkSync(archivo.ruta)
    }

    // Eliminar registro de la base de datos
    await archivoRepository.remove(archivo)

    return [{ id: archivo.id, nombre: archivo.nombre }, null]
  } catch (error) {
    console.error("Error deleting file:", error)
    return [null, "Error al eliminar archivo"]
  }
}

export async function downloadArchivoService(id, userId, userRole) {
  try {
    const [archivo, error] = await getArchivoService(id, userId, userRole)

    if (error) {
      return [null, error]
    }

    if (!fs.existsSync(archivo.ruta)) {
      return [null, "Archivo físico no encontrado"]
    }

    return [archivo, null]
  } catch (error) {
    console.error("Error downloading file:", error)
    return [null, "Error al descargar archivo"]
  }
}
