import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CourseManagement from './components/CourseManagement';
import UserManagement from './components/UserManagement';
import EmpDashboard from './components/EmpDashboard';
import EmpCourses from './components/EmpCourses';
import EmpInProgress from './components/EmpInProgress';
import EmpCompleted from './components/EmpCompleted';
import './App.css';

const App = () => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar userInfo={userInfo} onLogout={handleLogout} />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login onLogin={setUserInfo} />} />
                        <Route path="/dashboard" element={
                            userInfo ? (userInfo.isAdmin ? <AdminDashboard /> : <Navigate to="/emp-dashboard" />) : <Navigate to="/login" />
                        } />
                        <Route path="/admin/courses" element={
                            userInfo && userInfo.isAdmin ? <CourseManagement /> : <Navigate to="/login" />
                        } />
                        <Route path="/admin/users" element={
                            userInfo && userInfo.isAdmin ? <UserManagement /> : <Navigate to="/login" />
                        } />
                        <Route path="/emp-dashboard" element={
                            userInfo ? (!userInfo.isAdmin ? <EmpDashboard /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
                        } />
                        <Route path="/emp-dashboard/courses" element={
                            userInfo ? (!userInfo.isAdmin ? <EmpCourses /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
                        } />
                        <Route path="/emp-dashboard/in-progress" element={
                            userInfo ? (!userInfo.isAdmin ? <EmpInProgress /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
                        } />
                        <Route path="/emp-dashboard/completed" element={
                            userInfo ? (!userInfo.isAdmin ? <EmpCompleted /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
