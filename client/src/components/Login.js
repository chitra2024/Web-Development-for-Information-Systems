import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            onLogin(data);
            navigate('/');
        } catch (err) {
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        }
    };

    return (
        <div className="login-container">
            <Card className="shadow p-4">
                <h1 className="mb-4">Login</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">Login</Button>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
