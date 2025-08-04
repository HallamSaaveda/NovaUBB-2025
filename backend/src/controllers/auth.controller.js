import { loginService, registerService } from "../services/auth.service.js"
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js"
import { authValidation, registerValidation } from "../validations/auth.validation.js"

export async function login(req, res) {
  try {
    const { body } = req

    const { error } = authValidation.validate(body)

    if (error) return handleErrorClient(res, 400, error.message)

    const [tokenData, errorToken] = await loginService(body)

    if (errorToken) return handleErrorServer(res, 404, errorToken, {})

    // ✅ Solo establecer una cookie con el token
    res.cookie("jwt", tokenData.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "strict", // Protección CSRF
    })

    handleSuccess(res, 200, "User logged in successfully", {
      token: tokenData.token,
      message: "Login exitoso",
    })
  } catch (error) {
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}

export async function register(req, res) {
  try {
    console.log("=== DEBUG REGISTRO ===")
    console.log("1. Headers recibidos:", req.headers)
    console.log("2. Body completo:", req.body)
    console.log("3. Tipo de body:", typeof req.body)
    console.log("4. Keys del body:", Object.keys(req.body || {}))

    const { body } = req

    if (!body || Object.keys(body).length === 0) {
      console.log("❌ ERROR: Body está vacío o undefined")
      return handleErrorClient(res, 400, "Request body is empty or invalid")
    }

    console.log("5. Verificación de campos:")
    console.log("   - name:", body.name, "| tipo:", typeof body.name)
    console.log("   - email:", body.email, "| tipo:", typeof body.email)
    console.log("   - rut:", body.rut, "| tipo:", typeof body.rut)

    console.log("6. Iniciando validación con Joi...")
    const validationResult = registerValidation.validate(body, { abortEarly: false })

    if (validationResult.error) {
      console.log("❌ ERROR DE VALIDACIÓN:")
      console.log("   - Mensaje principal:", validationResult.error.message)
      console.log("   - Detalles completos:", JSON.stringify(validationResult.error.details, null, 2))

      validationResult.error.details.forEach((detail, index) => {
        console.log(`   - Error ${index + 1}:`)
        console.log(`     * Campo: ${detail.path.join(".")}`)
        console.log(`     * Mensaje: ${detail.message}`)
        console.log(`     * Valor recibido: ${detail.context?.value}`)
        console.log(`     * Tipo de error: ${detail.type}`)
      })

      return handleErrorClient(res, 400, validationResult.error.message)
    }

    console.log("✅ Validación exitosa, procediendo con el registro...")

    const [newUser, errorNewUser] = await registerService(body)

    if (errorNewUser) {
      console.log("❌ ERROR EN SERVICIO DE REGISTRO:", errorNewUser)
      return handleErrorServer(res, 404, errorNewUser)
    }

    console.log("✅ Usuario registrado exitosamente:", newUser)
    handleSuccess(res, 201, "User registered successfully", newUser)
  } catch (error) {
    console.log("❌ ERROR GENERAL EN REGISTRO:")
    console.log("   - Mensaje:", error.message)
    console.log("   - Stack:", error.stack)
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt", { httpOnly: true })
    handleSuccess(res, 200, "User logged out successfully", {})
  } catch (error) {
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}
