import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logoutUser } from '../api/authThunks';

const NavbarWeb: React.FC = () => {
    const { status, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logoutUser());
            navigate('/login');
        }
    };

    const isLoggedIn = status === 'succeeded';
    const isAdmin = user?.isAdmin;

    return (
        <Navbar className="navbar-lilac" variant="light">
            <Container>
                <Navbar.Brand as={Link} to={isLoggedIn ? "/vacations" : "/login"}>
                    {isLoggedIn ? 'Vacations' : 'Login'}
                </Navbar.Brand>
                <Nav className="me-auto">
                    {isLoggedIn && (
                        <>
                            {isAdmin && <Nav.Link as={Link} to="/add-vacation">Add Vacation</Nav.Link>}
                            <Nav.Link as="button" onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    )}
                    {!isLoggedIn && (
                        <Nav.Link as={Link} to="/register">A New User?</Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarWeb;



// const NavbarWeb: React.FC = () => {
//     const authStatus = useSelector((state: RootState) => state.auth.status);
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         if (window.confirm('Are you sure you want to logout?')) {
//             dispatch(logoutUser());
//             navigate('/login');
//         }
//     };

//     // Check if user is logged in based on the timestamp
//     const isLoggedIn = authStatus === 'succeeded';
    
//     return (
//         <Navbar className="navbar-lilac" variant="light">
//             <Container>
//                 <Navbar.Brand as={Link} to={isLoggedIn ? "/vacations" : "/login"}>
//                     {isLoggedIn ? 'Vacations' : 'Login'}
//                 </Navbar.Brand>
//                 <Nav className="me-auto">
//                     {isLoggedIn && (
//                         <>
//                             <Nav.Link as={Link} to="/add-vacation">Add Vacation</Nav.Link>
//                             <Nav.Link as="button" onClick={handleLogout}>Logout</Nav.Link>
//                         </>
//                     )}
//                     {!isLoggedIn && (
//                         <Nav.Link as={Link} to="/register">A New User?</Nav.Link>
//                     )}
//                 </Nav>
//             </Container>
//         </Navbar>
//     );
// };

// export default NavbarWeb;