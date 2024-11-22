import React from 'react';
import {Card, Row, Col, Spinner} from 'react-bootstrap';
import {Carousel} from 'antd';
import {BASE_URL} from '../../utils/apiURL';
import './ProductList.scss';

const ProductList = ({products, loading, error}) => {
    // Hiển thị spinner khi đang tải
    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary"/>
                <p>Loading products...</p>
            </div>
        );
    }

    // Hiển thị thông báo lỗi
    if (error) {
        return (
            <div className="text-center text-danger">
                <p>{error}</p>
            </div>
        );
    }

    // Hàm sắp xếp ngẫu nhiên sản phẩm
    const randomizeProducts = (products) => products.sort(() => Math.random() - 0.5);

    const randomizedProducts = randomizeProducts([...products]);

    // Xử lý khi click vào sản phẩm
    const handleProductClick = (productId) => {
        window.location.href = `/product/${productId}`;
    };

    return (
        <div>
            <Row className="g-4 justify-content-center">
                {randomizedProducts.length > 0 ? (
                    randomizedProducts.map((product) => (
                        <Col
                            lg={3}
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
                                        <Carousel autoplay>
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
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text className="category">
                                        Category: {product.category?.name || 'N/A'}
                                    </Card.Text>
                                    <Card.Text className="price">
                                        {product.price || 'N/A'} VND
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

export default ProductList;
