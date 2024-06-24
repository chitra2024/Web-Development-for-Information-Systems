import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersResponse, coursesResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/users`, config),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/courses`, config)
                ]);

                const nonAdminUsers = usersResponse.data.filter(user => !user.isAdmin);
                setTotalUsers(nonAdminUsers.length);
                setTotalCourses(coursesResponse.data.length);
            } catch (error) {
                setError(error.response && error.response.data.message ? error.response.data.message : error.message);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="admin-dashboard-container">
            <div className="card shadow p-4">
                <h1 className="mb-4">Admin Dashboard</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row">
                    <div className="col-md-6">
                        <div className="stat-card">
                            <h3>{totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="stat-card">
                            <h3>{totalCourses}</h3>
                            <p>Total Courses</p>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <a href="/admin/users" className="btn btn-primary w-100">Manage Users</a>
                    </div>
                    <div className="col-md-6">
                        <a href="/admin/courses" className="btn btn-primary w-100">Manage Courses</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
