import nodemailer from "nodemailer"

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes cambiar esto según tu proveedor de correo
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
  },
})

/**
 * Genera un código de acceso único de 5 dígitos
 * @returns {string} Código de 5 dígitos
 */
export function generateAccessCode() {
  // Genera un número aleatorio entre 10000 y 99999
  return Math.floor(10000 + Math.random() * 90000).toString()
}

/**
 * Envía un correo electrónico con el código de acceso
 * @param {string} email - Correo electrónico del destinatario
 * @param {string} name - Nombre del destinatario
 * @param {string} accessCode - Código de acceso de 5 dígitos
 * @param {string} role - Rol del usuario (estudiante o profesor)
 * @returns {Promise<boolean>} True si el correo se envió correctamente
 */
export async function sendAccessCodeEmail(email, name, accessCode, role) {
  try {
    const roleText = role === "estudiante" ? "Estudiante" : "Profesor"

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de Acceso - Sistema de Investigaciones UBB",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                        <h1 style="color: #2c3e50; margin-bottom: 20px;">¡Bienvenido/a al Sistema de Investigaciones!</h1>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h2 style="color: #34495e;">Hola ${name},</h2>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                                Tu registro como <strong>${roleText}</strong> ha sido exitoso en el Sistema de Investigaciones de la Universidad del Bío-Bío.
                            </p>
                            
                            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="color: #2980b9; margin-top: 0;">Tu código de acceso es:</h3>
                                <div style="font-size: 32px; font-weight: bold; color: #2980b9; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                                    ${accessCode}
                                </div>
                            </div>
                            
                            <p style="color: #555; font-size: 14px; line-height: 1.6;">
                                <strong>Instrucciones:</strong><br>
                                • Utiliza este código de 5 dígitos como tu contraseña para iniciar sesión<br>
                                • Guarda este código en un lugar seguro<br>
                                • Si olvidas tu código, contacta al administrador del sistema
                            </p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #888; font-size: 12px;">
                                Este correo fue enviado automáticamente. No responder a este mensaje.<br>
                                Sistema de Investigaciones - Universidad del Bío-Bío
                            </p>
                        </div>
                    </div>
                </div>
            `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Correo enviado exitosamente a: ${email}`)
    return true
  } catch (error) {
    console.error("Error al enviar el correo:", error)
    return false
  }
}

/**
 * Verifica que el código de acceso sea único en la base de datos
 * @param {string} accessCode - Código a verificar
 * @param {Object} userRepository - Repositorio de usuarios
 * @returns {Promise<boolean>} True si el código es único
 */
export async function isAccessCodeUnique(accessCode, userRepository) {
  try {
    const existingUser = await userRepository.findOne({
      where: { password: accessCode },
    })
    return !existingUser
  } catch (error) {
    console.error("Error al verificar unicidad del código:", error)
    return false
  }
}

/**
 * Genera un código de acceso único verificando contra la base de datos
 * @param {Object} userRepository - Repositorio de usuarios
 * @returns {Promise<string>} Código único de 5 dígitos
 */
export async function generateUniqueAccessCode(userRepository) {
  let accessCode
  let isUnique = false
  let attempts = 0
  const maxAttempts = 100

  while (!isUnique && attempts < maxAttempts) {
    accessCode = generateAccessCode()
    isUnique = await isAccessCodeUnique(accessCode, userRepository)
    attempts++
  }

  if (!isUnique) {
    throw new Error("No se pudo generar un código único después de múltiples intentos")
  }

  return accessCode
}
