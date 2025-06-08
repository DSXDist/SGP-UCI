import React, { useEffect, useState } from 'react';
import {
  Navbar,
  Nav,
  Button,
  Form,
  Card,
  Container,
  Row,
  Col,
  // Tab,
  // Tabs,
  // Table,
  // Dropdown,
  Modal,
  Badge,
  // InputGroup,
  FormControl
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  // Search,
  Bell,
  LogOut,
  Plus,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  // MessageCircle,
  User
} from "lucide-react";

export default function AdminDashboard() {
  const [showModal, setShowModal] = React.useState(false);
  const [stats, setStats] = useState({
    loans: 0,
    users: 0,
    books: 0,
    vencimientos: 0,
  });

  // Obtener nombre de usuario desde localStorage (como en login)
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
    localStorage.removeItem('sgp-uci-token');
    localStorage.removeItem('sgp-uci-id');
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem('sgp-uci-token');
    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };

    const fetchStats = async () => {
      try {
        // Préstamos activos y vencimientos
        const loansRes = await fetch('http://localhost:8000/library/api/loans', {
          method: 'GET',
          headers
        });
        const loansData = await loansRes.json();
        const activos = loansData.filter(l => l.status === 'ACTIVE').length;
        const vencidos = loansData.filter(l => l.status === 'OFFDATE').length;

        // Usuarios registrados
        const usersRes = await fetch('http://localhost:8000/library/api/users', {
          method: 'GET',
          headers
        });
        const usersData = await usersRes.json();

        // Libros disponibles (nuevo formato de fetch)
        fetch('http://localhost:8000/library/api/books/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            setStats(prev => ({
              ...prev,
              loans: activos,
              vencimientos: vencidos,
              users: usersData.length,
              books: data.length // o el conteo que necesites
            }));
          })
          .catch(() => {
            setStats(prev => ({
              ...prev,
              loans: activos,
              vencimientos: vencidos,
              users: usersData.length,
              books: 0
            }));
          });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header estilo Home */}
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
        {/* Sidebar */}
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
            {/* Nuevo botón para Catálogo */}
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
            <Nav.Link href="/homelibrarian/reportes" className="d-flex align-items-center gap-2">
              <FileText size={20} />
              Reportes
            </Nav.Link>
          </Nav>
        </div>

        {/* Main Content */}
        <main className="flex-grow-1 p-4">
          <Container fluid>
            <div className="mb-4">
              <h1 className="h2 fw-bold">Panel de Administración</h1>
              <p className="text-muted">Gestión de usuarios, préstamos y reportes del sistema SGP-UCI</p>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-4">
              {[
                {
                  title: 'Préstamos Activos',
                  value: stats.loans,
                  icon: <BookOpen className="text-primary" size={32} />,
                  subtitle: 'Pendientes de aprobación'
                },
                {
                  title: 'Usuarios Registrados',
                  value: stats.users,
                  icon: <Users className="text-success" size={32} />,
                  subtitle: 'Nuevos este mes'
                },
                {
                  title: `Vencimientos Hoy (${stats.vencimientos})`,
                  value: stats.vencimientos,
                  icon: <Calendar className="text-danger" size={32} />,
                  subtitle: 'Con notificación enviada'
                },
                {
                  title: 'Libros Disponibles',
                  value: stats.books,
                  icon: <BookOpen className="text-purple" size={32} />,
                  subtitle: 'Inventario total'
                }
              ].map((card, index) => (
                <Col key={index} md={6} lg={3}>
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Card.Title className="h6 mb-0">{card.title}</Card.Title>
                          <div className="h3 fw-bold mt-2">{card.value}</div>
                          <small className="text-muted">{card.subtitle}</small>
                        </div>
                        {card.icon}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}