import { useState } from "react"

const ProyectoTituloModal = ({ isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    estudiante1: "",
    estudiante2: "",
    nivelAcademico: "pregrado",
    profesorGuia: "",
    profesorCoGuia: "",
    carrera: "",
    anio: new Date().getFullYear(),
    semestre: "1",
    resumen: "",
    palabrasClave: "",
  })
  const [selectedFile, setSelectedFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData, selectedFile)
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      estudiante1: "",
      estudiante2: "",
      nivelAcademico: "pregrado",
      profesorGuia: "",
      profesorCoGuia: "",
      carrera: "",
      anio: new Date().getFullYear(),
      semestre: "1",
      resumen: "",
      palabrasClave: "",
    })
    setSelectedFile(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

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

  const nivelesAcademicos = [
    { value: "pregrado", label: "Pregrado" },
    { value: "postgrado", label: "Postgrado" },
    { value: "magister", label: "Magíster" },
  ]

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
        padding: "20px",
      }}
    >
      <div className="card" style={{ width: "800px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto" }}>
        <div className="card-body">
          <h3 style={{ marginBottom: "24px", color: "var(--primary-color)" }}>🎓 Nuevo Proyecto de Título</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Título del Proyecto *</label>
              <input
                type="text"
                name="titulo"
                className="form-input"
                placeholder="Sistema de gestión para..."
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Información de estudiantes */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>👨‍🎓 Estudiantes</h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Estudiante 1 (Autor Principal) *</label>
                  <input
                    type="text"
                    name="estudiante1"
                    className="form-input"
                    placeholder="Juan Pérez González"
                    value={formData.estudiante1}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estudiante 2 (Co-autor) - Opcional</label>
                  <input
                    type="text"
                    name="estudiante2"
                    className="form-input"
                    placeholder="María Rodríguez Silva"
                    value={formData.estudiante2}
                    onChange={handleChange}
                  />
                  <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                    Solo para proyectos realizados por dos estudiantes
                  </small>
                </div>
              </div>
            </div>

            {/* Nivel académico y carrera */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Nivel Académico *</label>
                <select
                  name="nivelAcademico"
                  className="form-input"
                  value={formData.nivelAcademico}
                  onChange={handleChange}
                  required
                >
                  {nivelesAcademicos.map((nivel) => (
                    <option key={nivel.value} value={nivel.value}>
                      {nivel.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Carrera *</label>
                <select
                  name="carrera"
                  className="form-input"
                  value={formData.carrera}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar carrera</option>
                  {carrerasDisponibles.map((carrera) => (
                    <option key={carrera} value={carrera}>
                      {carrera}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profesores */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ marginBottom: "16px", color: "var(--primary-color)" }}>👨‍🏫 Profesores</h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Profesor Guía *</label>
                  <input
                    type="text"
                    name="profesorGuia"
                    className="form-input"
                    placeholder="Dr. María López"
                    value={formData.profesorGuia}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profesor Co-Guía (opcional)</label>
                  <input
                    type="text"
                    name="profesorCoGuia"
                    className="form-input"
                    placeholder="Ing. Carlos Ruiz"
                    value={formData.profesorCoGuia}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Período académico */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Año *</label>
                <input
                  type="number"
                  name="anio"
                  className="form-input"
                  min="2000"
                  max={new Date().getFullYear() + 2}
                  value={formData.anio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Semestre *</label>
                <select
                  name="semestre"
                  className="form-input"
                  value={formData.semestre}
                  onChange={handleChange}
                  required
                >
                  <option value="1">Primer Semestre</option>
                  <option value="2">Segundo Semestre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Resumen del Proyecto *</label>
              <textarea
                name="resumen"
                className="form-textarea"
                placeholder="Describe detalladamente el objetivo, metodología, alcance y resultados esperados del proyecto de título..."
                value={formData.resumen}
                onChange={handleChange}
                rows="6"
                style={{ resize: "vertical", minHeight: "150px" }}
                required
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                Mínimo 50 caracteres. Incluye objetivos, metodología, alcance y resultados esperados.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Palabras Clave (opcional)</label>
              <input
                type="text"
                name="palabrasClave"
                className="form-input"
                placeholder="sistema web, gestión, base de datos, React, Node.js"
                value={formData.palabrasClave}
                onChange={handleChange}
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                Separa las palabras clave con comas. Ejemplo: "sistema web, gestión, base de datos"
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Documento del Proyecto (opcional)</label>
              <input 
                type="file" 
                className="form-input" 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx,.tex" 
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                Formatos permitidos: PDF, Word, LaTeX. Máximo 50MB.
              </small>
              {selectedFile && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    backgroundColor: "#e8f5e8",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#2e7d32",
                  }}
                >
                  📎 Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "32px" }}>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creando..." : "Crear Proyecto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProyectoTituloModal
