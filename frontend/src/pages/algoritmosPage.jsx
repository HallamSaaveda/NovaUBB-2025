import { useState } from "react"
import AlgorithmCard from "../components/bioinformatics/algorithm-card"
import AlgorithmWorkspace from "../components/bioinformatics/algorithm-workspace"
import styles from "../styles/page.module.css"
import bioinformaticsStyles from "../styles/bioinformatics.module.css"

const algorithms = [
  {
    id: 1,
    key: "alineamiento",
    title: "Alineamiento de Secuencias",
    description: "Herramienta para encontrar regiones de similitud local entre secuencias biológicas.",
    category: "Alineamiento",
    difficulty: "Intermedio",
    icon: "🧬",
    color: "#8B5CF6",
    features: ["Búsqueda rápida", "Múltiples bases de datos", "Análisis estadístico"],
  },
  {
    id: 2,
    key: "permutaciones",
    title: "Generación de Permutaciones",
    description: "Algoritmos de backtracking e itertools para generar todas las permutaciones posibles.",
    category: "Combinatoria",
    difficulty: "Básico",
    icon: "🔄",
    color: "#3B82F6",
    features: ["Backtracking", "Generación iterativa", "Optimización de memoria"],
  },
  {
    id: 3,
    key: "busqueda-permutacion",
    title: "Búsqueda de Permutación",
    description: "Algoritmo para encontrar una secuencia objetivo mediante permutaciones.",
    category: "Combinatoria",
    difficulty: "Intermedio",
    icon: "🔍",
    color: "#10B981",
    features: ["Búsqueda dirigida", "Heurísticas", "Optimización"],
  },
  {
    id: 4,
    key: "vertex-cover",
    title: "Vertex Cover",
    description: "Algoritmos de fuerza bruta y greedy para encontrar cobertura de vértices en grafos.",
    category: "Grafos",
    difficulty: "Avanzado",
    icon: "🕸️",
    color: "#F59E0B",
    features: ["Fuerza bruta", "Algoritmo greedy", "Análisis de grafos"],
  },
  {
    id: 5,
    key: "arboles",
    title: "Árboles Jerárquicos",
    description: "Algoritmos para generar árboles ultramétricos y aditivos a partir de matrices de distancia.",
    category: "Grafos",
    difficulty: "Avanzado",
    icon: "🌳",
    color: "#EF4444",
    features: ["Árboles ultramétricos", "Matrices de distancia", "Análisis filogenético"],
  },
  {
    id: 6,
    key: "estructura",
    title: "Predicción de Estructura",
    description: "Predice la estructura secundaria de proteínas usando algoritmos de machine learning.",
    category: "Estructura",
    difficulty: "Avanzado",
    icon: "🏗️",
    color: "#8B5CF6",
    features: ["Predicción α-hélice", "Predicción β-sheet", "Análisis de loops"],
  },
]

export default function AlgoritmosPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)
  const [viewType, setViewType] = useState("cards")
  const [activeFilter, setActiveFilter] = useState("Todos")

  const handleAlgorithmClick = (algorithm) => {
    setSelectedAlgorithm(algorithm)
  }

  const handleBackToHome = () => {
    setSelectedAlgorithm(null)
  }

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
  }

  const filteredAlgorithms = activeFilter === "Todos" 
    ? algorithms 
    : algorithms.filter(algorithm => algorithm.category === activeFilter)

  if (selectedAlgorithm) {
    return (
      <AlgorithmWorkspace
        algorithm={selectedAlgorithm}
        algorithms={algorithms}
        onAlgorithmChange={setSelectedAlgorithm}
        onBackToHome={handleBackToHome}
      />
    )
  }

  return (
    <div className={bioinformaticsStyles.bioinformaticsSection}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Algoritmos de Bioinformática</h1>
          <p className={styles.subtitle}>
            Explora nuestra colección de herramientas computacionales para el análisis de datos biológicos
          </p>
        </header>

        <main className={styles.main}>
          <div className={styles.controls}>
            <div className={styles.filters}>
              <button 
                className={`${styles.filterBtn} ${activeFilter === "Todos" ? styles.active : ""}`}
                onClick={() => handleFilterClick("Todos")}
              >
                Todos
              </button>
              <button 
                className={`${styles.filterBtn} ${activeFilter === "Alineamiento" ? styles.active : ""}`}
                onClick={() => handleFilterClick("Alineamiento")}
              >
                Alineamiento
              </button>
              <button 
                className={`${styles.filterBtn} ${activeFilter === "Estructura" ? styles.active : ""}`}
                onClick={() => handleFilterClick("Estructura")}
              >
                Estructura
              </button>
              <button 
                className={`${styles.filterBtn} ${activeFilter === "Combinatoria" ? styles.active : ""}`}
                onClick={() => handleFilterClick("Combinatoria")}
              >
                Combinatoria
              </button>
              <button 
                className={`${styles.filterBtn} ${activeFilter === "Grafos" ? styles.active : ""}`}
                onClick={() => handleFilterClick("Grafos")}
              >
                Grafos
              </button>
            </div>

            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${viewType === "cards" ? styles.active : ""}`}
                onClick={() => setViewType("cards")}
              >
                📱 Tarjetas
              </button>
              <button
                className={`${styles.viewBtn} ${viewType === "list" ? styles.active : ""}`}
                onClick={() => setViewType("list")}
              >
                📋 Lista
              </button>
            </div>
          </div>

          <div className={viewType === "cards" ? styles.grid : styles.list}>
            {filteredAlgorithms.map((algorithm) => (
              <AlgorithmCard
                key={algorithm.id}
                algorithm={algorithm}
                viewType={viewType}
                onAlgorithmClick={handleAlgorithmClick}
              />
            ))}
          </div>
        </main>

        <footer className={styles.footer}>
          <p>© 2024 Plataforma de Bioinformática - Desarrollado con React</p>
        </footer>
      </div>
    </div>
  )
}
