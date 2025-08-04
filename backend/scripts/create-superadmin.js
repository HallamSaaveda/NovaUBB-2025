import { AppDataSource } from "../src/config/configDB.js"
import User from "../src/models/user.model.js"
import { encryptPassword } from "../src/helpers/bcrypt.helper.js"

async function createSuperAdmin() {
  try {
    console.log("Iniciando creación del superadministrador...")

    // Inicializar conexión a la base de datos
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      console.log("Conexión a la base de datos establecida")
    }

    const userRepository = AppDataSource.getRepository(User)

    // Verificar si ya existe el superadmin
    const existingSuperAdmin = await userRepository.findOne({
      where: { email: "superadministrador@gmail.com" },
    })

    if (existingSuperAdmin) {
      console.log("  El superadministrador ya existe")
      console.log("  Email:", existingSuperAdmin.email)
      console.log("  Rol:", existingSuperAdmin.role)
      console.log("  Creado:", existingSuperAdmin.createAt)

      // Cerrar conexión y salir
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy()
      }
      process.exit(0)
    }

    // Crear el superadministrador
    const superAdmin = userRepository.create({
      name: "Super Administrador",
      rut: "00.000.000-0", // RUT especial para el superadmin
      email: "superadministrador@gmail.com",
      password: await encryptPassword("t.gutierrez2025"), // Contraseña encriptada
      role: "superadmin",
    })

    await userRepository.save(superAdmin)

    console.log("🎉 ¡Superadministrador creado exitosamente!")
    console.log("   📧 Email: superadministrador@gmail.com")
    console.log("   🔑 Password: t.gutierrez2025")
    console.log("   👑 Rol: superadmin")
    console.log("   🆔 ID:", superAdmin.id)
    console.log("\n✅ Ahora puedes hacer login con estas credenciales")
  } catch (error) {
    console.error("❌ Error al crear el superadministrador:")
    console.error("   Mensaje:", error.message)
    console.error("   Stack:", error.stack)
  } finally {
    // Cerrar conexión a la base de datos
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
      console.log("🔌 Conexión a base de datos cerrada")
    }
    process.exit(0)
  }
}

// Ejecutar el script
createSuperAdmin()
