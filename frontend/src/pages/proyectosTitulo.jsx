import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useProyectosTitulo } from "../hooks/useProyectosTitulo"
import { useAuth } from "../context/AuthContext"
import { getFileIcon } from "../utils/fileIcons"
import { formatDate } from "../utils/dateUtils"
import ProyectoTituloModal from "../components/proyectosTituloModal"

const ProyectosTitulo = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { proyectos, loading, fetchProyectosTitulo, createProyectoTitulo } = useProyectosTitulo()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    anio: "",
    carrera: "",
    semestre: "",
    nivelAcademico: "",
    search: "",
  })

  useEffect(() => {
    fetchProyectosTitulo()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleViewProyecto = (id) => {
    navigate(`/proyectos-titulo/${id}`)
  }

  const handleCreateProyecto = async (proyectoData, file) => {
    const result = await createProyectoTitulo(proyectoData, file)
    if (result.success) {
      setIsModalOpen(false)
      fetchProyectosTitulo()
    }
  }

  // Filtrar proyectos localmente
  let filteredProyectos = proyectos

  if (filters.anio) {
    filteredProyectos = filteredProyectos.filter((proyecto) => proyecto.anio.toString() === filters.anio)
  }

  if (filters.carrera) {
    filteredProyectos = filteredProyectos.filter((proyecto) =>
      proyecto.carrera.toLowerCase().includes(filters.carrera.toLowerCase())
    )
  }

  if (filters.semestre) {
    filteredProyectos = filteredProyectos.filter((proyecto) => proyecto.semestre === filters.semestre)
  }

  if (filters.nivelAcademico) {
    filteredProyectos = filteredProyectos.filter((proyecto) => proyecto.nivelAcademico === filters.nivelAcademico)
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredProyectos = filteredProyectos.filter(
      (proyecto) =>
        proyecto.titulo.toLowerCase().includes(searchTerm) ||
        proyecto.resumen.toLowerCase().includes(searchTerm) ||
        proyecto.estudiante1.toLowerCase().includes(searchTerm) ||
        (proyecto.estudiante2 && proyecto.estudiante2.toLowerCase().includes(searchTerm)) ||
        proyecto.profesorGuia.toLowerCase().includes(searchTerm)
    )
  }

  // Obtener valores únicos para filtros
  const uniqueYears = [...new Set(proyectos.map((p) => p.anio))].sort((a, b) => b - a)
  const uniqueCarreras = [...new Set(proyectos.map((p) => p.carrera))].sort()

  // Solo profesores, admin y superadmin pueden crear proyectos
  const canCreateProyecto = ["profesor", "admin", "superadmin"].includes(user?.role)

  // Función para mostrar estudiantes
  const getEstudiantesDisplay = (proyecto) => {
    if (proyecto.estudiante2) {
      return `${proyecto.estudiante1} & ${proyecto.estudiante2}`
    }
    return proyecto.estudiante1
  }

  // Función para obtener el badge del nivel académico
  const getNivelBadge = (nivel) => {
    const badges = {
      pregrado: { color: "#28a745", icon: "🎓" },
      postgrado: { color: "#007bff", icon: "📚" },
      magister: { color: "#6f42c1", icon: "🎖️" }
    }
    const badge = badges[nivel] || badges.pregrado
    return (
      <span
        style={{
          backgroundColor: badge.color,
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        {badge.icon} {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
      </span>
    )
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Proyectos de Título</h1>
        <p className="home-subtitle">
          {user?.role === "alumno"
            ? "Explora proyectos de título y trabajos de graduación disponibles para tu aprendizaje"
            : "Gestiona y explora proyectos de título y trabajos de graduación"}
        </p>
      </div>

      {/* Botón crear proyecto - solo para profesores y admin */}
      {canCreateProyecto && (
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            style={{ 
              fontSize: "18px", 
              padding: "16px 32px",
              boxShadow: "0 4px 12px rgba(232, 90, 90, 0.3)",
              transform: "scale(1.05)"
            }}
          >
            ➕ Agregar Nuevo Proyecto de Título
          </button>
        </div>
      )}

      {/* Mensaje informativo para alumnos */}
      {user?.role === "alumno" && (
        <div
          style={{
            marginBottom: "24px",
            padding: "20px",
            backgroundColor: "#e8f5e8",
            borderRadius: "12px",
            border: "2px solid #4caf50",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>🎓</span>
            <div>
              <h4 style={{ margin: 0, color: "#2e7d32", marginBottom: "4px" }}>Acceso Académico Completo</h4>
              <p style={{ margin: 0, color: "#388e3c" }}>
                Como estudiante, tienes acceso completo para ver y descargar todos los proyectos de título disponibles.
                Utiliza estos recursos como referencia para tu propio trabajo de graduación.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "var(--primary-color)", margin: 0 }}>
              📚 Proyectos Disponibles ({filteredProyectos.length})
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label className="form-label">Año:</label>
              <select name="anio" className="form-input" value={filters.anio} onChange={handleFilterChange}>
                <option value="">Todos los años</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Carrera:</label>
              <select name="carrera" className="form-input" value={filters.carrera} onChange={handleFilterChange}>
                <option value="">Todas las carreras</option>
                {uniqueCarreras.map((carrera) => (
                  <option key={carrera} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Semestre:</label>
              <select name="semestre" className="form-input" value={filters.semestre} onChange={handleFilterChange}>
                <option value="">Todos los semestres</option>
                <option value="1">Primer Semestre</option>
                <option value="2">Segundo Semestre</option>
              </select>
            </div>
            <div>
              <label className="form-label">Nivel Académico:</label>
              <select name="nivelAcademico" className="form-input" value={filters.nivelAcademico} onChange={handleFilterChange}>
                <option value="">Todos los niveles</option>
                <option value="pregrado">Pregrado</option>
                <option value="postgrado">Postgrado</option>
                <option value="magister">Magíster</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Búsqueda general:</label>
              <input
                type="text"
                name="search"
                className="form-input"
                placeholder="Título, estudiantes, profesor guía, resumen..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de proyectos */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="loading">Cargando proyectos de título...</div>
          ) : filteredProyectos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--text-light)" }}>
              <h3>No hay proyectos de título</h3>
              <p>
                {Object.values(filters).some((f) => f)
                  ? "No se encontraron proyectos con los filtros aplicados"
                  : "No hay proyectos de título disponibles"}
              </p>
              {canCreateProyecto && (
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: "16px" }}>
                  Crear el primer proyecto
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {filteredProyectos.map((proyecto) => (
                <div
                  key={proyecto.id}
                  className="card"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid var(--border-color)",
                  }}
                  onClick={() => handleViewProyecto(proyecto.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className="card-body">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: "var(--primary-color)", marginBottom: "8px", fontSize: "20px" }}>
                          {proyecto.titulo}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: "500" }}>👨‍🎓 {getEstudiantesDisplay(proyecto)}</span>
                          <span style={{ color: "var(--text-light)" }}>👨‍🏫 {proyecto.profesorGuia}</span>
                          <span style={{ color: "var(--text-light)" }}>🏫 {proyecto.carrera}</span>
                          <span style={{ color: "var(--text-light)" }}>📅 {proyecto.anio}-{proyecto.semestre}</span>
                          {getNivelBadge(proyecto.nivelAcademico)}
                        </div>
                      </div>

                      {/* Icono de archivo */}
                      {proyecto.archivoNombreOriginal && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {getFileIcon(proyecto.archivoNombreOriginal, "32px")}
                          <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
                            {proyecto.archivoNombreOriginal}
                          </span>
                        </div>
                      )}
                    </div>

                    <p
                      style={{
                        color: "var(--text-light)",
                        lineHeight: "1.6",
                        marginBottom: "12px",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {proyecto.resumen}
                    </p>

                    {proyecto.palabrasClave && (
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {proyecto.palabrasClave.split(",").map((palabra, index) => (
                            <span
                              key={index}
                              style={{
                                backgroundColor: "#f0f0f0",
                                color: "var(--text-dark)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "11px",
                              }}
                            >
                              {palabra.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <small style={{ color: "var(--text-light)" }}>Creado: {formatDate(proyecto.createAt)}</small>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {proyecto.archivoNombreOriginal && (
                          <span
                            style={{
                              backgroundColor: "var(--primary-color)",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          >
                            📎 Con archivo
                          </span>
                        )}
                        <span
                          style={{
                            backgroundColor: "#f0f0f0",
                            color: "var(--text-dark)",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          Ver detalles →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear proyecto */}
      <ProyectoTituloModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProyecto}
        loading={loading}
      />
    </div>
  )
}

export default ProyectosTitulo
