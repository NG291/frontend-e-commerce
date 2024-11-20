import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../utils/apiURL";

const EditEmployeePage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        username: "",
        email: "",
        name: "",
        age: "",
        phone: "",
        address: "",
        salary: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setInitialValues(response.data);
            } catch (error) {
                toast.error("Failed to load employee data.");
                console.error("Error fetching employee:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required").max(255).matches(/^\S*$/, "No spaces allowed"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        name: Yup.string().required("Name is required").max(255),
        age: Yup.number()
            .required("Age is required")
            .min(18, "Age must be at least 18")
            .max(60, "Age must be at most 60"),
        phone: Yup.string()
            .required("Phone is required")
            .matches(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"),
        address: Yup.string().required("Address is required").max(500),
        salary: Yup.number()
            .required("Salary is required")
            .min(1, "Salary must be greater than 0")
            .max(100000000, "Salary cannot exceed 100,000,000"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                await axios.put(`${BASE_URL}/api/admin/employees/${id}`, values, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                toast.success("Employee updated successfully!", { position: toast.POSITION.TOP_RIGHT });
                setTimeout(() => navigate("/admin"), 2000);
            } catch (error) {
                toast.error("Failed to update employee. Please try again.");
                console.error("Error updating employee:", error);
            }
        },
    });

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="mb-4 text-center">Edit Employee</h1>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Username (non-editable)</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formik.values.username}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.email && formik.touched.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.name && formik.touched.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="age" className="mb-3">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                name="age"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.age && formik.touched.age}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.age}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="phone" className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.phone && formik.touched.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="address" className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.address && formik.touched.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="salary" className="mb-3">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                name="salary"
                                value={formik.values.salary}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={!!formik.errors.salary && formik.touched.salary}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.salary}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate("/admin")}>
                        Back to Admin Page
                    </Button>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default EditEmployeePage;
