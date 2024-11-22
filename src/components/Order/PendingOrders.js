import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';
import Header from "../Header/Header";
import Footer from "../Footer/Footer"; // Import Footer component
import { confirmAlert } from 'react-confirm-alert'; // Import thư viện react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS mặc định của react-confirm-alert
import './customConfirmAlert.css'; // Import CSS tùy chỉnh của bạn

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

    const handleOrderAction = async (orderId, actionType) => {
        const confirmationMessage =
            actionType === "reject"
                ? "Bạn có chắc chắn muốn từ chối đơn hàng này?"
                : "Bạn có chắc chắn muốn xác nhận đơn hàng này?";

        confirmAlert({
            title: 'Xác nhận hành động',
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
                            fetchPendingOrders(); // Lấy lại danh sách đơn hàng sau khi xử lý

                            const successMessage =
                                actionType === "reject"
                                    ? "Đơn hàng đã bị từ chối thành công."
                                    : "Đơn hàng đã được xác nhận thành công.";
                            toast.success(successMessage);
                        } catch (error) {
                            console.error('Error processing order:', error);
                            const errorMessage =
                                actionType === "reject"
                                    ? "Lỗi khi từ chối đơn hàng. Vui lòng thử lại sau."
                                    : "Lỗi khi xác nhận đơn hàng. Vui lòng thử lại sau.";
                            toast.error(errorMessage);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => toast.info("Hành động đã bị hủy.")
                }
            ]
        });
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
            <Footer />
        </div>
    );
};

export default PendingOrders;
