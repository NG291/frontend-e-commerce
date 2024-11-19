import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from '../../utils/apiURL';
import './HomePage.scss';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductList from "../../components/Product/ProductList";
import { Button, Container, Modal, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]); // Store the original products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState(0);

    // Fetch products on page load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/all`);
                setProducts(response.data);
                setOriginalProducts(response.data); // Save original products
            } catch (error) {
                setError("Error fetching products.");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Handle the search functionality
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm === '') {
            setProducts(originalProducts); // Reset to original products if search term is empty
        } else {
            const filteredProducts = originalProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setProducts(filteredProducts);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

                <h2 className="text-center my-4">Featured Products</h2>

                {/* Search and Cart button container */}
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <form onSubmit={handleSearch} className="d-flex w-50">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search products..."
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button type="submit" variant="outline-primary" className="ms-2">
                            Search
                        </Button>
                    </form>

                    {/* Cart button next to the search button with square shape */}
                    <Button className="cart-button ms-3 position-relative" variant="outline-primary" onClick={handleShow}>
                        <FaShoppingCart />
                        {cartItems > 0 && (
                            <Badge pill bg="danger" className="cart-badge">
                                {cartItems}
                            </Badge>
                        )}
                    </Button>
                </div>

                <ProductList products={products} loading={loading} error={error} />

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your Cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Replace with dynamic cart items when available */}
                        <p>Your cart is currently empty.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={() => { /* Handle checkout action here */ }}>
                            Proceed to Checkout
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
            <Footer />
        </>
    );
};

export default HomePage;
