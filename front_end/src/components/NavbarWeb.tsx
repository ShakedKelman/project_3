import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link for navigation

const NavbarWeb: React.FC = () => {
    return (
        <Navbar className="navbar-lilac" variant="light">
            <Container>
                <Navbar.Brand as={Link} to="/">Home</Navbar.Brand> {/* Link to home or main page */}
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/register">Register</Nav.Link> {/* Link to Register page */}
                    <Nav.Link as={Link} to="/login">Login</Nav.Link> {/* Link to Login page */}
                    <Nav.Link as={Link} to="/vacations">Vacations</Nav.Link> {/* Link to Vacations page */}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarWeb;
