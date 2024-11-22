import React, { useState, useEffect } from 'react';
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, ListGroup, Spinner, Badge, DropdownButton, Dropdown } from 'react-bootstrap';
import { BASE_URL } from '../../utils/apiURL';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const SellerOrders = ({ sellerId }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const sellerId = localStorage.getItem("userId");
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    toast.error('Token is invalid or expired!', { position: "top-center" });
                    return;
                }

                const response = await axiosClient.get(`${BASE_URL}/api/orders/seller/${sellerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
                setFilteredOrders(response.data); // Hiển thị tất cả đơn hàng ban đầu
            } catch (error) {
                setError(error.response?.data || 'Error when taking order!');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [sellerId]);

    useEffect(() => {
        // Lọc đơn hàng theo trạng thái
        if (filterStatus === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status.toLowerCase() === filterStatus));
        }
    }, [orders, filterStatus]);

    const formatDate = (date) => {
        if (!date) return "Không xác định";
        try {
            return new Date(date).toLocaleDateString('vi-VN');
        } catch {
            return "Undefined";
        }
    };

    const formatPrice = (price) => {
        if (isNaN(price) || price === null || price === undefined) return "0 VND";
        return `${price.toLocaleString('vi-VN')} VND`;
    };

    const getStatusLabel = (status) => {
        if (!status) return { label: "Undefined", color: "secondary" };
        switch (status.toLowerCase()) {
            case 'success':
                return { label: 'Completed', color: 'success' };
            case 'cancel':
                return { label: 'Cancelled', color: 'danger' };
            case 'pending':
                return { label: 'Pending', color: 'warning' };
            default:
                return { label: "Undefined", color: "secondary" };
        }
    };

    // Hàm lọc đơn hàng theo trạng thái
    const handleFilterChange = (status) => {
        setFilterStatus(status);
        if (status === 'all') {
            setFilteredOrders(orders); // Hiển thị tất cả đơn hàng
        } else {
            const filtered = orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
            setFilteredOrders(filtered); // Lọc theo trạng thái
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Container className="my-5">
                <h2 className="text-center mb-4">Đơn Hàng Của Seller</h2>

                <div className="mb-4 d-flex justify-content-end">
                        <DropdownButton
                            id="dropdown-basic-button"
                            title="Lọc theo trạng thái"
                            onSelect={handleFilterChange}  // Sử dụng handleFilterChange để thay đổi trạng thái lọc
                        >
                            <Dropdown.Item eventKey="all">Tất cả</Dropdown.Item>
                            <Dropdown.Item eventKey="success">Đơn hàng thành công</Dropdown.Item>
                            <Dropdown.Item eventKey="pending">Đơn hàng chờ xác nhận</Dropdown.Item>
                            <Dropdown.Item eventKey="cancel">Đơn hàng đã hủy</Dropdown.Item>
                        </DropdownButton>
                </div>

                {filteredOrders.length === 0 ? (
                    <p className="text-center text-muted">Không tìm thấy đơn hàng nào.</p>
                ) : (
                    filteredOrders.map((order) => {
                        const { label, color } = getStatusLabel(order.status);
                        return (
                            <Card key={order.id} className="mb-4 shadow-sm rounded-lg border-0">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col md={6}>
                                            <h5 className="mb-2">Order code: <strong>{order.id || "Undefined"}</strong></h5>
                                            <p className="text-muted">
                                                <strong>Date created:</strong> {formatDate(order.orderDate)}
                                            </p>
                                        </Col>
                                        <Col md={6} className="text-md-end">
                                            <Badge pill bg={color}>
                                                {label}
                                            </Badge>
                                        </Col>
                                    </Row>

                                    <ListGroup variant="flush" className="my-3">
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            order.orderItems.map((item) => (
                                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center border-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={`${BASE_URL}${item.imageUrl}`}
                                                            alt={item.productName}
                                                            width="70"
                                                            height="70"
                                                            className="object-fit-cover border rounded me-3"
                                                        />
                                                        <div>
                                                            <h6 className="mb-1">{item.productName || "Undefined"}</h6>
                                                            <small>Number: {item.quantity || 0}</small>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <small className="text-danger">{formatPrice(item.price)}</small>
                                                    </div>
                                                </ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item className="text-muted">Product not found</ListGroup.Item>
                                        )}
                                    </ListGroup>

                                    <Row>
                                        <Col>
                                            <h5 className="text-end">
                                                Tổng cộng: <span className="text-danger">{formatPrice(order.totalAmount)}</span>
                                            </h5>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        );
                    })
                )}
            </Container>
        </div>
    );
};

export default SellerOrders;
