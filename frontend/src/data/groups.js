const groups = [
  {
    slug: "alba",
    acronym: "ALBA",
    name: "ALBA Group",
    tagline: "Algoritmos y Bases de Datos",
    shortDescription:
      "Estructuras de datos y algoritmos para nuevas aplicaciones y escenarios de datos.",
    longDescription: [
      "El grupo de investigación ALBA (Algoritmos y Bases de Datos) se focaliza en diseñar estructuras de datos novedosas e implementar algoritmos para dar funcionalidad a dichas estructuras.",
      "Proponemos modelos y metodologías aplicables a distintos dominios, colaborando con estudiantes y académicos de la Universidad del Bío-Bío.",
    ],
    researchLines: [
      { title: "Estructuras de datos y compresión", description: "Índices comprimidos, árboles, grafos y estructuras succinct." },
      { title: "Algoritmos para datos masivos", description: "Streaming, external-memory y análisis de complejidad." },
      { title: "Minería de datos y bioinformática", description: "Aplicación de técnicas de ML y análisis de secuencias." },
    ],
    team: [
      { name: "Dra. María López", role: "Investigadora principal" },
      { name: "Ing. Carlos Ruiz", role: "Profesor asociado" },
      { name: "Ana Martínez", role: "Estudiante de pregrado" },
      { name: "Juan Pérez", role: "Estudiante de magíster" },
    ],
    publications: [
      {
        year: 2024,
        title: "Compressed Indexes for Large-Scale Sequence Search",
        authors: "López M., Ruiz C., Martínez A.",
        venue: "Journal of Data Structures",
        link: "#",
      },
      {
        year: 2023,
        title: "Streaming Algorithms for Real-Time Analytics",
        authors: "Pérez J., López M.",
        venue: "Conference on Algorithms",
        link: "#",
      },
    ],
    projects: [
      { title: "Índices comprimidos para genómica", summary: "Búsqueda eficiente de patrones en genomas de gran tamaño.", link: "#" },
      { title: "Plataforma de noticias científicas", summary: "Portal interno de difusión de avances y actividades.", link: "#" },
    ],
    news: [
      {
        title: "Primera prueba de la sección de noticias",
        date: "2021-09-03",
        excerpt: "Publicamos la primera nota de la sección para probar el flujo editorial.",
        image: "/placeholder.svg?height=160&width=320",
        link: "#",
      },
      {
        title: "Segunda prueba de la sección de noticias",
        date: "2021-09-07",
        excerpt: "Se evaluó el componente de tarjetas y su adaptabilidad responsiva.",
        image: "/placeholder.svg?height=160&width=320",
        link: "#",
      },
      {
        title: "Seminario de algoritmos y datos",
        date: "2024-06-12",
        excerpt: "Invitados externos presentaron trabajos recientes en algoritmos.",
        image: "/placeholder.svg?height=160&width=320",
        link: "#",
      },
    ],
    join: {
      email: "alba-group@example.com",
      link: "#",
      text: "¿Te gustaría unirte al grupo ALBA? Escríbenos y conversemos sobre opciones de tesis y colaboración.",
    },
  },
]

export default groups
