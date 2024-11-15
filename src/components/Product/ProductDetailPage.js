import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Carousel } from 'antd';
import Header from "../../components/Header/Header"; // Import Header
import Footer from "../../components/Footer/Footer"; // Import Footer
import './ProductDetailPage.scss';

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy ID của sản phẩm từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/view/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return (
        <>
            <Header /> {/* Thêm Header */}
            <div className="product-detail-page">
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading product...</p>
                    </div>
                ) : product ? (
                    <div className="product-detail-page">
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary"/>
                                <p>Loading product...</p>
                            </div>
                        ) : product ? (
                            <div className="container product-detail-container">
                                <Card className="mb-4">
                                    <Carousel>
                                        {product.images.map((image, index) => (
                                            <Card.Img
                                                key={index}
                                                variant="top"
                                                src={`${BASE_URL}/images/${image.fileName}`}
                                                alt={product.name}

                                            />
                                        ))}
                                    </Carousel>
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text>{product.description}</Card.Text>
                                        <Card.Text className="text-muted">${product.price}</Card.Text>
                                        <Button variant="primary">Add to Cart</Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ) : (
                            <p className="text-center">Product not found</p>
                        )}
                    </div>
                ) : (
                    <p className="text-center">Product not found</p>
                )}
            </div>
            <Footer/> {/* Thêm Footer */}
        </>
    );
};

export default ProductDetailPage;
