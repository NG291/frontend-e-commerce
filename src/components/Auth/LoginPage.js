import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.scss';
import { Alert, Button } from "react-bootstrap";
import { BASE_URL } from "../../utils/apiURL";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                username,
                password,
            });

            if (response.data && response.data.token) {
                const { token, username, authorities } = response.data;
                const role = authorities && authorities.length > 0 && authorities[0].authority;
                toast.success("Logged in successfully!");
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('username', username);
                localStorage.setItem('role', role);

                if (role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                toast.error("Cannot log in, try again.");
                setErrorMessage('Cannot log in, try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error("Username or password incorrect!");
            setErrorMessage('Username or password incorrect!');
        }
    };

    return (
        <main className="form-signin w-100 m-auto p-3" style={{ maxWidth: '400px' }}>
            <form onSubmit={handleLogin} className="border p-4 rounded shadow">
                <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>
                {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}

                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-grid gap-2 mb-3">
                    <Button variant="primary" type="submit">Sign in</Button>
                </div>
                <p className="text-center mt-2">Do not have an account? <Link to="/register">Register now!</Link></p>
                <div className="text-center mt-3">
                    <Link to="/" className="text-decoration-none">&larr; Back to Homepage</Link>
                </div>
                <p className="mt-5 mb-3 text-center text-body-secondary">&copy; 2017–2024</p>
            </form>
        </main>
    );
};

export default LoginPage;
