import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import {toast} from "react-toastify";

const AddToCartButton = ({ productId }) => {
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
    const [addingToCart, setAddingToCart] = useState(false); // Trạng thái thêm sản phẩm vào giỏ hàng

    // Hàm xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage
            // Kiểm tra nếu không có token, yêu cầu người dùng đăng nhập
            if (!token) {
                toast.success("Token not found. Please login.");
                return;
            }

            // Gửi yêu cầu POST để thêm sản phẩm vào giỏ hàng
            const response = await axiosClient.post(
                `${BASE_URL}/api/cart/add/${productId}`, // Địa chỉ API để thêm sản phẩm vào giỏ
                null,
                {
                    params: { quantity }, // Gửi số lượng sản phẩm
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token trong header
                    },
                }
            );
            toast.success("Add product to cart successfully!");
            return response.data;

        } catch (error) {
            console.error("Error adding to cart:", error);

            // Xử lý lỗi từ server (khi có phản hồi từ server)
            if (error.response) {
                toast.error(`Failed to add product to cart: ${error.response.data.message || error.response.statusText}`);
            }
            // Xử lý khi không nhận được phản hồi từ server
            else if (error.request) {
                toast.error("No response from server. Please try again later.");
            }
            // Xử lý lỗi khác (có thể là lỗi mạng hoặc lỗi nội bộ)
            else {
                toast.error(`An error occurred: ${error.message}`);
            }
        } finally {
            setAddingToCart(false); // Đặt lại trạng thái sau khi yêu cầu hoàn tất
        }
    };

    return (
        <div className="d-flex align-items-center">
            {/* Input cho số lượng sản phẩm */}
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control me-2"
                style={{ width: "80px" }}
            />
            {/* Nút thêm vào giỏ */}
            <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={addingToCart} // Vô hiệu hóa nút khi đang thêm sản phẩm
            >
                {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
        </div>
    );
};

export default AddToCartButton;
