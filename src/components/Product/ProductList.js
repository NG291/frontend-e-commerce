// src/components/ProductList/ProductList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Carousel } from 'antd';
import { BASE_URL } from '../../utils/apiURL';

const ProductList = ({ products, loading, error }) => {
    const onChange = (currentSlide) => {
        console.log(currentSlide);
    };

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

    return (
        <Row  className="g-0">
            {products.length > 0 ? (
                products.map((product) => (
                    <Col md={3} key={product.id} className="mb-4">
                        <Card className="product-card">
                            {product.images && product.images.length > 0 ? (
                                <Carousel afterChange={onChange}>
                                    {product.images.map((image, index) => (
                                        <Card.Img
                                            key={index}
                                            variant="top"
                                            src={`${BASE_URL}/images/${image.fileName}`}
                                            alt={product.name}
                                            style={{ marginBottom: '10px', maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                    ))}
                                </Carousel>
                            ) : (
                                <Card.Img variant="top" src="/path/to/default-image.jpg" alt="Default image" />
                            )}
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text className="text-muted">${product.price || 'Price not available'}</Card.Text>
                                <Link to={`/product/${product.id}`}>
                                    <Button variant="primary">View Product</Button>
                                </Link>
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
