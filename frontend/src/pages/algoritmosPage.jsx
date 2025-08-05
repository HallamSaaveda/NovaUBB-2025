import AlgorithmCard from "../components/algorithm-card"
import styles from "../styles/page.module.css"
import bioinformaticsStyles from "../styles/bioinformatics.module.css"

const algorithms = [
  {
    id: 1,
    title: "BLAST - Alineamiento de Secuencias",
    description: "Herramienta para encontrar regiones de similitud local entre secuencias biológicas.",
    category: "Alineamiento",
    difficulty: "Intermedio",
    icon: "🧬",
    features: ["Búsqueda rápida", "Múltiples bases de datos", "Análisis estadístico"],
  },
  {
    id: 2,
    title: "Traducción ADN a Proteína",
    description: "Convierte secuencias de nucleótidos en secuencias de aminoácidos usando el código genético.",
    category: "Traducción",
    difficulty: "Básico",
    icon: "🔄",
    features: ["6 marcos de lectura", "Código genético estándar", "Detección de codones"],
  },
  {
    id: 3,
    title: "Predicción de Estructura Secundaria",
    description: "Predice la estructura secundaria de proteínas usando algoritmos de machine learning.",
    category: "Estructura",
    difficulty: "Avanzado",
    icon: "🏗️",
    features: ["Predicción α-hélice", "Predicción β-sheet", "Análisis de loops"],
  },
  {
    id: 4,
    title: "Análisis Filogenético",
    description: "Construye árboles evolutivos basados en similitudes de secuencias.",
    category: "Evolución",
    difficulty: "Avanzado",
    icon: "🌳",
    features: ["Método neighbor-joining", "Bootstrap analysis", "Visualización interactiva"],
  },
  {
    id: 5,
    title: "Búsqueda de Motivos",
    description: "Identifica patrones conservados en secuencias de ADN o proteínas.",
    category: "Patrones",
    difficulty: "Intermedio",
    icon: "🔍",
    features: ["Algoritmo MEME", "Análisis de consenso", "Scoring estadístico"],
  },
  {
    id: 6,
    title: "Ensamblaje de Genomas",
    description: "Reconstruye genomas completos a partir de lecturas cortas de secuenciación.",
    category: "Genómica",
    difficulty: "Avanzado",
    icon: "🧩",
    features: ["Algoritmo de Bruijn", "Corrección de errores", "Scaffolding"],
  },
]

export default function AlgoritmosPage() {
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
          <div className={styles.filters}>
            <button className={`${styles.filterBtn} ${styles.active}`}>Todos</button>
            <button className={styles.filterBtn}>Alineamiento</button>
            <button className={styles.filterBtn}>Estructura</button>
            <button className={styles.filterBtn}>Evolución</button>
            <button className={styles.filterBtn}>Genómica</button>
          </div>

          <div className={styles.grid}>
            {algorithms.map((algorithm) => (
              <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
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
