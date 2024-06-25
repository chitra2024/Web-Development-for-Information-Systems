import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setError('');
            navigate('/');
        } catch (error) {
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100">
            <Card className="p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="mb-4">Login</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Login
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Login;
