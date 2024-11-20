import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Carousel } from 'antd';
import { BASE_URL } from '../../utils/apiURL';
import AddToCartButton from '../Cart/AddToCartButton'; // Import AddToCartButton
import './ProductList.scss';

const ProductList = ({ products, loading, error }) => {
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
        window.location.href = `/product/${productId}`; // Redirect to ProductDetailPage
    };

    return (
        <Row className="g-4 justify-content-center">
            {products.length > 0 ? (
                products.map((product) => (
                    <Col lg={3} md={4} sm={6} xs={12} key={product.id} className="mb-4">
                        <Card className="product-card" onClick={() => handleProductClick(product.id)}>
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
                                <Card.Img variant="top" src="/path/to/default-image.jpg" alt="Default image" />
                            )}
                            <Card.Body>
                                <Card.Title as="h5">{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text className="price">${product.price || 'N/A'}</Card.Text>
                                <AddToCartButton productId={product.id} /> {/* Add to Cart button */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            ) : (
                <p className="text-center">No products available.</p>
            )}
        </Row>
    );
};

export default ProductList;
