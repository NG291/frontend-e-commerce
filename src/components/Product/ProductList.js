import React, { useState } from 'react';
import { Card, Row, Col, Spinner, Pagination } from 'react-bootstrap';
import { Carousel } from 'antd';
import { BASE_URL } from '../../utils/apiURL';
import './ProductList.scss';
import { toast } from "react-toastify";

const ProductList = ({ products, loading, error }) => {
    // Số lượng sản phẩm mỗi trang
    const productsPerPage = 20;

    // Trạng thái trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-danger">
                <p>{error}</p>
            </div>
        );
    }

    const randomizeProducts = (products) => products.sort(() => Math.random() - 0.5);

    const randomizedProducts = randomizeProducts([...products]);

    // Tính toán chỉ số sản phẩm bắt đầu và kết thúc cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = randomizedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleProductClick = (productId) => {
        const userRole = localStorage.getItem('role');

        if (userRole === 'ROLE_SELLER' || userRole === 'ROLE_ADMIN') {
            toast("You are not allowed to view product details.");
        } else {
            window.location.href = `/product/${productId}`;
        }
    };

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Tính toán số trang cần hiển thị
    const totalPages = Math.ceil(randomizedProducts.length / productsPerPage);

    return (
        <div>
            <Row className="g-4 justify-content-start">
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <Col
                            lg={3}
                            md={4}
                            sm={6}
                            xs={12}
                            key={product.id}
                            className="mb-4"
                        >
                            <Card className="product-card" onClick={() => handleProductClick(product.id)}>
                                {/* Hiển thị carousel nếu có ảnh, nếu không thì hiển thị ảnh mặc định */}
                                {product.images && product.images.length > 0 ? (
                                    <div className="carousel">
                                        <Carousel autoplay={false}>
                                            {product.images.map((image, index) => (
                                                <div key={index}>
                                                    <img
                                                        src={`${BASE_URL}/images/${image.fileName}`}
                                                        alt={product.name}
                                                        className="carousel-image"
                                                    />
                                                </div>
                                            ))}
                                        </Carousel>
                                    </div>
                                ) : (
                                    <img
                                        variant="top"
                                        src="/path/to/default-image.jpg"
                                        alt="Default image"
                                        className="product-image"
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title as="h5">{product.name}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text className="price">
                                        {product.price.toLocaleString('vi-VN') || 'N/A'} VND
                                    </Card.Text>
                                    <Card.Text className="number">
                                        Quantity: {product.quantity || 'N/A'}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No products available.</p>
                )}
            </Row>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default ProductList;
