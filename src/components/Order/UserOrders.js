import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from "../../utils/apiURL";
import { Container, Row, Col, Card, ListGroup, Spinner, Badge, Image, Dropdown, DropdownButton } from 'react-bootstrap';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // Lọc theo trạng thái
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get(`${BASE_URL}/api/orders/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                setError(error.response?.data || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        // Lọc đơn hàng theo trạng thái
        if (filterStatus === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status.toLowerCase() === filterStatus));
        }
    }, [orders, filterStatus]);


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
            <Header />
            <Container className="my-5">
                <h2 className="text-center mb-4">Your order</h2>
                <Row className="mb-4">
                    <Col>
                        <DropdownButton
                            id="dropdown-basic-button"
                            title="Filter by status"
                            onSelect={(status) => setFilterStatus(status)}
                        >
                            <Dropdown.Item eventKey="all">All</Dropdown.Item>
                            <Dropdown.Item eventKey="success">Completed order</Dropdown.Item>
                            <Dropdown.Item eventKey="pending">Pending order</Dropdown.Item>
                            <Dropdown.Item eventKey="cancel">Cancelled order</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                {filteredOrders.length === 0 ? (
                    <p className="text-center text-muted">Order not found!</p>
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
                                                <strong>Date created:</strong> {order.orderDate}
                                            </p>
                                        </Col>
                                        <Col md={6} className="text-md-end">
                                            <Badge pill bg={color} className="rounded-pill">
                                                {label}
                                            </Badge>
                                        </Col>
                                    </Row>

                                    <ListGroup variant="flush" className="my-3">
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            order.orderItems.map((item) => (
                                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center border-0 py-2 rounded">
                                                    <div className="d-flex align-items-center">
                                                        <Image
                                                            src={`${BASE_URL}${item.imageUrl}`}
                                                            alt={item.productName}
                                                            width="70"
                                                            height="70"
                                                            className="me-3 rounded-circle"
                                                        />
                                                        <div>
                                                            <h6 className="mb-1">{item.productName || "Undefined"}</h6>
                                                            <small>Quantity: {item.quantity || 0}</small>
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <small>{formatPrice(item.price)}</small>
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
                                                Total amount: {formatPrice(order.totalAmount)}
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

export default UserOrders;
