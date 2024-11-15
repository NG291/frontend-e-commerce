import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Table, Button, Container, Spinner, Alert } from "react-bootstrap";
import { BASE_URL } from "../../utils/apiURL";

const AdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/employees`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
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
            await axios.put(`${BASE_URL}/api/admin/reset-password/${id}`, null, {
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

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
    };

    const renderEmployees = () => {
        if (employees.length === 0) return <Alert variant="warning">No employees found.</Alert>;

        return employees.map((employee) => (
            <tr key={employee.id}>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.phone}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td>
                    <Button variant="warning" size="sm" onClick={() => handleResetPassword(employee.id)}>
                        Reset Password
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Admin Page - Employee List</h1>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
                <Button variant="primary" className="mb-3" onClick={handleCreateEmployee}>
                    Create New Employee
                </Button>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading...</p>
                    </div>
                ) : (
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
                )}
        </Container>
    );
};

export default AdminPage;
