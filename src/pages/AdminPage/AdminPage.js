import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { Table, Button, Container, Spinner, Alert, Row, Col, Card, Form } from "react-bootstrap";
import { BASE_URL } from "../../utils/apiURL";

const AdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/employees`, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                alert("Failed to fetch employee data.");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleCreateEmployee = () => navigate("/create-employee");

    const handleResetPassword = async (id) => {
        try {
            await axios.put(`${BASE_URL}/api/admin/employees/${id}/reset-password`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            alert("Password reset successfully!");
        } catch (error) {
            console.error("Error resetting password:", error);
            alert("Failed to reset password.");
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await axios.delete(`${BASE_URL}/api/admin/employees/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            alert("Employee deleted successfully!");
            setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Failed to delete employee.");
        }
    };

    const handleEditEmployee = (id) => {
        navigate(`/edit-employee/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/admin/employees/search?query=${searchTerm}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error("Error searching employees:", error);
            alert("Failed to search employees.");
        } finally {
            setLoading(false);
        }
    };

    const renderEmployees = () => {
        if (employees.length === 0) {
            return (
                <tr>
                    <td colSpan="9">
                        <Alert variant="warning">No employees found.</Alert>
                    </td>
                </tr>
            );
        }

        return employees.map((employee) => (
            <tr key={employee.id}>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.phone}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td className="d-flex justify-content-around">
                    <Button variant="warning" size="sm" onClick={() => handleResetPassword(employee.id)}>
                        Reset Password
                    </Button>
                    <Button variant="info" size="sm" className="mx-2" onClick={() => handleEditEmployee(employee.id)}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                        Delete
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
        <Container fluid className="mt-5">
            <Row className="mb-4">
                <Col md={8} className="d-flex justify-content-between align-items-center">
                    <h1>Admin Page - Employee List</h1>
                </Col>
                <Col md={4} className="d-flex justify-content-end">
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search by name or username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={2}>
                    <Button variant="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
                <Col className="d-flex justify-content-end mb-3">
                    <Button variant="primary" onClick={handleCreateEmployee} className="mt-2">
                        Create New Employee
                    </Button>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary"/>
                    <p>Loading...</p>
                </div>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Salary</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>{renderEmployees()}</tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            <div className="text-center mt-2">
                <Link to="/" className="text-decoration-none">&larr; Back to Homepage</Link>
            </div>

        </Container>
    );
};

export default AdminPage;
