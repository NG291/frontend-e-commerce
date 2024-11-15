import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.scss';

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

            await axios.post('http://localhost:8081/api/auth/register', {
                username,
                password,
            });

            navigate('/login');
        } catch (error) {
            setErrorMessage('Error, try again!');
        }
    };

    return (
        <div className="register-page">
            <div className="register-form-container">
                <h2 className="register-title">Register</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleRegister} className="register-form">
                    <div className="input-field">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="register-btn">Register</button>
                </form>
                <div className="login-link">
                    <p>Already have account? <a href="/login">Login now!</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
