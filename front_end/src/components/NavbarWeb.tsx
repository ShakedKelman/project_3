import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Adjust import path as needed

const NavbarWeb: React.FC = () => {
    const authStatus = useSelector((state: RootState) => state.auth.status);

    return (
        <Navbar className="navbar-lilac" variant="light">
            <Container>
                <Navbar.Brand as={Link} to={authStatus === 'succeeded' ? "/" : "/login"}>
                    {authStatus === 'succeeded' ? 'Home' : 'Login'}
                </Navbar.Brand>
                <Nav className="me-auto">
                    {authStatus === 'succeeded' && (
                        <Nav.Link as={Link} to="/vacations">Vacations</Nav.Link> // Link to Vacations page
                    )}
                    {authStatus !== 'succeeded' && (
                        <Nav.Link as={Link} to="/register">A new user?</Nav.Link> // Link to Register page
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarWeb;
