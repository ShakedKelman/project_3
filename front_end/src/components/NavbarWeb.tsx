import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store'; // Adjust import path as needed
import { logoutUser } from '../api/authThunks'; // Adjust import path as needed

const NavbarWeb: React.FC = () => {
    const authStatus = useSelector((state: RootState) => state.auth.status);
    const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch here
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logoutUser()); // Log the user out
            navigate('/login'); // Redirect to login page after logout
        }
    };

    return (
        <Navbar className="navbar-lilac" variant="light">
            <Container>
                <Navbar.Brand as={Link} to={authStatus === 'succeeded' ? "/" : "/login"}>
                    {authStatus === 'succeeded' ? 'Home' : 'Login'}
                </Navbar.Brand>
                <Nav className="me-auto">
                    {authStatus === 'succeeded' && (
                        <>
                            <Nav.Link as={Link} to="/vacations">Vacations</Nav.Link> {/* Link to Vacations page */}
                            <Nav.Link as="button" onClick={handleLogout}>Logout</Nav.Link> {/* Button for Logout */}
                        </>
                    )}
                    {authStatus !== 'succeeded' && (
                        <Nav.Link as={Link} to="/register">A new user?</Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarWeb;
