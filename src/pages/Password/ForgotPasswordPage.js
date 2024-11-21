import React, { useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { Button, Form, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/users/send-reset-link?email=${email}`);
            toast.success(response.data);
        } catch (err) {
            setError('Error sending reset link. Please try again.');
            toast.error('Error sending reset link!');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Forgot Password</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleForgotPassword}>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </Form>
        </Container>
    );
};

export default ForgotPasswordPage;
