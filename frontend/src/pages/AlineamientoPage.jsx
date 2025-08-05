import { useState, useEffect } from "react";
import { alineamientoService } from "../services/alineamiento.service";
import styles from "../styles/alineamiento-page.module.css";
import bioinformaticsStyles from "../styles/bioinformatics.module.css";

const AlineamientoPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    algorithm: "needleman",
    molecula: "ADN",
    seq1: "ATGCC",
    seq2: "GTCA",
    match: 1,
    mismatch: -1,
    gap: -1,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000); // ms
  const [showTraceback, setShowTraceback] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying && result && currentStep < result.matrix_steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= result.matrix_steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, result, playSpeed]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowTraceback(false);

    try {
      // Validaciones básicas
      if (!formData.seq1.trim() || !formData.seq2.trim()) {
        throw new Error("Las secuencias no pueden estar vacías");
      }
      if (formData.seq1.length > 20 || formData.seq2.length > 20) {
        throw new Error(
          "Las secuencias no pueden tener más de 20 caracteres para mejor visualización"
        );
      }

      const dataToSend = {
        algorithm: formData.algorithm,
        molecula: formData.molecula,
        seq1: formData.seq1.trim().toUpperCase(),
        seq2: formData.seq2.trim().toUpperCase(),
        match: formData.match,
        mismatch: formData.mismatch,
        gap: formData.gap,
      };

      console.log("Datos enviados al backend:", dataToSend);

      const response = await alineamientoService.ejecutarAlineamiento(
        dataToSend
      );
      setResult(response.data);

      console.log("Traceback path recibido:", response.data.traceback_path);
    } catch (err) {
      setError(err.message || "Error al ejecutar el alineamiento");
    } finally {
      setLoading(false);
    }
  };

  const getDirectionArrow = (from) => {
    switch (from) {
      case "diagonal":
        return "↖";
      case "up":
        return "↑";
      case "left":
        return "←";
      default:
        return "";
    }
  };

  const getDirectionColor = (from) => {
    switch (from) {
      case "diagonal":
        return "#10b981"; // Verde
      case "up":
        return "#3b82f6"; // Azul
      case "left":
        return "#f59e0b"; // Amarillo
      default:
        return "#6b7280"; // Gris
    }
  };

  const isInTraceback = (row, col) => {
    if (!result?.traceback_path || !showTraceback) return false;
    return result.traceback_path.some(
      (cell) => cell.row === row && cell.col === col
    );
  };

  const nextStep = () => {
    if (result && currentStep < result.matrix_steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    setIsPlaying(false);
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
              Alineamiento de Secuencias
            </h1>
            <p className={styles.description}>
              Visualización interactiva de algoritmos de alineamiento de
              secuencias (Needleman-Wunsch y Smith-Waterman) con matriz de
              programación dinámica paso a paso.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Algoritmo:</label>
                  <select
                    name="algorithm"
                    value={formData.algorithm}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="needleman">Needleman-Wunsch (Global)</option>
                    <option value="smith">Smith-Waterman (Local)</option>
                  </select>
                  <small className={styles.hint}>
                    {formData.algorithm === "needleman"
                      ? "Alineamiento global - encuentra el mejor alineamiento de toda la secuencia"
                      : "Alineamiento local - encuentra la mejor región de similitud"}
                  </small>
                </div>

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
                    <option value="PROTEINA">Proteína</option>
                  </select>
                  <small className={styles.hint}>
                    Tipo de secuencia biológica a alinear
                  </small>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Secuencia 1:</label>
                  <input
                    type="text"
                    name="seq1"
                    value={formData.seq1}
                    onChange={handleInputChange}
                    placeholder="ATGCC"
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Primera secuencia a alinear (máximo 20 caracteres)
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Secuencia 2:</label>
                  <input
                    type="text"
                    name="seq2"
                    value={formData.seq2}
                    onChange={handleInputChange}
                    placeholder="GTCA"
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Segunda secuencia a alinear (máximo 20 caracteres)
                  </small>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Match:</label>
                  <input
                    type="number"
                    name="match"
                    value={formData.match}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Puntuación por coincidencia
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Mismatch:</label>
                  <input
                    type="number"
                    name="mismatch"
                    value={formData.mismatch}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Penalización por no coincidencia
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Gap:</label>
                  <input
                    type="number"
                    name="gap"
                    value={formData.gap}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                  <small className={styles.hint}>
                    Penalización por hueco (gap)
                  </small>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Ejecutando..." : "Ejecutar Alineamiento"}
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
                Visualización del Alineamiento
              </h3>

              <div className={styles.sequenceInfo}>
                <div className={styles.infoItem}>
                  <strong>Algoritmo:</strong>
                  <span className={styles.algorithmBadge}>
                    {formData.algorithm === "needleman"
                      ? "Needleman-Wunsch"
                      : "Smith-Waterman"}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Secuencias:</strong>
                  <span className={styles.sequenceValue}>
                    {formData.seq1} vs {formData.seq2}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <strong>Parámetros:</strong>
                  <span className={styles.paramValue}>
                    Match: {formData.match}, Mismatch: {formData.mismatch}, Gap:{" "}
                    {formData.gap}
                  </span>
                </div>
                {result.traceback_path && (
                  <div className={styles.infoItem}>
                    <strong>Camino óptimo:</strong>
                    <span className={styles.tracebackInfo}>
                      {result.traceback_path.length} pasos en el traceback
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.controlsSection}>
                <div className={styles.stepControls}>
                  <button
                    className={styles.controlButton}
                    onClick={resetAnimation}
                    disabled={currentStep === 0}
                  >
                    ⏮ Inicio
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    ⏪ Anterior
                  </button>
                  <button className={styles.playButton} onClick={togglePlay}>
                    {isPlaying ? "⏸ Pausar" : "▶ Reproducir"}
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={nextStep}
                    disabled={currentStep >= result.matrix_steps.length - 1}
                  >
                    Siguiente ⏩
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={() => goToStep(result.matrix_steps.length - 1)}
                    disabled={currentStep >= result.matrix_steps.length - 1}
                  >
                    Final ⏭
                  </button>
                  {result.traceback_path &&
                    currentStep === result.matrix_steps.length - 1 && (
                      <button
                        className={`${styles.tracebackButton} ${
                          showTraceback ? styles.active : ""
                        }`}
                        onClick={() => setShowTraceback(!showTraceback)}
                      >
                        🎯 {showTraceback ? "Ocultar" : "Mostrar"} Traceback
                      </button>
                    )}
                </div>

                <div className={styles.speedControl}>
                  <label>Velocidad:</label>
                  <select
                    value={playSpeed}
                    onChange={(e) => setPlaySpeed(Number(e.target.value))}
                  >
                    <option value={2000}>Lenta</option>
                    <option value={1000}>Normal</option>
                    <option value={500}>Rápida</option>
                    <option value={200}>Muy rápida</option>
                  </select>
                </div>

                <div className={styles.stepInfo}>
                  <span>
                    Paso {currentStep + 1} de {result.matrix_steps.length}
                  </span>
                </div>
              </div>

              <div className={styles.matrixSection}>
                <div className={styles.matrixContainer}>
                  <div className={styles.matrixWrapper}>
                    {/* Headers de secuencias */}
                    <div className={styles.sequenceHeaders}>
                      <div className={styles.cornerCell}></div>
                      <div className={styles.headerCell}>-</div>
                      {formData.seq2.split("").map((char, index) => (
                        <div key={index} className={styles.headerCell}>
                          {char}
                        </div>
                      ))}
                    </div>

                    {/* Matriz con headers de filas */}
                    {result.matrix_steps[currentStep]?.matrix.map(
                      (row, rowIndex) => (
                        <div key={rowIndex} className={styles.matrixRow}>
                          <div className={styles.headerCell}>
                            {rowIndex === 0 ? "-" : formData.seq1[rowIndex - 1]}
                          </div>
                          {row.map((cell, colIndex) => {
                            const isHighlighted =
                              result.matrix_steps[currentStep]?.highlight
                                ?.row === rowIndex &&
                              result.matrix_steps[currentStep]?.highlight
                                ?.col === colIndex;

                            const isInTracebackPath = isInTraceback(
                              rowIndex,
                              colIndex
                            );
                            const from = isHighlighted
                              ? result.matrix_steps[currentStep]?.from
                              : null;

                            return (
                              <div
                                key={colIndex}
                                className={`${styles.matrixCell} ${
                                  isHighlighted ? styles.highlighted : ""
                                } ${
                                  isInTracebackPath ? styles.tracebackCell : ""
                                }`}
                                style={{
                                  backgroundColor: isHighlighted
                                    ? getDirectionColor(from) + "20"
                                    : isInTracebackPath
                                    ? "#fecaca"
                                    : "white",
                                  borderColor: isHighlighted
                                    ? getDirectionColor(from)
                                    : isInTracebackPath
                                    ? "#ef4444"
                                    : "#e2e8f0",
                                }}
                              >
                                <div className={styles.cellValue}>{cell}</div>
                                {isHighlighted && from && from !== "none" && (
                                  <div
                                    className={styles.directionArrow}
                                    style={{ color: getDirectionColor(from) }}
                                  >
                                    {getDirectionArrow(from)}
                                  </div>
                                )}
                                {isInTracebackPath && (
                                  <div className={styles.tracebackIndicator}>
                                    ●
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className={styles.legend}>
                  <h4>Leyenda:</h4>
                  <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                      <span
                        className={styles.legendArrow}
                        style={{ color: "#10b981" }}
                      >
                        ↖
                      </span>
                      <span>Diagonal (Match/Mismatch)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span
                        className={styles.legendArrow}
                        style={{ color: "#3b82f6" }}
                      >
                        ↑
                      </span>
                      <span>Arriba (Gap en seq2)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span
                        className={styles.legendArrow}
                        style={{ color: "#f59e0b" }}
                      >
                        ←
                      </span>
                      <span>Izquierda (Gap en seq1)</span>
                    </div>
                    {showTraceback && result.traceback_path && (
                      <div className={styles.legendItem}>
                        <span
                          className={styles.legendArrow}
                          style={{ color: "#ef4444" }}
                        >
                          ●
                        </span>
                        <span>Camino óptimo (Traceback)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${
                        ((currentStep + 1) / result.matrix_steps.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className={styles.progressSteps}>
                  {result.matrix_steps.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.stepDot} ${
                        index === currentStep ? styles.activeDot : ""
                      } ${index <= currentStep ? styles.completedDot : ""}`}
                      onClick={() => goToStep(index)}
                      title={`Ir al paso ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {result.final_alignment && (
                <div className={styles.finalAlignment}>
                  <h4 className={styles.sectionTitle}>🎯 Alineamiento Final</h4>
                  <div className={styles.alignmentResult}>
                    <div className={styles.alignmentRow}>
                      <span className={styles.alignmentLabel}>Seq1:</span>
                      <span className={styles.alignmentSequence}>
                        {result.final_alignment.seq1}
                      </span>
                    </div>
                    <div className={styles.alignmentRow}>
                      <span className={styles.alignmentLabel}>Seq2:</span>
                      <span className={styles.alignmentSequence}>
                        {result.final_alignment.seq2}
                      </span>
                    </div>
                  </div>

                  {showTraceback && result.traceback_path && (
                    <div className={styles.tracebackDetails}>
                      <h5 className={styles.tracebackTitle}>
                        📍 Detalles del Traceback:
                      </h5>
                      <div className={styles.tracebackPath}>
                        {result.traceback_path.map((step, index) => (
                          <span key={index} className={styles.tracebackStep}>
                            ({step.row}, {step.col})
                            {index < result.traceback_path.length - 1 && " → "}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlineamientoPage;
