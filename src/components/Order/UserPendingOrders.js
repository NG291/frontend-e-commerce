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
            toast.error("Lỗi khi tải danh sách đơn hàng chờ xử lý. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý hành động hủy đơn hàng
    const cancelOrder = async (orderId) => {
        // Hiển thị hộp thoại xác nhận
        confirmAlert({
            title: 'Xác nhận hủy đơn hàng',
            message: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            // Gọi API hủy đơn hàng
                            const response = await axiosClient.put(`${BASE_URL}/api/orders/cancel/${orderId}`);
                            toast.success(response.data); // Hiển thị thông báo thành công
                            loadPendingOrders(); // Cập nhật lại danh sách đơn hàng
                        } catch (error) {
                            console.error('Error canceling order:', error);
                            toast.error("Lỗi khi hủy đơn hàng. Vui lòng thử lại sau.");
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => toast.info("Hành động hủy đã bị hủy.")
                }
            ]
        });
    };

    useEffect(() => {
        loadPendingOrders(); // Lấy danh sách đơn hàng khi component được render
    }, []);

    return (
        <div className="user-pending-orders">
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
                                            Hủy đơn hàng
                                        </Button>
                                    </>
                                )}
                                {(order.status === 'CONFIRMED' || order.status === 'CANCELLED') && (
                                    <span>Đơn hàng đã được xử lý.</span>
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
