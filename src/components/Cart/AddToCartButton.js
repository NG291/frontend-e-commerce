import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import {toast} from "react-toastify";

const AddToCartButton = ({ productId }) => {
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                toast.success("Token not found. Please login.");
                return;
            }

            // Gửi yêu cầu POST để thêm sản phẩm vào giỏ hàng
            const response = await axiosClient.post(
                `${BASE_URL}/api/cart/add/${productId}`,
                null,
                {
                    params: { quantity },
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token trong header
                    },
                }
            );
            toast.success("Add product to cart successfully!");
            return response.data;

        } catch (error) {
            console.error("Error adding to cart:", error);

            if (error.response) {
                toast.error(`Failed to add product to cart: ${error.response.data.message || error.response.statusText}`);
            }

            else if (error.request) {
                toast.error("No response from server. Please try again later.");
            }

            else {
                toast.error(`An error occurred: ${error.message}`);
            }
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control me-2"
                style={{ width: "80px" }}
            />

            <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={addingToCart}
            >
                {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
        </div>
    );
};

export default AddToCartButton;
