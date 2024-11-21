import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Carousel } from 'antd';
import Header from "../../components/Header/Header"; // Import Header
import Footer from "../../components/Footer/Footer"; // Import Footer
import './ProductDetailPage.scss';
import AddToCartButton from "../Cart/AddToCartButton"; // Import button Thêm vào giỏ hàng

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Quản lý ảnh chính

    // Fetch sản phẩm từ API khi component mount
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/view/${id}`);
                setProduct(response.data);
                setCurrentImageIndex(0); // Chọn ảnh đầu tiên làm ảnh chính
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false); // Kết thúc việc tải dữ liệu
            }
        };

        fetchProduct();
    }, [id]); // Chạy lại khi ID thay đổi

    // Nếu đang tải dữ liệu hoặc không tìm thấy sản phẩm
    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Đang tải sản phẩm...</p>
            </div>
        );
    }

    if (!product) {
        return <p className="text-center">Không tìm thấy sản phẩm</p>;
    }

    return (
        <>
            <Header /> {/* Hiển thị Header */}
            <div className="product-detail-page">
                <div className="container product-detail-container">
                    <Row>
                        <Col md={6}>
                            <div className="product-image-container">
                                <Carousel
                                    autoplay
                                    selectedIndex={currentImageIndex} // Chọn ảnh chính từ state
                                    afterChange={setCurrentImageIndex} // Cập nhật ảnh chính khi thay đổi
                                >
                                    {product.images.map((image, index) => (
                                        <div key={index}>
                                            <img
                                                src={`${BASE_URL}/images/${image.fileName}`}
                                                alt={product.name}
                                                className="product-image"
                                            />
                                        </div>
                                    ))}
                                </Carousel>

                                {/* Ảnh thu nhỏ */}
                                <div className="product-thumbnails">
                                    {product.images.map((image, index) => (
                                        <div key={index} className="product-thumbnail-col">
                                            <img
                                                src={`${BASE_URL}/images/${image.fileName}`}
                                                alt={`thumbnail-${index}`}
                                                className="product-thumbnail"
                                                onClick={() => setCurrentImageIndex(index)} // Thay đổi ảnh chính khi click vào ảnh thu nhỏ
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>

                        <Col md={6}>
                            <Card className="product-detail-card">
                                <Card.Body>
                                    <Card.Title className="product-title">{product.name}</Card.Title>

                                    <div className="product-description">
                                        <strong>Mô tả:</strong>
                                        <p>{product.description}</p>
                                    </div>

                                    <div className="product-price">
                                        <strong>Giá:</strong>
                                        <span className="price">
                                            {product.price.toLocaleString('vi-VN')} VND
                                        </span>
                                    </div>

                                    <div className={"add-to-cart-button"}>
                                    <AddToCartButton productId={product.id} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetailPage;
