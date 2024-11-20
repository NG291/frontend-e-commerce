import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../utils/apiURL";
import CategoryDropdown from "./CategoryDropdown";

const AddProduct = () => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            price: "",
            quantity: "",
            category: "",
            images: [],
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("Product name is required")
                .max(255, "Name cannot exceed 255 characters"),
            description: Yup.string()
                .required("Description is required")
                .max(1000, "Description cannot exceed 1000 characters"),
            price: Yup.number()
                .required("Price is required")
                .positive("Price must be greater than 0")
                .max(9999999999, "Price cannot exceed 10 digits"),
            quantity: Yup.number()
                .required("Quantity is required")
                .min(1, "Quantity must be greater than 0")
                .integer("Quantity must be an integer"),
            category: Yup.string().required("Category is required"),
            images: Yup.mixed().required("At least one image is required"),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("quantity", values.quantity);
            formData.append("category", values.category);
            Array.from(values.images).forEach((image) => formData.append("images", image));

            try {
                await axios.post(`${BASE_URL}/api/products/addProduct`, formData, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Product added successfully!", { position: toast.POSITION.TOP_RIGHT });
                setTimeout(() => navigate("/seller-page"), 2000);
            } catch (error) {
                toast.error("Failed to add product. Please try again.", { position: toast.POSITION.TOP_RIGHT });
            }
        },
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        formik.setFieldValue("images", files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    return (
        <Container className="mt-5">
            <h1 className="mb-4 text-center">Add Product</h1>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                {...formik.getFieldProps("name")}
                                isInvalid={!!formik.errors.name && formik.touched.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter product description"
                                {...formik.getFieldProps("description")}
                                isInvalid={!!formik.errors.description && formik.touched.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="price" className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="Enter product price"
                                {...formik.getFieldProps("price")}
                                isInvalid={!!formik.errors.price && formik.touched.price}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.price}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="quantity" className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter product quantity"
                                {...formik.getFieldProps("quantity")}
                                isInvalid={!!formik.errors.quantity && formik.touched.quantity}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.quantity}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <CategoryDropdown
                            category={formik.values.category}
                            setCategory={(value) => formik.setFieldValue("category", value)}
                        />
                        {formik.errors.category && formik.touched.category && (
                            <div className="text-danger">{formik.errors.category}</div>
                        )}

                        <Form.Group controlId="images" className="mb-3">
                            <Form.Label>Upload Images</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                isInvalid={!!formik.errors.images && formik.touched.images}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.images}
                            </Form.Control.Feedback>
                            <Row className="mt-3">
                                {imagePreviews.map((src, idx) => (
                                    <Col xs={4} key={idx} className="mb-3">
                                        <img src={src} alt={`preview-${idx}`} className="img-fluid rounded" />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate("/seller-page")}>
                        Back to Seller Page
                    </Button>
                    <Button variant="primary" type="submit">
                        Add Product
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default AddProduct;
