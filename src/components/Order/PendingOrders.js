import React, {useState, useEffect} from 'react';
import {Button, Table, Modal, Form} from 'react-bootstrap'; // Thêm Modal và Form để nhập lý do
import {useNavigate} from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import {BASE_URL} from '../../utils/apiURL';
import {toast} from 'react-toastify';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './customConfirmAlert.css';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const PendingOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false); // Trạng thái hiển thị modal nhập lý do
    const [rejectionReason, setRejectionReason] = useState(''); // Lý do từ chối
    const [currentOrderId, setCurrentOrderId] = useState(null); // Đơn hàng hiện tại
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
                    onClick: () => {
                        if (actionType === "reject") {
                            // Mở modal nhập lý do khi từ chối
                            setCurrentOrderId(orderId);
                            setShowRejectModal(true);
                        } else {
                            // Xử lý Confirm order
                            confirmOrder(orderId);
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

    const confirmOrder = async (orderId) => {
        try {
            const endpoint = `${BASE_URL}/api/orders/success/${orderId}`;
            await axiosClient.put(endpoint);
            fetchPendingOrders();
            toast.success("Order has been confirmed successfully.");
        } catch (error) {
            console.error('Error confirming order:', error);
            toast.error("Error confirming order. Please try again later.");
        }
    };

    const rejectOrder = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please enter a rejection reason.");
            return;
        }

        try {
            const endpoint = `${BASE_URL}/api/orders/reject/${currentOrderId}`;
            await axiosClient.put(endpoint, null, {params: {rejectionReason}});
            fetchPendingOrders();
            setShowRejectModal(false);
            toast.success("The order was successfully rejected.");
        } catch (error) {
            console.error('Error rejecting order:', error);
            toast.error("Error rejecting order. Please try again later.");
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    return (
        <>
            <Header/>
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

                {/* Modal nhập lý do từ chối */}
                <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reject Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="rejectionReason">
                                <Form.Label>Reason for rejection</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter rejection reason..."
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={rejectOrder}>
                            Reject Order
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Footer/>
        </>
    );
};

export default PendingOrders;
