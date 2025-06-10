import React, { useState, useEffect } from "react";
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
  BellDot, // <-- Agrega esta línea
  User,
  LogOut,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function MisPrestamos() {
  const [search, setSearch] = useState('');
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [prestamoDetalle, setPrestamoDetalle] = useState(null);
  const navigate = useNavigate();

  let username = 'Estudiante';
  let userId = 5;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      username = localStorage.getItem('sgp-uci-username') || 'Estudiante';
      userId = localStorage.getItem('sgp-uci-id') || 5;
    } catch (e) {
      username = 'Estudiante';
    }
  }

  useEffect(() => {
    const fetchPrestamos = async () => {
      setLoading(true);
      const token = localStorage.getItem('sgp-uci-token');
      try {
        const res = await fetch(`http://localhost:8000/library/api/users/${userId}/loans`, {
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
      setLoading(false);
    };
    fetchPrestamos();
  }, [userId]);

  useEffect(() => {
    let userId = null;
    if (typeof window !== "undefined" && window.localStorage) {
      userId = localStorage.getItem('sgp-uci-id');
    }
    if (!userId) return;
    setLoadingNotificaciones(true);
    const token = localStorage.getItem('sgp-uci-token');
    fetch(`http://localhost:8000/library/api/users/${userId}/notifications`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setNotificaciones(Array.isArray(data) ? data.filter(n => n.is_read === false) : []);
        setLoadingNotificaciones(false);
      })
      .catch(() => {
        setNotificaciones([]);
        setLoadingNotificaciones(false);
      });
  }, []);

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

  const getBadgeVariant = (status) => {
    switch (status) {
      case "ONDATE": return "primary";
      case "OFFDATE": return "danger";
      case "AWAITING": return "secondary";
      default: return "light";
    }
  };

  const renderTooltip = (fecha) => (
    <Tooltip id="date-tooltip">
      {fecha ? format(new Date(fecha), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es }) : ""}
    </Tooltip>
  );

  // Mostrar modal de detalles
  const handleVerDetalles = (prestamo) => {
    setPrestamoDetalle(prestamo);
    setShowDetailsModal(true);
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

              <Button
                variant="link"
                className="position-relative p-0"
                onClick={() => navigate('/notifications')}
              >
                {notificaciones && notificaciones.length > 0 ? (
                  <BellDot size={20} className="text-danger" />
                ) : (
                  <Bell size={20} />
                )}
                {notificaciones && notificaciones.length > 0 && (
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
              {/* Préstamos del usuario */}
              <Col xs={12}>
                <Card>
                  <Card.Header className="d-flex align-items-center gap-2">
                    <BookOpenCheck size={20} />
                    <span className="h5 mb-0">Préstamos</span>
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
                        {loading ? (
                          <tr>
                            <td colSpan={5} className="text-center">Cargando...</td>
                          </tr>
                        ) : prestamos.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center text-muted">No tienes préstamos.</td>
                          </tr>
                        ) : (
                          prestamos.map((prestamo) => (
                            <tr key={prestamo.id}>
                              <td>
                                <div className="fw-medium">{prestamo.book_title}</div>
                              </td>
                              <td>
                                <OverlayTrigger placement="top" overlay={renderTooltip(prestamo.loan_date)}>
                                  <div className="d-flex align-items-center gap-1">
                                    <CalendarIcon size={14} className="text-muted" />
                                    {prestamo.loan_date}
                                  </div>
                                </OverlayTrigger>
                              </td>
                              <td>
                                <OverlayTrigger placement="top" overlay={renderTooltip(prestamo.return_date)}>
                                  <div className="d-flex align-items-center gap-1">
                                    <Clock size={14} className="text-muted" />
                                    {prestamo.return_date}
                                  </div>
                                </OverlayTrigger>
                              </td>
                              <td>
                                <Badge bg={getBadgeVariant(prestamo.status)}>
                                  {prestamo.status === "ONDATE"
                                    ? "Activo"
                                    : prestamo.status === "OFFDATE"
                                    ? "Vencido"
                                    : prestamo.status === "AWAITING"
                                    ? "Pendiente"
                                    : prestamo.status}
                                </Badge>
                              </td>
                              <td className="text-end">
                                <Dropdown>
                                  <Dropdown.Toggle variant="link" className="p-0">
                                    <MoreHorizontal size={16} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu align="end">
                                    <Dropdown.Header>Acciones</Dropdown.Header>
                                    <Dropdown.Item onClick={() => handleVerDetalles(prestamo)}>Ver detalles</Dropdown.Item>
                                    <Dropdown.Item onClick={() => navigate('/feedback')}>Reportar problema</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
          {/* Modal de detalles del préstamo */}
          <Modal
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Detalles del Préstamo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {prestamoDetalle ? (
                <div>
                  <p><strong>ID:</strong> {prestamoDetalle.id}</p>
                  <p><strong>Libro:</strong> {prestamoDetalle.book_title}</p>
                  <p><strong>ID Libro:</strong> {prestamoDetalle.book}</p>
                  <p><strong>Fecha Préstamo:</strong> {prestamoDetalle.loan_date}</p>
                  <p><strong>Fecha Devolución:</strong> {prestamoDetalle.return_date}</p>
                  <p><strong>Estado:</strong> {prestamoDetalle.status === "ONDATE"
                    ? "Activo"
                    : prestamoDetalle.status === "OFFDATE"
                    ? "Vencido"
                    : prestamoDetalle.status === "AWAITING"
                    ? "Pendiente"
                    : prestamoDetalle.status}
                  </p>
                  <p><strong>Devuelto:</strong> {prestamoDetalle.returned ? "Sí" : "No"}</p>
                </div>
              ) : (
                <div>No hay datos para mostrar.</div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </main>
      </div>
    </div>
  );
}