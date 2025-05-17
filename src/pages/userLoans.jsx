import React, { useState } from "react";
import { 
  Card, 
  Table, 
  Button, 
  Dropdown, 
  Badge, 
  OverlayTrigger, 
  Tooltip, 
  Popover,
  Image,
  Row,
  Col,
  Container,
  Nav,
  Form,
  Modal
} from 'react-bootstrap';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  BookOpenCheck, 
  ArrowUpDown, 
  MoreHorizontal,
  BookOpen,
  BookMarked,
  Search,
  Bell,
  User,
  LogOut,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

// Datos de ejemplo (mantener igual)
const prestamosActivos = [{
    id: "1",
    titulo: "Fundamentos de Programación",
    autor: "Luis Joyanes Aguilar",
    fechaPrestamo: new Date(2023, 4, 15),
    fechaDevolucion: new Date(2023, 5, 15),
    estado: "activo",
    imagen: "/placeholder.svg?height=50&width=40",
    codigo: "PRG-001",
  },
  {
    id: "2",
    titulo: "Cálculo de una Variable",
    autor: "James Stewart",
    fechaPrestamo: new Date(2023, 4, 10),
    fechaDevolucion: new Date(2023, 5, 10),
    estado: "por vencer",
    imagen: "/placeholder.svg?height=50&width=40",
    codigo: "MAT-002",
  },
  {
    id: "3",
    titulo: "Física Universitaria",
    autor: "Sears Zemansky",
    fechaPrestamo: new Date(2023, 4, 5),
    fechaDevolucion: new Date(2023, 5, 5),
    estado: "vencido",
    imagen: "/placeholder.svg?height=50&width=40",
    codigo: "FIS-003",
  },];
const prestamosReservados = [ {
    id: "4",
    titulo: "Inteligencia Artificial: Un enfoque moderno",
    autor: "Stuart Russell, Peter Norvig",
    fechaReserva: new Date(2023, 4, 20),
    fechaDisponibilidad: new Date(2023, 5, 1),
    estado: "en espera",
    imagen: "/placeholder.svg?height=50&width=40",
    codigo: "IA-004",
  },
  {
    id: "5",
    titulo: "Redes de Computadoras",
    autor: "Andrew S. Tanenbaum",
    fechaReserva: new Date(2023, 4, 18),
    fechaDisponibilidad: new Date(2023, 4, 25),
    estado: "disponible",
    imagen: "/placeholder.svg?height=50&width=40",
    codigo: "RED-005",
  },];

