import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  BookMarked,
  ArrowLeft,
  User,
  School,
  GraduationCap,
  Clock,
  Users,
  FileText,
  BarChart3,
  Bell,
  LogOut
} from "lucide-react";
import { 
  Navbar, 
  Nav,
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Dropdown,
  Badge,
  Modal,
  Tabs,
  Tab,
  Alert,
  InputGroup
} from 'react-bootstrap';

// Datos de ejemplo (mantener igual)
const usuariosEjemplo = [{
    id: "U-1001",
    nombre: "María González",
    email: "maria.gonzalez@estudiantes.uci.cu",
    correoCorto: "gonzalezm",
    tipo: "Estudiante",
    añoAcademico: "3er año",
    facultad: "Facultad 1",
    carrera: "Ingeniería Informática",
    telefono: "+53 55123456",
    fechaRegistro: "15/01/2023",
    prestamosActivos: 2,
    prestamosTotales: 15,
    estado: "Activo",
    prestamos: [
      {
        id: "P-1001",
        libro: "Fundamentos de Bases de Datos",
        fechaPrestamo: "01/05/2025",
        fechaDevolucion: "15/05/2025",
        estado: "Activo",
      },
      {
        id: "P-1005",
        libro: "Programación en Java",
        fechaPrestamo: "28/04/2025",
        fechaDevolucion: "12/05/2025",
        estado: "Activo",
      },
    ],
    prestamosPendientes: [
      {
        id: "P-2001",
        libro: "Inteligencia Artificial: Un Enfoque Moderno",
        fechaSolicitud: "10/05/2025",
        estado: "Pendiente",
      },
    ],
  },
  {
    id: "U-1002",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@estudiantes.uci.cu",
    correoCorto: "rodriguezc",
    tipo: "Estudiante",
    añoAcademico: "2do año",
    facultad: "Facultad 3",
    carrera: "Ingeniería en Ciencias Informáticas",
    telefono: "+53 54789012",
    fechaRegistro: "20/02/2023",
    prestamosActivos: 1,
    prestamosTotales: 8,
    estado: "Activo",
    prestamos: [
      {
        id: "P-1002",
        libro: "Ingeniería de Software",
        fechaPrestamo: "28/04/2025",
        fechaDevolucion: "12/05/2025",
        estado: "Activo",
      },
    ],
    prestamosPendientes: [],
  },
  {
    id: "U-1003",
    nombre: "Pedro Sánchez",
    email: "pedro.sanchez@profesores.uci.cu",
    correoCorto: "sanchezp",
    tipo: "Profesor",
    añoAcademico: "N/A",
    facultad: "Facultad 2",
    carrera: "N/A",
    telefono: "+53 52345678",
    fechaRegistro: "05/09/2022",
    prestamosActivos: 3,
    prestamosTotales: 27,
    estado: "Activo",
    prestamos: [
      {
        id: "P-1003",
        libro: "Algoritmos y Estructuras de Datos",
        fechaPrestamo: "25/04/2025",
        fechaDevolucion: "09/05/2025",
        estado: "Activo",
      },
      {
        id: "P-1006",
        libro: "Redes de Computadoras",
        fechaPrestamo: "30/04/2025",
        fechaDevolucion: "14/05/2025",
        estado: "Activo",
      },
      {
        id: "P-1007",
        libro: "Sistemas Operativos",
        fechaPrestamo: "02/05/2025",
        fechaDevolucion: "16/05/2025",
        estado: "Activo",
      },
    ],
    prestamosPendientes: [
      {
        id: "P-2002",
        libro: "Compiladores: Principios, Técnicas y Herramientas",
        fechaSolicitud: "09/05/2025",
        estado: "Pendiente",
      },
    ],
  },
  {
    id: "U-1004",
    nombre: "Ana Martínez",
    email: "ana.martinez@estudiantes.uci.cu",
    correoCorto: "martineza",
    tipo: "Estudiante",
    añoAcademico: "4to año",
    facultad: "Facultad 4",
    carrera: "Ingeniería en Ciencias Informáticas",
    telefono: "+53 51234567",
    fechaRegistro: "10/03/2023",
    prestamosActivos: 0,
    prestamosTotales: 12,
    estado: "Activo",
    prestamos: [],
    prestamosPendientes: [
      {
        id: "P-2003",
        libro: "Diseño de Interfaces de Usuario",
        fechaSolicitud: "08/05/2025",
        estado: "Pendiente",
      },
    ],
  },
  {
    id: "U-1005",
    nombre: "Luis Fernández",
    email: "luis.fernandez@estudiantes.uci.cu",
    correoCorto: "fernandezl",
    tipo: "Estudiante",
    añoAcademico: "1er año",
    facultad: "Facultad 5",
    carrera: "Ingeniería Informática",
    telefono: "+53 58765432",
    fechaRegistro: "25/04/2023",
    prestamosActivos: 1,
    prestamosTotales: 3,
    estado: "Activo",
    prestamos: [
      {
        id: "P-1004",
        libro: "Introducción a la Programación",
        fechaPrestamo: "05/05/2025",
        fechaDevolucion: "19/05/2025",
        estado: "Activo",
      },
    ],
    prestamosPendientes: [],
  },]; 
