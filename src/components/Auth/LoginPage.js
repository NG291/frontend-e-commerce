import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './LoginPage.scss';
import {Alert, Button, Stack} from "react-bootstrap";
import {BASE_URL} from "../../utils/apiURL";
import {toast} from "react-toastify";

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
            const response = await axios.post(`${BASE_URL}api/auth/login`, {
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
                toast.error("Đăng nhập thất bại, vui lòng thử lại.");
                setErrorMessage('Đăng nhập thất bại, vui lòng thử lại.');
            }
        } catch (error) {
            console.error(error);
            toast.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
            setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác');
        }
    };

    return (
        <main className="form-signin w-100 m-auto">
            <form onSubmit={handleLogin}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}

                <div className="form-floating">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)} required/>
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)} required/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">Sign in</Button>
                </div>
                <p className="mt-2">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                <p className="mt-5 mb-3 text-center text-body-secondary">&copy; 2017–2024</p>
            </form>
        </main>
    );
};

export default LoginPage;
