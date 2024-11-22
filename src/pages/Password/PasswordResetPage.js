import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../utils/apiURL";

const PasswordResetPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosClient.post(`${BASE_URL}/api/users/reset-password`, {
                token,
                newPassword,
            });
            setMessage(response.data);
            toast.success(response.data);
            // Redirect to login after successful reset
            setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
            setError(err.response?.data || 'Error resetting password.');
            toast.error(err.response?.data || 'Error resetting password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Reset Password</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handlePasswordReset}>
                    <Form.Group controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword" className="mt-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        className="mt-3 w-100"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default PasswordResetPage;
