import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import CategoryDropdown from "./CategoryDropdown"; // Dropdown chọn danh mục

const UpdateProduct = () => {
    const { id } = useParams(); // Lấy ID của sản phẩm từ URL
    const [product, setProduct] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState(''); // Chỉ lưu tên category
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/view/${id}`);
                setProduct(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setPrice(response.data.price);
                setQuantity(response.data.quantity);
                setCategory(response.data.category ? response.data.category.name : '');
                setImages(response.data.images || []);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("Error fetching product data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Xử lý form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('category', category);
        Array.from(images).forEach((image) => formData.append('images', image));

        try {
            await axiosClient.put(`${BASE_URL}/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            });

            setSuccess('Product updated successfully!');
            setTimeout(() => navigate('/seller-page'), 2000); // Redirect sau khi thành công
        } catch (error) {
            console.error('Error updating product:', error);
            setError('Failed to update product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-product-page">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading...</p>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : success ? (
                <Alert variant="success">{success}</Alert>
            ) : (
                <div className="container">
                    <h1>Update Product</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Dropdown chọn danh mục */}
                        <CategoryDropdown category={category} setCategory={setCategory} />

                        <Form.Group className="mb-3" controlId="formImages">
                            <Form.Label>Images</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="images/*"
                                onChange={(e) => setImages(e.target.files)}
                            />
                            <div className="mt-2">
                                {images.length > 0 && (
                                    <ul>
                                        {Array.from(images).map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Update Product'}
                        </Button>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default UpdateProduct;
