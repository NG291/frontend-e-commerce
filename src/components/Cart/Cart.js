import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { toast } from 'react-toastify'; // Import toast để hiển thị thông báo

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm lấy thông tin giỏ hàng từ API
    const fetchCartItems = async () => {
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/cart/view`); // Gọi API lấy giỏ hàng
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            toast.error("Failed to load cart items. Please try again later."); // Thông báo lỗi
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

    useEffect(() => {
        fetchCartItems(); // Lấy giỏ hàng khi component được render
    }, []);

    return (
        <div className="cart-page">
            <h2>Shopping Cart</h2>
            {loading ? (
                <p>Loading cart...</p>
            ) : cartItems.length === 0 ? (
                <p>Your cart is empty!</p>
            ) : (
                <>
                    <Table striped bordered hover>
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
                                <td>${item.product.price}</td>
                                <td>
                                    <Button
                                        variant="secondary"
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    >
                                        -
                                    </Button>
                                    <span>{item.quantity}</span>
                                    <Button
                                        variant="secondary"
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </td>
                                <td>${(item.product.price * item.quantity).toFixed(2)}</td>
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
                    <div className="cart-total">
                        <h4>Total Amount: ${calculateTotalAmount().toFixed(2)}</h4>
                    </div>
                    <Button variant="primary" onClick={() => toast.info("Proceeding to checkout...")}>
                        Proceed to Checkout
                    </Button>
                </>
            )}
        </div>
    );
};

export default Cart;
