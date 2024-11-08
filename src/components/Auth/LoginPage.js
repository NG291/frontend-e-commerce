import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.scss';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Gửi request đăng nhập tới backend
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });

            // Kiểm tra xem phản hồi có dữ liệu token không
            if (response.data && response.data.token) {
                // Lưu trữ JWT token vào localStorage
                localStorage.setItem('jwtToken', response.data.token);
                localStorage.setItem('username', response.data.username); // Lưu tên người dùng nếu cần
                localStorage.setItem('userId', response.data.id);

                // Chuyển hướng người dùng về trang chủ hoặc nơi bạn muốn
                navigate('/');
            } else {
                setErrorMessage('Đăng nhập thất bại, vui lòng thử lại.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <h2 className="login-title">Đăng nhập</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleLogin} className="login-form">
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
                    <button type="submit" className="login-btn">Đăng nhập</button>
                </form>
                <div className="signup-link">
                    <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
