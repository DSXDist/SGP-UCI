import React from 'react';
import {
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Search,
  Bell,
  LogOut,
  Download,
  PieChart,
  BarChart,
  LineChart,
} from "lucide-react";
import { Navbar, Nav, Container, Row, Col, Card, Button, Form, Table, Dropdown, Badge, Tab, Tabs } from 'react-bootstrap';

export default function ReportesPage() {
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
              <Nav.Link href="/admin/prestamos" className="d-flex align-items-center gap-2">
                <BookOpen />
                Préstamos
              </Nav.Link>
              <Nav.Link active href="/admin/reportes" className="d-flex align-items-center gap-2">
                <FileText />
                Reportes
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col className="p-4">
            <div className="mb-4">
              <h1 className="h2 fw-bold">Reportes y Estadísticas</h1>
              <p className="text-muted">Genera reportes estadísticos y listados de préstamos</p>
            </div>

            <Tab.Container defaultActiveKey="estadisticas">
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="estadisticas">Estadísticas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reportes">Reportes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="exportar">Exportar Datos</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="estadisticas">
                  <Row className="g-4 mb-4">
                    <Col md={6} lg={3}>
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <Card.Title className="mb-0 text-muted small">Total Préstamos</Card.Title>
                            <BookOpen className="text-primary" />
                          </div>
                          <h2 className="mb-1">1,248</h2>
                          <small className="text-muted">+12% respecto al mes anterior</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={3}>
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <Card.Title className="mb-0 text-muted small">Usuarios Activos</Card.Title>
                            <Users className="text-success" />
                          </div>
                          <h2 className="mb-1">156</h2>
                          <small className="text-muted">+8% respecto al mes anterior</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={3}>
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <Card.Title className="mb-0 text-muted small">Tasa de Devolución</Card.Title>
                            <BarChart className="text-purple" />
                          </div>
                          <h2 className="mb-1">94.2%</h2>
                          <small className="text-muted">+2.1% respecto al mes anterior</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} lg={3}>
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <Card.Title className="mb-0 text-muted small">Libros Populares</Card.Title>
                            <PieChart className="text-warning" />
                          </div>
                          <h2 className="mb-1">25</h2>
                          <small className="text-muted">Representan el 40% de préstamos</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="g-4">
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Préstamos por Mes</Card.Title>
                          <Card.Text className="text-muted mb-3">Evolución de préstamos en los últimos 6 meses</Card.Text>
                          <div className="border p-4" style={{height: '320px'}}>
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                              <LineChart className="h4 w-4 me-2" />
                              Gráfico de línea de préstamos mensuales
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Distribución por Categoría</Card.Title>
                          <Card.Text className="text-muted mb-3">Préstamos por categoría de libro</Card.Text>
                          <div className="border p-4" style={{height: '320px'}}>
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                              <PieChart className="h4 w-4 me-2" />
                              Gráfico circular de distribución por categoría
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Préstamos por Año Académico</Card.Title>
                          <Card.Text className="text-muted mb-3">Distribución de préstamos por año académico</Card.Text>
                          <div className="border p-4" style={{height: '320px'}}>
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                              <BarChart className="h4 w-4 me-2" />
                              Gráfico de barras por año académico
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Tendencia de Devoluciones</Card.Title>
                          <Card.Text className="text-muted mb-3">Análisis de devoluciones a tiempo vs. tardías</Card.Text>
                          <div className="border p-4" style={{height: '320px'}}>
                            <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                              <LineChart className="h4 w-4 me-2" />
                              Gráfico de tendencia de devoluciones
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* Reportes Tab */}
                <Tab.Pane eventKey="reportes">
                  <Row className="g-4">
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Reporte de Préstamos</Card.Title>
                          <Card.Text className="text-muted mb-3">Genera un reporte detallado de préstamos</Card.Text>
                          <Form className="gap-3 d-flex flex-column">
                            <Row>
                              <Col>
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control type="date" />
                              </Col>
                              <Col>
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control type="date" />
                              </Col>
                            </Row>
                            <Form.Select>
                              <option>Todos</option>
                              <option>Activos</option>
                              <option>Devueltos</option>
                              <option>Vencidos</option>
                            </Form.Select>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Generar Reporte
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Reporte de Usuarios</Card.Title>
                          <Card.Text className="text-muted mb-3">Genera un reporte de usuarios y su actividad</Card.Text>
                          <Form className="gap-3 d-flex flex-column">
                            <Form.Select>
                              <option>Todos</option>
                              <option>Estudiantes</option>
                              <option>Profesores</option>
                              <option>Personal</option>
                            </Form.Select>
                            <Form.Select>
                              <option>Nombre</option>
                              <option>Cantidad de préstamos</option>
                              <option>Fecha de registro</option>
                            </Form.Select>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Generar Reporte
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Estadísticas de Libros</Card.Title>
                          <Card.Text className="text-muted mb-3">Genera un reporte de uso de libros</Card.Text>
                          <Form className="gap-3 d-flex flex-column">
                            <Form.Select>
                              <option>Último mes</option>
                              <option>Último trimestre</option>
                              <option>Último semestre</option>
                              <option>Último año</option>
                            </Form.Select>
                            <Form.Select>
                              <option>Libros más populares</option>
                              <option>Libros con más retrasos</option>
                              <option>Disponibilidad de libros</option>
                            </Form.Select>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Generar Reporte
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Reporte de Rendimiento</Card.Title>
                          <Card.Text className="text-muted mb-3">Analiza el rendimiento del sistema de biblioteca</Card.Text>
                          <Form className="gap-3 d-flex flex-column">
                            <Form.Select>
                              <option>Todas las métricas</option>
                              <option>Tiempos de procesamiento</option>
                              <option>Rotación de inventario</option>
                              <option>Satisfacción de usuarios</option>
                            </Form.Select>
                            <Form.Select>
                              <option>Mensual</option>
                              <option>Trimestral</option>
                              <option>Semestral</option>
                              <option>Anual</option>
                            </Form.Select>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Generar Reporte
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* Exportar Tab */}
                <Tab.Pane eventKey="exportar">
                  <Row className="g-4">
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Exportar Préstamos</Card.Title>
                          <Form className="gap-3 d-flex flex-column">
                            <div>
                              <Form.Label>Rango de Fechas</Form.Label>
                              <Row className="g-2">
                                <Col>
                                  <Form.Control type="date" />
                                </Col>
                                <Col>
                                  <Form.Control type="date" />
                                </Col>
                              </Row>
                            </div>
                            <Form.Select>
                              <option>Excel (.xlsx)</option>
                              <option>CSV</option>
                              <option>PDF</option>
                            </Form.Select>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Exportar Datos
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Exportar Usuarios</Card.Title>
                          <Form className="gap-3 d-flex flex-column">
                            <Form.Select>
                              <option>Todos</option>
                              <option>Estudiantes</option>
                              <option>Profesores</option>
                              <option>Personal</option>
                            </Form.Select>
                            <Form.Select>
                              <option>Excel (.xlsx)</option>
                              <option>CSV</option>
                              <option>PDF</option>
                            </Form.Select>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Exportar Datos
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Exportar Inventario</Card.Title>
                          <Form className="gap-3 d-flex flex-column">
                            <Form.Select>
                              <option>Todas</option>
                              <option>Informática</option>
                              <option>Matemáticas</option>
                              <option>Ingeniería</option>
                            </Form.Select>
                            <Form.Select>
                              <option>Excel (.xlsx)</option>
                              <option>CSV</option>
                              <option>PDF</option>
                            </Form.Select>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Exportar Datos
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <Card.Title>Copia de Seguridad</Card.Title>
                          <Form className="gap-3 d-flex flex-column">
                            <Form.Select>
                              <option>Base de datos completa</option>
                              <option>Solo préstamos</option>
                              <option>Solo usuarios</option>
                              <option>Solo inventario</option>
                            </Form.Select>
                            <div className="d-flex align-items-center gap-2">
                              <Form.Check type="checkbox" label="Incluir archivos adjuntos" />
                            </div>
                            <Button variant="primary">
                              <Download className="me-2" />
                              Generar Copia
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}