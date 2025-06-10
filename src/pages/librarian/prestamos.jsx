import React, { useState, useEffect } from 'react';
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

  // Estado para préstamos
  const [prestamos, setPrestamos] = useState([]);
  const [loadingPrestamos, setLoadingPrestamos] = useState(true);

  // Estado para cache de usuarios
  const [usuariosCache, setUsuariosCache] = useState({});

  // Obtener préstamos desde el backend y actualizar status si es necesario
  useEffect(() => {
    const token = localStorage.getItem('sgp-uci-token');
    setLoadingPrestamos(true);
    fetch('http://localhost:8000/library/api/loans/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(async data => {
        const prestamosArray = Array.isArray(data) ? data : [];
        // Verificar fechas y actualizar status si es necesario
        const now = new Date();
        for (const p of prestamosArray) {
          if (
            p.status === "ONDATE" &&
            p.loan_date &&
            p.return_date &&
            new Date(now) > new Date(p.return_date)
          ) {
            try {
              await fetch(`http://localhost:8000/library/api/loans/${p.id}/`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  ...p,
                  status: "OFFDATE"
                })
              });
              // Opcional: actualizar localmente el status para reflejar el cambio inmediato
              p.status = "OFFDATE";
            } catch (e) {
              // Manejo de error opcional
            }
          }
        }
        setPrestamos(prestamosArray);
        setLoadingPrestamos(false);
      })
      .catch(() => {
        setPrestamos([]);
        setLoadingPrestamos(false);
      });
  }, []);

  // Filtrar préstamos por estado
  const prestamosActivos = prestamos.filter(p => p.status === "ONDATE");
  const prestamosSolicitudes = prestamos.filter(p => p.status === "AWAITING");
  const prestamosVencidos = prestamos.filter(p => p.status === "OFFDATE");

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

  const handleNotificarTodos = () => {
    handleAction("Se ha enviado recordatorios a todos los usuarios");
  };

  useEffect(() => {
    function handleAprobado(e) {
      setPrestamos(prev =>
        prev.map(p =>
          p.id === e.detail.id
            ? { ...p, status: "ONDATE", return_date: e.detail.return_date }
            : p
        )
      );
    }
    function handleRechazado(e) {
      setPrestamos(prev => prev.filter(p => p.id !== e.detail.id));
    }
    window.addEventListener("prestamo-aprobado", handleAprobado);
    window.addEventListener("prestamo-rechazado", handleRechazado);
    return () => {
      window.removeEventListener("prestamo-aprobado", handleAprobado);
      window.removeEventListener("prestamo-rechazado", handleRechazado);
    };
  }, []);

  // Función para obtener usuario por ID y guardar en cache
  const fetchUsuario = async (userId) => {
    if (!userId) return {};
    if (usuariosCache[userId]) return usuariosCache[userId];
    const token = localStorage.getItem('sgp-uci-token');
    try {
      const res = await fetch(`http://localhost:8000/library/api/users/${userId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setUsuariosCache(prev => ({ ...prev, [userId]: data }));
      return data;
    } catch {
      return {};
    }
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
                {/* <Nav.Item>
                  <Nav.Link eventKey="historial">Historial</Nav.Link>
                </Nav.Item> */}
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
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Libro</th>
                              <th>Fecha Préstamo</th>
                              <th>Fecha Devolución</th>
                              <th>Estado</th>
                              <th className="text-end">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loadingPrestamos ? (
                              <tr>
                                <td colSpan={6} className="text-center">Cargando...</td>
                              </tr>
                            ) : prestamosActivos.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center">No hay préstamos activos.</td>
                              </tr>
                            ) : (
                              prestamosActivos.map(p => (
                                <PrestamoRow
                                  key={p.id}
                                  prestamo={p}
                                  tipo="activo"
                                  usuariosCache={usuariosCache}
                                  fetchUsuario={fetchUsuario}
                                  setDetailsData={setDetailsData}
                                  setShowDetails={setShowDetails}
                                  handleAction={handleAction}
                                />
                              ))
                            )}
                          </tbody>
                        </Table>
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
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Libro</th>
                            <th>Fecha Préstamo</th>
                            <th>Fecha Devolución</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingPrestamos ? (
                            <tr>
                              <td colSpan={6} className="text-center">Cargando...</td>
                            </tr>
                          ) : prestamosSolicitudes.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center">No hay solicitudes pendientes.</td>
                            </tr>
                          ) : (
                            prestamosSolicitudes.map(p => (
                              <PrestamoRow
                                key={p.id}
                                prestamo={p}
                                tipo="solicitud"
                                usuariosCache={usuariosCache}
                                fetchUsuario={fetchUsuario}
                                setDetailsData={setDetailsData}
                                setShowDetails={setShowDetails}
                                handleAction={handleAction}
                              />
                            ))
                          )}
                        </tbody>
                      </Table>
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
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Libro</th>
                            <th>Fecha Préstamo</th>
                            <th>Fecha Devolución</th>
                            <th>Días de Retraso</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingPrestamos ? (
                            <tr>
                              <td colSpan={7} className="text-center">Cargando...</td>
                            </tr>
                          ) : prestamosVencidos.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center">No hay préstamos vencidos.</td>
                            </tr>
                          ) : (
                            prestamosVencidos.map(p => (
                              <PrestamoRow
                                key={p.id}
                                prestamo={p}
                                tipo="vencido"
                                usuariosCache={usuariosCache}
                                fetchUsuario={fetchUsuario}
                                setDetailsData={setDetailsData}
                                setShowDetails={setShowDetails}
                                handleAction={handleAction}
                              />
                            ))
                          )}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Historial eliminado */}
              </Tab.Content>
            </Tab.Container>
          </Container>
        </main>
      </div>
    </div>
  );
}

function PrestamoRow({ prestamo, tipo, usuariosCache, fetchUsuario, setDetailsData, setShowDetails, handleAction }) {
  const [_, setRerender] = useState(0);
  useEffect(() => {
    if (prestamo.user && !usuariosCache[prestamo.user]) {
      fetchUsuario(prestamo.user).then(() => setRerender(r => r + 1));
    }
    // eslint-disable-next-line
  }, [prestamo.user, usuariosCache]);
  const usuario = usuariosCache[prestamo.user] || {};

  // Calcular días de retraso
  let diasRetraso = "-";
  if (tipo === "vencido" && prestamo.return_date) {
    const fechaDevolucion = new Date(prestamo.return_date);
    const hoy = new Date();
    const diffMs = hoy - fechaDevolucion;
    if (diffMs > 0) {
      diasRetraso = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    } else {
      diasRetraso = 0;
    }
  }

  // Acción para aprobar solicitud
  const handleAprobar = async () => {
    const token = localStorage.getItem('sgp-uci-token');
    // Calcular nueva fecha de devolución (7 días después de loan_date)
    const fechaPrestamo = prestamo.loan_date ? new Date(prestamo.loan_date) : new Date();
    const fechaDevolucion = new Date(fechaPrestamo);
    fechaDevolucion.setDate(fechaPrestamo.getDate() + 7);
    const return_date = fechaDevolucion.toISOString().split('T')[0];

    try {
      // 1. Actualizar el préstamo (status y return_date)
      await fetch(`http://localhost:8000/library/api/loans/${prestamo.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...prestamo,
          status: "ONDATE",
          return_date
        })
      });

      // 2. Restar 1 a available_copies del libro
      if (prestamo.book) {
        // Obtener datos actuales del libro
        const resBook = await fetch(`http://localhost:8000/library/api/books/${prestamo.book}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const bookData = await resBook.json();
        const newAvailable = Math.max(0, (bookData.available_copies || 0) - 1);
        await fetch(`http://localhost:8000/library/api/books/${prestamo.book}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...bookData,
            available_copies: newAvailable
          })
        });
      }

      // Actualizar en la UI: mover el préstamo a activos
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("prestamo-aprobado", { detail: { id: prestamo.id, status: "ONDATE", return_date } }));
      }
      handleAction("La solicitud fue aprobada");
    } catch {
      handleAction("Error al aprobar la solicitud");
    }
  };

  // Acción para rechazar solicitud
  const handleRechazar = async () => {
    const token = localStorage.getItem('sgp-uci-token');
    try {
      await fetch(`http://localhost:8000/library/api/loans/${prestamo.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Actualizar en la UI: quitar el préstamo de la lista
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("prestamo-rechazado", { detail: { id: prestamo.id } }));
      }
      handleAction("La solicitud fue rechazada");
    } catch {
      handleAction("Error al rechazar la solicitud");
    }
  };

  // Acción para marcar como devuelto (eliminar préstamo y sumar available_copies)
  const handleMarcarDevuelto = async () => {
    const token = localStorage.getItem('sgp-uci-token');
    try {
      // 1. Sumar 1 a available_copies del libro
      if (prestamo.book) {
        // Obtener datos actuales del libro
        const resBook = await fetch(`http://localhost:8000/library/api/books/${prestamo.book}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const bookData = await resBook.json();
        const newAvailable = (bookData.available_copies || 0) + 1;
        await fetch(`http://localhost:8000/library/api/books/${prestamo.book}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...bookData,
            available_copies: newAvailable
          })
        });
      }

      // 2. Eliminar el préstamo
      await fetch(`http://localhost:8000/library/api/loans/${prestamo.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Actualizar en la UI: quitar el préstamo de la lista
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("prestamo-rechazado", { detail: { id: prestamo.id } }));
      }
      handleAction("El préstamo fue marcado como devuelto");
    } catch {
      handleAction("Error al marcar como devuelto");
    }
  };

  return (
    <tr>
      <td>{prestamo.id}</td>
      <td>{prestamo.book_title || "-"}</td>
      <td>{prestamo.loan_date || "-"}</td>
      <td>{prestamo.return_date || "-"}</td>
      {tipo === "solicitud" && (
        <td>
          <Badge bg="warning">Pendiente</Badge>
        </td>
      )}
      {tipo === "activo" && (
        <td>
          <Badge bg="success">Activo</Badge>
        </td>
      )}
      {tipo === "vencido" && (
        <>
          <td>{diasRetraso}</td>
          <td>
            <Badge bg="danger">Vencido</Badge>
          </td>
        </>
      )}
      <td className="text-end">
        <Dropdown>
          <Dropdown.Toggle variant="link" size="sm">
            Acciones
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={async () => {
              let user = usuariosCache[prestamo.user] || {};
              if (!user.username) {
                user = await fetchUsuario(prestamo.user);
              }
              setDetailsData({
                id: prestamo.id,
                usuario: user?.username || "-",
                correo: user?.email || "-",
                año: user?.academic_year || "-",
                libro: prestamo.book_title || "-",
                fechaPrestamo: prestamo.loan_date || "-",
                fechaDevolucion: prestamo.return_date || "-",
                estado: prestamo.status
              });
              setShowDetails(true);
            }}>
              <Eye className="me-2" />
              Ver detalles
            </Dropdown.Item>
            {tipo === "activo" && (
              <>
                <Dropdown.Item onClick={() => handleAction("El plazo fue extendido correctamente")}>
                  <Clock className="me-2" />
                  Extender plazo
                </Dropdown.Item>
                <Dropdown.Item onClick={handleMarcarDevuelto}>
                  <XCircle className="me-2" />
                  Marcar como devuelto
                </Dropdown.Item>
              </>
            )}
            {tipo === "solicitud" && (
              <>
                <Dropdown.Item onClick={handleAprobar}>
                  <CheckCircle className="me-2" />
                  Aprobar
                </Dropdown.Item>
                <Dropdown.Item onClick={handleRechazar}>
                  <XCircle className="me-2" />
                  Rechazar
                </Dropdown.Item>
              </>
            )}
            {tipo === "vencido" && (
              <>
                <Dropdown.Item onClick={() => handleAction("Se envió un recordatorio al usuario")}>
                  <Bell className="me-2" />
                  Enviar recordatorio
                </Dropdown.Item>
                <Dropdown.Item onClick={handleMarcarDevuelto}>
                  <XCircle className="me-2" />
                  Marcar como devuelto
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
}