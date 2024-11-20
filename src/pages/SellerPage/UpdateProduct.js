import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import { Form, Button, Spinner, Row, Col, Image } from 'react-bootstrap';
import CategoryDropdown from "./CategoryDropdown"; // Dropdown chọn danh mục

const UpdateProduct = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`${BASE_URL}/api/products/view/${id}`);
                const product = response.data;
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setQuantity(product.quantity);
                setCategory(product.category ? product.category.name : '');
                setImages(product.images || []);
            } catch (error) {
                toast.error("Error fetching product data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleImageChange = (e) => {
        const files = e.target.files;
        setImages(files);

        // Generate image previews
        const previews = Array.from(files).map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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

            toast.success('Product updated successfully!');
            setTimeout(() => navigate('/seller-page'), 2000); // Chuyển trang sau khi cập nhật thành công
        } catch (error) {
            toast.error('Failed to update product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-product-page">
            <ToastContainer />
            <div className="container">
                <h2 className="text-center mb-4">Update Product</h2>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formQuantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <CategoryDropdown category={category} setCategory={setCategory} />
                        </Col>
                    </Row>

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

                    <Form.Group className="mb-3" controlId="formImages">
                        <Form.Label>Images</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>

                    <div className="mb-3 d-flex flex-wrap gap-2">
                        {previewImages.map((src, index) => (
                            <Image key={index} src={src} thumbnail style={{ maxWidth: "100px", maxHeight: "100px" }} />
                        ))}
                    </div>

                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Update Product'}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default UpdateProduct;
