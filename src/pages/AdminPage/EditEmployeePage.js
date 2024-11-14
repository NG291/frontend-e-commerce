import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { BASE_URL } from "../../utils/apiURL";

const EditEmployeePage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        username: "",
        email: "",
        name: "",
        age: "",
        phone: "",
        address: "",
        salary: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setEmployee(response.data);
            } catch (error) {
                console.error("Error fetching employee:", error);
                setError("Failed to load employee data.");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/admin/employees/${id}`, employee, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            alert("Employee updated successfully!");
            navigate("/admin"); // Redirect back to the Admin page
        } catch (error) {
            console.error("Error updating employee:", error);
            setError("Failed to update employee.");
        }
    };

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
            <h1>Edit Employee</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        value={employee.username}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="age">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter age"
                        name="age"
                        value={employee.age}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone"
                        name="phone"
                        value={employee.phone}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        name="address"
                        value={employee.address}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="salary">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter salary"
                        name="salary"
                        value={employee.salary}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
};

export default EditEmployeePage;
