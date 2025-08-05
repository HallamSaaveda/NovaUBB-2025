import { useState } from "react"
import styles from "../styles/algorithm-card.module.css"
import bioinformaticsStyles from "../styles/bioinformatics.module.css"

export default function AlgorithmCard({ algorithm }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Básico":
        return "#4CAF50"
      case "Intermedio":
        return "#FF9800"
      case "Avanzado":
        return "#F44336"
      default:
        return "#9E9E9E"
    }
  }

  const handleCardClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleRunAlgorithm = (e) => {
    e.stopPropagation()
    alert(`Ejecutando algoritmo: ${algorithm.title}`)
  }

  return (
    <div className={bioinformaticsStyles.bioinformaticsSection}>
      <div className={`${styles.card} ${isExpanded ? styles.expanded : ""}`} onClick={handleCardClick}>
        <div className={styles.cardHeader}>
          <div className={styles.icon}>{algorithm.icon}</div>
          <div className={styles.headerInfo}>
            <h3 className={styles.title}>{algorithm.title}</h3>
            <div className={styles.badges}>
              <span className={styles.category}>{algorithm.category}</span>
              <span className={styles.difficulty} style={{ backgroundColor: getDifficultyColor(algorithm.difficulty) }}>
                {algorithm.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.description}>{algorithm.description}</p>

          {isExpanded && (
            <div className={styles.expandedContent}>
              <h4 className={styles.featuresTitle}>Características principales:</h4>
              <ul className={styles.featuresList}>
                {algorithm.features.map((feature, index) => (
                  <li key={index} className={styles.feature}>
                    <span className={styles.featureIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.runButton} onClick={handleRunAlgorithm}>
            Ejecutar Algoritmo
          </button>
          <button className={styles.expandButton}>{isExpanded ? "Ver menos" : "Ver más"}</button>
        </div>
      </div>
    </div>
  )
}
