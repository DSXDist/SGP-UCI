import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Nav, Button, Form, Badge, Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BookOpen, Search, Bell, BellDot, BookMarked, User, LogOut, MessageCircle } from 'lucide-react';

export default function Home() {
  let username = 'Estudiante';
  let userId = null;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      username = localStorage.getItem('sgp-uci-username') || 'Estudiante';
      userId = localStorage.getItem('sgp-uci-id');
    } catch (e) {
      username = 'Estudiante';
    }
  }
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [prestamos, setPrestamos] = useState([]);
  const [loadingPrestamos, setLoadingPrestamos] = useState(true);

  // Estado para notificaciones
  const [notificaciones, setNotificaciones] = useState([]);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(true);

  useEffect(() => {
    const fetchPrestamos = async () => {
      if (!userId) return;
      setLoadingPrestamos(true);
      const token = localStorage.getItem('sgp-uci-token');
      try {
        const res = await fetch(`http://localhost:8000/library/api/users/${userId}/loans/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        setPrestamos(Array.isArray(data) ? data : []);
      } catch {
        setPrestamos([]);
      }
      setLoadingPrestamos(false);
    };
    fetchPrestamos();
  }, [userId]);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      if (!userId) return;
      setLoadingNotificaciones(true);
      const token = localStorage.getItem('sgp-uci-token');
      try {
        const res = await fetch(`http://localhost:8000/library/api/users/${userId}/notifications`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        // Solo notificaciones no leídas
        setNotificaciones(Array.isArray(data) ? data.filter(n => n.is_read === false) : []);
      } catch {
        setNotificaciones([]);
      }
      setLoadingNotificaciones(false);
    };
    fetchNotificaciones();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('sgp-uci-username');
    localStorage.removeItem('sgp-uci-id');
    localStorage.removeItem('sgp-uci-token');
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalog?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="sticky-top bg-white border-bottom py-3">
        <Container fluid>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-4">
              <BookOpen className="text-primary me-2" size={24} />
              <span className="h5 mb-0 fw-bold">SGP-UCI</span>
            </div>
            
            <div className="ms-auto d-flex align-items-center gap-3">
              <Form className="d-none d-md-flex" onSubmit={handleSearchSubmit}>
                <div className="input-group">
                  <Button
                    variant="outline-secondary"
                    className="input-group-text border-end-0"
                    style={{ border: "none", background: "none", padding: 0 }}
                    onClick={() => {
                      if (search.trim()) {
                        navigate(`/catalog?query=${encodeURIComponent(search)}`);
                      }
                    }}
                    type="button"
                    title="Buscar"
                  >
                    <Search size={18} />
                  </Button>
                  <Form.Control 
                    type="search" 
                    placeholder="Buscar libros..." 
                    className="border-start-0"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </Form>

              <Button
                variant="link"
                className="position-relative p-0"
                onClick={() => navigate('/notifications')}
              >
                {notificaciones.length > 0 ? (
                  <BellDot size={20} className="text-danger" />
                ) : (
                  <Bell size={20} />
                )}
                {notificaciones.length > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {notificaciones.length}
                  </Badge>
                )}
              </Button>

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
        <aside className="d-none d-md-block bg-white border-end" style={{width: '240px'}}>
          <Nav className="flex-column p-3 gap-2">
            {[
              { icon: <BookMarked size={20} />, text: 'Inicio', route: '/home' },
              { icon: <BookOpen size={20} />, text: 'Mis Préstamos', route: '/loans' },
              { icon: <Search size={20} />, text: 'Catálogo', route: '/catalog' },
              { icon: <Bell size={20} />, text: 'Notificaciones', route: '/notifications' },
              { icon: <MessageCircle size={20} />, text: 'Feedback', route: '/feedback' }
            ].map((item, index) => (
              <Button 
                key={index}
                variant="light" 
                className="d-flex align-items-center gap-2 text-start justify-content-start"
                onClick={() => navigate(item.route)}
              >
                {item.icon}
                {item.text}
              </Button>
            ))}
          </Nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 p-4">
          <Container fluid>
            <div className="mb-4">
              <h1 className="h2 fw-bold">Bienvenido al SGP-UCI</h1>
              <p className="text-muted">Sistema de Gestión de Préstamos de la Biblioteca Universitaria</p>
            </div>

            {/* Tabs Section */}
            <Tabs defaultActiveKey="prestamos" className="mb-3">
              <Tab eventKey="prestamos" title="Préstamos Activos">
                <Card className="mt-3">
                  <Card.Body>
                    <Card.Title>Mis Préstamos Activos</Card.Title>
                    <Card.Text className="text-muted mb-4">
                      Gestiona tus préstamos actuales y fechas de devolución
                    </Card.Text>

                    {loadingPrestamos ? (
                      <div className="text-center my-4">Cargando...</div>
                    ) : prestamos.length === 0 ? (
                      <div className="text-center my-4 text-muted">No tienes préstamos activos.</div>
                    ) : (
                      prestamos.map((prestamo) => {
                        // Calcular días restantes
                        let diasRestantes = "-";
                        if (prestamo.return_date) {
                          const hoy = new Date();
                          const fechaVence = new Date(prestamo.return_date);
                          hoy.setHours(0,0,0,0);
                          fechaVence.setHours(0,0,0,0);
                          const diffMs = fechaVence - hoy;
                          diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                        }
                        return (
                          <Card key={prestamo.id} className="mb-3">
                            <Card.Body>
                              <Row className="align-items-center">
                                <Col md={8}>
                                  <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 p-2 rounded">
                                      <BookOpen className="text-primary" size={32} />
                                    </div>
                                    <div>
                                      <h5 className="mb-1">{prestamo.book_title}</h5>
                                    </div>
                                  </div>
                                </Col>
                                <Col md={4} className="text-end">
                                  <div className="mb-2">
                                    Vence: {typeof diasRestantes === "number" && diasRestantes >= 0
                                      ? `en ${diasRestantes} día${diasRestantes === 1 ? '' : 's'}`
                                      : "fecha vencida"}
                                  </div>
                                  <Badge bg={prestamo.status === 'ONDATE' ? 'secondary' : 'danger'}>
                                    {prestamo.status === 'ONDATE' ? 'Activo' : 'Vencido'}
                                  </Badge>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        );
                      })
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="notificaciones" title="Notificaciones">
                <Card className="mt-3">
                  <Card.Body>
                    <Card.Title>Notificaciones</Card.Title>
                    <Card.Text className="text-muted mb-4">
                      Mantente al día con tus préstamos y eventos de la biblioteca
                    </Card.Text>

                    {loadingNotificaciones ? (
                      <div className="text-center my-4">Cargando...</div>
                    ) : notificaciones.length === 0 ? (
                      <div className="text-center my-4 text-muted">No tienes notificaciones nuevas.</div>
                    ) : (
                      notificaciones.map((notif, idx) => {
                        // Calcular días desde la creación
                        let diasDesde = "";
                        if (notif.created_at) {
                          const hoy = new Date();
                          const fechaNotif = new Date(notif.created_at);
                          hoy.setHours(0,0,0,0);
                          fechaNotif.setHours(0,0,0,0);
                          const diffMs = hoy - fechaNotif;
                          const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                          if (dias === 0) {
                            diasDesde = "hoy";
                          } else if (dias === 1) {
                            diasDesde = "hace 1 día";
                          } else if (dias > 1) {
                            diasDesde = `hace ${dias} días`;
                          }
                        }

                        return (
                          <Card key={`notificacion-${notif.id}`} className="mb-3">
                            <Card.Body>
                              <div className="d-flex align-items-start gap-3">
                                <Badge pill bg="danger" className="mt-1">
                                  Nueva
                                </Badge>
                                <div>
                                  <h5 className="mb-1">{notif.title}</h5>
                                  <p className="text-muted mb-1">
                                    {notif.description}
                                  </p>
                                  <small className="text-muted">
                                    {notif.created_at
                                      ? `Fecha: ${new Date(notif.created_at).toLocaleDateString()}${diasDesde ? ` (${diasDesde})` : ""}`
                                      : ""}
                                  </small>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        );
                      })
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Container>
        </main>
      </div>
    </div>
  );
}