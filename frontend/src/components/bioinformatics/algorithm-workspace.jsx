import { useState } from "react"
import styles from "../../styles/algorithm-workspace.module.css"
import bioinformaticsStyles from "../../styles/bioinformatics.module.css"

// Componentes de algoritmos (por ahora con lorem ipsum)
const AlgorithmComponents = {
  alineamiento: () => (
    <div className={styles.algorithmContent}>
      <h3>Alineamiento de Secuencias</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </p>
      <div className={styles.inputSection}>
        <label>Secuencia 1:</label>
        <input type="text" placeholder="ATCG" />
        <label>Secuencia 2:</label>
        <input type="text" placeholder="ATCC" />
        <button className={styles.executeBtn}>Ejecutar Alineamiento</button>
      </div>
    </div>
  ),
  permutaciones: () => (
    <div className={styles.algorithmContent}>
      <h3>Generación de Permutaciones</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et
        ultrices posuere cubilia curae.
      </p>
      <div className={styles.inputSection}>
        <label>Secuencia:</label>
        <input type="text" placeholder="ATCG" />
        <button className={styles.executeBtn}>Generar Permutaciones</button>
      </div>
    </div>
  ),
  "busqueda-permutacion": () => (
    <div className={styles.algorithmContent}>
      <h3>Búsqueda de Permutación</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit aliquet elit, eget tincidunt nibh
        pulvinar a.
      </p>
      <div className={styles.inputSection}>
        <label>Secuencia base:</label>
        <input type="text" placeholder="ATCG" />
        <label>Objetivo:</label>
        <input type="text" placeholder="CGTA" />
        <button className={styles.executeBtn}>Buscar Permutación</button>
      </div>
    </div>
  ),
  "vertex-cover": () => (
    <div className={styles.algorithmContent}>
      <h3>Vertex Cover</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus
        et malesuada fames ac turpis egestas.
      </p>
      <div className={styles.inputSection}>
        <label>Grafo (matriz de adyacencia):</label>
        <textarea placeholder="1,0,1&#10;0,1,0&#10;1,0,1" rows={4}></textarea>
        <button className={styles.executeBtn}>Encontrar Vertex Cover</button>
      </div>
    </div>
  ),
  arboles: () => (
    <div className={styles.algorithmContent}>
      <h3>Árboles Jerárquicos</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum congue leo eget malesuada. Curabitur non
        nulla sit amet nisl tempus convallis quis ac lectus.
      </p>
      <div className={styles.inputSection}>
        <label>Matriz de distancias:</label>
        <textarea placeholder="0,2,4&#10;2,0,3&#10;4,3,0" rows={4}></textarea>
        <button className={styles.executeBtn}>Generar Árbol</button>
      </div>
    </div>
  ),
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
