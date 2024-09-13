import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { loginUser } from '../../api/auth/authThunks';
import { Form, Button, Alert } from 'react-bootstrap';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authStatus = useSelector((state: RootState) => state.auth.status);
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
      <h2>Login</h2>
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
          variant="primary"
          type="submit"
          disabled={authStatus === 'loading'}
        >
          {authStatus === 'loading' ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </div>
  );
};

export default LoginComponent;