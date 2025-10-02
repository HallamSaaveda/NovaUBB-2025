import { useParams, Link, useNavigate } from "react-router-dom"
import groups from "../data/groups"
import "../styles/groups.css"

function AnchorNav() {
  const items = [
    { href: "#overview", label: "home" },
    { href: "#research", label: "líneas de investigación" },
    { href: "#team", label: "team" },
    { href: "#publications", label: "publicaciones" },
    { href: "#projects", label: "proyectos" },
    { href: "#news", label: "noticias" },
    { href: "#join", label: "join" },
  ]
  return (
    <nav className="group-subnav" aria-label="Secciones del grupo">
      {items.map((i) => (
        <a key={i.href} className="group-subnav-link" href={i.href}>
          {i.label}
        </a>
      ))}
    </nav>
  )
}

export default function GrupoDetalle() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const group = groups.find((g) => g.slug === slug)

  if (!group) {
    return (
      <div className="groups-container" style={{ paddingTop: 24 }}>
        <Link className="btn btn-secondary" to="/grupos">← Volver a Grupos</Link>
        <div className="card" style={{ marginTop: 16, padding: 24 }}>
          <h2>Grupo no encontrado</h2>
          <p>El grupo solicitado no existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="groups-container">
      <header className="group-header">
        <div className="group-header-inner">
          <div className="group-heading">
            <h1 className="groups-title" style={{ marginBottom: 8 }}>{group.name}</h1>
            <div className="group-tagline">{group.tagline}</div>
          </div>
          <img
            className="group-hero-img"
            src="/placeholder.svg?height=240&width=380"
            alt="Ilustración del grupo"
          />
        </div>
      </header>

      <AnchorNav />

      <section id="overview" className="group-section">
        <h2 className="group-section-title">{group.acronym ? `${group.acronym} GROUP` : "Acerca del grupo"}</h2>
        {group.longDescription.map((p, idx) => (
          <p key={idx} className="group-paragraph">{p}</p>
        ))}
      </section>

      <section id="research" className="group-section">
        <h2 className="group-section-title">Líneas de investigación</h2>
        <div className="research-grid">
          {group.researchLines.map((l, idx) => (
            <article key={idx} className="research-card">
              <h3 className="research-title">{l.title}</h3>
              <p className="research-desc">{l.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="team" className="group-section">
        <h2 className="group-section-title">Equipo</h2>
        <div className="team-grid">
          {group.team.map((m, idx) => (
            <article key={idx} className="team-card">
              <img
                src={m.photo || "/placeholder.svg?height=96&width=96&query=avatar"}
                alt={`Foto de ${m.name}`}
                className="team-avatar"
              />
              <div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="publications" className="group-section">
        <h2 className="group-section-title">Publicaciones</h2>
        <ul className="pub-list">
          {group.publications.map((p, idx) => (
            <li key={idx} className="pub-item">
              <span className="pub-year">{p.year}</span>
              <span className="pub-main">
                {p.title} — <em>{p.venue}</em>
                {p.authors ? ` • ${p.authors}` : ""}
              </span>
              {p.link && (
                <a className="pub-link" href={p.link} target="_blank" rel="noreferrer">
                  Ver
                </a>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="projects" className="group-section">
        <h2 className="group-section-title">Proyectos</h2>
        <div className="projects-grid">
          {group.projects.map((pr, idx) => (
            <article key={idx} className="project-card">
              <h3 className="project-title">{pr.title}</h3>
              <p className="project-desc">{pr.summary}</p>
              {pr.link && (
                <a className="btn btn-secondary" href={pr.link} target="_blank" rel="noreferrer">
                  Ver proyecto
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="news" className="group-section">
        <h2 className="group-section-title">Últimas actividades</h2>
        <div className="news-grid">
          {group.news.slice(0, 3).map((n, idx) => (
            <article key={idx} className="news-card">
              <img
                className="news-img"
                src={n.image || "/placeholder.svg?height=160&width=320&query=noticia%20investigacion"}
                alt={n.title}
              />
              <div className="news-body">
                <div className="news-date">{new Date(n.date).toLocaleDateString()}</div>
                <h3 className="news-title">{n.title}</h3>
                <p className="news-excerpt">{n.excerpt}</p>
                {n.link && (
                  <a className="news-link" href={n.link} target="_blank" rel="noreferrer">
                    Leer más →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        {group.news.length > 3 && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <a className="news-see-all" href="#news">Ver todas…</a>
          </div>
        )}
      </section>

      <section id="join" className="group-section">
        <h2 className="group-section-title">Únete</h2>
        <div className="join-card">
          <p>
            {group.join?.text ||
              "Si te interesa colaborar, realizar tu tesis o participar en proyectos, contáctanos."}
          </p>
          <div className="join-actions">
            {group.join?.email && (
              <a className="btn btn-primary" href={`mailto:${group.join.email}`}>
                Escribir al grupo
              </a>
            )}
            {group.join?.link && (
              <a className="btn btn-secondary" href={group.join.link} target="_blank" rel="noreferrer">
                Más información
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="group-footer">
        <Link to="/grupos" className="btn btn-secondary">← Volver a Grupos</Link>
      </footer>
    </div>
  )
}
