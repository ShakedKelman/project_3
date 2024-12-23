import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserModel } from '../../model/UserModel';
import { register } from '../../api/auth/auth-api';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios, { AxiosError } from 'axios';
import { registerFailure, registerRequest, registerSuccess } from '../../store/slices/authSlice';
import '../../css/register.css';

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
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) {
            setError('All fields are required.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 4) {
            setError('Password must be at least 4 characters long.');
            return;
        }

        if (firstName.length < 2) {
            setError('First name must be at least 2 characters long.');
            return;
        }

        if (lastName.length < 2) {
            setError('Last name must be at least 2 characters long.');
            return;
        }

        dispatch(registerRequest());

        try {
            const userToRegister: UserModel = { email, password, firstName, lastName, isAdmin };
            const token = await register(userToRegister);
            dispatch(registerSuccess({ token }));

            navigate('/vacations');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>;
                const errorMessage = axiosError.response?.data?.message || 'Registration failed. Please try again.';
                dispatch(registerFailure(errorMessage));
                setError(errorMessage);
            } else {
                dispatch(registerFailure('Registration failed. Please try again.'));
                setError('Registration failed. Please try again.');
            }
            console.error("Error adding vacation:", error);
        }
    };


    return (
        <div className="register-page">

        <Container className="mt-4">
            <div className="register-container">

                <h2 className="register-title">Create Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                         className="text-start"
                            type="checkbox"
                            checked={isAdmin}
                            onChange={() => setIsAdmin(!isAdmin)}
                            label="Admin"
                        />
                    </Form.Group>
                    <Button
                        className="register-button"
                        onClick={handleRegister}
                        type="submit"
                        variant="outline-light"
                    >
                        Register
                    </Button>
                </Form>
                <div className="register-link">
                    <p>Already a member? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </Container>
        </div>

    );
};

export default RegisterComponent;
