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
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        setLoginSuccess(true);
        navigate('/vacations');
      })
      .catch(() => {
        setLoginSuccess(false);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {loginSuccess === true && <Alert variant="success">Login successful! Welcome back!</Alert>}
      {loginSuccess === false && <Alert variant="danger">Login failed. Please try again.</Alert>}
      
      <Form>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" // Add autocomplete for email
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" // Add autocomplete for password
          />
        </Form.Group>

        <Button
          variant="primary"
          type="button"
          onClick={handleLogin}
          disabled={authStatus === 'loading'}
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginComponent;
