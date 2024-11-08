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
            setErrorMessage('Mật khẩu không khớp');
            return;
        }

        try {

            await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password,
            });

            navigate('/login');
        } catch (error) {
            setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    return (
        <div className="register-page">
            <div className="register-form-container">
                <h2 className="register-title">Đăng ký tài khoản</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleRegister} className="register-form">
                    <div className="input-field">
                        <label htmlFor="username">Tên đăng nhập</label>
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
                        <label htmlFor="password">Mật khẩu</label>
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
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="register-btn">Đăng ký</button>
                </form>
                <div className="login-link">
                    <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
