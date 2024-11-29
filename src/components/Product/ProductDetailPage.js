import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spinner, Row, Col, Container } from 'react-bootstrap';
import { Carousel } from 'antd';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './ProductDetailPage.scss';
import AddToCartButton from "../Cart/AddToCartButton";
import SellerProductList from "./SellerProductList";
import AddReviewForm from "../review/AddReviewForm";
import ReactStars from "react-stars/dist/react-stars";
import {BASE_URL} from "../../utils/apiURL";
import axiosClient from "../../utils/axiosClient";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sellerId, setSellerId] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/view/${id}`);
                setProduct(response.data);
                setSellerId(response.data.sellerId);
                setCurrentImageIndex(0);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/reviews/product/${id}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/reviews/product-check/${id}/average`);
            setAverageRating(response.data);
        } catch (error) {
            console.error("Error fetching average rating:", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchReviews();
            fetchAverageRating();
        }
    }, [id]);

    const handleReviewAdded = () => {
        fetchReviews();  // Fetch updated reviews after a new review is added
        fetchAverageRating();  // Fetch updated average rating after a new review is added
    };

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
                                <Carousel autoplay selectedIndex={currentImageIndex} afterChange={setCurrentImageIndex}>
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
                                            <div
                                                key={index}
                                                className={`product-thumbnail-col ${currentImageIndex === index ? 'active' : ''}`}
                                            >
                                                <img
                                                    src={`${BASE_URL}/images/${image.fileName}`}
                                                    alt={`thumbnail-${index}`}
                                                    className="product-thumbnail"
                                                    onClick={() => setCurrentImageIndex(index)}
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
                                        <span className="price">{product.price.toLocaleString('vi-VN')} VND</span>
                                    </div>

                                    {/* Display average rating as stars */}
                                    <div className="product-rating">
                                        <strong>Average Rating:</strong>
                                        <ReactStars
                                            count={5}
                                            value={averageRating}
                                            size={24}
                                            activeColor="#ffd700"
                                            edit={false} // Make it read-only
                                        />
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

            {/* Display reviews */}
            <div className="reviews-section">
                <Container>
                    <h2 className="mb-4">Product Reviews</h2>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <h5>{review.userName}</h5>
                                    <p className="review-date">
                                        {new Date(review.createdAt).toLocaleString('vi-VN', {
                                            weekday: 'long', // 'short' hoặc 'long'
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="review-rating">
                                    <ReactStars
                                        count={5}
                                        value={review.rating}
                                        size={24}
                                        activeColor="#ffd700"
                                        edit={false}
                                    />
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No Reviews Yet.</p>
                    )}
                </Container>
            </div>

            {/* Add Review Form */}
            <div className="add-review-form-section">
                <Container>
                    <AddReviewForm productId={id} userId={1} onReviewAdded={handleReviewAdded} />
                </Container>
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
