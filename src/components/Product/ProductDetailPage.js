import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spinner, Row, Col, Container, Button } from 'react-bootstrap';
import { Carousel } from 'antd';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './ProductDetailPage.scss';
import AddToCartButton from "../Cart/AddToCartButton";
import AddReviewForm from "../review/AddReviewForm";
import ReactStars from "react-stars/dist/react-stars";
import { BASE_URL } from "../../utils/apiURL";
import axiosClient from "../../utils/axiosClient";
import ProductListTop5 from "./ProductListTop5";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sellerId, setSellerId] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [top5Products, setTop5Product] = useState([]);
    const [error, setError] = useState(null);

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

    const fetchProductTop5 = async () => {
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/products/related/${id}`);
            setTop5Product(response.data);
        } catch (error) {
            setError("Error fetching top 5 products from the seller");
            console.error("Error fetching top 5:", error);
        }
    };

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
            fetchProductTop5();
        }
    }, [id]);

    const handleReviewAdded = () => {
        fetchReviews();
        fetchAverageRating();
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
                <Container className="product-detail-container">
                    <Row className="my-5">
                        {/* Product Images */}
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

                        {/* Product Details */}
                        <Col md={6}>
                            <Card className="product-detail-card">
                                <Card.Body>
                                    <Card.Title className="product-title">{product.name}</Card.Title>
                                    <p>{product.description}</p>

                                    <div className="product-price">
                                        <strong>Price: </strong>
                                        <span className="price">{product.price.toLocaleString('vi-VN')} VND</span>
                                    </div>

                                    <div className="product-rating my-3">
                                        <strong>Average Rating:</strong>
                                        <ReactStars
                                            count={5}
                                            value={averageRating}
                                            size={24}
                                            activeColor="#ffd700"
                                            edit={false}
                                        />
                                    </div>

                                    <AddToCartButton productId={product.id} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Top 5 Products */}
                    <Row className="my-5">
                        <Col>
                            <h3>Top Best Selling Products</h3>
                            <ProductListTop5 products={top5Products} error={error} loading={loading} />
                        </Col>
                    </Row>

                    {/* Reviews Section */}
                    <Row className="my-5">
                        <Col>
                            <h3>Product Reviews</h3>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <Card key={review.id} className="review-card mb-3">
                                        <Card.Body>
                                            <h5>{review.userName}</h5>
                                            <p className="review-date">
                                                {new Date(review.createdAt).toLocaleString('vi-VN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                            <ReactStars
                                                count={5}
                                                value={review.rating}
                                                size={24}
                                                activeColor="#ffd700"
                                                edit={false}
                                            />
                                            <p>{review.comment}</p>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <p>No Reviews Yet!</p>
                            )}
                        </Col>
                    </Row>

                    {/* Add Review Form */}
                    <Row className="my-5">
                        <Col>
                            <AddReviewForm productId={id} userId={1} onReviewAdded={handleReviewAdded} />
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetailPage;
