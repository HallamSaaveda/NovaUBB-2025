import { useState } from "react"
import styles from "../../styles/algorithm-card.module.css"
import bioinformaticsStyles from "../../styles/bioinformatics.module.css"

export default function AlgorithmCard({ algorithm, viewType = "cards", onAlgorithmClick }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Básico":
        return "#10B981"
      case "Intermedio":
        return "#F59E0B"
      case "Avanzado":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const handleCardClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleRunAlgorithm = (e) => {
    e.stopPropagation()
    onAlgorithmClick(algorithm)
  }

  if (viewType === "list") {
    return (
      <div className={bioinformaticsStyles.bioinformaticsSection}>
        <div className={`${styles.card} ${styles.listCard} ${isExpanded ? styles.expanded : ""}`}>
          <div className={styles.listCardHeader}>
            <div className={styles.listIcon} style={{ backgroundColor: algorithm.color }}>
              {algorithm.icon}
            </div>
            <h3 className={styles.listTitle}>{algorithm.title}</h3>
          </div>
          
          <div className={styles.listBadges}>
            <span className={styles.category}>{algorithm.category}</span>
            <span className={styles.difficulty} style={{ backgroundColor: getDifficultyColor(algorithm.difficulty) }}>
              {algorithm.difficulty}
            </span>
          </div>
          
          <p className={styles.listDescription}>{algorithm.description}</p>
          
          <div className={styles.listCardFooter}>
            <button className={styles.runButton} onClick={handleRunAlgorithm}>
              Abrir Algoritmo
            </button>
            <button className={styles.expandButton} onClick={handleCardClick}>
              {isExpanded ? "Ver menos" : "Ver más"}
            </button>
          </div>

          {isExpanded && (
            <div className={styles.expandedContent}>
              <h4 className={styles.featuresTitle}>Características principales:</h4>
              <ul className={styles.featuresList}>
                {algorithm.features?.map((feature, index) => (
                  <li key={index} className={styles.feature}>
                    <span className={styles.featureIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={bioinformaticsStyles.bioinformaticsSection}>
      <div
        className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}
        onClick={handleCardClick}
      >
        <div className={styles.cardHeader}>
          <div className={styles.icon} style={{ backgroundColor: algorithm.color }}>
            {algorithm.icon}
          </div>
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
                {algorithm.features?.map((feature, index) => (
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
            Abrir Algoritmo
          </button>
          <button className={styles.expandButton}>{isExpanded ? "Ver menos" : "Ver más"}</button>
        </div>
      </div>
    </div>
  )
}
