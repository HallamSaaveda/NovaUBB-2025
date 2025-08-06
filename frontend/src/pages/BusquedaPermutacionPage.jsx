import { useState } from "react"
import { busquedaPermutacionService } from "../services/busqueda-permutacion.service"
import styles from "../styles/busqueda-permutacion-page.module.css"
import bioinformaticsStyles from "../styles/bioinformatics.module.css"

const BusquedaPermutacionPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    tipo: "texto",
    molecula: "ADN",
    inicial: "A,B,C",
    objetivo: "B,C,A",
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

  const parseSequenceInput = (input, tipo) => {
    const elements = input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")

    if (tipo === "numerico") {
      return elements.map((item) => {
        const num = Number.parseInt(item)
        return isNaN(num) ? item : num
      })
    }

    return elements
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      if (!formData.inicial.trim() || !formData.objetivo.trim()) {
        throw new Error("Las secuencias inicial y objetivo no pueden estar vacías")
      }

      const inicialArray = parseSequenceInput(formData.inicial, formData.tipo)
      const objetivoArray = parseSequenceInput(formData.objetivo, formData.tipo)

      if (inicialArray.length !== objetivoArray.length) {
        throw new Error("Las secuencias inicial y objetivo deben tener la misma longitud")
      }

      if (inicialArray.length > 6) {
        throw new Error("Las secuencias no pueden tener más de 6 elementos para mejor rendimiento")
      }

      const inicialSorted = [...inicialArray].sort()
      const objetivoSorted = [...objetivoArray].sort()
      if (JSON.stringify(inicialSorted) !== JSON.stringify(objetivoSorted)) {
        throw new Error("Las secuencias deben contener los mismos elementos")
      }

      const dataToSend = {
        tipo: formData.tipo,
        inicial: inicialArray,
        objetivo: objetivoArray,
      }

      if (formData.tipo === "biologico") {
        dataToSend.molecula = formData.molecula
      }

      const response = await busquedaPermutacionService.buscarPermutacion(dataToSend)
      setResult(response.data)
    } catch (err) {
      setError(err.message || "Error al buscar permutación")
    } finally {
      setLoading(false)
    }
  }

  const getTipoDescription = () => {
    switch (formData.tipo) {
      case "texto":
        return "Búsqueda en secuencias de texto"
      case "numerico":
        return "Búsqueda en secuencias numéricas"
      case "biologico":
        return `Búsqueda en secuencias ${formData.molecula}`
      default:
        return "Búsqueda general"
    }
  }

  const getPlaceholderText = (field) => {
    switch (formData.tipo) {
      case "texto":
        return field === "inicial" ? "A,B,C" : "B,C,A"
      case "numerico":
        return field === "inicial" ? "1,2,3" : "2,3,1"
      case "biologico":
        return formData.molecula === "ADN"
          ? field === "inicial"
            ? "A,T,C,G"
            : "T,C,G,A"
          : field === "inicial"
            ? "A,U,C,G"
            : "U,C,G,A"
      default:
        return "Ingresa elementos separados por comas"
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
              <span className={styles.icon}>🔍</span>
              Búsqueda de Permutación
            </h1>
            <p className={styles.description}>
              Este algoritmo busca una secuencia objetivo generando todas las permutaciones posibles de una secuencia
              inicial hasta encontrar la coincidencia.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo de Secuencia:</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} className={styles.select}>
                    <option value="texto">Texto</option>
                    <option value="numerico">Número</option>
                    <option value="biologico">Biológico</option>
                  </select>
                  <small className={styles.hint}>{getTipoDescription()}</small>
                </div>

                {formData.tipo === "biologico" && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tipo de Molécula:</label>
                    <select
                      name="molecula"
                      value={formData.molecula}
                      onChange={handleInputChange}
                      className={styles.select}
                    >
                      <option value="ADN">ADN</option>
                      <option value="ARN">ARN</option>
                    </select>
                    <small className={styles.hint}>Especifica si es una secuencia de ADN o ARN</small>
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secuencia Inicial:</label>
                  <input
                    type="text"
                    name="inicial"
                    value={formData.inicial}
                    onChange={handleInputChange}
                    placeholder={getPlaceholderText("inicial")}
                    className={styles.input}
                  />
                  <small className={styles.hint}>Elementos separados por comas (máximo 6 elementos)</small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Secuencia Objetivo:</label>
                  <input
                    type="text"
                    name="objetivo"
                    value={formData.objetivo}
                    onChange={handleInputChange}
                    placeholder={getPlaceholderText("objetivo")}
                    className={styles.input}
                  />
                  <small className={styles.hint}>Debe contener los mismos elementos que la secuencia inicial</small>
                </div>
              </div>

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? "Buscando..." : "Buscar Permutación"}
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
              <h3 className={styles.resultsTitle}>Resultados de la Búsqueda</h3>

              <div className={styles.searchSummary}>
                <div className={styles.summaryItem}>
                  <strong>Secuencia inicial:</strong>
                  <span className={styles.sequenceValue}>
                    [{parseSequenceInput(formData.inicial, formData.tipo).join(", ")}]
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>Secuencia objetivo:</strong>
                  <span className={styles.sequenceValue}>
                    [{parseSequenceInput(formData.objetivo, formData.tipo).join(", ")}]
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>Total de pasos:</strong>
                  <span className={styles.stepsValue}>{result.pasos}</span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>Permutación encontrada:</strong>
                  <span className={`${styles.resultValue} ${result.permutacion ? styles.found : styles.notFound}`}>
                    {result.permutacion ? `[${result.permutacion.join(", ")}]` : "No encontrada"}
                  </span>
                </div>
              </div>

              <div className={styles.searchProcess}>
                <h4 className={styles.sectionTitle}>📋 Proceso de Búsqueda</h4>
                <div className={styles.stepsLog}>
                  {result.log_pasos?.map((paso, index) => (
                    <div
                      key={index}
                      className={`${styles.logStep} ${index === result.pasos - 1 && result.permutacion ? styles.foundStep : ""}`}
                    >
                      <span className={styles.stepNumber}>{index + 1}</span>
                      <span className={styles.stepContent}>{paso}</span>
                      {index === result.pasos - 1 && result.permutacion && (
                        <span className={styles.foundBadge}>✓ Encontrado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.searchAnalysis}>
                <h4 className={styles.sectionTitle}>📊 Análisis de la Búsqueda</h4>
                <div className={styles.analysisStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Estado:</span>
                    <span className={`${styles.statValue} ${result.permutacion ? styles.success : styles.failure}`}>
                      {result.permutacion ? "✓ Encontrado" : "✗ No encontrado"}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Eficiencia:</span>
                    <span className={styles.statValue}>
                      {result.pasos} de{" "}
                      {Math.factorial
                        ? Math.factorial(parseSequenceInput(formData.inicial, formData.tipo).length)
                        : "N!"}{" "}
                      posibles
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Complejidad temporal:</span>
                    <span className={styles.statValue}>O(n!)</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Complejidad espacial:</span>
                    <span className={styles.statValue}>O(n!)</span>
                  </div>
                </div>
              </div>

              <div className={styles.algorithmExplanation}>
                <h4 className={styles.sectionTitle}>📚 Explicación del Algoritmo</h4>
                <div className={styles.explanationContent}>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>🔍 Búsqueda Exhaustiva</h5>
                    <p className={styles.explanationText}>
                      El algoritmo genera permutaciones de la secuencia inicial de forma sistemática hasta encontrar la
                      secuencia objetivo. Utiliza un enfoque de fuerza bruta que garantiza encontrar la solución si
                      existe, pero puede ser costoso computacionalmente para secuencias largas.
                    </p>
                  </div>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>⚡ Optimizaciones Posibles</h5>
                    <p className={styles.explanationText}>
                      Para mejorar la eficiencia, se podrían implementar heurísticas como algoritmos genéticos, búsqueda
                      A* con funciones de evaluación, o técnicas de poda para reducir el espacio de búsqueda.
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

export default BusquedaPermutacionPage
