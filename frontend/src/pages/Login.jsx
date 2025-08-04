import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login({
      email: formData.email,
      password: formData.password,
    })

    if (result.success) {
      navigate("/")
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-form">
          <h1 className="auth-title">Ingresar</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="tu.email@ubiobio.cl"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Recuerdame</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: "16px" }}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </button>
          </form>

          <div style={{ textAlign: "center" }}>
            <Link to="/forgot-password" style={{ color: "var(--text-light)", fontSize: "14px" }}>
              Recuperar Constraseña
            </Link>
          </div>
        </div>

        <div className="auth-welcome">
          <h2>Bienvenido</h2>
          <p>No tienes una cuenta?</p>
          <Link to="/register" className="btn btn-secondary">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
