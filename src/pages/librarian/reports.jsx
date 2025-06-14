import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  LogOut,
  User
} from "lucide-react";
import { Nav, Container, Card, Button, Badge, Tab } from 'react-bootstrap';

export default function ReportesPage() {
  // Obtener nombre de usuario desde localStorage (como en homeLibrarian)
  let username = 'Bibliotecario';
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      username = localStorage.getItem('sgp-uci-username') || 'Bibliotecario';
    } catch (e) {
      username = 'Bibliotecario';
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sgp-uci-username');
    window.location.href = '/';
  };

  // Estado para tabs de reportes
  const [activeKey, setActiveKey] = useState("prestamos");

  // Reporte de Préstamos (ya implementado)
  const handleDownloadPrestamos = async () => {
    const token = localStorage.getItem('sgp-uci-token');
    const res = await fetch('http://localhost:8000/library/api/loans/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();

    const doc = new jsPDF();
    doc.text("Reporte de Préstamos", 14, 16);

    const rows = (Array.isArray(data) ? data : []).map(p => [
      p.id,
      p.book_title,
      p.loan_date,
      p.return_date,
      p.status
    ]);
    autoTable(doc, {
      head: [["ID", "Libro", "Fecha Préstamo", "Fecha Devolución", "Estado"]],
      body: rows,
      startY: 22
    });

    doc.save("reporte_prestamos.pdf");
  };

  // Reporte de Usuarios
  const handleDownloadUsuarios = async () => {
    const token = localStorage.getItem('sgp-uci-token');
    const res = await fetch('http://localhost:8000/library/api/users/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();

    const doc = new jsPDF();
    doc.text("Reporte de Usuarios", 14, 16);

    const rows = (Array.isArray(data) ? data : []).map(u => [
      u.id,
      u.username,
      u.email,
      u.academic_year || "-",
      u.is_active ? "Activo" : "Inactivo"
    ]);
    autoTable(doc, {
      head: [["ID", "Usuario", "Correo", "Año Académico", "Estado"]],
      body: rows,
      startY: 22
    });

    doc.save("reporte_usuarios.pdf");
  };

  // Reporte de Libros
  const handleDownloadLibros = async () => {
    const token = localStorage.getItem('sgp-uci-token');
    const res = await fetch('http://localhost:8000/library/api/books/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();

    const doc = new jsPDF();
    doc.text("Reporte de Libros", 14, 16);

    const rows = (Array.isArray(data) ? data : []).map(b => [
      b.id,
      b.title,
      b.author,
      b.total_copies,
      b.available_copies
    ]);
    autoTable(doc, {
      head: [["ID", "Título", "Autor", "Ejemplares Totales", "Disponibles"]],
      body: rows,
      startY: 22
    });

    doc.save("reporte_libros.pdf");
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header igual a homeLibrarian */}
      <header className="sticky-top bg-white border-bottom py-3">
        <Container fluid>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-4">
              <BookOpen className="text-primary me-2" size={24} />
              <span className="h5 mb-0 fw-bold">SGP-UCI</span>
              <Badge bg="secondary" className="ms-2 align-self-center">Administrador</Badge>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <Button variant="link" className="d-flex align-items-center gap-2 text-dark text-decoration-none p-0">
                  <User className="rounded-circle bg-light border" size={32} />
                  <span>{username}</span>
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center gap-1"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <div className="d-flex flex-grow-1">
        {/* Sidebar igual a homeLibrarian */}
        <div className="d-none d-md-block bg-white border-end" style={{ width: '240px' }}>
          <Nav className="flex-column p-3 gap-2">
            <Nav.Link href="/homelibrarian" className="d-flex align-items-center gap-2 text-dark">
              <BarChart3 size={20} />
              Dashboard
            </Nav.Link>
            <Nav.Link href="/homelibrarian/users" className="d-flex align-items-center gap-2">
              <Users size={20} />
              Usuarios
            </Nav.Link>
            <Nav.Link
              href="/homelibrarian/catalog"
              className="d-flex align-items-center gap-2"
            >
              <BookOpen size={20} />
              Catálogo
            </Nav.Link>
            <Nav.Link href="/homelibrarian/prestamos" className="d-flex align-items-center gap-2">
              <BookOpen size={20} />
              Préstamos
            </Nav.Link>
            <Nav.Link href="/homelibrarian/reportes" className="d-flex align-items-center gap-2 active"
              style={{
                color: "#212529",
                fontWeight: "bold",
                background: "#e9ecef",
                borderRadius: "0.375rem"
              }}>
              <FileText size={20} />
              Reportes
            </Nav.Link>
          </Nav>
        </div>

        {/* Main Content */}
        <main className="flex-grow-1 p-4">
          <Container fluid>
            <div className="mb-4">
              <h1 className="h2 fw-bold">Reportes y Estadísticas</h1>
              <p className="text-muted">Genera reportes estadísticos y listados de préstamos</p>
            </div>
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="prestamos">Reporte de Préstamos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="usuarios">Reporte de Usuarios</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="libros">Reporte de Libros</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="prestamos">
                  <Card>
                    <Card.Body>
                      <Card.Title>Reporte de Préstamos</Card.Title>
                      <Card.Text>
                        Descarga un listado de todos los préstamos realizados, incluyendo fechas, usuarios y estado.
                      </Card.Text>
                      <Button variant="primary" onClick={handleDownloadPrestamos}>
                        Descargar reporte
                      </Button>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="usuarios">
                  <Card>
                    <Card.Body>
                      <Card.Title>Reporte de Usuarios</Card.Title>
                      <Card.Text>
                        Descarga información sobre los usuarios y su actividad de préstamos.
                      </Card.Text>
                      <Button variant="primary" onClick={handleDownloadUsuarios}>
                        Descargar reporte
                      </Button>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="libros">
                  <Card>
                    <Card.Body>
                      <Card.Title>Reporte de Libros</Card.Title>
                      <Card.Text>
                        Descarga estadísticas de uso y préstamos por libro.
                      </Card.Text>
                      <Button variant="primary" onClick={handleDownloadLibros}>
                        Descargar reporte
                      </Button>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Container>
        </main>
      </div>
    </div>
  );
}