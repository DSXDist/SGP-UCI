import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Alert,
  Nav,
  Badge
} from "react-bootstrap";
import {
  BookOpen,
  BookMarked,
  Search,
  Bell,
  User,
  LogOut,
  MessageCircle,
  BellDot
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const [tipo, setTipo] = useState("queja");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [loadingNotificaciones, setLoadingNotificaciones] = useState(true);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      setError("Por favor, escribe tu queja o sugerencia.");
      return;
    }
    setError("");
    setEnviado(true);
    setMensaje("");
    setTipo("queja");
    // Aquí podrías enviar los datos a un backend si lo deseas
  };

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
              <Form className="d-none d-md-flex" onSubmit={e => e.preventDefault()}>
                <div className="input-group">
                  <Button
                    variant="outline-secondary"
                    className="input-group-text border-end-0"
                    style={{ border: "none", background: "none", padding: 0 }}
                    type="button"
                    title="Buscar"
                  >
                    <Search size={18} />
                  </Button>
                  <Form.Control
                    type="search"
                    placeholder="Buscar libros..."
                    className="border-start-0"
                    disabled
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
          <Container style={{ maxWidth: 600 }}>
            <h1 className="mb-4">Quejas y Sugerencias</h1>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      value={tipo}
                      onChange={e => setTipo(e.target.value)}
                    >
                      <option value="queja">Queja</option>
                      <option value="sugerencia">Sugerencia</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={mensaje}
                      onChange={e => setMensaje(e.target.value)}
                      placeholder="Escribe aquí tu queja o sugerencia..."
                    />
                  </Form.Group>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {enviado && (
                    <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
                      ¡Tu {tipo} ha sido enviada correctamente!
                    </Alert>
                  )}
                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="primary">
                      Enviar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </main>
      </div>
    </div>
  );
}