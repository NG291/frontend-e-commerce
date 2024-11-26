import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import thư viện react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS mặc định của react-confirm-alert
import './customConfirmAlert.css'; // Import CSS tùy chỉnh của bạn

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleOrderAction = async (orderId, actionType) => {
        const confirmationMessage =
            actionType === "reject"
                ? "Are you sure you want to reject this order?"
                : "Are you sure you want to confirm this order?";

        confirmAlert({
            title: 'Confirm action!',
            message: confirmationMessage,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const endpoint =
                                actionType === "reject"
                                    ? `${BASE_URL}/api/orders/reject/${orderId}`
                                    : `${BASE_URL}/api/orders/success/${orderId}`;
                            await axiosClient.put(endpoint);
                            fetchPendingOrders();

                            const successMessage =
                                actionType === "reject"
                                    ? "The order was successfully rejected."
                                    : "Order has been confirmed successfully.";
                            toast.success(successMessage);
                        } catch (error) {
                            console.error('Error processing order:', error);
                            const errorMessage =
                                actionType === "reject"
                                    ? "Error rejecting order. Please try again later."
                                    : "Error confirming order. Please try again later.";
                            toast.error(errorMessage);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => toast.info("Action terminated!")
                }
            ]
        });
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    return (
        <div className="pending-orders py-5 my-5">
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
                            <td>{order.totalAmount.toLocaleString('vi-VN')} VND</td>
                            <td>
                                {order.status === 'PENDING' && (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => handleOrderAction(order.id, "confirm")}
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleOrderAction(order.id, "reject")}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                                {(order.status === 'CONFIRMED' || order.status === 'REJECTED') && (
                                    <span>Order has been processed!</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default PendingOrders;
