import React, { useState, useEffect } from 'react';
import { Button, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import './Cart.css'; // Thêm file CSS để tuỳ chỉnh style

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/cart/view`);
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            toast.error("Failed to load cart items. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) {
            toast.warning("Quantity cannot be less than 1.");
            return;
        }

        try {
            await axiosClient.put(`${BASE_URL}/api/cart/update/${productId}`,
                { productId },
                {
                    params: { quantity }, // Params đúng vị trí
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                }
            );
            fetchCartItems();
            toast.success("Cart updated successfully!");
        } catch (error) {
            console.error('Error updating cart item:', error);
            toast.error("Failed to update cart. Please try again later.");
        }
    };

    const removeItemFromCart = async (productId) => {
        try {
            await axiosClient.delete(`${BASE_URL}/api/cart/remove/${productId}`);
            fetchCartItems();
            toast.success("Product removed from cart!"); // Thông báo thành công
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error("Failed to remove item. Please try again later.");
        }
    };

    const calculateTotalAmount = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        const totalAmount = calculateTotalAmount();

        if (totalAmount > 0) {
            navigate('/payment', { state: { totalAmount, paymentMethod } });
        } else {
            toast.warning("Your cart is empty!");
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
            <Header />
            <div className="cart-page">
                <h2 className="cart-title">Shopping Cart</h2>
                {loading ? (
                    <p>Loading cart...</p>
                ) : cartItems.length === 0 ? (
                    <p>Your cart is empty!</p>
                ) : (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.product.id}>
                                    <td>{item.product.name}</td>
                                    <td>VND {item.product.price}</td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        >
                                            -
                                        </Button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <Button
                                            variant="secondary"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        >
                                            +
                                        </Button>
                                    </td>
                                    <td>VND {(item.product.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            onClick={() => removeItemFromCart(item.product.id)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <div className="cart-summary">
                            <h4>Total Amount: VND {calculateTotalAmount().toFixed(2)}</h4>
                        </div>
                        <Row className="payment-section">
                            <Col sm={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Payment method:</Form.Label>
                                    <Form.Control as="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <option value="CREDIT_CARD">Credit Card</option>
                                        <option value="PAYPAL">PayPal</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                                <Button variant="primary" onClick={handleCheckout} block>
                                    Thanh toán
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;
