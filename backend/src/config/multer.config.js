import multer from "multer"
import path from "path"
import fs from "fs"

// Crear directorio de uploads si no existe
const uploadsDir = "uploads"
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configuración simple de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    const nameWithoutExt = path.basename(file.originalname, extension)
    cb(null, `${uniqueSuffix}-${nameWithoutExt}${extension}`)
  },
})

// Tipos de archivos permitidos
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp", // Imágenes
  "application/pdf", // PDF
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
  "application/x-tex",
  "text/x-tex", // LaTeX
  "application/x-bibtex",
  "text/x-bibtex",
  "text/plain", // Bibliografía y texto
  "application/zip",
  "application/x-rar-compressed",
  "application/x-rar", // Comprimidos
]

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false)
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10, // Máximo 10 archivos
  },
})

export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "Client error",
        message: "Archivo demasiado grande. Máximo 50MB.",
      })
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: "Client error",
        message: "Demasiados archivos. Máximo 10 archivos.",
      })
    }
  }
  if (error.message.includes("Tipo de archivo no permitido")) {
    return res.status(400).json({
      status: "Client error",
      message: error.message,
    })
  }
  next(error)
}
