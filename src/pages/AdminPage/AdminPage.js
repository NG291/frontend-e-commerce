import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Table,
    Button,
    Container,
    Spinner,
    Alert,
    Row,
    Col,
    Card,
    Form,
    Pagination,
    DropdownButton,
    Dropdown,
} from "react-bootstrap";
import { BASE_URL } from "../../utils/apiURL";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {toast} from "react-toastify";

const AdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/employees`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                toast("Failed to fetch employee data.");
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
            toast.success("Password reset successfully to 123456@Abc!");
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Failed to reset password.");
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
            toast.success("Employee deleted successfully!");
            setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Failed to delete employee.");
        }
    };

    const handleEditEmployee = (id) => navigate(`/edit-employee/${id}`);

    const filteredEmployees = employees.filter(
        (employee) =>
            (employee.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastEmployee = currentPage * itemsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const renderEmployees = () => {
        if (currentEmployees.length === 0) {
            return (
                <tr>
                    <td colSpan="8">
                        <Alert variant="warning">No employees found.</Alert>
                    </td>
                </tr>
            );
        }

        return currentEmployees.map((employee) => (
            <tr key={employee.id}>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.phone}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td className="d-flex justify-content-center gap-2">
                    <Button variant="warning" size="sm" onClick={() => handleResetPassword(employee.id)}>
                        Reset Pw
                    </Button>
                    <Button variant="info" size="sm" onClick={() => handleEditEmployee(employee.id)}>
                        Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                        Delete
                    </Button>
                </td>
            </tr>
        ));
    };

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredEmployees.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <Pagination>
                {pageNumbers.map((number) => (
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => setCurrentPage(number)}
                    >
                        {number}
                    </Pagination.Item>
                ))}
            </Pagination>
        );
    };

    return (
        <>
            <Header />
            <Container fluid className="mt-5">
                <Row className="mb-4">
                    <Col md={8}>
                        <h1>Admin Page - Employee List</h1>
                    </Col>
                    <Col md={4} className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={() => navigate("/user-seller-list")}>
                            User & Seller List
                        </Button>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Username or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <DropdownButton title={`Items per page: ${itemsPerPage}`} variant="secondary">
                            <Dropdown.Item onClick={() => {
                                setItemsPerPage(5);
                                setCurrentPage(1);
                            }}>5</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setItemsPerPage(10);
                                setCurrentPage(1);
                            }}>10</Dropdown.Item>
                            <Dropdown.Item onClick={() => {
                                setItemsPerPage(15);
                                setCurrentPage(1);
                            }}>15</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col md={4} className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleCreateEmployee}>
                            Create New Employee
                        </Button>
                    </Col>
                </Row>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
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
                            {renderPagination()}
                        </Card.Body>
                    </Card>
                )}

                <div className="text-center mt-2">
                    <Link to="/" className="text-decoration-none text-primary fw-bold">
                        &larr; Back to Homepage
                    </Link>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default AdminPage;
