import Joi from "joi"

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@alumnos.ubiobio.cl") && !value.endsWith("@ubiobio.cl")) {
    return helper.message("The email domain must be @alumnos.ubiobio.cl or @ubiobio.cl.")
  }
  return value
}

export const userQueryValidation = Joi.object({
  id: Joi.number().positive().integer().optional(),
  email: Joi.string().min(15).max(50).email().optional().custom(domainEmailValidator, "domain email validation"),
  rut: Joi.string()
    .min(9)
    .max(12)
    .optional()
    .pattern(/^\d{1,2}(\.\d{3}){2}-[\dkK]$|^\d{7,8}-[\dkK]$/),
}).or("id", "email", "rut")

export const userBodyValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(70)
    .optional()
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
  email: Joi.string().min(15).max(50).email().optional().custom(domainEmailValidator, "domain email validation"),
  password: Joi.string()
    .length(5)
    .optional()
    .pattern(/^[0-9]+$/),
  newPassword: Joi.string()
    .length(5)
    .optional()
    .pattern(/^[0-9]+$/),
  rut: Joi.string()
    .min(9)
    .max(12)
    .optional()
    .pattern(/^\d{1,2}(\.\d{3}){2}-[\dkK]$|^\d{7,8}-[\dkK]$/),
  // ✅ Roles consistentes con el modelo
  role: Joi.string().valid("alumno", "profesor", "admin", "superadmin").optional(),
}).or("name", "email", "password", "rut", "role")
