import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import './CourseManagement.css';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [duration, setDuration] = useState('');
    const [durationType, setDurationType] = useState('hours');
    const [difficulty, setDifficulty] = useState('beginner');
    const [addTasks, setAddTasks] = useState(false);
    const [tasks, setTasks] = useState([{ title: '', description: '' }]);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editCourseId, setEditCourseId] = useState(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    };

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

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (duration <= 0) {
            setError('Duration must be a positive number.');
            return;
        }

        const courseData = {
            title,
            description,
            category,
            duration,
            durationType,
            difficulty,
            tasks: addTasks ? tasks : [],
            enabled: true // Include the enabled field
        };

        try {
            if (editMode) {
                const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/courses/${editCourseId}`, courseData, config);
                setCourses(courses.map(course => course._id === editCourseId ? data : course));
                setEditMode(false);
                setEditCourseId(null);
            } else {
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/courses`, courseData, config);
                setCourses([...courses, data]);
            }

            setTitle('');
            setDescription('');
            setCategory('');
            setDuration('');
            setDurationType('hours');
            setDifficulty('beginner');
            setAddTasks(false);
            setTasks([{ title: '', description: '' }]);
            setError('');
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    const handleEditCourse = (course) => {
        setEditMode(true);
        setEditCourseId(course._id);
        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setDuration(course.duration);
        setDurationType(course.durationType);
        setDifficulty(course.difficulty);
        setAddTasks(course.tasks.length > 0);
        setTasks(course.tasks.length > 0 ? course.tasks : [{ title: '', description: '' }]);
    };

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...tasks];
        newTasks[index][field] = value;
        setTasks(newTasks);
    };

    const handleAddTaskField = () => {
        setTasks([...tasks, { title: '', description: '' }]);
    };

    const handleRemoveTaskField = (index) => {
        const newTasks = tasks.filter((task, i) => i !== index);
        setTasks(newTasks);
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/courses/${id}`, config);
                setCourses(courses.filter((course) => course._id !== id));
            } catch (err) {
                setError(err.response.data.message || 'An error occurred');
            }
        }
    };

    const handleEnableDisableCourse = async (id, enabled) => {
        const action = enabled ? 'disable' : 'enable';
        if (window.confirm(`Are you sure you want to ${action} this course?`)) {
            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/courses/${id}`, { enabled: !enabled }, config);
                setCourses(courses.map((course) =>
                    course._id === id ? { ...course, enabled: !course.enabled } : course
                ));
            } catch (err) {
                setError(err.response.data.message || 'An error occurred');
            }
        }
    };

    const handleDeleteTask = async (courseId, taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}/tasks/${taskId}`, config);
                setCourses(courses.map((course) => (course._id === data._id ? data : course)));
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
                        <h1 className="mb-4">{editMode ? 'Edit Course' : 'Add Course'}</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleAddCourse}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration Type</Form.Label>
                                <Form.Control as="select" value={durationType} onChange={(e) => setDurationType(e.target.value)} required>
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Difficulty</Form.Label>
                                <Form.Control as="select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="expert">Expert</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="addTasks">
                                <Form.Check type="checkbox" label="Add Tasks" checked={addTasks} onChange={() => setAddTasks(!addTasks)} />
                            </Form.Group>
                            {addTasks && tasks.map((task, index) => (
                                <div key={index} className="task-field">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Task Title</Form.Label>
                                        <Form.Control type="text" value={task.title} onChange={(e) => handleTaskChange(index, 'title', e.target.value)} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Task Description</Form.Label>
                                        <Form.Control as="textarea" value={task.description} onChange={(e) => handleTaskChange(index, 'description', e.target.value)} required />
                                    </Form.Group>
                                    <Button variant="danger" size="sm" onClick={() => handleRemoveTaskField(index)}>Remove Task</Button>
                                </div>
                            ))}
                            {addTasks && (
                                <Button variant="secondary" size="sm" onClick={handleAddTaskField}>Add Another Task</Button>
                            )}
                            <Button type="submit" variant="primary" className="mt-3 w-100">{editMode ? 'Update Course' : 'Add Course'}</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <h2 className="mt-5">Existing Courses</h2>
            {courses.map((course) => (
                <div key={course._id} className="course-item">
                    <h5>{course.title}</h5>
                    <p><span className="label">Description:</span> {course.description}</p>
                    <p><span className="label">Category:</span> {course.category}</p>
                    <p><span className="label">Duration:</span> {course.duration} {course.durationType}</p>
                    <p><span className="label">Difficulty:</span> {course.difficulty}</p>
                    <Button variant="info" size="sm" onClick={() => handleEditCourse(course)}>Edit</Button>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
                    {/* <Button variant="warning" size="sm" className="ms-2" onClick={() => handleEnableDisableCourse(course._id, course.enabled)}>
                        {course.enabled ? 'Disable the Course' : 'Enable the Course'}
                    </Button> */}
                    {course.tasks && course.tasks.length > 0 && (
                        <div className="mt-3">
                            <h6>Tasks:</h6>
                            {course.tasks.map((task) => (
                                <div key={task._id} className="task-item">
                                    <div>
                                        <div><span className="label">Task Name:</span> {task.title}</div>
                                        <div><span className="label">Description:</span> {task.description}</div>
                                    </div>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteTask(course._id, task._id)}>Delete</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </Container>
    );
};

export default CourseManagement;
