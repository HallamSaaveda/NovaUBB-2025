import { useState } from "react"

const InvestigacionModal = ({ isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    coAutor: "",
    anio: new Date().getFullYear(),
    descripcion: "",
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
      autor: "",
      coAutor: "",
      anio: new Date().getFullYear(),
      descripcion: "",
    })
    setSelectedFile(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
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
        padding: "20px",
      }}
    >
      <div className="card" style={{ width: "600px", maxWidth: "90vw", maxHeight: "90vh", overflow: "auto" }}>
        <div className="card-body">
          <h3 style={{ marginBottom: "24px", color: "var(--primary-color)" }}>🔬 Nueva Investigación</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Título de la Investigación *</label>
              <input
                type="text"
                name="titulo"
                className="form-input"
                placeholder="Análisis genómico de..."
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Autor Principal *</label>
                <input
                  type="text"
                  name="autor"
                  className="form-input"
                  placeholder="Dr. Juan Pérez"
                  value={formData.autor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Co-autor (opcional)</label>
                <input
                  type="text"
                  name="coAutor"
                  className="form-input"
                  placeholder="Dra. María González"
                  value={formData.coAutor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Año de Publicación *</label>
              <input
                type="number"
                name="anio"
                className="form-input"
                min="1900"
                max={new Date().getFullYear() + 5}
                value={formData.anio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción de la Investigación *</label>
              <textarea
                name="descripcion"
                className="form-textarea"
                placeholder="Describe detalladamente el objetivo, metodología, resultados y conclusiones de la investigación..."
                value={formData.descripcion}
                onChange={handleChange}
                rows="6"
                style={{ resize: "vertical", minHeight: "150px" }}
                required
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                Mínimo 20 caracteres. Incluye objetivos, metodología y resultados principales.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Archivo de la Investigación (opcional)</label>
              <input type="file" className="form-input" onChange={handleFileChange} accept=".pdf,.doc,.docx,.tex" />
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
                {loading ? "Creando..." : "Crear Investigación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default InvestigacionModal
