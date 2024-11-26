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
import {toast} from "react-toastify";
import ProductFilter from "../../components/Product/ProductFilter";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]); // Store the original products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState(0);
    const [isUser, setIsUser] = useState(false); // To check if the logged-in user is a regular user
    const [isSeller, setIsSeller] = useState(false); // To check if the logged-in user is a regular user
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [userId, setUserId] = useState(null);

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

        // Check if the user has ROLE_USER
        const role = localStorage.getItem('role');
        if (role === 'ROLE_USER') {
            setIsUser(true);
        }
        if (role === 'ROLE_SELLER') {
            setIsSeller(true);
        }

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

    const handleRequestSellerRole = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await axiosClient.post(`${BASE_URL}/api/users/request-seller-role`, {username});
            toast.success(response.data); // You can display a success message
        } catch (error) {
            toast.error('Error requesting seller role!');
            console.error(error);
        }
    };

    return (
        <>
            <Header/>
            <div className="py-3 mb-4 border-bottom"> {/* Search and Cart button container */}
                {/* Search and Cart button container */}
                <div className="container d-flex flex-wrap justify-content-between align-items-center">
                    {/* Logo */}
                    <Link to="/"
                          className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                        <span className="fs-4 fw-bold">E-commerce</span>
                    </Link>

                    <div className="d-flex align-items-center justify-content-end flex-grow-1">
                        {/* Show the button only for ROLE_USER */}
                        {isUser && (
                            <Button
                                onClick={handleRequestSellerRole}
                                variant="success"
                                className="me-3" // Add margin to separate from the search box
                            >
                                Request Seller Role
                            </Button>
                        )}

                        {/* Search form */}
                        <form
                            onSubmit={handleSearch}
                            className="d-flex flex-grow-1 justify-content-end"
                            style={{maxWidth: '500px'}}
                        >
                            <input
                                type="search"
                                className="form-control me-2" // Add margin to the right
                                placeholder="Search products..."
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button type="submit" variant="outline-primary">
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            <Container className="home-page">
                <div className="hero-section text-center my-4">
                    <h1>Welcome to E-commerce</h1>
                    <p>Find the best products here!</p>
                </div>

                <h2 className="text-center my-4">Featured Products</h2>

                {/*<ProductFilter setFilteredProducts={setFilteredProducts} setLoading={setLoading} />*/}

                <ProductList products={products} loading={loading} error={error}/>

            </Container>
            <Footer/>
        </>
    );
};

export default HomePage;
