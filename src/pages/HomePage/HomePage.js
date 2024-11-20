import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axiosClient from "../../utils/axiosClient";
import {BASE_URL} from '../../utils/apiURL';
import './HomePage.scss';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductList from "../../components/Product/ProductList";
import {Button, Container} from "react-bootstrap";
import {FaShoppingCart} from "react-icons/fa";

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

    const handleShow = () => setShow(true);

    return (
        <>
            <Header/>
            <div className="py-3 mb-4 border-bottom"> {/* Search and Cart button container */}
                <div className="container d-flex flex-wrap justify-content-between align-items-center">
                    {/* Logo */}
                    <Link to="/"
                          className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                        <span className="fs-4 fw-bold">E-commerce</span>
                    </Link>

                    {/* Search form and Cart button */}
                    <div className="d-flex align-items-center">
                        <form onSubmit={handleSearch} className="d-flex flex-grow-1" style={{maxWidth: '500px'}}>
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

                        {/* Cart button */}
                        <Button className="ms-4 position-relative" variant="outline-primary" onClick={handleShow}>
                            <Link to="/cart" className="text-decoration-none text-dark">
                                <FaShoppingCart/>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Container className="home-page">
                <div className="hero-section text-center my-4">
                    <h1>Welcome to E-commerce</h1>
                    <p>Find the best products here!</p>
                    <Link to="/products">
                        <Button variant="primary" size="lg">Shop Now</Button>
                    </Link>
                </div>

                <h2 className="text-center my-4">Featured Products</h2>

                <ProductList products={products} loading={loading} error={error}/>

            </Container>
            <Footer/>
        </>
    );
};

export default HomePage;
