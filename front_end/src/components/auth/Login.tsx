import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { loginUser } from '../../api/auth/authThunks';
import { Form, Button, Alert } from 'react-bootstrap';
import '../../css/login.css';

const LoginComponent: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { status: authStatus, count: apiCallCount } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            navigate('/vacations');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div style={{ backgroundColor: '#b4f9f2', padding: '20px', borderRadius: '8px' }}>


                <h2 style={{ color: 'black' }}>Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </Form.Group>
                    <Button
                        className="login-button" // Use your custom button class
                        type="submit"
                        disabled={authStatus === 'loading'}
                        style={{ backgroundColor: '#007B7F', color: 'white', marginTop: '20px', padding: '10px 20px' }}

                    >
                        {authStatus === 'loading' ? 'Logging in...' : 'Login'}
                    </Button>

                </Form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>

    );
};

export default LoginComponent;
