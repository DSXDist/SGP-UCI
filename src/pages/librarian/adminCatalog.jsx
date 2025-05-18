import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  InputGroup,
  Button,
  Accordion,
  ListGroup,
  Badge,
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
  FileText,
  BarChart3,
  Edit,
  Trash2
} from "lucide-react";

const categorias = [
  "Algoritmos",
  "Bases de Datos",
  "Ingeniería de Software",
  "Inteligencia Artificial",
  "Programación",
  "Redes",
  "Sistemas Operativos"
];

// Puedes reutilizar los datos de ejemplo de libros aquí
const librosEjemplo = [
  {
    id: 1,
    titulo: "Fundamentos de Bases de Datos",
    autor: "Abraham Silberschatz, Henry F. Korth",
    editorial: "McGraw-Hill",
    año: 2019,
    edicion: "7ma Edición",
    categoria: "Bases de Datos",
    disponible: true,
    copias: 3,
    ubicacion: "Estante A-12",
    isbn: "978-0073523323",
    descripcion:
        "Este libro proporciona una introducción completa a los sistemas de bases de datos, cubriendo los fundamentos, el diseño y la implementación. Incluye temas como el modelo relacional, SQL, diseño de bases de datos y procesamiento de transacciones.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.5,
    prestamos: 42,
    paginas: 672,
    idioma: "Español",
    temas: ["SQL", "Modelo Relacional", "Normalización", "Transacciones"],
},
{
    id: 2,
    titulo: "Ingeniería de Software",
    autor: "Ian Sommerville",
    editorial: "Pearson",
    año: 2016,
    edicion: "10ma Edición",
    categoria: "Ingeniería de Software",
    disponible: true,
    copias: 2,
    ubicacion: "Estante B-05",
    isbn: "978-0133943030",
    descripcion:
        "Este libro es una introducción completa a la ingeniería de software. Cubre todo el proceso de desarrollo de software, desde la especificación de requisitos hasta la evolución del software, con énfasis en las prácticas de ingeniería de software ágil.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.2,
    prestamos: 38,
    paginas: 816,
    idioma: "Español",
    temas: ["Metodologías Ágiles", "Requisitos", "Diseño de Software", "Pruebas"],
},
{
    id: 3,
    titulo: "Algoritmos y Estructuras de Datos",
    autor: "Thomas H. Cormen, Charles E. Leiserson",
    editorial: "MIT Press",
    año: 2022,
    edicion: "4ta Edición",
    categoria: "Algoritmos",
    disponible: false,
    copias: 0,
    ubicacion: "Estante C-08",
    isbn: "978-0262046305",
    descripcion:
        "Este libro cubre una amplia gama de algoritmos en profundidad, pero hace que su diseño y análisis sean accesibles para todos los niveles de lectores. Cada capítulo es relativamente autónomo y puede utilizarse como unidad de estudio.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.8,
    prestamos: 56,
    paginas: 1312,
    idioma: "Inglés",
    temas: ["Algoritmos", "Estructuras de Datos", "Complejidad", "Grafos"],
},
{
    id: 4,
    titulo: "Inteligencia Artificial: Un Enfoque Moderno",
    autor: "Stuart Russell, Peter Norvig",
    editorial: "Pearson",
    año: 2020,
    edicion: "4ta Edición",
    categoria: "Inteligencia Artificial",
    disponible: true,
    copias: 1,
    ubicacion: "Estante D-03",
    isbn: "978-0134610993",
    descripcion:
        "El libro de texto líder en inteligencia artificial, utilizado en más de 1500 universidades en más de 135 países. El texto proporciona una introducción moderna a la IA, cubriendo tanto los fundamentos como los temas avanzados.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.7,
    prestamos: 45,
    paginas: 1136,
    idioma: "Español",
    temas: ["Machine Learning", "Redes Neuronales", "Visión por Computadora", "Procesamiento de Lenguaje Natural"],
},
{
    id: 5,
    titulo: "Redes de Computadoras",
    autor: "Andrew S. Tanenbaum, David J. Wetherall",
    editorial: "Pearson",
    año: 2021,
    edicion: "6ta Edición",
    categoria: "Redes",
    disponible: true,
    copias: 4,
    ubicacion: "Estante A-07",
    isbn: "978-0132126953",
    descripcion:
        "Este libro presenta un enfoque estructurado y completo de las redes de computadoras, desde los conceptos básicos hasta las aplicaciones avanzadas. Cubre los principios, protocolos y arquitecturas de las redes modernas.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.3,
    prestamos: 32,
    paginas: 960,
    idioma: "Español",
    temas: ["TCP/IP", "Protocolos", "Seguridad en Redes", "Arquitectura de Redes"],
},
{
    id: 6,
    titulo: "Programación en Python",
    autor: "Mark Lutz",
    editorial: "O'Reilly Media",
    año: 2021,
    edicion: "5ta Edición",
    categoria: "Programación",
    disponible: true,
    copias: 2,
    ubicacion: "Estante B-12",
    isbn: "978-1449355739",
    descripcion:
        "Una guía completa para el lenguaje de programación Python. Cubre desde los conceptos básicos hasta técnicas avanzadas, incluyendo programación orientada a objetos, manejo de excepciones y desarrollo de aplicaciones.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.6,
    prestamos: 48,
    paginas: 1648,
    idioma: "Español",
    temas: ["Python", "Programación Orientada a Objetos", "Desarrollo Web", "Análisis de Datos"],
},
{
    id: 7,
    titulo: "Sistemas Operativos Modernos",
    autor: "Andrew S. Tanenbaum",
    editorial: "Pearson",
    año: 2018,
    edicion: "4ta Edición",
    categoria: "Sistemas Operativos",
    disponible: true,
    copias: 5,
    ubicacion: "Estante D-10",
    isbn: "978-0133591620",
    descripcion:
        "Un libro esencial para entender los conceptos y mecanismos de los sistemas operativos modernos, cubriendo desde la administración de procesos hasta la seguridad.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.4,
    prestamos: 27,
    paginas: 1136,
    idioma: "Español",
    temas: ["Procesos", "Memoria", "Seguridad", "Sistemas Distribuidos"],
},
{
    id: 8,
    titulo: "Ciencia de Datos con Python",
    autor: "Joel Grus",
    editorial: "O'Reilly Media",
    año: 2020,
    edicion: "2da Edición",
    categoria: "Programación",
    disponible: false,
    copias: 0,
    ubicacion: "Estante B-15",
    isbn: "978-1492041139",
    descripcion:
        "Una introducción práctica a la ciencia de datos usando Python, cubriendo desde estadística básica hasta machine learning.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.1,
    prestamos: 19,
    paginas: 400,
    idioma: "Español",
    temas: ["Python", "Ciencia de Datos", "Machine Learning", "Estadística"],
},
{
    id: 9,
    titulo: "Compiladores: Principios, Técnicas y Herramientas",
    autor: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
    editorial: "Pearson",
    año: 2007,
    edicion: "2da Edición",
    categoria: "Programación",
    disponible: true,
    copias: 2,
    ubicacion: "Estante C-02",
    isbn: "978-0321486813",
    descripcion:
        "Conocido como el 'Libro del Dragón', es la referencia clásica para el diseño e implementación de compiladores.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.7,
    prestamos: 34,
    paginas: 1000,
    idioma: "Español",
    temas: ["Compiladores", "Lenguajes de Programación", "Análisis Léxico", "Sintaxis"],
},
{
    id: 10,
    titulo: "Linux: The Complete Reference",
    autor: "Richard Petersen",
    editorial: "McGraw-Hill",
    año: 2019,
    edicion: "8va Edición",
    categoria: "Sistemas Operativos",
    disponible: true,
    copias: 3,
    ubicacion: "Estante D-12",
    isbn: "978-1260440218",
    descripcion:
        "Guía completa sobre el sistema operativo Linux, desde la instalación hasta la administración avanzada.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.3,
    prestamos: 22,
    paginas: 912,
    idioma: "Inglés",
    temas: ["Linux", "Administración de Sistemas", "Shell", "Redes"],
},
{
    id: 11,
    titulo: "Redes Neuronales y Aprendizaje Profundo",
    autor: "Michael Nielsen",
    editorial: "Independiente",
    año: 2017,
    edicion: "1ra Edición",
    categoria: "Inteligencia Artificial",
    disponible: false,
    copias: 0,
    ubicacion: "Estante D-15",
    isbn: "978-1530826605",
    descripcion:
        "Una introducción clara y visual al aprendizaje profundo y las redes neuronales artificiales.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.5,
    prestamos: 29,
    paginas: 320,
    idioma: "Español",
    temas: ["Deep Learning", "Redes Neuronales", "IA", "Python"],
},
{
    id: 12,
    titulo: "Estructura y Diseño de Computadoras",
    autor: "David A. Patterson, John L. Hennessy",
    editorial: "Morgan Kaufmann",
    año: 2021,
    edicion: "6ta Edición",
    categoria: "Algoritmos",
    disponible: true,
    copias: 1,
    ubicacion: "Estante E-01",
    isbn: "978-0128201091",
    descripcion:
        "Referencia fundamental sobre arquitectura de computadoras, cubriendo desde los principios básicos hasta los sistemas modernos.",
    portada: "/placeholder.svg?height=280&width=200",
    calificacion: 4.9,
    prestamos: 17,
    paginas: 800,
    idioma: "Español",
    temas: ["Arquitectura", "Hardware", "Procesadores", "Memoria"],
},
];

