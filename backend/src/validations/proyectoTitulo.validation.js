import Joi from "joi"

export const proyectoTituloValidation = Joi.object({
  titulo: Joi.string().min(10).max(500).required().messages({
    "string.empty": "El título es requerido",
    "string.min": "El título debe tener al menos 10 caracteres",
    "string.max": "El título no puede exceder 500 caracteres",
    "any.required": "El título es requerido",
  }),
  estudiante1: Joi.string().min(3).max(255).required().messages({
    "string.empty": "El primer estudiante es requerido",
    "string.min": "El nombre del primer estudiante debe tener al menos 3 caracteres",
    "string.max": "El nombre del primer estudiante no puede exceder 255 caracteres",
    "any.required": "El primer estudiante es requerido",
  }),
  estudiante2: Joi.string().min(3).max(255).optional().allow("").messages({
    "string.min": "El nombre del segundo estudiante debe tener al menos 3 caracteres",
    "string.max": "El nombre del segundo estudiante no puede exceder 255 caracteres",
  }),
  nivelAcademico: Joi.string().valid("pregrado", "postgrado", "magister").required().messages({
    "any.only": "El nivel académico debe ser pregrado, postgrado o magister",
    "any.required": "El nivel académico es requerido",
  }),
  profesorGuia: Joi.string().min(3).max(255).required().messages({
    "string.empty": "El profesor guía es requerido",
    "string.min": "El profesor guía debe tener al menos 3 caracteres",
    "string.max": "El profesor guía no puede exceder 255 caracteres",
    "any.required": "El profesor guía es requerido",
  }),
  profesorCoGuia: Joi.string().min(3).max(255).optional().allow("").messages({
    "string.min": "El profesor co-guía debe tener al menos 3 caracteres",
    "string.max": "El profesor co-guía no puede exceder 255 caracteres",
  }),
  carrera: Joi.string().min(3).max(255).required().messages({
    "string.empty": "La carrera es requerida",
    "string.min": "La carrera debe tener al menos 3 caracteres",
    "string.max": "La carrera no puede exceder 255 caracteres",
    "any.required": "La carrera es requerida",
  }),
  anio: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 2)
    .required()
    .messages({
      "number.base": "El año debe ser un número",
      "number.integer": "El año debe ser un número entero",
      "number.min": "El año debe ser mayor a 2000",
      "number.max": `El año no puede ser mayor a ${new Date().getFullYear() + 2}`,
      "any.required": "El año es requerido",
    }),
  semestre: Joi.string().valid("1", "2").required().messages({
    "any.only": "El semestre debe ser 1 o 2",
    "any.required": "El semestre es requerido",
  }),
  resumen: Joi.string().min(50).max(3000).required().messages({
    "string.empty": "El resumen es requerido",
    "string.min": "El resumen debe tener al menos 50 caracteres",
    "string.max": "El resumen no puede exceder 3000 caracteres",
    "any.required": "El resumen es requerido",
  }),
  palabrasClave: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Las palabras clave no pueden exceder 500 caracteres",
  }),
})

export const updateProyectoTituloValidation = Joi.object({
  titulo: Joi.string().min(10).max(500).optional(),
  estudiante1: Joi.string().min(3).max(255).optional(),
  estudiante2: Joi.string().min(3).max(255).optional().allow(""),
  nivelAcademico: Joi.string().valid("pregrado", "postgrado", "magister").optional(),
  profesorGuia: Joi.string().min(3).max(255).optional(),
  profesorCoGuia: Joi.string().min(3).max(255).optional().allow(""),
  carrera: Joi.string().min(3).max(255).optional(),
  anio: Joi.number()
    .integer()
    .min(2000)
    .max(new Date().getFullYear() + 2)
    .optional(),
  semestre: Joi.string().valid("1", "2").optional(),
  resumen: Joi.string().min(50).max(3000).optional(),
  palabrasClave: Joi.string().max(500).optional().allow(""),
})
