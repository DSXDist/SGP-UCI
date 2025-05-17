import React from 'react';
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Search,
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
  RefreshCw,
} from "lucide-react";
import { Navbar, Nav, Container, Row, Col, Card, Button, Form, Table, Dropdown, Badge, Tab, Tabs } from 'react-bootstrap';

export default function PrestamosPage() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <Navbar bg="white" sticky="top" className="border-bottom">
        <Container fluid>
          <Navbar.Brand href="#">
            <BookOpen className="text-primary me-2" />
            <span className="fw-bold">SGP-UCI</span>
            <Badge bg="secondary" className="ms-2">Administrador</Badge>
          </Navbar.Brand>
          
          <div className="d-flex align-items-center ms-auto">
            <Form className="d-none d-md-flex me-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search className="text-muted" />
                </span>
                <Form.Control type="search" placeholder="Buscar..." className="border-start-0" />
              </div>
            </Form>
            
            <Button variant="outline-secondary" className="position-relative me-2">
              <Bell />
              <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">5</Badge>
            </Button>
            
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="d-flex align-items-center gap-2 text-decoration-none">
                <img src="/placeholder.svg" alt="Avatar" className="rounded-circle" style={{width: '32px', height: '32px'}} />
                <span>Bibliotecario</span>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                <Dropdown.Header>Mi cuenta</Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <LogOut className="me-2" />
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          {/* Sidebar */}
          <Col md={3} className="d-none d-md-block bg-white border-end p-3">
            <Nav variant="pills" className="flex-column gap-2">
              <Nav.Link href="/admin" className="d-flex align-items-center gap-2">
                <BarChart3 />
                Dashboard
              </Nav.Link>
              <Nav.Link href="/admin/usuarios" className="d-flex align-items-center gap-2">
                <Users />
                Usuarios
              </Nav.Link>
              <Nav.Link active href="/admin/prestamos" className="d-flex align-items-center gap-2">
                <BookOpen />
                Préstamos
              </Nav.Link>
              <Nav.Link href="/admin/reportes" className="d-flex align-items-center gap-2">
                <FileText />
                Reportes
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col className="p-2 p-md-4">
            <div className="mb-3 mb-md-4">
              <h1 className="h4 h2-md fw-bold">Gestión de Préstamos</h1>
              <p className="text-muted small">Administra los préstamos, solicitudes y devoluciones</p>
            </div>

            {/* Stats Cards */}
            <Row className="g-2 g-md-4 mb-3 mb-md-4">
              <Col xs={12} sm={6} lg={3}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Card.Title className="mb-0 text-muted small">Préstamos Activos</Card.Title>
                      <BookOpen className="text-primary" />
                    </div>
                    <h2 className="mb-1">42</h2>
                    <small className="text-muted">8 pendientes de aprobación</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Card.Title className="mb-0 text-muted small">Vencimientos Hoy</Card.Title>
                      <Calendar className="text-danger" />
                    </div>
                    <h2 className="mb-1">7</h2>
                    <small className="text-muted">3 con notificación enviada</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Card.Title className="mb-0 text-muted small">Devoluciones Hoy</Card.Title>
                      <RefreshCw className="text-success" />
                    </div>
                    <h2 className="mb-1">12</h2>
                    <small className="text-muted">5 ya procesadas</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Card.Title className="mb-0 text-muted small">Solicitudes Nuevas</Card.Title>
                      <Plus className="text-purple" />
                    </div>
                    <h2 className="mb-1">15</h2>
                    <small className="text-muted">8 en las últimas 24 horas</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Tab.Container defaultActiveKey="activos">
              <Nav variant="tabs" className="mb-3 mb-md-4 flex-wrap">
                <Nav.Item>
                  <Nav.Link eventKey="activos">Préstamos Activos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="solicitudes">Solicitudes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="vencidos">Vencidos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="historial">Historial</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="activos">
                  <Card>
                    <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                      <div>
                        <Card.Title>Préstamos Activos</Card.Title>
                        <Card.Text className="text-muted">Gestiona los préstamos actualmente en curso</Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm">
                          <Filter className="me-1" />
                          Filtrar
                        </Button>
                        <Button variant="primary" size="sm">
                          <Plus className="me-1" />
                          Nuevo Préstamo
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{width: '180px', minWidth: '120px'}}>
                          <option>Todos</option>
                          <option>Normal</option>
                          <option>Próximo a vencer</option>
                          <option>Vencido</option>
                        </Form.Select>
                      </div>

                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Usuario</th>
                              <th>Correo</th>
                              <th>Año Académico</th>
                              <th>Libro</th>
                              <th>Fecha Préstamo</th>
                              <th>Fecha Devolución</th>
                              <th>Estado</th>
                              <th className="text-end">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>P-1002</td>
                              <td>Carlos Rodríguez</td>
                              <td>carlos.rodriguez@estudiantes.uci.cu</td>
                              <td>2do año</td>
                              <td>Ingeniería de Software</td>
                              <td>28/04/2025</td>
                              <td>12/05/2025</td>
                              <td>
                                <Badge bg="success">Activo</Badge>
                              </td>
                              <td className="text-end">
                                <Dropdown>
                                  <Dropdown.Toggle variant="link" size="sm">
                                    Acciones
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item>
                                      <Eye className="me-2" />
                                      Ver detalles
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <Clock className="me-2" />
                                      Extender plazo
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <XCircle className="me-2" />
                                      Marcar como devuelto
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                            {/* Más filas... */}
                          </tbody>
                        </Table>
                      </div>

                      <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-3">
                        <Button variant="outline-secondary" size="sm">Anterior</Button>
                        <Button variant="outline-secondary" size="sm">Siguiente</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Solicitudes */}
                <Tab.Pane eventKey="solicitudes">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title>Solicitudes Pendientes</Card.Title>
                        <Card.Text className="text-muted">Gestiona las solicitudes de préstamo pendientes de aprobación</Card.Text>
                      </div>
                      <Button variant="outline-secondary" size="sm">
                        <Filter className="me-1" />
                        Filtrar
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{width: '180px'}}>
                          <option>Todos</option>
                          <option>Alta</option>
                          <option>Media</option>
                          <option>Baja</option>
                        </Form.Select>
                      </div>

                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Año Académico</th>
                            <th>Libro</th>
                            <th>Fecha Solicitud</th>
                            <th>Prioridad</th>
                            <th className="text-end">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>P-1001</td>
                            <td>María González</td>
                            <td>maria.gonzalez@estudiantes.uci.cu</td>
                            <td>3er año</td>
                            <td>Fundamentos de Bases de Datos</td>
                            <td>01/05/2025</td>
                            <td>
                              <Badge bg="warning">Media</Badge>
                            </td>
                            <td className="text-end">
                              <Dropdown>
                                <Dropdown.Toggle variant="link" size="sm">
                                  Acciones
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item>
                                    <Eye className="me-2" />
                                    Ver detalles
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <CheckCircle className="me-2" />
                                    Aprobar
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <XCircle className="me-2" />
                                    Rechazar
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                          {/* Más filas... */}
                        </tbody>
                      </Table>

                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="outline-secondary" size="sm">Anterior</Button>
                        <Button variant="outline-secondary" size="sm">Siguiente</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Vencidos */}
                <Tab.Pane eventKey="vencidos">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title>Préstamos Vencidos</Card.Title>
                        <Card.Text className="text-muted">Gestiona los préstamos que han superado su fecha de devolución</Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm">
                          <Filter className="me-1" />
                          Filtrar
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <Bell className="me-1" />
                          Notificar a todos
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{width: '180px'}}>
                          <option>Todos</option>
                          <option>1-7 días</option>
                          <option>8-15 días</option>
                          <option>Más de 15 días</option>
                        </Form.Select>
                      </div>

                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Año Académico</th>
                            <th>Libro</th>
                            <th>Fecha Vencimiento</th>
                            <th>Días de Retraso</th>
                            <th className="text-end">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>P-1003</td>
                            <td>Ana Martínez</td>
                            <td>ana.martinez@estudiantes.uci.cu</td>
                            <td>4to año</td>
                            <td>Algoritmos y Estructuras de Datos</td>
                            <td>09/05/2025</td>
                            <td>2</td>
                            <td className="text-end">
                              <Dropdown>
                                <Dropdown.Toggle variant="link" size="sm">
                                  Acciones
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item>
                                    <Eye className="me-2" />
                                    Ver detalles
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <Bell className="me-2" />
                                    Enviar recordatorio
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <XCircle className="me-2" />
                                    Marcar como devuelto
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                          {/* Más filas... */}
                        </tbody>
                      </Table>

                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="outline-secondary" size="sm">Anterior</Button>
                        <Button variant="outline-secondary" size="sm">Siguiente</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Historial */}
                <Tab.Pane eventKey="historial">
                  <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title>Historial de Préstamos</Card.Title>
                        <Card.Text className="text-muted">Consulta el historial completo de préstamos realizados</Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm">
                          <Filter className="me-1" />
                          Filtrar
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <Download className="me-1" />
                          Exportar
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{width: '180px'}}>
                          <option>Todos</option>
                          <option>Completados</option>
                          <option>Cancelados</option>
                          <option>Vencidos</option>
                        </Form.Select>
                      </div>

                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Libro</th>
                            <th>Fecha Préstamo</th>
                            <th>Fecha Devolución</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>P-950</td>
                            <td>María González</td>
                            <td>Programación en Java</td>
                            <td>10/04/2025</td>
                            <td>24/04/2025</td>
                            <td>
                              <Badge bg="success">Completado</Badge>
                            </td>
                            <td className="text-end">
                              <Button variant="link" size="sm">
                                <Eye className="me-2" />
                                Ver detalles
                              </Button>
                            </td>
                          </tr>
                          {/* Más filas... */}
                        </tbody>
                      </Table>

                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="outline-secondary" size="sm">Anterior</Button>
                        <Button variant="outline-secondary" size="sm">Siguiente</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}