export default function AdminCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState("Bibliotecario");

  // Simula libros (puedes usar useState si quieres mutar la lista)
  const [libros, setLibros] = useState(librosEjemplo);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        setUsername(localStorage.getItem('sgp-uci-username') || 'Bibliotecario');
      } catch (e) {
        setUsername('Bibliotecario');
      }
    }
  }, []);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Filtros
  const filteredBooks = libros.filter((libro) => {
    const matchesSearch =
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(libro.categoria);
    const matchesAvailable = !onlyAvailable || libro.disponible;
    return matchesSearch && matchesCategory && matchesAvailable;
  });

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
    window.location.href = "/";
  };

  // Añadir libro
  const handleAddBook = (e) => {
    e.preventDefault();
    // Aquí puedes obtener los datos del formulario y agregarlos a la lista de libros
    setShowAddModal(false);
  };

  // Editar libro
  const handleEditBook = (book) => {
    setBookToEdit(book);
    setShowEditModal(true);
  };

  const handleSaveEditBook = (e) => {
    e.preventDefault();
    // Aquí puedes actualizar el libro en la lista
    setShowEditModal(false);
  };

  // Eliminar libro
  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDeleteBook = () => {
    // Aquí puedes eliminar el libro de la lista
    setShowDeleteModal(false);
    setSelectedBook(null);
  };

  // Filtros
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
      <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <Tag size={16} className="me-2" />
              Categorías
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <ListGroup variant="flush">
              {categorias.map((categoria) => (
                <ListGroup.Item key={categoria}>
                  <Form.Check
                    type="checkbox"
                    label={categoria}
                    checked={selectedCategories.includes(categoria)}
                    onChange={() => handleCategoryChange(categoria)}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
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

  // Modal detalles libro
  const BookDetailsModal = () => (
    <Modal
      show={!!selectedBook}
      onHide={() => setSelectedBook(null)}
      size="lg"
      centered
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
                src={selectedBook.portada}
                alt={selectedBook.titulo}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: '300px' }}
              />
              <h2>{selectedBook.titulo}</h2>
              <p className="text-muted">{selectedBook.autor}</p>
              <div className="d-flex justify-content-center gap-3 mb-3">
                <div className="d-flex align-items-center">
                  <Star size={16} className="text-warning me-1" />
                  <span>{selectedBook.calificacion}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Users size={16} className="text-muted me-1" />
                  <span>{selectedBook.prestamos} préstamos</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h5>Descripción</h5>
              <p>{selectedBook.descripcion}</p>
            </div>
            <Row className="mb-4">
              <Col md={6}>
                <h5>Detalles</h5>
                <dl className="row">
                  <dt className="col-sm-4">Editorial</dt>
                  <dd className="col-sm-8">{selectedBook.editorial}</dd>
                  <dt className="col-sm-4">Año</dt>
                  <dd className="col-sm-8">{selectedBook.año}</dd>
                  {/* Más detalles... */}
                </dl>
              </Col>
            </Row>
            <div className="mt-auto d-flex gap-2">
              <Button
                variant="outline-danger"
                onClick={() => handleDeleteBook(selectedBook)}
              >
                <Trash2 className="me-2" /> Eliminar
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleEditBook(selectedBook)}
              >
                <Edit className="me-2" /> Editar
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header estilo homeLibrarian + botón añadir libro */}
      <header className="sticky-top bg-white border-bottom py-3">
        <Container fluid>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-4">
              <BookOpen className="text-primary me-2" size={24} />
              <span className="h5 mb-0 fw-bold">SGP-UCI</span>
              <Badge bg="secondary" className="ms-2 align-self-center">Administrador</Badge>
            </div>
            <div className="ms-auto d-flex align-items-center gap-3">
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={() => setShowAddModal(true)}
              >
                <BookPlus size={18} />
                Añadir libro
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
        {/* Sidebar igual a homeLibrarian, con Catalog marcado */}
        <div className="d-none d-md-block bg-white border-end" style={{ width: '240px' }}>
          <Nav className="flex-column p-3 gap-2">
            <Nav.Link
              href="/homelibrarian"
              className="d-flex align-items-center gap-2"
              style={{ color: "#0d6efd" }}
            >
              <BarChart3 size={20} />
              Dashboard
            </Nav.Link>
            <Nav.Link
              href="/homelibrarian/users"
              className="d-flex align-items-center gap-2"
            >
              <Users size={20} />
              Usuarios
            </Nav.Link>
            <Nav.Link
              href="/homelibrarian/catalog"
              className="d-flex align-items-center gap-2 active"
              style={{
                color: "#212529",
                fontWeight: "bold",
                background: "#e9ecef",
                borderRadius: "0.375rem"
              }}
            >
              <BookOpen size={20} />
              Catálogo
            </Nav.Link>
            <Nav.Link href="/homelibrarian/prestamos" className="d-flex align-items-center gap-2">
              <BookMarked size={20} />
              Préstamos
            </Nav.Link>
            <Nav.Link href="/homelibrarian/reportes" className="d-flex align-items-center gap-2">
              <FileText size={20} />
              Reportes
            </Nav.Link>
          </Nav>
        </div>

        {/* Contenido principal */}
        <main className="flex-grow-1 p-4">
          <Container fluid>
            <div className="mb-4">
              <h1 className="h2 fw-bold">Catálogo de Libros</h1>
              <p className="text-muted">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
              </p>
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
                                src={libro.portada}
                                alt={libro.titulo}
                                className="me-3 rounded"
                                style={{ width: '48px', height: '72px', objectFit: 'cover' }}
                              />
                              <div className="d-flex flex-column">
                                <Card.Title className="h6">{libro.titulo}</Card.Title>
                                <Card.Subtitle className="text-muted small mb-2">
                                  {libro.autor}
                                </Card.Subtitle>
                                <div className="d-flex align-items-center mb-2">
                                  <Star size={14} className="text-warning me-1" />
                                  <small>{libro.calificacion}</small>
                                  <CalendarIcon size={14} className="ms-2 me-1 text-muted" />
                                  <small className="text-muted">{libro.año}</small>
                                </div>
                                <Badge
                                  bg={libro.disponible ? 'success' : 'secondary'}
                                  className="mt-auto align-self-start"
                                >
                                  {libro.disponible ? 'Disponible' : 'No disponible'}
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

      {/* Modal detalles libro */}
      <BookDetailsModal />

      {/* Modal añadir libro */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddBook}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select required>
                {categorias.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Agrega más campos según lo necesario */}
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal editar libro */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Libro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEditBook}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control defaultValue={bookToEdit?.titulo} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control defaultValue={bookToEdit?.autor} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select defaultValue={bookToEdit?.categoria} required>
                {categorias.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* Agrega más campos según lo necesario */}
            <Button type="submit" variant="primary">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Esta acción eliminará el libro de forma permanente.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteBook}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}