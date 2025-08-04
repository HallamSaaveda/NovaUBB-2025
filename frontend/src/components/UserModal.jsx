import { useState, useEffect } from "react"

const UserModal = ({ user, isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rut: "",
    role: "",
    newPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        rut: user.rut || "",
        role: user.role || "",
        newPassword: "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updateData = { ...formData }
    if (!updateData.newPassword) {
      delete updateData.newPassword
    } else {
      updateData.password = updateData.newPassword
      delete updateData.newPassword
    }
    onSave(updateData)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div className="card" style={{ width: "500px", maxWidth: "90vw" }}>
        <div className="card-body">
          <h3 style={{ marginBottom: "24px", color: "var(--primary-color)" }}>Editar Usuario</h3>

          {/* ✅ Mostrar contraseña actual en texto plano */}
          {user?.plainPassword && (
            <div
              style={{
                backgroundColor: "#e8f5e8",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "2px solid #4caf50",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px", marginRight: "8px" }}>🔑</span>
                <strong style={{ color: "#2e7d32" }}>Contraseña Actual:</strong>
              </div>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "12px",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  letterSpacing: "2px",
                }}
              >
                {user.plainPassword}
              </div>
              <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Esta es la contraseña que el usuario debe usar para iniciar sesión
              </small>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">RUT</label>
              <input
                type="text"
                name="rut"
                className="form-input"
                value={formData.rut}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rol</label>
              <select name="role" className="form-input" value={formData.role} onChange={handleChange} required>
                <option value="alumno">Alumno</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nueva Contraseña (opcional)</label>
              <input
                type="text"
                name="newPassword"
                className="form-input"
                placeholder="Dejar vacío para no cambiar"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                Contraseña de 5 dígitos numéricos (ej: 12345)
              </small>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserModal
