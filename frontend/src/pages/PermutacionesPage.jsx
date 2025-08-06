import { useState } from "react";
import { permutacionesService } from "../services/permutaciones.service";
import styles from "../styles/permutaciones-page.module.css";
import bioinformaticsStyles from "../styles/bioinformatics.module.css";

const PermutacionesPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    secuencia: "ABC",
    tipo: "texto",
    molecula: "ADN",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAllBacktracking, setShowAllBacktracking] = useState(false);
  const [showAllItertools, setShowAllItertools] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      if (!formData.secuencia.trim()) {
        throw new Error("La secuencia no puede estar vacía");
      }
      if (formData.secuencia.length > 8) {
        throw new Error(
          "La secuencia no puede tener más de 8 caracteres para mejor rendimiento"
        );
      }

      const dataToSend = {
        secuencia: formData.secuencia.trim(),
        tipo: formData.tipo,
      };

      if (formData.tipo === "biologico") {
        dataToSend.molecula = formData.molecula;
      }

      console.log("Datos enviados al backend:", dataToSend);

      const response = await permutacionesService.generarPermutaciones(
        dataToSend
      );
      setResult(response.data);
      setShowAllBacktracking(false);
      setShowAllItertools(false);
    } catch (err) {
      setError(err.message || "Error al generar permutaciones");
    } finally {
      setLoading(false);
    }
  };

  const getTipoDescription = () => {
    switch (formData.tipo) {
      case "texto":
        return "Permutaciones de caracteres de texto";
      case "numerico":
        return "Permutaciones de dígitos numéricos";
      case "biologico":
        return `Permutaciones de secuencia ${formData.molecula}`;
      default:
        return "Permutaciones generales";
    }
  };

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
              <span className={styles.icon}>🔄</span>
              Generación de Permutaciones
            </h1>
            <p className={styles.description}>
              Este algoritmo genera todas las permutaciones posibles de una
              secuencia utilizando dos métodos: backtracking (recursivo) e
              itertools (iterativo).
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secuencia:</label>
                  <input
                    type="text"
                    name="secuencia"
                    value={formData.secuencia}
                    onChange={handleInputChange}
                    placeholder="Ej: ABC, 123, ATCG"
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Ingresa caracteres únicos (máximo 8 para mejor rendimiento)
                  </small>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo de Secuencia:</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="texto">Texto</option>
                    <option value="numerico">Númerico</option>
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
                    <small className={styles.hint}>
                      Especifica si es una secuencia de ADN o ARN
                    </small>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Generando..." : "Generar Permutaciones"}
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
              <h3 className={styles.resultsTitle}>
                Resultados de Permutaciones
              </h3>
              <div className={styles.sequenceInfo}>
                <div className={styles.infoItem}>
                  <strong>Secuencia original:</strong> {result.secuencia}
                </div>
                <div className={styles.infoItem}>
                  <strong>Tipo:</strong> {result.tipo}
                  {result.molecula && ` (${result.molecula})`}
                </div>
              </div>
              <div className={styles.comparisonResults}>
                <div className={styles.methodResult}>
                  <h4 className={styles.methodTitle}>🔄 Backtracking</h4>
                  <div className={styles.stats}>
                    <p>
                      <strong>Tiempo:</strong>{" "}
                      {result.backtracking.tiempo_ms.toFixed(4)} ms
                    </p>
                    <p>
                      <strong>Total de permutaciones:</strong>{" "}
                      {result.backtracking.total_permutaciones.toLocaleString()}
                    </p>
                    <p>
                      <strong>Método:</strong> {result.backtracking.metodo}
                    </p>
                  </div>
                  <div className={styles.permutationsList}>
                    <h5 className={styles.listTitle}>
                      {showAllBacktracking
                        ? "Todas las permutaciones:"
                        : "Primeras permutaciones:"}
                    </h5>
                    <div className={styles.permutationsGrid}>
                      {result.backtracking.permutaciones
                        .slice(
                          0,
                          showAllBacktracking
                            ? result.backtracking.permutaciones.length
                            : 20
                        )
                        .map((perm, index) => (
                          <span key={index} className={styles.permutationItem}>
                            {perm}
                          </span>
                        ))}
                    </div>
                    {result.backtracking.permutaciones.length > 20 && (
                      <div className={styles.permutationControls}>
                        {!showAllBacktracking ? (
                          <>
                            <p className={styles.moreInfo}>
                              ... y{" "}
                              {(
                                result.backtracking.permutaciones.length - 20
                              ).toLocaleString()}{" "}
                              más
                            </p>
                            <button
                              className={styles.showAllButton}
                              onClick={() => setShowAllBacktracking(true)}
                            >
                              📋 Mostrar todas las permutaciones
                            </button>
                          </>
                        ) : (
                          <button
                            className={styles.showLessButton}
                            onClick={() => setShowAllBacktracking(false)}
                          >
                            📄 Mostrar solo las primeras 20
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.methodResult}>
                  <h4 className={styles.methodTitle}>⚡ Itertools</h4>
                  <div className={styles.stats}>
                    <p>
                      <strong>Tiempo:</strong>{" "}
                      {result.itertools.tiempo_ms.toFixed(4)} ms
                    </p>
                    <p>
                      <strong>Total de permutaciones:</strong>{" "}
                      {result.itertools.total_permutaciones.toLocaleString()}
                    </p>
                    <p>
                      <strong>Método:</strong> {result.itertools.metodo}
                    </p>
                  </div>
                  <div className={styles.permutationsList}>
                    <h5 className={styles.listTitle}>
                      {showAllItertools
                        ? "Todas las permutaciones:"
                        : "Primeras permutaciones:"}
                    </h5>
                    <div className={styles.permutationsGrid}>
                      {result.itertools.permutaciones
                        .slice(
                          0,
                          showAllItertools
                            ? result.itertools.permutaciones.length
                            : 20
                        )
                        .map((perm, index) => (
                          <span key={index} className={styles.permutationItem}>
                            {perm}
                          </span>
                        ))}
                    </div>
                    {result.itertools.permutaciones.length > 20 && (
                      <div className={styles.permutationControls}>
                        {!showAllItertools ? (
                          <>
                            <p className={styles.moreInfo}>
                              ... y{" "}
                              {(
                                result.itertools.permutaciones.length - 20
                              ).toLocaleString()}{" "}
                              más
                            </p>
                            <button
                              className={styles.showAllButton}
                              onClick={() => setShowAllItertools(true)}
                            >
                              📋 Mostrar todas las permutaciones
                            </button>
                          </>
                        ) : (
                          <button
                            className={styles.showLessButton}
                            onClick={() => setShowAllItertools(false)}
                          >
                            📄 Mostrar solo las primeras 20
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.performanceComparison}>
                <h4 className={styles.sectionTitle}>
                  📊 Comparación de Rendimiento
                </h4>
                <div className={styles.comparisonStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Método más rápido:</span>
                    <span className={styles.statValue}>
                      {result.backtracking.tiempo_ms <
                      result.itertools.tiempo_ms
                        ? "Backtracking"
                        : "Itertools"}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>
                      Diferencia de tiempo:
                    </span>
                    <span className={styles.statValue}>
                      {Math.abs(
                        result.backtracking.tiempo_ms -
                          result.itertools.tiempo_ms
                      ).toFixed(4)}{" "}
                      ms
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>
                      Eficiencia relativa:
                    </span>
                    <span className={styles.statValue}>
                      {result.backtracking.tiempo_ms <
                      result.itertools.tiempo_ms
                        ? `Backtracking es ${(
                            result.itertools.tiempo_ms /
                            result.backtracking.tiempo_ms
                          ).toFixed(2)}x más rápido`
                        : `Itertools es ${(
                            result.backtracking.tiempo_ms /
                            result.itertools.tiempo_ms
                          ).toFixed(2)}x más rápido`}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.algorithmExplanation}>
                <h4 className={styles.sectionTitle}>
                  📚 Explicación de los Algoritmos
                </h4>
                <div className={styles.explanationContent}>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>
                      🔄 Backtracking (Recursivo)
                    </h5>
                    <p className={styles.explanationText}>
                      Utiliza recursión para generar permutaciones
                      intercambiando elementos. Es intuitivo y fácil de
                      entender, pero puede ser menos eficiente en memoria para
                      secuencias largas debido a la pila de llamadas recursivas.
                    </p>
                  </div>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>
                      ⚡ Itertools (Iterativo)
                    </h5>
                    <p className={styles.explanationText}>
                      Implementa un algoritmo iterativo optimizado que genera
                      permutaciones de manera más eficiente en memoria. Utiliza
                      técnicas de generación lexicográfica para producir todas
                      las permutaciones de forma sistemática.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermutacionesPage;
