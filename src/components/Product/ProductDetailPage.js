import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { Card, Spinner, Row, Col, Container } from 'react-bootstrap';
import { Carousel } from 'antd';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './ProductDetailPage.scss';
import AddToCartButton from "../Cart/AddToCartButton";
import SellerProductList from "./SellerProductList"; // Import SellerProductList

const ProductDetailPage = () => {
    const { id } = useParams(); // Get product ID from URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Manage the main image
    const [sellerId, setSellerId] = useState(null); // State to store the seller's ID

    // Fetch product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/view/${id}`);
                setProduct(response.data);
                setSellerId(response.data.sellerId); // Set the seller ID
                setCurrentImageIndex(0); // Set the first image as the main image
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false); // Finish loading
            }
        };

        fetchProduct();
    }, [id]); // Refetch if product ID changes

    // If loading or product not found
    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
            </div>
        );
    }

    if (!product) {
        return <p className="text-center">Product not found!</p>;
    }

    return (
        <>
            <Header />
            <div className="product-detail-page">
                <div className="container product-detail-container">
                    <Row>
                        <Col md={6}>
                            <div className="product-image-container">
                                <Carousel
                                    autoplay
                                    selectedIndex={currentImageIndex}
                                    afterChange={setCurrentImageIndex}
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

                                <div
                                    className="product-thumbnails-scrollable"
                                    onWheel={(e) => {
                                        const container = e.currentTarget;
                                        container.scrollLeft += e.deltaY;
                                    }}
                                >
                                    <div className="product-thumbnails">
                                        {product.images.map((image, index) => (
                                            <div key={index}
                                                 className={`product-thumbnail-col ${currentImageIndex === index ? 'active' : ''}`}>
                                                <img
                                                    src={`${BASE_URL}/images/${image.fileName}`}
                                                    alt={`thumbnail-${index}`}
                                                    className="product-thumbnail"
                                                    onClick={() => setCurrentImageIndex(index)} // Set image index on click
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </Col>

                        <Col md={6}>
                            <Card className="product-detail-card">
                                <Card.Body>
                                    <Card.Title className="product-title">{product.name}</Card.Title>

                                    <div className="product-description">
                                        <strong>Description:</strong>
                                        <p>{product.description}</p>
                                    </div>

                                    <div className="product-price">
                                        <strong>Price: </strong>
                                        <span className="price">
                                            {product.price.toLocaleString('vi-VN')} VND
                                        </span>
                                    </div>

                                    <div className="add-to-cart-button">
                                        <AddToCartButton productId={product.id} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Display related products from the same seller */}
            <div className="seller-products-section">
                <Container>
                    <h2 className="mb-4">Other Products from the Seller</h2>
                    {sellerId ? (
                        <SellerProductList sellerId={sellerId} />
                    ) : (
                        <p className="text-center">Unable to load seller's products.</p>
                    )}
                </Container>
            </div>

            <Footer />
        </>
    );
};

export default ProductDetailPage;
