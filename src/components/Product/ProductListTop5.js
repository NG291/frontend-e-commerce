import React from 'react';
import {Card, Row, Col, Spinner} from 'react-bootstrap';
import {Carousel} from 'antd';
import {BASE_URL} from '../../utils/apiURL';
import './ProductList.scss';

const ProductListTop5 = ({products, loading, error}) => {
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

    const handleProductClick = (productId) => {
        window.location.href = `/product/${productId}`;
    };

    return (
        <div>
            <Row className="g-4 justify-content-center">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <Col
                            lg={2}
                            md={4}
                            sm={6}
                            xs={12}
                            key={product.id}
                            className="mb-4"
                        >
                            <Card
                                className="product-card"
                                onClick={() => handleProductClick(product.id)}
                            >
                                {/* Hiển thị carousel nếu có ảnh, nếu không thì hiển thị ảnh mặc định */}
                                {product.images && product.images.length > 0 ? (
                                    <div className="carousel">
                                        <Carousel autoplay={false}>
                                            {product.images.map((image, index) => (
                                                <Card.Img
                                                    key={index}
                                                    variant="top"
                                                    src={`${BASE_URL}/images/${image.fileName}`}
                                                    alt={product.name}
                                                />
                                            ))}
                                        </Carousel>
                                    </div>
                                ) : (
                                    <Card.Img
                                        variant="top"
                                        src="/path/to/default-image.jpg"
                                        alt="Default image"
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title as="h5">{product.name}</Card.Title>
                                    <Card.Text>{product.description || "No description available"}</Card.Text>
                                    <Card.Text className="price">
                                        {product.price?.toLocaleString('vi-VN') || 'N/A'} VND
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
        </div>
    );
};

export default ProductListTop5;
