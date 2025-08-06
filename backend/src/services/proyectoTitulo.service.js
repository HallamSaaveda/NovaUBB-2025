import ProyectoTitulo from "../models/proyectoTitulo.model.js"
import { AppDataSource } from "../config/configDB.js"
import { handleError } from "../handlers/errorHandler.js"
import fs from "fs"
import path from "path"

function generateUniqueFileName(originalName) {
  const timestamp = Date.now()
  const random = Math.round(Math.random() * 1e9)
  const extension = path.extname(originalName)
  const baseName = path.basename(originalName, extension)
  return `${baseName}-${timestamp}-${random}${extension}`
}

export async function createProyectoTituloService(proyectoData, file, userId) {
  try {
    const proyectoRepository = AppDataSource.getRepository(ProyectoTitulo)

    // Preparar datos de archivo si existe
    let archivoData = {}
    if (file) {
      const uniqueName = generateUniqueFileName(file.originalname)
      const uploadPath = `./src/upload/proyectos-titulo/${uniqueName}`

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

    // Crear proyecto de título con archivo integrado
    const proyecto = proyectoRepository.create({
      titulo: proyectoData.titulo,
      estudiante1: proyectoData.estudiante1,
      estudiante2: proyectoData.estudiante2 || null,
      nivelAcademico: proyectoData.nivelAcademico || "pregrado",
      profesorGuia: proyectoData.profesorGuia,
      profesorCoGuia: proyectoData.profesorCoGuia || null,
      carrera: proyectoData.carrera,
      anio: Number.parseInt(proyectoData.anio),
      semestre: proyectoData.semestre,
      resumen: proyectoData.resumen,
      palabrasClave: proyectoData.palabrasClave || null,
      ...archivoData,
      createdBy: userId,
    })

    const savedProyecto = await proyectoRepository.save(proyecto)

    // Obtener proyecto completo
    const proyectoCompleto = await proyectoRepository.findOne({
      where: { id: savedProyecto.id },
      relations: ["creador"],
    })

    return [proyectoCompleto, null]
  } catch (error) {
    console.error("Error creating proyecto titulo:", error)
    handleError(error, "proyecto-titulo.service -> createProyectoTituloService")
    return [null, "Error al crear proyecto de título"]
  }
}

export async function getProyectosTituloService(filters = {}, userId, userRole) {
  try {
    const proyectoRepository = AppDataSource.getRepository(ProyectoTitulo)
    const whereClause = {}

    // Aplicar filtros
    if (filters.anio) whereClause.anio = Number.parseInt(filters.anio)
    if (filters.carrera) whereClause.carrera = filters.carrera
    if (filters.semestre) whereClause.semestre = filters.semestre
    if (filters.nivelAcademico) whereClause.nivelAcademico = filters.nivelAcademico

    // Todos los usuarios autenticados pueden ver proyectos de título
    // Los proyectos son públicos para fines académicos y educativos
    const proyectos = await proyectoRepository.find({
      where: whereClause,
      relations: ["creador"],
      order: { createAt: "DESC" },
    })

    return [proyectos, null]
  } catch (error) {
    console.error("Error getting proyectos titulo:", error)
    return [null, "Error al obtener proyectos de título"]
  }
}

export async function getProyectoTituloService(id, userId, userRole) {
  try {
    const proyectoRepository = AppDataSource.getRepository(ProyectoTitulo)

    const proyecto = await proyectoRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["creador"],
    })

    if (!proyecto) {
      return [null, "Proyecto de título no encontrado"]
    }

    // Todos los usuarios autenticados pueden ver proyectos individuales
    // Los proyectos son públicos para fines académicos
    return [proyecto, null]
  } catch (error) {
    console.error("Error getting proyecto titulo:", error)
    return [null, "Error al obtener proyecto de título"]
  }
}

export async function updateProyectoTituloService(id, updateData, userId, userRole) {
  try {
    const proyectoRepository = AppDataSource.getRepository(ProyectoTitulo)

    const proyecto = await proyectoRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!proyecto) {
      return [null, "Proyecto de título no encontrado"]
    }

    // Solo el creador, admin o superadmin pueden modificar
    if (userRole !== "superadmin" && userRole !== "admin" && proyecto.createdBy !== userId) {
      return [null, "No tienes permisos para modificar este proyecto de título"]
    }

    const allowedFields = [
      "titulo",
      "estudiante1",
      "estudiante2", 
      "nivelAcademico",
      "profesorGuia",
      "profesorCoGuia",
      "carrera",
      "anio",
      "semestre",
      "resumen",
      "palabrasClave"
    ]
    
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

    await proyectoRepository.update(id, filteredData)

    const updatedProyecto = await proyectoRepository.findOne({
      where: { id: Number.parseInt(id) },
      relations: ["creador"],
    })

    return [updatedProyecto, null]
  } catch (error) {
    console.error("Error updating proyecto titulo:", error)
    return [null, "Error al actualizar proyecto de título"]
  }
}

export async function deleteProyectoTituloService(id, userId, userRole) {
  try {
    const proyectoRepository = AppDataSource.getRepository(ProyectoTitulo)

    const proyecto = await proyectoRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!proyecto) {
      return [null, "Proyecto de título no encontrado"]
    }

    // Solo el creador, admin o superadmin pueden eliminar
    if (userRole !== "superadmin" && userRole !== "admin" && proyecto.createdBy !== userId) {
      return [null, "No tienes permisos para eliminar este proyecto de título"]
    }

    // Eliminar archivo físico si existe
    if (proyecto.archivoRuta && fs.existsSync(proyecto.archivoRuta)) {
      fs.unlinkSync(proyecto.archivoRuta)
    }

    // Eliminar proyecto
    await proyectoRepository.remove(proyecto)

    return [{ id: proyecto.id, titulo: proyecto.titulo }, null]
  } catch (error) {
    console.error("Error deleting proyecto titulo:", error)
    return [null, "Error al eliminar proyecto de título"]
  }
}

export async function downloadArchivoProyectoTituloService(id, userId, userRole) {
  try {
    const proyectoRepository = AppDataSource.getRepository(ProyectoTitulo)

    const proyecto = await proyectoRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!proyecto) {
      return [null, "Proyecto de título no encontrado"]
    }

    if (!proyecto.archivoRuta) {
      return [null, "Este proyecto no tiene archivo asociado"]
    }

    if (!fs.existsSync(proyecto.archivoRuta)) {
      return [null, "Archivo físico no encontrado"]
    }

    return [
      {
        ruta: proyecto.archivoRuta,
        nombreOriginal: proyecto.archivoNombreOriginal,
        tipo: proyecto.archivoTipo,
      },
      null,
    ]
  } catch (error) {
    console.error("Error downloading file:", error)
    return [null, "Error al descargar archivo"]
  }
}
