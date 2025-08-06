import { useState, useEffect } from "react"
import proyectoTituloService from "../services/proyectoTituloService"

const PdfViewer = ({ proyectoId, fileName, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPdf()
    return () => {
      // Limpiar URL del blob al desmontar
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [proyectoId])

  const loadPdf = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = await proyectoTituloService.getPdfViewUrl(proyectoId)
      setPdfUrl(url)
    } catch (err) {
      setError("Error al cargar el PDF: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
      onClick={onClose} // Cerrar al hacer clic en el fondo
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1000px",
          height: "85%",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer clic en el modal
      >
        {/* Header con título y botón cerrar */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <h3 style={{ margin: 0, color: "var(--primary-color)", fontSize: "18px" }}>
            📄 {fileName}
          </h3>
          
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
              padding: "5px 10px",
              borderRadius: "50%",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f0f0f0"
              e.target.style.color = "#333"
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent"
              e.target.style.color = "#666"
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenido del PDF */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          {loading && (
            <div style={{ textAlign: "center", color: "var(--text-dark)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
              <div>Cargando PDF...</div>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", color: "#dc3545", maxWidth: "400px", padding: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
              <div style={{ marginBottom: "16px" }}>{error}</div>
              <button 
                className="btn btn-primary" 
                onClick={loadPdf}
                style={{ marginTop: "16px" }}
              >
                Reintentar
              </button>
            </div>
          )}

          {pdfUrl && !loading && !error && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              title="PDF Viewer"
              style={{
                border: "none",
              }}
              onLoad={() => {
                console.log("PDF loaded successfully")
              }}
              onError={(e) => {
                console.error("Error loading PDF in iframe:", e)
                setError("Error al mostrar el PDF en el navegador")
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default PdfViewer
