import React, { useEffect, useState } from 'react';
import { Form, Spinner, Alert } from 'react-bootstrap';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from "../../utils/apiURL";

const CategoryDropdown = ({ category, setCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/categories`);
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories:", err.response?.data || err.message);
                setError("Failed to load categories. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>

            {/* Show loading spinner while fetching data */}
            {loading && <Spinner animation="border" size="sm" />}

            {/* Show error message if fetching categories fails */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Show a message when no categories are available */}
            {categories.length === 0 && !loading && !error && (
                <Alert variant="info">No categories available. Please add some categories first.</Alert>
            )}

            {/* Show dropdown if categories are loaded successfully */}
            {!loading && !error && categories.length > 0 && (
                <Form.Select
                    value={category || ''}
                    onChange={(e) => setCategory(e.target.value)} // Set the category name
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </Form.Select>
            )}
        </Form.Group>
    );
};

export default CategoryDropdown;
