import Joi from "joi"

const domainEmailValidator = (value, helper) => {
  if (value === "superadministrador@gmail.com") {
    return value
  }
  if (!value.endsWith("@alumnos.ubiobio.cl") && !value.endsWith("@ubiobio.cl")) {
    return helper.message("Email must be @alumnos.ubiobio.cl or @ubiobio.cl")
  }
  return value
}

export const authValidation = Joi.object({
  email: Joi.string().min(10).max(50).email().required().custom(domainEmailValidator, "domain validation"),
  password: Joi.alternatives()
    .try(
      Joi.string()
        .length(5)
        .pattern(/^[0-9]+$/),
      Joi.string()
        .min(8)
        .max(50), 
    )
    .required(),
})

export const registerValidation = Joi.object({
  name: Joi.string().min(3).max(70).required(),
  email: Joi.string().min(10).max(50).email().required().custom(domainEmailValidator, "domain validation"),
  rut: Joi.string()
    .min(9)
    .max(12)
    .optional()
    .pattern(/^\d{1,2}(\.\d{3}){2}-[\dkK]$|^\d{7,8}-[\dkK]$/),
})
