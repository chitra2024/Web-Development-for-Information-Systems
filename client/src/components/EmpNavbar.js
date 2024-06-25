import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EmpNavbar.css';

const EmpNavbar = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/emp-dashboard">Employee Dashboard</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/emp-dashboard/in-progress">In Progress</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/emp-dashboard/completed">Completed</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <span className="nav-link">Hello, {userInfo.name}</span>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={logoutHandler}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default EmpNavbar;
