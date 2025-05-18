import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Bell,
  LogOut,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User
} from "lucide-react";
import { Nav, Container, Card, Button, Form, Table, Dropdown, Badge, Tab, Modal } from 'react-bootstrap';

export default function PrestamosPage() {
  // Simulación de nombre de usuario
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

  // Estado para modales y mensajes
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [showNewPrestamo, setShowNewPrestamo] = useState(false);

  // Funciones para acciones
  const handleShowDetails = (prestamo) => {
    setDetailsData(prestamo);
    setShowDetails(true);
  };

  const handleAction = (msg) => {
    setAlertMsg(msg);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleNewPrestamo = (e) => {
    e && e.preventDefault();
    setShowNewPrestamo(false);
    handleAction("Nuevo préstamo creado correctamente");
  };

  const handleNotificarTodos = () => {
    handleAction("Se ha enviado recordatorios a todos los usuarios");
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

      {/* Modal de acción */}
      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Body className="text-center">
          <CheckCircle className="text-success mb-2" size={32} />
          <div>{alertMsg}</div>
        </Modal.Body>
      </Modal>

      {/* Modal de detalles */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Préstamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsData && (
            <div>
              <p><strong>ID:</strong> {detailsData.id}</p>
              <p><strong>Usuario:</strong> {detailsData.usuario}</p>
              <p><strong>Correo:</strong> {detailsData.correo}</p>
              <p><strong>Año Académico:</strong> {detailsData.año}</p>
              <p><strong>Libro:</strong> {detailsData.libro}</p>
              <p><strong>Fecha Préstamo:</strong> {detailsData.fechaPrestamo}</p>
              <p><strong>Fecha Devolución:</strong> {detailsData.fechaDevolucion}</p>
              <p><strong>Estado:</strong> {detailsData.estado}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Nuevo Préstamo */}
      <Modal show={showNewPrestamo} onHide={() => setShowNewPrestamo(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Préstamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewPrestamo}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control required placeholder="Nombre del usuario" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Libro</Form.Label>
              <Form.Control required placeholder="Título del libro" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Préstamo</Form.Label>
              <Form.Control type="date" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Devolución</Form.Label>
              <Form.Control type="date" required />
            </Form.Group>
            <Button type="submit" variant="primary">
              Crear Préstamo
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
            <Nav.Link
              href="/homelibrarian/prestamos"
              className="d-flex align-items-center gap-2 active"
              style={{
                color: "#212529",
                fontWeight: "bold",
                background: "#e9ecef",
                borderRadius: "0.375rem"
              }}
            >
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
              <h1 className="h2 fw-bold">Gestión de Préstamos</h1>
              <p className="text-muted">Administra los préstamos, solicitudes y devoluciones</p>
            </div>

            {/* Sin estadísticas ni exportar datos */}

            <Tab.Container defaultActiveKey="activos">
              <Nav variant="tabs" className="mb-3 flex-wrap">
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
                {/* Préstamos Activos */}
                <Tab.Pane eventKey="activos">
                  <Card>
                    <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                      <div>
                        <Card.Title>Préstamos Activos</Card.Title>
                        <Card.Text className="text-muted">Gestiona los préstamos actualmente en curso</Card.Text>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => setShowNewPrestamo(true)}>
                          <Plus className="me-1" />
                          Nuevo Préstamo
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex flex-column flex-md-row gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{ width: '180px', minWidth: '120px' }}>
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
                                    <Dropdown.Item onClick={() => handleShowDetails({
                                      id: "P-1002",
                                      usuario: "Carlos Rodríguez",
                                      correo: "carlos.rodriguez@estudiantes.uci.cu",
                                      año: "2do año",
                                      libro: "Ingeniería de Software",
                                      fechaPrestamo: "28/04/2025",
                                      fechaDevolucion: "12/05/2025",
                                      estado: "Activo"
                                    })}>
                                      <Eye className="me-2" />
                                      Ver detalles
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAction("El plazo fue extendido correctamente")}>
                                      <Clock className="me-2" />
                                      Extender plazo
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleAction("El préstamo fue marcado como devuelto")}>
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
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{ width: '180px' }}>
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
                                  <Dropdown.Item onClick={() => handleShowDetails({
                                    id: "P-1001",
                                    usuario: "María González",
                                    correo: "maria.gonzalez@estudiantes.uci.cu",
                                    año: "3er año",
                                    libro: "Fundamentos de Bases de Datos",
                                    fechaPrestamo: "-",
                                    fechaDevolucion: "-",
                                    estado: "Pendiente"
                                  })}>
                                    <Eye className="me-2" />
                                    Ver detalles
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleAction("La solicitud fue aprobada")}>
                                    <CheckCircle className="me-2" />
                                    Aprobar
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleAction("La solicitud fue rechazada")}>
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
                        <Button variant="outline-secondary" size="sm" onClick={handleNotificarTodos}>
                          <Bell className="me-1" />
                          Notificar a todos
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{ width: '180px' }}>
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
                                  <Dropdown.Item onClick={() => handleShowDetails({
                                    id: "P-1003",
                                    usuario: "Ana Martínez",
                                    correo: "ana.martinez@estudiantes.uci.cu",
                                    año: "4to año",
                                    libro: "Algoritmos y Estructuras de Datos",
                                    fechaPrestamo: "-",
                                    fechaDevolucion: "-",
                                    estado: "Vencido"
                                  })}>
                                    <Eye className="me-2" />
                                    Ver detalles
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleAction("Se envió un recordatorio al usuario")}>
                                    <Bell className="me-2" />
                                    Enviar recordatorio
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={() => handleAction("El préstamo fue marcado como devuelto")}>
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
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex gap-2 mb-3">
                        <Form.Control placeholder="Buscar por usuario o libro..." />
                        <Form.Select style={{ width: '180px' }}>
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
                              <Button variant="link" size="sm" onClick={() => handleShowDetails({
                                id: "P-950",
                                usuario: "María González",
                                correo: "-",
                                año: "-",
                                libro: "Programación en Java",
                                fechaPrestamo: "10/04/2025",
                                fechaDevolucion: "24/04/2025",
                                estado: "Completado"
                              })}>
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
          </Container>
        </main>
      </div>
    </div>
  );
}