import { useEffect, useState } from "react"
import { useUsers } from "../hooks/useUsers"
import { useAuth } from "../context/AuthContext"
import UserModal from "../components/UserModal"
import { formatDate } from "../utils/dateUtils"

const UserManagement = () => {
  const { user: currentUser } = useAuth()
  const { users, loading, pagination, fetchUsers, updateUser, deleteUser } = useUsers()
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    role: "",
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    fetchUsers(filters)
  }, [filters])

  // ✅ Debug: Ver qué datos llegan
  useEffect(() => {
    if (users.length > 0) {
      console.log("Datos de usuarios:", users[0])
      console.log("Campo createAt:", users[0].createAt)
      console.log("Tipo de createAt:", typeof users[0].createAt)
    }
  }, [users])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSave = async (userData) => {
    const result = await updateUser(selectedUser.id, userData)
    if (result.success) {
      setIsModalOpen(false)
      setSelectedUser(null)
    }
  }

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${userName}?`)) {
      await deleteUser(userId)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset page when filtering
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  const getRoleBadge = (role) => {
    const colors = {
      alumno: "#6c757d",
      profesor: "#17a2b8",
      admin: "#ffc107",
      superadmin: "#dc3545",
    }

    return (
      <span
        style={{
          background: colors[role] || "#6c757d",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "500",
        }}
      >
        {role?.toUpperCase()}
      </span>
    )
  }

  // Verificar permisos
  if (!["admin", "superadmin"].includes(currentUser?.role)) {
    return (
      <div className="home-container">
        <div className="card">
          <div className="card-body" style={{ textAlign: "center" }}>
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Gestión de Usuarios</h1>
        <p className="home-subtitle">Administra usuarios del sistema bioinformático</p>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div>
              <label className="form-label">Filtrar por rol:</label>
              <select name="role" className="form-input" value={filters.role} onChange={handleFilterChange}>
                <option value="">Todos los roles</option>
                <option value="alumno">Alumno</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <div>
              <label className="form-label">Usuarios por página:</label>
              <select name="limit" className="form-input" value={filters.limit} onChange={handleFilterChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="loading">Cargando usuarios...</div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                      <th style={{ padding: "12px", textAlign: "left" }}>Nombre</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>RUT</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Rol</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Fecha Registro</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "12px" }}>{user.name}</td>
                        <td style={{ padding: "12px" }}>{user.email}</td>
                        <td style={{ padding: "12px" }}>{user.rut}</td>
                        <td style={{ padding: "12px" }}>{getRoleBadge(user.role)}</td>
                        <td style={{ padding: "12px" }}>
                          {/* ✅ Usar función segura para formatear fecha */}
                          {formatDate(user.createAt)}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button
                              className="btn btn-primary"
                              style={{ padding: "6px 12px", fontSize: "12px" }}
                              onClick={() => handleEdit(user)}
                            >
                              Editar
                            </button>
                            {user.id !== currentUser.id && (
                              <button
                                className="btn"
                                style={{
                                  padding: "6px 12px",
                                  fontSize: "12px",
                                  backgroundColor: "#dc3545",
                                  color: "white",
                                }}
                                onClick={() => handleDelete(user.id, user.name)}
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {pagination && pagination.totalPages > 1 && (
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "8px" }}>
                  <button
                    className="btn btn-secondary"
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Anterior
                  </button>
                  <span style={{ padding: "8px 16px", alignSelf: "center" }}>
                    Página {pagination.currentPage} de {pagination.totalPages}
                  </span>
                  <button
                    className="btn btn-secondary"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  )
}

export default UserManagement
