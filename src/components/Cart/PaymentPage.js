import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'; // Dùng useLocation và useNavigate để lấy thông tin và chuyển hướng
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';

const PaymentPage = () => {
    const location = useLocation(); // Để lấy thông tin từ đường dẫn
    const navigate = useNavigate();
    const { totalAmount, paymentMethod } = location.state || {}; // Lấy thông tin totalAmount và paymentMethod từ đường dẫn

    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePayment = async () => {
        const userId = localStorage.getItem('userId');
        console.log(userId)

        try {
            // Gọi API thanh toán với phương thức thanh toán và tổng số tiền
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

            toast.success("Thanh toán thành công!");
            setPaymentStatus('Thanh toán thành công!');
        } catch (error) {
            console.error('Error during payment:', error);
            toast.error("Payment failed. Please try again.");
            setPaymentStatus('Thanh toán thất bại!');
        }
    };

    return (
        <div className="payment-page">
            <h2>Thanh toán</h2>
            <p>Tổng tiền: ${totalAmount}</p>
            <p>Phương thức thanh toán: {paymentMethod}</p>

            <Button variant="primary" onClick={handlePayment}>
                Xác nhận thanh toán
            </Button>

            {paymentStatus && <p>{paymentStatus}</p>}
        </div>
    );
};

export default PaymentPage;
