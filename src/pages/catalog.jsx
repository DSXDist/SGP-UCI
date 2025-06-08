import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Card,
    Form,
    InputGroup,
    Button,
    Accordion,
    ListGroup,
    Badge,
    Navbar,
    Container,
    Nav,
    Offcanvas,
    Row,
    Col,
    Modal
} from "react-bootstrap";
import {
    BookOpen,
    Search,
    Filter,
    BookMarked,
    Users,
    Calendar as CalendarIcon,
    Star,
    Tag,
    ArrowLeft,
    Bell,
    BookPlus,
    User,
    LogOut,
    MessageCircle
} from "lucide-react";

const CatalogoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [yearRange, setYearRange] = useState([2000, 2025]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("titulo");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState("Estudiante");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Obtener username de localStorage
  useEffect(() => {
      if (typeof window !== "undefined" && window.localStorage) {
          try {
              setUsername(localStorage.getItem('sgp-uci-username') || 'Estudiante');
          } catch (e) {
              setUsername('Estudiante');
          }
      }
  }, []);

  // Al montar, verifica si hay query en la URL y actualiza el input de búsqueda
  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const query = params.get("query") || "";
      setSearchTerm(query);
  }, [location.search]);

  // Obtener libros desde el backend
  useEffect(() => {
    const token = localStorage.getItem('sgp-uci-token');
    fetch('http://localhost:8000/library/api/books/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(() => setBooks([]));
  }, []);

  // Extrae categorías únicas de los libros
  useEffect(() => {
    const allCats = books
      .flatMap((b) =>
        Array.isArray(b.categories)
          ? b.categories
          : (typeof b.categories === "string" ? b.categories.split(",") : [])
      )
      .map((c) => c.trim())
      .filter((c) => c);

    // Elimina categorías repetidas ignorando mayúsculas/minúsculas y espacios
    const uniqueCats = [];
    const seen = new Set();
    for (const cat of allCats) {
      const normalized = cat.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        uniqueCats.push(cat);
      }
    }
    setCategorias(uniqueCats);
  }, [books]);

  // Lógica de filtrado y ordenamiento usando los datos del backend
  const filteredBooks = books.filter((libro) => {
    const matchesSearch =
      libro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) =>
        (libro.categories || "").toLowerCase().includes(cat.toLowerCase())
      );
    const matchesAvailable = !onlyAvailable || libro.available_copies > 0;
    return matchesSearch && matchesCategory && matchesAvailable;
  });

  useEffect(() => {
      const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);
      return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleCategoryChange = (category) => {
      setSelectedCategories((prev) =>
          prev.includes(category)
              ? prev.filter((c) => c !== category)
              : [...prev, category]
      );
  };

  const handleAvailableChange = (e) => {
      setOnlyAvailable(e.target.checked);
  };

  const handleLogout = () => {
      if (typeof window !== "undefined" && window.localStorage) {
          localStorage.removeItem('sgp-uci-username');
      }
      navigate('/');
  };

  const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
          navigate(`/catalog?query=${encodeURIComponent(searchTerm)}`);
      }
  };

  const FiltersContent = () => (
      <>
          <h5 className="mb-3">Filtros</h5>
          <InputGroup className="mb-3">
              <InputGroup.Text>
                  <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                  placeholder="Buscar libros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </InputGroup>

          <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <Tag size={16} className="me-2" />
                    Categorías
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {categorias.length === 0 ? (
                      <div className="text-muted px-2">No hay categorías</div>
                    ) : (
                      categorias.map((categoria) => (
                        <ListGroup.Item key={categoria}>
                          <Form.Check
                            type="checkbox"
                            label={categoria}
                            checked={selectedCategories.includes(categoria)}
                            onChange={() => handleCategoryChange(categoria)}
                          />
                        </ListGroup.Item>
                      ))
                    )}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>

              {/* Filtro de disponibilidad */}
              <Accordion.Item eventKey="1">
                  <Accordion.Header>
                      <div className="d-flex align-items-center">
                          <BookMarked size={16} className="me-2" />
                          Disponibilidad
                      </div>
                  </Accordion.Header>
                  <Accordion.Body>
                      <Form.Check
                          type="checkbox"
                          label="Solo libros disponibles"
                          checked={onlyAvailable}
                          onChange={handleAvailableChange}
                      />
                  </Accordion.Body>
              </Accordion.Item>
          </Accordion>
      </>
  );

  const BookDetailsModal = () => (
  <Modal
    show={!!selectedBook}
    onHide={() => setSelectedBook(null)}
    size="lg"
    fullscreen={isMobile ? true : undefined}
  >
    <Modal.Header closeButton>
      <Button variant="light" onClick={() => setSelectedBook(null)}>
        <ArrowLeft size={16} className="me-1" />
        Volver
      </Button>
    </Modal.Header>
    <Modal.Body>
      {selectedBook && (
        <div className="d-flex flex-column h-100">
          <div className="text-center mb-4">
            <img
              src={selectedBook.image_url}
              alt={selectedBook.title}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: '300px' }}
            />
            <h2>{selectedBook.title}</h2>
            <p className="text-muted">{selectedBook.author}</p>
            <div className="d-flex justify-content-center gap-3 mb-3">
              <div className="d-flex align-items-center">
                <Star size={16} className="text-warning me-1" />
                <span>{selectedBook.calificacion}</span>
              </div>
              <div className="d-flex align-items-center">
                <Badge bg={selectedBook.available_copies > 0 ? 'success' : 'secondary'}>
                  {selectedBook.available_copies > 0 ? 'Disponible' : 'No disponible'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h5>Descripción</h5>
            <p>{selectedBook.description}</p>
          </div>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Detalles</h5>
              <dl className="row">
                <dt className="col-sm-4">Editorial</dt>
                <dd className="col-sm-8">{selectedBook.editorial}</dd>
                <dt className="col-sm-4">Año</dt>
                <dd className="col-sm-8">{selectedBook.published_date}</dd>
                <dt className="col-sm-4">Categorías</dt>
                <dd className="col-sm-8">
                  {(Array.isArray(selectedBook.categories)
                    ? selectedBook.categories.join(", ")
                    : selectedBook.categories) || "Sin categoría"}
                </dd>
              </dl>
            </Col>
          </Row>
          <div className="mt-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-100"
              onClick={() => setShowLoanModal(true)}
              disabled={selectedBook.available_copies <= 0}
            >
              {selectedBook.available_copies > 0 ? 'Solicitar Préstamo' : 'No disponible'}
            </Button>
          </div>
        </div>
      )}
    </Modal.Body>
  </Modal>
);

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
                                          if (searchTerm.trim()) {
                                              navigate(`/catalog?query=${encodeURIComponent(searchTerm)}`);
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

              {/* Contenido principal */}
              <main className="flex-grow-1 p-4">
                  <Container fluid>
                      <div className="mb-4">
                          <h1 className="h2 fw-bold">Catálogo de Libros</h1>
                          <p className="text-muted">
                              {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
                          </p>
                          {/* Botón de filtros solo en mobile (debajo del título y subtítulo) */}
                          <div className="mb-3 d-lg-none">
                              <Button variant="outline-primary" onClick={() => setShowFilters(true)}>
                                  <Filter size={18} className="me-2" />
                                  Filtros
                              </Button>
                          </div>
                      </div>
                      <Row>
                          {/* Filtros Desktop */}
                          <Col lg={3} className="d-none d-lg-block border-end vh-100">
                              <div className="p-3">
                                  <FiltersContent />
                              </div>
                          </Col>
                          {/* Libros */}
                          <Col lg={9}>
                              <div className="p-3">
                                  <Row xs={1} md={2} lg={3} className="g-4">
                                    {filteredBooks.map((libro) => (
                                      <Col key={libro.id}>
                                        <Card
                                            className="h-100"
                                            style={{
                                                minHeight: "130px",
                                                minWidth: "230px",
                                                maxWidth: "350px",
                                                margin: "0 auto"
                                            }}
                                            onClick={() => setSelectedBook(libro)}
                                        >
                                            <Card.Body>
                                                <div className="d-flex">
                                                    <img
                                                        src={libro.image_url}
                                                        alt={libro.title}
                                                        className="me-3 rounded"
                                                        style={{ width: '48px', height: '72px', objectFit: 'cover' }}
                                                    />
                                                    <div className="d-flex flex-column">
                                                        <Card.Title className="h6">{libro.title}</Card.Title>
                                                        <Card.Subtitle className="text-muted small mb-2">
                                                          {libro.author}
                                                        </Card.Subtitle>
                                                        <div className="d-flex align-items-center mb-2">
                                                          <small className="text-muted">{libro.published_date}</small>
                                                        </div>
                                                        <Badge
                                                          bg={libro.available_copies > 0 ? 'success' : 'secondary'}
                                                          className="mt-auto align-self-start"
                                                        >
                                                          {libro.available_copies > 0 ? 'Disponible' : 'No disponible'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                            </Card>
                                      </Col>
                                    ))}
                                  </Row>
                              </div>
                          </Col>
                      </Row>
                  </Container>
              </main>
          </div>

          {/* Filtros Mobile (Offcanvas) */}
          <Offcanvas
              show={showFilters}
              onHide={() => setShowFilters(false)}
              placement="start"
          >
              <Offcanvas.Header closeButton>
                  <Offcanvas.Title className="d-flex align-items-center">
                      <Filter size={20} className="me-2" />
                      Filtros
                  </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                  <FiltersContent />
              </Offcanvas.Body>
          </Offcanvas>

          <BookDetailsModal />

          {/* Popup de confirmación de solicitud de préstamo */}
          <Modal
              show={showLoanModal}
              onHide={() => setShowLoanModal(false)}
              centered
          >
              <Modal.Header closeButton>
                  <Modal.Title>Solicitud enviada</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <p>Tu solicitud de préstamo está en espera de aprobación.</p>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="primary" onClick={() => setShowLoanModal(false)}>
                      Aceptar
                  </Button>
              </Modal.Footer>
          </Modal>
      </div>
  );
};

export default CatalogoPage;