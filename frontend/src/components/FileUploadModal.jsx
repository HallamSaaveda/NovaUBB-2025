"use client"

import { useState } from "react"

const FileUploadModal = ({ isOpen, onClose, onUpload, loading }) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    carpeta: "General",
    tags: "",
    esFavorito: false,
  })
  const [selectedFile, setSelectedFile] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedFile) {
      alert("Por favor selecciona un archivo")
      return
    }
    onUpload(selectedFile, formData)
  }

  const resetForm = () => {
    setFormData({
      descripcion: "",
      carpeta: "General",
      tags: "",
      esFavorito: false,
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
      }}
    >
      <div className="card" style={{ width: "500px", maxWidth: "90vw" }}>
        <div className="card-body">
          <h3 style={{ marginBottom: "24px", color: "var(--primary-color)" }}>Subir Archivo Personal</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Archivo *</label>
              <input
                type="file"
                className="form-input"
                onChange={handleFileChange}
                required
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.tex,.bib,.zip,.rar"
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>
                Formatos: PDF, Word, Excel, Imágenes, LaTeX, BibTeX, ZIP, RAR
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Carpeta</label>
              <input
                type="text"
                name="carpeta"
                className="form-input"
                placeholder="General"
                value={formData.carpeta}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-input"
                placeholder="Descripción del archivo..."
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                name="tags"
                className="form-input"
                placeholder="bioinformática, análisis, datos"
                value={formData.tags}
                onChange={handleChange}
              />
              <small style={{ color: "var(--text-light)", fontSize: "12px" }}>Separar con comas</small>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                name="esFavorito"
                id="esFavorito"
                checked={formData.esFavorito}
                onChange={handleChange}
              />
              <label htmlFor="esFavorito">Marcar como favorito</label>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
              <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Subiendo..." : "Subir Archivo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FileUploadModal
