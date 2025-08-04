import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useInvestigaciones } from "../hooks/useInvestigaciones"
import { useAuth } from "../context/AuthContext"
import { getFileIcon, getFileType } from "../utils/fileIcons"
import { formatDate } from "../utils/dateUtils"

const InvestigacionDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getInvestigacion, downloadArchivo, deleteInvestigacion } = useInvestigaciones()
  const [investigacion, setInvestigacion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvestigacion()
  }, [id])

  const loadInvestigacion = async () => {
    const result = await getInvestigacion(id)
    if (result.success) {
      setInvestigacion(result.data)
    } else {
      navigate("/investigaciones")
    }
    setLoading(false)
  }

  const handleDownload = async () => {
    if (investigacion?.archivoNombreOriginal) {
      await downloadArchivo(investigacion.id, investigacion.archivoNombreOriginal)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar la investigación "${investigacion.titulo}"?`)) {
      const result = await deleteInvestigacion(investigacion.id)
      if (result.success) {
        navigate("/investigaciones")
      }
    }
  }

  const canEdit = user && (user.role === "superadmin" || (investigacion && investigacion.createdBy === user.id))
  const canDelete = user && (user.role === "superadmin" || (investigacion && investigacion.createdBy === user.id))

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Cargando investigación...</div>
      </div>
    )
  }

  if (!investigacion) {
    return (
      <div className="home-container">
        <div className="card">
          <div className="card-body" style={{ textAlign: "center" }}>
            <h2>Investigación no encontrada</h2>
            <button className="btn btn-primary" onClick={() => navigate("/investigaciones")}>
              Volver a investigaciones
            </button>
          </div>
        </div>
      </div>
    )
  }

  const fileType = getFileType(investigacion.archivoNombreOriginal)

  return (
    <div className="home-container">
      {/* Header con navegación */}
      <div style={{ marginBottom: "24px" }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/investigaciones")}
          style={{ marginBottom: "16px" }}
        >
          ← Volver a investigaciones
        </button>
      </div>

      {/* Información principal */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}
          >
            <div style={{ flex: 1 }}>
              <h1 style={{ color: "var(--primary-color)", marginBottom: "20px", fontSize: "32px", lineHeight: "1.2" }}>
                {investigacion.titulo}
              </h1>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginBottom: "20px" }}>
                <div>
                  <strong style={{ color: "var(--text-dark)", fontSize: "16px" }}>📝 Autor principal:</strong>
                  <br />
                  <span style={{ fontSize: "20px", fontWeight: "600" }}>{investigacion.autor}</span>
                </div>

                {investigacion.coAutor && (
                  <div>
                    <strong style={{ color: "var(--text-dark)", fontSize: "16px" }}>👥 Co-autor:</strong>
                    <br />
                    <span style={{ fontSize: "20px", fontWeight: "600" }}>{investigacion.coAutor}</span>
                  </div>
                )}

                <div>
                  <strong style={{ color: "var(--text-dark)", fontSize: "16px" }}>📅 Año:</strong>
                  <br />
                  <span style={{ fontSize: "20px", fontWeight: "600" }}>{investigacion.anio}</span>
                </div>

                <div>
                  <strong style={{ color: "var(--text-dark)", fontSize: "16px" }}>📊 Creado:</strong>
                  <br />
                  <span style={{ fontSize: "16px", color: "var(--text-light)" }}>
                    {formatDate(investigacion.createAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            {(canEdit || canDelete) && (
              <div style={{ display: "flex", gap: "12px" }}>
                {canEdit && (
                  <button className="btn btn-primary" onClick={() => navigate(`/investigaciones/${id}/editar`)}>
                    Editar
                  </button>
                )}
                {canDelete && (
                  <button className="btn" style={{ backgroundColor: "#dc3545", color: "white" }} onClick={handleDelete}>
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Descripción mejorada */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ color: "var(--primary-color)", marginBottom: "16px", fontSize: "24px" }}>
              📋 Descripción del Estudio
            </h3>
            <div
              style={{
                backgroundColor: "#f8faff",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <p
                style={{
                  lineHeight: "1.8",
                  fontSize: "16px",
                  whiteSpace: "pre-wrap",
                  color: "var(--text-dark)",
                  textAlign: "justify",
                }}
              >
                {investigacion.descripcion}
              </p>
            </div>
          </div>

          {/* Información del archivo */}
          {investigacion.archivoNombreOriginal && (
            <div
              style={{
                background: "linear-gradient(135deg, #f8faff 0%, #e3ebf0 100%)",
                padding: "24px",
                borderRadius: "16px",
                border: "2px solid var(--border-color)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ color: "var(--primary-color)", marginBottom: "20px", fontSize: "22px" }}>
                📎 Archivo Adjunto
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                {getFileIcon(investigacion.archivoNombreOriginal, "56px")}
                <div>
                  <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "6px", color: "var(--text-dark)" }}>
                    {investigacion.archivoNombreOriginal}
                  </div>
                  <div style={{ color: "var(--text-light)", fontSize: "16px" }}>
                    📊 Tamaño: {(investigacion.archivoTamaño / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <div style={{ color: "var(--text-light)", fontSize: "14px", marginTop: "4px" }}>
                    🏷️ Tipo: {fileType.toUpperCase()}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={handleDownload} style={{ fontSize: "16px" }}>
                  📥 Descargar Archivo
                </button>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "var(--text-light)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  💡 Haz clic en "Descargar" para acceder al documento completo
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvestigacionDetalle
