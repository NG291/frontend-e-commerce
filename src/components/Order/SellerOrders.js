import React, { useState, useEffect } from 'react';
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { BASE_URL } from '../../utils/apiURL';
import Header from "../Header/Header";
import Footer from "../Footer/Footer"; // Giả sử BASE_URL là URL gốc của bạn

const SellerOrders = ({ sellerId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const sellerId = localStorage.getItem("userId");
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    toast.error('Token không hợp lệ hoặc đã hết hạn', { position: "top-center" });
                    return;
                }

                const response = await axiosClient.get(`${BASE_URL}/api/orders/seller/${sellerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                setError(error.response?.data || 'Lỗi khi lấy đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [sellerId]);

    const formatDate = (date) => {
        if (!date) return "Không xác định";
        try {
            if (Array.isArray(date)) {
                const formattedDate = new Date(
                    date[0],
                    date[1] - 1,
                    date[2],
                    date[3] || 0,
                    date[4] || 0,
                    date[5] || 0,
                    date[6] || 0
                );
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return formattedDate.toLocaleDateString('vi-VN', options);
            }
            return new Date(date).toLocaleDateString('vi-VN');
        } catch {
            return "Không xác định";
        }
    };
    const formatPrice = (price) => {
        if (isNaN(price) || price === null || price === undefined) return "0 VND";
        return `${price.toLocaleString('vi-VN')} VND`;  // Định dạng giá
    };

    const getStatusLabel = (status) => {
        if (!status) return { label: "Không xác định", color: "secondary" };
        switch (status.toLowerCase()) {
            case 'success':
                return { label: 'Đã hoàn thành', color: 'success' };
            case 'cancel':
                return { label: 'Đã hủy', color: 'danger' };
            case 'pending':
                return { label: 'Chờ xử lý', color: 'warning' };
            default:
                return { label: "Không xác định", color: "secondary" };
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p>Đang tải...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <div className="alert alert-danger" role="alert">
                    Lỗi: {error}
                </div>
            </Container>
        );
    }

    return (
        <div>
            <Header />
            <Container className="my-5">
                <h2 className="text-center mb-4">Đơn Hàng Của Seller</h2>
                {orders.length === 0 ? (
                    <p className="text-center text-muted">Không tìm thấy đơn hàng nào.</p>
                ) : (
                    orders.map((order) => {
                        const { label, color } = getStatusLabel(order.status);
                        return (
                            <Card key={order.id} className="mb-4 shadow-sm rounded-lg border-0">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col md={6}>
                                            <h5 className="mb-2">Mã đơn: <strong>{order.id || "Không xác định"}</strong></h5>
                                            <p className="text-muted">
                                                <strong>Ngày tạo:</strong> {formatDate(order.orderDate)}
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
                                                            alt="Ảnh sản phẩm"
                                                            width="70"
                                                            height="70"
                                                            className="me-3"
                                                        />
                                                        <div>
                                                            <h6 className="mb-1">{item.productName || "Không xác định"}</h6>
                                                            <small>Số lượng: {item.quantity || 0}</small>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <small>{formatPrice(item.price)}</small>
                                                    </div>
                                                </ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item className="text-muted">Không có sản phẩm</ListGroup.Item>
                                        )}
                                    </ListGroup>

                                    <Row>
                                        <Col>
                                            <h5 className="text-end">
                                                Tổng cộng: {formatPrice(order.totalAmount)}
                                            </h5>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        );
                    })
                )}
            </Container>
            <Footer />
        </div>
    );
};

export default SellerOrders;
