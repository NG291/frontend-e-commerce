import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';  // Import GoogleLogin
import './LoginPage.scss';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                username,
                password,
            });

            if (response.data && response.data.token) {
                const { id, token, username, authorities } = response.data;
                const role = authorities && authorities.length > 0 && authorities[0].authority;
                toast.success('Logged in successfully!');
                localStorage.setItem('userId', id);
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('username', username);
                localStorage.setItem('role', role);

                if (role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else if (role === 'ROLE_SELLER') {
                    navigate('/seller-page');
                } else {
                    navigate('/');
                }
            } else {
                toast.error('Cannot log in, try again.');
                setErrorMessage('Cannot log in, try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Username or password incorrect!');
            setErrorMessage('Username or password incorrect!');
        }
    };

    const handleResetPassword = async () => {
        if (resetEmail) {
            try {
                const response = await axios.get(`${BASE_URL}/api/users/reset?email=${resetEmail}`);
                toast.success(response.data || 'Reset password email sent successfully!');
                setShowResetModal(false); //
                setResetEmail('');
            } catch (error) {
                console.error(error);
                toast.error('Failed to reset password. Please try again.');
            }
        } else {
            toast.error('Please enter a valid email.');
        }
    };

    // Handle Google login callback
    const handleGoogleLogin = async (response) => {
        if (response.credential) {
            const token = response.credential;
            try {
                const userResponse = await axios.get(`${BASE_URL}/oauth2/success`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { token: jwtToken, role, username } = userResponse.data;

                // Lưu token và chi tiết người dùng
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('role', role);
                localStorage.setItem('username', username);

                // Điều hướng dựa trên vai trò người dùng
                if (role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else if (role === 'ROLE_SELLER') {
                    navigate('/seller-page');
                } else {
                    navigate('/');
                }

                toast.success('Google login successful!');
            } catch (error) {
                console.error('Google login error', error);
                toast.error('Failed to authenticate with Google. Please try again.');
            }
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
                    <Button variant="primary" type="submit">
                        Sign in
                    </Button>
                </div>
                <p className="text-center mt-2">
                    Do not have an account? <Link to="/register">Register now!</Link>
                </p>
                <div className="text-center d-flex justify-content-center my-4">
                    <Link to="/forgot-password" className="btn btn-link mb-0">
                        Forgot Password?
                    </Link>
                </div>
                <div className="text-center d-flex justify-content-center my-4">
                    <button
                        className="btn btn-link mb-0"
                        onClick={() => setShowResetModal(true)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Reset Password
                    </button>
                </div>
                <div className="text-center d-flex justify-content-center my-4">
                    <Link to="/" className="text-decoration-none mb-0">
                        &larr; Back to Homepage
                    </Link>
                </div>

                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => toast.error('Google login failed!')}
                    useOneTap
                />

                <p className="mt-5 mb-3 text-center text-body-secondary">&copy; 2017–2024</p>
            </form>

            {/* Modal for Reset Password */}
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="resetEmail">
                            <Form.Label>Enter your registered email address:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="example@example.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResetModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleResetPassword}>
                        Send Reset Email
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
};

export default LoginPage;