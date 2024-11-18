
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from '../../utils/apiURL';
import './HomePage.scss';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductList from "../../components/Product/ProductList";
import {Button, Container} from "react-bootstrap";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/all`);
                setProducts(response.data);
            } catch (error) {
                setError("Error fetching products.");
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
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

                <h2 className="text-center my-4">Featured Products</h2>

                <ProductList products={products} loading={loading} error={error} />

            </Container>
            <Footer />
        </>
    );
};

export default HomePage;
