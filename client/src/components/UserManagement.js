import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, config);
                const nonAdminUsers = data.filter(user => !user.isAdmin);
                setUsers(nonAdminUsers);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Check for duplicate email
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            setError('A user with this email already exists.');
            return;
        }

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/create`, { name, email, password, designation }, config);
            setUsers([...users, data]);
            setName('');
            setEmail('');
            setPassword('');
            setDesignation('');
            setError('');
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`, config);
                setUsers(users.filter((user) => user._id !== id));
            } catch (err) {
                setError(err.response.data.message || 'An error occurred');
            }
        }
    };

    const handleEnableDisableUser = async (id, active) => {
        const action = active ? 'disable' : 'enable';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${id}`, { active: !active }, config);
                setUsers(users.map((user) =>
                    user._id === id ? { ...user, active: !user.active } : user
                ));
            } catch (err) {
                setError(err.response.data.message || 'An error occurred');
            }
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow p-4">
                        <h1 className="mb-4">User Management</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleAddUser}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">Add User</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <h2 className="mt-5">Existing Users</h2>
            <Row>
                {users.map((user) => (
                    <Col key={user._id} md={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <Card.Title>{user.name}</Card.Title>
                                <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                                <Card.Text><strong>Designation:</strong> {user.designation}</Card.Text>
                                <Button variant="danger" size="sm" className="me-2" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                                {/* <Button variant="warning" size="sm" onClick={() => handleEnableDisableUser(user._id, user.active)}>
                                    {user.active ? 'Disable the User' : 'Enable the User'}
                                </Button> */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UserManagement;
