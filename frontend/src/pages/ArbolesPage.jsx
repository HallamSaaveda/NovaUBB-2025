import { useState } from "react"
import { arbolesService } from "../services/arboles.service"
import styles from "../styles/arboles-page.module.css"
import bioinformaticsStyles from "../styles/bioinformatics.module.css"

const ArbolesPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    matriz: "[[0, 2, 4], [2, 0, 5], [4, 5, 0]]",
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
      const response = await arbolesService.generarArboles(formData)
      setResult(response.data)
    } catch (err) {
      setError(err.message || "Error al generar árboles")
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
              <span className={styles.icon}>🌳</span>
              Árboles Jerárquicos
            </h1>
            <p className={styles.description}>
              Este algoritmo genera árboles ultramétricos y aditivos a partir de matrices de distancia utilizando
              clustering jerárquico con diferentes métodos de enlace.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Matriz de Distancias:</label>
                <textarea
                  name="matriz"
                  value={formData.matriz}
                  onChange={handleInputChange}
                  placeholder="Ej: [[0, 2, 4], [2, 0, 5], [4, 5, 0]]"
                  className={styles.textarea}
                  rows="4"
                />
                <small className={styles.hint}>
                  Ingresa una matriz cuadrada simétrica con ceros en la diagonal. Ej: [[0, 2, 4], [2, 0, 5], [4, 5, 0]]
                </small>
              </div>

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? "Generando..." : "Generar Árboles"}
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
              <h3 className={styles.resultsTitle}>Resultados de los Árboles Jerárquicos</h3>

              <div className={styles.matrixSummary}>
                <h4 className={styles.sectionTitle}>📊 Información de la Matriz</h4>
                <div className={styles.summaryStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Tamaño de matriz:</span>
                    <span className={styles.statValue}>
                      {result.tamaño_matriz} x {result.tamaño_matriz}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total de distancias:</span>
                    <span className={styles.statValue}>{result.total_distancias}</span>
                  </div>
                </div>

                <div className={styles.matrixDisplay}>
                  <h5 className={styles.matrixTitle}>Matriz Original:</h5>
                  <div className={styles.matrixTable}>
                    {result.matriz_original.map((row, i) => (
                      <div key={i} className={styles.matrixRow}>
                        {row.map((cell, j) => (
                          <span key={j} className={styles.matrixCell}>
                            {cell}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.treesComparison}>
                <div className={styles.treeResult}>
                  <h4 className={styles.treeTitle}>🌳 Árbol Ultramétrico</h4>
                  <div className={styles.treeInfo}>
                    <p>
                      <strong>Método:</strong> {result.arbol_ultrametrico.metodo}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {result.arbol_ultrametrico.descripcion}
                    </p>
                  </div>
                  {result.arbol_ultrametrico.imagen_base64 && (
                    <div className={styles.treeVisualization}>
                      <img
                        src={`data:image/png;base64,${result.arbol_ultrametrico.imagen_base64}`}
                        alt="Árbol Ultramétrico"
                        className={styles.treeImage}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.treeResult}>
                  <h4 className={styles.treeTitle}>🌲 Árbol Aditivo</h4>
                  <div className={styles.treeInfo}>
                    <p>
                      <strong>Método:</strong> {result.arbol_aditivo.metodo}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {result.arbol_aditivo.descripcion}
                    </p>
                  </div>
                  {result.arbol_aditivo.imagen_base64 && (
                    <div className={styles.treeVisualization}>
                      <img
                        src={`data:image/png;base64,${result.arbol_aditivo.imagen_base64}`}
                        alt="Árbol Aditivo"
                        className={styles.treeImage}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.algorithmExplanation}>
                <h4 className={styles.sectionTitle}>📚 Explicación de los Algoritmos</h4>
                <div className={styles.explanationContent}>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>🌳 Árbol Ultramétrico (Average Linkage)</h5>
                    <p className={styles.explanationText}>
                      Utiliza el método de enlace promedio para clustering jerárquico. La distancia entre dos clusters
                      se calcula como el promedio de todas las distancias entre pares de elementos de diferentes
                      clusters.
                    </p>
                  </div>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>🌲 Árbol Aditivo (Single Linkage)</h5>
                    <p className={styles.explanationText}>
                      Utiliza el método de enlace simple para clustering jerárquico. La distancia entre dos clusters se
                      calcula como la distancia mínima entre cualquier par de elementos de diferentes clusters.
                    </p>
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

export default ArbolesPage
