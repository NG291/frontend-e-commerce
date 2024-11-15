import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/apiURL';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import './HomePage.scss';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);  // Kiểm tra role admin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkUserRole = () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));  // Giải mã payload JWT
        const roles = payload.roles || [];
        setIsAdmin(roles.includes("ROLE_ADMIN"));
      }
    };

    fetchProducts();
    checkUserRole();
  }, []);

  return (
      <>
        <Header />
        <Container className="home-page">
          <div className="hero-section text-center my-4">
            <h1>Welcome to E-commerce</h1>
            <p>Find the best products here!</p>
            <Link to="/products">
              <Button variant="primary" size="lg">Shop Now</Button>
            </Link>
          </div>

          {/* Nút AdminPage chỉ hiện khi người dùng là admin */}
          {isAdmin && (
              <div className="text-center mb-4">
                <Button variant="secondary" onClick={() => navigate("/admin")}>Admin Page</Button>
              </div>
          )}

          <h2 className="text-center my-4">Featured Products</h2>
          {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading products...</p>
              </div>
          ) : (
              <Row>
                {products.length > 0 ? (
                    products.map((product) => (
                        <Col md={4} key={product.id} className="mb-4">
                          <Card>
                            <Card.Img variant="top" src={product.image} alt={product.name} />
                            <Card.Body>
                              <Card.Title>{product.name}</Card.Title>
                              <Card.Text>{product.description}</Card.Text>
                              <Card.Text className="text-muted">${product.price}</Card.Text>
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
          )}
        </Container>
        <Footer />
      </>
  );
};

export default HomePage;
