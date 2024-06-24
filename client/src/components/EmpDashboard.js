import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmpDashboard.css';

const EmpDashboard = () => {
    const [inProgressCount, setInProgressCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseCounts = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                setError('User not logged in');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/courses/enrolled/${userInfo._id}`, config);
                const inProgressCourses = data.filter(course => !course.completed); // Assuming completed field exists
                const completedCourses = data.filter(course => course.completed); // Assuming completed field exists
                setInProgressCount(inProgressCourses.length);
                setCompletedCount(completedCourses.length);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : 'Failed to fetch course counts');
            }
        };

        fetchCourseCounts();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Employee Dashboard</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">In Progress Courses</h5>
                            <p className="card-text">{inProgressCount}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Completed Courses</h5>
                            <p className="card-text">{completedCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpDashboard;