export default function MisPrestamos() {
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [showRenovacionModal, setShowRenovacionModal] = useState(false);
  const navigate = useNavigate();

  let username = 'Estudiante';
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      username = localStorage.getItem('sgp-uci-username') || 'Estudiante';
    } catch (e) {
      username = 'Estudiante';
    }
  }

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

  const getBadgeVariant = (estado) => {
    switch (estado) {
      case "activo": return "primary";
      case "por vencer": return "warning";
      case "vencido": return "danger";
      case "en espera": return "secondary";
      case "disponible": return "success";
      default: return "light";
    }
  };

  const renderTooltip = (fecha) => (
    <Tooltip id="date-tooltip">
      {format(fecha, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
    </Tooltip>
  );

  // Función para mostrar el popup al solicitar renovación
  const handleSolicitarRenovacion = () => {
    setShowRenovacionModal(true);
    // Aquí podrías agregar lógica para enviar la solicitud real si lo deseas
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header igual a Home */}
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

              <Button variant="link" className="position-relative p-0">
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
        {/* Sidebar igual a Home */}
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
          <Container className="py-4">
            <h1 className="h2 mb-4 fw-bold">Mis Préstamos</h1>

            <Row className="g-4">
              {/* Préstamos Activos */}
              <Col xs={12}>
                <Card>
                  <Card.Header className="d-flex align-items-center gap-2">
                    <BookOpenCheck size={20} />
                    <span className="h5 mb-0">Préstamos Activos</span>
                  </Card.Header>
                  <Card.Body>
                    <Table striped hover responsive>
                      <thead>
                        <tr>
                          <th>Libro</th>
                          <th>
                            <span className="d-flex align-items-center gap-1">
                              Fecha Préstamo
                              <ArrowUpDown size={14} />
                            </span>
                          </th>
                          <th>
                            <span className="d-flex align-items-center gap-1">
                              Fecha Devolución
                              <ArrowUpDown size={14} />
                            </span>
                          </th>
                          <th>Estado</th>
                          <th className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prestamosActivos.map((prestamo) => (
                          <tr key={prestamo.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <Image
                                  src={prestamo.imagen}
                                  alt={prestamo.titulo}
                                  width={40}
                                  height={50}
                                  className="rounded border"
                                />
                                <div>
                                  <div className="fw-medium">{prestamo.titulo}</div>
                                  <small className="text-muted">{prestamo.autor}</small>
                                  <small className="d-block text-muted">Código: {prestamo.codigo}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <OverlayTrigger placement="top" overlay={renderTooltip(prestamo.fechaPrestamo)}>
                                <div className="d-flex align-items-center gap-1">
                                  <CalendarIcon size={14} className="text-muted" />
                                  {format(prestamo.fechaPrestamo, "dd MMM yyyy", { locale: es })}
                                </div>
                              </OverlayTrigger>
                            </td>
                            <td>
                              <OverlayTrigger placement="top" overlay={renderTooltip(prestamo.fechaDevolucion)}>
                                <div className="d-flex align-items-center gap-1">
                                  <Clock size={14} className="text-muted" />
                                  {format(prestamo.fechaDevolucion, "dd MMM yyyy", { locale: es })}
                                </div>
                              </OverlayTrigger>
                            </td>
                            <td>
                              <Badge bg={getBadgeVariant(prestamo.estado)}>
                                {prestamo.estado === "por vencer" ? "Por vencer" : prestamo.estado}
                              </Badge>
                            </td>
                            <td className="text-end">
                              <Dropdown>
                                <Dropdown.Toggle variant="link" className="p-0">
                                  <MoreHorizontal size={16} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                  <Dropdown.Header>Acciones</Dropdown.Header>
                                  <Dropdown.Item>Ver detalles</Dropdown.Item>
                                  <Dropdown.Item onClick={handleSolicitarRenovacion}>Solicitar renovación</Dropdown.Item>
                                  <Dropdown.Item>Reportar problema</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              {/* Reservas */}
              <Col xs={12}>
                <Card>
                  <Card.Header className="d-flex align-items-center gap-2">
                    <Clock size={20} />
                    <span className="h5 mb-0">Reservas</span>
                  </Card.Header>
                  <Card.Body>
                    <Table striped hover responsive>
                      <thead>
                        <tr>
                          <th>Libro</th>
                          <th>Fecha Reserva</th>
                          <th>Disponible hasta</th>
                          <th>Estado</th>
                          <th className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prestamosReservados.map((reserva) => (
                          <tr key={reserva.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <Image
                                  src={reserva.imagen}
                                  alt={reserva.titulo}
                                  width={40}
                                  height={50}
                                  className="rounded border"
                                />
                                <div>
                                  <div className="fw-medium">{reserva.titulo}</div>
                                  <small className="text-muted">{reserva.autor}</small>
                                  <small className="d-block text-muted">Código: {reserva.codigo}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <OverlayTrigger placement="top" overlay={renderTooltip(reserva.fechaReserva)}>
                                <div className="d-flex align-items-center gap-1">
                                  <CalendarIcon size={14} className="text-muted" />
                                  {format(reserva.fechaReserva, "dd MMM yyyy", { locale: es })}
                                </div>
                              </OverlayTrigger>
                            </td>
                            <td>
                              <OverlayTrigger placement="top" overlay={renderTooltip(reserva.fechaDisponibilidad)}>
                                <div className="d-flex align-items-center gap-1">
                                  <Clock size={14} className="text-muted" />
                                  {format(reserva.fechaDisponibilidad, "dd MMM yyyy", { locale: es })}
                                </div>
                              </OverlayTrigger>
                            </td>
                            <td>
                              <Badge bg={getBadgeVariant(reserva.estado)}>
                                {reserva.estado === "en espera" ? "En espera" : "Disponible"}
                              </Badge>
                            </td>
                            <td className="text-end">
                              <Dropdown>
                                <Dropdown.Toggle variant="link" className="p-0">
                                  <MoreHorizontal size={16} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                  <Dropdown.Header>Acciones</Dropdown.Header>
                                  <Dropdown.Item>Ver detalles</Dropdown.Item>
                                  <Dropdown.Item>Cancelar reserva</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              {/* Calendario */}
              <Col xs={12}>
                <Card>
                  <Card.Header className="d-flex align-items-center gap-2">
                    <CalendarIcon size={20} />
                    <span className="h5 mb-0">Calendario de Devoluciones</span>
                  </Card.Header>
                  <Card.Body>
                    
                    
                    <div className="d-grid gap-3">
                      {prestamosActivos.map((prestamo) => (
                        <div key={prestamo.id} className="d-flex align-items-center p-3 border rounded">
                          <Image
                            src={prestamo.imagen}
                            alt={prestamo.titulo}
                            width={40}
                            height={50}
                            className="me-3 rounded border"
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium">{prestamo.titulo}</div>
                            <small className="text-muted">{prestamo.autor}</small>
                          </div>
                          <div className="text-end">
                            <div className="text-sm">Devolución:</div>
                            <div className="text-sm fw-medium">
                              {format(prestamo.fechaDevolucion, "dd MMM yyyy", { locale: es })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
          {/* Modal de confirmación de solicitud de renovación */}
          <Modal
            show={showRenovacionModal}
            onHide={() => setShowRenovacionModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Solicitud enviada</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Tu solicitud de renovación ha sido enviada correctamente.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShowRenovacionModal(false)}>
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    </div>
  );
}