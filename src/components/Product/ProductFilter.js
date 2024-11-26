import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axiosClient from "../../utils/axiosClient";
import { BASE_URL } from '../../utils/apiURL';

const ProductFilter = ({ setFilteredProducts, setLoading }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.get(`${BASE_URL}/api/products/filter`, {
                params: {
                    name,
                    category,
                    minPrice,
                    maxPrice,
                    sortOrder
                }
            });
            setFilteredProducts(response.data);
        } catch (error) {
            console.error("Error fetching filtered products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="filter-section">
            <h4>Filter Products</h4>
            <Form onSubmit={handleFilterSubmit}>
                <Row>
                    <Col sm={12} md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {/* Add your categories dynamically here */}
                            <option value="Car">Car</option>
                            <option value="Drink">Drink</option>
                            <option value="Motor">Motor</option>
                        </Form.Control>
                    </Col>
                    <Col sm={12} md={2}>
                        <Form.Control
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </Col>
                    <Col sm={12} md={2}>
                        <Form.Control
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col sm={12} md={4}>
                        <Form.Control
                            as="select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </Form.Control>
                    </Col>
                    <Col sm={12} md={2}>
                        <Button variant="primary" type="submit">Apply Filters</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ProductFilter;
