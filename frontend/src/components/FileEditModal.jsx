"use client"

import { useState, useEffect } from "react"

const FileEditModal = ({ file, isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    carpeta: "",
    tags: "",
    esFavorito: false,
  })

  useEffect(() => {
    if (file) {
      setFormData({
        descripcion: file.descripcion || "",
        carpeta: file.carpeta || "",
        tags: file.tags || "",
        esFavorito: file.esFavorito || false,
      })
    }
  }, [file])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
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
          <h3 style={{ marginBottom: "24px", color: "var(--primary-color)" }}>Editar: {file?.nombreOriginal}</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Carpeta</label>
              <input
                type="text"
                name="carpeta"
                className="form-input"
                value={formData.carpeta}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-input"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input type="text" name="tags" className="form-input" value={formData.tags} onChange={handleChange} />
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
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FileEditModal
