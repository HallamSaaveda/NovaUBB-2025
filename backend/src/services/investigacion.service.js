import Investigacion from "../models/investigacion.model.js"
import { AppDataSource } from "../config/configDB.js"
import { handleError } from "../handlers/errorHandler.js"
import fs from "fs"
import path from "path"

//Función para generar nombre único
function generateUniqueFileName(originalName) {
  const timestamp = Date.now()
  const random = Math.round(Math.random() * 1e9)
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  return `${baseName}-${timestamp}-${random}${extension}`
}

export async function createInvestigacionService(investigacionData, file, userId) {
  try {
    const investigacionRepository = AppDataSource.getRepository(Investigacion)

    // Preparar datos de archivo si existe
    let archivoData = {}
    if (file) {
      const uniqueName = generateUniqueFileName(file.originalname)
      const uploadPath = `./src/upload/investigaciones/${uniqueName}`

      // Crear directorio si no existe
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true })

      // Mover archivo con nombre único
      fs.renameSync(file.path, uploadPath)

      archivoData = {
        archivoNombre: uniqueName,
        archivoNombreOriginal: file.originalname,
        archivoRuta: uploadPath,
        archivoTamaño: file.size,
        archivoTipo: file.mimetype,
      }
    }

    // Crear investigación con archivo integrado
    const investigacion = investigacionRepository.create({
      titulo: investigacionData.titulo,
      autor: investigacionData.autor,
      coAutor: investigacionData.coAutor || null,
      anio: Number.parseInt(investigacionData.anio),
      descripcion: investigacionData.descripcion,
      ...archivoData,
      createdBy: userId,
    })

    const savedInvestigacion = await investigacionRepository.save(investigacion)

    // Obtener investigación completa
    const investigacionCompleta = await investigacionRepository.findOne({
      where: { id: savedInvestigacion.id },
      relations: ["creador"],
    })

    return [investigacionCompleta, null]
  } catch (error) {
    console.error("Error creating investigation:", error)
    handleError(error, "investigacion.service -> createInvestigacionService")
    return [null, "Error al crear investigación"]
  }
}

export async function downloadArchivoInvestigacionService(id, userId, userRole) {
  try {
    const investigacionRepository = AppDataSource.getRepository(Investigacion)

    const investigacion = await investigacionRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!investigacion) {
      return [null, "Investigación no encontrada"]
    }

    if (!investigacion.archivoRuta) {
      return [null, "Esta investigación no tiene archivo asociado"]
    }

    if (!fs.existsSync(investigacion.archivoRuta)) {
      return [null, "Archivo físico no encontrado"]
    }

    return [
      {
        ruta: investigacion.archivoRuta,
        nombreOriginal: investigacion.archivoNombreOriginal,
        tipo: investigacion.archivoTipo,
      },
      null,
    ]
  } catch (error) {
    console.error("Error downloading file:", error)
    return [null, "Error al descargar archivo"]
  }
}

export async function deleteInvestigacionService(id, userId, userRole) {
  try {
    const investigacionRepository = AppDataSource.getRepository(Investigacion)

    const investigacion = await investigacionRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!investigacion) {
      return [null, "Investigación no encontrada"]
    }

    // Solo el creador o superadmin pueden eliminar
    if (userRole !== "superadmin" && investigacion.createdBy !== userId) {
      return [null, "No tienes permisos para eliminar esta investigación"]
    }

    // Eliminar archivo físico si existe
    if (investigacion.archivoRuta && fs.existsSync(investigacion.archivoRuta)) {
      fs.unlinkSync(investigacion.archivoRuta)
    }

    // Eliminar investigación
    await investigacionRepository.remove(investigacion)

    return [{ id: investigacion.id, titulo: investigacion.titulo }, null]
  } catch (error) {
    console.error("Error deleting investigation:", error)
    return [null, "Error al eliminar investigación"]
  }
}

export async function getInvestigacionesService(filters = {}, userId, userRole) {
  try {
    const investigacionRepository = AppDataSource.getRepository(Investigacion)
    const whereClause = {}

    if (filters.anio) whereClause.anio = Number.parseInt(filters.anio)
    if (filters.autor) whereClause.autor = filters.autor

    // ✅ CORREGIDO: Todos los usuarios pueden ver investigaciones
    // Las investigaciones son públicas para fines académicos y educativos

    const investigaciones = await investigacionRepository.find({
      where: whereClause,
      relations: ["creador"],
      order: { createAt: "DESC" },
    })

    return [investigaciones, null]
  } catch (error) {
    console.error("Error getting investigations:", error)
    return [null, "Error al obtener investigaciones"]
  }
}

export async function getInvestigacionService(id, userId, userRole) {
  try {
    const investigacionRepository = AppDataSource.getRepository(Investigacion)

    const investigacion = await investigacionRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["creador"],
    })

    if (!investigacion) {
      return [null, "Investigación no encontrada"]
    }

    // ✅ CORREGIDO: Todos los usuarios pueden ver investigaciones individuales
    // Las investigaciones son públicas para fines académicos

    return [investigacion, null]
  } catch (error) {
    console.error("Error getting investigation:", error)
    return [null, "Error al obtener investigación"]
  }
}

export async function updateInvestigacionService(id, updateData, userId, userRole) {
  try {
    const investigacionRepository = AppDataSource.getRepository(Investigacion)

    const investigacion = await investigacionRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!investigacion) {
      return [null, "Investigación no encontrada"]
    }

    if (userRole !== "superadmin" && investigacion.createdBy !== userId) {
      return [null, "No tienes permisos para modificar esta investigación"]
    }

    const allowedFields = ["titulo", "autor", "coAutor", "anio", "descripcion"]
    const filteredData = {}

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === "anio") {
          filteredData[field] = Number.parseInt(updateData[field])
        } else {
          filteredData[field] = updateData[field]
        }
      }
    }

    await investigacionRepository.update(id, filteredData)

    const updatedInvestigacion = await investigacionRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["creador"],
    })

    return [updatedInvestigacion, null]
  } catch (error) {
    console.error("Error updating investigation:", error)
    return [null, "Error al actualizar investigación"]
  }
}
