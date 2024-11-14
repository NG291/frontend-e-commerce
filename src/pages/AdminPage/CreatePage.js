import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { BASE_URL } from "../../utils/apiURL";

const CreatePage = () => {
    const [employee, setEmployee] = useState({
        username: "",
        email: "",
        name: "",
        age: "",
        phone: "",
        address: "",
        salary: ""
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/admin/create-employee`, employee, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            alert("Employee created successfully!");
            navigate("/admin");
        } catch (error) {
            console.error("Error creating employee:", error);
            setError("Failed to create employee. Please try again.");
        }
    };

    return (
        <Container className="mt-5">
            <h1>Create New Employee</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={employee.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="number"
                        name="age"
                        value={employee.age}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={employee.phone}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={employee.address}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="salary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="number"
                        name="salary"
                        value={employee.salary}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Create Employee
                </Button>
                <Button variant="secondary" className="mt-3 ms-2" onClick={() => navigate("/admin")}>
                    Cancel
                </Button>
            </Form>
        </Container>
    );
};

export default CreatePage;
