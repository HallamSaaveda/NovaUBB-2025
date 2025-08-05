"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx"
import { useAuth } from "./context/AuthContext.jsx"
import Navigation from "./components/Navigation.jsx"
import AlertContainer from "./components/Alert.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import UserManagement from "./pages/UserManagement.jsx"
import PersonalArea from "./pages/PersonalArea.jsx"
import Investigaciones from "./pages/Investigaciones.jsx"
import InvestigacionDetalle from "./pages/InvestigacionDetalle.jsx"
import AlgoritmosPage from "./pages/algoritmosPage.jsx"
import "./styles/global.css"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (!["admin", "superadmin"].includes(user.role)) return <Navigate to="/" replace />
  return children
}

function ProfessorRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (!["profesor", "admin", "superadmin"].includes(user.role)) return <Navigate to="/" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading">Cargando...</div>
  if (user) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <AlertContainer />
          <main className="main-content">
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/personal"
                element={
                  <ProfessorRoute>
                    <PersonalArea />
                  </ProfessorRoute>
                }
              />
              <Route
                path="/investigaciones"
                element={
                  <ProtectedRoute>
                    <Investigaciones />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investigaciones/:id"
                element={
                  <ProtectedRoute>
                    <InvestigacionDetalle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/algoritmos"
                element={
                  <ProtectedRoute>
                    <AlgoritmosPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
