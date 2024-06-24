import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmpNavbar from './EmpNavbar';
import './EmpCourses.css';

const EmpCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses`, config);
                setCourses(data);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
        };

        fetchCourses();
    }, []);

    const handleEnrollCourse = async (id) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/courses/enroll/${id}`, {}, config);
            setCourses(courses.map((course) => (course._id === id ? { ...course, enrolled: true } : course)));
        } catch (err) {
            setError(err.response.data.message || 'An error occurred');
        }
    };

    return (
        <div>
            <EmpNavbar />
            <div className="container mt-5">
                <h1>All Courses</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row">
                    {courses.map((course) => (
                        <div key={course._id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text">{course.description}</p>
                                    <p className="card-text"><small className="text-muted">{course.category}</small></p>
                                    <p className="card-text"><small className="text-muted">{course.duration} {course.durationType}</small></p>
                                    {course.enrolled ? (
                                        <span className="badge bg-success">Enrolled</span>
                                    ) : (
                                        <button className="btn btn-primary btn-sm" onClick={() => handleEnrollCourse(course._id)}>Enroll</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmpCourses;
