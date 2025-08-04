// ✅ Utilidad para iconos de archivos - CORREGIDA
export const getFileIcon = (fileName, size = "24px") => {
  // ✅ Verificación más robusta
  if (!fileName || typeof fileName !== "string") {
    return (
      <span style={{ fontSize: size, display: "inline-block", marginRight: "8px" }} title="Archivo desconocido">
        📄
      </span>
    )
  }

  const extension = fileName.split(".").pop()?.toLowerCase()

  // ✅ Si no hay extensión, devolver icono por defecto
  if (!extension) {
    return (
      <span style={{ fontSize: size, display: "inline-block", marginRight: "8px" }} title="Archivo sin extensión">
        📄
      </span>
    )
  }

  const iconStyle = {
    fontSize: size,
    display: "inline-block",
    marginRight: "8px",
  }

  const icons = {
    // Imágenes
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    webp: "🖼️",
    bmp: "🖼️",
    svg: "🖼️",

    // PDFs
    pdf: "📕",

    // Word
    doc: "📘",
    docx: "📘",

    // Excel
    xls: "📗",
    xlsx: "📗",

    // PowerPoint
    ppt: "📙",
    pptx: "📙",

    // Archivos comprimidos
    zip: "🗜️",
    rar: "🗜️",
    "7z": "🗜️",
    tar: "🗜️",
    gz: "🗜️",

    // LaTeX
    tex: "📜",
    bib: "📚",

    // Código
    js: "💻",
    html: "🌐",
    css: "🎨",
    py: "🐍",
    java: "☕",
    cpp: "⚙️",
    c: "⚙️",

    // Texto
    txt: "📄",
    md: "📝",

    // Audio
    mp3: "🎵",
    wav: "🎵",
    flac: "🎵",

    // Video
    mp4: "🎬",
    avi: "🎬",
    mkv: "🎬",
  }

  const icon = icons[extension] || "📄"

  return (
    <span style={iconStyle} title={`Archivo ${extension.toUpperCase()}`}>
      {icon}
    </span>
  )
}

// ✅ Función separada para obtener solo el emoji
export const getFileEmoji = (fileName) => {
  if (!fileName || typeof fileName !== "string") return "📄"

  const extension = fileName.split(".").pop()?.toLowerCase()
  if (!extension) return "📄"

  const icons = {
    // Imágenes
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    webp: "🖼️",
    bmp: "🖼️",
    svg: "🖼️",

    // PDFs
    pdf: "📕",

    // Word
    doc: "📘",
    docx: "📘",

    // Excel
    xls: "📗",
    xlsx: "📗",

    // PowerPoint
    ppt: "📙",
    pptx: "📙",

    // Archivos comprimidos
    zip: "🗜️",
    rar: "🗜️",
    "7z": "🗜️",
    tar: "🗜️",
    gz: "🗜️",

    // LaTeX
    tex: "📜",
    bib: "📚",

    // Código
    js: "💻",
    html: "🌐",
    css: "🎨",
    py: "🐍",
    java: "☕",
    cpp: "⚙️",
    c: "⚙️",

    // Texto
    txt: "📄",
    md: "📝",

    // Audio
    mp3: "🎵",
    wav: "🎵",
    flac: "🎵",

    // Video
    mp4: "🎬",
    avi: "🎬",
    mkv: "🎬",
  }

  return icons[extension] || "📄"
}

export const getFileType = (fileName) => {
  if (!fileName || typeof fileName !== "string") return "unknown"

  const extension = fileName.split(".").pop()?.toLowerCase()
  if (!extension) return "unknown"

  const types = {
    // Imágenes
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    webp: "image",
    bmp: "image",
    svg: "image",

    // Documentos
    pdf: "pdf",
    doc: "word",
    docx: "word",
    xls: "excel",
    xlsx: "excel",
    ppt: "powerpoint",
    pptx: "powerpoint",

    // Comprimidos
    zip: "compressed",
    rar: "compressed",
    "7z": "compressed",
    tar: "compressed",
    gz: "compressed",

    // LaTeX
    tex: "latex",
    bib: "bibliography",

    // Código
    js: "code",
    html: "code",
    css: "code",
    py: "code",
    java: "code",
    cpp: "code",
    c: "code",

    // Texto
    txt: "text",
    md: "text",

    // Multimedia
    mp3: "audio",
    wav: "audio",
    flac: "audio",
    mp4: "video",
    avi: "video",
    mkv: "video",
  }

  return types[extension] || "unknown"
}
