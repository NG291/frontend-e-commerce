import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Carousel } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../utils/apiURL';
import './ProductList.scss';

const SellerProductList = ({ sellerId: userId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchSellerProducts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/products/seller/${userId}`, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching seller products:", err);
                setError("Failed to load seller products.");
            } finally {
                setLoading(false);
            }
        };

        fetchSellerProducts();
    }, [userId]);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading seller's products...</p>
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
        <div>
            <Row className="g-4 justify-content-center">
                {products.length > 0 ? (
                    products.map((product) => (
                        <Col lg={3} md={4} sm={6} xs={12} key={product.id} className="mb-4">
                            <Card className="product-card">
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
                                    <Card.Text className="price">{product.price || 'N/A'} VND</Card.Text>
                                    <Card.Text className="number">Quantity: {product.quantity || 'N/A'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No other products available.</p>
                )}
            </Row>
        </div>
    );
};

export default SellerProductList;
