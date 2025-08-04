import Joi from "joi"

export const archivoQueryValidation = Joi.object({
  categoria: Joi.string().valid("personal", "curso", "investigacion").optional(),
  cursoId: Joi.number().positive().integer().optional(),
  investigacionId: Joi.number().positive().integer().optional(),
  carpeta: Joi.string().max(255).optional(),
}).messages({
  "object.unknown": "Parámetros de consulta no permitidos.",
})

export const archivoBodyValidation = Joi.object({
  categoria: Joi.string().valid("personal", "curso", "investigacion").default("personal"),
  carpeta: Joi.string().max(255).default("General"),
  esPublico: Joi.boolean().default(false),
  descripcion: Joi.string().max(500).optional().allow(""),
  cursoId: Joi.number().positive().integer().optional(),
  investigacionId: Joi.number().positive().integer().optional(),
}).messages({
  "object.unknown": "Campos adicionales no permitidos.",
})
