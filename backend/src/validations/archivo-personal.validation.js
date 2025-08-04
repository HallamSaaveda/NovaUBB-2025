import Joi from "joi"

export const archivoPersonalValidation = Joi.object({
  descripcion: Joi.string().max(1000).optional().allow(""),
  carpeta: Joi.string().max(255).default("General"),
  tags: Joi.string().max(500).optional().allow(""), // Tags separados por comas
  esFavorito: Joi.boolean().default(false),
})
