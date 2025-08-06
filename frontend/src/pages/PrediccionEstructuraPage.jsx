"use client";
import { useState } from "react";
import { predecirEstructuraService } from "../services/prediccionEstructura.service";
import styles from "../styles/prediccion-estructura-page.module.css";
import bioinformaticsStyles from "../styles/bioinformatics.module.css";

const PrediccionEstructuraPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    tipo: "ARN",
    secuencia: "AUGGCUACUGAA",
    iteraciones: 10000,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredPair, setHoveredPair] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Validaciones básicas
      if (!formData.secuencia.trim()) {
        throw new Error("La secuencia no puede estar vacía");
      }
      if (formData.secuencia.length < 4) {
        throw new Error("La secuencia debe tener al menos 4 nucleótidos");
      }
      if (formData.secuencia.length > 100) {
        throw new Error(
          "La secuencia no puede tener más de 100 nucleótidos para mejor rendimiento"
        );
      }
      if (formData.iteraciones < 1000 || formData.iteraciones > 400000) {
        throw new Error("Las iteraciones deben estar entre 1,000 y 400,000");
      }

      // Validar nucleótidos según el tipo
      const secuenciaUpper = formData.secuencia.toUpperCase();
      if (formData.tipo === "ARN") {
        if (!/^[AUCG]+$/.test(secuenciaUpper)) {
          throw new Error(
            "La secuencia de ARN solo debe contener nucleótidos válidos: A, U, C, G"
          );
        }
      } else if (formData.tipo === "ADN") {
        if (!/^[ATCG]+$/.test(secuenciaUpper)) {
          throw new Error(
            "La secuencia de ADN solo debe contener nucleótidos válidos: A, T, C, G"
          );
        }
      }

      const dataToSend = {
        tipo: formData.tipo,
        secuencia: secuenciaUpper,
        iteraciones: formData.iteraciones,
      };

      console.log("Datos enviados al backend:", dataToSend);

      const response = await predecirEstructuraService.ejecutarAlineamiento(
        dataToSend
      );
      setResult(response.data);

      console.log("Resultado recibido:", response.data);
    } catch (err) {
      setError(err.message || "Error al predecir la estructura");
    } finally {
      setLoading(false);
    }
  };

  const getPairColor = (base1, base2) => {
    const pair = `${base1}-${base2}`;
    switch (pair) {
      case "A-U":
      case "U-A":
        return "#ef4444"; // Rojo
      case "G-C":
      case "C-G":
        return "#3b82f6"; // Azul
      case "G-U":
      case "U-G":
        return "#f59e0b"; // Amarillo
      default:
        return "#6b7280"; // Gris
    }
  };

  const getPairStrength = (base1, base2) => {
    const pair = `${base1}-${base2}`;
    switch (pair) {
      case "G-C":
      case "C-G":
        return "Fuerte (3 puentes H)";
      case "A-U":
      case "U-A":
        return "Medio (2 puentes H)";
      case "G-U":
      case "U-G":
        return "Débil (1 puente H)";
      default:
        return "Desconocido";
    }
  };

  const getPairEnergy = (base1, base2) => {
    const pair = `${base1}-${base2}`;
    switch (pair) {
      case "G-C":
      case "C-G":
        return -3.0; // kcal/mol - más estable
      case "A-U":
      case "U-A":
      case "A-T":
      case "T-A":
        return -2.0; // kcal/mol - estabilidad media
      case "G-U":
      case "U-G":
        return -1.0; // kcal/mol - menos estable
      default:
        return 0.0;
    }
  };

  const getSequenceVisualization = () => {
    if (!result?.estructura?.pares) return null;

    const sequence = result.secuencia.split("");
    const pairedPositions = new Set();

    // Marcar posiciones que están emparejadas
    result.estructura.pares.forEach(([pos1, pos2]) => {
      pairedPositions.add(pos1);
      pairedPositions.add(pos2);
    });

    return sequence.map((nucleotide, index) => ({
      nucleotide,
      index,
      isPaired: pairedPositions.has(index),
    }));
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
              <span className={styles.icon}>🧬</span>
              Predicción de Estructura Secundaria
            </h1>
            <p className={styles.description}>
              Algoritmo de predicción de estructura secundaria de ARN/ADN
              utilizando programación dinámica para encontrar la configuración
              de pares de bases con menor energía libre.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo de Molécula:</label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="ARN">ARN</option>
                    <option value="ADN">ADN</option>
                  </select>
                  <small className={styles.hint}>
                    {formData.tipo === "ARN"
                      ? "ARN: Permite pares A-U, G-C y G-U"
                      : "ADN: Permite pares A-T y G-C"}
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Iteraciones:</label>
                  <input
                    type="number"
                    name="iteraciones"
                    value={formData.iteraciones}
                    onChange={handleInputChange}
                    min="1000"
                    max="400000"
                    step="1000"
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Número de iteraciones para el algoritmo (1,000 - 100,000)
                  </small>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Secuencia:</label>
                <textarea
                  name="secuencia"
                  value={formData.secuencia}
                  onChange={handleInputChange}
                  placeholder={
                    formData.tipo === "ARN" ? "AUGGCUACUGAA" : "ATGGCTACTGAA"
                  }
                  className={styles.textarea}
                  rows="3"
                />
                <small className={styles.hint}>
                  Secuencia de {formData.tipo} (4-100 nucleótidos). Solo se
                  permiten:{" "}
                  {formData.tipo === "ARN" ? "A, U, C, G" : "A, T, C, G"}
                </small>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Prediciendo..." : "Predecir Estructura"}
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
                Predicción de Estructura Secundaria
              </h3>

              <div className={styles.summarySection}>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>🧬</div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryLabel}>Secuencia</div>
                      <div className={styles.summaryValue}>
                        {result.secuencia.length > 12
                          ? `${result.secuencia.slice(0, 12)}...`
                          : result.secuencia}
                      </div>
                    </div>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>🔗</div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryLabel}>Pares de Bases</div>
                      <div className={styles.summaryValue}>
                        {result.estructura.pares.length}
                      </div>
                    </div>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>⚡</div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryLabel}>Energía Total</div>
                      <div className={styles.summaryValue}>
                        {result.estructura.energia_total} kcal/mol
                      </div>
                    </div>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>⏱️</div>
                    <div className={styles.summaryContent}>
                      <div className={styles.summaryLabel}>Tiempo</div>
                      <div className={styles.summaryValue}>
                        {result.estructura.tiempo_ms.toFixed(2)} ms
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sequenceVisualization}>
                <h4 className={styles.sectionTitle}>
                  📊 Visualización de la Secuencia
                </h4>
                <div className={styles.sequenceContainer}>
                  {getSequenceVisualization()?.map((item, index) => (
                    <div
                      key={index}
                      className={`${styles.nucleotideBox} ${
                        item.isPaired ? styles.paired : styles.unpaired
                      }`}
                    >
                      <span className={styles.nucleotideLabel}>
                        {item.nucleotide}
                      </span>
                      <span className={styles.positionLabel}>{index}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.sequenceLegend}>
                  <div className={styles.legendItem}>
                    <div
                      className={`${styles.legendBox} ${styles.paired}`}
                    ></div>
                    <span>Emparejado</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div
                      className={`${styles.legendBox} ${styles.unpaired}`}
                    ></div>
                    <span>Sin emparejar</span>
                  </div>
                </div>
              </div>

              <div className={styles.pairsSection}>
                <div className={styles.pairsHeader}>
                  <h4 className={styles.sectionTitle}>
                    🔗 Pares de Bases Formados
                  </h4>

                  {/* Leyenda de tipos de pares */}
                  <div className={styles.pairsLegend}>
                    <h5 className={styles.legendTitle}>Tipos de Pares:</h5>
                    <div className={styles.legendGrid}>
                      <div className={styles.legendPair}>
                        <div className={styles.legendBases}>
                          <div
                            className={styles.legendBase}
                            style={{
                              backgroundColor: "#3b82f620",
                              color: "#3b82f6",
                              borderColor: "#3b82f6",
                            }}
                          >
                            G
                          </div>
                          <span className={styles.legendConnector}>•••</span>
                          <div
                            className={styles.legendBase}
                            style={{
                              backgroundColor: "#3b82f620",
                              color: "#3b82f6",
                              borderColor: "#3b82f6",
                            }}
                          >
                            C
                          </div>
                        </div>
                        <div className={styles.legendInfo}>
                          <span className={styles.legendType}>G-C</span>
                          <span className={styles.legendStrength}>
                            Fuerte (-3.0 kcal/mol)
                          </span>
                        </div>
                      </div>

                      <div className={styles.legendPair}>
                        <div className={styles.legendBases}>
                          <div
                            className={styles.legendBase}
                            style={{
                              backgroundColor: "#ef444420",
                              color: "#ef4444",
                              borderColor: "#ef4444",
                            }}
                          >
                            A
                          </div>
                          <span className={styles.legendConnector}>•••</span>
                          <div
                            className={styles.legendBase}
                            style={{
                              backgroundColor: "#ef444420",
                              color: "#ef4444",
                              borderColor: "#ef4444",
                            }}
                          >
                            U
                          </div>
                        </div>
                        <div className={styles.legendInfo}>
                          <span className={styles.legendType}>A-U</span>
                          <span className={styles.legendStrength}>
                            Medio (-2.0 kcal/mol)
                          </span>
                        </div>
                      </div>

                      <div className={styles.legendPair}>
                        <div className={styles.legendBases}>
                          <div
                            className={styles.legendBase}
                            style={{
                              backgroundColor: "#f59e0b20",
                              color: "#f59e0b",
                              borderColor: "#f59e0b",
                            }}
                          >
                            G
                          </div>
                          <span className={styles.legendConnector}>•••</span>
                          <div
                            className={styles.legendBase}
                            style={{
                              backgroundColor: "#f59e0b20",
                              color: "#f59e0b",
                              borderColor: "#f59e0b",
                            }}
                          >
                            U
                          </div>
                        </div>
                        <div className={styles.legendInfo}>
                          <span className={styles.legendType}>G-U</span>
                          <span className={styles.legendStrength}>
                            Débil (-1.0 kcal/mol)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.pairsGrid}>
                  {result.estructura.pares_bases.map((pair, index) => {
                    const [base1, base2] = pair;
                    const [pos1, pos2] = result.estructura.pares[index];
                    const pairColor = getPairColor(base1, base2);
                    const pairStrength = getPairStrength(base1, base2);
                    const pairEnergy = getPairEnergy(base1, base2);

                    return (
                      <div
                        key={index}
                        className={styles.pairCard}
                        style={{ borderColor: pairColor }}
                        onMouseEnter={() => setHoveredPair(index)}
                        onMouseLeave={() => setHoveredPair(null)}
                      >
                        <div className={styles.pairHeader}>
                          <span className={styles.pairNumber}>
                            #{index + 1}
                          </span>
                          <span className={styles.pairPositions}>
                            {pos1} ↔ {pos2}
                          </span>
                        </div>
                        <div className={styles.pairVisualization}>
                          <div
                            className={styles.baseBox}
                            style={{
                              backgroundColor: pairColor + "20",
                              color: pairColor,
                            }}
                          >
                            {base1}
                          </div>
                          <div
                            className={styles.pairConnector}
                            style={{ backgroundColor: pairColor }}
                          >
                            <span className={styles.connectorLine}></span>
                            <span className={styles.connectorDots}>•••</span>
                          </div>
                          <div
                            className={styles.baseBox}
                            style={{
                              backgroundColor: pairColor + "20",
                              color: pairColor,
                            }}
                          >
                            {base2}
                          </div>
                        </div>
                        <div className={styles.pairInfo}>
                          <span className={styles.pairType}>
                            {base1}-{base2}
                          </span>
                          <span className={styles.pairStrength}>
                            {pairStrength}
                          </span>
                        </div>

                        {/* Tooltip con energía individual */}
                        {hoveredPair === index && (
                          <div className={styles.energyTooltip}>
                            <div className={styles.tooltipContent}>
                              <div className={styles.tooltipTitle}>
                                Energía del Par
                              </div>
                              <div className={styles.tooltipEnergy}>
                                {pairEnergy} kcal/mol
                              </div>
                              <div className={styles.tooltipDetails}>
                                <div>
                                  Posiciones: {pos1} - {pos2}
                                </div>
                                <div>
                                  Tipo: {base1}-{base2}
                                </div>
                                <div>Fuerza: {pairStrength.split(" ")[0]}</div>
                              </div>
                            </div>
                            <div className={styles.tooltipArrow}></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.analysisSection}>
                <h4 className={styles.sectionTitle}>
                  📈 Análisis de la Estructura
                </h4>
                <div className={styles.analysisGrid}>
                  <div className={styles.analysisCard}>
                    <h5 className={styles.analysisTitle}>
                      🔬 Composición de Pares
                    </h5>
                    <div className={styles.compositionStats}>
                      {(() => {
                        const pairCounts = {};
                        result.estructura.pares_bases.forEach(
                          ([base1, base2]) => {
                            const pairType = `${base1}-${base2}`;
                            pairCounts[pairType] =
                              (pairCounts[pairType] || 0) + 1;
                          }
                        );

                        return Object.entries(pairCounts).map(
                          ([pairType, count]) => (
                            <div
                              key={pairType}
                              className={styles.compositionItem}
                            >
                              <span
                                className={styles.compositionColor}
                                style={{
                                  backgroundColor: getPairColor(
                                    ...pairType.split("-")
                                  ),
                                }}
                              ></span>
                              <span className={styles.compositionLabel}>
                                {pairType}:
                              </span>
                              <span className={styles.compositionValue}>
                                {count}
                              </span>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  </div>

                  <div className={styles.analysisCard}>
                    <h5 className={styles.analysisTitle}>📊 Estadísticas</h5>
                    <div className={styles.statsGrid}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                          Longitud total:
                        </span>
                        <span className={styles.statValue}>
                          {result.secuencia.length} nt
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                          Nucleótidos emparejados:
                        </span>
                        <span className={styles.statValue}>
                          {result.estructura.pares.length * 2}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                          Nucleótidos libres:
                        </span>
                        <span className={styles.statValue}>
                          {result.secuencia.length -
                            result.estructura.pares.length * 2}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                          % Emparejamiento:
                        </span>
                        <span className={styles.statValue}>
                          {(
                            ((result.estructura.pares.length * 2) /
                              result.secuencia.length) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                          Energía promedio:
                        </span>
                        <span className={styles.statValue}>
                          {(
                            result.estructura.energia_total /
                            result.estructura.pares.length
                          ).toFixed(2)}{" "}
                          kcal/mol
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Estabilidad:</span>
                        <span
                          className={`${styles.statValue} ${
                            result.estructura.energia_total < -10
                              ? styles.stable
                              : styles.unstable
                          }`}
                        >
                          {result.estructura.energia_total < -10
                            ? "Alta"
                            : "Media"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.algorithmExplanation}>
                <h4 className={styles.sectionTitle}>
                  📚 Explicación del Algoritmo
                </h4>
                <div className={styles.explanationContent}>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>
                      🧠 Exploración Estocástica
                    </h5>
                    <p className={styles.explanationText}>
                      El algoritmo utiliza un enfoque estocástico basado en
                      Monte Carlo para predecir la estructura secundaria. Genera
                      múltiples configuraciones posibles de pares de bases al
                      azar y selecciona aquella que minimiza la energía total
                      del sistema. No se requiere conocimiento previo de
                      estructuras similares, lo que lo convierte en una
                      estrategia de novo.
                    </p>
                  </div>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>
                      ⚡ Función de Energía
                    </h5>
                    <p className={styles.explanationText}>
                      La energía se calcula considerando los tipos de pares de
                      bases formados: G–C (más estables, con 3 puentes de
                      hidrógeno), A–U o A–T (estabilidad media, con 2 puentes),
                      y G–U (menos estables, solo en ARN). Cada configuración
                      recibe un valor energético total, y la más estable será la
                      de menor energía (más negativa).
                    </p>
                  </div>
                  <div className={styles.explanationItem}>
                    <h5 className={styles.explanationTitle}>
                      🔄 Optimización Iterativa
                    </h5>
                    <p className={styles.explanationText}>
                      El proceso iterativo ejecuta muchas simulaciones con
                      emparejamientos aleatorios. Cada estructura se evalúa
                      energéticamente, y se conserva la mejor encontrada.
                      Aumentar el número de iteraciones generalmente mejora la
                      precisión de la predicción, aunque incrementa el tiempo de
                      ejecución.
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

export default PrediccionEstructuraPage;
