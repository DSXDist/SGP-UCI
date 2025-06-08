import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BookOpen, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, complete todos los campos');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/library/api-token-auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('sgp-uci-username', username);
        localStorage.setItem('sgp-uci-token', data.token);
        localStorage.setItem('sgp-uci-id', data.user_id);
        localStorage.setItem('sgp-uci-is_bibliotecario', data.is_bibliotecario); // Guarda is_bibliotecario

        // Verifica is_bibliotecario y redirige
        if (data.is_bibliotecario) {
          navigate('/homelibrarian');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.non_field_errors ? data.non_field_errors[0] : 'Error al iniciar sesión. Verifique sus credenciales.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex flex-column justify-content-center">
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center gap-2 mb-3">
          <BookOpen className="text-primary" size={40} />
          <h1 className="h2 mb-0">SGP-UCI</h1>
        </div>
        <p className="lead text-muted">
          Sistema de Gestión de Préstamos de la Biblioteca Universitaria
        </p>
      </div>

      <Card className="mx-auto shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="h4 text-center mb-4">Iniciar Sesión</Card.Title>
          <Card.Text className="text-center text-muted mb-4">
            Ingrese sus credenciales para acceder al sistema
          </Card.Text>

          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <div className="position-relative">
                <User className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
                <Form.Control 
                  type="text" 
                  placeholder="Ingrese su nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Contraseña</Form.Label>
              </div>
              <div className="position-relative">
                <Lock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={20} />
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-center text-muted small">
          <div className="mb-2">
            Si tiene problemas para acceder, contacte al administrador del sistema
          </div>
          <div>
            © {new Date().getFullYear()} Universidad de las Ciencias Informáticas (UCI)
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default LoginPage;