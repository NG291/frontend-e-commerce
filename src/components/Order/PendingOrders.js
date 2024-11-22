// src/components/PendingOrders.js
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';
import Header from "../Header/Header";
import Footer from "../Footer/Footer"; // Import Footer component

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Hàm lấy danh sách đơn hàng chờ xử lý
    const fetchPendingOrders = async () => {
        try {
            const sellerId = localStorage.getItem("userId");
            const response = await axiosClient.get(`${BASE_URL}/api/orders/pending/${sellerId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching pending orders:', error);
            toast.error("Error loading pending orders list. Please try again later!");
        } finally {
            setLoading(false);
        }
    };

    // Hàm từ chối đơn hàng
    const rejectOrder = async (orderId) => {
        try {
            await axiosClient.put(`${BASE_URL}/api/orders/reject/${orderId}`);
            fetchPendingOrders(); // Lấy lại danh sách đơn hàng sau khi từ chối
            toast.success("The order was successfully rejected!");
        } catch (error) {
            console.error('Error rejecting order:', error);
            toast.error("Error rejecting order. Please try again later!");
        }
    };

    // Hàm xác nhận đơn hàng
    const confirmOrder = async (orderId) => {
        try {
            await axiosClient.put(`${BASE_URL}/api/orders/success/${orderId}`);
            fetchPendingOrders(); // Lấy lại danh sách đơn hàng sau khi xác nhận
            toast.success("Order has been confirmed successfully!");
        } catch (error) {
            console.error('Error confirming order:', error);
            toast.error("Error confirming order. Please try again later!");
        }
    };

    useEffect(() => {
        fetchPendingOrders(); // Lấy danh sách đơn hàng khi component được render
    }, []);

    return (
        <div className="pending-orders">
            <Header />
            <h2>List of pending orders</h2>
            {loading ? (
                <p>Loading order list...</p>
            ) : orders.length === 0 ? (
                <p>There are no current pending orders. Please check back later!</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.productName}</td> {/* Cập nhật trường đúng */}
                            <td>{order.quantity}</td>
                            <td>{order.totalAmount}</td>
                            <td>
                                {order.status === 'PENDING' && (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => confirmOrder(order.id)}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => rejectOrder(order.id)}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                                {/* Nếu đơn hàng đã được xác nhận/từ chối, ẩn nút hành động */}
                                {(order.status === 'CONFIRMED' || order.status === 'REJECTED') && (
                                    <span>Order has been processed!</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <Footer />  {/* Thêm Footer vào trang */}
        </div>
    );
};

export default PendingOrders;
