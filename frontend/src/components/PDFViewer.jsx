"use client"

import { useState } from "react"
import { Document, Page } from 'react-pdf';
import 'pdfjs-dist/web/pdf_viewer.css';


// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const PDFViewer = ({ pdfUrl, fileName }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scale, setScale] = useState(1.0)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error)
    setError("Error al cargar el PDF. Intenta descargarlo en su lugar.")
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const resetZoom = () => {
    setScale(1.0)
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "48px" }}>
        <div className="loading">Cargando PDF...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          border: "1px solid #f5c6cb",
        }}
      >
        <h3>⚠️ Error al cargar PDF</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Controles */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          padding: "12px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Navegación de páginas */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="btn btn-secondary"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            style={{ padding: "6px 12px", fontSize: "14px" }}
          >
            ← Anterior
          </button>
          <span style={{ padding: "0 12px", fontSize: "14px", fontWeight: "500" }}>
            Página {pageNumber} de {numPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            style={{ padding: "6px 12px", fontSize: "14px" }}
          >
            Siguiente →
          </button>
        </div>

        {/* Controles de zoom */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="btn btn-secondary"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            style={{ padding: "6px 12px", fontSize: "14px" }}
          >
            🔍-
          </button>
          <span style={{ padding: "0 8px", fontSize: "14px", fontWeight: "500" }}>{Math.round(scale * 100)}%</span>
          <button
            className="btn btn-secondary"
            onClick={zoomIn}
            disabled={scale >= 2.0}
            style={{ padding: "6px 12px", fontSize: "14px" }}
          >
            🔍+
          </button>
          <button className="btn btn-secondary" onClick={resetZoom} style={{ padding: "6px 12px", fontSize: "14px" }}>
            Reset
          </button>
        </div>
      </div>

      {/* Visor de PDF */}
      <div
        style={{
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          overflow: "auto",
          maxHeight: "800px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            style={{
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              backgroundColor: "white",
            }}
          />
        </Document>
      </div>

      {/* Información del archivo */}
      <div style={{ marginTop: "12px", textAlign: "center" }}>
        <small style={{ color: "var(--text-light)" }}>
          📄 {fileName} • {numPages} página{numPages !== 1 ? "s" : ""}
        </small>
      </div>
    </div>
  )
}

export default PDFViewer
