// src/components/ProductList/ProductList.js

import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from '../../utils/apiURL';
import ProductDetail from "./ProductDetail";  // Import component Product

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/all`);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
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
                                <ProductDetail product={product} />
                            </Col>
                        ))
                    ) : (
                        <p className="text-center">No products available.</p>
                    )}
                </Row>
            )}
        </div>
    );
};

export default ProductList;
