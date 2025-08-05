import { useState } from "react"
import styles from "../../styles/algorithm-workspace.module.css"
import bioinformaticsStyles from "../../styles/bioinformatics.module.css"
import VertexCoverPage from "../../pages/vertexCoverPage"
import ArbolesPage from "../../pages/ArbolesPage"
import PermutacionesPage from "../../pages/PermutacionesPage"
import BusquedaPermutacionPage from "../../pages/BusquedaPermutacionPage"
import AlineamientoPage from "../../pages/AlineamientoPage"

const AlgorithmComponents = {
  alineamiento: () => (<AlineamientoPage />),
  permutaciones: () => <PermutacionesPage />,
  "busqueda-permutacion": () => <BusquedaPermutacionPage />,
  "vertex-cover": () => <VertexCoverPage />,
  arboles: () => <ArbolesPage />,
  estructura: () => (
    <div className={styles.algorithmContent}>
      <h3>Predicción de Estructura</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget tortor risus. Vestibulum ac diam sit amet
        quam vehicula elementum sed sit amet dui.
      </p>
      <div className={styles.inputSection}>
        <label>Secuencia de proteína:</label>
        <input type="text" placeholder="MKTVRQERLK..." />
        <button className={styles.executeBtn}>Predecir Estructura</button>
      </div>
    </div>
  ),
}

export default function AlgorithmWorkspace({ algorithm, algorithms, onAlgorithmChange, onBackToHome }) {
  const [activeAlgorithm, setActiveAlgorithm] = useState(algorithm.key)

  const handleAlgorithmChange = (newAlgorithmKey) => {
    const newAlgorithm = algorithms.find((alg) => alg.key === newAlgorithmKey)
    setActiveAlgorithm(newAlgorithmKey)
    onAlgorithmChange(newAlgorithm)
  }

  const renderAlgorithm = () => {
    const Component = AlgorithmComponents[activeAlgorithm]
    return Component ? <Component /> : <div>Algoritmo no encontrado</div>
  }

  return (
    <div className={bioinformaticsStyles.bioinformaticsSection}>
      <div className={styles.workspaceContainer}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <button className={styles.backButton} onClick={onBackToHome}>
              ← Volver
            </button>
            <h3 className={styles.sidebarTitle}>Algoritmos Disponibles</h3>
          </div>

          <div className={styles.algorithmList}>
            {algorithms.map((alg) => (
              <div
                key={alg.id}
                className={`${styles.algorithmCard} ${activeAlgorithm === alg.key ? styles.active : ""}`}
                onClick={() => handleAlgorithmChange(alg.key)}
                style={{
                  borderLeftColor: alg.color,
                }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.icon} style={{ backgroundColor: alg.color }}>
                    {alg.icon}
                  </div>
                  <div className={styles.cardInfo}>
                    <h4 className={styles.cardTitle}>{alg.title}</h4>
                    <p className={styles.cardDescription}>{alg.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>
              {algorithms.find((alg) => alg.key === activeAlgorithm)?.icon}
              {algorithms.find((alg) => alg.key === activeAlgorithm)?.title}
            </h2>
            <p className={styles.contentDescription}>
              {algorithms.find((alg) => alg.key === activeAlgorithm)?.description}
            </p>
          </div>

          <div className={styles.workspaceContent}>{renderAlgorithm()}</div>
        </div>
      </div>
    </div>
  )
}