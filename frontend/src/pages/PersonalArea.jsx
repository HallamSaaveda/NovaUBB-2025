import { useEffect, useState } from "react"
import { usePersonalFiles } from "../hooks/usePersonalFiles"
import { useAuth } from "../context/AuthContext"
import { getFileIcon } from "../utils/fileIcons" // ✅ Importar la función correcta
import FileUploadModal from "../components/FileUploadModal"
import FileEditModal from "../components/FileEditModal"

const PersonalArea = () => {
  const { user } = useAuth()
  const { files, loading, fetchFiles, uploadFile, updateFile, deleteFile, downloadFile } = usePersonalFiles()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filters, setFilters] = useState({
    formato: "",
    esFavorito: "",
    tags: "",
  })

  useEffect(() => {
    fetchFiles()
  }, [])

  // Verificar permisos
  if (!["profesor", "admin", "superadmin"].includes(user?.role)) {
    return (
      <div className="home-container">
        <div className="card">
          <div className="card-body" style={{ textAlign: "center" }}>
            <h2>Acceso Denegado</h2>
            <p>Solo profesores y administradores pueden acceder al área personal.</p>
            <p>Tu rol actual: {user?.role || "No definido"}</p>
          </div>
        </div>
      </div>
    )
  }

  const handleUpload = async (file, fileData) => {
    const result = await uploadFile(file, fileData)
    if (result.success) {
      setIsUploadModalOpen(false)
    }
  }

  const handleEdit = (file) => {
    setSelectedFile(file)
    setIsEditModalOpen(true)
  }

  const handleSave = async (updateData) => {
    const result = await updateFile(selectedFile.id, updateData)
    if (result.success) {
      setIsEditModalOpen(false)
      setSelectedFile(null)
    }
  }

  const handleDelete = async (fileId, fileName) => {
    if (window.confirm(`¿Estás seguro de eliminar "${fileName}"?`)) {
      await deleteFile(fileId)
    }
  }

  const handleDownload = async (fileId, fileName) => {
    await downloadFile(fileId, fileName)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getFileFormat = (fileName) => {
    if (!fileName || typeof fileName !== "string") return "Otro"

    const extension = fileName.split(".").pop()?.toLowerCase()
    if (!extension) return "Otro"

    const formats = {
      pdf: "PDF",
      doc: "Word",
      docx: "Word",
      xls: "Excel",
      xlsx: "Excel",
      tex: "LaTeX",
      bib: "BibTeX",
      zip: "ZIP",
      rar: "RAR",
      jpg: "Imagen",
      jpeg: "Imagen",
      png: "Imagen",
      gif: "Imagen",
      webp: "Imagen",
    }
    return formats[extension] || "Otro"
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Filtrar archivos
  let filteredFiles = files

  if (filters.formato) {
    filteredFiles = filteredFiles.filter((file) => getFileFormat(file.nombreOriginal) === filters.formato)
  }

  if (filters.esFavorito) {
    const isFavorite = filters.esFavorito === "true"
    filteredFiles = filteredFiles.filter((file) => file.esFavorito === isFavorite)
  }

  if (filters.tags) {
    const searchTags = filters.tags.toLowerCase()
    filteredFiles = filteredFiles.filter((file) => file.tags && file.tags.toLowerCase().includes(searchTags))
  }

  // Contar formatos
  const formatCounts = files.reduce((acc, file) => {
    const format = getFileFormat(file.nombreOriginal)
    acc[format] = (acc[format] || 0) + 1
    return acc
  }, {})

  // Verificar si puede subir archivos
  const canUpload = user && (user.role === "profesor" || user.role === "admin" || user.role === "superadmin")

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Área Personal</h1>
        <p className="home-subtitle">Tu espacio privado para archivos y documentos</p>
      </div>

      {canUpload && (
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              fontSize: "16px",
              padding: "12px 24px",
            }}
          >
            Subir Archivo
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "var(--primary-color)", margin: 0 }}>Mis Archivos ({filteredFiles.length})</h3>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <label className="form-label">Formato:</label>
              <select name="formato" className="form-input" value={filters.formato} onChange={handleFilterChange}>
                <option value="">Todos</option>
                {Object.entries(formatCounts).map(([format, count]) => (
                  <option key={format} value={format}>
                    {format} ({count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Favoritos:</label>
              <select name="esFavorito" className="form-input" value={filters.esFavorito} onChange={handleFilterChange}>
                <option value="">Todos</option>
                <option value="true">Solo favoritos</option>
                <option value="false">No favoritos</option>
              </select>
            </div>
            <div>
              <label className="form-label">Tags:</label>
              <input
                type="text"
                name="tags"
                className="form-input"
                placeholder="Buscar por tags..."
                value={filters.tags}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de archivos */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="loading">Cargando archivos...</div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "var(--text-light)" }}>
              <h3>No hay archivos</h3>
              <p>
                {filters.formato || filters.esFavorito || filters.tags
                  ? "No se encontraron archivos con los filtros aplicados"
                  : "Sube tu primer archivo para comenzar"}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Archivo</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Formato</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Tamaño</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Carpeta</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Descripción</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {getFileIcon(file.nombreOriginal, "24px")}
                          <div>
                            <strong>{file.nombreOriginal}</strong>
                            {file.esFavorito && <span style={{ color: "#ffc107", marginLeft: "8px" }}>★</span>}
                            {file.tags && (
                              <div>
                                <small style={{ color: "var(--text-light)" }}>Tags: {file.tags}</small>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {getFileFormat(file.nombreOriginal)}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>{formatFileSize(file.tamaño)}</td>
                      <td style={{ padding: "12px" }}>{file.carpeta}</td>
                      <td style={{ padding: "12px" }}>
                        {file.descripcion ? (
                          <span style={{ fontSize: "14px" }}>{file.descripcion}</span>
                        ) : (
                          <span style={{ color: "var(--text-light)", fontStyle: "italic" }}>Sin descripción</span>
                        )}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                            onClick={() => handleDownload(file.id, file.nombreOriginal)}
                          >
                            Descargar
                          </button>
                          {canUpload && (
                            <>
                              <button
                                className="btn btn-primary"
                                style={{ padding: "6px 12px", fontSize: "12px" }}
                                onClick={() => handleEdit(file)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn"
                                style={{
                                  padding: "6px 12px",
                                  fontSize: "12px",
                                  backgroundColor: "#dc3545",
                                  color: "white",
                                }}
                                onClick={() => handleDelete(file.id, file.nombreOriginal)}
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        loading={loading}
      />

      <FileEditModal
        file={selectedFile}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedFile(null)
        }}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  )
}

export default PersonalArea
