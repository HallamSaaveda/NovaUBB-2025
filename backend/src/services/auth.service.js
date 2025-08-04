import User from "../models/user.model.js"
import UserPassword from "../models/user-password.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { AppDataSource } from "../config/configDB.js"
import { handleError } from "../handlers/errorHandler.js"
import { generateUniqueAccessCode, sendAccessCodeEmail } from "../helpers/email.helper.js"

// Solo necesitamos una clave secreta
const JWT_SECRET = process.env.ACCESS_JWT_SECRET || "your-secret-key"

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const { email, password } = user

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      errorMessage: message,
    })

    const userFound = await userRepository.findOne({
      where: { email },
    })

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")]
    }

    const matchPassword = await bcrypt.compare(password, userFound.password)

    if (!matchPassword) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")]
    }

    const payload = {
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      role: userFound.role,
    }

    //  Solo generar un token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "24h", // 24 horas de duración
    })

    return [{ token }, null] // ✅ Solo devolver un token
  } catch (error) {
    handleError(error, "auth.service -> loginService")
  }
}

export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userPasswordRepository = AppDataSource.getRepository(UserPassword)
    const { name, email, rut } = user

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      errorMessage: message,
    })

    const existingUser = await userRepository.findOne({
      where: { email },
    })

    if (existingUser) {
      return [null, createErrorMessage("email", "El correo electrónico ya está en uso")]
    }

    // Lógica de asignación de roles por dominio
    let role = "alumno" // Por defecto
    if (email.endsWith("@ubiobio.cl")) {
      role = "profesor"
    } else if (email.endsWith("@alumnos.ubiobio.cl")) {
      role = "alumno"
    }

    // Usar tu función para generar código único
    const accessCode = await generateUniqueAccessCode(userRepository)
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(accessCode, saltRounds)

    const newUser = userRepository.create({
      name,
      email,
      rut,
      password: hashedPassword,
      role,
    })

    const userSaved = await userRepository.save(newUser)

    //  Guardar contraseña en texto plano para admin
    const userPassword = userPasswordRepository.create({
      userId: userSaved.id,
      plainPassword: accessCode,
    })
    await userPasswordRepository.save(userPassword)

    // Usar tu función de envío de correo
    try {
      const emailSent = await sendAccessCodeEmail(email, name, accessCode, role)
      if (emailSent) {
        console.log(` Correo enviado exitosamente a ${email}`)
      } else {
        console.log(` Error enviando correo a ${email}`)
      }
    } catch (emailError) {
      console.error(" Error enviando correo:", emailError)
    }

    // No devolver el código en la respuesta por seguridad
    return [{ user: { ...userSaved, password: undefined } }, null]
  } catch (error) {
    handleError(error, "auth.service -> registerService")
    return [null, { errorMessage: "Error interno del servidor" }]
  }
}

export async function createSuperAdminIfNotExists() {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userPasswordRepository = AppDataSource.getRepository(UserPassword)

    const existingSuperAdmin = await userRepository.findOne({
      where: { email: "superadministrador@gmail.com" },
    })

    if (existingSuperAdmin) {
      console.log(" Superadmin ya existe")
      return
    }

    const plainPassword = "t.gutierrez2025"
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

    const superAdmin = userRepository.create({
      name: "Super Administrador",
      email: "superadministrador@gmail.com",
      rut: "12345678-9",
      password: hashedPassword,
      role: "superadmin",
    })

    const savedSuperAdmin = await userRepository.save(superAdmin)

    //  Guardar contraseña en texto plano
    const userPassword = userPasswordRepository.create({
      userId: savedSuperAdmin.id,
      plainPassword: plainPassword,
    })
    await userPasswordRepository.save(userPassword)

    console.log("✅ Superadmin creado exitosamente")
    console.log("📧 Email: superadministrador@gmail.com")
    console.log("🔑 Password: t.gutierrez2025")
  } catch (error) {
    console.error("❌ Error creando superadmin:", error.message)
  }
}
