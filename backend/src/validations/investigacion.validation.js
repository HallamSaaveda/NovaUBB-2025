import Joi from "joi"

export const investigacionValidation = Joi.object({
  titulo: Joi.string().min(5).max(500).required().messages({
    "string.empty": "El título es requerido",
    "string.min": "El título debe tener al menos 5 caracteres",
    "string.max": "El título no puede exceder 500 caracteres",
    "any.required": "El título es requerido",
  }),
  autor: Joi.string().min(3).max(255).required().messages({
    "string.empty": "El autor es requerido",
    "string.min": "El autor debe tener al menos 3 caracteres",
    "string.max": "El autor no puede exceder 255 caracteres",
    "any.required": "El autor es requerido",
  }),
  coAutor: Joi.string().min(3).max(255).optional().allow("").messages({
    "string.min": "El co-autor debe tener al menos 3 caracteres",
    "string.max": "El co-autor no puede exceder 255 caracteres",
  }),
  anio: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear() + 5)
    .required()
    .messages({
      "number.base": "El año debe ser un número",
      "number.integer": "El año debe ser un número entero",
      "number.min": "El año debe ser mayor a 1900",
      "number.max": `El año no puede ser mayor a ${new Date().getFullYear() + 5}`,
      "any.required": "El año es requerido",
    }),
  descripcion: Joi.string().min(10).max(2000).required().messages({
    "string.empty": "La descripción es requerida",
    "string.min": "La descripción debe tener al menos 10 caracteres",
    "string.max": "La descripción no puede exceder 2000 caracteres",
    "any.required": "La descripción es requerida",
  }),
})
