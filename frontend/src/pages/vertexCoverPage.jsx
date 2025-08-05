"use client"

import { useState } from "react"
import { vertexCoverService } from "../services/vertex-cover.service"
import styles from "../styles/vertex-cover-page.module.css"
import bioinformaticsStyles from "../styles/bioinformatics.module.css"

const VertexCoverPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nodos: "A, B, C, D, E",
    aristas: "[['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E']]",
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await vertexCoverService.calcularVertexCover(formData)
      setResult(response.data)
    } catch (err) {
      setError(err.message || "Error al calcular vertex cover")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={bioinformaticsStyles.bioinformaticsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          {onBack && (
            <button className={styles.backButton} onClick={onBack}>
              ← Volver
            </button>
          )}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <span className={styles.icon}>🕸️</span>
              Vertex Cover
            </h1>
            <p className={styles.description}>
              Este algoritmo encuentra la cobertura mínima de vértices en un grafo utilizando dos métodos: fuerza bruta
              (óptimo) y greedy (aproximado).
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nodos:</label>
                  <input
                    type="text"
                    name="nodos"
                    value={formData.nodos}
                    onChange={handleInputChange}
                    placeholder="Ej: A, B, C, D, E"
                    className={styles.input}
                  />
                  <small className={styles.hint}>Ingresa los nodos separados por comas</small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Aristas:</label>
                  <input
                    type="text"
                    name="aristas"
                    value={formData.aristas}
                    onChange={handleInputChange}
                    placeholder="Ej: [['A', 'B'], ['A', 'C']]"
                    className={styles.input}
                  />
                  <small className={styles.hint}>Ingresa las aristas en formato de lista de tuplas</small>
                </div>
              </div>

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? "Calculando..." : "Calcular Vertex Cover"}
              </button>
            </form>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <span>❌ {error}</span>
            </div>
          )}

          {result && (
            <div className={styles.resultsSection}>
              <h3 className={styles.resultsTitle}>Resultados del Vertex Cover</h3>

              <div className={styles.graphSummary}>
                <div className={styles.summaryItem}>
                  <strong>Total de nodos:</strong> {result.total_nodos}
                </div>
                <div className={styles.summaryItem}>
                  <strong>Total de aristas:</strong> {result.total_aristas}
                </div>
              </div>

              <div className={styles.methodsComparison}>
                <div className={styles.methodResult}>
                  <h4 className={styles.methodTitle}>🔄 Fuerza Bruta (Óptimo)</h4>
                  <div className={styles.stats}>
                    <p>
                      <strong>Tiempo:</strong> {result.fuerza_bruta.tiempo_ms} ms
                    </p>
                    <p>
                      <strong>Tamaño del vertex cover:</strong> {result.fuerza_bruta.tamaño}
                    </p>
                    <p>
                      <strong>Vértices seleccionados:</strong> [{result.fuerza_bruta.vertex_cover.join(", ")}]
                    </p>
                  </div>
                </div>

                <div className={styles.methodResult}>
                  <h4 className={styles.methodTitle}>⚡ Greedy (Aproximado)</h4>
                  <div className={styles.stats}>
                    <p>
                      <strong>Tiempo:</strong> {result.greedy.tiempo_ms} ms
                    </p>
                    <p>
                      <strong>Tamaño del vertex cover:</strong> {result.greedy.tamaño}
                    </p>
                    <p>
                      <strong>Vértices seleccionados:</strong> [{result.greedy.vertex_cover.join(", ")}]
                    </p>
                  </div>
                </div>
              </div>

              {result.grafico_base64 && (
                <div className={styles.graphVisualization}>
                  <h4 className={styles.sectionTitle}>📊 Visualización del Grafo</h4>
                  <div className={styles.graphImage}>
                    <img
                      src={`data:image/png;base64,${result.grafico_base64}`}
                      alt="Vertex Cover Visualization"
                      className={styles.graphImg}
                    />
                  </div>
                  <div className={styles.graphLegend}>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ backgroundColor: "#90EE90" }}></span>
                      <span>Fuerza Bruta (Óptimo)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ backgroundColor: "#FFA500" }}></span>
                      <span>Greedy (Aproximado)</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.performanceAnalysis}>
                <h4 className={styles.sectionTitle}>📊 Análisis de Rendimiento</h4>
                <div className={styles.analysisStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Método más rápido:</span>
                    <span className={styles.statValue}>
                      {result.fuerza_bruta.tiempo_ms < result.greedy.tiempo_ms ? "Fuerza Bruta" : "Greedy"}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Mejor aproximación:</span>
                    <span className={styles.statValue}>
                      {result.fuerza_bruta.tamaño <= result.greedy.tamaño ? "Fuerza Bruta" : "Greedy"}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Diferencia de tamaño:</span>
                    <span className={styles.statValue}>
                      {Math.abs(result.fuerza_bruta.tamaño - result.greedy.tamaño)} vértices
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VertexCoverPage
