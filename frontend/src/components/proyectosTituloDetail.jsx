import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useProyectosTitulo } from "../hooks/useProyectosTitulo"
import { useAuth } from "../context/AuthContext"
import { formatDate } from "../utils/dateUtils"
import { getFileIcon } from "../utils/fileIcons"
import PdfViewer from "./PdfViewer"

const ProyectoTituloDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getProyectoTitulo, updateProyectoTitulo, deleteProyectoTitulo, downloadArchivo } = useProyectosTitulo()
  const [proyecto, setProyecto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    fetchProyecto()
  }, [id])

  const fetchProyecto = async () => {
    setLoading(true)
    const result = await getProyectoTitulo(id)
    if (result.success) {
      setProyecto(result.data)
      setEditData(result.data)
    } else {
      navigate("/proyectos-titulo")
    }
    setLoading(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    const result = await updateProyectoTitulo(id, editData)
    if (result.success) {
      setProyecto(result.data)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditData(proyecto)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto de título?")) {
      const result = await deleteProyectoTitulo(id)
      if (result.success) {
        navigate("/proyectos-titulo")
      }
    }
  }

  const handleDownload = async () => {
    if (proyecto.archivoNombreOriginal) {
      await downloadArchivo(id, proyecto.archivoNombreOriginal)
    }
  }

  const handleViewPdf = () => {
    setShowPdfViewer(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Verificar permisos de edición
  const canEdit = ["profesor", "admin", "superadmin"].includes(user?.role) && 
    (user?.role === "superadmin" || user?.role === "admin" || proyecto?.createdBy === user?.id)

  const isPdfFile = proyecto?.archivoNombreOriginal?.toLowerCase().endsWith('.pdf')

  // Función para obtener el badge del nivel académico
  const getNivelBadge = (nivel) => {
    const badges = {
      pregrado: { color: "#28a745", icon: "🎓", label: "Pregrado" },
      postgrado: { color: "#007bff", icon: "📚", label: "Postgrado" },
      magister: { color: "#6f42c1", icon: "🎖️", label: "Magíster" }
    }
    const badge = badges[nivel] || badges.pregrado
    return (
      <span
        style={{
          backgroundColor: badge.color,
          color: "white",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px"
        }}
      >
        {badge.icon} {badge.label}
      </span>
    )
  }

  if (loading) {
    return <div className="loading">Cargando proyecto de título...</div>
  }

  if (!proyecto) {
    return (
      <div style={{ textAlign: "center", padding: "48px" }}>
        <h3>Proyecto no encontrado</h3>
        <button className="btn btn-primary" onClick={() => navigate("/proyectos-titulo")}>
          Volver a Proyectos
        </button>
      </div>
    )
  }

  const carrerasDisponibles = [
    "Ingeniería Civil",
    "Ingeniería Civil Eléctrica",
    "Ingeniería Civil en Automatización",
    "Ingeniería Civil Industrial",
    "Ingeniería Civil Mecánica",
    "Ingeniería Civil Química",
    "Ingeniería Civil en Informática (Concepción)",
    "Ingeniería Eléctrica",
    "Ingeniería Electrónica",
    "Ingeniería Mecánica",
    "Ingeniería de Ejecución en Computación e Informática",
  ]

  return (
    <div className="home-container">
      {/* Header con botones de acción */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button className="btn btn-secondary" onClick={() => navigate("/proyectos-titulo")}>
          ← Volver a Proyectos
        </button>
        
        {canEdit && (
          <div style={{ display: "flex", gap: "12px" }}>
            {!isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleEdit}>
                  ✏️ Editar
                </button>
                <button className="btn" style={{ backgroundColor: "#dc3545", color: "white" }} onClick={handleDelete}>
                  🗑️ Eliminar
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleSaveEdit}>
                  💾 Guardar
                </button>
                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                  ❌ Cancelar
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-body">
          {/* Título y nivel académico */}
          <div style={{ marginBottom: "24px" }}>
            {isEditing ? (
              <input
                type="text"
                name="titulo"
                className="form-input"
                value={editData.titulo}
                onChange={handleEditChange}
                style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
              />
            ) : (
              <h1 style={{ color: "var(--primary-color)", marginBottom: "16px" }}>{proyecto.titulo}</h1>
            )}
            
            <div style={{ marginBottom: "16px" }}>
              {isEditing ? (
                <select
                  name="nivelAcademico"
                  className="form-input"
                  value={editData.nivelAcademico}
                  onChange={handleEditChange}
                  style={{ width: "200px" }}
                >
                  <option value="pregrado">Pregrado</option>
                  <option value="postgrado">Postgrado</option>
                  <option value="magister">Magíster</option>
                </select>
              ) : (
                getNivelBadge(proyecto.nivelAcademico)
              )}
            </div>
          </div>

          {/* Información de estudiantes y académica */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            <div>
              <h3 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>👨‍🎓 Estudiantes</h3>
              <div style={{ marginBottom: "12px" }}>
                <strong>Estudiante 1 (Autor Principal):</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="estudiante1"
                    className="form-input"
                    value={editData.estudiante1}
                    onChange={handleEditChange}
                    style={{ marginTop: "4px" }}
                  />
                ) : (
                  <span style={{ marginLeft: "8px" }}>{proyecto.estudiante1}</span>
                )}
              </div>
              {(proyecto.estudiante2 || isEditing) && (
                <div style={{ marginBottom: "12px" }}>
                  <strong>Estudiante 2 (Co-autor):</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      name="estudiante2"
                      className="form-input"
                      value={editData.estudiante2 || ""}
                      onChange={handleEditChange}
                      placeholder="Opcional"
                      style={{ marginTop: "4px" }}
                    />
                  ) : (
                    <span style={{ marginLeft: "8px" }}>{proyecto.estudiante2 || "No aplica"}</span>
                  )}
                </div>
              )}
              <div style={{ marginBottom: "12px" }}>
                <strong>Carrera:</strong>
                {isEditing ? (
                  <select
                    name="carrera"
                    className="form-input"
                    value={editData.carrera}
                    onChange={handleEditChange}
                    style={{ marginTop: "4px" }}
                  >
                    {carrerasDisponibles.map((carrera) => (
                      <option key={carrera} value={carrera}>
                        {carrera}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span style={{ marginLeft: "8px" }}>{proyecto.carrera}</span>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>👨‍🏫 Información Académica</h3>
              <div style={{ marginBottom: "12px" }}>
                <strong>Profesor Guía:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="profesorGuia"
                    className="form-input"
                    value={editData.profesorGuia}
                    onChange={handleEditChange}
                    style={{ marginTop: "4px" }}
                  />
                ) : (
                  <span style={{ marginLeft: "8px" }}>{proyecto.profesorGuia}</span>
                )}
              </div>
              {(proyecto.profesorCoGuia || isEditing) && (
                <div style={{ marginBottom: "12px" }}>
                  <strong>Profesor Co-Guía:</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      name="profesorCoGuia"
                      className="form-input"
                      value={editData.profesorCoGuia || ""}
                      onChange={handleEditChange}
                      placeholder="Opcional"
                      style={{ marginTop: "4px" }}
                    />
                  ) : (
                    <span style={{ marginLeft: "8px" }}>{proyecto.profesorCoGuia || "No aplica"}</span>
                  )}
                </div>
              )}
              <div style={{ marginBottom: "12px" }}>
                <strong>Período:</strong>
                <span style={{ marginLeft: "8px" }}>
                  {proyecto.anio} - Semestre {proyecto.semestre}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>📝 Resumen</h3>
            {isEditing ? (
              <textarea
                name="resumen"
                className="form-textarea"
                value={editData.resumen}
                onChange={handleEditChange}
                rows="8"
                style={{ width: "100%" }}
              />
            ) : (
              <p style={{ lineHeight: "1.8", color: "var(--text-dark)" }}>{proyecto.resumen}</p>
            )}
          </div>

          {/* Palabras clave */}
          {(proyecto.palabrasClave || isEditing) && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>🏷️ Palabras Clave</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="palabrasClave"
                  className="form-input"
                  value={editData.palabrasClave || ""}
                  onChange={handleEditChange}
                  placeholder="Separa las palabras clave con comas"
                />
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {proyecto.palabrasClave.split(",").map((palabra, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    >
                      {palabra.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Archivo */}
          {proyecto.archivoNombreOriginal && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>📎 Documento</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                }}
              >
                {getFileIcon(proyecto.archivoNombreOriginal, "48px")}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {proyecto.archivoNombreOriginal}
                  </div>
                  <div style={{ color: "var(--text-light)", fontSize: "14px" }}>
                    Tamaño: {(proyecto.archivoTamaño / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {isPdfFile && (
                    <button className="btn btn-primary" onClick={handleViewPdf}>
                      👁️ Ver PDF
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={handleDownload}>
                    📥 Descargar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Información de creación */}
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", color: "var(--text-light)" }}>
            <small>
              Creado el {formatDate(proyecto.createAt)} por {proyecto.creador?.name || "Usuario"}
            </small>
          </div>
        </div>
      </div>

      {/* Visor de PDF */}
      {showPdfViewer && isPdfFile && (
        <PdfViewer
          proyectoId={id}
          fileName={proyecto.archivoNombreOriginal}
          onClose={() => setShowPdfViewer(false)}
        />
      )}
    </div>
  )
}

export default ProyectoTituloDetail
