import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();  // Use useNavigate instead of useHistory

    // Fetch list of employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get("/api/admin/employees", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                    },
                });
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Handle Create Employee
    const handleCreateEmployee = () => {
        navigate("/create-employee");  // Use navigate for redirection
    };

    // Handle Reset Password
    const handleResetPassword = async (id) => {
        try {
            await axios.put(`/api/admin/reset-password/${id}`, null, {
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

    // Render Employees
    const renderEmployees = () => {
        if (employees.length === 0) {
            return <p>No employees found.</p>;
        }

        return employees.map((employee) => (
            <tr key={employee.id}>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.phoneNumber}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td>
                    <button onClick={() => handleResetPassword(employee.id)}>Reset Password</button>
                </td>
            </tr>
        ));
    };

    return (
        <div>
            <h1>Admin Page - Employee List</h1>

            {/* Buttons */}
            <div>
                <button onClick={handleCreateEmployee}>Create New Employee</button>
            </div>

            {/* Employee List */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table border="1" style={{ marginTop: "20px" }}>
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
                </table>
            )}
        </div>
    );
};

export default AdminPage;
