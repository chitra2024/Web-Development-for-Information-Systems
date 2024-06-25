import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import './EmpInProgress.css';

const EmpInProgress = () => {
    const [inProgressCourses, setInProgressCourses] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchInProgressCourses = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses/enrolled/${userInfo._id}`, config);
                const inProgress = data.filter(course => !course.completed);
                setInProgressCourses(inProgress);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
        };

        fetchInProgressCourses();
    }, [userInfo]);

    const handleCompleteCourse = async (courseId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}/complete`, {}, config);
            setInProgressCourses(inProgressCourses.filter(course => course.course._id !== courseId));
        } catch (error) {
            setError(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

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
            <h1>In Progress Courses</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {inProgressCourses.length === 0 ? (
                <Alert variant="info">You have no courses in progress.</Alert>
            ) : (
                <Row>
                    {inProgressCourses.map((course) => (
                        <Col key={course._id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{course.course.title}</Card.Title>
                                    <Card.Text>{truncateText(course.course.description, 100)}</Card.Text>
                                    <Card.Text><strong>Category:</strong> {course.course.category}</Card.Text>
                                    <Card.Text><strong>Duration:</strong> {course.course.duration} {course.course.durationType}</Card.Text>
                                    <Card.Text><strong>Difficulty:</strong> {course.course.difficulty}</Card.Text>
                                    <Button
                                        variant="success"
                                        className="w-100 mb-2"
                                        onClick={() => handleCompleteCourse(course.course._id)}
                                    >
                                        Complete
                                    </Button>
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

export default EmpInProgress;
