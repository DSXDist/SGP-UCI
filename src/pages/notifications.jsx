"use client"

import React, { useState, useEffect } from "react"
import {
  Bell,
  BookOpenCheck,
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  CheckCircle2,
  BookOpen,
  BookMarked,
  User,
  LogOut,
  MessageCircle
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { 
  Card, 
  Button, 
  Nav, 
  Badge, 
  Form, 
  InputGroup, 
  Dropdown, 
  Pagination, 
  Alert,
  ListGroup,
  Stack,
  Container,
  Modal
} from "react-bootstrap"
import { useNavigate } from "react-router-dom"

// Datos de ejemplo (igual al original)
const notificaciones = [
  {
    id: "1",
    tipo: "vencimiento",
    titulo: "Préstamo próximo a vencer",
    mensaje: "Tu préstamo del libro 'Fundamentos de Programación' vence en 3 días. Por favor, devuélvelo a tiempo para evitar multas.",
    fecha: new Date(2023, 4, 28, 9, 30),
    leido: false,
    libro: { titulo: "Fundamentos de Programación", codigo: "PRG-001" },
    icono: BookOpenCheck,
  },
   {
    id: "1",
    tipo: "vencimiento",
    titulo: "Préstamo próximo a vencer",
    mensaje:
      "Tu préstamo del libro 'Fundamentos de Programación' vence en 3 días. Por favor, devuélvelo a tiempo para evitar multas.",
    fecha: new Date(2023, 4, 28, 9, 30),
    leido: false,
    libro: {
      titulo: "Fundamentos de Programación",
      codigo: "PRG-001",
    },
    icono: BookOpenCheck,
  },
  {
    id: "2",
    tipo: "disponibilidad",
    titulo: "Libro disponible para recoger",
    mensaje:
      "El libro 'Inteligencia Artificial: Un enfoque moderno' que reservaste ya está disponible para recoger en la biblioteca. Tienes 3 días para recogerlo.",
    fecha: new Date(2023, 4, 27, 14, 15),
    leido: false,
    libro: {
      titulo: "Inteligencia Artificial: Un enfoque moderno",
      codigo: "IA-004",
    },
    icono: CheckCircle2,
  },
  {
    id: "3",
    tipo: "multa",
    titulo: "Multa por retraso",
    mensaje:
      "Has recibido una multa de $5.00 por el retraso en la devolución del libro 'Física Universitaria'. Por favor, regulariza tu situación lo antes posible.",
    fecha: new Date(2023, 4, 25, 11, 45),
    leido: true,
    libro: {
      titulo: "Física Universitaria",
      codigo: "FIS-003",
    },
    icono: Clock,
  },
  {
    id: "4",
    tipo: "renovacion",
    titulo: "Renovación aprobada",
    mensaje:
      "Tu solicitud de renovación para el libro 'Cálculo de una Variable' ha sido aprobada. La nueva fecha de devolución es el 15 de junio de 2023.",
    fecha: new Date(2023, 4, 23, 16, 20),
    leido: true,
    libro: {
      titulo: "Cálculo de una Variable",
      codigo: "MAT-002",
    },
    icono: Calendar,
  },
  {
    id: "5",
    tipo: "sistema",
    titulo: "Mantenimiento programado",
    mensaje:
      "El sistema de la biblioteca estará en mantenimiento el día 30 de mayo de 2023 de 22:00 a 06:00. Durante este período, no podrás realizar préstamos ni devoluciones en línea.",
    fecha: new Date(2023, 4, 20, 10, 0),
    leido: true,
    icono: Bell,
  },
  {
    id: "6",
    tipo: "disponibilidad",
    titulo: "Nuevo libro disponible",
    mensaje:
      "Un nuevo libro que podría interesarte está disponible: 'Programación en Python: De cero a experto'. Puedes reservarlo desde el catálogo.",
    fecha: new Date(2023, 4, 18, 9, 10),
    leido: true,
    icono: BookOpenCheck,
  },
]

export default function Notificaciones() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("todas")
  const [notificacionesState, setNotificacionesState] = useState([])
  const [showRenovacionModal, setShowRenovacionModal] = useState(false)
  const itemsPerPage = 5
  const navigate = useNavigate()

  let username = 'Estudiante'
  let userId = null
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      username = localStorage.getItem('sgp-uci-username') || 'Estudiante'
      userId = localStorage.getItem('sgp-uci-id')
    } catch (e) {
      username = 'Estudiante'
    }
  }

  // Obtener notificaciones reales del backend
  useEffect(() => {
    if (!userId) return
    const token = localStorage.getItem('sgp-uci-token')
    fetch(`http://localhost:8000/library/api/users/${userId}/notifications`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Adaptar los datos para que tengan las mismas propiedades que el mock
        const adaptadas = Array.isArray(data)
          ? data.map(n => ({
              id: n.id,
              tipo: n.type ? n.type.toLowerCase() : "sistema",
              titulo: n.title || "Notificación",
              mensaje: n.description || "",
              fecha: n.created_at ? new Date(n.created_at) : new Date(),
              leido: n.is_read,
              libro: n.book_title
                ? { titulo: n.book_title, codigo: n.book || "" }
                : undefined,
              icono:
                n.type === "DISPONIBILIDAD"
                  ? BookOpenCheck
                  : n.type === "VENCIMIENTO"
                  ? Clock
                  : n.type === "RENOVACION"
                  ? Calendar
                  : n.type === "MULTA"
                  ? Bell
                  : Bell
            }))
          : []
        setNotificacionesState(adaptadas)
      })
      .catch(() => setNotificacionesState([]))
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem('sgp-uci-username')
    navigate('/')
  }

  // Eliminar notificación en backend y frontend
  const eliminarNotificacion = async (id) => {
    const token = localStorage.getItem('sgp-uci-token');
    try {
      await fetch(`http://localhost:8000/library/api/notifications/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch {}
    setNotificacionesState(prev => prev.filter(notif => notif.id !== id));
  };

  // Marcar una notificación como leída en backend y frontend
  const marcarComoLeida = async (id) => {
    const token = localStorage.getItem('sgp-uci-token');
    try {
      await fetch(`http://localhost:8000/library/api/notifications/${id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_read: true })
      });
    } catch {}
    setNotificacionesState(prev =>
      prev.map(notif => notif.id === id ? { ...notif, leido: true } : notif)
    );
  };

  // Marcar todas como leídas en backend y frontend
  const marcarTodasComoLeidas = async () => {
    const token = localStorage.getItem('sgp-uci-token');
    // Actualiza todas en el backend
    await Promise.all(
      notificacionesState
        .filter(notif => !notif.leido)
        .map(notif =>
          fetch(`http://localhost:8000/library/api/notifications/${notif.id}/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_read: true })
          })
        )
    );
    setNotificacionesState(prev => prev.map(notif => ({ ...notif, leido: true })));
  };

  const notificacionesFiltradas = notificacionesState.filter(notif => {
    const matchesSearch = Object.values(notif).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const matchesTab = activeTab === "todas" || 
      (activeTab === "no-leidas" ? !notif.leido : notif.leido)
    
    return matchesSearch && matchesTab
  })

  const paginatedData = notificacionesFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(notificacionesFiltradas.length / itemsPerPage)

  const getBadgeVariant = (tipo) => {
    switch (tipo) {
      case "vencimiento": return "warning"
      case "disponibilidad": return "success"
      case "multa": return "danger"
      case "renovacion": return "info"
      case "sistema": return "secondary"
      default: return "light"
    }
  }

  // Simula la acción de solicitar renovación
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
              <Form className="d-none d-md-flex" onSubmit={e => { e.preventDefault(); }}>
                <div className="input-group">
                  <Button
                    variant="outline-secondary"
                    className="input-group-text border-end-0"
                    style={{ border: "none", background: "none", padding: 0 }}
                    onClick={() => { }}
                    type="button"
                    title="Buscar"
                  >
                    <Search size={18} />
                  </Button>
                  <Form.Control
                    type="search"
                    placeholder="Buscar libros..."
                    className="border-start-0"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
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
        <aside className="d-none d-md-block bg-white border-end" style={{ width: '240px' }}>
          <Nav className="flex-column p-3 gap-2">
            {[
              { icon: <BookMarked size={20} />, text: 'Inicio', route: '/home' },
              { icon: <BookOpen size={20} />, text: 'Mis Préstamos', route: '/loans' },
              { icon: <Search size={20} />, text: 'Catálogo', route: '/catalog' },
              { icon: <Bell size={20} />, text: 'Notificaciones', route: '/notifications' },
              { icon: <MessageCircle size={20} />, text: 'Feedback', route: '/feedback' }
            ].map((item, idx) => (
              <Button
                key={idx}
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
          <Container>
            <h1 className="mb-4">Notificaciones</h1>

            <Card>
              <Card.Header className="d-flex align-items-center gap-2">
                <Bell size={20} />
                <span className="h4 mb-0">Centro de Notificaciones</span>
              </Card.Header>
              
              <Card.Body>
                <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "todas")}>
                  <Nav.Item>
                    <Nav.Link eventKey="todas">
                      Todas <Badge bg="secondary">{notificacionesState.length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="no-leidas">
                      No leídas <Badge bg="secondary">{notificacionesState.filter(n => !n.leido).length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="leidas">
                      Leídas <Badge bg="secondary">{notificacionesState.filter(n => n.leido).length}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Stack gap={3} className="my-4">
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={16} />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Buscar notificaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>

                  <div className="d-flex gap-2 justify-content-between">
                    <Button 
                      variant="outline-secondary" 
                      onClick={marcarTodasComoLeidas}
                    >
                      Marcar todas como leídas
                    </Button>
                    
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary">
                        <Filter size={16} className="me-2" />
                        Filtrar por tipo
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item active>Todos</Dropdown.Item>
                        <Dropdown.Item>Vencimiento</Dropdown.Item>
                        <Dropdown.Item>Disponibilidad</Dropdown.Item>
                        <Dropdown.Item>Multa</Dropdown.Item>
                        <Dropdown.Item>Renovación</Dropdown.Item>
                        <Dropdown.Item>Sistema</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Stack>

                {paginatedData.length > 0 ? (
                  <ListGroup>
                    {paginatedData.map(notificacion => {
                      const Icon = notificacion.icono
                      return (
                        <ListGroup.Item 
                          key={notificacion.id}
                          className={`mb-3 ${!notificacion.leido ? "bg-light" : ""}`}
                        >
                          <div className="d-flex gap-3 align-items-start">
                            <div className={`bg-${getBadgeVariant(notificacion.tipo)}-subtle p-2 rounded`}>
                              <Icon size={24} className={`text-${getBadgeVariant(notificacion.tipo)}`} />
                            </div>

                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="mb-0">{notificacion.titulo}</h5>
                                <Badge bg={getBadgeVariant(notificacion.tipo)}>
                                  {notificacion.tipo}
                                </Badge>
                              </div>

                              <p className="text-muted mb-2">{notificacion.mensaje}</p>
                              
                              {notificacion.libro && (
                                <small className="text-muted d-block">
                                  Libro: {notificacion.libro.titulo} ({notificacion.libro.codigo})
                                </small>
                              )}

                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <small className="text-muted">
                                  {formatDistanceToNow(notificacion.fecha, { 
                                    addSuffix: true, 
                                    locale: es 
                                  })}
                                </small>
                                
                                <div className="d-flex gap-2">
                                  {/* Botón para marcar como leída en el menú */}
                                  <Dropdown>
                                    <Dropdown.Toggle variant="link" id="dropdown-actions">
                                      <MoreHorizontal size={20} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {!notificacion.leido && (
                                        <Dropdown.Item onClick={() => marcarComoLeida(notificacion.id)}>
                                          <CheckCircle2 size={16} className="me-2" />
                                          Marcar como leída
                                        </Dropdown.Item>
                                      )}
                                      <Dropdown.Item onClick={() => eliminarNotificacion(notificacion.id)}>
                                        <Trash2 size={16} className="me-2" />
                                        Eliminar
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                ) : (
                  <Alert variant="info" className="text-center py-4">
                    <Bell size={40} className="mb-3" />
                    <h4>No hay notificaciones</h4>
                    <p className="mb-0">
                      {activeTab === "todas"
                        ? "No tienes notificaciones en este momento."
                        : activeTab === "no-leidas"
                          ? "No tienes notificaciones sin leer."
                          : "No tienes notificaciones leídas."}
                    </p>
                  </Alert>
                )}

                {totalPages > 1 && (
                  <Pagination className="mt-4 justify-content-center">
                    <Pagination.Prev 
                      disabled={currentPage === 1} 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    />
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    />
                  </Pagination>
                )}
              </Card.Body>
            </Card>
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
  )
}