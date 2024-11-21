import React, { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Kiểm tra khớp mật khẩu
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        // Assuming the token is being passed as a query parameter and you need to extract email
        const email = token;  // If the token contains email information or replace it with actual email from state

        try {
            const response = await axiosClient.post(`${BASE_URL}/api/users/reset-password`, {
                email,
                newPassword,
            });

            // Hiển thị thông báo thành công
            toast.success(response.data);
            navigate('/login'); // Chuyển hướng về trang login
        } catch (err) {
            // Xử lý lỗi từ server
            const errorMessage = err.response?.data?.message || 'Error resetting password. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!token) {
            setError('Invalid or expired token.');
        }
    }, [token]);

    return (
        <Container>
            <h2 className="my-4 text-center">Reset Password</h2>

            {/* Thông báo lỗi */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Form reset password */}
            <Form onSubmit={handleResetPassword} className="mx-auto" style={{ maxWidth: '400px' }}>
                <Form.Group controlId="newPassword" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Nút submit */}
                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </Form>
        </Container>
    );
};

export default ResetPasswordPage;
