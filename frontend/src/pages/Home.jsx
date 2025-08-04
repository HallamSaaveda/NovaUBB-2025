import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getRoleFeatures = () => {
    switch (user?.role) {
      case "alumno":
        return [
          {
            title: "Investigaciones en Bioinformática",
            description: "Explora investigaciones en análisis genómico, proteómica y biología computacional.",
            icon: "🧬",
            onClick: () => navigate("/investigaciones"),
          },
          {
            title: "Mi Perfil",
            description: "Gestiona tu información personal y configuración de cuenta.",
            icon: "👤",
            onClick: () => navigate("/profile"),
          },
        ]

      case "profesor":
        return [
          {
            title: "Mis Investigaciones",
            description: "Gestiona tus proyectos de bioinformática, algoritmos y análisis de datos biológicos.",
            icon: "🔬",
            onClick: () => navigate("/investigaciones"),
          },
          {
            title: "Área Personal",
            description: "Espacio privado para scripts, datasets y herramientas bioinformáticas.",
            icon: "📁",
            onClick: () => navigate("/personal"),
          },
          {
            title: "Recursos Computacionales",
            description: "Administra herramientas, software y recursos para análisis bioinformático.",
            icon: "💻",
            onClick: () => navigate("/recursos"),
          },
        ]

      case "admin":
      case "superadmin":
        return [
          {
            title: "Panel de configuración de usuarios",
            description: "Gestiona usuarios, permisos y roles del sistema bioinformático.",
            icon: "👥",
            onClick: () => navigate("/users"),
          },
          {
            title: "Investigaciones",
            description: "Supervisa proyectos de bioinformática y análisis computacional.",
            icon: "📊",
            onClick: () => navigate("/investigaciones"),
          },
          {
            title: "Área Personal",
            description: "Espacio privado para archivos y documentos administrativos.",
            icon: "📁",
            onClick: () => navigate("/personal"),
          },
          {
            title: "Aplicaciones",
            description: "Software creado por estudiantes para las lecciones de bioinformática",
            icon: "📈",
            onClick: () => navigate("/reports"),
          },
        ]

      default:
        return []
    }
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Bienvenido, {user?.name}</h1>
        <p className="home-subtitle">
          {user?.role === "alumno"
            ? "Explora el mundo de la bioinformática y las investigaciones académicas"
            : user?.role === "profesor"
              ? "Gestiona tus investigaciones y recursos académicos"
              : "Administra el sistema y supervisa las actividades académicas"}
        </p>
      </div>

      <div className="home-grid">
        {getRoleFeatures().map((feature, index) => (
          <div key={index} className="home-card" onClick={feature.onClick} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p style={{ color: "var(--text-light)", lineHeight: "1.6" }}>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "48px" }}>
        <div className="card-body">
          <h3 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>Tu Información</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <strong>Nombre:</strong> {user?.name}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            <div>
              <strong>Rol:</strong>
              <span
                style={{
                  background:
                    user?.role === "alumno"
                      ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                      : user?.role === "profesor"
                        ? "linear-gradient(135deg, #007bff 0%, #6610f2 100%)"
                        : "linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginLeft: "8px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {user?.role === "alumno" && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                border: "1px solid #bbdefb",
              }}
            >
              <p style={{ margin: 0, color: "#1565c0", fontSize: "14px" }}>
                💡 <strong>Tip:</strong> Como estudiante, puedes explorar todas las investigaciones disponibles y
                descargar los archivos para tu aprendizaje académico.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
