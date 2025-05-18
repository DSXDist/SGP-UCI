import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import Home from './pages/home'
import AdminDashboard from './pages/librarian/homeLibrarian'
import CatalogoPage from './pages/catalog'
import PrestamosPage from './pages/librarian/prestamos'
import ReportesPage from './pages/librarian/reports'
import GestionUsuariosPage from './pages/librarian/users'
import MisPrestamos from './pages/userLoans'
import Notificaciones from './pages/notifications'
import Feedback from './pages/feedback'
import AdminCatalogPage from './pages/librarian/adminCatalog'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/homelibrarian" element={<AdminDashboard />} />
        <Route path="/catalog" element={<CatalogoPage />} />
        <Route path="/homelibrarian/prestamos" element={<PrestamosPage />} />
        <Route path="/homelibrarian/reportes" element={<ReportesPage />} />
        <Route path="/homelibrarian/users" element={<GestionUsuariosPage />} />
        <Route path="/loans" element={<MisPrestamos />} />
        <Route path="/notifications" element={<Notificaciones />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path='/homelibrarian/catalog' element={<AdminCatalogPage/>}/>


      </Routes>
    </Router>
  )
}

export default App
