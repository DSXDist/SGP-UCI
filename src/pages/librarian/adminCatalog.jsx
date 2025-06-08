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
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  // Estado para el formulario de añadir libro (agrega todos los campos que tiene tu modelo)
  const [addBookForm, setAddBookForm] = useState({
    title: "",
    author: "",
    editorial: "",
    description: "",
    published_date: "",
    image_url: "",
    available_copies: 1,
    categories: "",
    calificacion: 0, // Si tu modelo tiene calificación
  });
  const [addBookError, setAddBookError] = useState("");
  const [addBookSuccess, setAddBookSuccess] = useState("");

  // Estado para el formulario de edición
  const [editBookForm, setEditBookForm] = useState({
    title: "",
    author: "",
    editorial: "",
    description: "",
    published_date: "",
    image_url: "",
    available_copies: 1,
    categories: "",
    calificacion: 0,
  });
  const [editBookError, setEditBookError] = useState("");
  const [editBookSuccess, setEditBookSuccess] = useState("");

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

  // Obtener libros desde el backend y extraer categorías únicas
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
      .then(data => {
        setLibros(data);

        // Extraer categorías únicas de todos los libros
        const allCategories = data
          .flatMap(libro =>
            typeof libro.categories === "string"
              ? libro.categories.split(",").map(c => c.trim())
              : Array.isArray(libro.categories)
                ? libro.categories.map(c => c.trim())
                : []
          )
          .filter(Boolean);

        setCategorias([...new Set(allCategories)]);
      })
      .catch(() => {
        setLibros([]);
        setCategorias([]);
      });
  }, []);

  // Filtros
  const filteredBooks = libros.filter((libro) => {
    const matchesSearch =
      (libro.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (libro.author?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some(cat =>
        (libro.categories || "").toLowerCase().includes(cat.toLowerCase())
      );
    const matchesAvailable = !onlyAvailable || libro.available_copies > 0;
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

  // Manejar cambios en el formulario de añadir libro
  const handleAddBookChange = (e) => {
    const { name, value } = e.target;
    setAddBookForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Añadir libro
  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddBookError("");
    setAddBookSuccess("");
    const token = localStorage.getItem('sgp-uci-token');
    try {
      const res = await fetch('http://localhost:8000/library/api/books/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...addBookForm,
          available_copies: Number(addBookForm.available_copies),
          calificacion: Number(addBookForm.calificacion),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setAddBookError(
          errorData.detail ||
          Object.values(errorData).flat().join(" ") ||
          "Error al añadir el libro"
        );
        return;
      }
      const newBook = await res.json();
      setAddBookSuccess("Libro añadido satisfactoriamente");
      setLibros((prev) => [...prev, newBook]);
      setShowAddModal(false);
      setAddBookForm({
        title: "",
        author: "",
        editorial: "",
        description: "",
        published_date: "",
        image_url: "",
        available_copies: 1,
        categories: "",
        calificacion: 0,
      });
    } catch (err) {
      setAddBookError("Error de red al añadir el libro");
    }
  };

  // Editar libro
  const handleEditBook = (book) => {
    setSelectedBook(null); // Cierra el modal de detalles antes de abrir el de edición
    setBookToEdit(book);
    setShowEditModal(true);
  };

  // Cuando se selecciona un libro para editar, llena el formulario
  useEffect(() => {
    if (bookToEdit) {
      setEditBookForm({
        title: bookToEdit.title || "",
        author: bookToEdit.author || "",
        editorial: bookToEdit.editorial || "",
        description: bookToEdit.description || "",
        published_date: bookToEdit.published_date || "",
        image_url: bookToEdit.image_url || "",
        available_copies: bookToEdit.available_copies ?? 1,
        categories: Array.isArray(bookToEdit.categories)
          ? bookToEdit.categories.join(", ")
          : (bookToEdit.categories || ""),
        calificacion: bookToEdit.calificacion ?? 0,
      });
      setEditBookError("");
      setEditBookSuccess("");
    }
  }, [bookToEdit]);

  const handleEditBookChange = (e) => {
    const { name, value } = e.target;
    setEditBookForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios del libro editado
  const handleSaveEditBook = async (e) => {
    e.preventDefault();
    setEditBookError("");
    setEditBookSuccess("");
    if (!bookToEdit) return;
    const token = localStorage.getItem('sgp-uci-token');
    try {
      const res = await fetch(`http://localhost:8000/library/api/books/${bookToEdit.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editBookForm,
          available_copies: Number(editBookForm.available_copies),
          calificacion: Number(editBookForm.calificacion),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setEditBookError(
          errorData.detail ||
          Object.values(errorData).flat().join(" ") ||
          "Error al editar el libro"
        );
        return;
      }
      const updatedBook = await res.json();
      setEditBookSuccess("Libro editado satisfactoriamente");
      setLibros((prev) =>
        prev.map((libro) => (libro.id === updatedBook.id ? updatedBook : libro))
      );
      setShowEditModal(false);
      setBookToEdit(null);
    } catch (err) {
      setEditBookError("Error de red al editar el libro");
    }
  };

  // Eliminar libro
  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    const token = localStorage.getItem('sgp-uci-token');
    try {
      const res = await fetch(`http://localhost:8000/library/api/books/${bookToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setLibros((prev) => prev.filter((libro) => libro.id !== bookToDelete.id));
        setShowDeleteModal(false);
        setSelectedBook(null);
        setBookToDelete(null);
      } else {
        // Puedes mostrar un mensaje de error si lo deseas
        setShowDeleteModal(false);
        setBookToDelete(null);
      }
    } catch (err) {
      // Puedes mostrar un mensaje de error si lo deseas
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
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
                src={selectedBook.image_url}
                alt={selectedBook.title}
                className="img-fluid rounded mb-3"
                style={{ maxHeight: '300px' }}
              />
              <h2>{selectedBook.title}</h2>
              <p className="text-muted">{selectedBook.author}</p>
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
                                  <CalendarIcon size={14} className="ms-2 me-1 text-muted" />
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
              <Form.Control
                name="title"
                value={addBookForm.title}
                onChange={handleAddBookChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                name="author"
                value={addBookForm.author}
                onChange={handleAddBookChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Editorial</Form.Label>
              <Form.Control
                name="editorial"
                value={addBookForm.editorial}
                onChange={handleAddBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={addBookForm.description}
                onChange={handleAddBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de publicación</Form.Label>
              <Form.Control
                type="date"
                name="published_date"
                value={addBookForm.published_date}
                onChange={handleAddBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                name="image_url"
                value={addBookForm.image_url}
                onChange={handleAddBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ejemplares disponibles</Form.Label>
              <Form.Control
                type="number"
                min={0}
                name="available_copies"
                value={addBookForm.available_copies}
                onChange={handleAddBookChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categorías (separadas por coma)</Form.Label>
              <Form.Control
                name="categories"
                value={addBookForm.categories}
                onChange={handleAddBookChange}
                placeholder="Ej: Ciencia Ficción, Fantasía"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calificación</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={5}
                step={0.1}
                name="calificacion"
                value={addBookForm.calificacion}
                onChange={handleAddBookChange}
              />
            </Form.Group>
            {addBookError && (
              <div className="alert alert-danger py-2">{addBookError}</div>
            )}
            {addBookSuccess && (
              <div className="alert alert-success py-2">{addBookSuccess}</div>
            )}
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
              <Form.Control
                name="title"
                value={editBookForm.title}
                onChange={handleEditBookChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                name="author"
                value={editBookForm.author}
                onChange={handleEditBookChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Editorial</Form.Label>
              <Form.Control
                name="editorial"
                value={editBookForm.editorial}
                onChange={handleEditBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={editBookForm.description}
                onChange={handleEditBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de publicación</Form.Label>
              <Form.Control
                type="date"
                name="published_date"
                value={editBookForm.published_date}
                onChange={handleEditBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                name="image_url"
                value={editBookForm.image_url}
                onChange={handleEditBookChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ejemplares disponibles</Form.Label>
              <Form.Control
                type="number"
                min={0}
                name="available_copies"
                value={editBookForm.available_copies}
                onChange={handleEditBookChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categorías (separadas por coma)</Form.Label>
              <Form.Control
                name="categories"
                value={editBookForm.categories}
                onChange={handleEditBookChange}
                placeholder="Ej: Ciencia Ficción, Fantasía"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calificación</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={5}
                step={0.1}
                name="calificacion"
                value={editBookForm.calificacion}
                onChange={handleEditBookChange}
              />
            </Form.Group>
            {editBookError && (
              <div className="alert alert-danger py-2">{editBookError}</div>
            )}
            {editBookSuccess && (
              <div className="alert alert-success py-2">{editBookSuccess}</div>
            )}
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