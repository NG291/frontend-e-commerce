import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.scss';
import { BASE_URL } from "../../utils/apiURL";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Password does not match');
            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/auth/register`, { username, password });
            navigate('/login');
        } catch (error) {
            setErrorMessage('Error, try again!');
        }
    };

    return (
        <div className="register-page d-flex align-items-center justify-content-center vh-100">
            <div className="register-form-container container p-4 border rounded shadow" style={{ maxWidth: '400px' }}>
                <h2 className="register-title text-center">Register</h2>
                {errorMessage && <div className="error-message alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleRegister} className="register-form">
                    <div className="input-field mb-3">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="input-field mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="input-field mb-3">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="register-btn w-100">Register</button>
                </form>
                <div className="text-center mt-3">
                    <p>Already have an account? <Link to="/login">Login now!</Link></p>
                </div>
                <div className="text-center mt-2">
                    <Link to="/" className="text-decoration-none">&larr; Back to Homepage</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
