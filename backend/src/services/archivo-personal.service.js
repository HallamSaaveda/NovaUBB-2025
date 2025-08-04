import ArchivoPersonal from "../models/archivo-personal.model.js"
import { AppDataSource } from "../config/configDB.js"
import { handleError } from "../handlers/errorHandler.js"
import fs from "fs"
import path from "path"

// Función corregida para generar nombre único
function generateUniqueFileName(originalName, profesorId) {
  // Verificar que originalName existe
  if (!originalName || typeof originalName !== "string") {
    console.error("❌ originalName is invalid:", originalName)
    throw new Error("Nombre de archivo original no válido")
  }

  const timestamp = Date.now()
  const random = Math.round(Math.random() * 1e9)
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  return `prof${profesorId}-${baseName}-${timestamp}-${random}${extension}`
}

export async function uploadArchivoPersonalService(file, archivoData, profesorId) {
  try {
    console.log("=== DEBUG UPLOAD ARCHIVO PERSONAL ===")
    console.log("1. File recibido:", file)
    console.log("2. ArchivoData recibido:", archivoData)
    console.log("3. ProfesorId:", profesorId)

    // Verificar que el archivo existe y tiene las propiedades necesarias
    if (!file) {
      throw new Error("No se recibió ningún archivo")
    }

    if (!file.originalname) {
      console.error("❌ file.originalname está undefined:", file)
      throw new Error("El archivo no tiene nombre original")
    }

    if (!file.path) {
      console.error("❌ file.path está undefined:", file)
      throw new Error("El archivo no tiene ruta temporal")
    }

    console.log("4. Archivo válido, procediendo...")

    const archivoRepository = AppDataSource.getRepository(ArchivoPersonal)

    // Generar nombre único
    const uniqueName = generateUniqueFileName(file.originalname, profesorId)
    const uploadPath = `./src/upload/personal/${profesorId}/${uniqueName}`

    console.log("5. Nombre único generado:", uniqueName)
    console.log("6. Ruta de destino:", uploadPath)

    // Crear directorio personal del profesor
    fs.mkdirSync(path.dirname(uploadPath), { recursive: true })

    // Mover archivo
    fs.renameSync(file.path, uploadPath)

    console.log("7. Archivo movido exitosamente")

    // Crear registro
    const archivo = archivoRepository.create({
      nombre: uniqueName,
      nombreOriginal: file.originalname,
      ruta: uploadPath,
      tamaño: file.size,
      tipo: file.mimetype,
      descripcion: archivoData.descripcion || null,
      carpeta: archivoData.carpeta || "General",
      tags: archivoData.tags || null,
      esFavorito: archivoData.esFavorito === "true" || archivoData.esFavorito === true || false,
      profesorId: profesorId,
    })

    const savedArchivo = await archivoRepository.save(archivo)
    console.log("8. Archivo guardado en BD:", savedArchivo.id)

    return [savedArchivo, null]
  } catch (error) {
    console.error("❌ Error uploading personal file:", error)
    handleError(error, "archivo-personal.service -> uploadArchivoPersonalService")
    return [null, "Error al subir archivo personal: " + error.message]
  }
}

export async function getArchivosPersonalesService(filters, profesorId) {
  try {
    const archivoRepository = AppDataSource.getRepository(ArchivoPersonal)
    const whereClause = { profesorId }

    // Filtros opcionales
    if (filters.carpeta) whereClause.carpeta = filters.carpeta
    if (filters.esFavorito) whereClause.esFavorito = filters.esFavorito === "true"

    let archivos = await archivoRepository.find({
      where: whereClause,
      relations: ["profesor"],
      order: { createAt: "DESC" },
    })

    // Filtro por tags si se proporciona
    if (filters.tags) {
      const searchTags = filters.tags.toLowerCase()
      archivos = archivos.filter((archivo) => archivo.tags && archivo.tags.toLowerCase().includes(searchTags))
    }

    return [archivos, null]
  } catch (error) {
    console.error("Error getting personal files:", error)
    return [null, "Error al obtener archivos personales"]
  }
}

export async function getArchivoPersonalService(id, profesorId) {
  try {
    const archivoRepository = AppDataSource.getRepository(ArchivoPersonal)

    const archivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id), profesorId },
      relations: ["profesor"],
    })

    if (!archivo) {
      return [null, "Archivo no encontrado"]
    }

    return [archivo, null]
  } catch (error) {
    console.error("Error getting personal file:", error)
    return [null, "Error al obtener archivo personal"]
  }
}

export async function updateArchivoPersonalService(id, updateData, profesorId) {
  try {
    const archivoRepository = AppDataSource.getRepository(ArchivoPersonal)

    const archivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id), profesorId },
    })

    if (!archivo) {
      return [null, "Archivo no encontrado"]
    }

    // Campos permitidos para actualizar
    const allowedFields = ["descripcion", "carpeta", "tags", "esFavorito"]
    const filteredData = {}

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === "esFavorito") {
          filteredData[field] = updateData[field] === "true" || updateData[field] === true
        } else {
          filteredData[field] = updateData[field]
        }
      }
    }

    await archivoRepository.update(id, filteredData)

    const updatedArchivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["profesor"],
    })

    return [updatedArchivo, null]
  } catch (error) {
    console.error("Error updating personal file:", error)
    return [null, "Error al actualizar archivo personal"]
  }
}

export async function deleteArchivoPersonalService(id, profesorId) {
  try {
    const archivoRepository = AppDataSource.getRepository(ArchivoPersonal)

    const archivo = await archivoRepository.findOne({
      where: { id: Number.parseInt(id), profesorId },
    })

    if (!archivo) {
      return [null, "Archivo no encontrado"]
    }

    // Eliminar archivo físico
    if (fs.existsSync(archivo.ruta)) {
      fs.unlinkSync(archivo.ruta)
    }

    // Eliminar registro
    await archivoRepository.remove(archivo)

    return [{ id: archivo.id, nombre: archivo.nombreOriginal }, null]
  } catch (error) {
    console.error("Error deleting personal file:", error)
    return [null, "Error al eliminar archivo personal"]
  }
}

export async function downloadArchivoPersonalService(id, profesorId) {
  try {
    const [archivo, error] = await getArchivoPersonalService(id, profesorId)

    if (error) {
      return [null, error]
    }

    if (!fs.existsSync(archivo.ruta)) {
      return [null, "Archivo físico no encontrado"]
    }

    return [
      {
        ruta: archivo.ruta,
        nombreOriginal: archivo.nombreOriginal,
        tipo: archivo.tipo,
      },
      null,
    ]
  } catch (error) {
    console.error("Error downloading personal file:", error)
    return [null, "Error al descargar archivo personal"]
  }
}

//  Función para obtener carpetas del profesor
export async function getCarpetasProfesorService(profesorId) {
  try {
    const archivoRepository = AppDataSource.getRepository(ArchivoPersonal)

    const result = await archivoRepository
      .createQueryBuilder("archivo")
      .select("archivo.carpeta", "carpeta")
      .addSelect("COUNT(*)", "cantidad")
      .where("archivo.profesorId = :profesorId", { profesorId })
      .groupBy("archivo.carpeta")
      .orderBy("carpeta", "ASC")
      .getRawMany()

    return [result, null]
  } catch (error) {
    console.error("Error getting folders:", error)
    return [null, "Error al obtener carpetas"]
  }
}