const prestamosPendientesEjemplo = [{
    id: "P-2001",
    usuario: "María González",
    usuarioId: "U-1001",
    correo: "gonzalezm",
    añoAcademico: "3er año",
    libro: "Inteligencia Artificial: Un Enfoque Moderno",
    fechaSolicitud: "10/05/2025",
    estado: "Pendiente",
  },
  {
    id: "P-2002",
    usuario: "Pedro Sánchez",
    usuarioId: "U-1003",
    correo: "sanchezp",
    añoAcademico: "N/A",
    libro: "Compiladores: Principios, Técnicas y Herramientas",
    fechaSolicitud: "09/05/2025",
    estado: "Pendiente",
  },
  {
    id: "P-2003",
    usuario: "Ana Martínez",
    usuarioId: "U-1004",
    correo: "martineza",
    añoAcademico: "4to año",
    libro: "Diseño de Interfaces de Usuario",
    fechaSolicitud: "08/05/2025",
    estado: "Pendiente",
  },];

export default function GestionUsuariosPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [filterType, setFilterType] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [activeTab, setActiveTab] = useState("usuarios");
  const [showUserModal, setShowUserModal] = useState(false); // Nuevo estado para el modal de detalles

  // Funciones de manejo (mantener igual)
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const handleDeleteUser = (userId) => {
    setSelectedUser(usuariosEjemplo.find(u => u.id === userId));
    setShowDeleteAlert(true);
  };
  const confirmDeleteUser = () => {
    setShowDeleteAlert(false);
    setSelectedUser(null);
    // Aquí iría la lógica para eliminar el usuario
  };
  const handleApproveLoan = (loanId) => {
    // Aquí iría la lógica para aprobar el préstamo
  };
  const handleRejectLoan = (loanId) => {
    // Aquí iría la lógica para rechazar el préstamo
  };
  const handleAddUser = (data) => {
    setShowAddModal(false);
    // Aquí iría la lógica para añadir el usuario
  };
  const handleUpdateUser = (data) => {
    setShowEditModal(false);
    // Aquí iría la lógica para actualizar el usuario
  };
  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const filteredUsers = usuariosEjemplo.filter((usuario) => {
    // Filtrar por tipo
    const tipoMatch = filterType === "todos" || usuario.tipo.toLowerCase() === filterType;
    // Filtrar por estado
    const estadoMatch = filterStatus === "todos" || usuario.estado.toLowerCase() === filterStatus;
    // Filtrar por búsqueda
    const searchMatch =
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.correoCorto.toLowerCase().includes(searchTerm.toLowerCase());

    return tipoMatch && estadoMatch && searchMatch;
  });

  // Obtener nombre de usuario desde localStorage (igual que en homeLibrarian)
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

  // Componente principal
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header estilo homeLibrarian */}
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
            <Nav.Link
              href="/homelibrarian"
              className="d-flex align-items-center gap-2"
              style={{ color: "#0d6efd" }} // azul bootstrap
            >
              <BarChart3 size={20} />
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="/homelibrarian/users"
              className="d-flex align-items-center gap-2 active"
              style={{
                color: "#212529", // negro
                fontWeight: "bold",
                background: "#e9ecef",
                borderRadius: "0.375rem"
              }}
            >
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
        <Container fluid className="flex-grow-1">
          <Row className="h-100">
            {/* Contenido principal */}
            <Col className="p-4">
              <div className="mb-4">
                <h1 className="h2 fw-bold">Gestión de Usuarios</h1>
                <p className="text-muted">Administra los usuarios del sistema y gestiona sus préstamos</p>
              </div>

              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="usuarios">Usuarios</Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <Nav.Link eventKey="prestamos">Préstamos Pendientes</Nav.Link>
                  </Nav.Item> */}
                </Nav>

                <Tab.Content>
                  {/* Pestaña Usuarios */}
                  <Tab.Pane eventKey="usuarios">
                    <Card>
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <div>
                          <Card.Title>Usuarios Registrados</Card.Title>
                          <Card.Text>{filteredUsers.length} usuarios encontrados</Card.Text>
                        </div>
                        <Button variant="primary" onClick={() => setShowAddModal(true)}>
                          <Plus className="me-2" /> Nuevo Usuario
                        </Button>
                      </Card.Header>
                      
                      <Card.Body>
                        <Row className="mb-4 g-3">
                          <Col md={6}>
                            <InputGroup>
                              <InputGroup.Text>
                                <Search />
                              </InputGroup.Text>
                              <Form.Control 
                                placeholder="Buscar..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </InputGroup>
                          </Col>
                          <Col md={3}>
                            <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                              <option value="todos">Todos los tipos</option>
                              <option value="estudiante">Estudiantes</option>
                              <option value="profesor">Profesores</option>
                            </Form.Select>
                          </Col>
                          <Col md={3}>
                            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                              <option value="todos">Todos los estados</option>
                              <option value="activo">Activos</option>
                              <option value="inactivo">Inactivos</option>
                            </Form.Select>
                          </Col>
                        </Row>

                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Nombre</th>
                              <th>Correo</th>
                              <th>Tipo</th>
                              <th>Año</th>
                              <th>Préstamos</th>
                              <th>Estado</th>
                              <th className="text-end">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((usuario) => (
                              <tr key={usuario.id} style={{cursor: 'pointer'}}>
                                <td onClick={() => handleUserSelect(usuario)}>{usuario.id}</td>
                                <td onClick={() => handleUserSelect(usuario)}>{usuario.nombre}</td>
                                <td onClick={() => handleUserSelect(usuario)}>{usuario.correoCorto}</td>
                                <td onClick={() => handleUserSelect(usuario)}>{usuario.tipo}</td>
                                <td onClick={() => handleUserSelect(usuario)}>{usuario.añoAcademico}</td>
                                <td onClick={() => handleUserSelect(usuario)}>{usuario.prestamosActivos}</td>
                                <td onClick={() => handleUserSelect(usuario)}>
                                  <Badge bg={usuario.estado === "Activo" ? "success" : "danger"}>
                                    {usuario.estado}
                                  </Badge>
                                </td>
                                <td className="text-end">
                                  <Dropdown>
                                    <Dropdown.Toggle variant="link">
                                      Acciones
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item onClick={() => handleUserSelect(usuario)}>
                                        <Eye className="me-2" /> Ver detalles
                                      </Dropdown.Item>
                                      <Dropdown.Item onClick={() => handleEditUser(usuario)}>
                                        <Edit className="me-2" /> Editar
                                      </Dropdown.Item>
                                      <Dropdown.Divider />
                                      <Dropdown.Item onClick={() => handleDeleteUser(usuario.id)} className="text-danger">
                                        <Trash2 className="me-2" /> Eliminar
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  {/* Elimina la pestaña de préstamos pendientes */}
                  {/* 
                  <Tab.Pane eventKey="prestamos">
                    <Card>
                      <Card.Header>
                        <Card.Title>Préstamos Pendientes</Card.Title>
                        <Card.Text>{prestamosPendientesEjemplo.length} préstamos pendientes</Card.Text>
                      </Card.Header>
                      <Card.Body>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Usuario</th>
                              <th>Correo</th>
                              <th>Año</th>
                              <th>Libro</th>
                              <th>Fecha</th>
                              <th>Estado</th>
                              <th className="text-end">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prestamosPendientesEjemplo.map((prestamo) => (
                              <tr key={prestamo.id}>
                                <td>{prestamo.id}</td>
                                <td>{prestamo.usuario}</td>
                                <td>{prestamo.correo}</td>
                                <td>{prestamo.añoAcademico}</td>
                                <td>{prestamo.libro}</td>
                                <td>{prestamo.fechaSolicitud}</td>
                                <td>
                                  <Badge bg="warning">{prestamo.estado}</Badge>
                                </td>
                                <td className="text-end">
                                  <Button variant="success" size="sm" className="me-2" onClick={() => handleApproveLoan(prestamo.id)}>
                                    <CheckCircle className="me-1" /> Aprobar
                                  </Button>
                                  <Button variant="danger" size="sm" onClick={() => handleRejectLoan(prestamo.id)}>
                                    <XCircle className="me-1" /> Rechazar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                  */}
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal Detalles de Usuario */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <div className="text-center mb-4">
                <div className="mb-3">
                  <User className="text-primary" size={64} />
                </div>
                <h3>{selectedUser.nombre}</h3>
                <Badge bg={selectedUser.estado === "Activo" ? "success" : "danger"}>
                  {selectedUser.estado}
                </Badge>
              </div>

              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Información Personal</h5>
                  <div className="list-group">
                    <div className="list-group-item border-0">
                      <Mail className="me-2" /> {selectedUser.email}
                    </div>
                    <div className="list-group-item border-0">
                      <Phone className="me-2" /> {selectedUser.telefono}
                    </div>
                    <div className="list-group-item border-0">
                      <Calendar className="me-2" /> Registro: {selectedUser.fechaRegistro}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Información Académica</h5>
                  <div className="list-group">
                    <div className="list-group-item border-0">
                      <GraduationCap className="me-2" /> {selectedUser.tipo}
                    </div>
                    {selectedUser.tipo === "Estudiante" && (
                      <div className="list-group-item border-0">
                        <School className="me-2" /> {selectedUser.añoAcademico}
                      </div>
                    )}
                    <div className="list-group-item border-0">
                      <BookOpen className="me-2" /> {selectedUser.facultad}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal show={showDeleteAlert} onHide={() => setShowDeleteAlert(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAlert(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modales */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control placeholder="Nombre y apellidos" />
              </Col>
              <Col md={6}>
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" placeholder="correo@estudiantes.uci.cu" />
              </Col>
            </Row>
            {/* Resto del formulario... */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleAddUser({})}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Editar Usuario */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form
              onSubmit={e => {
                e.preventDefault();
                handleUpdateUser({});
              }}
            >
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    defaultValue={selectedUser.nombre}
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue={selectedUser.email}
                    required
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select defaultValue={selectedUser.tipo}>
                    <option>Estudiante</option>
                    <option>Profesor</option>
                    <option>Personal</option>
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    defaultValue={selectedUser.telefono}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Facultad</Form.Label>
                  <Form.Control
                    defaultValue={selectedUser.facultad}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Carrera</Form.Label>
                  <Form.Control
                    defaultValue={selectedUser.carrera}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Año Académico</Form.Label>
                  <Form.Control
                    defaultValue={selectedUser.añoAcademico}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select defaultValue={selectedUser.estado}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </Form.Select>
                </Col>
              </Row>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Guardar Cambios
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}