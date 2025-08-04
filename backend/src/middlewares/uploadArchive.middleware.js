import multer from "multer"
import path from "path"
import fs from "fs"

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "./src/upload/"

    // Crear subdirectorios según el tipo de archivo
    if (file.mimetype.startsWith("image/")) {
      uploadPath += "images/"
    } else if (file.mimetype === "application/pdf") {
      uploadPath += "documents/"
    } else {
      uploadPath += "others/"
    }

    // Crear el directorio si no existe
    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Generar nombre único
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`)
  },
})

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo se permiten PDF, imágenes y documentos de Word"), false)
  }
}

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 5, // Máximo 5 archivos
  },
  fileFilter: fileFilter,
})

// Middleware para manejar errores
const handleFileSizeLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "Client error",
        message: "El archivo es demasiado grande. Máximo 10MB permitido",
        details: {},
      })
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: "Client error",
        message: "Demasiados archivos. Máximo 5 archivos permitidos",
        details: {},
      })
    }
    return res.status(400).json({
      status: "Client error",
      message: `Error en la subida: ${err.message}`,
      details: {},
    })
  } else if (err) {
    return res.status(400).json({
      status: "Client error",
      message: err.message,
      details: {},
    })
  }
  next()
}

export { upload, handleFileSizeLimit }
