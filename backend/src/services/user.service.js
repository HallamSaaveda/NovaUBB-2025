import User from "../models/user.model.js"
import UserPassword from "../models/user-password.model.js"
import { AppDataSource } from "../config/configDB.js"
import { formatToLocalTime } from "../utils/formatDate.js"
import bcrypt from "bcryptjs"

//  Nueva función getAllUsers con contraseñas en texto plano
export async function getAllUsersService(query = {}, userRole) {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userPasswordRepository = AppDataSource.getRepository(UserPassword)
    const { role, page = 1, limit = 10 } = query

    const whereConditions = {}
    if (role) whereConditions.role = role

    // Paginación
    const skip = (page - 1) * limit
    const take = Number.parseInt(limit)

    const [users, total] = await userRepository.findAndCount({
      where: whereConditions,
      order: { createAt: "DESC" },
      select: ["id", "name", "email", "rut", "role", "createAt"],
      skip,
      take,
    })

    //  Obtener contraseñas en texto plano para admin
    const usersFormateados = await Promise.all(
      users.map(async (user) => {
        const userFormatted = {
          ...user,
          createAt: formatToLocalTime(user.createAt),
        }

        // Solo para admin/superadmin, obtener contraseña en texto plano
        if (["admin", "superadmin"].includes(userRole)) {
          const userPassword = await userPasswordRepository.findOne({
            where: { userId: user.id },
          })
          userFormatted.plainPassword = userPassword?.plainPassword || "No disponible"
        }

        return userFormatted
      }),
    )

    return [
      {
        users: usersFormateados,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / take),
          totalUsers: total,
          limit: take,
        },
      },
      null,
    ]
  } catch (error) {
    console.error("Error in getAllUsersService:", error)
    return [null, "Internal server error."]
  }
}

export async function getUsersService(query = {}, userRole) {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const userPasswordRepository = AppDataSource.getRepository(UserPassword)
    const { role } = query

    const whereConditions = {}
    if (role) whereConditions.role = role

    const users = await userRepository.find({
      where: whereConditions,
      order: { createAt: "DESC" },
      select: ["id", "name", "email", "role", "createAt"],
    })

    //  Obtener contraseñas en texto plano para admin
    const usersFormateados = await Promise.all(
      users.map(async (user) => {
        const userFormatted = {
          ...user,
          createAt: formatToLocalTime(user.createAt),
        }

        if (["admin", "superadmin"].includes(userRole)) {
          const userPassword = await userPasswordRepository.findOne({
            where: { userId: user.id },
          })
          userFormatted.plainPassword = userPassword?.plainPassword || "No disponible"
        }

        return userFormatted
      }),
    )

    return [usersFormateados, null]
  } catch (error) {
    console.error("Error in getUsersService:", error)
    return [null, "Internal server error."]
  }
}

export async function getUserService(query, userRole) {
  try {
    const { id, email } = query
    const userRepository = AppDataSource.getRepository(User)
    const userPasswordRepository = AppDataSource.getRepository(UserPassword)

    const whereCondition = {}
    if (id) whereCondition.id = Number.parseInt(id)
    if (email) whereCondition.email = email

    const user = await userRepository.findOne({
      where: whereCondition,
      select: ["id", "name", "email", "rut", "role", "createAt"],
    })

    if (!user) return [null, "User not found."]

    const userFormateado = {
      ...user,
      createAt: formatToLocalTime(user.createAt),
    }

    //  Obtener contraseña en texto plano para admin
    if (["admin", "superadmin"].includes(userRole)) {
      const userPassword = await userPasswordRepository.findOne({
        where: { userId: user.id },
      })
      userFormateado.plainPassword = userPassword?.plainPassword || "No disponible"
    }

    return [userFormateado, null]
  } catch (error) {
    console.error("Error in getUserService:", error)
    return [null, "Internal server error."]
  }
}

export async function updateUserService(query, userData, userId, userRole) {
  try {
    const { id } = query
    const userRepository = AppDataSource.getRepository(User)
    const userPasswordRepository = AppDataSource.getRepository(UserPassword)

    const user = await userRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!user) return [null, "User not found."]

    // Solo admin/superadmin o el mismo usuario pueden actualizar
    if (user.id !== userId && !["admin", "superadmin"].includes(userRole)) {
      return [null, "You don't have permission to update this user."]
    }

    // Actualizar campos permitidos
    const allowedFields = ["name", "email", "rut"]
    const updateData = {}

    for (const field of allowedFields) {
      if (userData[field] !== undefined) {
        updateData[field] = userData[field]
      }
    }

    // Solo admin/superadmin pueden cambiar roles
    if (userData.role && ["admin", "superadmin"].includes(userRole)) {
      updateData.role = userData.role
    }

    //  Manejar cambio de contraseña
    if (userData.password && ["admin", "superadmin"].includes(userRole)) {
      const saltRounds = 10
      updateData.password = await bcrypt.hash(userData.password, saltRounds)

      //  Actualizar también la contraseña en texto plano
      const existingPassword = await userPasswordRepository.findOne({
        where: { userId: user.id },
      })

      if (existingPassword) {
        await userPasswordRepository.update({ userId: user.id }, { plainPassword: userData.password })
      } else {
        const newUserPassword = userPasswordRepository.create({
          userId: user.id,
          plainPassword: userData.password,
        })
        await userPasswordRepository.save(newUserPassword)
      }
    }

    Object.assign(user, updateData)
    const userActualizado = await userRepository.save(user)

    const userFormateado = {
      ...userActualizado,
      createAt: formatToLocalTime(userActualizado.createAt),
    }

    // No devolver password hasheada en la respuesta
    delete userFormateado.password

    return [userFormateado, null]
  } catch (error) {
    console.error("Error in updateUserService:", error)
    return [null, "Internal server error."]
  }
}

export async function deleteUserService(query, userId, userRole) {
  try {
    const { id } = query
    const userRepository = AppDataSource.getRepository(User)
    const userPasswordRepository = AppDataSource.getRepository(UserPassword)

    const user = await userRepository.findOne({
      where: { id: Number.parseInt(id) },
    })

    if (!user) return [null, "User not found."]

    // Solo admin/superadmin pueden eliminar usuarios
    if (!["admin", "superadmin"].includes(userRole)) {
      return [null, "You don't have permission to delete users."]
    }

    // No permitir auto-eliminación
    if (user.id === userId) {
      return [null, "Cannot delete your own account."]
    }

    //  Eliminar también la contraseña en texto plano
    await userPasswordRepository.delete({ userId: user.id })
    await userRepository.remove(user)

    return [{ id: user.id, name: user.name, email: user.email }, null]
  } catch (error) {
    console.error("Error in deleteUserService:", error)
    return [null, "Internal server error."]
  }
}
