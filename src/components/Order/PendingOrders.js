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
            toast.error("Lỗi khi tải danh sách đơn hàng chờ xử lý. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm từ chối đơn hàng
    const rejectOrder = async (orderId) => {
        try {
            await axiosClient.put(`${BASE_URL}/api/orders/reject/${orderId}`);
            fetchPendingOrders(); // Lấy lại danh sách đơn hàng sau khi từ chối
            toast.success("Đơn hàng đã bị từ chối thành công.");
        } catch (error) {
            console.error('Error rejecting order:', error);
            toast.error("Lỗi khi từ chối đơn hàng. Vui lòng thử lại sau.");
        }
    };

    // Hàm xác nhận đơn hàng
    const confirmOrder = async (orderId) => {
        try {
            await axiosClient.put(`${BASE_URL}/api/orders/success/${orderId}`);
            fetchPendingOrders(); // Lấy lại danh sách đơn hàng sau khi xác nhận
            toast.success("Đơn hàng đã được xác nhận thành công.");
        } catch (error) {
            console.error('Error confirming order:', error);
            toast.error("Lỗi khi xác nhận đơn hàng. Vui lòng thử lại sau.");
        }
    };

    useEffect(() => {
        fetchPendingOrders(); // Lấy danh sách đơn hàng khi component được render
    }, []);

    return (
        <div className="pending-orders">
            <Header />
            <h2>Danh sách đơn hàng chờ xử lý</h2>
            {loading ? (
                <p>Đang tải danh sách đơn hàng...</p>
            ) : orders.length === 0 ? (
                <p>Không có đơn hàng chờ xử lý hiện tại. Hãy kiểm tra lại sau.</p>
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
                                            Xác nhận
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => rejectOrder(order.id)}
                                        >
                                            Từ chối
                                        </Button>
                                    </>
                                )}
                                {/* Nếu đơn hàng đã được xác nhận/từ chối, ẩn nút hành động */}
                                {(order.status === 'CONFIRMED' || order.status === 'REJECTED') && (
                                    <span>Đơn hàng đã được xử lý.</span>
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
