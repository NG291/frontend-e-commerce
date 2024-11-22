import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './customConfirmAlert.css';

const UserPendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Hàm lấy danh sách đơn hàng chờ xử lý của người dùng
    const loadPendingOrders = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await axiosClient.get(`${BASE_URL}/api/orders/pendingUser/${userId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching pending orders:', error);
            toast.error("Error loading pending orders list. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý hành động hủy đơn hàng
    const cancelOrder = async (orderId) => {
        // Hiển thị hộp thoại xác nhận
        confirmAlert({
            title: 'Confirm cancel order',
            message: 'Are you sure to cancel this order?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            // Gọi API hủy đơn hàng
                            const response = await axiosClient.put(`${BASE_URL}/api/orders/cancel/${orderId}`);
                            toast.success(response.data);
                            loadPendingOrders();
                        } catch (error) {
                            console.error('Error canceling order:', error);
                            toast.error("Order cancel error. Try again later!");
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => toast.info("Action cancelled!")
                }
            ]
        });
    };

    useEffect(() => {
        loadPendingOrders();
    }, []);

    return (
        <div className="user-pending-orders">
            <Header />
            <h2>Pending orders</h2>
            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>There are no current pending orders. Please check back later.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Buyer</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.buyerName}</td>
                            <td>{order.totalAmount} VND</td>
                            <td>
                                {order.status === 'PENDING' && (
                                    <>
                                        <Button
                                            variant="danger"
                                            onClick={() => cancelOrder(order.id)} // Gọi hàm hủy đơn
                                        >
                                            Cancel order
                                        </Button>
                                    </>
                                )}
                                {(order.status === 'CONFIRMED' || order.status === 'CANCELLED') && (
                                    <span>Order has been processed.</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
            <Footer />
        </div>
    );
};

export default UserPendingOrders;
