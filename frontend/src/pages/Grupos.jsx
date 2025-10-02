import { Link } from "react-router-dom"
import groups from "../data/groups"
import "../styles/groups.css"

export default function Grupos() {
  return (
    <div className="groups-container">
      <header className="groups-hero">
        <div className="groups-hero-inner">
          <div>
            <h1 className="groups-title">Grupos de Investigación</h1>
            <p className="groups-subtitle">
              Conoce los grupos, sus líneas de trabajo, integrantes, publicaciones y proyectos.
            </p>
          </div>
          <img
            className="groups-hero-img"
            src="/placeholder.svg?height=220&width=360"
            alt="Ilustración de investigación"
          />
        </div>
      </header>

      <section className="groups-grid">
        {groups.map((g) => (
          <article key={g.slug} className="group-card">
            <div className="group-card-banner" />
            <div className="group-card-body">
              <h3 className="group-card-title">{g.name}</h3>
              <p className="group-card-tagline">{g.tagline}</p>
              <p className="group-card-desc">{g.shortDescription}</p>
              <div className="group-card-footer">
                <span className="group-meta">
                  {g.researchLines.length} líneas • {g.team.length} integrantes
                </span>
                <Link className="btn btn-primary" to={`/grupos/${g.slug}`}>
                  Ver grupo →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
