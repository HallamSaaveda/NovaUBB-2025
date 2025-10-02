import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"

const Navigation = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          BioInformática UBB
        </Link>

        {user ? (
          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>

            {/* Grupos: visible para todos (autenticados) */}
            <li>
              <Link to="/grupos" className="nav-link">
                Grupos
              </Link>
            </li>

            {["profesor", "alumno"].includes(user.role) && (
              <>
                <li>
                  <Link to="/investigaciones" className="nav-link">
                    Investigaciones
                  </Link>
                </li>
                <li>
                  <Link to="/personal" className="nav-link">
                    Área Personal
                  </Link>
                </li>
              </>
            )}

            {["admin", "superadmin"].includes(user.role) && (
              <>
                <li>
                  <Link to="/users" className="nav-link">
                    Usuarios
                  </Link>
                </li>
                <li>
                  <Link to="/personal" className="nav-link">
                    Área Personal
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="nav-link">
                    Administración
                  </Link>
                </li>
              </>
            )}

            <li className="nav-user">
              <span>Hola, {user.name}</span>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: "8px 16px", fontSize: "14px" }}
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        ) : (
          <ul className="nav-menu">
            {/* Grupos: visible para todos (no autenticados) */}
            <li>
              <Link to="/grupos" className="nav-link">
                Grupos
              </Link>
            </li>

            <li>
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
