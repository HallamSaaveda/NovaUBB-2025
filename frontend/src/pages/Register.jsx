import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rut: "",
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await register(formData)

    if (result.success) {
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-welcome">
          <h2>Iniciar Sesión</h2>
          <p></p>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>

        <div className="auth-form">
          <h1 className="auth-title">Registro</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Juan Pérez González"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Institucional</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="juan.perez@ubiobio.cl"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                Usa tu email @ubiobio.cl o @alumnos.ubiobio.cl
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">RUT</label>
              <input
                type="text"
                name="rut"
                className="form-input"
                placeholder="12.345.678-9"
                value={formData.rut}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <small style={{ color: "var(--text-light)" }}>
              Recibirás tu contraseña temporal por correo electrónico
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
