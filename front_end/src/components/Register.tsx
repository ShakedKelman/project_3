import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserModel } from '../model/UserModel'; // Adjust import path as needed
import { register } from '../api/auth-api'; // Adjust import path as needed
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios, { AxiosError } from 'axios';

// Define an interface for the error response
interface ErrorResponse {
  message: string;
}

const RegisterComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Check if all fields are filled
    if (!email || !password || !firstName || !lastName) {
      setError('All fields are required.');
      return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate password
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const user: UserModel = {
        email,
        password,
        firstName,
        lastName,
        isAdmin
      };

      await register(user);
      setSuccess(true);
      navigate('/login'); // Redirect to login page on successful registration
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Safely extract the error message from the Axios error
        const axiosError = error as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Registration successful! Please log in.</Alert>}
      <Form>
        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
            label="Admin"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterComponent;
