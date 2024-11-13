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

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                username,
                password,
            });

            if (response.data && response.data.token) {
                const {token, username, authorities} = response.data;
                const role =
                    // Extract role from authorities array
                    authorities && authorities.length > 0 && authorities[0].authority;
                toast.success("Logged in successfully!");
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('username', username);
                localStorage.setItem('role', role);

                // Redirect based on role
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
        <main className="form-signin w-100 m-auto">
            <form onSubmit={handleLogin}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                {errorMessage && <Alert key="danger" variant="danger">{errorMessage}</Alert>}

                <div className="form-floating">
                    <input type="username" className="form-control" id="floatingInput" placeholder="Username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)} required/>
                    <label htmlFor="floatingInput">Username</label>
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
                <p className="mt-2">Do not have account? <Link to="/register">Register now!</Link></p>
                <p className="mt-5 mb-3 text-center text-body-secondary">&copy; 2017–2024</p>
            </form>
        </main>
    );
};

export default LoginPage;
