import {
  getAllUsersService,
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "../services/user.service.js"
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js"
import { userQueryValidation, userBodyValidation } from "../validations/user.validation.js"

export async function getAllUsers(req, res) {
  try {
    // Solo admin y superadmin pueden ver todos los usuarios
    if (!["admin", "superadmin"].includes(req.user.role)) {
      return handleErrorClient(res, 403, "No tienes permisos para ver todos los usuarios")
    }

    const [result, errorUsers] = await getAllUsersService(req.query, req.user.role)
    if (errorUsers) return handleErrorServer(res, 500, errorUsers)

    handleSuccess(res, 200, "All users retrieved successfully", result)
  } catch (error) {
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}

export async function getUsers(req, res) {
  try {
    const { error } = userQueryValidation.validate(req.query)
    if (error) return handleErrorClient(res, 400, error.message)

    // ✅ Pasar el rol del usuario al servicio
    const [users, errorUsers] = await getUsersService(req.query, req.user.role)
    if (errorUsers) return handleErrorServer(res, 500, errorUsers)

    handleSuccess(res, 200, "Users retrieved successfully", users)
  } catch (error) {
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}

export async function getUser(req, res) {
  try {
    const { error } = userQueryValidation.validate(req.query)
    if (error) return handleErrorClient(res, 400, error.message)

    // ✅ Pasar el rol del usuario al servicio
    const [user, errorUser] = await getUserService(req.query, req.user.role)
    if (errorUser) return handleErrorClient(res, 404, errorUser)

    handleSuccess(res, 200, "User retrieved successfully", user)
  } catch (error) {
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}

export async function updateUser(req, res) {
  try {
    const { error: queryError } = userQueryValidation.validate(req.query)
    if (queryError) return handleErrorClient(res, 400, queryError.message)

    const { error: bodyError } = userBodyValidation.validate(req.body)
    if (bodyError) return handleErrorClient(res, 400, bodyError.message)

    const [user, errorUser] = await updateUserService(req.query, req.body, req.user.id, req.user.role)
    if (errorUser) return handleErrorClient(res, 403, errorUser)

    handleSuccess(res, 200, "User updated successfully", user)
  } catch (error) {
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}

export async function deleteUser(req, res) {
  try {
    const { error } = userQueryValidation.validate(req.query)
    if (error) return handleErrorClient(res, 400, error.message)

    const [user, errorUser] = await deleteUserService(req.query, req.user.id, req.user.role)
    if (errorUser) return handleErrorClient(res, 403, errorUser)

    handleSuccess(res, 200, "User deleted successfully", user)
  } catch (error) {
    handleErrorServer(res, 500, "Internal server error.", error.message)
  }
}
