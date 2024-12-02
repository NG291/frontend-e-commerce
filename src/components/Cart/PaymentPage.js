import React, { useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import './PaymentPage.scss';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const { totalAmount, paymentMethod } = location.state || {};

    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePayment = async () => {
        const userId = localStorage.getItem('userId');
        console.log(userId);

        try {
            const response = await axiosClient.post(`${BASE_URL}/api/payments/process`, null, {
                params: {
                    userId,
                    paymentAmount: totalAmount,
                    paymentMethod,
                },
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });

            toast.success("Payment successful!");
            setPaymentStatus('Payment successful!');

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error during payment:', error);
            toast.error("Payment failed. Please try again.");
            setPaymentStatus('Payment failed!');
        }
    };

    return (
        <>
            <Header />
            <Container className="payment-page">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="payment-card">
                            <Card.Body>
                                <h2 className="text-center mb-4">Payment</h2>
                                <div className="payment-details">
                                    <p><strong>Total Amount:</strong> {totalAmount?.toLocaleString('vi-VN')} VND</p>
                                    <p><strong>Payment Method:</strong> {paymentMethod}</p>
                                </div>
                                <Button
                                    variant="primary"
                                    className="w-100"
                                    onClick={handlePayment}
                                >
                                    Confirm Payment
                                </Button>
                                {paymentStatus && (
                                    <p className={`payment-status mt-3 text-center ${paymentStatus === 'Payment successful!' ? 'text-success' : 'text-danger'}`}>
                                        {paymentStatus}
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default PaymentPage;
