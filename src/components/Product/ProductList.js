import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Carousel } from 'antd';
import { BASE_URL } from '../../utils/apiURL';
import './ProductList.scss';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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

    // Sắp xếp sản phẩm ngẫu nhiên
    const randomizeProducts = (products) => {
        return products.sort(() => Math.random() - 0.5);
    };

    const randomizedProducts = randomizeProducts([...products]); // Tạo một bản sao của mảng và sắp xếp ngẫu nhiên

    const handleProductClick = (productId) => {
        window.location.href = `/product/${productId}`; // Redirect to ProductDetailPage
    };

    return (
        <div>
            <Row className="g-4 justify-content-center">
                {randomizedProducts.length > 0 ? (
                    randomizedProducts.map((product) => (
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
                                    {/* Sửa giá thành VND */}
                                    <Card.Text className="price">{product.price ? `${product.price.toLocaleString()} VND` : 'N/A'}</Card.Text>
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
    