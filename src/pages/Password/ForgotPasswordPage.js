import React, { useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {BASE_URL} from "../../utils/apiURL";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/users/send-reset-link?email=${email}`);
            setMessage(response.data);
            toast.success(response.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Error sending reset link.');
            toast.error(err.response?.data || 'Error sending reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Forgot Password</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleForgotPassword}>
                    <Form.Group controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        className="mt-3 w-100"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default ForgotPasswordPage;
