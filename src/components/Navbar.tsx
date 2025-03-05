import React, { useState } from "react";
import { Navbar, Container, Nav, Button, Modal, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logotipo from "../assets/img/logotipo.webp";
import { useAuth } from "../context/AuthContext";
import { saveUserCredentials } from "../utils/localStorageUtils"; 

const AppNavbar: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const { isAuthenticated, role, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClose = () => setShowLogin(false);
  const handleLoginShow = () => setShowLogin(true);

  const handleLogin = () => {
    if (!username || !password) {
      setLoginError("Ambos campos son obligatorios.");
      return;
    }

    const success = login(username, password);

    if (success) {
      saveUserCredentials(username, password); 

      setLoginError(null);
      handleLoginClose();
      navigate("/"); 
    } else {
      setLoginError("Credenciales inválidas");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userCredentials');
    navigate("/");
  };

  return (
    <>
      <Navbar style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", marginBottom: 12, marginTop: 20 }} sticky="top">
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <img src={logotipo} alt="Mi Clínica" style={{ height: 80 }} />
            </Link>
          </Navbar.Brand>
          <Nav className="text-center mt-4 mb-4">
            <Nav.Link as={Link} to="/" style={{ textDecoration: "none" }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/camera" style={{ textDecoration: "none" }}>
              Cámara
            </Nav.Link>
            {isAuthenticated && role === "admin" && (
              <>
                <Nav.Link as={Link} to="/equipo-medico" style={{ textDecoration: "none" }}>
                  Equipo Médico
                </Nav.Link>
                <Nav.Link as={Link} to="/citas" style={{ textDecoration: "none" }}>
                  Citas
                </Nav.Link>
              </>
            )}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/testimonios" style={{ textDecoration: "none" }}>
                Testimonios
              </Nav.Link>
            )}
            {!isAuthenticated && (
              <Button variant="outline-primary" onClick={handleLoginShow}>
                Login
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showLogin} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {loginError && <Alert variant="danger" className="mt-2">{loginError}</Alert>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLoginClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppNavbar;
