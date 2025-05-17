import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Nav, Button, Form, Badge, Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BookOpen, BookPlus, Calendar, Search, Bell, BookMarked, History, User, LogOut, MessageCircle } from 'lucide-react';

export default function Home() {
  let username = 'Estudiante';
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      username = localStorage.getItem('sgp-uci-username') || 'Estudiante';
    } catch (e) {
      username = 'Estudiante';
    }
  }
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('sgp-uci-username');
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
              {/* Cambia el Form para manejar la búsqueda */}
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
                <Bell size={20} />
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">3</Badge>
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

            {/* Stats Cards */}
            <Row className="g-4 mb-4">
              <Col md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="h6 mb-0">Préstamos Activos</Card.Title>
                        <div className="h3 fw-bold mt-2">3</div>
                        <small className="text-muted">2 vencen esta semana</small>
                      </div>
                      <BookOpen className="text-primary" size={32} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="h6 mb-0">Reservas</Card.Title>
                        <div className="h3 fw-bold mt-2">1</div>
                        <small className="text-muted">Disponible para recoger</small>
                      </div>
                      <BookPlus className="text-success" size={32} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={4}>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="h6 mb-0">Historial</Card.Title>
                        <div className="h3 fw-bold mt-2">12</div>
                        <small className="text-muted">Préstamos completados</small>
                      </div>
                      <Calendar className="text-purple" size={32} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Tabs Section */}
            <Tabs defaultActiveKey="prestamos" className="mb-3">
              <Tab eventKey="prestamos" title="Préstamos Activos">
                <Card className="mt-3">
                  <Card.Body>
                    <Card.Title>Mis Préstamos Activos</Card.Title>
                    <Card.Text className="text-muted mb-4">
                      Gestiona tus préstamos actuales y fechas de devolución
                    </Card.Text>

                    {[1, 2, 3].map((item, idx) => (
                      <Card key={`prestamo-${idx}`} className="mb-3">
                        <Card.Body>
                          <Row className="align-items-center">
                            <Col md={8}>
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary bg-opacity-10 p-2 rounded">
                                  <BookOpen className="text-primary" size={32} />
                                </div>
                                <div>
                                  <h5 className="mb-1">Título del Libro {item}</h5>
                                  <small className="text-muted">Autor del Libro {item}</small>
                                </div>
                              </div>
                            </Col>
                            <Col md={4} className="text-end">
                              <div className="mb-2">Vence: 15/05/2025</div>
                              <Badge bg={item === 1 ? 'danger' : 'secondary'}>
                                {item === 1 ? 'Vence pronto' : '10 días restantes'}
                              </Badge>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
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

                    {[1, 2, 3].map((item, idx) => (
                      <Card key={`notificacion-${idx}`} className="mb-3">
                        <Card.Body>
                          <div className="d-flex align-items-start gap-3">
                            <Badge pill bg={item === 1 ? 'danger' : 'secondary'} className="mt-1">
                              {item === 1 ? 'Urgente' : 'Información'}
                            </Badge>
                            <div>
                              <h5 className="mb-1">Título de Notificación {item}</h5>
                              <p className="text-muted mb-1">
                                Descripción detallada de la notificación {item}
                              </p>
                              <small className="text-muted">Fecha: 15/05/2025</small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
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