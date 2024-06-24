import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert, Modal, Button } from 'react-bootstrap';
import './EmpCompleted.css';

const EmpCompleted = () => {
    const [completedCourses, setCompletedCourses] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchCompletedCourses = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses/enrolled/${userInfo._id}`, config);
                const completed = data.filter(course => course.completed);
                setCompletedCourses(completed);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
        };

        fetchCompletedCourses();
    }, [userInfo]);

    const handleShowModal = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCourse(null);
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <Container className="mt-5">
            <h1>Completed Courses</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {completedCourses.length === 0 ? (
                <Alert variant="info">You have no completed courses.</Alert>
            ) : (
                <Row>
                    {completedCourses.map((course) => (
                        <Col key={course._id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{course.course.title}</Card.Title>
                                    <Card.Text>{truncateText(course.course.description, 100)}</Card.Text>
                                    <Card.Text><strong>Category:</strong> {course.course.category}</Card.Text>
                                    <Card.Text><strong>Duration:</strong> {course.course.duration} {course.course.durationType}</Card.Text>
                                    <Card.Text><strong>Difficulty:</strong> {course.course.difficulty}</Card.Text>
                                    <Button
                                        variant="secondary"
                                        className="w-100"
                                        onClick={() => handleShowModal(course.course)}
                                    >
                                        View Details
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Course Details Modal */}
            {selectedCourse && (
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedCourse.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Description:</strong> {selectedCourse.description}</p>
                        <p><strong>Category:</strong> {selectedCourse.category}</p>
                        <p><strong>Duration:</strong> {selectedCourse.duration} {selectedCourse.durationType}</p>
                        <p><strong>Difficulty:</strong> {selectedCourse.difficulty}</p>
                        {selectedCourse.tasks && selectedCourse.tasks.length > 0 && (
                            <div>
                                <h5>Tasks:</h5>
                                <ul>
                                    {selectedCourse.tasks.map(task => (
                                        <li key={task._id}>
                                            <strong>{task.title}:</strong> {task.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default EmpCompleted;
