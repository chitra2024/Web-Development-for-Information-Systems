import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Carousel, Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import './Home.css';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses`);
                setCourses(data);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
        };

        fetchCourses();
    }, []);

    const handleEnroll = async (courseId) => {
        if (!userInfo) {
            navigate('/login');
        } else if (userInfo.isAdmin) {
            setError('Admin users cannot enroll in courses.');
        } else {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}/enroll`, {}, config);
                setSuccessMessage(data.message);
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
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

    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    return (
        <div className="home-container">
            {/* Banner Carousel */}
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/assets/banner/1.png"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Empower Your Career</h3>
                        <p>Join our training programs and boost your skills.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/assets/banner/2.png"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Learn from the Best</h3>
                        <p>Our courses are taught by industry experts.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/assets/banner/3.png"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Flexible Learning</h3>
                        <p>Learn at your own pace with our flexible course schedules.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* About Us Section */}
            <Container className="about-us my-5">
                <Row>
                    <Col>
                        <h2>About Us</h2>
                        <p>Welcome to our training portal SkillHub. We provide a variety of courses to help you grow professionally. Our mission is to empower individuals through quality education and skill development.</p>
                    </Col>
                </Row>
            </Container>

            {/* Available Courses Section */}
            <Container className="courses-container my-5">
                <h2 className="text-center mb-4">Available Courses</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Row>
                    {courses.map((course) => (
                        <Col key={course._id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{course.title}</Card.Title>
                                    <Card.Text>{truncateDescription(course.description, 100)}</Card.Text>
                                    <Card.Text><strong>Category:</strong> {course.category}</Card.Text>
                                    <Card.Text><strong>Duration:</strong> {course.duration} {course.durationType}</Card.Text>
                                    <Card.Text><strong>Difficulty:</strong> {course.difficulty}</Card.Text>
                                    <Button
                                        variant="primary"
                                        className="w-100 mb-2"
                                        onClick={() => handleEnroll(course._id)}
                                        disabled={userInfo && userInfo.isAdmin}
                                    >
                                        Enroll
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-100"
                                        onClick={() => handleShowModal(course)}
                                    >
                                        View Details
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

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
        </div>
    );
};

export default Home;
