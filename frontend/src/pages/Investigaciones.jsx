import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useInvestigaciones } from "../hooks/useInvestigaciones"
import { useAuth } from "../context/AuthContext"
import { getFileIcon } from "../utils/fileIcons"
import { formatDate } from "../utils/dateUtils"
import InvestigacionModal from "../components/InvestigacionModal"

const Investigaciones = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { investigaciones, loading, fetchInvestigaciones, createInvestigacion } = useInvestigaciones()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    anio: "",
    autor: "",
    search: "",
  })

  useEffect(() => {
    fetchInvestigaciones()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleViewInvestigacion = (id) => {
    navigate(`/investigaciones/${id}`)
  }

  // ✅ Función para crear investigación con modal
  const handleCreateInvestigacion = async (investigacionData, file) => {
    const result = await createInvestigacion(investigacionData, file)
    if (result.success) {
      setIsModalOpen(false)
      // Refrescar la lista de investigaciones
      fetchInvestigaciones()
    }
  }

  // Filtrar investigaciones localmente
  let filteredInvestigaciones = investigaciones

  if (filters.anio) {
    filteredInvestigaciones = filteredInvestigaciones.filter((inv) => inv.anio.toString() === filters.anio)
  }

  if (filters.autor) {
    filteredInvestigaciones = filteredInvestigaciones.filter(
      (inv) =>
        inv.autor.toLowerCase().includes(filters.autor.toLowerCase()) ||
        (inv.coAutor && inv.coAutor.toLowerCase().includes(filters.autor.toLowerCase())),
    )
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredInvestigaciones = filteredInvestigaciones.filter(
      (inv) => inv.titulo.toLowerCase().includes(searchTerm) || inv.descripcion.toLowerCase().includes(searchTerm),
    )
  }

  // Obtener años únicos para el filtro
  const uniqueYears = [...new Set(investigaciones.map((inv) => inv.anio))].sort((a, b) => b - a)

  // Solo profesores, admin y superadmin pueden crear investigaciones
  const canCreateInvestigacion = ["profesor", "admin", "superadmin"].includes(user?.role)

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Investigaciones en Bioinformática</h1>
        <p className="home-subtitle">
          {user?.role === "alumno"
            ? "Explora proyectos de investigación y análisis computacional disponibles para tu aprendizaje"
            : "Gestiona y explora proyectos de investigación y análisis computacional"}
        </p>
      </div>

      {/* Botón crear investigación - solo para profesores y admin */}
      {canCreateInvestigacion && (
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            style={{ fontSize: "16px", padding: "12px 24px" }}
          >
            ➕ Nueva Investigación
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
                Como estudiante, tienes acceso completo para ver y descargar todas las investigaciones disponibles.
                Utiliza estos recursos para enriquecer tu aprendizaje en bioinformática.
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
              📚 Investigaciones Disponibles ({filteredInvestigaciones.length})
            </h3>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
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
              <label className="form-label">Autor:</label>
              <input
                type="text"
                name="autor"
                className="form-input"
                placeholder="Buscar por autor..."
                value={filters.autor}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="form-label">Búsqueda general:</label>
              <input
                type="text"
                name="search"
                className="form-input"
                placeholder="Título, descripción..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de investigaciones */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="loading">Cargando investigaciones...</div>
          ) : filteredInvestigaciones.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--text-light)" }}>
              <h3>No hay investigaciones</h3>
              <p>
                {filters.anio || filters.autor || filters.search
                  ? "No se encontraron investigaciones con los filtros aplicados"
                  : "No hay investigaciones disponibles"}
              </p>
              {canCreateInvestigacion && (
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: "16px" }}>
                  Crear la primera investigación
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {filteredInvestigaciones.map((investigacion) => (
                <div
                  key={investigacion.id}
                  className="card"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: "1px solid var(--border-color)",
                  }}
                  onClick={() => handleViewInvestigacion(investigacion.id)}
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
                          {investigacion.titulo}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                          <span style={{ fontWeight: "500" }}>📝 {investigacion.autor}</span>
                          {investigacion.coAutor && (
                            <span style={{ color: "var(--text-light)" }}>👥 {investigacion.coAutor}</span>
                          )}
                          <span style={{ color: "var(--text-light)" }}>📅 {investigacion.anio}</span>
                        </div>
                      </div>

                      {/* Icono de archivo */}
                      {investigacion.archivoNombreOriginal && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {getFileIcon(investigacion.archivoNombreOriginal, "32px")}
                          <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
                            {investigacion.archivoNombreOriginal}
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
                      {investigacion.descripcion}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <small style={{ color: "var(--text-light)" }}>Creado: {formatDate(investigacion.createAt)}</small>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {investigacion.archivoNombreOriginal && (
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

      {/* Modal para crear investigación */}
      <InvestigacionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateInvestigacion}
        loading={loading}
      />
    </div>
  )
}

export default Investigaciones
