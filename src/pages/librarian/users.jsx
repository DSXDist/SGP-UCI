import React, { useState, useEffect } from "react";
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
  const [showUserModal, setShowUserModal] = useState(false);

  // Nuevo estado para usuarios traídos del backend
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sgp-uci-token');
    setLoadingUsuarios(true);
    fetch('http://localhost:8000/library/api/users/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        // Filtrar usuarios que no son bibliotecarios
        const usuariosFiltrados = data.filter(u => !u.is_bibliotecario);
        setUsuarios(usuariosFiltrados);
        setLoadingUsuarios(false);
      })
      .catch(() => {
        setUsuarios([]);
        setLoadingUsuarios(false);
      });
  }, []);

  // Adaptar los datos del backend al formato esperado por la UI
  const usuariosAdaptados = usuarios.map(u => ({
    id: u.id,
    nombre: u.username,
    email: u.email,
    correoCorto: u.username,
    tipo: u.user_type === "STUDENT" ? "Estudiante" : u.user_type === "PROFESSOR" ? "Profesor" : u.user_type,
    añoAcademico: u.academic_year || "N/A",
    facultad: u.faculty || "N/A",
    carrera: u.career || "N/A",
    telefono: u.phone || "",
    fechaRegistro: u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "",
    prestamosActivos: Array.isArray(u.loans) ? u.loans.filter(l => l.status === "Activo").length : 0,
    prestamosTotales: Array.isArray(u.loans) ? u.loans.length : 0,
    estado: u.is_active === false ? "Inactivo" : "Activo",
    prestamos: u.loans || [],
    prestamosPendientes: [], // Puedes mapear si tu backend lo soporta
  }));

  const [filteredUsers, setFilteredUsers] = useState(usuariosAdaptados);

  useEffect(() => {
    setFilteredUsers(
      usuariosAdaptados.filter((usuario) => {
        const tipoMatch = filterType === "todos" || usuario.tipo.toLowerCase() === filterType;
        const estadoMatch = filterStatus === "todos" || usuario.estado.toLowerCase() === filterStatus;
        const searchMatch =
          usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.correoCorto.toLowerCase().includes(searchTerm.toLowerCase());
        return tipoMatch && estadoMatch && searchMatch;
      })
    );
  }, [searchTerm, filterType, filterStatus, usuariosAdaptados]);

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
    // Aquí iría la lógica para eliminar el usuario
    setSelectedUser(filteredUsers.find(u => u.id === userId));
    setShowDeleteAlert(true);
  };
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('sgp-uci-token');
    try {
      const res = await fetch(`http://localhost:8000/library/api/users/${selectedUser.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setUsuarios((prev) => prev.filter((u) => u.id !== selectedUser.id));
      }
      setShowDeleteAlert(false);
      setSelectedUser(null);
    } catch (err) {
      setShowDeleteAlert(false);
      setSelectedUser(null);
    }
  };

  const handleUpdateUser = (data) => {
    setShowEditModal(false);
    // Aquí iría la lógica para actualizar el usuario
  };
  const handleBackToList = () => {
    setSelectedUser(null);
  };

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

  // Estado para el formulario de añadir usuario
  const [addUserForm, setAddUserForm] = useState({
    nombre: "",
    email: "",
    tipo: "Estudiante",
    facultad: "",
    carrera: "",
    añoAcademico: "",
    estado: "Activo",
    contraseña: "",
  });
  const [addUserError, setAddUserError] = useState("");
  const [addUserSuccess, setAddUserSuccess] = useState("");

  // Manejar cambios en el formulario de añadir usuario
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Añadir usuario
  const handleAddUser = async () => {
    setAddUserError("");
    setAddUserSuccess("");
    const token = localStorage.getItem('sgp-uci-token');
    try {
      const res = await fetch('http://localhost:8000/library/api/users/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: addUserForm.nombre,
          email: addUserForm.email,
          user_type: addUserForm.tipo.toUpperCase(),
          faculty: addUserForm.facultad,
          career: addUserForm.carrera,
          academic_year: addUserForm.añoAcademico,
          is_active: addUserForm.estado === "Activo",
          is_bibliotecario: false,
          password: addUserForm.contraseña
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setAddUserError(
          errorData.detail ||
          Object.values(errorData).flat().join(" ") ||
          "Error al añadir el usuario"
        );
        return;
      }
      const newUser = await res.json();
      setAddUserSuccess("Usuario añadido satisfactoriamente");
      setUsuarios((prev) => [...prev, newUser]);
      setShowAddModal(false);
      setAddUserForm({
        nombre: "",
        email: "",
        tipo: "Estudiante",
        facultad: "",
        carrera: "",
        añoAcademico: "",
        estado: "Activo",
        contraseña: "",
      });
    } catch (err) {
      setAddUserError("Error de red al añadir el usuario");
    }
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
                            {loadingUsuarios ? (
                              <tr>
                                <td colSpan={8} className="text-center">Cargando usuarios...</td>
                              </tr>
                            ) : filteredUsers.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="text-center">No hay usuarios encontrados.</td>
                              </tr>
                            ) : (
                              filteredUsers.map((usuario) => (
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
                              ))
                            )}
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
                <h3>{selectedUser.username}</h3>
              </div>

              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Información Personal</h5>
                  <div className="list-group">
                    <div className="list-group-item border-0">
                      <Mail className="me-2" /> {selectedUser.email}
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
                    <div className="list-group-item border-0">
                      <BookMarked className="me-2" /> {selectedUser.carrera}
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
                <Form.Control
                  name="nombre"
                  value={addUserForm.nombre}
                  onChange={handleAddUserChange}
                  placeholder="Nombre y apellidos"
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={addUserForm.email}
                  onChange={handleAddUserChange}
                  placeholder="correo@estudiantes.uci.cu"
                  required
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  name="tipo"
                  value={addUserForm.tipo}
                  onChange={handleAddUserChange}
                >
                  <option>Estudiante</option>
                  <option>Profesor</option>
                  <option>Personal</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña"
                  value={addUserForm.contraseña}
                  onChange={handleAddUserChange}
                  placeholder="Contraseña"
                  required
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Facultad</Form.Label>
                <Form.Control
                  name="facultad"
                  value={addUserForm.facultad}
                  onChange={handleAddUserChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Carrera</Form.Label>
                <Form.Control
                  name="carrera"
                  value={addUserForm.carrera}
                  onChange={handleAddUserChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Año Académico</Form.Label>
                <Form.Control
                  name="añoAcademico"
                  value={addUserForm.añoAcademico}
                  onChange={handleAddUserChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={addUserForm.estado}
                  onChange={handleAddUserChange}
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </Form.Select>
              </Col>
            </Row>
            {addUserError && (
              <div className="alert alert-danger py-2">{addUserError}</div>
            )}
            {addUserSuccess && (
              <div className="alert alert-success py-2">{addUserSuccess}</div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
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
                    defaultValue={selectedUser.username}
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
                  <Form.Select defaultValue={selectedUser.user_type}>
                    <option>Estudiante</option>
                    <option>Profesor</option>
                    <option>Personal</option>
                  </Form.Select>
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